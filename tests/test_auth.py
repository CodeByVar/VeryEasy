"""
Tests para autenticación y seguridad
"""
import unittest
from datetime import datetime, timedelta
from jose import jwt, JWTError

from tests.test_config import BaseTestCase, TestConfig
from app.core.segurity import hash_password, verify_password, create_token, SECRET_KEY, ALGORITHM
from app.models.usuario import Usuario


class TestSecurity(BaseTestCase):
    """Tests para funciones de seguridad"""
    
    def test_hash_password(self):
        """Test para hash de contraseñas"""
        password = "testpassword123"
        hashed = hash_password(password)
        
        # El hash no debe ser igual a la contraseña original
        self.assertNotEqual(password, hashed)
        
        # El hash debe tener una longitud razonable
        self.assertGreater(len(hashed), 20)
    
    def test_verify_password_correct(self):
        """Test para verificación de contraseña correcta"""
        password = "testpassword123"
        hashed = hash_password(password)
        
        # La verificación debe ser exitosa
        self.assertTrue(verify_password(password, hashed))
    
    def test_verify_password_incorrect(self):
        """Test para verificación de contraseña incorrecta"""
        password = "testpassword123"
        wrong_password = "wrongpassword456"
        hashed = hash_password(password)
        
        # La verificación debe fallar
        self.assertFalse(verify_password(wrong_password, hashed))
    
    def test_create_token(self):
        """Test para creación de tokens JWT"""
        data = {"sub": "test@example.com", "rol": "admin"}
        token = create_token(data)
        
        # El token debe ser una cadena
        self.assertIsInstance(token, str)
        
        # El token debe tener contenido
        self.assertGreater(len(token), 10)
    
    def test_token_decode(self):
        """Test para decodificación de tokens JWT"""
        data = {"sub": "test@example.com", "rol": "admin"}
        token = create_token(data)
        
        # Decodificar el token
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Verificar que los datos estén correctos
        self.assertEqual(decoded["sub"], "test@example.com")
        self.assertEqual(decoded["rol"], "admin")
        
        # Verificar que tenga fecha de expiración
        self.assertIn("exp", decoded)
    
    def test_token_expiration(self):
        """Test para expiración de tokens"""
        data = {"sub": "test@example.com", "rol": "admin"}
        
        # Crear token con expiración muy corta
        expire = datetime.utcnow() + timedelta(seconds=1)
        data_with_exp = data.copy()
        data_with_exp.update({"exp": expire})
        token = jwt.encode(data_with_exp, SECRET_KEY, algorithm=ALGORITHM)
        
        # El token debe ser válido inicialmente
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        self.assertEqual(decoded["sub"], "test@example.com")


class TestAuthEndpoints(BaseTestCase):
    """Tests para endpoints de autenticación"""
    
    def test_login_success(self):
        """Test para login exitoso"""
        response = self.client.post("/login", data={
            "username": "admin@example.com",
            "password": "admin123"
        })
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verificar estructura de respuesta
        self.assertIn("access_token", data)
        self.assertIn("token_type", data)
        self.assertIn("email", data)
        self.assertIn("role", data)
        
        # Verificar valores
        self.assertEqual(data["token_type"], "bearer")
        self.assertEqual(data["email"], "admin@example.com")
        self.assertEqual(data["role"], "admin")
    
    def test_login_invalid_credentials(self):
        """Test para credenciales inválidas"""
        response = self.client.post("/login", data={
            "username": "wrong@example.com",
            "password": "wrongpassword"
        })
        
        self.assertEqual(response.status_code, 401)
        data = response.json()
        self.assertIn("detail", data)
        self.assertEqual(data["detail"], "Credenciales incorrectas")
    
    def test_login_missing_credentials(self):
        """Test para credenciales faltantes"""
        response = self.client.post("/login", data={
            "username": "",
            "password": ""
        })
        
        self.assertEqual(response.status_code, 401)
    
    def test_protected_endpoint_without_token(self):
        """Test para endpoint protegido sin token"""
        response = self.client.get("/usuarios/admin-only")
        
        self.assertEqual(response.status_code, 401)
    
    def test_protected_endpoint_with_valid_token(self):
        """Test para endpoint protegido con token válido"""
        # Obtener token de autenticación
        auth_response = self.client.post("/login", data={
            "username": "admin@example.com",
            "password": "admin123"
        })
        
        self.assertEqual(auth_response.status_code, 200)
        token = auth_response.json()["access_token"]
        
        # Usar token para acceder a endpoint protegido
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get("/usuarios/admin-only", headers=headers)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("mensaje", data)
        self.assertIn("admin@example.com", data["mensaje"])
    
    def test_protected_endpoint_with_invalid_token(self):
        """Test para endpoint protegido con token inválido"""
        headers = {"Authorization": "Bearer invalid_token"}
        response = self.client.get("/usuarios/admin-only", headers=headers)
        
        self.assertEqual(response.status_code, 401)


class TestUserModel(BaseTestCase):
    """Tests para modelo de usuario"""
    
    def test_create_user(self):
        """Test para crear usuario"""
        user = self.create_test_user()
        
        self.assertIsNotNone(user.id)
        self.assertEqual(user.nombre, "Test User")
        self.assertEqual(user.correo, "test@example.com")
        self.assertEqual(user.rol, "padre")
        
        # Verificar que la contraseña esté hasheada
        self.assertNotEqual(user.contrasena, "testpass123")
        self.assertTrue(verify_password("testpass123", user.contrasena))
    
    def test_user_unique_email(self):
        """Test para email único de usuario"""
        # Crear primer usuario
        user1 = self.create_test_user(correo="unique@example.com")
        
        # Intentar crear segundo usuario con mismo email
        user2 = Usuario(
            nombre="Another User",
            correo="unique@example.com",
            contrasena=hash_password("password123"),
            rol="admin"
        )
        
        self.db.add(user2)
        
        # Debe lanzar excepción por email duplicado
        with self.assertRaises(Exception):
            self.db.commit()
    
    def test_user_roles(self):
        """Test para diferentes roles de usuario"""
        roles = ["admin", "encargado", "padre"]
        
        for i, rol in enumerate(roles):
            user = self.create_test_user(
                nombre=f"User {i+1}",
                correo=f"user{i+1}@example.com",
                rol=rol
            )
            self.assertEqual(user.rol, rol)


if __name__ == '__main__':
    unittest.main()
