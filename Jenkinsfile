pipeline {
    agent any // Usamos tu propia PC como agente

    stages {
        // --- ETAPA 1: PYTHON ---
        stage('Test Python') {
            steps {
                echo '--- Instalando dependencias Python ---'
                // Usamos 'bat' porque estás en Windows
                bat 'pip install -r requirements.txt'
                
                echo '--- Ejecutando Tests Python ---'
                bat 'python run_tests_example.py' 
            }
        }

        // --- ETAPA 2: NODE JS & FRONTEND ---
        stage('Build & Test Node/Frontend') {
            steps {
                echo '--- Instalando dependencias Node ---'
                // 'call' asegura que npm termine antes de seguir
                bat 'npm install' 
                
                echo '--- Verificando archivos ---'
                // 'dir' es el comando de windows para listar archivos (ls es de linux)
                bat 'dir'
                
                // Si tuvieras tests de node:
                // bat 'npm test'
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
            echo '¡Todo salió VERDE! Buen trabajo.'
        }
    }
}
