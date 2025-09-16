// src/KeepAlive.js
import { useEffect } from 'react';
import axios from 'axios';

const KeepAlive = () => {
  useEffect(() => {
    const url = 'https://glow-services.onrender.com'; 
    const interval = 30000; // 30 seconds

    const reloadWebsite = () => {
      axios.get(url)
        .then((response) => {
          console.log("Backend awakened");
        })
        .catch((error) => {
          console.error("Ping error:", error.message);
        });
    };

    // ping immediately and then at intervals
    reloadWebsite();
    const intervalId = setInterval(reloadWebsite, interval);

    // cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return null; // this component doesn't render anything
};

export default KeepAlive;
