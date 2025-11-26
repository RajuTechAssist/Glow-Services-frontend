// src/KeepAlive.js
import config from '../config';


import { useEffect } from 'react';
import axios from 'axios';

const KeepAlive = () => {
  useEffect(() => {
    // Point at the new, existing endpoint
    const url = `${config.API_BASE_URL}/keep-alive`;
    const interval = 30_000; // 30 seconds

    // Ping the backend and log success or error
    const reloadWebsite = async () => {
      try {
        await axios.get(url);
        console.log('Backend awakened');
      } catch (error) {
        console.error('Ping error:', error.message);
      }
    };

    // Immediate ping + interval setup
    reloadWebsite();
    const intervalId = setInterval(reloadWebsite, interval);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  // This component renders nothing
  return null;
};

export default KeepAlive;
