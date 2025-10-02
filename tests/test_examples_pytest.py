"""
Ejemplos de tests avanzados usando pytest
"""
import pytest
from datetime import date, datetime, timedelta
from fastapi import status


class TestNinoWithPytest:
    """Ejemplos de tests para niños usando pytest"""
    
    def test_create_nino_success(self, client, test_db):
        """Test exitoso para crear niño"""
        nino_data = {
            "nombre": "Juan Pérez",
            "fecha_nacimiento": "2015-05-20",
            "genero": "Masculino",
            "carnet": "CI-123456",
            "tipo_sangre": "O+",
            "departamento": "La Paz",
            "ciudad": "La Paz",
            "direccion": "Av. Siempre Viva 123",
            "telefono": "77777777",
            "email": "juan@example.com",
            "encargado": "María Pérez",
            "telefono_encargado": "78888888",
            "colegio": "Colegio Central",
            "grado": "5to",
            "alergias": "Ninguna",
            "medicamentos": "Ninguno",
            "estado": "Activo",
            "permisos_activos": 0,
            "viajes_realizados": 0
        }
        
        response = client.post("/ninos/", json=nino_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["nombre"] == nino_data["nombre"]
        assert data["carnet"] == nino_data["carnet"]
        assert "id" in data
    
    def test_create_nino_duplicate_carnet(self, client, test_db):
        """Test para carnet duplicado"""
        nino_data = {
            "nombre": "Juan Pérez",
            "fecha_nacimiento": "2015-05-20",
            "genero": "Masculino",
            "carnet": "CI-DUPLICATE123",
            "tipo_sangre": "O+",
            "departamento": "La Paz",
            "ciudad": "La Paz",
            "direccion": "Av. Siempre Viva 123",
            "encargado": "María Pérez",
            "telefono_encargado": "78888888",
            "colegio": "Colegio Central",
            "grado": "5to"
        }
        
        # Crear primer niño
        response1 = client.post("/ninos/", json=nino_data)
        assert response1.status_code == status.HTTP_200_OK
        
        # Intentar crear segundo niño con mismo carnet
        nino_data["nombre"] = "Pedro González"
        response2 = client.post("/ninos/", json=nino_data)
        
        assert response2.status_code == status.HTTP_400_BAD_REQUEST
        assert "detail" in response2.json()
    
    def test_get_nino_by_id(self, client, test_nino):
        """Test para obtener niño por ID"""
        response = client.get(f"/ninos/{test_nino.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == test_nino.id
        assert data["nombre"] == test_nino.nombre
        assert data["carnet"] == test_nino.carnet
    
    def test_get_nino_not_found(self, client):
        """Test para niño no encontrado"""
        response = client.get("/ninos/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "detail" in response.json()


class TestPermisoWithPytest:
    """Ejemplos de tests para permisos usando pytest"""
    
    def test_create_permiso_success(self, client, test_nino, test_encargado):
        """Test exitoso para crear permiso"""
        permiso_data = {
            "id_nino": test_nino.id,
            "id_encargado": test_encargado.id,
            "tipo_permiso": "Salida médica",
            "destino": "Hospital Central",
            "motivo": "Consulta médica",
            "fecha_salida": "2024-01-15",
            "hora_salida": "08:00",
            "fecha_retorno": "2024-01-15",
            "hora_retorno": "12:00",
            "estado": "Pendiente",
            "transporte": "Vehículo propio",
            "acompanante": "Madre",
            "telefono_contacto": "77777777"
        }
        
        response = client.post("/permisos/", json=permiso_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id_nino"] == permiso_data["id_nino"]
        assert data["id_encargado"] == permiso_data["id_encargado"]
        assert data["tipo_permiso"] == permiso_data["tipo_permiso"]
        assert data["destino"] == permiso_data["destino"]
        assert "id" in data
    
    def test_create_permiso_invalid_foreign_keys(self, client):
        """Test para claves foráneas inválidas"""
        permiso_data = {
            "id_nino": 999,  # ID inexistente
            "id_encargado": 999,  # ID inexistente
            "tipo_permiso": "Test",
            "destino": "Test",
            "motivo": "Test",
            "fecha_salida": "2024-01-15",
            "hora_salida": "08:00",
            "fecha_retorno": "2024-01-15",
            "hora_retorno": "12:00"
        }
        
        response = client.post("/permisos/", json=permiso_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "detail" in response.json()
    
    def test_get_permiso_by_id(self, client, test_permiso):
        """Test para obtener permiso por ID"""
        response = client.get(f"/permisos/{test_permiso.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == test_permiso.id
        assert data["tipo_permiso"] == test_permiso.tipo_permiso
        assert data["destino"] == test_permiso.destino


class TestAuthWithPytest:
    """Ejemplos de tests de autenticación usando pytest"""
    
    def test_login_success(self, client):
        """Test exitoso para login"""
        response = client.post("/login", data={
            "username": "admin@example.com",
            "password": "admin123"
        })
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["email"] == "admin@example.com"
        assert data["role"] == "admin"
    
    def test_login_invalid_credentials(self, client):
        """Test para credenciales inválidas"""
        response = client.post("/login", data={
            "username": "wrong@example.com",
            "password": "wrongpassword"
        })
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        data = response.json()
        assert data["detail"] == "Credenciales incorrectas"
    
    def test_protected_endpoint_without_token(self, client):
        """Test para endpoint protegido sin token"""
        response = client.get("/usuarios/admin-only")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_protected_endpoint_with_valid_token(self, client, auth_headers):
        """Test para endpoint protegido con token válido"""
        response = client.get("/usuarios/admin-only", headers=auth_headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "mensaje" in data
        assert "admin@example.com" in data["mensaje"]


class TestParametrizedTests:
    """Ejemplos de tests parametrizados"""
    
    @pytest.mark.parametrize("blood_type", ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    def test_valid_blood_types(self, blood_type):
        """Test para tipos de sangre válidos"""
        assert len(blood_type) == 2
        assert blood_type[1] in ["+", "-"]
        assert blood_type[0] in ["A", "B", "AB", "O"]
    
    @pytest.mark.parametrize("role", ["admin", "encargado", "padre"])
    def test_valid_user_roles(self, role):
        """Test para roles de usuario válidos"""
        assert isinstance(role, str)
        assert len(role) > 0
        assert role in ["admin", "encargado", "padre"]
    
    @pytest.mark.parametrize("status", ["Pendiente", "Aprobado", "Rechazado", "Expirado"])
    def test_valid_permission_statuses(self, status):
        """Test para estados de permiso válidos"""
        assert isinstance(status, str)
        assert len(status) > 0
        assert status in ["Pendiente", "Aprobado", "Rechazado", "Expirado"]


class TestFixturesAndHelpers:
    """Ejemplos de uso de fixtures y helpers"""
    
    def test_multiple_ninos(self, client, test_db):
        """Test para crear múltiples niños"""
        ninos_data = [
            {
                "nombre": "Niño 1",
                "fecha_nacimiento": "2015-01-01",
                "genero": "Masculino",
                "carnet": "CI-001",
                "tipo_sangre": "O+",
                "departamento": "La Paz",
                "ciudad": "La Paz",
                "direccion": "Dirección 1",
                "encargado": "Encargado 1",
                "telefono_encargado": "11111111",
                "colegio": "Colegio 1",
                "grado": "5to"
            },
            {
                "nombre": "Niña 1",
                "fecha_nacimiento": "2016-02-02",
                "genero": "Femenino",
                "carnet": "CI-002",
                "tipo_sangre": "A+",
                "departamento": "Cochabamba",
                "ciudad": "Cochabamba",
                "direccion": "Dirección 2",
                "encargado": "Encargado 2",
                "telefono_encargado": "22222222",
                "colegio": "Colegio 2",
                "grado": "4to"
            }
        ]
        
        created_ninos = []
        for nino_data in ninos_data:
            response = client.post("/ninos/", json=nino_data)
            assert response.status_code == status.HTTP_200_OK
            created_ninos.append(response.json())
        
        # Verificar que se crearon correctamente
        assert len(created_ninos) == 2
        assert created_ninos[0]["nombre"] == "Niño 1"
        assert created_ninos[1]["nombre"] == "Niña 1"
    
    def test_nino_with_permiso(self, client, test_nino, test_encargado):
        """Test para niño con permiso"""
        # Crear permiso para el niño
        permiso_data = {
            "id_nino": test_nino.id,
            "id_encargado": test_encargado.id,
            "tipo_permiso": "Salida familiar",
            "destino": "Casa",
            "motivo": "Visita familiar",
            "fecha_salida": "2024-01-15",
            "hora_salida": "10:00",
            "fecha_retorno": "2024-01-15",
            "hora_retorno": "18:00"
        }
        
        response = client.post("/permisos/", json=permiso_data)
        assert response.status_code == status.HTTP_200_OK
        
        permiso = response.json()
        
        # Verificar que el permiso está asociado al niño correcto
        assert permiso["id_nino"] == test_nino.id
        assert permiso["id_encargado"] == test_encargado.id


class TestErrorHandling:
    """Ejemplos de tests para manejo de errores"""
    
    def test_invalid_json_format(self, client):
        """Test para formato JSON inválido"""
        response = client.post("/ninos/", data="invalid json")
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_missing_required_fields(self, client):
        """Test para campos requeridos faltantes"""
        incomplete_data = {
            "nombre": "Test Niño"
            # Faltan campos requeridos
        }
        
        response = client.post("/ninos/", json=incomplete_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_invalid_date_format(self, client):
        """Test para formato de fecha inválido"""
        nino_data = {
            "nombre": "Test Niño",
            "fecha_nacimiento": "invalid-date",
            "genero": "Masculino",
            "carnet": "CI-TEST123",
            "tipo_sangre": "O+",
            "departamento": "La Paz",
            "ciudad": "La Paz",
            "direccion": "Test Address 123",
            "encargado": "Test Encargado",
            "telefono_encargado": "78888888",
            "colegio": "Test School",
            "grado": "5to"
        }
        
        response = client.post("/ninos/", json=nino_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


if __name__ == '__main__':
    pytest.main([__file__, '-v'])

