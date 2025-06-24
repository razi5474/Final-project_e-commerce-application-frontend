import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL
console.log(baseURL)
export const api = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
}); 
