import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

export const getUpcomingRaces = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/upcoming-races/');
    console.log('API Response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error; // Re-throw to handle in component
  }
  
};

// services/api.js
export const getUpcomingEvents = async () => {
  const response = await axios.get('/api/events/upcoming?limit=5');
  return response.data;
};

export const getTopDrivers = async (limit = 3) => {
  const response = await axios.get(`/api/standings/drivers?limit=${limit}`);
  return response.data;
};

export const getTopTeams = async (limit = 3) => {
  const response = await axios.get(`/api/standings/teams?limit=${limit}`);
  return response.data;
};

export const getFullCalendar = async () => {
  try {
    const response = await API.get('http://localhost:8000/api/full-calendar/');
    console.log('API Response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Calendar API Error:', error.response?.data || error.message);
    throw error;
  }
};