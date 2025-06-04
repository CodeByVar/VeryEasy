// src/components/Sliderbar.jsx
import React from 'react';
import '.Sliderbar.css'; // Si quieres agregar estilos opcionales

const Sliderbar = () => {
  return (
    <div className="sidebar">
      <h2>Menú</h2>
      <ul>
        <li><a href="#">Encargados</a></li>
        <li><a href="#">niños</a></li>
        <li><a href="#">viajes</a></li>
        <li><a href="#">permisos</a></li> 
        <li><a href="#">reportes</a></li> 
        <li><a href="#">estadisticas</a></li> 
        <li><a href="#">configuracion</a></li> 
        <li><a href="#">salir</a></li>
      </ul>
    </div>
  );
};

export default Sliderbar;

      //<Link to="/" style={linkStyle}>Inicio</Link>
        //<Link to="/encargados" style={linkStyle}>Usuarios</Link>
        //<Link to="/niños" style={linkStyle}>Verificación</Link>
        //<Link to="/viajes" style={linkStyle}>Placas</Link>
        //<Link to="/permisos" style={linkStyle}>Reportes</Link>
        //<Link to="/reportes" style={linkStyle}>Configuración</Link>
        //<Link to="/estadistica" style={linkStyle}>Cerrar Sesión</Link>
        //<Link to="/configuracion" style={linkStyle}>Viajes</Link>
        //<Link to="/cerrar" style={linkStyle}>Estadísticas</Link>