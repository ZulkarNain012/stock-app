import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries" },
  { symbol: "TCS", name: "Tata Consultancy Services" },
  { symbol: "INFY", name: "Infosys" },
  { symbol: "HDFCBANK", name: "HDFC Bank" },
  { symbol: "ICICIBANK", name: "ICICI Bank" },
  { symbol: "NIFTY", name: "Nifty 50" },
];

export default function PortfolioChart({ prices }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: STOCKS.map(s => s.symbol),
        datasets: [{
          label: 'Current Price',
          data: STOCKS.map(s => prices[s.symbol] || 0),
          backgroundColor: '#4a90e2',
          borderRadius: 4,
        }]
      },
      options: {
        animation: { duration: 300 },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    }
  }, [prices]);

  return (
    <div style={{ height: '200px', width: '100%', marginTop: '10px' }}>
      <canvas ref={chartRef} aria-label="Portfolio prices chart" />
    </div>
  );
}
