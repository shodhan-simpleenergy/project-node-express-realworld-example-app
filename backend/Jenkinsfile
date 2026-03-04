pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REGISTRY = '300931013610.dkr.ecr.us-east-1.amazonaws.com'
        FRONTEND_REPO = 'project-devops-1/frontend'
        BACKEND_REPO = 'project-devops-1/backend'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login --username AWS --password-stdin $ECR_REGISTRY
                '''
            }
        }

        stage('Build & Push Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        docker build -t $ECR_REGISTRY/$FRONTEND_REPO:$IMAGE_TAG .
                        docker push $ECR_REGISTRY/$FRONTEND_REPO:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                dir('backend') {
                    sh '''
                        docker build -t $ECR_REGISTRY/$BACKEND_REPO:$IMAGE_TAG .
                        docker push $ECR_REGISTRY/$BACKEND_REPO:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
                    kubectl set image deployment/frontend \
                        frontend=$ECR_REGISTRY/$FRONTEND_REPO:$IMAGE_TAG
                    kubectl set image deployment/backend \
                        backend=$ECR_REGISTRY/$BACKEND_REPO:$IMAGE_TAG
                    kubectl rollout status deployment/frontend
                    kubectl rollout status deployment/backend
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}
