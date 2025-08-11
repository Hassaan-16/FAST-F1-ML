import React, { useState, useEffect } from 'react';
import { getUpcomingRaces } from './services/api';
import './App.css';

function App() {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="App">
      <h1 className="page-title">F1 Race Schedule</h1>
      {loading ? (
        <p>Loading races...</p>
      ) : (
        <ul className="race-list">
          {races.map(race => (
            <li key={race.EventName}>
              <h2>{race.EventName}</h2>
              <p>Date: {new Date(race.EventDate).toLocaleDateString()}</p>
              <p>Location: {race.Location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;