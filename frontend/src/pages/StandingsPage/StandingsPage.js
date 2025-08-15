// StandingsPage.js
import React, { useState, useEffect } from 'react';
import './StandingsPage.css';
import { getDriverStandings, getConstructorStandings } from '../../services/api';

const StandingsPage = () => {
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        
        // Fetch both standings
        const driversResponse = await getDriverStandings();
        const constructorsResponse = await getConstructorStandings();

        console.log('API Responses:', { 
          drivers: driversResponse.data, 
          constructors: constructorsResponse.data 
        });

        // Set standings from API response.data
        if (driversResponse.data?.standings) {
          setDriverStandings(driversResponse.data.standings);
        } else {
          console.warn('Driver standings data missing:', driversResponse);
          setDriverStandings([]);
        }

        if (constructorsResponse.data?.standings) {
          setConstructorStandings(constructorsResponse.data.standings);
        } else {
          console.warn('Constructor standings data missing:', constructorsResponse);
          setConstructorStandings([]);
        }

      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load standings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>F1 STANDINGS</h1>
        </div>
        <p className="loading-message">Loading standings data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>F1 STANDINGS</h1>
        </div>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>F1 STANDINGS</h1>
      </div>

      <div className="standings-section">
        <h2>DRIVERS' CHAMPIONSHIP</h2>
        <table className="standings-table">
          <thead>
            <tr>
              <th>POS</th>
              <th>DRIVER</th>
              <th>CODE</th>
              <th>TEAM</th>
              <th>PTS</th>
            </tr>
          </thead>
          <tbody>
            {driverStandings.length > 0 ? (
              driverStandings.map(driver => (
                <tr key={driver.Position}>
                  <td className="position">{driver.Position}</td>
                  <td className="driver-name">{driver.Driver}</td>
                  <td className="nationality">{driver.Abbreviation}</td>
                  <td className="team-name">{driver.Team}</td>
                  <td className="points">{driver.Points}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No driver standings data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="standings-section">
        <h2>CONSTRUCTORS' CHAMPIONSHIP</h2>
        <table className="standings-table">
          <thead>
            <tr>
              <th>POS</th>
              <th>TEAM</th>
              <th>PTS</th>
            </tr>
          </thead>
          <tbody>
            {constructorStandings.length > 0 ? (
              constructorStandings.map(team => (
                <tr key={team.Position}>
                  <td className="position">{team.Position}</td>
                  <td className="team-name">{team.Team}</td>
                  <td className="points">{team.Points}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  No constructor standings data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandingsPage;