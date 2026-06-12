pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: "10"))
    }

    parameters {
        booleanParam(
            name: "RUN_SONAR",
            defaultValue: false,
            description: "Executer l analyse SonarQube (plus lent)"
        )
    }

    environment {
        DOCKER_IMAGE = "richef07/porfoliocherif"
        KUBECONFIG = "/var/jenkins_home/.kube/config"
    }

    stages {

        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("SonarQube Analysis") {
            when {
                expression { return params.RUN_SONAR }
            }
            steps {
                sh """
                    sonar-scanner \
                      -Dsonar.host.url=http://sonarqube:9000 \
                      -Dsonar.token=squ_0db2ae03762c1989a58eed3a2e587a0fbe48e64f \
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
                sh "kubectl rollout status deployment/portfolio-app -n portfolio --timeout=90s"
            }
        }
    }

    post {
        always {
            echo "Pipeline terminee - Build #${env.BUILD_NUMBER}"
        }

        success {
            echo "SUCCESS - App sur Kubernetes: http://localhost:30080"
            mail(
                to: "richef360@gmail.com",
                subject: "[SUCCESS] Portfolio Pipeline #${env.BUILD_NUMBER}",
                body: "Build #${env.BUILD_NUMBER} termine avec succes.\n\nApplication deployee sur Kubernetes: http://localhost:30080\n\nVoir les details: ${env.BUILD_URL}"
            )
        }

        failure {
            echo "FAILED - Verifier les logs ci-dessus"
            mail(
                to: "richef360@gmail.com",
                subject: "[FAILED] Portfolio Pipeline #${env.BUILD_NUMBER}",
                body: "Build #${env.BUILD_NUMBER} a echoue.\n\nVerifier les logs: ${env.BUILD_URL}console"
            )
        }
    }
}
