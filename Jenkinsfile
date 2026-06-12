pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: "10"))
    }

    parameters {
        booleanParam(
            name: "SKIP_SONAR",
            defaultValue: false,
            description: "Passer l analyse SonarQube"
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
                expression { return params.SKIP_SONAR != true }
            }
            steps {
                sh """
                    sonar-scanner \
                      -Dsonar.host.url=http://sonarqube:9000 \
                      -Dsonar.token=squ_98d2290b7a455978481018d5ec5cd8265407ba38 \
                      -Dsonar.projectKey=portfolio-react-spa \
                      -Dsonar.projectName='Portfolio React SPA' \
                      -Dsonar.sources=src,controllers,routes,models,middleware,config,lib \
                      -Dsonar.exclusions=node_modules/**,dist/**,public/**,docs/**,scripts/**,**/*.css \
                      -Dsonar.javascript.node.maxspace=512 \
                      -Dsonar.cpd.exclusions=**/* \
                      -Dsonar.scm.disabled=true
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
            script {
                try {
                    mail(
                        to: "richef360@gmail.com",
                        subject: "[SUCCESS] Portfolio Pipeline #${env.BUILD_NUMBER}",
                        body: "Build #${env.BUILD_NUMBER} termine avec succes.\n\nApplication deployee sur Kubernetes: http://localhost:30080\n\nVoir les details: ${env.BUILD_URL}"
                    )
                } catch (Exception e) {
                    echo "Email non envoye (SMTP non configure): ${e.message}"
                }
            }
        }

        failure {
            echo "FAILED - Verifier les logs ci-dessus"
            script {
                try {
                    mail(
                        to: "richef360@gmail.com",
                        subject: "[FAILED] Portfolio Pipeline #${env.BUILD_NUMBER}",
                        body: "Build #${env.BUILD_NUMBER} a echoue.\n\nVerifier les logs: ${env.BUILD_URL}console"
                    )
                } catch (Exception e) {
                    echo "Email non envoye (SMTP non configure): ${e.message}"
                }
            }
        }
    }
}
