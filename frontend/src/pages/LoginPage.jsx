// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';
import backgroundImage from '/images/hero_bolivia.jpg';

// Opcional: Instala Font Awesome para los iconos si no lo tienes:
// npm install --save @fortawesome/fontawesome-svg-core @fortawesome/free-brands-svg-icons @fortawesome/react-fontawesome

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  // Estados para el formulario de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados para el formulario de Registro
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const success = await login({
        username: loginEmail,  // El backend espera 'username' en lugar de 'email'
        password: loginPassword
      });
      if (success) {
        navigate('/admin');
      } else {
        setError('Credenciales inválidas'); 
      }
    } catch (err) {
      setError('Error al inicio de sesión');
      console.error('Error de inicio de sesión:', err);
    }
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
    <div className="min-h-screen  bg-[url('/images/hero_bolivia.jpg')] bg-cover bg-center flex items-center justify-center p-4 ">
    <div className="absolute inset-0 bg-teal-500/80 rounded-inherit"></div>



      <div
        className={`
          relative w-full max-w-4xl h-[500px] bg-white rounded-2xl shadow-xl overflow-hidden
          flex transition-all duration-700 ease-in-out
        `}
      >
        {/* Panel de Formularios (Login / Registrarse) */}
        {/* Este panel se moverá a la derecha para revelar el de bienvenida cuando es isRegistering */}
        <div
          className={`
            absolute top-0 left-0 h-full w-1/2 flex flex-col items-center justify-center p-8
            transition-transform duration-700 ease-in-out z-10 bg-white
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
              {error && (
                <div className="text-red-500 text-sm text-center mt-2">{error}</div>
              )}
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

        {/* Panel Derecho (¡Hola! / ¡Bienvenido!) */}
        {/* Este panel se moverá a la izquierda para revelar el formulario cuando es isRegistering */}
        <div
          className={`
           absolute top-0 right-0 h-full w-1/2 bg-gradient-to-br from-teal-500 to-green-800 text-white
           flex flex-col items-center justify-center p-8 text-center
           transition-transform duration-700 ease-in-out z-20
            ${isRegistering ? 'translate-x-[-100%]' : 'translate-x-0'}
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
      </div>
    </div>
  );
}

export default LoginPage;