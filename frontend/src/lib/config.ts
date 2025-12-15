const getApiUrl = () => {
  // Check if running in browser
  if (typeof window !== 'undefined') {
    // Try to get from import.meta.env
    const envUrl = (import.meta as any).env?.VITE_API_URL;
    if (envUrl) return envUrl;
  }
  
  console.log(import.meta.env.VITE_API_URL);
}

export const API_URL = getApiUrl();



