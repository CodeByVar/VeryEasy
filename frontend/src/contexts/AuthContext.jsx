import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

// Usuario administrador simulado
const mockAdminUser = {
  id: 1,
  username: 'admin',
  email: 'admin@demo.com',
  role: 'admin',
  token: 'mock-token',
};

export const AuthProvider = ({ children }) => {
  // Inicializa el usuario como admin para pruebas
  const [user, setUser] = useState(mockAdminUser);

  const login = async (credentials) => {
    // Aquí podrías simular login si lo necesitas
    setUser(mockAdminUser);
    localStorage.setItem('token', mockAdminUser.token);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
