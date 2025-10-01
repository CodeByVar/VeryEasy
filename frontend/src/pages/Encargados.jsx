import React, { useState, useEffect } from 'react';

import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import PasswordModal from '../components/ui/PasswordModal';
import { encargadoService } from '../services/encargadoService';

const ENCARGADOS_PER_PAGE = 6;

// Datos para el formulario
const parentescos = ['Padre', 'Madre', 'Abuelo', 'Abuela', 'Tío', 'Tía', 'Hermano', 'Hermana', 'Tutor Legal', 'Otro'];
const ocupaciones = ['Empleado', 'Empresario', 'Profesional', 'Docente', 'Médico', 'Ingeniero', 'Comerciante', 'Estudiante', 'Jubilado', 'Ama de Casa', 'Otro'];

const getStatusColor = (estado) => {
  switch (estado) {
    case 'Activo': return 'bg-green-100 text-green-700';
    case 'Inactivo': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const Encargados = () => {
  const [encargados, setEncargados] = useState([]);
  const [selectedEncargado, setSelectedEncargado] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingEncargado, setPendingEncargado] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeStatusFilters, setActiveStatusFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar encargados desde la API
  const cargarEncargados = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await encargadoService.obtenerEncargados();
      setEncargados(data);
    } catch (err) {
      console.error('Error al cargar encargados:', err);
      setError('Error al cargar los datos de encargados');
    } finally {
      setLoading(false);
    }
  };

  // Cargar encargados al montar el componente
  useEffect(() => {
    cargarEncargados();
  }, []);

  // Estado del formulario de crear encargado
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    ci: '',
    telefono: '',
    telefono_alternativo: '',
    direccion: '',
    correo: '',
    parentesco: '',
    ocupacion: '',
    lugar_trabajo: '',
    telefono_trabajo: '',
    estado: 'Activo',
    observaciones: '',
    es_contacto_emergencia: false
  });

  const handleViewDetails = (encargado) => {
    setPendingEncargado(encargado);
    setShowPasswordModal(true);
  };

  const handlePasswordSuccess = () => {
    setSelectedEncargado(pendingEncargado);
    setPendingEncargado(null);
  };

  const closeModal = () => setSelectedEncargado(null);
  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData({
      nombre: '',
      apellido: '',
      ci: '',
      telefono: '',
      telefono_alternativo: '',
      direccion: '',
      correo: '',
      parentesco: '',
      ocupacion: '',
      lugar_trabajo: '',
      telefono_trabajo: '',
      estado: 'Activo',
      observaciones: '',
      es_contacto_emergencia: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Crear encargado usando la API
      const nuevoEncargado = await encargadoService.crearEncargado(formData);
      
      // Agregar a la lista local
      setEncargados(prev => [nuevoEncargado, ...prev]);
      
      // Cerrar modal y limpiar formulario
      closeAddModal();
      
      // Mostrar mensaje de éxito
      alert('Encargado agregado exitosamente');
      
    } catch (err) {
      console.error('Error al crear encargado:', err);
      setError('Error al crear el encargado. Verifique que el CI no esté duplicado.');
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

  const encargadosFiltrados = encargados
    .filter(e => activeStatusFilters.length === 0 || activeStatusFilters.includes(e.estado))
    .filter(e => 
      e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.ci.includes(searchTerm) ||
      e.parentesco.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const indexOfLastEncargado = currentPage * ENCARGADOS_PER_PAGE;
  const indexOfFirstEncargado = indexOfLastEncargado - ENCARGADOS_PER_PAGE;
  const currentEncargados = encargadosFiltrados.slice(indexOfFirstEncargado, indexOfLastEncargado);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Encargados</h1>
        <p className="text-gray-600 mt-2">
          Administra la información de todos los encargados y tutores registrados en el sistema.
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
            placeholder="Buscar por nombre, apellido, CI o parentesco..." 
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
            + Agregar Encargado
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 flex-wrap">
          <span className="font-medium text-gray-600">Filtrar por estado:</span>
          {[...new Set(encargados.map(e => e.estado))].map(estado => (
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
          <span className="ml-3 text-gray-600">Cargando encargados...</span>
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
                  onClick={cargarEncargados}
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
        {!loading && !error && currentEncargados.map(encargado => (
          <div key={encargado.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {encargado.nombre} {encargado.apellido}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(encargado.estado)}`}>
                      {encargado.estado}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">CI: {encargado.ci}</p>
                  <p className="text-sm text-gray-500 mb-1">Parentesco: {encargado.parentesco}</p>
                  <p className="text-sm text-gray-500">Tel: {encargado.telefono}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Dirección:</p>
                  <p className="text-sm font-medium text-gray-700 truncate">{encargado.direccion}</p>
                </div>
                {encargado.ocupacion && (
                  <div>
                    <p className="text-sm text-gray-500">Ocupación:</p>
                    <p className="text-sm font-medium text-gray-700">{encargado.ocupacion}</p>
                  </div>
                )}
                {encargado.es_contacto_emergencia && (
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-sm font-medium text-red-600">Contacto de Emergencia</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button 
                  onClick={() => handleViewDetails(encargado)} 
                  className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && currentEncargados.length === 0 && <p className="text-center text-gray-500 py-10">No se encontraron encargados con los filtros seleccionados.</p>}

      <Pagination itemsPerPage={ENCARGADOS_PER_PAGE} totalItems={encargadosFiltrados.length} paginate={paginate} currentPage={currentPage} />

      {/* Modal de Verificación de Contraseña */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
        title="Acceso a Información Sensible"
      />

      {/* Modal de Detalles (solo se muestra después de verificar contraseña) */}
      {selectedEncargado && (
        <Modal isOpen={!!selectedEncargado} onClose={closeModal}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Perfil Completo - {selectedEncargado.nombre} {selectedEncargado.apellido}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna 1: Foto y datos básicos */}
              <div className="lg:col-span-1">
                <div className="text-center mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedEncargado.nombre} {selectedEncargado.apellido}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedEncargado.estado)}`}>
                    {selectedEncargado.estado}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Información Personal</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>CI:</strong> {selectedEncargado.ci}</p>
                      <p><strong>Parentesco:</strong> {selectedEncargado.parentesco}</p>
                      <p><strong>Teléfono:</strong> {selectedEncargado.telefono}</p>
                      {selectedEncargado.telefono_alternativo && (
                        <p><strong>Tel. Alternativo:</strong> {selectedEncargado.telefono_alternativo}</p>
                      )}
                    </div>
                  </div>

                  {selectedEncargado.ocupacion && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Información Laboral</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Ocupación:</strong> {selectedEncargado.ocupacion}</p>
                        {selectedEncargado.lugar_trabajo && (
                          <p><strong>Lugar de Trabajo:</strong> {selectedEncargado.lugar_trabajo}</p>
                        )}
                        {selectedEncargado.telefono_trabajo && (
                          <p><strong>Tel. Trabajo:</strong> {selectedEncargado.telefono_trabajo}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Columna 2: Información de contacto y adicional */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Información de Contacto</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Dirección:</p>
                      <p className="font-medium text-gray-700">{selectedEncargado.direccion}</p>
                    </div>
                    {selectedEncargado.correo && (
                      <div>
                        <p className="text-sm text-gray-500">Correo Electrónico:</p>
                        <p className="font-medium text-gray-700">{selectedEncargado.correo}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedEncargado.es_contacto_emergencia && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h4 className="font-semibold text-red-800 mb-4">Contacto de Emergencia</h4>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-red-700 font-medium">Este encargado es contacto de emergencia</span>
                    </div>
                  </div>
                )}

                {selectedEncargado.observaciones && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Observaciones</h4>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800">{selectedEncargado.observaciones}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal para crear nuevo encargado */}
      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={closeAddModal}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Agregar Nuevo Encargado</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                    <input 
                      type="text" 
                      id="nombre" 
                      name="nombre" 
                      value={formData.nombre} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                    <input 
                      type="text" 
                      id="apellido" 
                      name="apellido" 
                      value={formData.apellido} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="ci" className="block text-sm font-medium text-gray-700 mb-1">CI *</label>
                    <input 
                      type="text" 
                      id="ci" 
                      name="ci" 
                      value={formData.ci} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="parentesco" className="block text-sm font-medium text-gray-700 mb-1">Parentesco *</label>
                    <select 
                      id="parentesco" 
                      name="parentesco" 
                      value={formData.parentesco} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar parentesco</option>
                      {parentescos.map(parentesco => (
                        <option key={parentesco} value={parentesco}>{parentesco}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Información de Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono Principal *</label>
                    <input 
                      type="text" 
                      id="telefono" 
                      name="telefono" 
                      value={formData.telefono} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="telefono_alternativo" className="block text-sm font-medium text-gray-700 mb-1">Teléfono Alternativo</label>
                    <input 
                      type="text" 
                      id="telefono_alternativo" 
                      name="telefono_alternativo" 
                      value={formData.telefono_alternativo} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                    <textarea 
                      id="direccion" 
                      name="direccion" 
                      value={formData.direccion} 
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      id="correo" 
                      name="correo" 
                      value={formData.correo} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Información Laboral */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Información Laboral</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ocupacion" className="block text-sm font-medium text-gray-700 mb-1">Ocupación</label>
                    <select 
                      id="ocupacion" 
                      name="ocupacion" 
                      value={formData.ocupacion} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar ocupación</option>
                      {ocupaciones.map(ocupacion => (
                        <option key={ocupacion} value={ocupacion}>{ocupacion}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="lugar_trabajo" className="block text-sm font-medium text-gray-700 mb-1">Lugar de Trabajo</label>
                    <input 
                      type="text" 
                      id="lugar_trabajo" 
                      name="lugar_trabajo" 
                      value={formData.lugar_trabajo} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="telefono_trabajo" className="block text-sm font-medium text-gray-700 mb-1">Teléfono del Trabajo</label>
                    <input 
                      type="text" 
                      id="telefono_trabajo" 
                      name="telefono_trabajo" 
                      value={formData.telefono_trabajo} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Información Adicional */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Información Adicional</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                    <textarea 
                      id="observaciones" 
                      name="observaciones" 
                      value={formData.observaciones} 
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Información adicional relevante..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div>
                      <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <select 
                        id="estado" 
                        name="estado" 
                        value={formData.estado} 
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="es_contacto_emergencia" 
                        name="es_contacto_emergencia" 
                        checked={formData.es_contacto_emergencia} 
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <label htmlFor="es_contacto_emergencia" className="ml-2 text-sm font-medium text-gray-700">
                        Contacto de Emergencia
                      </label>
                    </div>
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
                  {loading ? 'Agregando...' : 'Agregar Encargado'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Encargados;