// src/router.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Importa tus componentes de página
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'; // La crearemos en el siguiente paso 
// import LoginPage from './pages/LoginPage'; // La crearemos en el siguiente paso

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
    path: '/dashboard',
    // Por ahora, un placeholder. Crearemos DashboardPage.jsx después.
    element: <div>Página del Sistema/Dashboard (próximamente)</div>,
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