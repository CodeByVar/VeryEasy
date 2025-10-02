"""
Tests para endpoints de la API
"""
import unittest
from datetime import date, datetime

from tests.test_config import BaseTestCase


class TestRootEndpoint(BaseTestCase):
    """Tests para endpoint raíz"""
    
    def test_root_endpoint(self):
        """Test para endpoint raíz"""
        response = self.client.get("/")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("mensaje", data)
        self.assertEqual(data["mensaje"], "¡API Vereasy!")


class TestNinoEndpoints(BaseTestCase):
    """Tests para endpoints de niños"""
    
    def test_get_ninos_empty(self):
        """Test para obtener lista vacía de niños"""
        response = self.client.get("/ninos/")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 0)
    
    def test_create_nino(self):
        """Test para crear niño"""
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
            "condiciones_medicas": None,
            "nombre_padre": "Carlos Pérez",
            "nombre_madre": "María López",
            "observaciones": None,
            "estado": "Activo",
            "permisos_activos": 0,
            "viajes_realizados": 0
        }
        
        response = self.client.post("/ninos/", json=nino_data)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verificar datos del niño creado
        self.assertIn("id", data)
        self.assertEqual(data["nombre"], nino_data["nombre"])
        self.assertEqual(data["carnet"], nino_data["carnet"])
        self.assertEqual(data["genero"], nino_data["genero"])
        self.assertEqual(data["tipo_sangre"], nino_data["tipo_sangre"])
    
    def test_create_nino_duplicate_carnet(self):
        """Test para crear niño con carnet duplicado"""
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
        response1 = self.client.post("/ninos/", json=nino_data)
        self.assertEqual(response1.status_code, 200)
        
        # Intentar crear segundo niño con mismo carnet
        nino_data["nombre"] = "Pedro González"
        response2 = self.client.post("/ninos/", json=nino_data)
        
        # Debe fallar por carnet duplicado
        self.assertEqual(response2.status_code, 400)
        data = response2.json()
        self.assertIn("detail", data)
    
    def test_get_nino_by_id(self):
        """Test para obtener niño por ID"""
        # Crear niño
        nino = self.create_test_nino()
        
        response = self.client.get(f"/ninos/{nino.id}")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["id"], nino.id)
        self.assertEqual(data["nombre"], nino.nombre)
        self.assertEqual(data["carnet"], nino.carnet)
    
    def test_get_nino_not_found(self):
        """Test para obtener niño inexistente"""
        response = self.client.get("/ninos/999")
        
        self.assertEqual(response.status_code, 404)
        data = response.json()
        self.assertIn("detail", data)
    
    def test_update_nino(self):
        """Test para actualizar niño"""
        # Crear niño
        nino = self.create_test_nino()
        
        update_data = {
            "nombre": "Juan Actualizado",
            "telefono": "77777779",
            "email": "juan.actualizado@example.com"
        }
        
        response = self.client.put(f"/ninos/{nino.id}", json=update_data)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["nombre"], update_data["nombre"])
        self.assertEqual(data["telefono"], update_data["telefono"])
        self.assertEqual(data["email"], update_data["email"])
    
    def test_delete_nino(self):
        """Test para eliminar niño"""
        # Crear niño
        nino = self.create_test_nino()
        
        response = self.client.delete(f"/ninos/{nino.id}")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("mensaje", data)
        
        # Verificar que el niño fue eliminado
        get_response = self.client.get(f"/ninos/{nino.id}")
        self.assertEqual(get_response.status_code, 404)


class TestEncargadoEndpoints(BaseTestCase):
    """Tests para endpoints de encargados"""
    
    def test_get_encargados_empty(self):
        """Test para obtener lista vacía de encargados"""
        response = self.client.get("/encargados/")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 0)
    
    def test_create_encargado(self):
        """Test para crear encargado"""
        encargado_data = {
            "nombre": "Juan",
            "apellido": "Pérez",
            "ci": "12345678",
            "telefono": "77777777",
            "direccion": "Av. Siempre Viva 123",
            "correo": "juan@example.com",
            "parentesco": "Padre",
            "ocupacion": "Ingeniero",
            "lugar_trabajo": "Empresa XYZ",
            "telefono_trabajo": "22222222",
            "estado": "Activo",
            "observaciones": "Encargado responsable",
            "es_contacto_emergencia": True
        }
        
        response = self.client.post("/encargados/", json=encargado_data)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verificar datos del encargado creado
        self.assertIn("id", data)
        self.assertEqual(data["nombre"], encargado_data["nombre"])
        self.assertEqual(data["apellido"], encargado_data["apellido"])
        self.assertEqual(data["ci"], encargado_data["ci"])
        self.assertEqual(data["parentesco"], encargado_data["parentesco"])
    
    def test_create_encargado_duplicate_ci(self):
        """Test para crear encargado con CI duplicado"""
        encargado_data = {
            "nombre": "Juan",
            "apellido": "Pérez",
            "ci": "CI-DUPLICATE123",
            "telefono": "77777777",
            "direccion": "Av. Siempre Viva 123",
            "parentesco": "Padre"
        }
        
        # Crear primer encargado
        response1 = self.client.post("/encargados/", json=encargado_data)
        self.assertEqual(response1.status_code, 200)
        
        # Intentar crear segundo encargado con mismo CI
        encargado_data["nombre"] = "María"
        encargado_data["apellido"] = "González"
        response2 = self.client.post("/encargados/", json=encargado_data)
        
        # Debe fallar por CI duplicado
        self.assertEqual(response2.status_code, 400)
        data = response2.json()
        self.assertIn("detail", data)
    
    def test_get_encargado_by_id(self):
        """Test para obtener encargado por ID"""
        # Crear encargado directamente en la base de datos
        from app.models.encargado import Encargado
        
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
        
        response = self.client.get(f"/encargados/{encargado.id}")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["id"], encargado.id)
        self.assertEqual(data["nombre"], encargado.nombre)
        self.assertEqual(data["ci"], encargado.ci)


class TestPermisoEndpoints(BaseTestCase):
    """Tests para endpoints de permisos"""
    
    def test_get_permisos_empty(self):
        """Test para obtener lista vacía de permisos"""
        response = self.client.get("/permisos/")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 0)
    
    def test_create_permiso(self):
        """Test para crear permiso"""
        # Crear niño y encargado necesarios
        nino = self.create_test_nino()
        
        from app.models.encargado import Encargado
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
        
        permiso_data = {
            "id_nino": nino.id,
            "id_encargado": encargado.id,
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
        
        response = self.client.post("/permisos/", json=permiso_data)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verificar datos del permiso creado
        self.assertIn("id", data)
        self.assertEqual(data["id_nino"], permiso_data["id_nino"])
        self.assertEqual(data["id_encargado"], permiso_data["id_encargado"])
        self.assertEqual(data["tipo_permiso"], permiso_data["tipo_permiso"])
        self.assertEqual(data["destino"], permiso_data["destino"])
        self.assertEqual(data["estado"], permiso_data["estado"])
    
    def test_get_permiso_by_id(self):
        """Test para obtener permiso por ID"""
        # Crear permiso directamente en la base de datos
        nino = self.create_test_nino()
        
        from app.models.encargado import Encargado
        from app.models.permiso import Permiso
        
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
        
        response = self.client.get(f"/permisos/{permiso.id}")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["id"], permiso.id)
        self.assertEqual(data["tipo_permiso"], permiso.tipo_permiso)
        self.assertEqual(data["destino"], permiso.destino)


class TestUsuarioEndpoints(BaseTestCase):
    """Tests para endpoints de usuarios"""
    
    def test_get_usuarios_empty(self):
        """Test para obtener lista vacía de usuarios"""
        response = self.client.get("/usuarios/")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 0)
    
    def test_create_usuario(self):
        """Test para crear usuario"""
        usuario_data = {
            "nombre": "Test User",
            "correo": "test@example.com",
            "contrasena": "testpass123",
            "rol": "padre"
        }
        
        response = self.client.post("/usuarios/", json=usuario_data)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verificar datos del usuario creado
        self.assertIn("id", data)
        self.assertEqual(data["nombre"], usuario_data["nombre"])
        self.assertEqual(data["correo"], usuario_data["correo"])
        self.assertEqual(data["rol"], usuario_data["rol"])
        
        # La contraseña no debe estar en la respuesta
        self.assertNotIn("contrasena", data)
    
    def test_create_usuario_duplicate_email(self):
        """Test para crear usuario con email duplicado"""
        usuario_data = {
            "nombre": "Test User",
            "correo": "duplicate@example.com",
            "contrasena": "testpass123",
            "rol": "padre"
        }
        
        # Crear primer usuario
        response1 = self.client.post("/usuarios/", json=usuario_data)
        self.assertEqual(response1.status_code, 200)
        
        # Intentar crear segundo usuario con mismo email
        usuario_data["nombre"] = "Another User"
        response2 = self.client.post("/usuarios/", json=usuario_data)
        
        # Debe fallar por email duplicado
        self.assertEqual(response2.status_code, 400)
        data = response2.json()
        self.assertIn("detail", data)


if __name__ == '__main__':
    unittest.main()
