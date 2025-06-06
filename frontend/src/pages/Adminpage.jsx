import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const Adminpage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Protección de ruta - si no hay usuario autenticado, redirige al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de navegación */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-700">
                Bienvenido, {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Grid de tarjetas de acceso rápido */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Tarjeta de Gestión de Niños */}
            <div onClick={() => navigate('/ninos')} className="bg-white overflow-hidden shadow-sm rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">Gestión de Niños</h2>
                    <p className="text-sm text-gray-500">Administrar registros de niños</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta de Gestión de Encargados */}
            <div onClick={() => navigate('/encargados')} className="bg-white overflow-hidden shadow-sm rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">Gestión de Encargados</h2>
                    <p className="text-sm text-gray-500">Administrar encargados y tutores</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta de Gestión de Permisos */}
            <div onClick={() => navigate('/permisos')} className="bg-white overflow-hidden shadow-sm rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">Gestión de Permisos</h2>
                    <p className="text-sm text-gray-500">Administrar permisos y autorizaciones</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Estadísticas */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Resumen del Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Total Niños</p>
                <p className="text-2xl font-semibold text-blue-800">0</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Total Encargados</p>
                <p className="text-2xl font-semibold text-green-800">0</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600">Permisos Activos</p>
                <p className="text-2xl font-semibold text-purple-800">0</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Adminpage;
