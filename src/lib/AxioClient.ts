import axios from 'axios';

// Buat instance axios
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api', // Sesuaikan baseURL-nya
  timeout: 25000, // ⏳ tambahkan timeout jadi 20 detik (20000 ms)
  withCredentials: true, // untuk mengirim cookie saat menggunakan auth berbasis cookie
});

// Interceptor request (misalnya untuk menambahkan Authorization token)
API.interceptors.request.use(
  (config) => {
    // Kalau kamu pakai token di localStorage:
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor response (opsional, misalnya untuk handle error global)
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Redirect ke login atau handle unauthorized
//       console.warn('Unauthorized. Redirect to login?');
//     }
//     return Promise.reject(error);
//   }
// );

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('custom-auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
