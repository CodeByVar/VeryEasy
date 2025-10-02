"""
Script principal para ejecutar todos los tests con unittest
"""
import unittest
import sys
import os

#  directorio raíz al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

def run_all_tests():
    """Ejecutar todos los tests"""
    # ejecutar todos y descubrir
    loader = unittest.TestLoader()
    start_dir = os.path.dirname(__file__)
    suite = loader.discover(start_dir, pattern='test_*.py')
    
    # Ejecutar los tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Mostrar resumen
    print("\n" + "="*50)
    print("RESUMEN DE TESTS")
    print("="*50)
    print(f"Tests ejecutados: {result.testsRun}")
    print(f"Fallos: {len(result.failures)}")
    print(f"Errores: {len(result.errors)}")
    print(f"Exitosos: {result.testsRun - len(result.failures) - len(result.errors)}")
    
    if result.failures:
        print("\nFALLOS:")
        for test, traceback in result.failures:
            print(f"- {test}: {traceback}")
    
    if result.errors:
        print("\nERRORES:")
        for test, traceback in result.errors:
            print(f"- {test}: {traceback}")
    
    # Retornar código de salida
    return 0 if result.wasSuccessful() else 1

def run_specific_test(test_module):
    """Ejecutar un test específico"""
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromName(test_module)
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return 0 if result.wasSuccessful() else 1

def run_test_by_class(test_class):
    """Ejecutar tests de una clase específica"""
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(test_class)
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return 0 if result.wasSuccessful() else 1

if __name__ == '__main__':
    if len(sys.argv) > 1:
        if sys.argv[1] == '--help':
            print("Uso:")
            print("  python run_tests.py                    # Ejecutar todos los tests")
            print("  python run_tests.py test_auth          # Ejecutar tests de autenticación")
            print("  python run_tests.py test_models        # Ejecutar tests de modelos")
            print("  python run_tests.py test_api_endpoints # Ejecutar tests de endpoints")
            print("  python run_tests.py test_utils         # Ejecutar tests de utilidades")
            sys.exit(0)
        elif sys.argv[1].startswith('test_'):
            exit_code = run_specific_test(sys.argv[1])
            sys.exit(exit_code)
        else:
            print("Módulo de test no encontrado. Use --help para ver opciones disponibles.")
            sys.exit(1)
    else:
        exit_code = run_all_tests()
        sys.exit(exit_code)

