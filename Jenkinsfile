pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: "10"))
    }

    environment {
        DOCKER_IMAGE = "richef07/porfoliocherif"
        SONAR_TOKEN = "squ_0db2ae03762c1989a58eed3a2e587a0fbe48e64f"
        KUBECONFIG = "/var/jenkins_home/.kube/config"
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

        stage("Load Image to Kubernetes") {
            steps {
                sh "kind load docker-image ${DOCKER_IMAGE}:latest --name portfolio"
            }
        }

        stage("Deploy to Kubernetes") {
            steps {
                sh "kubectl apply -f k8s/"
                sh "kubectl rollout restart deployment/portfolio-app -n portfolio"
                sh "kubectl rollout status deployment/portfolio-app -n portfolio --timeout=60s"
            }
        }
    }

    post {
        always {
            echo "Pipeline terminee - Build #${BUILD_NUMBER}"
        }

        success {
            echo "SUCCESS - App deployee sur Kubernetes: http://localhost:30080"
        }

        failure {
            echo "FAILED - Verifier les logs ci-dessus"
        }
    }
}
