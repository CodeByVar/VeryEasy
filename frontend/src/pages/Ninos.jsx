import React, { useState, useEffect } from 'react';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import PasswordModal from '../components/ui/PasswordModal';
import { ninoService } from '../services/ninoService';

// --- Datos Mock actualizados y completos ---
const mockNinos = [
  { id: 'NIN-001', nombre: 'Juan Pérez García', edad: 12, fechaNacimiento: '2012-03-15', genero: 'Masculino', departamento: 'La Paz', ciudad: 'La Paz', direccion: 'Av. 6 de Agosto, Calle 15, #123', telefono: '591-2-123456', email: 'juan.perez@email.com', grupoSanguineo: 'O+', alergias: 'Polen', medicamentos: 'Ninguno', condicionesMedicas: 'Ninguna', nombrePadre: 'Carlos Pérez', nombreMadre: 'Ana García', telefonoPadre: '591-2-123457', telefonoMadre: '591-2-123458', estado: 'Activo', observaciones: 'Estudiante destacado en matemáticas.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Carnet_Vacunacion.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Foto_Niño.jpg', tipo: 'Imagen', url: '#' }] },
  { id: 'NIN-002', nombre: 'Ana Torres Guzmán', edad: 10, fechaNacimiento: '2014-07-22', genero: 'Femenino', departamento: 'Cochabamba', ciudad: 'Cochabamba', direccion: 'Av. Heroínas, Calle Sucre, #456', telefono: '591-4-234567', email: 'ana.torres@email.com', grupoSanguineo: 'A+', alergias: 'Lácteos', medicamentos: 'Antihistamínico', condicionesMedicas: 'Asma leve', nombrePadre: 'Roberto Torres', nombreMadre: 'María Guzmán', telefonoPadre: '591-4-234568', telefonoMadre: '591-4-234569', estado: 'Activo', observaciones: 'Excelente en actividades artísticas.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Medico.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-003', nombre: 'Luis Gómez Mamani', edad: 14, fechaNacimiento: '2010-11-08', genero: 'Masculino', departamento: 'Oruro', ciudad: 'Oruro', direccion: 'Av. 6 de Octubre, Calle Bolívar, #789', telefono: '591-2-345678', email: 'luis.gomez@email.com', grupoSanguineo: 'B+', alergias: 'Ninguna', medicamentos: 'Ninguno', condicionesMedicas: 'Ninguna', nombrePadre: 'Miguel Gómez', nombreMadre: 'Sofía Mamani', telefonoPadre: '591-2-345679', telefonoMadre: '591-2-345680', estado: 'Activo', observaciones: 'Deportista destacado en fútbol.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Deportivo.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-004', nombre: 'Sofía Mendez Roca', edad: 11, fechaNacimiento: '2013-05-12', genero: 'Femenino', departamento: 'Potosí', ciudad: 'Potosí', direccion: 'Av. Principal, Calle Linares, #321', telefono: '591-2-456789', email: 'sofia.mendez@email.com', grupoSanguineo: 'AB+', alergias: 'Mariscos', medicamentos: 'EpiPen', condicionesMedicas: 'Alergia severa a mariscos', nombrePadre: 'José Mendez', nombreMadre: 'Carmen Roca', telefonoPadre: '591-2-456790', telefonoMadre: '591-2-456791', estado: 'Activo', observaciones: 'Estudiante sobresaliente en ciencias.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Alergia.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-005', nombre: 'Mateo Rojas Vidal', edad: 9, fechaNacimiento: '2015-09-30', genero: 'Masculino', departamento: 'Sucre', ciudad: 'Sucre', direccion: 'Av. Aniceto Arce, Calle España, #654', telefono: '591-4-567890', email: 'mateo.rojas@email.com', grupoSanguineo: 'O-', alergias: 'Ninguna', medicamentos: 'Ninguno', condicionesMedicas: 'Ninguna', nombrePadre: 'Pedro Rojas', nombreMadre: 'Laura Vidal', telefonoPadre: '591-4-567891', telefonoMadre: '591-4-567892', estado: 'Activo', observaciones: 'Talentoso en música y canto.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Musica.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-006', nombre: 'Lucía Flores Castillo', edad: 13, fechaNacimiento: '2011-12-03', genero: 'Femenino', departamento: 'Santa Cruz', ciudad: 'Santa Cruz', direccion: 'Av. Monseñor Rivero, Calle Beni, #987', telefono: '591-3-678901', email: 'lucia.flores@email.com', grupoSanguineo: 'A-', alergias: 'Polvo', medicamentos: 'Inhalador', condicionesMedicas: 'Rinitis alérgica', nombrePadre: 'Fernando Flores', nombreMadre: 'Patricia Castillo', telefonoPadre: '591-3-678902', telefonoMadre: '591-3-678903', estado: 'Activo', observaciones: 'Excelente en danza folklórica.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Danza.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-007', nombre: 'Hugo Vargas Llosa', edad: 15, fechaNacimiento: '2009-04-18', genero: 'Masculino', departamento: 'Tarija', ciudad: 'Tarija', direccion: 'Av. Domingo Paz, Calle Sucre, #147', telefono: '591-4-789012', email: 'hugo.vargas@email.com', grupoSanguineo: 'B-', alergias: 'Ninguna', medicamentos: 'Ninguno', condicionesMedicas: 'Ninguna', nombrePadre: 'Alberto Vargas', nombreMadre: 'Rosa Llosa', telefonoPadre: '591-4-789013', telefonoMadre: '591-4-789014', estado: 'Activo', observaciones: 'Líder estudiantil y deportista.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Liderazgo.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-008', nombre: 'Isabella Morales Rojas', edad: 8, fechaNacimiento: '2016-01-25', genero: 'Femenino', departamento: 'La Paz', ciudad: 'El Alto', direccion: 'Av. 16 de Julio, Calle 2, #258', telefono: '591-2-890123', email: 'isabella.morales@email.com', grupoSanguineo: 'O+', alergias: 'Nueces', medicamentos: 'Antihistamínico', condicionesMedicas: 'Alergia a frutos secos', nombrePadre: 'Fernando Morales', nombreMadre: 'Silvia Rojas', telefonoPadre: '591-2-890124', telefonoMadre: '591-2-890125', estado: 'Activo', observaciones: 'Talentosa en pintura y dibujo.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Obras_Arte.jpg', tipo: 'Imagen', url: '#' }] },
  { id: 'NIN-009', nombre: 'Diego Silva Mendoza', edad: 12, fechaNacimiento: '2012-08-14', genero: 'Masculino', departamento: 'Santa Cruz', ciudad: 'Montero', direccion: 'Av. Principal, Calle Comercio, #369', telefono: '591-3-901234', email: 'diego.silva@email.com', grupoSanguineo: 'A+', alergias: 'Ninguna', medicamentos: 'Ninguno', condicionesMedicas: 'Ninguna', nombrePadre: 'Roberto Silva', nombreMadre: 'Carmen Mendoza', telefonoPadre: '591-3-901235', telefonoMadre: '591-3-901236', estado: 'Activo', observaciones: 'Destacado en matemáticas y ajedrez.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Ajedrez.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-010', nombre: 'Valentina Castro López', edad: 10, fechaNacimiento: '2014-02-28', genero: 'Femenino', departamento: 'Cochabamba', ciudad: 'Quillacollo', direccion: 'Av. Principal, Calle Bolívar, #741', telefono: '591-4-012345', email: 'valentina.castro@email.com', grupoSanguineo: 'AB-', alergias: 'Polen, ácaros', medicamentos: 'Inhalador, antihistamínico', condicionesMedicas: 'Asma y rinitis alérgica', nombrePadre: 'Roberto Castro', nombreMadre: 'María López', telefonoPadre: '591-4-012346', telefonoMadre: '591-4-012347', estado: 'Activo', observaciones: 'Excelente en literatura y poesía.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Poemas_Infantiles.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-011', nombre: 'Sebastián Herrera Vega', edad: 14, fechaNacimiento: '2010-06-10', genero: 'Masculino', departamento: 'Oruro', ciudad: 'Oruro', direccion: 'Av. 6 de Octubre, Calle Adolfo Mier, #852', telefono: '591-2-123789', email: 'sebastian.herrera@email.com', grupoSanguineo: 'B+', alergias: 'Ninguna', medicamentos: 'Ninguno', condicionesMedicas: 'Ninguna', nombrePadre: 'Carlos Herrera', nombreMadre: 'Patricia Vega', telefonoPadre: '591-2-123790', telefonoMadre: '591-2-123791', estado: 'Activo', observaciones: 'Deportista destacado en natación.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Natacion.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-012', nombre: 'Camila Rodríguez Paredes', edad: 11, fechaNacimiento: '2013-10-05', genero: 'Femenino', departamento: 'Potosí', ciudad: 'Potosí', direccion: 'Av. Serrudo, Calle Linares, #963', telefono: '591-2-234890', email: 'camila.rodriguez@email.com', grupoSanguineo: 'O-', alergias: 'Lácteos', medicamentos: 'Lactasa', condicionesMedicas: 'Intolerancia a la lactosa', nombrePadre: 'Miguel Rodríguez', nombreMadre: 'Ana Paredes', telefonoPadre: '591-2-234891', telefonoMadre: '591-2-234892', estado: 'Activo', observaciones: 'Talentosa en música y canto.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Musica.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-013', nombre: 'Andrés Jiménez Salazar', edad: 9, fechaNacimiento: '2015-12-20', genero: 'Masculino', departamento: 'Tarija', ciudad: 'Tarija', direccion: 'Av. Domingo Paz, Calle España, #159', telefono: '591-4-345901', email: 'andres.jimenez@email.com', grupoSanguineo: 'A+', alergias: 'Ninguna', medicamentos: 'Ninguno', condicionesMedicas: 'Ninguna', nombrePadre: 'Luis Jiménez', nombreMadre: 'Laura Salazar', telefonoPadre: '591-4-345902', telefonoMadre: '591-4-345903', estado: 'Activo', observaciones: 'Destacado en ciencias y experimentos.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Proyecto_Ciencias.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-014', nombre: 'Mariana Torres Flores', edad: 13, fechaNacimiento: '2011-07-08', genero: 'Femenino', departamento: 'Chuquisaca', ciudad: 'Sucre', direccion: 'Av. Aniceto Arce, Calle Bolívar, #753', telefono: '591-4-456012', email: 'mariana.torres@email.com', grupoSanguineo: 'AB+', alergias: 'Polen', medicamentos: 'Antihistamínico', condicionesMedicas: 'Rinitis alérgica estacional', nombrePadre: 'Carlos Torres', nombreMadre: 'Elena Flores', telefonoPadre: '591-4-456013', telefonoMadre: '591-4-456014', estado: 'Activo', observaciones: 'Excelente en matemáticas y olimpiadas.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Matematicas.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-015', nombre: 'Gabriel Mendoza Ríos', edad: 15, fechaNacimiento: '2009-03-12', genero: 'Masculino', departamento: 'La Paz', ciudad: 'La Paz', direccion: 'Av. 16 de Julio, Calle Comercio, #951', telefono: '591-2-567123', email: 'gabriel.mendoza@email.com', grupoSanguineo: 'O+', alergias: 'Ninguna', medicamentos: 'Ninguno', condicionesMedicas: 'Ninguna', nombrePadre: 'Roberto Mendoza', nombreMadre: 'Ana Ríos', telefonoPadre: '591-2-567124', telefonoMadre: '591-2-567125', estado: 'Activo', observaciones: 'Líder estudiantil y deportista.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Liderazgo.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-016', nombre: 'Sofía Ramírez Gutiérrez', edad: 10, fechaNacimiento: '2014-11-30', genero: 'Femenino', departamento: 'Santa Cruz', ciudad: 'Santa Cruz', direccion: 'Av. Monseñor Rivero, Calle Beni, #357', telefono: '591-3-678234', email: 'sofia.ramirez@email.com', grupoSanguineo: 'B-', alergias: 'Mariscos', medicamentos: 'EpiPen', condicionesMedicas: 'Alergia severa a mariscos', nombrePadre: 'José Ramírez', nombreMadre: 'Carmen Gutiérrez', telefonoPadre: '591-3-678235', telefonoMadre: '591-3-678236', estado: 'Activo', observaciones: 'Talentosa en natación y deportes acuáticos.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Natacion.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-017', nombre: 'Daniel Ortiz Calderón', edad: 12, fechaNacimiento: '2012-09-15', genero: 'Masculino', departamento: 'Oruro', ciudad: 'Oruro', direccion: 'Av. 6 de Octubre, Calle Bolívar, #753', telefono: '591-2-789345', email: 'daniel.ortiz@email.com', grupoSanguineo: 'A-', alergias: 'Polvo', medicamentos: 'Inhalador', condicionesMedicas: 'Asma leve', nombrePadre: 'Miguel Ortiz', nombreMadre: 'Sofía Calderón', telefonoPadre: '591-2-789346', telefonoMadre: '591-2-789347', estado: 'Activo', observaciones: 'Destacado en robótica y tecnología.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Proyecto_Robotica.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-018', nombre: 'Valeria Espinoza Ruiz', edad: 11, fechaNacimiento: '2013-04-22', genero: 'Femenino', departamento: 'Cochabamba', ciudad: 'Cochabamba', direccion: 'Av. Heroínas, Calle Sucre, #159', telefono: '591-4-890456', email: 'valeria.espinoza@email.com', grupoSanguineo: 'O+', alergias: 'Ninguna', medicamentos: 'Ninguno', condicionesMedicas: 'Ninguna', nombrePadre: 'Fernando Espinoza', nombreMadre: 'Patricia Ruiz', telefonoPadre: '591-4-890457', telefonoMadre: '591-4-890458', estado: 'Activo', observaciones: 'Excelente en arte y pintura.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Obras_Arte.jpg', tipo: 'Imagen', url: '#' }] },
  { id: 'NIN-019', nombre: 'Alejandro Vargas Morales', edad: 14, fechaNacimiento: '2010-12-08', genero: 'Masculino', departamento: 'Potosí', ciudad: 'Potosí', direccion: 'Av. Serrudo, Calle Linares, #753', telefono: '591-2-901567', email: 'alejandro.vargas@email.com', grupoSanguineo: 'B+', alergias: 'Lácteos', medicamentos: 'Lactasa', condicionesMedicas: 'Intolerancia a la lactosa', nombrePadre: 'Roberto Vargas', nombreMadre: 'Rosa Morales', telefonoPadre: '591-2-901568', telefonoMadre: '591-2-901569', estado: 'Activo', observaciones: 'Deportista destacado en atletismo.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Atletismo.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-020', nombre: 'Natalia Castro Jiménez', edad: 9, fechaNacimiento: '2015-08-14', genero: 'Femenino', departamento: 'Tarija', ciudad: 'Tarija', direccion: 'Av. Domingo Paz, Calle España, #951', telefono: '591-4-012678', email: 'natalia.castro@email.com', grupoSanguineo: 'AB-', alergias: 'Ninguna', medicamentos: 'Ninguno', condicionesMedicas: 'Ninguna', nombrePadre: 'Luis Castro', nombreMadre: 'María Jiménez', telefonoPadre: '591-4-012679', telefonoMadre: '591-4-012680', estado: 'Activo', observaciones: 'Talentosa en ajedrez y estrategia.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Ajedrez.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-021', nombre: 'Carlos Miranda Vega', edad: 13, fechaNacimiento: '2011-01-25', genero: 'Masculino', departamento: 'La Paz', ciudad: 'La Paz', direccion: 'Av. 6 de Agosto, Calle 15, #357', telefono: '591-2-123789', email: 'carlos.miranda@email.com', grupoSanguineo: 'O-', alergias: 'Polen, ácaros', medicamentos: 'Inhalador, antihistamínico', condicionesMedicas: 'Asma y rinitis alérgica', nombrePadre: 'Alberto Miranda', nombreMadre: 'Elena Vega', telefonoPadre: '591-2-123790', telefonoMadre: '591-2-123791', estado: 'Activo', observaciones: 'Destacado en robótica y programación.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Proyecto_Programacion.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-022', nombre: 'Fernanda Ríos Morales', edad: 10, fechaNacimiento: '2014-05-18', genero: 'Femenino', departamento: 'Santa Cruz', ciudad: 'Montero', direccion: 'Av. Principal, Calle Comercio, #753', telefono: '591-3-234890', email: 'fernanda.rios@email.com', grupoSanguineo: 'A+', alergias: 'Ninguna', medicamentos: 'Ninguno', condicionesMedicas: 'Ninguna', nombrePadre: 'Roberto Ríos', nombreMadre: 'Patricia Morales', telefonoPadre: '591-3-234891', telefonoMadre: '591-3-234892', estado: 'Activo', observaciones: 'Excelente en literatura y escritura creativa.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Cuentos_Infantiles.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-023', nombre: 'Roberto Salazar Flores', edad: 15, fechaNacimiento: '2009-10-03', genero: 'Masculino', departamento: 'Oruro', ciudad: 'Oruro', direccion: 'Av. 6 de Octubre, Calle Adolfo Mier, #159', telefono: '591-2-345901', email: 'roberto.salazar@email.com', grupoSanguineo: 'B+', alergias: 'Ninguna', medicamentos: 'Ninguno', condicionesMedicas: 'Ninguna', nombrePadre: 'Miguel Salazar', nombreMadre: 'Carmen Flores', telefonoPadre: '591-2-345902', telefonoMadre: '591-2-345903', estado: 'Activo', observaciones: 'Líder en proyectos científicos escolares.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Proyecto_Ciencias.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-024', nombre: 'Patricia López Mendoza', edad: 11, fechaNacimiento: '2013-12-07', genero: 'Femenino', departamento: 'Cochabamba', ciudad: 'Quillacollo', direccion: 'Av. Principal, Calle Bolívar, #951', telefono: '591-4-456012', email: 'patricia.lopez@email.com', grupoSanguineo: 'O+', alergias: 'Lácteos', medicamentos: 'Lactasa', condicionesMedicas: 'Intolerancia a la lactosa', nombrePadre: 'Ricardo López', nombreMadre: 'Ana Mendoza', telefonoPadre: '591-4-456013', telefonoMadre: '591-4-456014', estado: 'Activo', observaciones: 'Talentosa en oratoria y debate.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Oratoria.pdf', tipo: 'PDF', url: '#' }] },
  { id: 'NIN-025', nombre: 'Miguel Ángel Torres', edad: 12, fechaNacimiento: '2012-06-20', genero: 'Masculino', departamento: 'Potosí', ciudad: 'Potosí', direccion: 'Av. Serrudo, Calle Linares, #357', telefono: '591-2-567123', email: 'miguel.torres@email.com', grupoSanguineo: 'A-', alergias: 'Ninguna', medicamentos: 'Ninguno', condicionesMedicas: 'Ninguna', nombrePadre: 'Carlos Torres', nombreMadre: 'Isabel Torres', telefonoPadre: '591-2-567124', telefonoMadre: '591-2-567125', estado: 'Activo', observaciones: 'Deportista destacado en múltiples disciplinas.', documentos: [{ nombre: 'Certificado_Nacimiento.pdf', tipo: 'PDF', url: '#' }, { nombre: 'Certificado_Deportivo.pdf', tipo: 'PDF', url: '#' }] }
];

// Los estados únicos se calcularán dinámicamente desde los datos de la API
const NINOS_PER_PAGE = 6;

// Datos para el formulario
const tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const encargadosDisponibles = ['María López', 'Carlos Ruiz', 'Sofía Vargas', 'Juana de Arco', 'Pedro Pascal', 'Roberto Carlos', 'Mónica Heredia'];
const colegios = ['Colegio San Calixto', 'Colegio Santa Ana', 'Colegio Nacional Oruro', 'Colegio San Francisco', 'Colegio Sagrado Corazón', 'Colegio San Ignacio', 'Colegio San Roque'];
const grados = ['1ro Primaria', '2do Primaria', '3ro Primaria', '4to Primaria', '5to Primaria', '6to Primaria', '1ro Secundaria', '2do Secundaria', '3ro Secundaria', '4to Secundaria', '5to Secundaria', '6to Secundaria'];
const alergiasComunes = ['Polen', 'Lácteos', 'Gluten', 'Nueces', 'Penicilina', 'Polvo', 'Ácaros', 'Pelo de animales', 'Picaduras de insectos', 'Mariscos'];

const getStatusColor = (estado) => {
  switch (estado) {
    case 'Activo': return 'bg-green-100 text-green-700';
    case 'Inactivo': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 0;
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  if (isNaN(nacimiento.getTime())) return 0;
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

const Ninos = () => {
  const [ninos, setNinos] = useState([]);
  const [selectedNino, setSelectedNino] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingNino, setPendingNino] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeStatusFilters, setActiveStatusFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar niños desde la API
  const cargarNinos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ninoService.obtenerNinos();
      setNinos(data);
    } catch (err) {
      console.error('Error al cargar niños:', err);
      setError('Error al cargar los datos de niños');
    } finally {
      setLoading(false);
    }
  };

  // Cargar niños al montar el componente
  useEffect(() => {
    cargarNinos();
  }, []);

  // Estado del formulario de crear niño
  const [formData, setFormData] = useState({
    nombre: '',
    fechaNacimiento: '',
    genero: '',
    carnet: '',
    tipoSangre: '',
    departamento: '',
    ciudad: '',
    direccion: '',
    telefono: '',
    email: '',
    encargado: '',
    telefonoEncargado: '',
    colegio: '',
    grado: '',
    alergias: [],
    medicamentos: [],
    condicionesMedicas: '',
    nombrePadre: '',
    nombreMadre: '',
    observaciones: '',
    estado: 'Activo'
  });

  const handleViewDetails = (nino) => {
    setPendingNino(nino);
    setShowPasswordModal(true);
  };

  const handlePasswordSuccess = () => {
    setSelectedNino(pendingNino);
    setPendingNino(null);
  };

  const closeModal = () => setSelectedNino(null);
  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData({
      nombre: '',
      fechaNacimiento: '',
      genero: '',
      carnet: '',
      tipoSangre: '',
      departamento: '',
      ciudad: '',
      direccion: '',
      telefono: '',
      email: '',
      encargado: '',
      telefonoEncargado: '',
      colegio: '',
      grado: '',
      alergias: [],
      medicamentos: [],
      condicionesMedicas: '',
      nombrePadre: '',
      nombreMadre: '',
      observaciones: '',
      estado: 'Activo'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAlergiaChange = (alergia) => {
    setFormData(prev => ({
      ...prev,
      alergias: prev.alergias.includes(alergia)
        ? prev.alergias.filter(a => a !== alergia)
        : [...prev.alergias, alergia]
    }));
  };

  const handleMedicamentoChange = (e) => {
    const { value } = e.target;
    if (value && !formData.medicamentos.includes(value)) {
      setFormData(prev => ({
        ...prev,
        medicamentos: [...prev.medicamentos, value]
      }));
      e.target.value = '';
    }
  };

  const removeMedicamento = (medicamento) => {
    setFormData(prev => ({
      ...prev,
      medicamentos: prev.medicamentos.filter(m => m !== medicamento)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Preparar datos para la API
      const datosNino = {
        nombre: formData.nombre,
        fecha_nacimiento: formData.fechaNacimiento,
        genero: formData.genero,
        carnet: formData.carnet,
        tipo_sangre: formData.tipoSangre,
        departamento: formData.departamento,
        ciudad: formData.ciudad,
        direccion: formData.direccion,
        telefono: formData.telefono || null,
        email: formData.email || null,
        encargado: formData.encargado,
        telefono_encargado: formData.telefonoEncargado,
        colegio: formData.colegio,
        grado: formData.grado,
        alergias: formData.alergias.length > 0 ? formData.alergias.join(', ') : 'Ninguna',
        medicamentos: formData.medicamentos.length > 0 ? formData.medicamentos.join(', ') : 'Ninguno',
        condiciones_medicas: formData.condicionesMedicas || null,
        nombre_padre: formData.nombrePadre || null,
        nombre_madre: formData.nombreMadre || null,
        observaciones: formData.observaciones || null,
        estado: formData.estado
      };

      // Crear niño usando la API
      const nuevoNino = await ninoService.crearNino(datosNino);
      
      // Agregar a la lista local
      setNinos(prev => [nuevoNino, ...prev]);
      
      // Cerrar modal y limpiar formulario
      closeAddModal();
      
      // Mostrar mensaje de éxito
      alert('Niño agregado exitosamente');
      
    } catch (err) {
      console.error('Error al crear niño:', err);
      setError('Error al crear el niño. Verifique que el carnet no esté duplicado.');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setActiveStatusFilters([]);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (estado) => {
    setCurrentPage(1);
    setActiveStatusFilters(prev =>
      prev.includes(estado)
        ? prev.filter(f => f !== estado)
        : [...prev, estado]
    );
  };

  const ninosFiltrados = ninos
    .filter(n => activeStatusFilters.length === 0 || activeStatusFilters.includes(n.estado))
    .filter(n => 
      n.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.carnet.includes(searchTerm) ||
      n.colegio.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const indexOfLastNino = currentPage * NINOS_PER_PAGE;
  const indexOfFirstNino = indexOfLastNino - NINOS_PER_PAGE;
  const currentNinos = ninosFiltrados.slice(indexOfFirstNino, indexOfLastNino);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Niños</h1>
        <p className="text-gray-600 mt-2">
          Administra la información de todos los menores registrados en el sistema.
        </p>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Protección de Privacidad:</strong> Las fotos e información sensible solo se muestran después de verificar su identidad.
          </p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Buscar por nombre, carnet o colegio..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400" />
          <button onClick={resetFilters} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
            Limpiar Filtros
          </button>
          <button onClick={openAddModal} className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            + Agregar Niño
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 flex-wrap">
          <span className="font-medium text-gray-600">Filtrar por estado:</span>
          {[...new Set(ninos.map(n => n.estado))].map(estado => (
            <label key={estado} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
              <input type="checkbox" checked={activeStatusFilters.includes(estado)} onChange={() => handleStatusFilterChange(estado)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
              <span className="text-sm font-medium text-gray-700">{estado}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Indicador de carga */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <span className="ml-3 text-gray-600">Cargando niños...</span>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={cargarNinos}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && !error && currentNinos.map(nino => (
          <div key={nino.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  {/* Avatar placeholder en lugar de foto real */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {nino.nombre}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(nino.estado)}`}>
                      {nino.estado}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Carnet: {nino.carnet}</p>
                  <p className="text-sm text-gray-500 mb-1">Edad: {calcularEdad(nino.fecha_nacimiento)} años</p>
                  <p className="text-sm text-gray-500">Tipo Sangre: {nino.tipo_sangre}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Encargado:</p>
                  <p className="text-sm font-medium text-gray-700">{nino.encargado}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Colegio:</p>
                  <p className="text-sm font-medium text-gray-700">{nino.colegio} - {nino.grado}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dirección:</p>
                  <p className="text-sm font-medium text-gray-700 truncate">{nino.direccion}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1 text-sm text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {nino.permisosActivos} permisos
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {nino.viajesRealizados} viajes
                  </span>
                </div>
                <button 
                  onClick={() => handleViewDetails(nino)} 
                  className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Ver Detalles
                </button>
              </div>

              {nino.alergias && nino.alergias !== 'Ninguna' && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Alergias:</p>
                  <div className="flex flex-wrap gap-1">
                    {nino.alergias.split(', ').map((alergia, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        {alergia.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && currentNinos.length === 0 && <p className="text-center text-gray-500 py-10">No se encontraron niños con los filtros seleccionados.</p>}

      <Pagination itemsPerPage={NINOS_PER_PAGE} totalItems={ninosFiltrados.length} paginate={paginate} currentPage={currentPage} />

      {/* Modal de Verificación de Contraseña */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
        title="Acceso a Información Sensible"
      />

      {/* Modal de Detalles (solo se muestra después de verificar contraseña) */}
      {selectedNino && (
        <Modal isOpen={!!selectedNino} onClose={closeModal}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Perfil Completo - {selectedNino.nombre}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna 1: Foto y datos básicos */}
              <div className="lg:col-span-1">
                <div className="text-center mb-6">
                  <img 
                    src={selectedNino.foto} 
                    alt={selectedNino.nombre}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mx-auto mb-4"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face';
                    }}
                  />
                  <h3 className="text-xl font-bold text-gray-800">{selectedNino.nombre}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedNino.estado)}`}>
                    {selectedNino.estado}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Información Personal</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Carnet:</strong> {selectedNino.carnet}</p>
                      <p><strong>Fecha Nacimiento:</strong> {selectedNino.fecha_nacimiento}</p>
                      <p><strong>Edad:</strong> {calcularEdad(selectedNino.fecha_nacimiento)} años</p>
                      <p><strong>Tipo Sangre:</strong> {selectedNino.tipo_sangre}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Información Académica</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Colegio:</strong> {selectedNino.colegio}</p>
                      <p><strong>Grado:</strong> {selectedNino.grado}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna 2: Información de contacto y médica */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Información de Contacto</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Encargado/Tutor:</p>
                      <p className="font-medium text-gray-700">{selectedNino.encargado}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono:</p>
                      <p className="font-medium text-gray-700">{selectedNino.telefonoEncargado}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Dirección:</p>
                      <p className="font-medium text-gray-700">{selectedNino.direccion}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Información Médica</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Alergias:</p>
                      {selectedNino.alergias && selectedNino.alergias !== 'Ninguna' ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedNino.alergias.split(', ').map((alergia, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              {alergia.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No registra alergias</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Medicamentos:</p>
                      {selectedNino.medicamentos && selectedNino.medicamentos !== 'Ninguno' ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedNino.medicamentos.split(', ').map((medicamento, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                              {medicamento.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No requiere medicamentos</p>
                                          )}
                  </div>
                  <div>
                    <label htmlFor="condicionesMedicas" className="block text-sm font-medium text-gray-700 mb-1">Condiciones Médicas</label>
                    <textarea 
                      id="condicionesMedicas" 
                      name="condicionesMedicas" 
                      value={formData.condicionesMedicas} 
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Condiciones médicas especiales..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Estadísticas</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedNino.permisosActivos}</div>
                      <div className="text-sm text-blue-700">Permisos Activos</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedNino.viajesRealizados}</div>
                      <div className="text-sm text-green-700">Viajes Realizados</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Observaciones</h4>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">{selectedNino.observaciones}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal para crear nuevo niño */}
      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={closeAddModal}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Agregar Nuevo Niño</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                    <input 
                      type="text" 
                      id="nombre" 
                      name="nombre" 
                      value={formData.nombre} 
                      onChange={handleInputChange}
                      placeholder="Nombre y apellidos"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="carnet" className="block text-sm font-medium text-gray-700 mb-1">Carnet de Identidad *</label>
                    <input 
                      type="text" 
                      id="carnet" 
                      name="carnet" 
                      value={formData.carnet} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
                    <input 
                      type="date" 
                      id="fechaNacimiento" 
                      name="fechaNacimiento" 
                      value={formData.fechaNacimiento} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="carnet" className="block text-sm font-medium text-gray-700 mb-1">Carnet de Identidad *</label>
                    <input 
                      type="text" 
                      id="carnet" 
                      name="carnet" 
                      value={formData.carnet} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-1">Género *</label>
                    <select 
                      id="genero" 
                      name="genero" 
                      value={formData.genero} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar género</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tipoSangre" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Sangre *</label>
                    <select 
                      id="tipoSangre" 
                      name="tipoSangre" 
                      value={formData.tipoSangre} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar tipo de sangre</option>
                      {tiposSangre.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
                    <select 
                      id="departamento" 
                      name="departamento" 
                      value={formData.departamento} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar departamento</option>
                      <option value="La Paz">La Paz</option>
                      <option value="Cochabamba">Cochabamba</option>
                      <option value="Santa Cruz">Santa Cruz</option>
                      <option value="Oruro">Oruro</option>
                      <option value="Potosí">Potosí</option>
                      <option value="Tarija">Tarija</option>
                      <option value="Chuquisaca">Chuquisaca</option>
                      <option value="Beni">Beni</option>
                      <option value="Pando">Pando</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                    <input 
                      type="text" 
                      id="ciudad" 
                      name="ciudad" 
                      value={formData.ciudad} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Información de Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="encargado" className="block text-sm font-medium text-gray-700 mb-1">Encargado/Tutor *</label>
                    <select 
                      id="encargado" 
                      name="encargado" 
                      value={formData.encargado} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar encargado</option>
                      {encargadosDisponibles.map(encargado => (
                        <option key={encargado} value={encargado}>{encargado}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="telefonoEncargado" className="block text-sm font-medium text-gray-700 mb-1">Teléfono del Encargado *</label>
                    <input 
                      type="text" 
                      id="telefonoEncargado" 
                      name="telefonoEncargado" 
                      value={formData.telefonoEncargado} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input 
                      type="text" 
                      id="telefono" 
                      name="telefono" 
                      value={formData.telefono} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                    <input 
                      type="text" 
                      id="direccion" 
                      name="direccion" 
                      value={formData.direccion} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="nombrePadre" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Padre</label>
                    <input 
                      type="text" 
                      id="nombrePadre" 
                      name="nombrePadre" 
                      value={formData.nombrePadre} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="nombreMadre" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Madre</label>
                    <input 
                      type="text" 
                      id="nombreMadre" 
                      name="nombreMadre" 
                      value={formData.nombreMadre} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Información Académica */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Información Académica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="colegio" className="block text-sm font-medium text-gray-700 mb-1">Colegio *</label>
                    <select 
                      id="colegio" 
                      name="colegio" 
                      value={formData.colegio} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar colegio</option>
                      {colegios.map(colegio => (
                        <option key={colegio} value={colegio}>{colegio}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="grado" className="block text-sm font-medium text-gray-700 mb-1">Grado *</label>
                    <select 
                      id="grado" 
                      name="grado" 
                      value={formData.grado} 
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Seleccionar grado</option>
                      {grados.map(grado => (
                        <option key={grado} value={grado}>{grado}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Información Médica */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Información Médica</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alergias:</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {alergiasComunes.map(alergia => (
                        <label key={alergia} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-red-100">
                          <input 
                            type="checkbox" 
                            checked={formData.alergias.includes(alergia)}
                            onChange={() => handleAlergiaChange(alergia)}
                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm font-medium text-gray-700">{alergia}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="medicamento" className="block text-sm font-medium text-gray-700 mb-1">Medicamentos:</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        id="medicamento" 
                        placeholder="Agregar medicamento..."
                        onKeyPress={(e) => e.key === 'Enter' && handleMedicamentoChange(e)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                      <button 
                        type="button"
                        onClick={(e) => handleMedicamentoChange(e)}
                        className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
                      >
                        Agregar
                      </button>
                    </div>
                    {formData.medicamentos.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.medicamentos.map((medicamento, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                            {medicamento}
                            <button 
                              type="button"
                              onClick={() => removeMedicamento(medicamento)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Información Adicional */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Información Adicional</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                    <textarea 
                      id="observaciones" 
                      name="observaciones" 
                      value={formData.observaciones} 
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Información adicional relevante sobre el niño..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select 
                      id="estado" 
                      name="estado" 
                      value={formData.estado} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={closeAddModal}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Agregando...' : 'Agregar Niño'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Ninos;
