// src/config/api.js

// Usa las variables de entorno de Vite para la URL de tu API
// Vite expone las variables de entorno que empiezan con VITE_
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default API_BASE_URL;