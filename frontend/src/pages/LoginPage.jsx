// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import Button from '../components/ui/Button'; // Importa tu componente Button
import Input from '../components/ui/Input';   // Importa tu componente Input
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';

// Opcional: Instala Font Awesome para los iconos si no lo tienes:
// npm install --save @fortawesome/fontawesome-svg-core @fortawesome/free-brands-svg-icons @fortawesome/react-fontawesome

function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false); // true para Registrarse, false para Iniciar Sesión

  // Estados para el formulario de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados para el formulario de Registro
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Simulación de envío de formularios (aquí es donde integrarías Axios)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Intentando iniciar sesión con:', { email: loginEmail, password: loginPassword });
    // Aquí llamarías a tu servicio de autenticación con Axios
    // userService.login({ email: loginEmail, password: loginPassword })
    //   .then(response => { /* ... manejar éxito ... */ })
    //   .catch(error => { /* ... manejar error ... */ });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log('Intentando registrarse con:', { name: registerName, email: registerEmail, password: registerPassword });
    // Aquí llamarías a tu servicio de registro con Axios
    // userService.register({ name: registerName, email: registerEmail, password: registerPassword })
    //   .then(response => { /* ... manejar éxito ... */ })
    //   .catch(error => { /* ... manejar error ... */ });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
      <div
        className={`
          relative w-full max-w-4xl h-[500px] bg-white rounded-2xl shadow-xl overflow-hidden
          flex transition-all duration-700 ease-in-out
        `}
      >
        {/* Panel Izquierdo (¡Hola! / ¡Bienvenido!) */}
        <div
          className={`
            absolute top-0 left-0 h-full w-1/2 bg-gradient-to-br from-teal-500 to-green-600 text-white
            flex flex-col items-center justify-center p-8 text-center rounded-l-2xl
            transition-transform duration-700 ease-in-out z-20
            ${isRegistering ? 'translate-x-full rounded-r-2xl' : 'translate-x-0 rounded-l-2xl'}
          `}
        >
          {isRegistering ? (
            <>
              <h2 className="text-4xl font-bold mb-4">¡Bienvenido!</h2>
              <p className="text-lg mb-6">
                Ingrese sus datos personales para utilizar todas las funciones del sitio
              </p>
              <Button
                onClick={() => setIsRegistering(false)}
                variant="outline" // Utiliza tu variante outline si la definiste en Button.jsx
                className="text-white border-white hover:bg-white hover:text-green-600"
              >
                Iniciar Sesión
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold mb-4">¡Hola!</h2>
              <p className="text-lg mb-6">
                Regístrese con sus datos personales para utilizar todas las funciones del sitio
              </p>
              <Button
                onClick={() => setIsRegistering(true)}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-green-600"
              >
                Registrarse
              </Button>
            </>
          )}
        </div>

        {/* Formularios (Login / Registrarse) */}
        <div
          className={`
            absolute top-0 h-full w-1/2 bg-white flex flex-col items-center justify-center p-8
            transition-transform duration-700 ease-in-out z-10
            ${isRegistering ? 'translate-x-full' : 'translate-x-0'}
          `}
        >
          {/* Formulario de Iniciar Sesión */}
          <div className={`${isRegistering ? 'hidden' : 'block'} w-full`}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Iniciar Sesión</h2>

            {/* Iconos de Redes Sociales */}
            <div className="flex justify-center space-x-4 mb-6">
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition">
                <FontAwesomeIcon icon={faFacebookF} size="lg" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition">
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>
            </div>

            <p className="text-sm text-gray-600 mb-4">Usa tu correo y contraseña</p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="loginEmail" className="sr-only">Email</label>
                <Input
                  id="loginEmail"
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="bg-gray-100 border-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="loginPassword" className="sr-only">Contraseña</label>
                <Input
                  id="loginPassword"
                  type="password"
                  placeholder="Contraseña"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="bg-gray-100 border-none"
                  required
                />
              </div>
              <a href="#" className="text-sm text-blue-600 hover:underline block text-right">
                ¿Olvidaste tu contraseña?
              </a>
              <Button type="submit" variant="primary" className="w-full mt-6">
                Iniciar Sesión
              </Button>
            </form>
          </div>

          {/* Formulario de Registrarse */}
          <div className={`${isRegistering ? 'block' : 'hidden'} w-full`}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Registrarse</h2>

            {/* Iconos de Redes Sociales */}
            <div className="flex justify-center space-x-4 mb-6">
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition">
                <FontAwesomeIcon icon={faFacebookF} size="lg" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition">
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>
            </div>

            <p className="text-sm text-gray-600 mb-4">Usa tu correo electrónico para registrarse</p>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label htmlFor="registerName" className="sr-only">Nombre</label>
                <Input
                  id="registerName"
                  type="text"
                  placeholder="Nombre"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="bg-gray-100 border-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="registerEmail" className="sr-only">Email</label>
                <Input
                  id="registerEmail"
                  type="email"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="bg-gray-100 border-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="registerPassword" className="sr-only">Contraseña</label>
                <Input
                  id="registerPassword"
                  type="password"
                  placeholder="Contraseña"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="bg-gray-100 border-none"
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full mt-6">
                Registrarse
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;