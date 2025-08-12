import React, { useState, useEffect } from 'react';
import { getUpcomingRaces } from './services/api';
import './App.css';

function App() {
  useEffect(() => {
    const canvas = document.querySelector('.waves-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function drawWave(amplitude, frequency, phase, color, yOffset) {
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        let y = amplitude * Math.sin((x * frequency + phase)) + yOffset;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    let animationId;
    function animate() {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.002;
      drawWave(30, 0.02, time * 2, '#ed1c24', height * 0.2);
      drawWave(20, 0.018, time * 1.5, '#ff9f1c', height * 0.25);
      drawWave(15, 0.015, time, '#fff', height * 0.3);
      animationId = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
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
      <header className="main-header" style={{ fontFamily: 'F1 Regular, Arial, sans-serif' }}>
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
      <footer className="footer">
        <p>&copy; 2025 F1 Race Schedule. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;