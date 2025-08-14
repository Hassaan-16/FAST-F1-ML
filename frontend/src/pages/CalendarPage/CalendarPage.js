import React, { useState, useEffect } from 'react';
import { getFullCalendar } from '../../services/api';
import './CalendarPage.css';

const CalendarPage = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const data = await getFullCalendar();
        setRaces(data.races || data); // Handle both formats
      } catch (err) {
        setError(err.message);
        console.error("Error fetching calendar:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRaces();
  }, []);

  const filteredRaces = races.filter(race =>
    (race.EventName || race.raceName).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Loading calendar...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="calendar-page">
      <div style={{ 
        textAlign: 'center', 
        margin: '20px 0',
        fontFamily: 'F1 Regular, Arial, sans-serif',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        F1 RACE CALENDAR
      </div>

      <div className="search-container" style={{ textAlign: 'center', margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Search races..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: 'none',
            width: '300px',
            fontFamily: 'F1 Regular, Arial, sans-serif'
          }}
        />
      </div>

      <div className="race-grid">
        {filteredRaces.map((race) => (
          <div key={race.round} className="race-card">
            <h2>{race.EventName || race.raceName}</h2>
            <p><strong>Round:</strong> {race.round}</p>
            <p><strong>Date:</strong> {new Date(race.EventDate || race.date).toLocaleDateString()}</p>
            <p><strong>Circuit:</strong> {race.Circuit?.circuitName || race.Location}</p>
            {/* Country tag has been removed from here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarPage;
