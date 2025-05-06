import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardSelector() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="app" style={{ padding: '30px', textAlign: 'center' }}>
      <h1>Choose Dashboard</h1>
      <p>Select the style of stock tracking dashboard you prefer:</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            width: '250px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/zerodha')}
          tabIndex="0"
          role="button"
          aria-label="Zerodha style dashboard"
          onKeyDown={e => { if(e.key === 'Enter') navigate('/zerodha'); }}
        >
          <h2>Zerodha Style</h2>
          <p>Minimalist, clean, fast UI with essential data only. Supports dark/light mode.</p>
        </div>
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            width: '250px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/motilal')}
          tabIndex="0"
          role="button"
          aria-label="Motilal Oswal style dashboard"
          onKeyDown={e => { if(e.key === 'Enter') navigate('/motilal'); }}
        >
          <h2>Motilal Oswal Style</h2>
          <p>Comprehensive, information-rich dashboard with news, research reports, and portfolio analysis.</p>
        </div>
      </div>
      <div style={{ marginTop: '30px' }}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
