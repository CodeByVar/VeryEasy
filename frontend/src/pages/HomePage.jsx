// src/pages/HomePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

// Importa tus imágenes directamente si las dejaste en src/assets
// O asegúrate de que las rutas relativas a `public` estén correctas si las moviste allí.
// Ejemplo: import heroBoliviaImg from '../assets/images/hero_bolivia.jpg';

const sectionsContent = [
  {
    id: 'hero',
    image: '/images/hero_bolivia.jpg', // O heroBoliviaImg si importas
    title: 'Desaparecidos en Bolivia',
    subtitle: 'La Búsqueda Silenciosa de un País',
    description: 'Cada día, la esperanza de reunirse con sus seres queridos se desvanece. En Bolivia, la desaparición de niños es una dolorosa realidad que exige nuestra atención y acción.',
    buttonText: 'Conoce la Realidad',
  },
  {
    id: 'problem',
    image: '/images/nino_triste_1.jpg', // O ninoTriste1Img
    title: 'Un Grito de Ausencia',
    subtitle: 'Cifras alarmantes',
    description: 'Miles de niños y adolescentes desaparecen en Bolivia cada año. Son hijos, hermanos, amigos... su ausencia es un vacío inmenso en el corazón de sus familias. Estos no son solo números, son vidas en juego.',
    data: [
      "Más de 2000 niños desaparecidos al año (dato de ejemplo, busca uno real)",
      "Un 60% son niñas y adolescentes (dato de ejemplo)",
      "Solo un 30% son encontrados en las primeras 72 horas (dato de ejemplo)",
    ],
    buttonText: 'Entiende el Impacto',
  },
  {
    id: 'solution',
    image: '/images/verificacion_facial.jpg', // O verificacionFacialImg
    title: 'La Solución: Verificación Biométrica',
    subtitle: 'Inteligencia Facial al Servicio de la Protección',
    description: 'Nuestro proyecto busca fortalecer la verificación de permisos de viaje con inteligencia facial, creando una capa de seguridad esencial para proteger a nuestros niños de la trata y el secuestro.',
    details: [
      "Verificación de identidad en tiempo real.",
      "Integración con bases de datos nacionales.",
      "Alerta temprana ante inconsistencias.",
      "Reducción del riesgo de falsificación de documentos."
    ],
    buttonText: 'Descubre Nuestro Proyecto',
  },
  {
    id: 'action',
    image: '/images/action_bg.jpg', // O actionBgImg
    title: 'Actúa Ahora',
    subtitle: 'Tu Participación es Clave',
    description: 'Juntos podemos construir un futuro más seguro para los niños de Bolivia. Únete a nuestro esfuerzo y sé parte de la solución.',
    buttonText: 'Acceder al Sistema de Verificación',
  },
];

function HomePage() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const navigate = useNavigate();
  const sectionRefs = useRef([]);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    let newIndex = 0;
    for (let i = 0; i < sectionRefs.current.length; i++) {
      const section = sectionRefs.current[i];
      if (section) {
        const sectionTop = section.offsetTop;
        // Cambiar de sección cuando la mitad de la sección esté en la vista
        if (scrollY + windowHeight / 2 >= sectionTop) {
          newIndex = i;
        }
      }
    }
    setCurrentSectionIndex(newIndex);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Llama una vez al montar para establecer la sección inicial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentSection = sectionsContent[currentSectionIndex];

  const handleMainButtonClick = () => {
    if (currentSection.id === 'action') {
      navigate('/login');
    } else {
      const nextIndex = Math.min(currentSectionIndex + 1, sectionsContent.length - 1);
      const nextSectionElement = sectionRefs.current[nextIndex];
      if (nextSectionElement) {
        window.scrollTo({
          top: nextSectionElement.offsetTop,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <div className="relative min-h-screen font-sans">
      {/* Fondo dinámico */}
      <div
        className="fixed inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out -z-10"
        style={{
          backgroundImage: `url(${currentSection.image})`,
          opacity: 1,
        }}
      />

      {/* Contenido principal con desplazamiento para cada sección */}
      {sectionsContent.map((section, index) => (
        <section
          key={section.id}
          ref={(el) => (sectionRefs.current[index] = el)}
          className={`
            relative flex items-center justify-center min-h-screen text-white text-center p-8
            transition-opacity duration-700 ease-in-out
            ${currentSectionIndex === index ? 'opacity-100' : 'opacity-0'}
          `}
          style={{ zIndex: currentSectionIndex === index ? 10 : 1, position: 'relative' }}
        >
          {/* APLICAMOS EL EFECTO GLASSMOPRHISM AQUÍ */}
          <div className={`
            max-w-4xl mx-auto p-8 rounded-xl
            bg-black/50 backdrop-blur-md backdrop-saturate-150 border border-white/20  // <-- CLASES AÑADIDAS
            ${currentSectionIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
            transition-all duration-700 ease-out
          `}>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
              {section.title}
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-orange-300">
              {section.subtitle}
            </h2>
            <p className="text-lg md:text-xl mb-8 leading-relaxed">
              {section.description}
            </p>

            {section.data && (
              <ul className="mb-8 space-y-2 text-lg md:text-xl list-disc list-inside">
                {section.data.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
            {section.details && (
              <ul className="mb-8 space-y-2 text-lg md:text-xl list-disc list-inside">
                {section.details.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            <Button
              onClick={handleMainButtonClick}
              variant="primary"
              className="text-xl px-8 py-3 rounded-full"
            >
              {section.buttonText}
            </Button>
          </div>
        </section>
      ))}

      {/* Indicadores de scroll */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-20">
        {sectionsContent.map((_, index) => (
          <span
            key={index}
            className={`
              w-3 h-3 rounded-full border-2 border-white cursor-pointer transition-all duration-300
              ${currentSectionIndex === index ? 'bg-white scale-125' : 'bg-transparent hover:bg-gray-400'}
            `}
            onClick={() => {
              const targetSection = sectionRefs.current[index];
              if (targetSection) {
                window.scrollTo({
                  top: targetSection.offsetTop,
                  behavior: 'smooth',
                });
              }
            }}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default HomePage;