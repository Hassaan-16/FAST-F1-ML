import React, { useState, useEffect } from 'react';
import { getUpcomingRaces } from './services/api';
import './App.css';

function App() {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUpcomingRaces();
        setRaces(data.races || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading races...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredRaces = races.filter(race =>
    race.EventName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="App">
      <div className="header-bar">
        <img src={process.env.PUBLIC_URL + '/topleft.png.png'} alt="F1 Logo" className="f1-logo" />
        <h1 className="page-title custom-title">F1 RACE SCHEDULE</h1>
        <div className="search-box">
          <input
            className="search-txt"
            type="text"
            placeholder="Search Races"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="search-btn" type="button">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
      {loading ? (
        <p>Loading races...</p>
      ) : (
        <ul className="race-list">
          {filteredRaces.map(race => (
            <li key={race.EventName}>
              <h2>{race.EventName}</h2>
              <p>Date: {new Date(race.EventDate).toLocaleDateString()}</p>
              <p>Location: {race.Location}</p>
            </li>
          ))}
        </ul>
      )}
      <footer className="footer">
        <p>&copy; 2025 F1 Race Schedule. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;