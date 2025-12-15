console.log("RAW import.meta.env:", import.meta.env);

export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

console.log("API_URL:", API_URL);