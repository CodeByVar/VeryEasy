import React, { useState } from 'react';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';


// --- Datos Mock actualizados y completos ---
const mockPermisos = [
  { id: 'PER-001', nino: 'Juan Pérez García', origen: 'La Paz', destino: 'Santa Cruz', fechaViaje: '2024-07-15', fechaRetorno: '2024-07-25', encargado: 'María López', estado: 'Aprobado', observacion: 'Todos los documentos validados correctamente.', motivoViaje: 'Vacaciones familiares', direccionLlegada: 'Av. Beni, Calle 2, #123', trancas: 'Cochabamba, Montero', documentos: [{ nombre: 'CI_Encargado.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Cert_Nacimiento_Niño.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Autorizacion_Notariada.jpg', tipo: 'Imagen', url: '#' }] },
  { id: 'PER-002', nino: 'Ana Torres Guzmán', origen: 'Cochabamba', destino: 'Tarija', fechaViaje: '2024-07-20', fechaRetorno: '2024-08-05', encargado: 'Carlos Ruiz', estado: 'Pendiente', observacion: 'En espera de la verificación de la autorización paterna.', motivoViaje: 'Visita a abuelos', direccionLlegada: 'Barrio El Molino, Calle Principal, #456', trancas: 'Sucre, Potosí', documentos: [{ nombre: 'CI_Encargado.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Cert_Nacimiento_Niño.jpg', tipo: 'Imagen', url: '#' }] },
  { id: 'PER-003', nino: 'Luis Gómez Mamani', origen: 'Oruro', destino: 'Beni', fechaViaje: '2024-07-22', fechaRetorno: '2024-07-30', encargado: 'Sofía Vargas', estado: 'Rechazado', observacion: 'El carnet de identidad del encargado se encuentra vencido.', motivoViaje: 'Competencia deportiva', direccionLlegada: 'Hotel Principal, #789', trancas: 'Cochabamba', documentos: [] },
  { id: 'PER-004', nino: 'Sofía Mendez Roca', origen: 'Potosí', destino: 'Pando', fechaViaje: '2024-08-01', fechaRetorno: '2024-08-15', encargado: 'Juana de Arco', estado: 'Aprobado', observacion: 'Verificación facial exitosa.', motivoViaje: 'Viaje de estudios', direccionLlegada: 'Residencia Estudiantil, s/n', trancas: 'La Paz, Beni', documentos: [{ nombre: 'CI_Encargado.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Carta_Invitacion.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'PER-005', nino: 'Mateo Rojas Vidal', origen: 'Sucre', destino: 'La Paz', fechaViaje: '2024-08-05', fechaRetorno: '2024-08-12', encargado: 'Pedro Pascal', estado: 'Pendiente', observacion: 'Pendiente de validación de pasajes.', motivoViaje: 'Tratamiento médico', direccionLlegada: 'Clínica ABC, Av. 6 de Agosto', trancas: 'Oruro', documentos: [{ nombre: 'Certificado_Medico.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'PER-006', nino: 'Lucía Flores Castillo', origen: 'Santa Cruz', destino: 'Cochabamba', fechaViaje: '2024-08-10', fechaRetorno: '2024-08-20', encargado: 'Roberto Carlos', estado: 'Aprobado', observacion: 'Documentación completa y verificada.', motivoViaje: 'Vacaciones', direccionLlegada: 'Casa de tíos, Calle Sucre #100', trancas: 'Montero', documentos: [{ nombre: 'CI_Tutor.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Nacimiento_Menor.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'PER-007', nino: 'Hugo Vargas Llosa', origen: 'Tarija', destino: 'Oruro', fechaViaje: '2024-08-12', fechaRetorno: '2024-08-18', encargado: 'Mónica Heredia', estado: 'Rechazado', observacion: 'Falta autorización notariada.', motivoViaje: 'Evento cultural', direccionLlegada: 'Hotel Edén', trancas: 'Potosí', documentos: [] },
  { id: 'PER-008', nino: 'Isabella Morales Rojas', origen: 'La Paz', destino: 'Cochabamba', fechaViaje: '2024-08-15', fechaRetorno: '2024-08-22', encargado: 'Fernando Morales', estado: 'Aprobado', observacion: 'Permiso aprobado para competencia de danza.', motivoViaje: 'Competencia de danza folklórica', direccionLlegada: 'Teatro Municipal, Av. Principal', trancas: 'Oruro', documentos: [{ nombre: 'CI_Padre.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Invitacion_Competencia.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Danza.jpg', tipo: 'Imagen', url: '#' }] },
  { id: 'PER-009', nino: 'Diego Silva Mendoza', origen: 'Santa Cruz', destino: 'La Paz', fechaViaje: '2024-08-18', fechaRetorno: '2024-08-25', encargado: 'Carmen Silva', estado: 'Pendiente', observacion: 'En revisión de documentación médica.', motivoViaje: 'Consulta oftalmológica especializada', direccionLlegada: 'Clínica Oftalmológica, Zona Sopocachi', trancas: 'Montero, Cochabamba', documentos: [{ nombre: 'Certificado_Medico.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Cita_Medica.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'PER-010', nino: 'Valentina Castro López', origen: 'Cochabamba', destino: 'Sucre', fechaViaje: '2024-08-20', fechaRetorno: '2024-08-27', encargado: 'Roberto Castro', estado: 'Aprobado', observacion: 'Permiso para intercambio estudiantil.', motivoViaje: 'Intercambio estudiantil', direccionLlegada: 'Colegio San Francisco Javier', trancas: 'Potosí', documentos: [{ nombre: 'CI_Padre.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Carta_Intercambio.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Escolar.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'PER-011', nino: 'Sebastián Herrera Vega', origen: 'Oruro', destino: 'Santa Cruz', fechaViaje: '2024-08-22', fechaRetorno: '2024-09-05', encargado: 'Patricia Herrera', estado: 'Rechazado', observacion: 'Falta certificado de vacunación COVID-19.', motivoViaje: 'Visita familiar', direccionLlegada: 'Casa de abuelos, Plan 3000', trancas: 'Cochabamba, Montero', documentos: [{ nombre: 'CI_Madre.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'PER-012', nino: 'Camila Rodríguez Paredes', origen: 'Potosí', destino: 'Tarija', fechaViaje: '2024-08-25', fechaRetorno: '2024-09-01', encargado: 'Miguel Rodríguez', estado: 'Aprobado', observacion: 'Permiso para festival de música.', motivoViaje: 'Festival de música infantil', direccionLlegada: 'Auditorio Municipal, Centro Histórico', trancas: 'Sucre', documentos: [{ nombre: 'CI_Padre.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Invitacion_Festival.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Musica.jpg', tipo: 'Imagen', url: '#' }] },
  { id: 'PER-013', nino: 'Andrés Jiménez Salazar', origen: 'Tarija', destino: 'Beni', fechaViaje: '2024-08-28', fechaRetorno: '2024-09-10', encargado: 'Laura Jiménez', estado: 'Pendiente', observacion: 'Pendiente verificación de pasajes aéreos.', motivoViaje: 'Vacaciones familiares', direccionLlegada: 'Hotel Amazonas, Trinidad', trancas: 'Santa Cruz', documentos: [{ nombre: 'CI_Madre.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Reserva_Hotel.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'PER-014', nino: 'Mariana Torres Flores', origen: 'Chuquisaca', destino: 'La Paz', fechaViaje: '2024-09-01', fechaRetorno: '2024-09-08', encargado: 'Carlos Torres', estado: 'Aprobado', observacion: 'Permiso para olimpiada de matemáticas.', motivoViaje: 'Olimpiada nacional de matemáticas', direccionLlegada: 'Universidad Mayor de San Andrés', trancas: 'Potosí, Oruro', documentos: [{ nombre: 'CI_Padre.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Invitacion_Olimpiada.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Matematicas.jpg', tipo: 'Imagen', url: '#' }] },
  { id: 'PER-015', nino: 'Gabriel Mendoza Ríos', origen: 'La Paz', destino: 'Pando', fechaViaje: '2024-09-05', fechaRetorno: '2024-09-15', encargado: 'Ana Mendoza', estado: 'Rechazado', observacion: 'Falta autorización del otro progenitor.', motivoViaje: 'Visita a familiares', direccionLlegada: 'Casa de tíos, Cobija', trancas: 'Beni', documentos: [{ nombre: 'CI_Madre.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'PER-016', nino: 'Sofía Ramírez Gutiérrez', origen: 'Santa Cruz', destino: 'Cochabamba', fechaViaje: '2024-09-08', fechaRetorno: '2024-09-15', encargado: 'José Ramírez', estado: 'Aprobado', observacion: 'Permiso para competencia de natación.', motivoViaje: 'Campeonato regional de natación', direccionLlegada: 'Complejo Acuático Municipal', trancas: 'Montero', documentos: [{ nombre: 'CI_Padre.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Invitacion_Natacion.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Medico.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'PER-017', nino: 'Daniel Ortiz Calderón', origen: 'Oruro', destino: 'Sucre', fechaViaje: '2024-09-10', fechaRetorno: '2024-09-17', encargado: 'María Ortiz', estado: 'Pendiente', observacion: 'En espera de confirmación del colegio destino.', motivoViaje: 'Intercambio cultural escolar', direccionLlegada: 'Colegio Sagrado Corazón', trancas: 'Potosí', documentos: [{ nombre: 'CI_Madre.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Carta_Intercambio.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'PER-018', nino: 'Valeria Espinoza Ruiz', origen: 'Cochabamba', destino: 'Tarija', fechaViaje: '2024-09-12', fechaRetorno: '2024-09-19', encargado: 'Fernando Espinoza', estado: 'Aprobado', observacion: 'Permiso para festival de arte.', motivoViaje: 'Festival de arte infantil', direccionLlegada: 'Centro Cultural, Zona Sur', trancas: 'Potosí', documentos: [{ nombre: 'CI_Padre.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Invitacion_Arte.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Obras_Arte.jpg', tipo: 'Imagen', url: '#' }] },
  { id: 'PER-019', nino: 'Alejandro Vargas Morales', origen: 'Potosí', destino: 'Santa Cruz', fechaViaje: '2024-09-15', fechaRetorno: '2024-09-25', encargado: 'Rosa Vargas', estado: 'Rechazado', observacion: 'Falta certificado de antecedentes del encargado.', motivoViaje: 'Visita familiar', direccionLlegada: 'Casa de abuelos, Plan 3000', trancas: 'Sucre, Cochabamba, Montero', documentos: [{ nombre: 'CI_Madre.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'PER-020', nino: 'Natalia Castro Jiménez', origen: 'Tarija', destino: 'La Paz', fechaViaje: '2024-09-18', fechaRetorno: '2024-09-25', encargado: 'Luis Castro', estado: 'Aprobado', observacion: 'Permiso para competencia de ajedrez.', motivoViaje: 'Torneo nacional de ajedrez', direccionLlegada: 'Club de Ajedrez La Paz', trancas: 'Potosí, Oruro', documentos: [{ nombre: 'CI_Padre.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Invitacion_Ajedrez.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Ajedrez.jpg', tipo: 'Imagen', url: '#' }] }
];

const uniqueEstados = [...new Set(mockPermisos.map(p => p.estado))];
const PERMISSIONS_PER_PAGE = 5;

// Datos para el formulario
const departamentos = ['La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí', 'Chuquisaca', 'Tarija', 'Beni', 'Pando'];
const ninosDisponibles = ['Juan Pérez García', 'Ana Torres Guzmán', 'Luis Gómez Mamani', 'Sofía Mendez Roca', 'Mateo Rojas Vidal', 'Lucía Flores Castillo', 'Hugo Vargas Llosa'];
const encargadosDisponibles = ['María López', 'Carlos Ruiz', 'Sofía Vargas', 'Juana de Arco', 'Pedro Pascal', 'Roberto Carlos', 'Mónica Heredia'];

const getStatusColor = (estado) => {
  switch (estado) {
    case 'Aprobado': return 'bg-green-100 text-green-700';
    case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
    case 'Rechazado': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const PaginaPermisos = () => {
  const [permisos, setPermisos] = useState(mockPermisos);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeStatusFilters, setActiveStatusFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Estado del formulario de crear permiso
  const [formData, setFormData] = useState({
    nino: '',
    encargado: '',
    origen: '',
    destino: '',
    fechaViaje: '',
    fechaRetorno: '',
    motivoViaje: '',
    direccionLlegada: '',
    trancas: '',
    estado: 'Pendiente',
    observacion: '',
    documentos: []
  });

  const handleViewDetails = (permiso) => setSelectedPermission(permiso);
  const closeModal = () => setSelectedPermission(null);
  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData({
      nino: '',
      encargado: '',
      origen: '',
      destino: '',
      fechaViaje: '',
      fechaRetorno: '',
      motivoViaje: '',
      direccionLlegada: '',
      trancas: '',
      estado: 'Pendiente',
      observacion: '',
      documentos: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generar ID único
    const newId = `PER-${String(permisos.length + 1).padStart(3, '0')}`;
    
    // Crear nuevo permiso
    const nuevoPermiso = {
      ...formData,
      id: newId,
      documentos: formData.documentos.length > 0 ? formData.documentos : []
    };

    // Agregar a la lista
    setPermisos(prev => [nuevoPermiso, ...prev]);
    
    // Cerrar modal y limpiar formulario
    closeAddModal();
    
    // Mostrar mensaje de éxito
    alert('Permiso creado exitosamente');
  };

  const resetFilters = () => {
    setActiveStatusFilters([]);
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
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
    .filter(p => p.nino.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => {
      if (!startDate && !endDate) return true;
      const travelDate = new Date(p.fechaViaje);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && end) return travelDate >= start && travelDate <= end;
      if (start) return travelDate >= start;
      if (end) return travelDate <= end;
      return true;
    });

  const indexOfLastPermission = currentPage * PERMISSIONS_PER_PAGE;
  const indexOfFirstPermission = indexOfLastPermission - PERMISSIONS_PER_PAGE;
  const currentPermissions = permisosFiltrados.slice(indexOfFirstPermission, indexOfLastPermission);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Permisos de Viaje</h1>
            <p className="text-gray-600 mt-2">
              Busca, filtra y gestiona todos los permisos registrados en el sistema.
            </p>
          </div>
          <button onClick={openAddModal} className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Crear Permiso
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input type="text" placeholder="Buscar por nombre del niño..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400" />
          <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400" />
          <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400" />
          <button onClick={resetFilters} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
            Limpiar Filtros
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 flex-wrap">
          <span className="font-medium text-gray-600">Filtrar por estado:</span>
          {uniqueEstados.map(estado => (
            <label key={estado} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
              <input type="checkbox" checked={activeStatusFilters.includes(estado)} onChange={() => handleStatusFilterChange(estado)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
              <span className="text-sm font-medium text-gray-700">{estado}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {currentPermissions.map(permiso => (
          <div key={permiso.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">
                  <span className="text-gray-400 font-medium">#{permiso.id}</span> - Viaje de {permiso.origen} a {permiso.destino}
                </h3>
                <div className="text-sm text-gray-500 mt-1">Niño/a: <span className="font-medium text-gray-700">{permiso.nino}</span></div>
                <div className="text-sm text-gray-500">Motivo: <span className="font-medium text-gray-700">{permiso.motivoViaje}</span></div>
              </div>
              <span className={`mt-2 sm:mt-0 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(permiso.estado)} h-fit`}>
                {permiso.estado}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                {permiso.documentos?.length || 0} documentos adjuntos
              </span>
              <button onClick={() => handleViewDetails(permiso)} className="font-medium text-teal-600 hover:underline">
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
        {currentPermissions.length === 0 && <p className="text-center text-gray-500 py-10">No se encontraron permisos con los filtros seleccionados.</p>}
      </div>

      <Pagination itemsPerPage={PERMISSIONS_PER_PAGE} totalItems={permisosFiltrados.length} paginate={paginate} currentPage={currentPage} />

      {selectedPermission && (
        <Modal isOpen={!!selectedPermission} onClose={closeModal}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Detalle del Permiso #{selectedPermission.id}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Información del Menor</h3>
              <p><strong className="text-gray-600">Nombre Completo:</strong> {selectedPermission.nino}</p>
              <p><strong className="text-gray-600">Encargado/Tutor:</strong> {selectedPermission.encargado}</p>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700">Detalles del Viaje</h3>
              <p><strong className="text-gray-600">Ruta:</strong> {selectedPermission.origen} a {selectedPermission.destino}</p>
              <p><strong className="text-gray-600">Fechas:</strong> {selectedPermission.fechaViaje} hasta el {selectedPermission.fechaRetorno}</p>
              <p><strong className="text-gray-600">Motivo:</strong> {selectedPermission.motivoViaje}</p>
              <p><strong className="text-gray-600">Dirección de Llegada:</strong> {selectedPermission.direccionLlegada}</p>
              <p><strong className="text-gray-600">Trancas a Cruzar:</strong> {selectedPermission.trancas}</p>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Documentos Adjuntos</h3>
              {selectedPermission.documentos?.length > 0 ? (
                <ul className="space-y-2">
                  {selectedPermission.documentos.map((doc, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        {doc.tipo === 'PDF' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        )}
                        <span className="font-medium text-gray-800 truncate">{doc.nombre}</span>
                      </div>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-teal-600 hover:underline flex-shrink-0 ml-4">
                        Ver
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No hay documentos adjuntos para este permiso.</p>
              )}
            </div>
            <div className={`border-t pt-4`}>
              <h3 className="text-lg font-semibold text-gray-700">Estado del Permiso</h3>
              <div className={`p-3 rounded-lg ${getStatusColor(selectedPermission.estado)}`}>
                <p><strong className="font-semibold">Estado:</strong> {selectedPermission.estado}</p>
                <p className="mt-1">{selectedPermission.observacion}</p>
              </div>
            </div>
            
            {/* Código QR del Permiso */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Código QR del Permiso</h3>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                  <QRCode 
                    value={JSON.stringify({
                      id: selectedPermission.id,
                      nino: selectedPermission.nino,
                      encargado: selectedPermission.encargado,
                      origen: selectedPermission.origen,
                      destino: selectedPermission.destino,
                      fechaViaje: selectedPermission.fechaViaje,
                      fechaRetorno: selectedPermission.fechaRetorno,
                      estado: selectedPermission.estado,
                      motivoViaje: selectedPermission.motivoViaje,
                      direccionLlegada: selectedPermission.direccionLlegada,
                      trancas: selectedPermission.trancas,
                      timestamp: new Date().toISOString()
                    })}
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Escanea este código QR para verificar la información del permiso
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: {selectedPermission.id} | Estado: {selectedPermission.estado}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal para crear nuevo permiso */}
      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={closeAddModal}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Nuevo Permiso de Viaje</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información del Menor */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Información del Menor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nino" className="block text-sm font-medium text-gray-700 mb-1">Niño/a *</label>
                    <select 
                      id="nino" 
                      name="nino" 
                      value={formData.nino} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar niño/a</option>
                      {ninosDisponibles.map(nino => (
                        <option key={nino} value={nino}>{nino}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="encargado" className="block text-sm font-medium text-gray-700 mb-1">Encargado/Tutor *</label>
                    <select 
                      id="encargado" 
                      name="encargado" 
                      value={formData.encargado} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar encargado</option>
                      {encargadosDisponibles.map(encargado => (
                        <option key={encargado} value={encargado}>{encargado}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Detalles del Viaje */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Detalles del Viaje</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="origen" className="block text-sm font-medium text-gray-700 mb-1">Ciudad de Origen *</label>
                    <select 
                      id="origen" 
                      name="origen" 
                      value={formData.origen} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar origen</option>
                      {departamentos.map(depto => (
                        <option key={depto} value={depto}>{depto}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="destino" className="block text-sm font-medium text-gray-700 mb-1">Ciudad de Destino *</label>
                    <select 
                      id="destino" 
                      name="destino" 
                      value={formData.destino} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar destino</option>
                      {departamentos.map(depto => (
                        <option key={depto} value={depto}>{depto}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="fechaViaje" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Salida *</label>
                    <input 
                      type="date" 
                      id="fechaViaje" 
                      name="fechaViaje" 
                      value={formData.fechaViaje} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="fechaRetorno" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Retorno *</label>
                    <input 
                      type="date" 
                      id="fechaRetorno" 
                      name="fechaRetorno" 
                      value={formData.fechaRetorno} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Información Adicional */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Información Adicional</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="motivoViaje" className="block text-sm font-medium text-gray-700 mb-1">Motivo del Viaje *</label>
                    <input 
                      type="text" 
                      id="motivoViaje" 
                      name="motivoViaje" 
                      value={formData.motivoViaje} 
                      onChange={handleInputChange}
                      placeholder="Ej: Vacaciones familiares, tratamiento médico, etc."
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="direccionLlegada" className="block text-sm font-medium text-gray-700 mb-1">Dirección de Llegada</label>
                    <input 
                      type="text" 
                      id="direccionLlegada" 
                      name="direccionLlegada" 
                      value={formData.direccionLlegada} 
                      onChange={handleInputChange}
                      placeholder="Dirección completa en la ciudad de destino"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="trancas" className="block text-sm font-medium text-gray-700 mb-1">Trancas a Cruzar</label>
                    <input 
                      type="text" 
                      id="trancas" 
                      name="trancas" 
                      value={formData.trancas} 
                      onChange={handleInputChange}
                      placeholder="Ej: Cochabamba, Montero, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="observacion" className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                    <textarea 
                      id="observacion" 
                      name="observacion" 
                      value={formData.observacion} 
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Información adicional relevante..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Estado del Permiso */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado del Permiso</h3>
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado Inicial</label>
                  <select 
                    id="estado" 
                    name="estado" 
                    value={formData.estado} 
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
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
                  className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
                >
                  Crear Permiso
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PaginaPermisos;
