import React, { useState, useEffect } from 'react';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import PasswordModal from '../components/ui/PasswordModal';
import { permisoService } from '../services/permisoService';
import { ninoService } from '../services/ninoService';
import { encargadoService } from '../services/encargadoService';

const PERMISOS_PER_PAGE = 6;

// Datos para el formulario
const tiposPermiso = [
  'Salida Médica', 'Visita Familiar', 'Actividad Deportiva', 
  'Evento Escolar', 'Emergencia', 'Otro'
];

const transportes = [
  'Bus', 'Vehículo propio', 'Transporte público', 
  'Taxi', 'Transporte escolar', 'Otro'
];

const getStatusColor = (estado) => {
  switch (estado) {
    case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
    case 'Aprobado': return 'bg-green-100 text-green-700';
    case 'Rechazado': return 'bg-red-100 text-red-700';
    case 'Expirado': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (estado) => {
  switch (estado) {
    case 'Pendiente': return '⏳';
    case 'Aprobado': return '✅';
    case 'Rechazado': return '❌';
    case 'Expirado': return '⏰';
    default: return '❓';
  }
};

const Permisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [ninos, setNinos] = useState([]);
  const [encargados, setEncargados] = useState([]);
  const [selectedPermiso, setSelectedPermiso] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingPermiso, setPendingPermiso] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAprobacionModal, setShowAprobacionModal] = useState(false);
  const [activeStatusFilters, setActiveStatusFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar permisos desde la API
  const cargarPermisos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await permisoService.obtenerPermisos();
      setPermisos(data);
    } catch (err) {
      console.error('Error al cargar permisos:', err);
      setError('Error al cargar los datos de permisos');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar niños y encargados
  const cargarDatosRelacionados = async () => {
    try {
      const [ninosData, encargadosData] = await Promise.all([
        ninoService.obtenerNinos(),
        encargadoService.obtenerEncargados()
      ]);
      setNinos(ninosData);
      setEncargados(encargadosData);
    } catch (err) {
      console.error('Error al cargar datos relacionados:', err);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarPermisos();
    cargarDatosRelacionados();
  }, []);

  // Estado del formulario de crear permiso
  const [formData, setFormData] = useState({
    id_nino: '',
    id_encargado: '',
    tipo_permiso: '',
    destino: '',
    motivo: '',
    fecha_salida: '',
    hora_salida: '',
    fecha_retorno: '',
    hora_retorno: '',
    transporte: '',
    acompanante: '',
    telefono_contacto: '',
    documentos_adjuntos: ''
  });

  // Estado del formulario de aprobación
  const [aprobacionData, setAprobacionData] = useState({
    estado: 'Aprobado',
    observaciones_aprobacion: '',
    aprobado_por: 'Administrador' // En un sistema real, esto vendría del usuario logueado
  });

  const handleViewDetails = (permiso) => {
    setPendingPermiso(permiso);
    setShowPasswordModal(true);
  };

  const handlePasswordSuccess = () => {
    setSelectedPermiso(pendingPermiso);
    setPendingPermiso(null);
  };

  const closeModal = () => setSelectedPermiso(null);
  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData({
      id_nino: '',
      id_encargado: '',
      tipo_permiso: '',
      destino: '',
      motivo: '',
      fecha_salida: '',
      hora_salida: '',
      fecha_retorno: '',
      hora_retorno: '',
      transporte: '',
      acompanante: '',
      telefono_contacto: '',
      documentos_adjuntos: ''
    });
  };

  const openAprobacionModal = (permiso) => {
    setSelectedPermiso(permiso);
    setShowAprobacionModal(true);
  };

  const closeAprobacionModal = () => {
    setShowAprobacionModal(false);
    setAprobacionData({
      estado: 'Aprobado',
      observaciones_aprobacion: '',
      aprobado_por: 'Administrador'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAprobacionChange = (e) => {
    const { name, value } = e.target;
    setAprobacionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Crear permiso usando la API
      const nuevoPermiso = await permisoService.crearPermiso(formData);
      
      // Agregar a la lista local
      setPermisos(prev => [nuevoPermiso, ...prev]);
      
      // Cerrar modal y limpiar formulario
      closeAddModal();
      
      // Mostrar mensaje de éxito
      alert('Permiso creado exitosamente');
      
    } catch (err) {
      console.error('Error al crear permiso:', err);
      setError('Error al crear el permiso. Verifique los datos ingresados.');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobacion = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Aprobar/rechazar permiso usando la API
      const permisoActualizado = await permisoService.aprobarPermiso(selectedPermiso.id, aprobacionData);
      
      // Actualizar en la lista local
      setPermisos(prev => prev.map(p => p.id === selectedPermiso.id ? permisoActualizado : p));
      
      // Cerrar modal
      closeAprobacionModal();
      
      // Mostrar mensaje de éxito
      alert(`Permiso ${aprobacionData.estado.toLowerCase()} exitosamente`);
      
    } catch (err) {
      console.error('Error al aprobar permiso:', err);
      setError('Error al procesar la aprobación del permiso.');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setActiveStatusFilters([]);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (estado) => {
    setCurrentPage(1);
    setActiveStatusFilters(prev =>
      prev.includes(estado)
        ? prev.filter(f => f !== estado)
        : [...prev, estado]
    );
  };

  const permisosFiltrados = permisos
    .filter(p => activeStatusFilters.length === 0 || activeStatusFilters.includes(p.estado))
    .filter(p => 
      p.nino_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.encargado_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.destino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tipo_permiso?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const indexOfLastPermiso = currentPage * PERMISOS_PER_PAGE;
  const indexOfFirstPermiso = indexOfLastPermiso - PERMISOS_PER_PAGE;
  const currentPermisos = permisosFiltrados.slice(indexOfFirstPermiso, indexOfLastPermiso);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Permisos</h1>
        <p className="text-gray-600 mt-2">
          Administra las solicitudes de permisos de salida de los niños.
        </p>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Protección de Privacidad:</strong> La información sensible solo se muestra después de verificar su identidad.
          </p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Buscar por niño, encargado, destino o tipo..." 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
            className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400" 
          />
          <button 
            onClick={resetFilters} 
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Limpiar Filtros
          </button>
          <button 
            onClick={openAddModal} 
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            + Crear Permiso
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 flex-wrap">
          <span className="font-medium text-gray-600">Filtrar por estado:</span>
          {['Pendiente', 'Aprobado', 'Rechazado', 'Expirado'].map(estado => (
            <label key={estado} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
              <input 
                type="checkbox" 
                checked={activeStatusFilters.includes(estado)} 
                onChange={() => handleStatusFilterChange(estado)} 
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" 
              />
              <span className="text-sm font-medium text-gray-700">{estado}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Indicador de carga */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <span className="ml-3 text-gray-600">Cargando permisos...</span>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={cargarPermisos}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && !error && currentPermisos.map(permiso => (
          <div key={permiso.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-2xl">{getStatusIcon(permiso.estado)}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {permiso.nino_nombre} {permiso.nino_apellido}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(permiso.estado)}`}>
                      {permiso.estado}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Tipo: {permiso.tipo_permiso}</p>
                  <p className="text-sm text-gray-500 mb-1">Destino: {permiso.destino}</p>
                  <p className="text-sm text-gray-500">Encargado: {permiso.encargado_nombre} {permiso.encargado_apellido}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Fecha de Salida:</p>
                  <p className="text-sm font-medium text-gray-700">{permiso.fecha_salida} a las {permiso.hora_salida}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Retorno:</p>
                  <p className="text-sm font-medium text-gray-700">{permiso.fecha_retorno} a las {permiso.hora_retorno}</p>
                </div>
                {permiso.motivo && (
                  <div>
                    <p className="text-sm text-gray-500">Motivo:</p>
                    <p className="text-sm font-medium text-gray-700 truncate">{permiso.motivo}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button 
                  onClick={() => handleViewDetails(permiso)} 
                  className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Ver Detalles
                </button>
                {permiso.estado === 'Pendiente' && (
                  <button 
                    onClick={() => openAprobacionModal(permiso)} 
                    className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Aprobar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && currentPermisos.length === 0 && <p className="text-center text-gray-500 py-10">No se encontraron permisos con los filtros seleccionados.</p>}

      <Pagination itemsPerPage={PERMISOS_PER_PAGE} totalItems={permisosFiltrados.length} paginate={paginate} currentPage={currentPage} />

      {/* Modal de Verificación de Contraseña */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
        title="Acceso a Información Sensible"
      />

      {/* Modal de Detalles (solo se muestra después de verificar contraseña) */}
      {selectedPermiso && (
        <Modal isOpen={!!selectedPermiso} onClose={closeModal}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Detalles del Permiso</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información del Niño */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Información del Niño</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Nombre:</strong> {selectedPermiso.nino_nombre} {selectedPermiso.nino_apellido}</p>
                  <p><strong>CI:</strong> {selectedPermiso.nino_ci}</p>
                </div>
              </div>

              {/* Información del Encargado */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Información del Encargado</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Nombre:</strong> {selectedPermiso.encargado_nombre} {selectedPermiso.encargado_apellido}</p>
                  <p><strong>Teléfono:</strong> {selectedPermiso.encargado_telefono}</p>
                </div>
              </div>

              {/* Información del Permiso */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Información del Permiso</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Tipo:</strong> {selectedPermiso.tipo_permiso}</p>
                  <p><strong>Destino:</strong> {selectedPermiso.destino}</p>
                  <p><strong>Motivo:</strong> {selectedPermiso.motivo}</p>
                  <p><strong>Estado:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPermiso.estado)}`}>{selectedPermiso.estado}</span></p>
                </div>
              </div>

              {/* Fechas y Horarios */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Fechas y Horarios</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Salida:</strong> {selectedPermiso.fecha_salida} a las {selectedPermiso.hora_salida}</p>
                  <p><strong>Retorno:</strong> {selectedPermiso.fecha_retorno} a las {selectedPermiso.hora_retorno}</p>
                  {selectedPermiso.transporte && (
                    <p><strong>Transporte:</strong> {selectedPermiso.transporte}</p>
                  )}
                  {selectedPermiso.acompanante && (
                    <p><strong>Acompañante:</strong> {selectedPermiso.acompanante}</p>
                  )}
                </div>
              </div>

              {/* Información de Aprobación */}
              {selectedPermiso.estado !== 'Pendiente' && (
                <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
                  <h4 className="font-semibold text-gray-800 mb-2">Información de Aprobación</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Aprobado por:</strong> {selectedPermiso.aprobado_por}</p>
                    <p><strong>Fecha de aprobación:</strong> {selectedPermiso.fecha_aprobacion}</p>
                    {selectedPermiso.observaciones_aprobacion && (
                      <p><strong>Observaciones:</strong> {selectedPermiso.observaciones_aprobacion}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Modal para crear nuevo permiso */}
      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={closeAddModal}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Nuevo Permiso</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selección de Niño y Encargado */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Selección de Niño y Encargado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="id_nino" className="block text-sm font-medium text-gray-700 mb-1">Niño *</label>
                    <select 
                      id="id_nino" 
                      name="id_nino" 
                      value={formData.id_nino} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar niño</option>
                      {ninos.map(nino => (
                        <option key={nino.id} value={nino.id}>{nino.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="id_encargado" className="block text-sm font-medium text-gray-700 mb-1">Encargado *</label>
                    <select 
                      id="id_encargado" 
                      name="id_encargado" 
                      value={formData.id_encargado} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar encargado</option>
                      {encargados.map(encargado => (
                        <option key={encargado.id} value={encargado.id}>{encargado.nombre} {encargado.apellido}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Información del Permiso */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Información del Permiso</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tipo_permiso" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Permiso *</label>
                    <select 
                      id="tipo_permiso" 
                      name="tipo_permiso" 
                      value={formData.tipo_permiso} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar tipo</option>
                      {tiposPermiso.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="destino" className="block text-sm font-medium text-gray-700 mb-1">Destino *</label>
                    <input 
                      type="text" 
                      id="destino" 
                      name="destino" 
                      value={formData.destino} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">Motivo *</label>
                    <textarea 
                      id="motivo" 
                      name="motivo" 
                      value={formData.motivo} 
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Fechas y Horarios */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Fechas y Horarios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fecha_salida" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Salida *</label>
                    <input 
                      type="date" 
                      id="fecha_salida" 
                      name="fecha_salida" 
                      value={formData.fecha_salida} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="hora_salida" className="block text-sm font-medium text-gray-700 mb-1">Hora de Salida *</label>
                    <input 
                      type="time" 
                      id="hora_salida" 
                      name="hora_salida" 
                      value={formData.hora_salida} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="fecha_retorno" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Retorno *</label>
                    <input 
                      type="date" 
                      id="fecha_retorno" 
                      name="fecha_retorno" 
                      value={formData.fecha_retorno} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="hora_retorno" className="block text-sm font-medium text-gray-700 mb-1">Hora de Retorno *</label>
                    <input 
                      type="time" 
                      id="hora_retorno" 
                      name="hora_retorno" 
                      value={formData.hora_retorno} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Información Adicional */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Información Adicional</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="transporte" className="block text-sm font-medium text-gray-700 mb-1">Transporte</label>
                    <select 
                      id="transporte" 
                      name="transporte" 
                      value={formData.transporte} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar transporte</option>
                      {transportes.map(transporte => (
                        <option key={transporte} value={transporte}>{transporte}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="acompanante" className="block text-sm font-medium text-gray-700 mb-1">Acompañante</label>
                    <input 
                      type="text" 
                      id="acompanante" 
                      name="acompanante" 
                      value={formData.acompanante} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="telefono_contacto" className="block text-sm font-medium text-gray-700 mb-1">Teléfono de Contacto</label>
                    <input 
                      type="text" 
                      id="telefono_contacto" 
                      name="telefono_contacto" 
                      value={formData.telefono_contacto} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="documentos_adjuntos" className="block text-sm font-medium text-gray-700 mb-1">Documentos Adjuntos</label>
                    <input 
                      type="text" 
                      id="documentos_adjuntos" 
                      name="documentos_adjuntos" 
                      value={formData.documentos_adjuntos} 
                      onChange={handleInputChange}
                      placeholder="Lista de documentos separados por comas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={closeAddModal}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creando...' : 'Crear Permiso'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Modal de Aprobación */}
      {showAprobacionModal && selectedPermiso && (
        <Modal isOpen={showAprobacionModal} onClose={closeAprobacionModal}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Aprobar/Rechazar Permiso</h2>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Permiso de {selectedPermiso.nino_nombre} {selectedPermiso.nino_apellido}</h3>
              <p className="text-sm text-gray-600">Destino: {selectedPermiso.destino}</p>
              <p className="text-sm text-gray-600">Tipo: {selectedPermiso.tipo_permiso}</p>
            </div>
            <form onSubmit={handleAprobacion} className="space-y-4">
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Decisión *</label>
                <select 
                  id="estado" 
                  name="estado" 
                  value={aprobacionData.estado} 
                  onChange={handleAprobacionChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="Aprobado">Aprobar</option>
                  <option value="Rechazado">Rechazar</option>
                </select>
              </div>
              <div>
                <label htmlFor="observaciones_aprobacion" className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea 
                  id="observaciones_aprobacion" 
                  name="observaciones_aprobacion" 
                  value={aprobacionData.observaciones_aprobacion} 
                  onChange={handleAprobacionChange}
                  rows="3"
                  placeholder="Observaciones sobre la decisión..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button 
                  type="button" 
                  onClick={closeAprobacionModal}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Procesando...' : 'Confirmar Decisión'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Permisos;



