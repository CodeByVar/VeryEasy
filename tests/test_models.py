"""
Tests para modelos de datos
"""
import unittest
from datetime import date, datetime, timedelta

from tests.test_config import BaseTestCase
from app.models.usuario import Usuario
from app.models.nino import Nino
from app.models.encargado import Encargado
from app.models.permiso import Permiso
from app.core.segurity import hash_password


class TestNinoModel(BaseTestCase):
    """Tests para modelo Niño"""
    
    def test_create_nino(self):
        """Test para crear niño"""
        nino = self.create_test_nino()
        
        self.assertIsNotNone(nino.id)
        self.assertEqual(nino.nombre, "Test Niño")
        self.assertEqual(nino.carnet, "CI-TEST123")
        self.assertEqual(nino.genero, "Masculino")
        self.assertEqual(nino.tipo_sangre, "O+")
        self.assertEqual(nino.departamento, "La Paz")
        self.assertEqual(nino.ciudad, "La Paz")
        self.assertEqual(nino.estado, "Activo")
        self.assertEqual(nino.permisos_activos, 0)
        self.assertEqual(nino.viajes_realizados, 0)
    
    def test_nino_unique_carnet(self):
        """Test para carnet único de niño"""
        # Crear primer niño
        nino1 = self.create_test_nino(carnet="CI-UNIQUE123")
        
        # Intentar crear segundo niño con mismo carnet
        nino2 = Nino(
            nombre="Another Niño",
            fecha_nacimiento="2016-06-15",
            genero="Femenino",
            carnet="CI-UNIQUE123",  # Mismo carnet
            tipo_sangre="A+",
            departamento="Cochabamba",
            ciudad="Cochabamba",
            direccion="Another Address 456",
            telefono="77777778",
            email="another@example.com",
            encargado="Another Encargado",
            telefono_encargado="78888889",
            colegio="Another School",
            grado="4to",
            alergias="Ninguna",
            medicamentos="Ninguno",
            estado="Activo",
            permisos_activos=0,
            viajes_realizados=0
        )
        
        self.db.add(nino2)
        
        # Debe lanzar excepción por carnet duplicado
        with self.assertRaises(Exception):
            self.db.commit()
    
    def test_nino_required_fields(self):
        """Test para campos requeridos de niño"""
        # Intentar crear niño sin campos requeridos
        nino = Nino()
        self.db.add(nino)
        
        with self.assertRaises(Exception):
            self.db.commit()
    
    def test_nino_default_values(self):
        """Test para valores por defecto de niño"""
        nino = Nino(
            nombre="Test Niño",
            fecha_nacimiento="2015-05-20",
            genero="Masculino",
            carnet="CI-DEFAULT123",
            tipo_sangre="O+",
            departamento="La Paz",
            ciudad="La Paz",
            direccion="Test Address 123",
            encargado="Test Encargado",
            telefono_encargado="78888888",
            colegio="Test School",
            grado="5to"
        )
        
        self.db.add(nino)
        self.db.commit()
        self.db.refresh(nino)
        
        # Verificar valores por defecto
        self.assertEqual(nino.alergias, "Ninguna")
        self.assertEqual(nino.medicamentos, "Ninguno")
        self.assertEqual(nino.estado, "Activo")
        self.assertEqual(nino.permisos_activos, 0)
        self.assertEqual(nino.viajes_realizados, 0)


class TestEncargadoModel(BaseTestCase):
    """Tests para modelo Encargado"""
    
    def test_create_encargado(self):
        """Test para crear encargado"""
        encargado = Encargado(
            nombre="Juan",
            apellido="Pérez",
            ci="12345678",
            telefono="77777777",
            direccion="Av. Siempre Viva 123",
            correo="juan@example.com",
            parentesco="Padre",
            ocupacion="Ingeniero",
            lugar_trabajo="Empresa XYZ",
            telefono_trabajo="22222222",
            estado="Activo",
            observaciones="Encargado responsable",
            es_contacto_emergencia=True
        )
        
        self.db.add(encargado)
        self.db.commit()
        self.db.refresh(encargado)
        
        self.assertIsNotNone(encargado.id)
        self.assertEqual(encargado.nombre, "Juan")
        self.assertEqual(encargado.apellido, "Pérez")
        self.assertEqual(encargado.ci, "12345678")
        self.assertEqual(encargado.parentesco, "Padre")
        self.assertEqual(encargado.estado, "Activo")
        self.assertTrue(encargado.es_contacto_emergencia)
        self.assertIsNotNone(encargado.fecha_registro)
    
    def test_encargado_unique_ci(self):
        """Test para CI único de encargado"""
        # Crear primer encargado
        encargado1 = Encargado(
            nombre="Juan",
            apellido="Pérez",
            ci="12345678",
            telefono="77777777",
            direccion="Av. Siempre Viva 123",
            parentesco="Padre"
        )
        
        self.db.add(encargado1)
        self.db.commit()
        
        # Intentar crear segundo encargado con mismo CI
        encargado2 = Encargado(
            nombre="María",
            apellido="González",
            ci="12345678",  # Mismo CI
            telefono="77777778",
            direccion="Av. Siempre Viva 456",
            parentesco="Madre"
        )
        
        self.db.add(encargado2)
        
        # Debe lanzar excepción por CI duplicado
        with self.assertRaises(Exception):
            self.db.commit()
    
    def test_encargado_default_values(self):
        """Test para valores por defecto de encargado"""
        encargado = Encargado(
            nombre="Test",
            apellido="Encargado",
            ci="87654321",
            telefono="77777777",
            direccion="Test Address 123",
            parentesco="Padre"
        )
        
        self.db.add(encargado)
        self.db.commit()
        self.db.refresh(encargado)
        
        # Verificar valores por defecto
        self.assertEqual(encargado.estado, "Activo")
        self.assertFalse(encargado.es_contacto_emergencia)
        self.assertIsNotNone(encargado.fecha_registro)


class TestPermisoModel(BaseTestCase):
    """Tests para modelo Permiso"""
    
    def test_create_permiso(self):
        """Test para crear permiso"""
        # Crear niño y encargado necesarios
        nino = self.create_test_nino()
        encargado = Encargado(
            nombre="Juan",
            apellido="Pérez",
            ci="12345678",
            telefono="77777777",
            direccion="Av. Siempre Viva 123",
            parentesco="Padre"
        )
        self.db.add(encargado)
        self.db.commit()
        self.db.refresh(encargado)
        
        # Crear permiso
        permiso = Permiso(
            id_nino=nino.id,
            id_encargado=encargado.id,
            tipo_permiso="Salida médica",
            destino="Hospital Central",
            motivo="Consulta médica",
            fecha_salida=date.today(),
            hora_salida="08:00",
            fecha_retorno=date.today(),
            hora_retorno="12:00",
            estado="Pendiente",
            transporte="Vehículo propio",
            acompanante="Madre",
            telefono_contacto="77777777"
        )
        
        self.db.add(permiso)
        self.db.commit()
        self.db.refresh(permiso)
        
        self.assertIsNotNone(permiso.id)
        self.assertEqual(permiso.id_nino, nino.id)
        self.assertEqual(permiso.id_encargado, encargado.id)
        self.assertEqual(permiso.tipo_permiso, "Salida médica")
        self.assertEqual(permiso.destino, "Hospital Central")
        self.assertEqual(permiso.estado, "Pendiente")
        self.assertIsNotNone(permiso.fecha_solicitud)
    
    def test_permiso_default_values(self):
        """Test para valores por defecto de permiso"""
        # Crear niño y encargado necesarios
        nino = self.create_test_nino()
        encargado = Encargado(
            nombre="Juan",
            apellido="Pérez",
            ci="12345678",
            telefono="77777777",
            direccion="Av. Siempre Viva 123",
            parentesco="Padre"
        )
        self.db.add(encargado)
        self.db.commit()
        self.db.refresh(encargado)
        
        # Crear permiso con mínimos campos requeridos
        permiso = Permiso(
            id_nino=nino.id,
            id_encargado=encargado.id,
            tipo_permiso="Salida familiar",
            destino="Casa",
            motivo="Visita familiar",
            fecha_salida=date.today(),
            hora_salida="10:00",
            fecha_retorno=date.today(),
            hora_retorno="18:00"
        )
        
        self.db.add(permiso)
        self.db.commit()
        self.db.refresh(permiso)
        
        # Verificar valores por defecto
        self.assertEqual(permiso.estado, "Pendiente")
        self.assertIsNotNone(permiso.fecha_solicitud)
    
    def test_permiso_foreign_keys(self):
        """Test para claves foráneas de permiso"""
        # Crear permiso con IDs inexistentes
        permiso = Permiso(
            id_nino=999,  # ID inexistente
            id_encargado=999,  # ID inexistente
            tipo_permiso="Test",
            destino="Test",
            motivo="Test",
            fecha_salida=date.today(),
            hora_salida="10:00",
            fecha_retorno=date.today(),
            hora_retorno="18:00"
        )
        
        self.db.add(permiso)
        
        # Debe lanzar excepción por clave foránea inválida
        with self.assertRaises(Exception):
            self.db.commit()
    
    def test_permiso_relationships(self):
        """Test para relaciones de permiso"""
        # Crear niño y encargado
        nino = self.create_test_nino()
        encargado = Encargado(
            nombre="Juan",
            apellido="Pérez",
            ci="12345678",
            telefono="77777777",
            direccion="Av. Siempre Viva 123",
            parentesco="Padre"
        )
        self.db.add(encargado)
        self.db.commit()
        self.db.refresh(encargado)
        
        # Crear permiso
        permiso = Permiso(
            id_nino=nino.id,
            id_encargado=encargado.id,
            tipo_permiso="Test",
            destino="Test",
            motivo="Test",
            fecha_salida=date.today(),
            hora_salida="10:00",
            fecha_retorno=date.today(),
            hora_retorno="18:00"
        )
        
        self.db.add(permiso)
        self.db.commit()
        self.db.refresh(permiso)
        
        # Verificar relaciones
        self.assertEqual(permiso.nino.id, nino.id)
        self.assertEqual(permiso.encargado.id, encargado.id)
        self.assertIn(permiso, nino.permisos)
        self.assertIn(permiso, encargado.permisos)


class TestModelValidation(BaseTestCase):
    """Tests para validación de modelos"""
    
    def test_usuario_validation(self):
        """Test para validación de usuario"""
        # Usuario válido
        user = Usuario(
            nombre="Test User",
            correo="test@example.com",
            contrasena="hashedpassword",
            rol="admin"
        )
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        
        self.assertIsNotNone(user.id)
        self.assertEqual(user.nombre, "Test User")
        self.assertEqual(user.correo, "test@example.com")
        self.assertEqual(user.rol, "admin")
    
    def test_nino_validation(self):
        """Test para validación de niño"""
        # Niño válido
        nino = Nino(
            nombre="Test Niño",
            fecha_nacimiento=date(2015, 5, 20),
            genero="Masculino",
            carnet="CI-TEST123",
            tipo_sangre="O+",
            departamento="La Paz",
            ciudad="La Paz",
            direccion="Test Address 123",
            encargado="Test Encargado",
            telefono_encargado="78888888",
            colegio="Test School",
            grado="5to"
        )
        
        self.db.add(nino)
        self.db.commit()
        self.db.refresh(nino)
        
        self.assertIsNotNone(nino.id)
        self.assertEqual(nino.nombre, "Test Niño")
        self.assertEqual(nino.carnet, "CI-TEST123")
        self.assertEqual(nino.fecha_nacimiento, date(2015, 5, 20))


if __name__ == '__main__':
    unittest.main()
