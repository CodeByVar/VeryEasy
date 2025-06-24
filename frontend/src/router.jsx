// src/router.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Layout
import AdminLayout from './components/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import Ninos from './pages/Ninos';
import Encargados from './pages/Encargados';
import PaginaPermisos from './pages/PaginaPermisos';
import Usuarios from './pages/Usuarios';
import Ajustes from './pages/Ajustes';
import Viajes from './pages/Viajes';
import Reportes from './pages/Reportes';
import CrearPermiso from './pages/CrearPermiso';
import CrearViaje from './pages/CrearViaje';

// import DashboardPage from './pages/DashboardPage'; // Y esta después

// Define las rutas de tu aplicación
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    // Si la HomePage tuviera sub-rutas, irían aquí en 'children'
  },
  {
    path: '/login',
    // ELEMENTO: Asegúrate de que LoginPage.jsx esté creado en src/pages/LoginPage.jsx
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'ninos',
        element: <Ninos />,
      },
      {
        path: 'encargados',
        element: <Encargados />,
      },
      {
        path: 'permisos',
        element: <PaginaPermisos />,
      },
      {
        path: 'permisos/crear',
        element: <CrearPermiso />,
      },
      {
        path: 'usuarios',
        element: <Usuarios />,
      },
      {
        path: 'ajustes',
        element: <Ajustes />,
      },
      {
        path: 'viajes',
        element: <Viajes />,
      },
      {
        path: 'viajes/crear',
        element: <CrearViaje />,
      },
      {
        path: 'reportes',
        element: <Reportes />,
      }
    ],
  },
  // Opcional: Ruta para 404 Not Found
  {
    path: '*',
    element: <h1 className="text-4xl text-center mt-20">404 - Página No Encontrada</h1>,
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;