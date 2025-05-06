import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PortfolioChart from './PortfolioChart';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries' },
  { symbol: 'TCS', name: 'Tata Consultancy Services' },
  { symbol: 'INFY', name: 'Infosys' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank' },
  { symbol: 'NIFTY', name: 'Nifty 50' },
];

function generateMockPrice(base) {
  return +(base + (Math.random() - 0.5) * base * 0.02).toFixed(2);
}

function useMockStockPrices() {
  const [prices, setPrices] = useState(() => {
    const initial = {};
    STOCKS.forEach((s) => (initial[s.symbol] = generateMockPrice(1000)));
    return initial;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) => {
        const updated = { ...prev };
        STOCKS.forEach((s) => {
          updated[s.symbol] = generateMockPrice(updated[s.symbol]);
        });
        return updated;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return prices;
}

export default function MotilalDashboard() {
  const prices = useMockStockPrices();
  const { logout, user } = useAuth();
  const [researchReports, setResearchReports] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleZerodhaSwitch = () => {
    navigate('/zerodha');
  };

  const newsItems = [
    { id: 1, title: 'Market rallies after quarterly earnings', date: '2024-06-01' },
    { id: 2, title: 'Tech stocks gain momentum', date: '2024-06-02' },
    { id: 3, title: 'Global cues affect Indian markets', date: '2024-06-03' },
  ];

  const portfolioHoldings = {
    RELIANCE: 20,
    TCS: 15,
    INFY: 30,
    HDFCBANK: 25,
    ICICIBANK: 50,
    NIFTY: 10,
  };

  const portfolioValue = Object.entries(portfolioHoldings).reduce((acc, [sym, qty]) => {
    return acc + (prices[sym] || 0) * qty;
  }, 0);

  const isAdmin = user?.email?.toLowerCase().includes('admin');

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);

    try {
      const storageRef = ref(storage, `research_reports/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setResearchReports((prev) => [...prev, { name: file.name, url, uploadedAt: new Date().toISOString() }]);
      fileInputRef.current.value = '';
    } catch (err) {
      setUploadError('Failed to upload report: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="app motilal" role="main">
      <header>
        <h1>Motilal Oswal Dashboard</h1>
        <div>
          <button onClick={handleLogout} aria-label="Logout">
            Logout
          </button>
          <button onClick={handleZerodhaSwitch} aria-label="Go to Zerodha" style={{ marginLeft: '10px' }}>
            Go to Zerodha
          </button>
        </div>
      </header>
      <div className="content" tabIndex="0">
        <div className="segments">
          <section className="segment" aria-label="Latest News">
            <h2>Latest News</h2>
            {newsItems.map((n) => (
              <div key={n.id} className="research-item">
                <strong>{n.title}</strong>
                <div style={{ fontSize: '0.8em', color: '#555' }}>{n.date}</div>
              </div>
            ))}
          </section>

          <section className="segment" aria-label="Research Reports">
            <h2>Research Reports</h2>
            {researchReports.length === 0 && <em>No reports uploaded yet.</em>}
            <ul>
              {researchReports.map((r, i) => (
                <li key={i}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer">
                    {r.name}
                  </a>{' '}
                  <small>({new Date(r.uploadedAt).toLocaleString()})</small>
                </li>
              ))}
            </ul>
            {isAdmin && (
              <>
                <label htmlFor="upload-report">
                  <strong>Admin Upload New Report</strong>
                </label>
                <input
                  type="file"
                  id="upload-report"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  disabled={uploading}
                  aria-label="Upload Research Report"
                />
                {uploading && <div>Uploading...</div>}
                {uploadError && <div className="error">{uploadError}</div>}
              </>
            )}
          </section>

          <section className="segment" aria-label="Portfolio Overview">
            <h2>Portfolio Overview</h2>
            <p>
              <strong>Total Value:</strong> ₹{portfolioValue.toFixed(2)}
            </p>
            <PortfolioChart prices={prices} />
            <table aria-label="Portfolio details">
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Qty</th>
                  <th>Price (₹)</th>
                  <th>Value (₹)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(portfolioHoldings).map(([sym, qty]) => (
                  <tr key={sym}>
                    <td>{sym}</td>
                    <td>{qty}</td>
                    <td>{prices[sym]?.toFixed(2)}</td>
                    <td>{((prices[sym] || 0) * qty).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
}
