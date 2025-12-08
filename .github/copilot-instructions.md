# Copilot Instructions for Playwright Test Project

## Project Overview
This is a scalable Playwright test automation framework using CommonJS modules. The framework emphasizes maintainability through Page Object Model (POM), reusable utilities, and clear separation of concerns.

**Tech Stack:**
- `@playwright/test` (v1.56.x+) - Test runner
- CommonJS modules (`"type": "commonjs"` in package.json)
- Node.js with npm
- Jenkins for scheduled test automation (9 AM daily)

---

## Core Conventions (MUST FOLLOW EXACTLY)

### 1. Module System
- **Always use CommonJS**: `const { test, expect } = require('@playwright/test')`
- **Page objects must export**: `module.exports = ClassName`
- **Never use ES6 imports/exports** unless package.json is updated to `"type": "module"`
- Require page objects with relative paths: `const BasePage = require('../pages/base.page')`

### 2. File Structure & Naming
```
project-root/
├── tests/
│   ├── smoke/                    # Smoke test suite
│   ├── functional/               # Functional test suite
│   └── utils/
│       └── test-helpers.js       # Reusable test utilities
├── pages/
│   ├── base.page.js              # Base page class (all pages inherit)
│   ├── login.page.js             # Login page object
│   └── dashboard.page.js         # Dashboard page object
├── config/
│   ├── environments.js           # URL configs (dev, staging, prod)
│   └── test-data.js              # Mock data & credentials
├── utils/
│   ├── logger.js                 # Logging helper
│   └── test-helpers.js           # Reusable test utilities
├── playwright.config.js
├── Jenkinsfile
├── package.json
├── .env.example
└── README.md
```

**Naming Conventions:**
- Test files: `*.spec.js` (e.g., `login.spec.js`)
- Page objects: `*.page.js` (e.g., `login.page.js`)
- Utilities: descriptive names (e.g., `logger.js`, `test-helpers.js`)

### 3. Page Object Model (POM) Best Practices

#### Base Page Class (pages/base.page.js)
```javascript
class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async isElementVisible(locator) {
    return await locator.isVisible();
  }

  async fillInput(locator, text) {
    await locator.fill(text);
  }

  async clickElement(locator) {
    await locator.click();
  }
}

module.exports = BasePage;
```

#### Page Object Requirements
- **Encapsulation**: All locators declared in constructor
- **No Test Logic**: Page objects contain NO assertions
- **Clear Naming**: Method names describe user actions (e.g., `loginWithCredentials`)

---

## Test File Structure & Standards

### Test File Template
```javascript
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/login.page');

test.describe('Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto('/login');
  });

  test('successful login', async ({ page }) => {
    await loginPage.loginWithCredentials('user@test.com', 'pass123');
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

### Test Organization Rules
1. Use `test.describe()` for grouping related tests
2. Use meaningful test names describing the scenario
3. Follow AAA Pattern: Arrange, Act, Assert
4. Use beforeEach/afterEach for setup/teardown
5. Keep tests independent
6. Avoid hardcoded values (use config files)

---

## Selectors & Locator Strategy

### Locator Priorities (Best to Worst)
1. **Role-based**: `page.locator('button[name="Login"]')`
2. **Test IDs**: `page.locator('[data-testid="login-btn"]')`
3. **Semantic HTML**: `page.locator('button:has-text("Login")')`
4. **CSS selectors**: `page.locator('.btn-login')`
5. **XPath** (avoid unless necessary)

---

## Playwright Configuration

### playwright.config.js
- **testDir**: `./tests`
- **fullyParallel**: `true` (parallel locally, serial on CI)
- **retries**: 0 locally, 2 on CI
- **baseURL**: `https://waitly.eu/` (configurable via `BASE_URL` env var)
- **reporter**: HTML report
- **screenshot**: On failure
- **video**: On failure

---

## Jenkins Integration & Scheduling

### Jenkinsfile Details
- **Schedule**: Runs at 9 AM UTC every day (`0 9 * * *`)
- **Environment**: `BASE_URL=https://waitly.eu/`
- **Stages**: Checkout → Install → Install Browsers → Run Tests
- **Reports**: HTML report published after each run
- **Email Notifications**: Sent on success/failure to `${DEFAULT_RECIPIENTS}`

### Running Tests
```bash
# Local
npm test

# Jenkins runs automatically at 9 AM daily
# Email notifications sent with test results
```

### Setup Instructions
See [JENKINS_SETUP.md](JENKINS_SETUP.md) for:
- Jenkins installation
- Email configuration
- Pipeline job setup
- GitHub webhook configuration

---

## Testing Strategies

### What to Test
1. **Smoke Tests** (`tests/smoke/`): Critical paths, page loads
2. **Functional Tests** (`tests/functional/`): Feature-specific flows
3. **E2E Tests** (`tests/e2e/`): Complete user journeys

### Anti-Patterns to Avoid
- ❌ Hardcoding URLs, credentials, test data
- ❌ Assertions inside page objects
- ❌ Long sleep/delays (`await page.waitForTimeout()`)
- ❌ Shared state between tests
- ❌ Multiple assertions in single test

### Best Practices
- ✅ Use `page.waitForURL()` instead of sleeps
- ✅ Use `locator.waitFor()` for element visibility
- ✅ Extract test data to `config/test-data.js`
- ✅ Use parameterized tests for multiple scenarios

---

## Debugging & Commands

### Commands
```bash
# Install and setup
npm install
npx playwright install --with-deps

# Run tests
npm test                              # Run all tests
npx playwright test --headed          # See browser
npx playwright test --debug           # Step through
npx playwright test tests/login.spec.js  # Specific file
npx playwright show-report            # View HTML report
npx playwright codegen https://waitly.eu/  # Record tests
```

### Debugging Tips
1. Use `--debug` flag to step through
2. Use `page.pause()` to pause execution
3. Use `--headed` to see browser
4. Check `test-results/` for artifacts
5. View HTML report: `npx playwright show-report`

---

## Code Quality & Maintenance

### When Adding New Tests
1. Create page object in `pages/` if testing new page
2. Inherit from `BasePage`
3. Add test file in `tests/`
4. Use meaningful names and AAA pattern
5. Extract test data to `config/test-data.js`
6. Run locally: `npm test`

### When Modifying Tests
1. Update both page object AND tests if selectors change
2. Ensure tests remain independent
3. Don't add logic to page objects (only in tests)
4. Run affected test suite: `npx playwright test tests/path`

---

## CI/CD Integration

### Jenkins (Current)
- Tests run at 9 AM daily via Jenkinsfile
- Email notifications on pass/fail
- HTML reports published to Jenkins
- Screenshots/videos on failure
- See [JENKINS_SETUP.md](JENKINS_SETUP.md) for setup

### Environment Variables
```
BASE_URL=https://waitly.eu/  # Configurable in Jenkins
```

---

## Summary: What the AI Should Do

✅ **Always:**
- Use CommonJS (`require`, `module.exports`)
- Place tests in `tests/` with `.spec.js` extension
- Place page objects in `pages/` with `.page.js` extension
- Inherit page objects from `BasePage`
- Keep assertions in tests only
- Use config files for data/URLs
- Follow AAA pattern
- Use Playwright waits instead of sleeps

❌ **Never:**
- Switch to ESM without updating `package.json`
- Put assertions in page objects
- Hardcode URLs or credentials
- Create interdependent tests
- Use long `waitForTimeout()` delays

✨ **When Uncertain:**
- Check [.github/copilot-instructions.md](.github/copilot-instructions.md)
- Refer to existing test patterns
- Test locally before suggesting changes
- Document non-obvious patterns in comments
