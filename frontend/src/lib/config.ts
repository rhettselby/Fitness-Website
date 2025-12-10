const getApiUrl = () => {
  // Check if running in browser
  if (typeof window !== 'undefined') {
    // Try to get from import.meta.env
    const envUrl = (import.meta as any).env?.VITE_API_URL;
    if (envUrl) return envUrl;
  }
  
  // Fallback to localhost
  return "http://localhost:8000";
};

export const API_URL = getApiUrl();

console.log("API_URL:", API_URL);