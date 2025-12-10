pipeline {
    agent any

    options {
        // Keep last 30 builds
        buildDiscarder(logRotator(numToKeepStr: '30'))
        // Add timestamps to console output
        timestamps()
    }

    triggers {
        // Run at 9 AM every day (9:00 UTC)
        cron('0 9 * * *')
    }

    environment {
        NODE_ENV = 'test'
        BASE_URL = 'https://waitly.eu/'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out code from GitHub..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing npm dependencies..."
                bat 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                echo "Installing Playwright browsers..."
                bat 'npx playwright install --with-deps'
            }
        }

        stage('Run Tests') {
            steps {
                echo "Running Playwright tests..."
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
            echo "Test execution completed. Publishing reports..."
            
            // Publish Playwright HTML report
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report',
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true
            ])

            // Publish JUnit test results (if available)
            junit testResults: 'test-results/**/*.xml',
                   allowEmptyResults: true,
                   skipPublishingChecks: true
        }

        success {
            echo "✅ All tests passed!"
            emailext(
                subject: "✅ Playwright Tests Passed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h2>Test Execution Successful</h2>
                    <p><strong>Job Name:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><strong>Status:</strong> ✅ PASSED</p>
                    <hr/>
                    <p><strong>Test Report:</strong> <a href="${env.BUILD_URL}Playwright_Test_Report/">View Playwright Report</a></p>
                    <p>All tests completed successfully. No action required.</p>
                """,
                to: 'sarmed.mujaddid@gmail.com',
                mimeType: 'text/html'
            )
        }

        failure {
            echo "❌ Tests failed!"
            emailext(
                subject: "❌ Playwright Tests Failed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h2>Test Execution Failed</h2>
                    <p><strong>Job Name:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><strong>Status:</strong> ❌ FAILED</p>
                    <hr/>
                    <h3>Failed Tests:</h3>
                    <p>Check the detailed report below:</p>
                    <p><strong>Test Report:</strong> <a href="${env.BUILD_URL}Playwright_Test_Report/">View Playwright Report</a></p>
                    <p><strong>Build Console:</strong> <a href="${env.BUILD_URL}console">View Console Output</a></p>
                    <hr/>
                    <p>Please investigate and fix the failing tests.</p>
                """,
                to: 'sarmed.mujaddid@gmail.com',
                mimeType: 'text/html'
            )
        }

        unstable {
            echo "⚠️ Build unstable (some tests may have been skipped or had warnings)"
        }
    }
}
