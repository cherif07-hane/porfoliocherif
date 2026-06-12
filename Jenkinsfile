pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: "10"))
    }

    environment {
        DOCKER_IMAGE = "richef07/porfoliocherif"
    }

    stages {

        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Build Docker Image") {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage("Verify Build") {
            steps {
                sh """
                    docker run --rm ${DOCKER_IMAGE}:${BUILD_NUMBER} ls /app/dist/index.html
                """
            }
        }

        stage("Deploy") {
            steps {
                sh "docker compose down || true"
                sh "docker compose up -d"
            }
        }
    }

    post {
        always {
            echo "Pipeline terminee - Build #${BUILD_NUMBER}"
        }

        success {
            echo "SUCCESS - Application deployee sur http://localhost:5173"
        }

        failure {
            echo "FAILED - Verifier les logs ci-dessus"
        }
    }
}
