// src/services/userService.js
import api from './api'; // Importa la instancia configurada de Axios

const userService = {
  // Función para obtener todos los usuarios
  getUsers: async () => {
    try {
      const response = await api.get('/users/'); // Aquí solo necesitas la ruta específica, baseURL ya está configurada
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error; // Propaga el error para que el componente lo maneje
    }
  },

  // Función para obtener un usuario por ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      throw error;
    }
  },

  // Función para crear un nuevo usuario (POST)
  createUser: async (userData) => {
    try {
      const response = await api.post('/users/', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Función para actualizar un usuario (PUT)
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${userId}:`, error);
      throw error;
    }
  },

  // Función para eliminar un usuario (DELETE)
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data; // O response.status para verificar si fue exitoso
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      throw error;
    }
  },
};

export default userService;