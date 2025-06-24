import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Mock de permisos para mostrar en la tabla
const mockPermisos = [
  {
    id: 1,
    nino: 'Juan Pérez',
    encargado: 'María López',
    fecha: '2024-06-01',
    estado: 'Aprobado',
  },
  {
    id: 2,
    nino: 'Ana Torres',
    encargado: 'Carlos Ruiz',
    fecha: '2024-06-02',
    estado: 'Pendiente',
  },
  {
    id: 3,
    nino: 'Luis Gómez',
    encargado: 'Sofía Vargas',
    fecha: '2024-06-03',
    estado: 'Rechazado',
  },
];

const sidebarLinks = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Niños', path: '/ninos' },
  { label: 'Encargados', path: '/encargados' },
  { label: 'Permisos', path: '/permisos' },
  { label: 'Usuarios', path: '/usuarios' },
  { label: 'Ajustes', path: '/ajustes' },
];

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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col py-6 px-4 shadow-sm">
        <div className="mb-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl">A</div>
          <div>
            <div className="font-semibold text-gray-800">{user.username}</div>
            <div className="text-xs text-gray-500">Administrador</div>
          </div>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {sidebarLinks.map(link => (
              <li key={link.label}>
                <button
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-teal-100 text-gray-700 font-medium transition"
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition"
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b flex items-center px-8 justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Panel de Permisos de Viaje</h1>
            <input
              type="text"
              placeholder="Buscar permiso, niño, encargado..."
              className="ml-6 px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium">{user.email}</span>
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>

        {/* Main table/list */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Permisos de Viaje</h2>
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold transition">+ Nuevo Permiso</button>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Niño</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Encargado</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {mockPermisos.map((permiso) => (
                  <tr key={permiso.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{permiso.nino}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{permiso.encargado}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{permiso.fecha}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        permiso.estado === 'Aprobado' ? 'bg-green-100 text-green-700' :
                        permiso.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {permiso.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button className="text-blue-600 hover:underline text-sm">Ver</button>
                      <button className="text-teal-600 hover:underline text-sm">Editar</button>
                      <button className="text-red-500 hover:underline text-sm">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Adminpage;
