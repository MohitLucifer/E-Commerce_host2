// Centralized backend API base URL.
// Reads REACT_APP_API_URL at build time (Create React App inlines this),
// falling back to the current hosted backend when unset. Keeping this in one
// place avoids hardcoding the URL across the app and lets each region/deploy
// point the client at its own backend via configuration.
const API_URL =
  process.env.REACT_APP_API_URL || "https://e-commerce-host2.onrender.com";

export default API_URL;
