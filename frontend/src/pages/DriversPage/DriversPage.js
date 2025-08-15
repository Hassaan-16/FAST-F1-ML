import React, { useState, useEffect } from 'react';
import { getDrivers } from '../../services/api';
import './DriversPage.css';

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await getDrivers();
        if (response.status === 'success') {
          setDrivers(response.drivers);
        } else {
          setError(response.message || 'Failed to load driver data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  if (loading) return <div className="loading">Loading drivers...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!drivers.length) return <div className="error">No driver data available</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{
          textAlign: 'center',
          margin: '20px 0',
          fontFamily: 'F1 Regular, Arial, sans-serif',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>F1 DRIVERS {new Date().getFullYear()}</h1>
      </div>

      <div className="drivers-grid">
        {drivers.map(driver => (
          <div className="driver-card" key={driver.id}>
            {/* Driver Image */}
            <div className="driver-image-container">
              {driver.headshotUrl ? (
                <img
                  src={driver.headshotUrl}
                  alt={driver.name}
                  className="driver-image"
                  onError={(e) => {
                    e.target.src = '/default-driver.png';
                    e.target.onerror = null;
                  }}
                />
              ) : (
                <div className="driver-number-badge">{driver.number}</div>
              )}
            </div>

            {/* Driver Info */}
            <div className="driver-info">
              <h3>{driver.name}</h3>
              <p className="driver-team">{driver.team}</p>
            </div>

            {/* Driver meta (bottom left + bottom right) */}
            <div className="driver-meta">
              <span className="driver-number">#{driver.number}</span>
              <span className="driver-code">{driver.code}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriversPage;
