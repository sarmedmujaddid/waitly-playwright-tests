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
            mail(
                subject: "✅ Waitly Tests Passed - Build #${env.BUILD_NUMBER}",
                body: """
TEST EXECUTION SUCCESSFUL

Build Number: ${env.BUILD_NUMBER}
Status: ✅ PASSED
Build URL: ${env.BUILD_URL}

Test Report: ${env.BUILD_URL}Playwright_Test_Report/

All tests completed successfully. No action required.
                """,
                to: 'sarmed.mujaddid@gmail.com'
            )
        }

        failure {
            echo "❌ Tests failed!"
            mail(
                subject: "❌ Waitly Tests Failed - Build #${env.BUILD_NUMBER}",
                body: """
TEST EXECUTION FAILED

Build Number: ${env.BUILD_NUMBER}
Status: ❌ FAILED
Build URL: ${env.BUILD_URL}

Test Report: ${env.BUILD_URL}Playwright_Test_Report/
Console Output: ${env.BUILD_URL}console

Please investigate and fix the failing tests.
                """,
                to: 'sarmed.mujaddid@gmail.com'
            )
        }

        unstable {
            echo "⚠️ Build unstable (some tests may have been skipped or had warnings)"
        }
    }
}
