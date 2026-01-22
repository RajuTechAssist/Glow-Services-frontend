

// Your Heroku Backend URL (without the trailing slash)
const PROD_URL = "https://glow-services-app-60be38c9e655.herokuapp.com";
const DEV_URL = "http://localhost:8081";

const BASE_URL = import.meta.env.MODE === 'development' ? DEV_URL : PROD_URL;

const config = {
  API_BASE_URL: `${BASE_URL}/api`,
  BASE_URL: BASE_URL
};

export default config;