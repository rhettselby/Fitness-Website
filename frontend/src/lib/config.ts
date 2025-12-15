
export const API_URL = import.meta.env.VITE_API_URL || "https://fitnesswebsitebackend-production.up.railway.app";

console.log("API_URL at build time:", import.meta.env.VITE_API_URL);
console.log("API_URL final value:", API_URL);