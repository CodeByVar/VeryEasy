pipeline {
    agent any

    environment {
        PYTHONIOENCODING = 'utf-8'
    }

    stages {
        // --- ETAPA 1: PYTHON ---
        stage('Test Python') {
            steps {
                echo '--- Instalando dependencias Python ---'
                bat 'pip install -r requirements.txt'
                
                echo '--- Ejecutando Tests DIRECTAMENTE (Sin menú) ---'
                // CAMBIO AQUÍ: En vez de llamar al menú, llamamos a pytest directo
                // Esto buscará automáticamente todos los tests en tu carpeta
                bat 'python -m pytest' 
            }
        }

        // --- ETAPA 2: NODE JS & FRONTEND ---
        stage('Build & Test Node/Frontend') {
            steps {
                echo '--- Instalando dependencias Node ---'
                bat 'npm install' 
                
                echo '--- Verificando archivos ---'
                bat 'dir'
            }
        }
    }
    
    post {
        always {
            echo 'Proceso finalizado.'
        }
        failure {
            echo 'Algo falló. Revisa los logs.'
        }
        success {
            echo '¡ÉXITO TOTAL! Todo salió VERDE.'
        }
    }
}
