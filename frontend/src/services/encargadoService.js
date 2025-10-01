import { api } from './api';

export const encargadoService = {
  // Crear un nuevo encargado
  async crearEncargado(encargadoData) {
    try {
      const response = await api.post('/encargados/', encargadoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear encargado:', error);
      throw error;
    }
  },

  // Obtener todos los encargados con filtros opcionales
  async obtenerEncargados(filtros = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filtros.skip !== undefined) params.append('skip', filtros.skip);
      if (filtros.limit !== undefined) params.append('limit', filtros.limit);
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.parentesco) params.append('parentesco', filtros.parentesco);
      if (filtros.es_contacto_emergencia !== undefined) params.append('es_contacto_emergencia', filtros.es_contacto_emergencia);

      const response = await api.get(`/encargados/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener encargados:', error);
      throw error;
    }
  },

  // Obtener un encargado por ID
  async obtenerEncargadoPorId(id) {
    try {
      const response = await api.get(`/encargados/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener encargado:', error);
      throw error;
    }
  },

  // Obtener un encargado por CI
  async obtenerEncargadoPorCI(ci) {
    try {
      const response = await api.get(`/encargados/ci/${ci}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener encargado por CI:', error);
      throw error;
    }
  },

  // Actualizar un encargado
  async actualizarEncargado(id, datos) {
    try {
      const response = await api.put(`/encargados/${id}`, datos);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar encargado:', error);
      throw error;
    }
  },

  // Eliminar un encargado
  async eliminarEncargado(id) {
    try {
      const response = await api.delete(`/encargados/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar encargado:', error);
      throw error;
    }
  },

  // Obtener estadísticas
  async obtenerEstadisticas() {
    try {
      const response = await api.get('/encargados/estadisticas/resumen');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
};



