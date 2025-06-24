import React from 'react';

const mockUsuarios = [
  { id: 1, nombre: 'admin', email: 'admin@demo.com', rol: 'Administrador' },
  { id: 2, nombre: 'usuario1', email: 'usuario1@email.com', rol: 'Usuario' },
];

const Usuarios = () => (
  <div className="p-8">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
      <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold transition">+ Agregar Usuario</button>
    </div>
    <div className="bg-white rounded-xl shadow p-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Rol</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {mockUsuarios.map((usuario) => (
            <tr key={usuario.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{usuario.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{usuario.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{usuario.rol}</td>
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
  </div>
);

export default Usuarios; 