pipeline {
    agent none

    stages {
        // --- ETAPA 1: PYTHON (Backend & Scripts) ---
        stage('Test Python') {
            agent {
                docker { image 'python:3.9' }
            }
            steps {
                // No usamos dir() porque requirements.txt está en la raíz
                echo '--- Instalando dependencias Python ---'
                sh 'pip install -r requirements.txt'
                
                echo '--- Ejecutando Tests Python ---'
                // Veo que tienes un archivo específico para correr tests
                sh 'python run_tests_example.py' 
            }
        }

        // --- ETAPA 2: NODE JS & FRONTEND ---
        stage('Build & Test Node/Frontend') {
            agent {
                docker { image 'node:18' } 
            }
            steps {
                echo '--- Instalando dependencias Node ---'
                // Usa el package.json que está en tu raíz
                sh 'npm install' 
                
                echo '--- Verificando estructura ---'
                // Listamos para asegurar que Jenkins ve los archivos
                sh 'ls -la'
                
                // Si tienes un script de test en tu package.json:
                // sh 'npm test'
                
                // Si tu frontend se construye desde aquí (ej. React):
                // sh 'npm run build'
            }
        }
    }
    
    post {
        always {
            echo 'Proceso finalizado.'
        }
        failure {
            echo 'Hubo un error. Revisa qué archivo falló.'
        }
    }
}
