//api.js
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

export const getDrivers = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/drivers/');
    return response.data;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw error;
  }
};

export const getTopTeams = async (limit = 3) => {
  const response = await axios.get(`/api/standings/teams?limit=${limit}`);
  return response.data;
};

export const getTeams = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/teams/');
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
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



export const getSchedule = (year = null) => 
  API.get(`schedule/${year ? year + '/' : ''}`);

export const getSessionResults = (year, event, session) => 
  API.get(`results/${year}/${event}/${session}/`);

export const getDriverStandings = (year = null) => 
  API.get(`standings/drivers/${year ? year + '/' : ''}`);

export const getConstructorStandings = (year = null) => 
  API.get(`standings/constructors/${year ? year + '/' : ''}`);

export const getLapTimes = (year, event, session, driver = null) => 
  API.get(`laps/${year}/${event}/${session}/${driver ? driver + '/' : ''}`);



const handleError = (error) => {
  if (error.response) {
    console.error('API Error:', error.response.data);
    throw new Error(error.response.data.message || 'API Error'); // Proper Error object
  } else {
    console.error('Network Error:', error.message);
    throw new Error('Network Error'); // Proper Error object
  }
};

// Standings API
export const fetchStandings = async (type = 'drivers', year = null) => {
  try {
    const url = `standings/${type}/${year ? `${year}/` : ''}`;
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Lap Times API
export const fetchLapTimes = async (year, event, session, driver = null) => {
  try {
    const url = `laps/${year}/${event}/${session}/${driver ? `${driver}/` : ''}`;
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Session Results API
export const fetchSessionResults = async (year, event, session) => {
  try {
    const response = await API.get(`results/${year}/${event}/${session}/`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Event Schedule API
export const fetchEventSchedule = async (year = null) => {
  try {
    const url = `schedule/${year ? `${year}/` : ''}`;
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};