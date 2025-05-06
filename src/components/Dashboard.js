import React, { useState } from 'react';
import ZerodhaDashboard from './ZerodhaDashboard';
import MotilalDashboard from './MotilalDashboard';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('zerodha'); // default tab

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
        <nav>
          <button
            onClick={() => setActiveTab('zerodha')}
            aria-label="Zerodha Dashboard"
            style={{
              backgroundColor: activeTab === 'zerodha' ? '#007bff' : '#ccc',
              color: activeTab === 'zerodha' ? 'white' : 'black',
              marginRight: '10px',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Zerodha
          </button>
          <button
            onClick={() => setActiveTab('motilal')}
            aria-label="Motilal Dashboard"
            style={{
              backgroundColor: activeTab === 'motilal' ? '#007bff' : '#ccc',
              color: activeTab === 'motilal' ? 'white' : 'black',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Motilal
          </button>
        </nav>
      </header>
      <main>
        {activeTab === 'zerodha' && <ZerodhaDashboard />}
        {activeTab === 'motilal' && <MotilalDashboard />}
      </main>
    </div>
  );
}