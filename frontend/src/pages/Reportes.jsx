import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';

// --- Datos Mock para los Reportes ---

// Reporte 1: Permisos Aprobados vs. Rechazados por Mes
const permisosMensuales = [
  { mes: 'Ene', Aprobados: 20, Rechazados: 5 },
  { mes: 'Feb', Aprobados: 30, Rechazados: 8 },
  { mes: 'Mar', Aprobados: 45, Rechazados: 12 },
  { mes: 'Abr', Aprobados: 40, Rechazados: 10 },
  { mes: 'May', Aprobados: 50, Rechazados: 15 },
  { mes: 'Jun', Aprobados: 60, Rechazados: 7 },
];

// Reporte 2: Distribución de estados de todos los permisos
const distribucionEstados = [
  { name: 'Aprobados', value: 245 },
  { name: 'Pendientes', value: 45 },
  { name: 'Rechazados', value: 57 },
];
const ESTADOS_COLORS = ['#34d399', '#fbbf24', '#f87171'];

// --- Datos Mock para los Reportes de Permisos Rechazados ---
const reportesRechazados = [
  {
    id: 'P-001',
    nino: 'Ana Torres Guzmán',
    destino: 'Cochabamba',
    motivo: 'Documento Inválido',
    observacion: 'El carnet de identidad del encargado ha expirado. Se requiere un documento vigente para procesar la solicitud.',
    fecha: '2024-06-15',
    encargado: 'Carlos Ruiz',
  },
  {
    id: 'P-002',
    nino: 'Luis Gómez Mamani',
    destino: 'Santa Cruz',
    motivo: 'Falta de Autorización',
    observacion: 'No se adjuntó la autorización del segundo progenitor. Es un requisito indispensable para viajes fuera del departamento.',
    fecha: '2024-06-18',
    encargado: 'Sofía Vargas',
  },
  {
    id: 'P-003',
    nino: 'Sofía Mendez Roca',
    destino: 'Tarija',
    motivo: 'Documento Inválido',
    observacion: 'El certificado de nacimiento del niño no es legible. Por favor, suba una copia clara.',
    fecha: '2024-06-20',
    encargado: 'Juana de Arco',
  },
  {
    id: 'P-004',
    nino: 'Mateo Rojas Vidal',
    destino: 'La Paz',
    motivo: 'Datos Inconsistentes',
    observacion: 'El nombre del encargado en el formulario no coincide con el nombre en el documento de identidad adjunto.',
    fecha: '2024-06-22',
    encargado: 'Pedro Pascal',
  },
  {
    id: 'P-005',
    nino: 'Lucía Flores Castillo',
    destino: 'Beni',
    motivo: 'Falta de Autorización',
    observacion: 'La autorización de viaje no está notariada como lo exige la normativa vigente para viajes interdepartamentales.',
    fecha: '2024-06-23',
    encargado: 'Roberto Carlos',
  },
  {
    id: 'P-006',
    nino: 'Hugo Vargas Llosa',
    destino: 'Oruro',
    motivo: 'Datos Inconsistentes',
    observacion: 'La fecha de viaje indicada en el formulario (25/07/2024) no coincide con la del pasaje adjunto (28/07/2024).',
    fecha: '2024-06-24',
    encargado: 'Mónica Heredia',
  },
  {
    id: 'P-007',
    nino: 'Carla Nuñez del Prado',
    destino: 'Potosí',
    motivo: 'Vínculo no comprobado',
    observacion: 'El documento presentado no acredita de forma clara el vínculo de parentesco entre el encargado y el niño.',
    fecha: '2024-06-25',
    encargado: 'Esteban Quito',
  },
  {
    id: 'P-008',
    nino: 'Daniel Soliz Rada',
    destino: 'Sucre',
    motivo: 'Documento Inválido',
    observacion: 'La fotografía del documento de identidad del niño está muy deteriorada y no permite una identificación facial clara.',
    fecha: '2024-06-26',
    encargado: 'Gabriela Mistral',
  },
];

const uniqueMotivos = [...new Set(reportesRechazados.map(r => r.motivo))];
const REPORTS_PER_PAGE = 5;

// Función para asignar un color a cada etiqueta de motivo
const getTagColor = (motivo) => {
  switch (motivo) {
    case 'Documento Inválido':
      return 'bg-red-100 text-red-700';
    case 'Falta de Autorización':
      return 'bg-yellow-100 text-yellow-700';
    case 'Datos Inconsistentes':
      return 'bg-purple-100 text-purple-700';
    case 'Vínculo no comprobado':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// --- Componente Principal de Reportes ---

const Reportes = () => {
  const [activeStatusFilters, setActiveStatusFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  
  const handleViewDetails = (reporte) => setSelectedReport(reporte);
  const closeModal = () => setSelectedReport(null);

  const resetFilters = () => {
    setActiveStatusFilters([]);
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (motivo) => {
    setCurrentPage(1);
    setActiveStatusFilters(prev =>
      prev.includes(motivo)
        ? prev.filter(f => f !== motivo)
        : [...prev, motivo]
    );
  };

  const reportesFiltrados = reportesRechazados
    .filter(r => activeStatusFilters.length === 0 || activeStatusFilters.includes(r.motivo))
    .filter(r => r.nino.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(r => {
      if (!startDate && !endDate) return true;
      const reportDate = new Date(r.fecha);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && end) return reportDate >= start && reportDate <= end;
      if (start) return reportDate >= start;
      if (end) return reportDate <= end;
      return true;
    });

  const indexOfLastReport = currentPage * REPORTS_PER_PAGE;
  const indexOfFirstReport = indexOfLastReport - REPORTS_PER_PAGE;
  const currentReports = reportesFiltrados.slice(indexOfFirstReport, indexOfLastReport);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Centro de Reportes</h1>
        <div className="flex gap-3">
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generar Reporte
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition shadow-sm hover:shadow-md">
            Exportar Todo (PDF)
          </button>
        </div>
      </div>

      {/* Grid de Reportes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card: Reporte de Permisos Mensuales */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Reporte de Permisos Mensuales</h2>
            <p className="text-sm text-gray-500 mt-1">
              Visualiza la comparación entre permisos aprobados y rechazados cada mes.
            </p>
          </div>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={permisosMensuales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Aprobados" stackId="a" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Rechazados" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-right">
            <button className="text-teal-600 hover:underline font-medium">Ver detalles</button>
          </div>
        </div>

        {/* Card: Distribución de Estados de Permisos */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Distribución de Estados de Permisos</h2>
            <p className="text-sm text-gray-500 mt-1">
              Un resumen del estado general de todos los permisos registrados en el sistema.
            </p>
          </div>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribucionEstados}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {distribucionEstados.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ESTADOS_COLORS[index % ESTADOS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
           <div className="mt-4 text-right">
            <button className="text-teal-600 hover:underline font-medium">Ver detalles</button>
          </div>
        </div>

      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reportes de Permisos Rechazados</h2>
        <p className="text-gray-600 mb-6">
          Utiliza los filtros para encontrar reportes específicos por nombre, fecha o estado del permiso.
        </p>

        {/* Panel de Filtros */}
        <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search-name" className="block text-sm font-medium text-gray-600 mb-1">Buscar por nombre</label>
              <input
                id="search-name"
                type="text"
                placeholder="Escriba un nombre..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-600 mb-1">Desde</label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-600 mb-1">Hasta</label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">&nbsp;</label>
              <button onClick={resetFilters} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
                Limpiar Filtros
              </button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 flex-wrap">
            <span className="font-medium text-gray-600">Filtrar por estado:</span>
            {uniqueMotivos.map(motivo => (
              <label key={motivo} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={activeStatusFilters.includes(motivo)}
                  onChange={() => handleStatusFilterChange(motivo)}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">{motivo}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Lista de Tarjetas de Reporte */}
        <div className="space-y-6">
          {currentReports.length > 0 ? (
            currentReports.map(reporte => (
              <div key={reporte.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      <span className="text-gray-400 font-medium">#{reporte.id}</span> - Viaje de {reporte.nino} a {reporte.destino}
                    </h3>
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mt-1">
                      <span>Fecha: <span className="font-medium text-gray-700">{reporte.fecha}</span></span>
                      <span>Encargado: <span className="font-medium text-gray-700">{reporte.encargado}</span></span>
                    </div>
                  </div>
                  <span className={`mt-2 sm:mt-0 px-3 py-1 text-xs font-semibold rounded-full ${getTagColor(reporte.motivo)} h-fit`}>
                    {reporte.motivo}
                  </span>
                </div>
                <p className="mt-4 text-gray-600 border-l-4 border-gray-200 pl-4">
                  {reporte.observacion}
                </p>
                <div className="mt-4 text-right">
                  <button onClick={() => handleViewDetails(reporte)} className="font-medium text-teal-600 hover:underline">
                    Ver a detalle
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">No se encontraron reportes con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </div>

      <Pagination itemsPerPage={REPORTS_PER_PAGE} totalItems={reportesFiltrados.length} paginate={paginate} currentPage={currentPage} />

      {selectedReport && (
        <Modal isOpen={!!selectedReport} onClose={closeModal}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Detalle del Reporte #{selectedReport.id}</h2>
          <div className="space-y-3">
            <p><strong className="text-gray-600">Niño:</strong> {selectedReport.nino}</p>
            <p><strong className="text-gray-600">Destino:</strong> {selectedReport.destino}</p>
            <p><strong className="text-gray-600">Encargado:</strong> {selectedReport.encargado}</p>
            <p><strong className="text-gray-600">Fecha del Rechazo:</strong> {selectedReport.fecha}</p>
            <div className="p-3 bg-red-50 rounded-lg">
              <p><strong className="text-red-700">Motivo del Rechazo:</strong> {selectedReport.motivo}</p>
              <p className="mt-1 text-red-900">{selectedReport.observacion}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Reportes; 