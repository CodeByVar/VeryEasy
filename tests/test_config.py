"""
Configuración base para tests con unittest
"""
import unittest
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

# Agregar el directorio raíz al path para importar módulos
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.main import app
from app.database.conexion import Base
from app.routers.usuario import get_db
from app.models.usuario import Usuario
from app.models.nino import Nino
from app.models.encargado import Encargado
from app.models.permiso import Permiso


class TestConfig:
    """Configuración para tests"""
    
    # Base de datos de prueba en memoria
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
    
    # Configuración de la aplicación de prueba
    TESTING = True
    
    # Configuración de seguridad para tests
    SECRET_KEY = "test-secret-key"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30


class BaseTestCase(unittest.TestCase):
    """Clase base para todos los tests"""
    
    @classmethod
    def setUpClass(cls):
        """Configuración inicial para toda la clase de tests"""
        # Crear motor de base de datos de prueba
        cls.engine = create_engine(
            TestConfig.SQLALCHEMY_DATABASE_URL,
            connect_args={"check_same_thread": False}
        )
        
        # Crear sesión de base de datos
        cls.TestingSessionLocal = sessionmaker(
            autocommit=False, 
            autoflush=False, 
            bind=cls.engine
        )
        
        # Crear todas las tablas
        Base.metadata.create_all(bind=cls.engine)
        
        # Crear cliente de prueba
        cls.client = TestClient(app)
        
        # Sobrescribir la dependencia de base de datos
        def override_get_db():
            try:
                db = cls.TestingSessionLocal()
                yield db
            finally:
                db.close()
        
        app.dependency_overrides[get_db] = override_get_db
    
    @classmethod
    def tearDownClass(cls):
        """Limpieza después de todos los tests de la clase"""
        # Eliminar todas las tablas
        Base.metadata.drop_all(bind=cls.engine)
        
        # Limpiar overrides de dependencias
        app.dependency_overrides.clear()
    
    def setUp(self):
        """Configuración antes de cada test"""
        self.db = self.TestingSessionLocal()
    
    def tearDown(self):
        """Limpieza después de cada test"""
        # Limpiar datos de prueba
        self.db.query(Permiso).delete()
        self.db.query(Nino).delete()
        self.db.query(Encargado).delete()
        self.db.query(Usuario).delete()
        self.db.commit()
        self.db.close()
    
    def create_test_user(self, nombre="Test User", correo="test@example.com", 
                        contrasena="testpass123", rol="padre"):
        """Crear un usuario de prueba"""
        from app.core.segurity import hash_password
        
        user = Usuario(
            nombre=nombre,
            correo=correo,
            contrasena=hash_password(contrasena),
            rol=rol
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def create_test_nino(self, nombre="Test Niño", carnet="CI-TEST123"):
        """Crear un niño de prueba"""
        nino = Nino(
            nombre=nombre,
            fecha_nacimiento="2015-05-20",
            genero="Masculino",
            carnet=carnet,
            tipo_sangre="O+",
            departamento="La Paz",
            ciudad="La Paz",
            direccion="Test Address 123",
            telefono="77777777",
            email="test@example.com",
            encargado="Test Encargado",
            telefono_encargado="78888888",
            colegio="Test School",
            grado="5to",
            alergias="Ninguna",
            medicamentos="Ninguno",
            estado="Activo",
            permisos_activos=0,
            viajes_realizados=0
        )
        self.db.add(nino)
        self.db.commit()
        self.db.refresh(nino)
        return nino
    
    def get_auth_headers(self, correo="admin@example.com", contrasena="admin123"):
        """Obtener headers de autenticación para requests"""
        response = self.client.post("/login", data={
            "username": correo,
            "password": contrasena
        })
        if response.status_code == 200:
            token = response.json()["access_token"]
            return {"Authorization": f"Bearer {token}"}
        return {}
