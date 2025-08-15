// StandingsPage.js
import React from 'react';
import './StandingsPage.css';

const StandingsPage = () => {
  const drivers = [
    { pos: 1, name: "Oscar Piastri", nationality: "Australian", team: "McLaren", points: 25 },
    { pos: 2, name: "Lando Norris", nationality: "British", team: "McLaren", points: 18 },
    { pos: 3, name: "Max Verstappen", nationality: "Dutch", team: "Red Bull", points: 15 },
    { pos: 4, name: "George Russell", nationality: "British", team: "Mercedes", points: 12 },
    { pos: 5, name: "Charles Leclerc", nationality: "Monegasque", team: "Ferrari", points: 10 },
    { pos: 6, name: "Lewis Hamilton", nationality: "British", team: "Ferrari", points: 8 },
    { pos: 7, name: "Kimi Antonelli", nationality: "Italian", team: "Mercedes", points: 6 },
    { pos: 8, name: "Alexander Albon", nationality: "Thai", team: "Williams", points: 4 },
    { pos: 9, name: "Nico Hulkenberg", nationality: "German", team: "Kick Sauber", points: 2 },
    { pos: 10, name: "Esteban Ocon", nationality: "French", team: "Haas F1 Team", points: 1 },
    { pos: 11, name: "Fernando Alonso", nationality: "Spanish", team: "Aston Martin", points: 0 },
    { pos: 12, name: "Lance Stroll", nationality: "Canadian", team: "Aston Martin", points: 0 },
    { pos: 13, name: "Isack Hadjar", nationality: "French", team: "Racing Bulls", points: 0 },
    { pos: 14, name: "Pierre Gasly", nationality: "French", team: "Alpine", points: 0 },
    { pos: 15, name: "Liam Lawson", nationality: "New Zealander", team: "Racing Bulls", points: 0 },
    { pos: 16, name: "Carlos Sainz", nationality: "Spanish", team: "Williams", points: 0 },
    { pos: 17, name: "Gabriel Bortoleto", nationality: "Brazilian", team: "Kick Sauber", points: 0 },
    { pos: 18, name: "Yuki Tsunoda", nationality: "Japanese", team: "Red Bull", points: 0 },
    { pos: 19, name: "Oliver Bearman", nationality: "British", team: "Haas F1", points: 0 },
    { pos: 20, name: "Jack Doohan", nationality: "Australian", team: "Alpine", points: 0 }
  ];

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
        }}>F1 STANDINGS</h1>
      </div>

      <table className="standings-table">
        <thead>
          <tr>
            <th>PDS</th>
            <th>DRIVER</th>
            <th>NATIONALITY</th>
            <th>TEAM</th>
            <th>PTS.</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map(driver => (
            <tr key={driver.pos}>
              <td className="position">{driver.pos}</td>
              <td className="driver-name">{driver.name}</td>
              <td className="nationality">{driver.nationality}</td>
              <td className="team-name">{driver.team}</td>
              <td className="points">{driver.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsPage;
