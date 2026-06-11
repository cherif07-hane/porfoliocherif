def runCommand(String command) {
    if (isUnix()) {
        sh command
    } else {
        bat command
    }
}

def notifyByEmail(String result) {
    if (!params.EMAIL_RECIPIENTS?.trim()) {
        return
    }

    try {
        emailext(
            to: params.EMAIL_RECIPIENTS,
            subject: "[${result}] ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: """Job: ${env.JOB_NAME}
Build: #${env.BUILD_NUMBER}
Result: ${result}
URL: ${env.BUILD_URL}
"""
        )
    } catch (error) {
        echo "Email notification skipped: ${error.getMessage()}"
    }
}

pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: "10"))
    }

    parameters {
        booleanParam(
            name: "BUILD_DOCKER_IMAGE",
            defaultValue: false,
            description: "Build Docker image (optional)"
        )

        string(
            name: "EMAIL_RECIPIENTS",
            defaultValue: "",
            description: "Optional email notifications"
        )
    }

    environment {
        CI = "true"
        DOCKER_IMAGE = "fullstack-portfolio"
    }

    stages {

        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Install dependencies") {
            agent {
                docker {
                    image 'node:18'
                }
            }
            steps {
                script {
                    runCommand("node --version")
                    runCommand("npm --version")
                    runCommand("npm install")
                }
            }
        }

        stage("Quality checks") {
            agent {
                docker {
                    image 'node:18'
                }
            }
            steps {
                script {
                    runCommand("npm run test --if-present")
                }
            }
        }

        stage("Build frontend") {
            agent {
                docker {
                    image 'node:18'
                }
            }
            steps {
                script {
                    runCommand("npm run build")
                }
            }
        }

        stage("Smoke check") {
            agent {
                docker {
                    image 'node:18'
                }
            }
            steps {
                script {
                    runCommand("""
                        node -e "const fs=require('fs');
                        if (!fs.existsSync('build/index.html') && !fs.existsSync('dist/index.html')) {
                            console.error('Build failed: no output found');
                            process.exit(1);
                        }"
                    """)
                }
            }
        }

        stage("Docker image") {
            when {
                expression {
                    return params.BUILD_DOCKER_IMAGE
                }
            }
            steps {
                script {
                    runCommand(
                        "docker build -t ${env.DOCKER_IMAGE}:${env.BUILD_NUMBER} -t ${env.DOCKER_IMAGE}:latest ."
                    )
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: "build/**, dist/**", fingerprint: true, allowEmptyArchive: true
        }

        success {
            echo "Pipeline SUCCESS"
            script {
                notifyByEmail("SUCCESS")
            }
        }

        failure {
            echo "Pipeline FAILED"
            script {
                notifyByEmail("FAILURE")
            }
        }
    }
}