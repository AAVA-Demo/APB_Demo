const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.navigationMenu = page.locator('nav.navbar');
    this.dashboardLink = page.locator('a[href="#!/dashboard"]');
    this.kpiSection = page.locator('.kpi-row');
    this.cardListSection = page.locator('.card-list');
    this.cardItems = page.locator('.card-item');
    this.emptyStateMessage = page.locator('.card-list').getByText(/No credit cards available/i);
    this.kpiCards = page.locator('.kpi-card');
    this.cardType = page.locator('.card-header h4');
    this.issuerName = page.locator('.card-header h4');
    this.creditLimit = page.locator('.card-body .col-xs-6:has-text("Credit Limit")');
    this.currentBalance = page.locator('.card-body .col-xs-6:has-text("Current Balance")');
    this.availableCredit = page.locator('.card-body .col-xs-6:has-text("Available Credit")');
    this.outstandingAmount = page.locator('.card-body .col-xs-6:has-text("Outstanding")');
    this.monthlySpend = page.locator('.card-body .col-xs-12:has-text("Monthly Spend")');
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async navigate() {
    await this.page.goto('https://app.example.com/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToPortfolioDashboard() {
    await this.dashboardLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.kpiSection).toBeVisible();
  }

  async getCardCount() {
    await this.cardItems.first().waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
    return await this.cardItems.count();
  }

  async getAllCardTypes() {
    const types = [];
    const count = await this.cardType.count();
    for (let i = 0; i < count; i++) {
      const text = await this.cardType.nth(i).textContent();
      types.push(text.trim());
    }
    return types;
  }

  async getAllIssuers() {
    const issuers = [];
    const count = await this.issuerName.count();
    for (let i = 0; i < count; i++) {
      const text = await this.issuerName.nth(i).textContent();
      const issuer = text.split(' ')[0];
      issuers.push(issuer.trim());
    }
    return issuers;
  }

  async getAllCreditLimits() {
    const limits = [];
    const count = await this.creditLimit.count();
    for (let i = 0; i < count; i++) {
      const text = await this.creditLimit.nth(i).textContent();
      const match = text.match(/\$[\d,]+\.\d{2}/);
      if (match) limits.push(match[0]);
    }
    return limits;
  }

  async getAllCurrentBalances() {
    const balances = [];
    const count = await this.currentBalance.count();
    for (let i = 0; i < count; i++) {
      const text = await this.currentBalance.nth(i).textContent();
      const match = text.match(/\$[\d,]+\.\d{2}/);
      if (match) balances.push(match[0]);
    }
    return balances;
  }

  async loginWithNoCards(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async loginWithMaxCards(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async loginWithMultipleCards(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async loginWithZeroBalance(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForAllCardsToLoad(expectedCount) {
    await this.page.waitForFunction(
      (count) => document.querySelectorAll('.card-item').length >= count,
      expectedCount,
      { timeout: 5000 }
    );
  }

  async verifyAllCardsHaveCompleteDetails() {
    const count = await this.cardItems.count();
    for (let i = 0; i < count; i++) {
      const card = this.cardItems.nth(i);
      const hasType = await card.locator('.card-header h4').count() > 0;
      const hasLimit = await card.locator('.card-body').getByText('Credit Limit').count() > 0;
      const hasBalance = await card.locator('.card-body').getByText('Current Balance').count() > 0;
      if (!hasType || !hasLimit || !hasBalance) return false;
    }
    return true;
  }

  async getKPIValue(kpiName) {
    const kpiCard = this.page.locator('.kpi-card').filter({ hasText: kpiName });
    await expect(kpiCard).toBeVisible();
    const valueElement = kpiCard.locator('.kpi-value');
    return await valueElement.textContent();
  }

  async waitForAllKPIsToLoad() {
    await this.page.waitForFunction(
      () => {
        const kpiCards = document.querySelectorAll('.kpi-card .kpi-value');
        return kpiCards.length === 4 && Array.from(kpiCards).every(card => card.textContent.trim() !== '');
      },
      { timeout: 5000 }
    );
  }
};