import React, { useState, useEffect } from 'react';
import { getTeams } from '../../services/api';
import './TeamsPage.css';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await getTeams();
        if (response.status === 'success') {
          setTeams(response.teams);
        } else {
          setError(response.message || 'Failed to load team data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  if (loading) return <div className="loading">Loading teams...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="teams-page-container">
      <div className="page-header">
        <h1>F1 TEAMS 2024</h1>
      </div>

      <div className="teams-grid">
        {teams.map((team, index) => (
          <div className="team-card" key={index}>
            {/* Team Logo */}
            <div className="team-logo-container">
              <img 
                src={team.logoUrl} 
                alt={`${team.name} logo`}
                className="team-logo"
                onError={(e) => {
                  e.target.src = '/default-logo.png';
                  e.target.onerror = null;
                }}
              />
            </div>
            
            {/* Team Names */}
            <div className="team-names">
              <h3 style={{ color: team.color }}>{team.name}</h3>
              <p className="team-fullname">{team.fullName}</p>
            </div>
            
            {/* Team Car */}
            <div className="team-car-container">
              <img 
                src={team.carUrl} 
                alt={`${team.name} car`}
                className="team-car"
                onError={(e) => {
                  e.target.src = '/default-car.png';
                  e.target.onerror = null;
                }}
              />
            </div>
            
            {/* Drivers - Now displayed side by side */}
            <div className="team-drivers-container">
              {team.drivers.map(([number, name]) => (
                <div key={number} className="driver">
                  <span className="driver-number" style={{ backgroundColor: team.color }}>
                    {number}
                  </span>
                  <span className="driver-name">{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;