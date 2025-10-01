import { api } from './api';

export const permisoService = {
  // Crear un nuevo permiso
  async crearPermiso(permisoData) {
    try {
      const response = await api.post('/permisos/', permisoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear permiso:', error);
      throw error;
    }
  },

  // Obtener todos los permisos con filtros opcionales
  async obtenerPermisos(filtros = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filtros.skip !== undefined) params.append('skip', filtros.skip);
      if (filtros.limit !== undefined) params.append('limit', filtros.limit);
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.tipo_permiso) params.append('tipo_permiso', filtros.tipo_permiso);
      if (filtros.id_nino) params.append('id_nino', filtros.id_nino);
      if (filtros.id_encargado) params.append('id_encargado', filtros.id_encargado);
      if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
      if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);

      const response = await api.get(`/permisos/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      throw error;
    }
  },

  // Obtener un permiso por ID
  async obtenerPermisoPorId(id) {
    try {
      const response = await api.get(`/permisos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener permiso:', error);
      throw error;
    }
  },

  // Obtener permisos por niño
  async obtenerPermisosPorNino(ninoId) {
    try {
      const response = await api.get(`/permisos/nino/${ninoId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener permisos por niño:', error);
      throw error;
    }
  },

  // Actualizar un permiso
  async actualizarPermiso(id, datos) {
    try {
      const response = await api.put(`/permisos/${id}`, datos);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar permiso:', error);
      throw error;
    }
  },

  // Aprobar/Rechazar un permiso
  async aprobarPermiso(id, aprobacion) {
    try {
      const response = await api.put(`/permisos/${id}/aprobar`, aprobacion);
      return response.data;
    } catch (error) {
      console.error('Error al aprobar permiso:', error);
      throw error;
    }
  },

  // Eliminar un permiso
  async eliminarPermiso(id) {
    try {
      const response = await api.delete(`/permisos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar permiso:', error);
      throw error;
    }
  },

  // Obtener estadísticas
  async obtenerEstadisticas() {
    try {
      const response = await api.get('/permisos/estadisticas/resumen');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
};



