import React from 'react';
import './DriversPage.css';

const DriversPage = () => {
  const drivers = [
    { id: 1, name: "Max Verstappen", team: "Red Bull", number: 1 },
    { id: 2, name: "Lewis Hamilton", team: "Mercedes", number: 44 },
    { id: 3, name: "Charles Leclerc", team: "Ferrari", number: 16 }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>F1 DRIVERS</h1>
      </div>

      <div className="drivers-grid">
        {drivers.map(driver => (
          <div className="driver-card" key={driver.id}>
            <div className="driver-number">{driver.number}</div>
            <h3>{driver.name}</h3>
            <p>{driver.team}</p>
            <button className="view-button">View Profile</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriversPage;