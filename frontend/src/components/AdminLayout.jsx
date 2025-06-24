import React from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const sidebarLinks = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Permisos', path: '/admin/permisos' },
  { label: 'Viajes', path: '/admin/viajes' },
  { label: 'Niños', path: '/admin/ninos' },
  { label: 'Encargados', path: '/admin/encargados' },
  { label: 'Usuarios', path: '/admin/usuarios' },
  { label: 'Reportes', path: '/admin/reportes' },
  { label: 'Ajustes', path: '/admin/ajustes' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
          </div>
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
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition ${
                    location.pathname === link.path ? 'bg-teal-100 text-teal-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
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
            <input
              type="text"
              placeholder="Buscar..."
              className="px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium">{user.email}</span>
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* The content of the nested route will be rendered here */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout; 