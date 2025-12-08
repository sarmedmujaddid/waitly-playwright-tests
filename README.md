# Waitly Playwright Tests

A scalable, maintainable Playwright test automation framework using CommonJS modules and the Page Object Model (POM) pattern.

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- npm installed

### Installation

```bash
# Clone the repository
git clone https://github.com/sarmedmujaddid/waitly-playwright-tests.git
cd waitly-playwright-tests

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps
```

### Run Tests Locally

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run a specific test file
npx playwright test tests/landing.spec.js

# Debug mode (step through)
npx playwright test --debug

# View test report
npx playwright show-report
```

## 📁 Project Structure

```
waitly-playwright-tests/
├── tests/                    # Test specifications
│   ├── landing.spec.js       # Example test file
│   └── utils/                # Test utilities (optional)
├── pages/                    # Page Object Model classes
│   └── base.page.js          # Base page class (all pages inherit)
├── config/                   # Configuration files (optional)
│   ├── environments.js       # Environment URLs
│   └── test-data.js          # Mock data & test credentials
├── utils/                    # Shared utilities (optional)
│   ├── logger.js             # Logging helper
│   └── test-helpers.js       # Reusable test functions
├── playwright.config.js      # Playwright configuration
├── Jenkinsfile              # Jenkins pipeline for scheduled runs
├── JENKINS_SETUP.md         # Jenkins setup and configuration guide
├── package.json             # Project dependencies
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🏗️ Architecture

### Page Object Model (POM)

All page interactions are encapsulated in **page objects** that inherit from `BasePage`. This keeps tests clean and maintainable.

**Example Page Object:**
```javascript
const BasePage = require('./base.page');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = LoginPage;
```

**Example Test:**
```javascript
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/login.page');

test('successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto('https://waitly.eu/login');
  await loginPage.login('user@example.com', 'password123');
  await expect(page).toHaveURL(/dashboard/);
});
```

## 📊 Test Configuration

Edit `playwright.config.js` to customize:
- **Base URL**: Set the default test environment URL
- **Browsers**: Enable/disable Chrome, Firefox, Safari
- **Mobile testing**: Add mobile device profiles
- **Parallel execution**: Control worker count
- **Retries**: Set retry behavior for CI/local runs

**Current Configuration:**
- Base URL: `https://waitly.eu/` (configurable via `BASE_URL` env var)
- Browser: Chromium (Firefox & Safari commented out)
- Screenshots: On failure
- Videos: On failure
- Trace: On first retry

## 🔧 Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` with your values:

```
BASE_URL=https://waitly.eu/
```

## 🤖 Jenkins Integration

To run tests automatically on a schedule (9 AM daily) using Jenkins:

1. **Follow the [JENKINS_SETUP.md](JENKINS_SETUP.md)** guide for:
   - Jenkins installation
   - Email configuration
   - Pipeline job setup
   - GitHub webhook configuration

2. **Key Jenkinsfile Features:**
   - ✅ Scheduled to run at 9 AM daily
   - ✅ Automatic browser installation
   - ✅ HTML test report generation
   - ✅ Email notifications (pass/fail)
   - ✅ Artifact archival (reports, screenshots, videos)

## 📧 Notifications

Test results are automatically sent via email:

**Success email includes:**
- Build status: ✅ PASSED
- Build number and link
- Link to Playwright HTML report

**Failure email includes:**
- Build status: ❌ FAILED
- Build number and link
- Links to report and console output

## 🧪 Writing Tests

### Best Practices

1. **Follow AAA Pattern**: Arrange, Act, Assert
2. **Use meaningful names**: Describe user scenarios, not implementation
3. **Keep tests independent**: No test should depend on another
4. **Avoid hardcoding**: Use config files for URLs and data
5. **Use Playwright waits**: Avoid `page.waitForTimeout()`

### Test Organization

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Arrange
    const somePage = new SomePage(page);
    
    // Act
    await somePage.performAction();
    
    // Assert
    await expect(page).toHaveURL(/expected-url/);
  });

  test('should handle error', async ({ page }) => {
    // Similar structure
  });
});
```

## 🐛 Debugging

### Run in Headed Mode
```bash
npx playwright test --headed
```

### Step Through Tests
```bash
npx playwright test --debug
```

### Pause at Specific Point
```javascript
// In your test
await page.pause();  // Execution pauses here
```

### Generate Tests Interactively
```bash
npx playwright codegen https://waitly.eu/
```

### View Test Reports
```bash
npx playwright show-report
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Jenkins Documentation](https://www.jenkins.io/doc/)

## 📝 Notes

- This project uses **CommonJS modules** (`require`/`module.exports`)
- All page objects inherit from `BasePage` for consistency
- Tests are independent and can run in any order
- Configure environment-specific URLs in `playwright.config.js` or `.env`

## 🤝 Contributing

1. Create a new branch for your feature
2. Add tests in `tests/` directory
3. Create corresponding page objects in `pages/`
4. Follow naming conventions (`.spec.js` for tests, `.page.js` for pages)
5. Run tests locally: `npm test`
6. Push to GitHub and create a PR

## 📄 License

ISC

## 👤 Author

Sarmad Mujaddid

---

**For Jenkins setup and scheduling help, see [JENKINS_SETUP.md](JENKINS_SETUP.md)**
