import React, { useState } from 'react';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';

// --- Datos Mock mejorados y detallados ---
const mockViajes = [
  {
    id: 'VIA-001',
    nino: 'Juan Pérez García',
    origen: 'La Paz',
    destino: 'Santa Cruz',
    fechaSalida: '2024-07-15',
    fechaRetorno: '2024-07-25',
    encargado: 'María López',
    estado: 'Programado',
    motivo: 'Vacaciones familiares',
    direccionDestino: 'Av. Beni, Calle 2, #123, Santa Cruz',
    trancas: ['Cochabamba', 'Montero'],
    medioTransporte: 'Bus',
    empresaTransporte: 'Trans Copacabana',
    observaciones: 'Viaje familiar para visitar a los abuelos. El niño viaja acompañado de ambos padres.',
    documentos: ['CI Niño', 'Autorización Notariada', 'Pasajes']
  },
  {
    id: 'VIA-002',
    nino: 'Ana Torres Guzmán',
    origen: 'Cochabamba',
    destino: 'Tarija',
    fechaSalida: '2024-07-20',
    fechaRetorno: '2024-08-05',
    encargado: 'Carlos Ruiz',
    estado: 'En Curso',
    motivo: 'Visita a abuelos',
    direccionDestino: 'Barrio El Molino, Calle Principal, #456, Tarija',
    trancas: ['Sucre', 'Potosí'],
    medioTransporte: 'Avión',
    empresaTransporte: 'BOA',
    observaciones: 'Viaje de 15 días para pasar vacaciones con los abuelos maternos.',
    documentos: ['CI Niño', 'Certificado de Nacimiento', 'Pasajes Aéreos']
  },
  {
    id: 'VIA-003',
    nino: 'Luis Gómez Mamani',
    origen: 'Oruro',
    destino: 'Beni',
    fechaSalida: '2024-07-22',
    fechaRetorno: '2024-07-30',
    encargado: 'Sofía Vargas',
    estado: 'Finalizado',
    motivo: 'Competencia deportiva',
    direccionDestino: 'Hotel Principal, #789, Trinidad',
    trancas: ['Cochabamba'],
    medioTransporte: 'Bus',
    empresaTransporte: 'Trans Oruro',
    observaciones: 'Participación en campeonato nacional de fútbol sub-12. Equipo ganador del torneo.',
    documentos: ['CI Niño', 'Certificado Médico', 'Invitación del Club']
  },
  {
    id: 'VIA-004',
    nino: 'Sofía Mendez Roca',
    origen: 'Potosí',
    destino: 'Pando',
    fechaSalida: '2024-08-01',
    fechaRetorno: '2024-08-15',
    encargado: 'Juana de Arco',
    estado: 'Programado',
    motivo: 'Viaje de estudios',
    direccionDestino: 'Residencia Estudiantil, s/n, Cobija',
    trancas: ['La Paz', 'Beni'],
    medioTransporte: 'Avión',
    empresaTransporte: 'Amaszonas',
    observaciones: 'Intercambio estudiantil por 15 días en la Universidad Amazónica de Pando.',
    documentos: ['CI Niño', 'Carta de Invitación', 'Pasajes Aéreos', 'Seguro Médico']
  },
  {
    id: 'VIA-005',
    nino: 'Mateo Rojas Vidal',
    origen: 'Sucre',
    destino: 'La Paz',
    fechaSalida: '2024-08-05',
    fechaRetorno: '2024-08-12',
    encargado: 'Pedro Pascal',
    estado: 'En Curso',
    motivo: 'Tratamiento médico',
    direccionDestino: 'Clínica ABC, Av. 6 de Agosto, #1234, La Paz',
    trancas: ['Oruro'],
    medioTransporte: 'Bus',
    empresaTransporte: 'Trans Sucre',
    observaciones: 'Tratamiento especializado en cardiología pediátrica. Cita programada.',
    documentos: ['CI Niño', 'Certificado Médico', 'Cita Médica', 'Pasajes']
  },
  {
    id: 'VIA-006',
    nino: 'Lucía Flores Castillo',
    origen: 'Santa Cruz',
    destino: 'Cochabamba',
    fechaSalida: '2024-08-10',
    fechaRetorno: '2024-08-20',
    encargado: 'Roberto Carlos',
    estado: 'Programado',
    motivo: 'Vacaciones',
    direccionDestino: 'Casa de tíos, Calle Sucre #100, Cochabamba',
    trancas: ['Montero'],
    medioTransporte: 'Bus',
    empresaTransporte: 'Trans Santa Cruz',
    observaciones: 'Vacaciones de 10 días con los tíos paternos. Visita al Cristo de la Concordia.',
    documentos: ['CI Niño', 'Autorización Paterna', 'Pasajes']
  },
  {
    id: 'VIA-007',
    nino: 'Hugo Vargas Llosa',
    origen: 'Tarija',
    destino: 'Oruro',
    fechaSalida: '2024-08-12',
    fechaRetorno: '2024-08-18',
    encargado: 'Mónica Heredia',
    estado: 'Cancelado',
    motivo: 'Evento cultural',
    direccionDestino: 'Hotel Edén, Av. Principal, Oruro',
    trancas: ['Potosí'],
    medioTransporte: 'Bus',
    empresaTransporte: 'Trans Tarija',
    observaciones: 'Cancelado por problemas de salud del niño. Reembolso de pasajes solicitado.',
    documentos: ['CI Niño', 'Certificado Médico', 'Solicitud de Reembolso']
  }
];

const uniqueEstados = [...new Set(mockViajes.map(v => v.estado))];
const VIAJES_PER_PAGE = 4;

// Datos para el formulario
const departamentos = ['La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí', 'Chuquisaca', 'Tarija', 'Beni', 'Pando'];
const ninosDisponibles = ['Juan Pérez García', 'Ana Torres Guzmán', 'Luis Gómez Mamani', 'Sofía Mendez Roca', 'Mateo Rojas Vidal', 'Lucía Flores Castillo', 'Hugo Vargas Llosa'];
const encargadosDisponibles = ['María López', 'Carlos Ruiz', 'Sofía Vargas', 'Juana de Arco', 'Pedro Pascal', 'Roberto Carlos', 'Mónica Heredia'];
const mediosTransporte = ['Bus','Avión','Automóvil Privado'];
const empresasTransporte = {
  'Bus': ['Trans Copacabana', 'Trans Oruro', 'Trans Sucre', 'Trans Santa Cruz', 'Trans Tarija', 'Flota Yungueña', 'Trans La Paz'],
  'Avión': ['BOA', 'Amaszonas', 'EcoJet', 'Boliviana de Aviación'],
  'Tren': ['Ferroviaria Andina', 'Empresa Ferroviaria Oriental'],
  'Barco': ['Transporte Fluvial Beni', 'Navegación Amazónica'],
  'Automóvil Privado': ['Vehículo Familiar', 'Taxi Privado', 'Servicio de Transporte']
};

const getStatusColor = (estado) => {
  switch (estado) {
    case 'Programado': return 'bg-blue-100 text-blue-700';
    case 'En Curso': return 'bg-yellow-100 text-yellow-700';
    case 'Finalizado': return 'bg-green-100 text-green-700';
    case 'Cancelado': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getTransportIcon = (medio) => {
  switch (medio) {
    case 'Avión': return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    );
    case 'Bus': return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 8h10l-2-8m-6 0v4m0 4h.01M12 16h.01" />
      </svg>
    );
    default: return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  }
};

const Viajes = () => {
  const [viajes, setViajes] = useState(mockViajes);
  const [selectedViaje, setSelectedViaje] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeStatusFilters, setActiveStatusFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Estado del formulario de crear viaje
  const [formData, setFormData] = useState({
    nino: '',
    encargado: '',
    origen: '',
    destino: '',
    fechaSalida: '',
    fechaRetorno: '',
    motivo: '',
    direccionDestino: '',
    trancas: '',
    medioTransporte: '',
    empresaTransporte: '',
    estado: 'Programado',
    observaciones: '',
    documentos: []
  });

  const handleViewDetails = (viaje) => setSelectedViaje(viaje);
  const closeModal = () => setSelectedViaje(null);
  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData({
      nino: '',
      encargado: '',
      origen: '',
      destino: '',
      fechaSalida: '',
      fechaRetorno: '',
      motivo: '',
      direccionDestino: '',
      trancas: '',
      medioTransporte: '',
      empresaTransporte: '',
      estado: 'Programado',
      observaciones: '',
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
    const newId = `VIA-${String(viajes.length + 1).padStart(3, '0')}`;
    
    // Procesar trancas (convertir string a array)
    const trancasArray = formData.trancas ? formData.trancas.split(',').map(t => t.trim()).filter(t => t) : [];
    
    // Crear nuevo viaje
    const nuevoViaje = {
      ...formData,
      id: newId,
      trancas: trancasArray,
      documentos: formData.documentos.length > 0 ? formData.documentos : ['CI Niño']
    };

    // Agregar a la lista
    setViajes(prev => [nuevoViaje, ...prev]);
    
    // Cerrar modal y limpiar formulario
    closeAddModal();
    
    // Mostrar mensaje de éxito
    alert('Viaje creado exitosamente');
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

  const viajesFiltrados = viajes
    .filter(v => activeStatusFilters.length === 0 || activeStatusFilters.includes(v.estado))
    .filter(v => v.nino.toLowerCase().includes(searchTerm.toLowerCase()) || v.destino.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(v => {
      if (!startDate && !endDate) return true;
      const travelDate = new Date(v.fechaSalida);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && end) return travelDate >= start && travelDate <= end;
      if (start) return travelDate >= start;
      if (end) return travelDate <= end;
      return true;
    });

  const indexOfLastViaje = currentPage * VIAJES_PER_PAGE;
  const indexOfFirstViaje = indexOfLastViaje - VIAJES_PER_PAGE;
  const currentViajes = viajesFiltrados.slice(indexOfFirstViaje, indexOfLastViaje);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Viajes</h1>
            <p className="text-gray-600 mt-2">
              Monitorea y gestiona todos los viajes programados de los menores.
            </p>
          </div>
          <button onClick={openAddModal} className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Crear Viaje
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input type="text" placeholder="Buscar por nombre o destino..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400" />
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
        {currentViajes.map(viaje => (
          <div key={viaje.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    <span className="text-gray-400 font-medium">#{viaje.id}</span> - {viaje.origen} → {viaje.destino}
                  </h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(viaje.estado)}`}>
                    {viaje.estado}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Niño/a: <span className="font-medium text-gray-700">{viaje.nino}</span></p>
                    <p className="text-sm text-gray-500">Encargado: <span className="font-medium text-gray-700">{viaje.encargado}</span></p>
                    <p className="text-sm text-gray-500">Motivo: <span className="font-medium text-gray-700">{viaje.motivo}</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fechas: <span className="font-medium text-gray-700">{viaje.fechaSalida} - {viaje.fechaRetorno}</span></p>
                    <p className="text-sm text-gray-500">Transporte: <span className="font-medium text-gray-700">{viaje.medioTransporte}</span></p>
                    <p className="text-sm text-gray-500">Empresa: <span className="font-medium text-gray-700">{viaje.empresaTransporte}</span></p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Dirección de destino:</p>
                  <p className="text-sm font-medium text-gray-700 bg-gray-50 p-2 rounded-lg">{viaje.direccionDestino}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Trancas a cruzar ({viaje.trancas.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {viaje.trancas.map((tranca, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {tranca}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                      {getTransportIcon(viaje.medioTransporte)}
                      {viaje.medioTransporte}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {viaje.documentos.length} documentos
                    </span>
                  </div>
                  <button onClick={() => handleViewDetails(viaje)} className="font-medium text-teal-600 hover:underline">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {currentViajes.length === 0 && <p className="text-center text-gray-500 py-10">No se encontraron viajes con los filtros seleccionados.</p>}
      </div>

      <Pagination itemsPerPage={VIAJES_PER_PAGE} totalItems={viajesFiltrados.length} paginate={paginate} currentPage={currentPage} />

      {selectedViaje && (
        <Modal isOpen={!!selectedViaje} onClose={closeModal}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Detalle del Viaje #{selectedViaje.id}</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Información del Menor</h3>
                <div className="space-y-2">
                  <p><strong className="text-gray-600">Nombre Completo:</strong> {selectedViaje.nino}</p>
                  <p><strong className="text-gray-600">Encargado/Tutor:</strong> {selectedViaje.encargado}</p>
                  <p><strong className="text-gray-600">Motivo del Viaje:</strong> {selectedViaje.motivo}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Detalles del Transporte</h3>
                <div className="space-y-2">
                  <p><strong className="text-gray-600">Medio de Transporte:</strong> {selectedViaje.medioTransporte}</p>
                  <p><strong className="text-gray-600">Empresa:</strong> {selectedViaje.empresaTransporte}</p>
                  <p><strong className="text-gray-600">Estado:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedViaje.estado)}`}>{selectedViaje.estado}</span></p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Ruta del Viaje</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <p className="text-sm font-medium text-gray-700 mt-1">{selectedViaje.origen}</p>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-300 mx-4 relative">
                    {selectedViaje.trancas.map((tranca, index) => (
                      <div key={index} className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-orange-500 rounded-full" style={{ left: `${((index + 1) / (selectedViaje.trancas.length + 1)) * 100}%` }}></div>
                    ))}
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-medium text-gray-700 mt-1">{selectedViaje.destino}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Trancas: {selectedViaje.trancas.join(' → ')}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Fechas y Destino</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong className="text-gray-600">Fecha de Salida:</strong> {selectedViaje.fechaSalida}</p>
                  <p><strong className="text-gray-600">Fecha de Retorno:</strong> {selectedViaje.fechaRetorno}</p>
                </div>
                <div>
                  <p><strong className="text-gray-600">Dirección de Destino:</strong></p>
                  <p className="text-sm bg-gray-50 p-2 rounded-lg mt-1">{selectedViaje.direccionDestino}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Documentos Requeridos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedViaje.documentos.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Observaciones</h3>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">{selectedViaje.observacion}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal para crear nuevo viaje */}
      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={closeAddModal}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Nuevo Viaje</h2>
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

              {/* Ruta del Viaje */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Ruta del Viaje</h3>
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
                    <label htmlFor="fechaSalida" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Salida *</label>
                    <input 
                      type="date" 
                      id="fechaSalida" 
                      name="fechaSalida" 
                      value={formData.fechaSalida} 
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

              {/* Información del Transporte */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Información del Transporte</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="medioTransporte" className="block text-sm font-medium text-gray-700 mb-1">Medio de Transporte *</label>
                    <select 
                      id="medioTransporte" 
                      name="medioTransporte" 
                      value={formData.medioTransporte} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar medio</option>
                      {mediosTransporte.map(medio => (
                        <option key={medio} value={medio}>{medio}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="empresaTransporte" className="block text-sm font-medium text-gray-700 mb-1">Empresa de Transporte</label>
                    <select 
                      id="empresaTransporte" 
                      name="empresaTransporte" 
                      value={formData.empresaTransporte} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar empresa</option>
                      {formData.medioTransporte && empresasTransporte[formData.medioTransporte]?.map(empresa => (
                        <option key={empresa} value={empresa}>{empresa}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Información Adicional */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Información Adicional</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">Motivo del Viaje *</label>
                    <input 
                      type="text" 
                      id="motivo" 
                      name="motivo" 
                      value={formData.motivo} 
                      onChange={handleInputChange}
                      placeholder="Ej: Vacaciones familiares, tratamiento médico, etc."
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="direccionDestino" className="block text-sm font-medium text-gray-700 mb-1">Dirección de Destino</label>
                    <input 
                      type="text" 
                      id="direccionDestino" 
                      name="direccionDestino" 
                      value={formData.direccionDestino} 
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
                      placeholder="Ej: Cochabamba, Montero (separar con comas)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                    <textarea 
                      id="observaciones" 
                      name="observaciones" 
                      value={formData.observaciones} 
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Información adicional relevante sobre el viaje..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Estado del Viaje */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado del Viaje</h3>
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado Inicial</label>
                  <select 
                    id="estado" 
                    name="estado" 
                    value={formData.estado} 
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="Programado">Programado</option>
                    <option value="En Curso">En Curso</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="Cancelado">Cancelado</option>
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
                  Crear Viaje
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Viajes; 