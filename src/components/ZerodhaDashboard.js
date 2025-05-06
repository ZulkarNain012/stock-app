import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PortfolioChart from './PortfolioChart';

// Available stock list
const STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries" },
  { symbol: "TCS", name: "Tata Consultancy Services" },
  { symbol: "INFY", name: "Infosys" },
  { symbol: "HDFCBANK", name: "HDFC Bank" },
  { symbol: "ICICIBANK", name: "ICICI Bank" },
  { symbol: "NIFTY", name: "Nifty 50" },
];

// Price ko randomly change karne ke liye function
function generateMockPrice(base) {
  return +(base + (Math.random() - 0.5) * base * 0.02).toFixed(2);
}

// Hook jo prices ko simulate karta hai real-time jaisa feel dene ke liye
function useMockStockPrices() {
  const [prices, setPrices] = useState(() => {
    const initial = {};
    STOCKS.forEach(s => (initial[s.symbol] = generateMockPrice(1000)));
    return initial;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const updated = { ...prev };
        STOCKS.forEach(s => {
          updated[s.symbol] = generateMockPrice(updated[s.symbol]);
        });
        return updated;
      });
    }, 4000); // har 4 second mein price update
    return () => clearInterval(interval);
  }, []);

  return prices;
}

// Main Dashboard component
export default function ZerodhaDashboard() {
  const prices = useMockStockPrices();
  const [darkMode, setDarkMode] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className={"app zerodha " + (darkMode ? "dark" : "light")} role="main">
      <header>
        <h1>Zerodha Dashboard</h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setDarkMode(d => !d)} aria-label="Toggle Dark/Light Mode">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Motilal dashboard par switch karne ka button */}
          <button onClick={() => navigate("/motilal")} aria-label="Switch to Motilal Dashboard">
            Go to Motilal
          </button>

          <button onClick={handleLogout} aria-label="Logout">
            Logout
          </button>
        </div>
      </header>

      {/* Responsive Section */}
      <section
        style={{
          padding: '1rem',
          margin: 'auto',
          maxWidth: '100%',
          width: '100%',
          overflowX: 'auto',
          color: darkMode ? '#ccc' : '#222',
          marginTop: '10px'
        }}
      >
        <h2>Real-Time Stock Prices</h2>
        <table aria-label="Stock prices table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {STOCKS.map(s => (
              <tr key={s.symbol}>
                <td>{s.symbol}</td>
                <td>{s.name}</td>
                <td>{prices[s.symbol]?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Portfolio Overview</h2>
        <PortfolioChart prices={prices} />
      </section>
    </div>
  );
}
