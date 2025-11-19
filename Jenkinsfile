pipeline {
    agent any
    environment { PYTHONIOENCODING = 'utf-8' }

    stages {
        stage('Instalar Dependencias') {
            steps {
                bat 'pip install -r requirements.txt'
            }
        }

        // --- ETAPA 1: LO BÁSICO ---
        stage('Test Utilidades') {
            steps {
                echo 'Probando funciones básicas...'
                // -v muestra más detalles, -s muestra los prints
                bat 'python -m pytest tests/test_utils.py -v'
            }
        }

        // --- ETAPA 2: BASE DE DATOS ---
        stage('Test Modelos') {
            steps {
                echo 'Probando base de datos...'
                // Aquí es donde fallaban las fechas
                bat 'python -m pytest tests/test_models.py -v'
            }
        }

        // --- ETAPA 3: SEGURIDAD ---
        stage('Test Auth') {
            steps {
                echo 'Probando login y seguridad...'
                // Aquí es donde fallaba bcrypt
                bat 'python -m pytest tests/test_auth.py -v'
            }
        }

        // --- ETAPA 4: API COMPLETA ---
        stage('Test Endpoints') {
            steps {
                echo 'Probando rutas de la API...'
                bat 'python -m pytest tests/test_api_endpoints.py -v'
            }
        }
    }
    
    post {
        always { echo 'Ciclo de pruebas terminado.' }
        failure { echo '❌ Algo falló. Revisa qué etapa se puso roja.' }
        success { echo '✅ ¡Felicidades! Todo el sistema está perfecto.' }
    }
}
