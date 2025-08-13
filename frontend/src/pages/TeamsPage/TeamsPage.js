import React from 'react';
import './TeamsPage.css';

const TeamsPage = () => {
  const teams = [
    { id: 1, name: "Red Bull Racing", base: "Austria", principal: "Christian Horner" },
    { id: 2, name: "Mercedes", base: "Germany", principal: "Toto Wolff" },
    { id: 3, name: "Ferrari", base: "Italy", principal: "Frédéric Vasseur" }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>F1 TEAMS</h1>
      </div>

      <div className="teams-container">
        {teams.map(team => (
          <div className="team-card" key={team.id}>
            <h3>{team.name}</h3>
            <div className="team-details">
              <p><strong>Base:</strong> {team.base}</p>
              <p><strong>Team Principal:</strong> {team.principal}</p>
            </div>
            <div className="team-drivers">
              <span>Driver 1</span>
              <span>Driver 2</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;