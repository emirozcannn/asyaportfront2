
import axios from 'axios';

const backend = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true, // Eğer cookie/token kullanılacaksa
  headers: {
    'Content-Type': 'application/json',
  },
});

export default backend;
