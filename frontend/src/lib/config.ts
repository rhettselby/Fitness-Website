if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL IS NOT DEFINED AT BUILD TIME");
}

export const API_URL = import.meta.env.VITE_API_URL;