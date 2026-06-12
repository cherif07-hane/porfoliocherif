pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: "10"))
    }

    environment {
        DOCKER_IMAGE = "richef07/porfoliocherif"
        SONAR_TOKEN = "squ_0db2ae03762c1989a58eed3a2e587a0fbe48e64f"
    }

    stages {

        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("SonarQube Analysis") {
            steps {
                sh """
                    sonar-scanner \
                      -Dsonar.host.url=http://sonarqube:9000 \
                      -Dsonar.token=${SONAR_TOKEN} \
                      -Dsonar.projectKey=portfolio-react-spa \
                      -Dsonar.projectName='Portfolio React SPA' \
                      -Dsonar.sources=src,controllers,routes,models,middleware,config,lib \
                      -Dsonar.exclusions=node_modules/**,dist/**,public/**,docs/**,scripts/**
                """
            }
        }

        stage("Build Docker Image") {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage("Verify Build") {
            steps {
                sh "docker run --rm ${DOCKER_IMAGE}:${BUILD_NUMBER} ls /app/dist/index.html"
            }
        }

        stage("Deploy") {
            steps {
                sh "docker compose -f docker-compose.prod.yml down || true"
                sh "docker compose -f docker-compose.prod.yml up -d"
            }
        }
    }

    post {
        always {
            echo "Pipeline terminee - Build #${BUILD_NUMBER}"
        }

        success {
            echo "SUCCESS - Application deployee sur http://localhost:8081"
        }

        failure {
            echo "FAILED - Verifier les logs ci-dessus"
        }
    }
}
