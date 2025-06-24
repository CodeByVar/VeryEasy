import React, { useState } from 'react';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';

// --- Datos Mock mejorados y detallados ---
const mockEncargados = [
  {
    id: 'ENC-001',
    nombres: 'María Elena',
    apellidos: 'López Rodríguez',
    carnet: '12345678',
    fechaNacimiento: '1985-03-15',
    edad: 39,
    telefono: '+591 71234567',
    telefonoSecundario: '+591 72345678',
    email: 'maria.lopez@email.com',
    direccion: 'Av. 6 de Agosto, #1234, Zona Sopocachi, La Paz',
    ciudad: 'La Paz',
    departamento: 'La Paz',
    ocupacion: 'Médica Pediatra',
    lugarTrabajo: 'Hospital del Niño',
    telefonoTrabajo: '+591 22456789',
    emailTrabajo: 'mlopez@hospitalnino.bo',
    tipoRelacion: 'Madre',
    ninosACargo: ['Juan Pérez García', 'Ana Pérez López'],
    estado: 'Activo',
    fechaRegistro: '2020-01-15',
    observaciones: 'Encargada responsable, siempre disponible para emergencias.',
    documentos: ['CI', 'Certificado de Nacimiento', 'Certificado de Trabajo']
  },
  {
    id: 'ENC-002',
    nombres: 'Carlos Alberto',
    apellidos: 'Ruiz Mendoza',
    carnet: '87654321',
    fechaNacimiento: '1980-07-22',
    edad: 44,
    telefono: '+591 72345678',
    telefonoSecundario: '+591 73456789',
    email: 'carlos.ruiz@email.com',
    direccion: 'Calle Sucre, #567, Zona Centro, Cochabamba',
    ciudad: 'Cochabamba',
    departamento: 'Cochabamba',
    ocupacion: 'Ingeniero Civil',
    lugarTrabajo: 'Constructora Andina S.A.',
    telefonoTrabajo: '+591 42456789',
    emailTrabajo: 'cruiz@constructoraandina.bo',
    tipoRelacion: 'Padre',
    ninosACargo: ['Ana Torres Guzmán'],
    estado: 'Activo',
    fechaRegistro: '2019-08-10',
    observaciones: 'Padre comprometido con la educación de su hija.',
    documentos: ['CI', 'Certificado de Nacimiento', 'Título Profesional']
  },
  {
    id: 'ENC-003',
    nombres: 'Sofía Patricia',
    apellidos: 'Vargas Mamani',
    carnet: '11223344',
    fechaNacimiento: '1988-11-08',
    edad: 36,
    telefono: '+591 73456789',
    telefonoSecundario: '+591 74567890',
    email: 'sofia.vargas@email.com',
    direccion: 'Barrio Minero, #890, Zona Norte, Oruro',
    ciudad: 'Oruro',
    departamento: 'Oruro',
    ocupacion: 'Profesora de Educación Física',
    lugarTrabajo: 'Colegio Nacional Oruro',
    telefonoTrabajo: '+591 52456789',
    emailTrabajo: 'svargas@colegiooruro.edu.bo',
    tipoRelacion: 'Tía',
    ninosACargo: ['Luis Gómez Mamani'],
    estado: 'Activo',
    fechaRegistro: '2021-03-20',
    observaciones: 'Tía muy dedicada, apoya en actividades deportivas.',
    documentos: ['CI', 'Certificado de Nacimiento', 'Título de Profesora']
  },
  {
    id: 'ENC-004',
    nombres: 'Juana María',
    apellidos: 'de Arco Flores',
    carnet: '55667788',
    fechaNacimiento: '1975-05-30',
    edad: 49,
    telefono: '+591 74567890',
    telefonoSecundario: '+591 75678901',
    email: 'juana.arco@email.com',
    direccion: 'Zona Norte, #234, Barrio San Francisco, Potosí',
    ciudad: 'Potosí',
    departamento: 'Potosí',
    ocupacion: 'Enfermera',
    lugarTrabajo: 'Hospital General Potosí',
    telefonoTrabajo: '+591 62456789',
    emailTrabajo: 'jarco@hospitalpotosi.bo',
    tipoRelacion: 'Abuela',
    ninosACargo: ['Sofía Mendez Roca'],
    estado: 'Activo',
    fechaRegistro: '2022-01-05',
    observaciones: 'Abuela cariñosa, con experiencia en cuidado de niños.',
    documentos: ['CI', 'Certificado de Nacimiento', 'Título de Enfermera']
  },
  {
    id: 'ENC-005',
    nombres: 'Pedro Alejandro',
    apellidos: 'Pascal Rojas',
    carnet: '99887766',
    fechaNacimiento: '1982-01-12',
    edad: 42,
    telefono: '+591 75678901',
    telefonoSecundario: '+591 76789012',
    email: 'pedro.pascal@email.com',
    direccion: 'Centro Histórico, #456, Zona Colonial, Sucre',
    ciudad: 'Sucre',
    departamento: 'Chuquisaca',
    ocupacion: 'Abogado',
    lugarTrabajo: 'Estudio Jurídico Pascal & Asociados',
    telefonoTrabajo: '+591 64456789',
    emailTrabajo: 'ppascal@estudiopascal.bo',
    tipoRelacion: 'Padre',
    ninosACargo: ['Mateo Rojas Vidal'],
    estado: 'Activo',
    fechaRegistro: '2020-06-15',
    observaciones: 'Padre abogado, muy cuidadoso con la documentación legal.',
    documentos: ['CI', 'Certificado de Nacimiento', 'Título de Abogado', 'Matrícula Profesional']
  },
  {
    id: 'ENC-006',
    nombres: 'Roberto Carlos',
    apellidos: 'Flores Castillo',
    carnet: '44332211',
    fechaNacimiento: '1978-09-18',
    edad: 46,
    telefono: '+591 76789012',
    telefonoSecundario: '+591 77890123',
    email: 'roberto.flores@email.com',
    direccion: 'Plan 3000, #789, Barrio San Ignacio, Santa Cruz',
    ciudad: 'Santa Cruz',
    departamento: 'Santa Cruz',
    ocupacion: 'Empresario',
    lugarTrabajo: 'Flores & Asociados S.A.',
    telefonoTrabajo: '+591 33456789',
    emailTrabajo: 'rflores@floresasociados.bo',
    tipoRelacion: 'Tío',
    ninosACargo: ['Lucía Flores Castillo'],
    estado: 'Activo',
    fechaRegistro: '2018-11-30',
    observaciones: 'Tío empresario, apoya económicamente en la educación.',
    documentos: ['CI', 'Certificado de Nacimiento', 'Licencia Comercial']
  },
  {
    id: 'ENC-007',
    nombres: 'Mónica Patricia',
    apellidos: 'Heredia Vargas',
    carnet: '33221100',
    fechaNacimiento: '1983-12-03',
    edad: 41,
    telefono: '+591 77890123',
    telefonoSecundario: '+591 78901234',
    email: 'monica.heredia@email.com',
    direccion: 'Barrio San Roque, #123, Zona Sur, Tarija',
    ciudad: 'Tarija',
    departamento: 'Tarija',
    ocupacion: 'Psicóloga',
    lugarTrabajo: 'Centro de Psicología Infantil',
    telefonoTrabajo: '+591 66456789',
    emailTrabajo: 'mheredia@psicologiainfantil.bo',
    tipoRelacion: 'Madre',
    ninosACargo: ['Hugo Vargas Llosa'],
    estado: 'Inactivo',
    fechaRegistro: '2019-04-12',
    observaciones: 'Madre psicóloga, especializada en desarrollo infantil.',
    documentos: ['CI', 'Certificado de Nacimiento', 'Título de Psicóloga']
  }
];

const uniqueEstados = [...new Set(mockEncargados.map(e => e.estado))];
const uniqueRelaciones = [...new Set(mockEncargados.map(e => e.tipoRelacion))];
const ENCARGADOS_PER_PAGE = 6;

const departamentos = ['La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí', 'Chuquisaca', 'Tarija', 'Beni', 'Pando'];
const relaciones = ['Madre', 'Padre', 'Tía', 'Tío', 'Abuela', 'Abuelo', 'Hermana', 'Hermano', 'Tutor Legal'];

const getStatusColor = (estado) => {
  switch (estado) {
    case 'Activo': return 'bg-green-100 text-green-700';
    case 'Inactivo': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getRelacionColor = (relacion) => {
  switch (relacion) {
    case 'Madre': return 'bg-pink-100 text-pink-700';
    case 'Padre': return 'bg-blue-100 text-blue-700';
    case 'Tía': return 'bg-purple-100 text-purple-700';
    case 'Tío': return 'bg-indigo-100 text-indigo-700';
    case 'Abuela': return 'bg-orange-100 text-orange-700';
    case 'Abuelo': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const fechaNac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  return edad;
};

const Encargados = () => {
  const [encargados, setEncargados] = useState(mockEncargados);
  const [selectedEncargado, setSelectedEncargado] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeStatusFilters, setActiveStatusFilters] = useState([]);
  const [activeRelacionFilters, setActiveRelacionFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Estado del formulario de agregar encargado
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    carnet: '',
    fechaNacimiento: '',
    telefono: '',
    telefonoSecundario: '',
    email: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    ocupacion: '',
    lugarTrabajo: '',
    telefonoTrabajo: '',
    emailTrabajo: '',
    tipoRelacion: '',
    estado: 'Activo',
    observaciones: ''
  });

  const handleViewDetails = (encargado) => setSelectedEncargado(encargado);
  const closeModal = () => setSelectedEncargado(null);
  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData({
      nombres: '',
      apellidos: '',
      carnet: '',
      fechaNacimiento: '',
      telefono: '',
      telefonoSecundario: '',
      email: '',
      direccion: '',
      ciudad: '',
      departamento: '',
      ocupacion: '',
      lugarTrabajo: '',
      telefonoTrabajo: '',
      emailTrabajo: '',
      tipoRelacion: '',
      estado: 'Activo',
      observaciones: ''
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
    const newId = `ENC-${String(encargados.length + 1).padStart(3, '0')}`;
    
    // Crear nuevo encargado
    const nuevoEncargado = {
      ...formData,
      id: newId,
      edad: calcularEdad(formData.fechaNacimiento),
      ninosACargo: [],
      fechaRegistro: new Date().toISOString().split('T')[0],
      documentos: ['CI']
    };

    // Agregar a la lista
    setEncargados(prev => [nuevoEncargado, ...prev]);
    
    // Cerrar modal y limpiar formulario
    closeAddModal();
    
    // Mostrar mensaje de éxito (en una implementación real)
    alert('Encargado agregado exitosamente');
  };

  const resetFilters = () => {
    setActiveStatusFilters([]);
    setActiveRelacionFilters([]);
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

  const handleRelacionFilterChange = (relacion) => {
    setCurrentPage(1);
    setActiveRelacionFilters(prev =>
      prev.includes(relacion)
        ? prev.filter(f => f !== relacion)
        : [...prev, relacion]
    );
  };

  const encargadosFiltrados = encargados
    .filter(e => activeStatusFilters.length === 0 || activeStatusFilters.includes(e.estado))
    .filter(e => activeRelacionFilters.length === 0 || activeRelacionFilters.includes(e.tipoRelacion))
    .filter(e => 
      e.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.carnet.includes(searchTerm) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const indexOfLastEncargado = currentPage * ENCARGADOS_PER_PAGE;
  const indexOfFirstEncargado = indexOfLastEncargado - ENCARGADOS_PER_PAGE;
  const currentEncargados = encargadosFiltrados.slice(indexOfFirstEncargado, indexOfLastEncargado);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Encargados</h1>
            <p className="text-gray-600 mt-2">
              Administra la información de todos los encargados y tutores registrados.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Buscar por nombre, carnet, email o ciudad..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400" />
          <button onClick={resetFilters} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
            Limpiar Filtros
          </button>
          <button onClick={openAddModal} className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            + Agregar Encargado
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 flex-wrap mb-4">
            <span className="font-medium text-gray-600">Filtrar por estado:</span>
            {uniqueEstados.map(estado => (
              <label key={estado} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
                <input type="checkbox" checked={activeStatusFilters.includes(estado)} onChange={() => handleStatusFilterChange(estado)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                <span className="text-sm font-medium text-gray-700">{estado}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-medium text-gray-600">Filtrar por relación:</span>
            {uniqueRelaciones.map(relacion => (
              <label key={relacion} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
                <input type="checkbox" checked={activeRelacionFilters.includes(relacion)} onChange={() => handleRelacionFilterChange(relacion)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                <span className="text-sm font-medium text-gray-700">{relacion}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentEncargados.map(encargado => (
          <div key={encargado.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {encargado.nombres} {encargado.apellidos}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(encargado.estado)}`}>
                      {encargado.estado}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Carnet: {encargado.carnet}</p>
                  <p className="text-sm text-gray-500 mb-1">Edad: {calcularEdad(encargado.fechaNacimiento)} años</p>
                  <p className="text-sm text-gray-500">Ocupación: {encargado.ocupacion}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Relación:</p>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getRelacionColor(encargado.tipoRelacion)}`}>
                    {encargado.tipoRelacion}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contacto:</p>
                  <p className="text-sm font-medium text-gray-700">{encargado.telefono}</p>
                  <p className="text-sm font-medium text-gray-700">{encargado.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ubicación:</p>
                  <p className="text-sm font-medium text-gray-700">{encargado.ciudad}, {encargado.departamento}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1 text-sm text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    {encargado.ninosACargo.length} niño(s)
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    {encargado.ocupacion}
                  </span>
                </div>
                <button onClick={() => handleViewDetails(encargado)} className="font-medium text-teal-600 hover:underline">
                  Ver Detalles
                </button>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Niños a cargo:</p>
                <div className="flex flex-wrap gap-1">
                  {encargado.ninosACargo.map((nino, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {nino}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentEncargados.length === 0 && <p className="text-center text-gray-500 py-10">No se encontraron encargados con los filtros seleccionados.</p>}

      <Pagination itemsPerPage={ENCARGADOS_PER_PAGE} totalItems={encargadosFiltrados.length} paginate={paginate} currentPage={currentPage} />

      {selectedEncargado && (
        <Modal isOpen={!!selectedEncargado} onClose={closeModal}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Perfil Completo - {selectedEncargado.nombres} {selectedEncargado.apellidos}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna 1: Información personal */}
              <div className="lg:col-span-1">
                <div className="text-center mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedEncargado.nombres} {selectedEncargado.apellidos}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedEncargado.estado)}`}>
                    {selectedEncargado.estado}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Información Personal</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Carnet:</strong> {selectedEncargado.carnet}</p>
                      <p><strong>Fecha Nacimiento:</strong> {selectedEncargado.fechaNacimiento}</p>
                      <p><strong>Edad:</strong> {calcularEdad(selectedEncargado.fechaNacimiento)} años</p>
                      <p><strong>Relación:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRelacionColor(selectedEncargado.tipoRelacion)}`}>{selectedEncargado.tipoRelacion}</span></p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Información Laboral</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Ocupación:</strong> {selectedEncargado.ocupacion}</p>
                      <p><strong>Lugar de Trabajo:</strong> {selectedEncargado.lugarTrabajo}</p>
                      <p><strong>Teléfono Trabajo:</strong> {selectedEncargado.telefonoTrabajo}</p>
                      <p><strong>Email Trabajo:</strong> {selectedEncargado.emailTrabajo}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna 2: Información de contacto y ubicación */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Información de Contacto</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Teléfono Principal:</p>
                      <p className="font-medium text-gray-700">{selectedEncargado.telefono}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono Secundario:</p>
                      <p className="font-medium text-gray-700">{selectedEncargado.telefonoSecundario}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Email Personal:</p>
                      <p className="font-medium text-gray-700">{selectedEncargado.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Ubicación y Domicilio</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Dirección Completa:</p>
                      <p className="font-medium text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedEncargado.direccion}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Ciudad:</p>
                        <p className="font-medium text-gray-700">{selectedEncargado.ciudad}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Departamento:</p>
                        <p className="font-medium text-gray-700">{selectedEncargado.departamento}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Niños a Cargo</h4>
                  <div className="space-y-2">
                    {selectedEncargado.ninosACargo.map((nino, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium text-gray-700">{nino}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Documentos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedEncargado.documentos.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Información Adicional</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Fecha de Registro:</p>
                      <p className="font-medium text-gray-700">{selectedEncargado.fechaRegistro}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Observaciones:</p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-700">{selectedEncargado.observaciones}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={closeAddModal}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Agregar Nuevo Encargado</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombres" className="text-sm font-medium text-gray-700">Nombres</label>
                  <input type="text" id="nombres" name="nombres" value={formData.nombres} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label htmlFor="apellidos" className="text-sm font-medium text-gray-700">Apellidos</label>
                  <input type="text" id="apellidos" name="apellidos" value={formData.apellidos} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label htmlFor="carnet" className="text-sm font-medium text-gray-700">Carnet</label>
                  <input type="text" id="carnet" name="carnet" value={formData.carnet} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label htmlFor="fechaNacimiento" className="text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label htmlFor="telefono" className="text-sm font-medium text-gray-700">Teléfono</label>
                  <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label htmlFor="telefonoSecundario" className="text-sm font-medium text-gray-700">Teléfono Secundario</label>
                  <input type="text" id="telefonoSecundario" name="telefonoSecundario" value={formData.telefonoSecundario} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label htmlFor="direccion" className="text-sm font-medium text-gray-700">Dirección</label>
                  <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label htmlFor="ciudad" className="text-sm font-medium text-gray-700">Ciudad</label>
                  <input type="text" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label htmlFor="departamento" className="text-sm font-medium text-gray-700">Departamento</label>
                  <input type="text" id="departamento" name="departamento" value={formData.departamento} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label htmlFor="ocupacion" className="text-sm font-medium text-gray-700">Ocupación</label>
                  <input type="text" id="ocupacion" name="ocupacion" value={formData.ocupacion} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label htmlFor="lugarTrabajo" className="text-sm font-medium text-gray-700">Lugar de Trabajo</label>
                  <input type="text" id="lugarTrabajo" name="lugarTrabajo" value={formData.lugarTrabajo} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label htmlFor="telefonoTrabajo" className="text-sm font-medium text-gray-700">Teléfono Trabajo</label>
                  <input type="text" id="telefonoTrabajo" name="telefonoTrabajo" value={formData.telefonoTrabajo} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label htmlFor="emailTrabajo" className="text-sm font-medium text-gray-700">Email Trabajo</label>
                  <input type="email" id="emailTrabajo" name="emailTrabajo" value={formData.emailTrabajo} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label htmlFor="tipoRelacion" className="text-sm font-medium text-gray-700">Relación</label>
                  <select id="tipoRelacion" name="tipoRelacion" value={formData.tipoRelacion} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500">
                    <option value="">Seleccionar relación</option>
                    {relaciones.map(relacion => (
                      <option key={relacion} value={relacion}>{relacion}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="estado" className="text-sm font-medium text-gray-700">Estado</label>
                  <select id="estado" name="estado" value={formData.estado} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500">
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="observaciones" className="text-sm font-medium text-gray-700">Observaciones</label>
                  <textarea id="observaciones" name="observaciones" value={formData.observaciones} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-teal-500 focus:border-teal-500" />
                </div>
              </div>
              <button type="submit" className="mt-4 w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md">
                Agregar Encargado
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Encargados;
