import { api } from './api';

export const ninoService = {
  // Crear un nuevo niño
  async crearNino(ninoData) {
    try {
      const response = await api.post('/ninos/', ninoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear niño:', error);
      throw error;
    }
  },

  // Obtener todos los niños con filtros opcionales
  async obtenerNinos(filtros = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filtros.skip !== undefined) params.append('skip', filtros.skip);
      if (filtros.limit !== undefined) params.append('limit', filtros.limit);
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.departamento) params.append('departamento', filtros.departamento);
      if (filtros.colegio) params.append('colegio', filtros.colegio);

      const response = await api.get(`/ninos/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener niños:', error);
      throw error;
    }
  },

  // Obtener un niño por ID
  async obtenerNinoPorId(id) {
    try {
      const response = await api.get(`/ninos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener niño:', error);
      throw error;
    }
  },

  // Obtener un niño por carnet
  async obtenerNinoPorCarnet(carnet) {
    try {
      const response = await api.get(`/ninos/carnet/${carnet}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener niño por carnet:', error);
      throw error;
    }
  },

  // Actualizar un niño
  async actualizarNino(id, datos) {
    try {
      const response = await api.put(`/ninos/${id}`, datos);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar niño:', error);
      throw error;
    }
  },

  // Eliminar un niño
  async eliminarNino(id) {
    try {
      const response = await api.delete(`/ninos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar niño:', error);
      throw error;
    }
  },

  // Obtener estadísticas
  async obtenerEstadisticas() {
    try {
      const response = await api.get('/ninos/estadisticas/resumen');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
};
