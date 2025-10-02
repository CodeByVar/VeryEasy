#!/usr/bin/env python3
"""
Script de ejemplo para ejecutar tests del proyecto Vereasy
"""
import subprocess
import sys
import os

def run_command(command, description):
    """Ejecutar comando y mostrar resultado"""
    print(f"\n{'='*60}")
    print(f"Ejecutando: {description}")
    print(f"Comando: {command}")
    print('='*60)
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error ejecutando comando: {e}")
        print("STDOUT:", e.stdout)
        print("STDERR:", e.stderr)
        return False

def main():
    """Función principal"""
    print("🧪 Ejecutando Tests para Vereasy")
    print("="*60)
    
    # Verificar que estamos en el directorio correcto
    if not os.path.exists("tests"):
        print("❌ Error: No se encontró el directorio 'tests'")
        print("Asegúrate de ejecutar este script desde la raíz del proyecto")
        sys.exit(1)
    
    # Opciones de ejecución
    options = [
        {
            "command": "python tests/run_tests.py",
            "description": "Todos los tests con unittest"
        },
        {
            "command": "python tests/run_tests.py test_auth",
            "description": "Tests de autenticación con unittest"
        },
        {
            "command": "python tests/run_tests.py test_models",
            "description": "Tests de modelos con unittest"
        },
        {
            "command": "python tests/run_tests.py test_api_endpoints",
            "description": "Tests de endpoints con unittest"
        },
        {
            "command": "python tests/run_tests.py test_utils",
            "description": "Tests de utilidades con unittest"
        },
        {
            "command": "python -m unittest discover tests/ -v",
            "description": "Todos los tests con unittest discover"
        },
        {
            "command": "pytest tests/ -v",
            "description": "Todos los tests con pytest"
        },
        {
            "command": "pytest tests/test_auth.py -v",
            "description": "Tests de autenticación con pytest"
        },
        {
            "command": "pytest tests/test_models.py -v",
            "description": "Tests de modelos con pytest"
        },
        {
            "command": "pytest tests/test_api_endpoints.py -v",
            "description": "Tests de endpoints con pytest"
        },
        {
            "command": "pytest tests/test_utils.py -v",
            "description": "Tests de utilidades con pytest"
        },
        {
            "command": "pytest tests/test_examples_pytest.py -v",
            "description": "Tests de ejemplo con pytest"
        }
    ]
    
    # Mostrar opciones
    print("\nOpciones disponibles:")
    for i, option in enumerate(options, 1):
        print(f"{i:2d}. {option['description']}")
    
    # Solicitar selección
    try:
        choice = input(f"\nSelecciona una opción (1-{len(options)}) o 'q' para salir: ").strip()
        
        if choice.lower() == 'q':
            print("👋 ¡Hasta luego!")
            sys.exit(0)
        
        choice_idx = int(choice) - 1
        if 0 <= choice_idx < len(options):
            selected_option = options[choice_idx]
            success = run_command(selected_option["command"], selected_option["description"])
            
            if success:
                print(f"\n✅ {selected_option['description']} completado exitosamente")
            else:
                print(f"\n❌ {selected_option['description']} falló")
                sys.exit(1)
        else:
            print("❌ Opción inválida")
            sys.exit(1)
            
    except ValueError:
        print("❌ Por favor ingresa un número válido")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n👋 ¡Hasta luego!")
        sys.exit(0)

if __name__ == "__main__":
    main()

