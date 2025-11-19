pipeline {
    agent any // Ejecutar en cualquier nodo disponible

    stages {
        // Etapa 1: Construcción
        stage('Build') {
            steps {
                echo 'Construyendo el proyecto...'
                // Aquí va tu comando real. Ej: 'npm install', 'mvn clean install', etc.
                sh './build_script.sh' 
            }
        }

        // Etapa 2: Pruebas
        stage('Test') {
            steps {
                echo 'Ejecutando pruebas...'
                // Aquí va tu comando de test. Ej: 'npm test', 'pytest'
                sh './test_script.sh' 
            }
        }

        // Etapa 3: Despliegue (Opcional por ahora)
        stage('Deploy') {
            steps {
                echo 'Desplegando...'
                // Comandos para subir a producción
            }
        }
    }
}
