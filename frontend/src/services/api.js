import axios from 'axios';  
import API_BASE_URL from '../config/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Opcional: Interceptores para añadir el token de autenticación
// Si tu backend de FastAPI requiere tokens JWT en los headers de autorización,
// puedes añadir un interceptor aquí.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // O de donde guardes tu token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Opcional: Interceptor para manejar errores comunes (ej. 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Manejar el caso de no autorizado (ej. redirigir a login, borrar token)
      console.error('Unauthorized, redirecting to login...');
      // Ejemplo: localStorage.removeItem('authToken');
      // Ejemplo: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export default api;