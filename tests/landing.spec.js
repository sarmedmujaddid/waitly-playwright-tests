// tests/landing.spec.js
const { test, expect } = require('@playwright/test');
const LandingPage = require('../pages/LandingPage');

test.describe('Landing Page Tests', () => {
  let landingPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page object before each test
    landingPage = new LandingPage(page);
    await landingPage.goto();
  });

  test('should load landing page successfully', async ({ page }) => {
    // Assert page loaded
    await landingPage.isDisplayed();
    expect(page).toBeTruthy();
  });

  test('should have correct page title', async ({ page }) => {
    const title = await landingPage.getPageTitle();
    expect(title).toBeTruthy();
    // Update with your actual expected title
    console.log('Page title:', title);
  });

  test('should have correct URL on load', async () => {
    const currentUrl = await landingPage.getCurrentUrl();
    expect(currentUrl).toContain('waitly.eu');
  });

  test('should have visible heading', async () => {
    const headingVisible = await landingPage.heading.isVisible();
    expect(headingVisible).toBe(true);
  });
});