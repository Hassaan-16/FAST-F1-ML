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