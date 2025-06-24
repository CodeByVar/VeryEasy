import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

// Datos mock para el dashboard
const resumen = {
  totalPermisos: 120,
  aprobados: 80,
  pendientes: 25,
  rechazados: 15,
  totalNinos: 60,
  totalEncargados: 30,
};

const permisosPorMes = [
  { mes: 'Ene', permisos: 10 },
  { mes: 'Feb', permisos: 15 },
  { mes: 'Mar', permisos: 20 },
  { mes: 'Abr', permisos: 18 },
  { mes: 'May', permisos: 22 },
  { mes: 'Jun', permisos: 35 },
];

const estadosPermisos = [
  { name: 'Aprobados', value: resumen.aprobados },
  { name: 'Pendientes', value: resumen.pendientes },
  { name: 'Rechazados', value: resumen.rechazados },
];

const COLORS = ['#34d399', '#fbbf24', '#f87171'];

const DashboardPage = () => {
  const { user, logout } = useAuth();

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Dashboard del Sistema</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center animate-fade-in">
          <span className="text-gray-500 font-medium">Total Permisos</span>
          <span className="text-3xl font-bold text-teal-600 mt-2">{resumen.totalPermisos}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center animate-fade-in">
          <span className="text-gray-500 font-medium">Aprobados</span>
          <span className="text-3xl font-bold text-green-500 mt-2">{resumen.aprobados}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center animate-fade-in">
          <span className="text-gray-500 font-medium">Pendientes</span>
          <span className="text-3xl font-bold text-yellow-500 mt-2">{resumen.pendientes}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center animate-fade-in">
          <span className="text-gray-500 font-medium">Rechazados</span>
          <span className="text-3xl font-bold text-red-500 mt-2">{resumen.rechazados}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center animate-fade-in">
          <span className="text-gray-500 font-medium">Total Niños</span>
          <span className="text-3xl font-bold text-blue-500 mt-2">{resumen.totalNinos}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center animate-fade-in">
          <span className="text-gray-500 font-medium">Total Encargados</span>
          <span className="text-3xl font-bold text-purple-500 mt-2">{resumen.totalEncargados}</span>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de barras */}
        <div className="bg-white rounded-xl shadow p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Permisos por Mes</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={permisosPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="permisos" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Gráfico de pastel */}
        <div className="bg-white rounded-xl shadow p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Distribución de Estados</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={estadosPermisos}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
                isAnimationActive={true}
              >
                {estadosPermisos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

// Animación fade-in con Tailwind (agrega esto a tu CSS global si no lo tienes)
// .animate-fade-in {
//   @apply transition-opacity duration-700 ease-in opacity-0;
//   animation: fadeIn 1s forwards;
// }
// @keyframes fadeIn {
//   to { opacity: 1; }
// } 