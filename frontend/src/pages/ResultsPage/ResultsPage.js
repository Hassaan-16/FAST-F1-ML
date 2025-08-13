import React, { useState } from 'react';
import './ResultsPage.css';

const ResultsPage = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  
  const years = [2024, 2023, 2022];
  const sampleRaces = [
    { name: "Bahrain GP", winner: "Max Verstappen", date: "2024-03-02" },
    { name: "Saudi Arabian GP", winner: "Sergio Perez", date: "2024-03-09" }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>F1 RESULTS</h1>
        <div className="year-selector">
          {years.map(year => (
            <button
              key={year}
              className={selectedYear === year ? 'active' : ''}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="results-list">
        {sampleRaces.map((race, index) => (
          <div className="race-card" key={index}>
            <h3>{race.name}</h3>
            <p>Winner: {race.winner}</p>
            <p>Date: {new Date(race.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;