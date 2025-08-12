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
    <div className="App" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <div className="waves">
        <canvas className="waves-canvas"></canvas>
      </div>
      <header className="main-header" style={{ fontFamily: 'F1 Regular, Arial, sans-serif', padding: '30px 20px' }}>
        <div className="header-left">
          <img src={process.env.PUBLIC_URL + '/topleft.png.png'} alt="F1 Logo" className="f1-logo" />
        </div>
        <nav className="header-nav" style={{ fontFamily: 'F1 Regular, Arial, sans-serif', textTransform: 'uppercase' }}>
          <span className="nav-link" style={{ fontFamily: 'F1 Regular, Arial, sans-serif', textTransform: 'uppercase' }}>Calendar</span>
          <span className="nav-link" style={{ fontFamily: 'F1 Regular, Arial, sans-serif', textTransform: 'uppercase' }}>Standings</span>
          <span className="nav-link" style={{ fontFamily: 'F1 Regular, Arial, sans-serif', textTransform: 'uppercase' }}>Results</span>
          <span className="nav-link" style={{ fontFamily: 'F1 Regular, Arial, sans-serif', textTransform: 'uppercase' }}>Drivers</span>
          <span className="nav-link" style={{ fontFamily: 'F1 Regular, Arial, sans-serif', textTransform: 'uppercase' }}>Teams</span>
        </nav>
        <div className="header-search">
          <div className="search-box">
            <input
              className="search-txt"
              type="text"
              placeholder="Search Races"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ fontFamily: 'F1 Regular, Arial, sans-serif' }}
            />
            <button className="search-btn" type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </header>
      <div style={{ 
        textAlign: 'center', 
        marginTop: '20px',
        fontFamily: 'F1 Regular, Arial, sans-serif',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        F1 RACE SCHEDULE
      </div>
      {/* ...existing code for races and footer... */}
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
      <footer className="footer" style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + '/footer.png'})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'F1 Regular, Arial, sans-serif'
      }}>
        <p style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '10px 20px', borderRadius: '5px' }}>
          &copy; 2025 F1 Race Schedule. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;