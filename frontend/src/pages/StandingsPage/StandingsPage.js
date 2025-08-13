import React from 'react';
import './StandingsPage.css';

const StandingsPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>F1 STANDINGS</h1>
      </div>
      
      <div className="standings-tabs">
        <div className="tab active">Drivers</div>
        <div className="tab">Teams</div>
      </div>

      <div className="standings-content">
        <div className="standings-table">
          <div className="table-header">
            <span>POS</span>
            <span>DRIVER</span>
            <span>TEAM</span>
            <span>PTS</span>
          </div>
          {/* Sample data - replace with API call */}
          {[1, 2, 3, 4, 5].map((pos) => (
            <div className="table-row" key={pos}>
              <span>{pos}</span>
              <span>Driver {pos}</span>
              <span>Team {pos}</span>
              <span>{100 - pos*10}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StandingsPage;