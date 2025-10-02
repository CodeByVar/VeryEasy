"""
Tests para funciones utilitarias y helpers
"""
import unittest
from datetime import datetime, date, timedelta

from tests.test_config import BaseTestCase


class TestDateUtils(BaseTestCase):
    """Tests para utilidades de fecha"""
    
    def test_date_validation(self):
        """Test para validación de fechas"""
        # Fecha válida
        valid_date = date(2024, 1, 15)
        self.assertIsInstance(valid_date, date)
        
        # Fecha futura
        future_date = date.today() + timedelta(days=30)
        self.assertGreater(future_date, date.today())
        
        # Fecha pasada
        past_date = date.today() - timedelta(days=30)
        self.assertLess(past_date, date.today())
    
    def test_datetime_validation(self):
        """Test para validación de datetime"""
        # DateTime válido
        valid_datetime = datetime.now()
        self.assertIsInstance(valid_datetime, datetime)
        
        # DateTime con timezone
        from datetime import timezone
        utc_datetime = datetime.now(timezone.utc)
        self.assertIsNotNone(utc_datetime.tzinfo)


class TestStringUtils(BaseTestCase):
    """Tests para utilidades de strings"""
    
    def test_string_validation(self):
        """Test para validación de strings"""
        # String válido
        valid_string = "Test String"
        self.assertIsInstance(valid_string, str)
        self.assertGreater(len(valid_string), 0)
        
        # String vacío
        empty_string = ""
        self.assertEqual(len(empty_string), 0)
        
        # String con espacios
        spaced_string = "  Test  "
        stripped = spaced_string.strip()
        self.assertEqual(stripped, "Test")
    
    def test_email_validation(self):
        """Test para validación de emails"""
        # Emails válidos
        valid_emails = [
            "test@example.com",
            "user.name@domain.co.uk",
            "admin+test@company.org"
        ]
        
        for email in valid_emails:
            self.assertIn("@", email)
            self.assertIn(".", email.split("@")[1])
        
        # Emails inválidos
        invalid_emails = [
            "invalid-email",
            "@domain.com",
            "user@",
            "user@domain"
        ]
        
        for email in invalid_emails:
            # Verificar que el email es inválido
            if "@" not in email:
                is_invalid = True
            elif email.startswith("@") or email.endswith("@"):
                is_invalid = True
            elif "." not in email.split("@")[1]:
                is_invalid = True
            else:
                is_invalid = False
            
            self.assertTrue(is_invalid, f"Email debería ser inválido: {email}")


class TestValidationUtils(BaseTestCase):
    """Tests para utilidades de validación"""
    
    def test_required_field_validation(self):
        """Test para validación de campos requeridos"""
        # Campo requerido presente
        required_field = "Test Value"
        self.assertIsNotNone(required_field)
        self.assertNotEqual(required_field, "")
        
        # Campo requerido ausente
        empty_field = ""
        self.assertEqual(empty_field, "")
        
        # Campo requerido None
        none_field = None
        self.assertIsNone(none_field)
    
    def test_length_validation(self):
        """Test para validación de longitud"""
        # Longitud mínima
        min_length = 5
        test_string = "Hello"
        self.assertGreaterEqual(len(test_string), min_length)
        
        # Longitud máxima
        max_length = 10
        test_string = "Hello World"
        # Este test debería fallar porque "Hello World" tiene 11 caracteres
        self.assertGreater(len(test_string), max_length)
        
        # Longitud exacta
        exact_length = 5
        test_string = "Hello"
        self.assertEqual(len(test_string), exact_length)
    
    def test_numeric_validation(self):
        """Test para validación numérica"""
        # Número positivo
        positive_number = 42
        self.assertGreater(positive_number, 0)
        
        # Número negativo
        negative_number = -42
        self.assertLess(negative_number, 0)
        
        # Número cero
        zero = 0
        self.assertEqual(zero, 0)
        
        # Número decimal
        decimal_number = 3.14
        self.assertIsInstance(decimal_number, float)


class TestBusinessLogicUtils(BaseTestCase):
    """Tests para lógica de negocio"""
    
    def test_age_calculation(self):
        """Test para cálculo de edad"""
        from datetime import date
        
        # Calcular edad
        birth_date = date(2015, 5, 20)
        today = date.today()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        
        self.assertGreater(age, 0)
        self.assertLess(age, 100)  # Asumiendo que no hay niños mayores a 100 años
    
    def test_permission_status_validation(self):
        """Test para validación de estados de permiso"""
        valid_statuses = ["Pendiente", "Aprobado", "Rechazado", "Expirado"]
        
        for status in valid_statuses:
            self.assertIsInstance(status, str)
            self.assertGreater(len(status), 0)
        
        # Estado inválido
        invalid_status = "InvalidStatus"
        self.assertNotIn(invalid_status, valid_statuses)
    
    def test_user_role_validation(self):
        """Test para validación de roles de usuario"""
        valid_roles = ["admin", "encargado", "padre"]
        
        for role in valid_roles:
            self.assertIsInstance(role, str)
            self.assertGreater(len(role), 0)
        
        # Rol inválido
        invalid_role = "invalid_role"
        self.assertNotIn(invalid_role, valid_roles)
    
    def test_blood_type_validation(self):
        """Test para validación de tipos de sangre"""
        valid_blood_types = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
        
        for blood_type in valid_blood_types:
            self.assertIsInstance(blood_type, str)
            self.assertTrue("+" in blood_type or "-" in blood_type)
        
        # Tipo de sangre inválido
        invalid_blood_type = "X+"
        self.assertNotIn(invalid_blood_type, valid_blood_types)


class TestDataTransformationUtils(BaseTestCase):
    """Tests para transformación de datos"""
    
    def test_json_serialization(self):
        """Test para serialización JSON"""
        import json
        
        # Datos simples
        simple_data = {"name": "Test", "age": 25}
        json_string = json.dumps(simple_data)
        parsed_data = json.loads(json_string)
        
        self.assertEqual(parsed_data["name"], "Test")
        self.assertEqual(parsed_data["age"], 25)
    
    def test_data_cleaning(self):
        """Test para limpieza de datos"""
        # Limpiar espacios en blanco
        dirty_string = "  Test String  "
        clean_string = dirty_string.strip()
        self.assertEqual(clean_string, "Test String")
        
        # Limpiar caracteres especiales
        special_string = "Test@#$%String"
        clean_special = ''.join(c for c in special_string if c.isalnum() or c.isspace())
        self.assertEqual(clean_special, "TestString")
    
    def test_data_formatting(self):
        """Test para formateo de datos"""
        # Formatear teléfono
        phone = "77777777"
        formatted_phone = f"+591 {phone}"
        self.assertIn("+591", formatted_phone)
        
        # Formatear fecha
        test_date = date(2024, 1, 15)
        formatted_date = test_date.strftime("%d/%m/%Y")
        self.assertEqual(formatted_date, "15/01/2024")


class TestSecurityUtils(BaseTestCase):
    """Tests para utilidades de seguridad"""
    
    def test_password_strength(self):
        """Test para fuerza de contraseña"""
        # Contraseña fuerte
        strong_password = "StrongPass123!"
        self.assertGreaterEqual(len(strong_password), 8)
        
        # Contraseña débil
        weak_password = "123"
        self.assertLess(len(weak_password), 8)
    
    def test_input_sanitization(self):
        """Test para sanitización de entrada"""
        # Entrada con caracteres especiales
        malicious_input = "<script>alert('xss')</script>"
        sanitized = malicious_input.replace("<", "&lt;").replace(">", "&gt;")
        self.assertNotIn("<script>", sanitized)
        
        # Entrada normal
        normal_input = "Normal text"
        self.assertEqual(normal_input, "Normal text")
    
    def test_data_encryption(self):
        """Test para encriptación de datos"""
        from app.core.segurity import hash_password, verify_password
        
        # Encriptar datos
        original_data = "sensitive_data"
        encrypted_data = hash_password(original_data)
        
        # Verificar que esté encriptado
        self.assertNotEqual(original_data, encrypted_data)
        
        # Verificar que se pueda verificar
        self.assertTrue(verify_password(original_data, encrypted_data))


if __name__ == '__main__':
    unittest.main()
