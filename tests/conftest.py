"""
Configuración de pytest para el proyecto Vereasy
"""
import pytest
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.main import app
from app.database.conexion import Base, get_db
from app.models.usuario import Usuario
from app.models.nino import Nino
from app.models.encargado import Encargado
from app.models.permiso import Permiso


@pytest.fixture(scope="session")
def test_db_engine():
    """Motor de base de datos para tests"""
    engine = create_engine(
        "sqlite:///./test.db",
        connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def test_db(test_db_engine):
    """Sesión de base de datos para tests"""
    TestingSessionLocal = sessionmaker(
        autocommit=False, 
        autoflush=False, 
        bind=test_db_engine
    )
    
    session = TestingSessionLocal()
    
    # Sobrescribir la dependencia de base de datos
    def override_get_db():
        try:
            yield session
        finally:
            session.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    yield session
    
    # Limpiar datos después del test
    session.query(Permiso).delete()
    session.query(Nino).delete()
    session.query(Encargado).delete()
    session.query(Usuario).delete()
    session.commit()
    session.close()
    
    # Limpiar overrides
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def client(test_db):
    """Cliente de prueba para FastAPI"""
    return TestClient(app)


@pytest.fixture
def test_user(test_db):
    """Usuario de prueba"""
    from app.core.segurity import hash_password
    
    user = Usuario(
        nombre="Test User",
        correo="test@example.com",
        contrasena=hash_password("testpass123"),
        rol="padre"
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture
def test_nino(test_db):
    """Niño de prueba"""
    nino = Nino(
        nombre="Test Niño",
        fecha_nacimiento="2015-05-20",
        genero="Masculino",
        carnet="CI-TEST123",
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
    test_db.add(nino)
    test_db.commit()
    test_db.refresh(nino)
    return nino


@pytest.fixture
def test_encargado(test_db):
    """Encargado de prueba"""
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
    test_db.add(encargado)
    test_db.commit()
    test_db.refresh(encargado)
    return encargado


@pytest.fixture
def test_permiso(test_db, test_nino, test_encargado):
    """Permiso de prueba"""
    from datetime import date
    
    permiso = Permiso(
        id_nino=test_nino.id,
        id_encargado=test_encargado.id,
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
    test_db.add(permiso)
    test_db.commit()
    test_db.refresh(permiso)
    return permiso


@pytest.fixture
def auth_headers(client):
    """Headers de autenticación para tests"""
    response = client.post("/login", data={
        "username": "admin@example.com",
        "password": "admin123"
    })
    
    if response.status_code == 200:
        token = response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    return {}


def pytest_html_report_title(report):
    report.title = "Reporte de Pruebas Automatizadas de VeryEasy v1.0"
    # Se ejecuta al inicio de la sesión
def pytest_configure(config):
    if not hasattr(config, '_metadata'):
        config._metadata = {}
    
    # Añade información clave al inicio
    config._metadata['Proyecto'] = 'VeryEasy App'
    config._metadata['Versión de App'] = '1.0'
    config._metadata['Ambiente de Prueba'] = 'Desarrollo'

# Se ejecuta al final de la sesión
def pytest_sessionfinish(session):
    # Puedes modificar o añadir información al final, por ejemplo, el tiempo de ejecución.
    session.config._metadata['Hora de Finalización'] = "..." # Aquí puedes obtener la hora real