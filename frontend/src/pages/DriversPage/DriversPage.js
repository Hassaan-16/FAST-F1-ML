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
        <h1>F1 DRIVERS {new Date().getFullYear()}</h1>
      </div>

      <div className="drivers-grid">
        {drivers.map(driver => (
          <div className="driver-card" key={driver.id}>
            <div className="driver-number">{driver.number || 'N/A'}</div>
            <h3>{driver.name || 'Unknown Driver'}</h3>
            <p>{driver.team || 'Unknown Team'}</p>
            <div className="driver-meta">
              <span>{driver.country || 'Unknown'}</span>
              <span>{driver.code || ''}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriversPage;