# Tests para Vereasy

Este directorio contiene todos los tests para el proyecto Vereasy, implementados usando `unittest` y `pytest`.

## Estructura de Tests

```
tests/
├── README.md                 # Este archivo
├── conftest.py              # Configuración de pytest
├── run_tests.py             # Script para ejecutar tests con unittest
├── test_config.py           # Configuración base para unittest
├── test_auth.py             # Tests de autenticación y seguridad
├── test_models.py           # Tests de modelos de datos
├── test_api_endpoints.py    # Tests de endpoints de la API
└── test_utils.py            # Tests de funciones utilitarias
```

## Tipos de Tests

### 1. Tests de Autenticación (`test_auth.py`)
- Funciones de seguridad (hash de contraseñas, verificación, tokens JWT)
- Endpoints de login y autenticación
- Validación de tokens y permisos
- Modelo de usuario

### 2. Tests de Modelos (`test_models.py`)
- Creación y validación de modelos
- Restricciones de unicidad
- Valores por defecto
- Relaciones entre modelos
- Validación de campos requeridos

### 3. Tests de Endpoints (`test_api_endpoints.py`)
- Endpoints de la API REST
- Operaciones CRUD (Create, Read, Update, Delete)
- Validación de datos de entrada
- Manejo de errores
- Autenticación en endpoints protegidos

### 4. Tests de Utilidades (`test_utils.py`)
- Funciones de validación
- Utilidades de fecha y hora
- Validación de emails y teléfonos
- Lógica de negocio
- Transformación de datos

## Ejecutar Tests

### Opción 1: Usando unittest (Recomendado)

```bash
# Ejecutar todos los tests
python tests/run_tests.py

# Ejecutar tests específicos
python tests/run_tests.py test_auth
python tests/run_tests.py test_models
python tests/run_tests.py test_api_endpoints
python tests/run_tests.py test_utils

# Ver ayuda
python tests/run_tests.py --help
```

### Opción 2: Usando pytest

```bash
# Instalar pytest si no está instalado
pip install pytest

# Ejecutar todos los tests
pytest tests/

# Ejecutar tests específicos
pytest tests/test_auth.py
pytest tests/test_models.py
pytest tests/test_api_endpoints.py
pytest tests/test_utils.py

# Ejecutar con más verbosidad
pytest tests/ -v

# Ejecutar con cobertura
pytest tests/ --cov=app
```

### Opción 3: Usando unittest directamente

```bash
# Ejecutar todos los tests
python -m unittest discover tests/

# Ejecutar un archivo específico
python -m unittest tests.test_auth

# Ejecutar una clase específica
python -m unittest tests.test_auth.TestSecurity

# Ejecutar un test específico
python -m unittest tests.test_auth.TestSecurity.test_hash_password
```

## Configuración

### Base de Datos de Prueba
Los tests utilizan una base de datos SQLite en memoria (`test.db`) que se crea y destruye automáticamente para cada test, asegurando aislamiento entre pruebas.

### Fixtures de pytest
El archivo `conftest.py` define fixtures que pueden ser utilizadas en los tests:
- `test_db`: Sesión de base de datos
- `client`: Cliente de prueba para FastAPI
- `test_user`: Usuario de prueba
- `test_nino`: Niño de prueba
- `test_encargado`: Encargado de prueba
- `test_permiso`: Permiso de prueba
- `auth_headers`: Headers de autenticación

## Escribir Nuevos Tests

### Estructura de un Test con unittest

```python
import unittest
from tests.test_config import BaseTestCase

class TestMiFuncionalidad(BaseTestCase):
    def setUp(self):
        """Configuración antes de cada test"""
        super().setUp()
        # Configuración específica del test
    
    def tearDown(self):
        """Limpieza después de cada test"""
        super().tearDown()
        # Limpieza específica del test
    
    def test_mi_funcion(self):
        """Test para mi función"""
        # Arrange
        input_data = "test data"
        
        # Act
        result = mi_funcion(input_data)
        
        # Assert
        self.assertEqual(result, "expected result")
        self.assertIsNotNone(result)
```

### Estructura de un Test con pytest

```python
import pytest

def test_mi_funcion(client, test_db):
    """Test para mi función"""
    # Arrange
    input_data = "test data"
    
    # Act
    response = client.post("/mi-endpoint", json=input_data)
    
    # Assert
    assert response.status_code == 200
    assert response.json()["result"] == "expected"
```

## Mejores Prácticas

### 1. Nomenclatura
- Nombres de archivos: `test_*.py`
- Nombres de clases: `TestMiFuncionalidad`
- Nombres de métodos: `test_mi_funcion`

### 2. Estructura AAA (Arrange, Act, Assert)
```python
def test_ejemplo(self):
    # Arrange - Preparar datos y configuración
    user_data = {"name": "Test", "email": "test@example.com"}
    
    # Act - Ejecutar la acción a probar
    response = self.client.post("/users", json=user_data)
    
    # Assert - Verificar el resultado
    self.assertEqual(response.status_code, 200)
    self.assertIn("id", response.json())
```

### 3. Tests Independientes
- Cada test debe ser independiente
- No depender del orden de ejecución
- Limpiar datos después de cada test

### 4. Datos de Prueba
- Usar datos realistas pero ficticios
- Evitar datos sensibles reales
- Usar factories o fixtures para datos complejos

### 5. Assertions Específicas
```python
# Bueno
self.assertEqual(result.status_code, 200)
self.assertIn("id", result.json())

# Evitar
self.assertTrue(result.status_code == 200)
```

## Debugging Tests

### Ejecutar un Test Específico
```bash
# Con unittest
python -m unittest tests.test_auth.TestSecurity.test_hash_password

# Con pytest
pytest tests/test_auth.py::TestSecurity::test_hash_password -v
```

### Ver Output Detallado
```bash
# Con unittest
python tests/run_tests.py

# Con pytest
pytest tests/ -v -s
```

### Debug con pdb
```python
import pdb; pdb.set_trace()
```

## Cobertura de Código

Para medir la cobertura de código:

```bash
# Instalar coverage
pip install coverage

# Ejecutar tests con cobertura
coverage run -m pytest tests/

# Ver reporte
coverage report

# Generar reporte HTML
coverage html
```

## Troubleshooting

### Problemas Comunes

1. **Error de importación**
   - Verificar que el path esté configurado correctamente
   - Asegurar que las dependencias estén instaladas

2. **Error de base de datos**
   - Verificar que la base de datos de prueba esté configurada
   - Limpiar archivos temporales si es necesario

3. **Tests que fallan intermitentemente**
   - Verificar que los tests sean independientes
   - Revisar el orden de ejecución

4. **Timeout en tests**
   - Verificar que no haya operaciones bloqueantes
   - Ajustar timeouts si es necesario

## Contribuir

Al agregar nuevos tests:
1. Seguir la estructura existente
2. Incluir tests para casos edge
3. Documentar tests complejos
4. Mantener la cobertura de código alta
5. Ejecutar todos los tests antes de hacer commit

