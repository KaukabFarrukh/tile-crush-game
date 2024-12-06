// src/services/api.js
import axios from 'axios';

export const fetchGameData = async () => {
  try {
    const response = await axios.get('https://api.example.com/game-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching game data', error);
  }
};
