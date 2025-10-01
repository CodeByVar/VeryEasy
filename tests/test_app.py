from fastapi.testclient import TestClient

from app.main import app
from app.database.conexion import Base, engine, SessionLocal
from app.models.nino import Nino


def setup_module(module):
    # Asegura que las tablas existan antes de correr las pruebas
    Base.metadata.create_all(bind=engine)


def teardown_function(function):
    # Limpia la tabla de ninos entre pruebas para aislamiento simple
    db = SessionLocal()
    try:
        db.query(Nino).delete()
        db.commit()
    finally:
        db.close()


client = TestClient(app)


def test_root_ok():
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert "mensaje" in data


def test_get_ninos_lista_vacia():
    resp = client.get("/ninos/")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) == 0


def test_crear_y_obtener_nino():
    payload = {
        "nombre": "Juan Perez",
        "fecha_nacimiento": "2015-05-20",
        "genero": "Masculino",
        "carnet": "CI-123456",
        "tipo_sangre": "O+",
        "departamento": "La Paz",
        "ciudad": "La Paz",
        "direccion": "Av. Siempre Viva 123",
        "telefono": "77777777",
        "email": "juan@example.com",
        "encargado": "Maria Perez",
        "telefono_encargado": "78888888",
        "colegio": "Colegio Central",
        "grado": "5to",
        "alergias": "Ninguna",
        "medicamentos": "Ninguno",
        "condiciones_medicas": None,
        "nombre_padre": "Carlos Perez",
        "nombre_madre": "Maria Lopez",
        "observaciones": None,
        "estado": "Activo",
        "permisos_activos": 0,
        "viajes_realizados": 0,
    }

    r_create = client.post("/ninos/", json=payload)
    assert r_create.status_code == 200
    creado = r_create.json()
    assert creado["carnet"] == payload["carnet"]
    nino_id = creado["id"]

    r_get = client.get(f"/ninos/{nino_id}")
    assert r_get.status_code == 200
    obtenido = r_get.json()
    assert obtenido["id"] == nino_id
    assert obtenido["nombre"] == payload["nombre"]


