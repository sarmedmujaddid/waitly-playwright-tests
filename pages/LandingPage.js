// pages/LandingPage.js
class LandingPage {
  constructor(page) {
    this.page = page;
    
    // Define selectors
    this.heading = page.locator('h1');
    this.homeBtn = page.locator('button:has-text("Home")');
    this.practiceBtn = page.locator('button:has-text("Practice")');
    this.loginBtn = page.locator('button:has-text("Login")');
    this.signupBtn = page.locator('button:has-text("Signup")');
    this.logo = page.locator('[alt="Logo"]');
  }

  // Navigate to landing page
  async goto() {
    await this.page.goto('/');
  }

  // Assert landing page loaded
  async isDisplayed() {
    await this.heading.isVisible();
    await this.homeBtn.isVisible();
    //await this.loginBtn.isVisible();
  }

  // Get page title
  async getPageTitle() {
    return await this.page.title();
  }

  // Get URL
  async getCurrentUrl() {
    return this.page.url();
  }

  // Click navigation buttons
  async clickHome() {
    await this.homeBtn.click();
  }

  async clickPractice() {
    await this.practiceBtn.click();
  }

  async clickLogin() {
    await this.loginBtn.click();
  }

  async clickSignup() {
    await this.signupBtn.click();
  }

  // Verify all navigation elements are present
  async areAllNavElementsPresent() {
    const homeVisible = await this.homeBtn.isVisible();
    //const practiceVisible = await this.practiceBtn.isVisible();
    //const loginVisible = await this.loginBtn.isVisible();
    //const signupVisible = await this.signupBtn.isVisible();
    
    return homeVisible && practiceVisible && loginVisible && signupVisible;
  }
}

module.exports = LandingPage;
