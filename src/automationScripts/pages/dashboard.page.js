const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit-kpi"]');
    this.availableCreditKPI = page.locator('[data-testid="available-credit-kpi"]');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount-kpi"]');
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend-kpi"]');
    this.informationalMessage = page.locator('[data-testid="informational-message"]');
    this.errorNotification = page.locator('[data-testid="error-notification"]');
    
    this.kpiContainer = page.locator('[data-testid="kpi-container"]');
    this.lastUpdateTimestamp = page.locator('[data-testid="last-update-timestamp"]');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async navigateToDashboard() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async setUserWithThreeCards() {
    await this.page.route('**/api/cards*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { cardId: 'card-1', creditLimit: 10000, currentBalance: 3500, availableCredit: 6500 },
          { cardId: 'card-2', creditLimit: 15000, currentBalance: 5200, availableCredit: 9800 },
          { cardId: 'card-3', creditLimit: 20000, currentBalance: 8100, availableCredit: 11900 }
        ])
      });
    });
    
    await this.page.route('**/api/transactions/summary*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ monthlySpend: 2500 })
      });
    });
  }

  async setUserWithSingleCard() {
    await this.page.route('**/api/cards*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { cardId: 'card-1', creditLimit: 10000, currentBalance: 3500, availableCredit: 6500 }
        ])
      });
    });
  }

  async setUserWithNoCards() {
    await this.page.route('**/api/cards*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
  }

  async verifyKPIAggregationForCards(cardIds) {
    const totalCreditLimit = await this.totalCreditLimitKPI.textContent();
    const availableCredit = await this.availableCreditKPI.textContent();
    const outstandingAmount = await this.outstandingAmountKPI.textContent();
    
    const expectedTotalLimit = 45000;
    const expectedAvailable = 28200;
    const expectedOutstanding = 16800;
    
    return (
      totalCreditLimit.includes('45,000') &&
      availableCredit.includes('28,200') &&
      outstandingAmount.includes('16,800')
    );
  }

  async verifyKPIsMatchSingleCard(cardId) {
    const totalCreditLimit = await this.totalCreditLimitKPI.textContent();
    const availableCredit = await this.availableCreditKPI.textContent();
    const outstandingAmount = await this.outstandingAmountKPI.textContent();
    
    return (
      totalCreditLimit.includes('10,000') &&
      availableCredit.includes('6,500') &&
      outstandingAmount.includes('3,500')
    );
  }

  async simulateNewTransaction(amount, cardId) {
    await this.page.evaluate(({ amount, cardId }) => {
      window.dispatchEvent(new CustomEvent('new-transaction', {
        detail: { amount, cardId }
      }));
    }, { amount, cardId });
  }

  async waitForKPIUpdate() {
    await this.page.waitForFunction(
      () => {
        const updateIndicator = document.querySelector('[data-testid="kpi-update-indicator"]');
        return updateIndicator && updateIndicator.getAttribute('data-updated') === 'true';
      },
      { timeout: 3000 }
    );
  }

  async waitForAutoRefresh(duration) {
    await this.page.waitForTimeout(duration);
  }

  async verifyAutoRefreshTriggered() {
    const refreshIndicator = this.page.locator('[data-testid="auto-refresh-indicator"]');
    const triggered = await refreshIndicator.getAttribute('data-triggered');
    return triggered === 'true';
  }

  async verifyKPIsRefreshed() {
    const timestamp = await this.lastUpdateTimestamp.textContent();
    return timestamp && timestamp.length > 0;
  }

  async getLastUpdateDuration() {
    const durationElement = this.page.locator('[data-testid="update-duration"]');
    const duration = await durationElement.getAttribute('data-duration');
    return parseInt(duration);
  }

  async simulateBackendServiceUnavailable() {
    await this.page.route('**/api/transactions/**', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });
  }

  async verifyAutoRefreshFailed() {
    const errorState = this.page.locator('[data-testid="refresh-error-state"]');
    return await errorState.isVisible();
  }

  async verifyDashboardStable() {
    await expect(this.kpiContainer).toBeVisible();
    
    const hasErrors = await this.page.locator('[data-testid="critical-error"]').count();
    return hasErrors === 0;
  }
};
