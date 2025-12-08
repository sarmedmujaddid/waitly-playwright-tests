# Jenkins Setup Guide for Playwright Tests

This guide walks you through installing Jenkins, configuring it for this project, and setting up scheduled test runs.

## Table of Contents
1. [Jenkins Installation](#jenkins-installation)
2. [Initial Jenkins Setup](#initial-jenkins-setup)
3. [Create a New Pipeline Job](#create-a-new-pipeline-job)
4. [Configure Email Notifications](#configure-email-notifications)
5. [Verify the Setup](#verify-the-setup)
6. [Troubleshooting](#troubleshooting)

---

## Jenkins Installation

### Option 1: Install Jenkins on Windows (Recommended for Local Testing)

#### Prerequisites
- Java 11 or higher installed on your machine
- Git installed
- Node.js 14+ installed

#### Steps

1. **Download Jenkins**
   - Go to https://www.jenkins.io/download/
   - Download the Windows installer (`.msi` file)

2. **Run the Installer**
   - Double-click the `.msi` file
   - Follow the installation wizard
   - Keep default settings (port 8080, service setup)
   - Complete the installation

3. **Start Jenkins**
   - Jenkins typically starts automatically after installation
   - Access it at: http://localhost:8080

4. **Unlock Jenkins**
   - Jenkins will ask for an initial admin password
   - Find it in: `C:\\Program Files\\Jenkins\\secrets\\initialAdminPassword`
   - Copy and paste it into Jenkins UI

5. **Install Suggested Plugins**
   - Click "Install suggested plugins"
   - Wait for plugins to install

6. **Create Admin User**
   - Create your Jenkins admin account
   - Click "Save and Continue"

---

### Option 2: Install Jenkins via Docker (Advanced)

If you prefer Docker:

```bash
docker run -d -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts-jdk11
```

Then unlock and set up as above.

---

## Initial Jenkins Setup

### 1. Install Required Plugins

1. Go to **Manage Jenkins** > **Manage Plugins**
2. Search for and install these plugins:
   - **Pipeline** (if not already installed)
   - **GitHub Integration** (for webhook triggers)
   - **HTML Publisher** (for Playwright reports)
   - **Email Extension** (for email notifications)
   - **Log Parser** (optional, for better log parsing)

3. Click "Install without restart" and wait for completion

### 2. Configure Email Notifications

1. Go to **Manage Jenkins** > **Configure System**
2. Scroll to **Extended E-mail Notification**
3. Fill in:
   - **SMTP server**: `smtp.gmail.com` (or your email provider's SMTP)
   - **SMTP port**: `587`
   - **Default Subject**: `$DEFAULT_SUBJECT`
   - **Default Content**: `$DEFAULT_CONTENT`
   - **Use SSL**: ✓ Checked
   - **SMTP Authentication**:
     - Username: `your-email@gmail.com`
     - Password: Generate an App Password (see below)
     - **Default Recipients**: Your email address (e.g., `your-email@gmail.com`)

4. **Generate Gmail App Password** (if using Gmail):
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Use the generated 16-character password in Jenkins SMTP Password field

5. Click **Test configuration** to verify email works

6. Click **Save**

---

## Create a New Pipeline Job

### Steps

1. Go to Jenkins Home > **New Item**
2. Enter a job name: `waitly-playwright-tests`
3. Select **Pipeline** and click **OK**

### Configure the Pipeline Job

1. **General Tab** (optional):
   - Check "GitHub project"
   - Enter your GitHub repo URL: `https://github.com/YOUR_USERNAME/waitly-playwright-tests`

2. **Build Triggers Tab**:
   - Check **Poll SCM**
   - Schedule: `H 9 * * *` (runs at 9 AM daily)
   - This ensures Jenkins checks GitHub even if webhooks fail

3. **Pipeline Tab**:
   - **Definition**: Select "Pipeline script from SCM"
   - **SCM**: Select "Git"
   - **Repository URL**: Paste your GitHub repo URL
     - Example: `https://github.com/YOUR_USERNAME/waitly-playwright-tests.git`
   - **Credentials**: (if repo is private, add GitHub credentials)
   - **Branch Specifier**: `*/main` (or `*/master` if your default branch is master)
   - **Script Path**: `Jenkinsfile` (Jenkins will use the Jenkinsfile in repo root)

4. Click **Save**

---

## Configure GitHub Webhook (Optional but Recommended)

This allows Jenkins to trigger tests immediately when you push code (not just on schedule).

### In Jenkins

1. Go to your job > **Configure**
2. **Build Triggers** tab
3. Check **GitHub hook trigger for GITScm polling**
4. Click **Save**

### In GitHub

1. Go to your repo > **Settings** > **Webhooks**
2. Click **Add webhook**
3. **Payload URL**: `http://YOUR_JENKINS_URL:8080/github-webhook/`
   - If Jenkins is local: `http://localhost:8080/github-webhook/`
   - If on network: Use your machine's IP or domain
4. **Content type**: `application/json`
5. **Events**: Select "Just the push event"
6. Click **Add webhook**

*Note: Webhooks only work if Jenkins is publicly accessible. For local testing, use polling instead.*

---

## Verify the Setup

### Manual Test Run

1. Go to your Jenkins job
2. Click **Build Now**
3. Wait for the build to complete
4. Check:
   - ✅ Console output shows tests running
   - ✅ Playwright report is generated
   - ✅ Email notification received

### Check Scheduled Run

1. Wait for 9 AM (or manually trigger to test)
2. Verify:
   - ✅ Job runs automatically at 9 AM
   - ✅ Email is sent with results
   - ✅ Report is accessible from Jenkins UI

---

## Update BASE_URL Environment Variable

The Jenkinsfile currently uses:
```groovy
BASE_URL = 'https://waitly.eu/'
```

If your test environment URL is different:

1. Go to your Jenkins job > **Configure**
2. **Pipeline** tab
3. Edit the Jenkinsfile inline or in your Git repo
4. Change:
   ```groovy
   BASE_URL = 'http://your-test-environment-url'
   ```
5. Click **Save**

Or, create Jenkins credentials and inject them:

1. Go to **Manage Jenkins** > **Manage Credentials**
2. Create a new "Secret text" credential for BASE_URL
3. In Jenkinsfile, use:
   ```groovy
   environment {
       BASE_URL = credentials('base-url-secret')
   }
   ```

---

## Test Results & Reports

### Accessing Reports

After each build:

1. **Playwright Test Report**:
   - Click on build > **Playwright Test Report**
   - View detailed test results, screenshots, videos

2. **Console Output**:
   - Click on build > **Console Output**
   - See full command output and logs

3. **Email Notifications**:
   - Check your inbox for pass/fail summary
   - Links to report and console output included

---

## Troubleshooting

### Issue: Tests fail to run in Jenkins but pass locally

**Common Causes:**
- **Node.js not in Jenkins PATH**: Add Node.js path to Jenkins system PATH
  - Go to **Manage Jenkins** > **Configure System** > **Global properties**
  - Set `PATH` to include Node.js bin directory
- **Playwright browsers not installed**: The Jenkinsfile already includes `npx playwright install --with-deps`
- **BASE_URL incorrect**: Verify the URL in Jenkinsfile matches your test environment

### Issue: Email notifications not received

**Checks:**
1. Verify email configuration in **Manage Jenkins** > **Configure System**
2. Run "Test configuration" to validate SMTP settings
3. Check Jenkins logs: **Manage Jenkins** > **System Log**
4. Verify recipient email in Jenkinsfile (currently `${DEFAULT_RECIPIENTS}`)

### Issue: GitHub webhook not triggering builds

**Checks:**
1. Ensure Jenkins is publicly accessible (local doesn't work for webhooks)
2. Check webhook delivery in GitHub repo > **Settings** > **Webhooks**
3. View delivery logs for error details
4. Fallback to **Poll SCM** if webhooks aren't working

### Issue: Build stuck or hanging

**Steps:**
1. Check if browsers are being installed properly
2. Verify Playwright version compatibility: `npm list @playwright/test`
3. Manually run `npx playwright test` on the Jenkins machine
4. Check system resources (disk space, memory)

---

## Next Steps

1. **Create GitHub repository** (see instructions below)
2. **Push code to GitHub**
3. **Complete Jenkins setup** following this guide
4. **Test manual build** from Jenkins UI
5. **Verify scheduled run** at 9 AM
6. **Check email notifications**

---

## Additional Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Jenkinsfile Syntax](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/)
- [Playwright Documentation](https://playwright.dev/)
- [Email Extension Plugin](https://plugins.jenkins.io/email-ext/)
