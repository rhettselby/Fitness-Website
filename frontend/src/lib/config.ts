export const API_URL = import.meta.env.VITE_API_URL;

console.log("VITE_API_URL:", API_URL);

if (!API_URL) {
  throw new Error("❌ VITE_API_URL is undefined. Check Vercel environment variables.");
}