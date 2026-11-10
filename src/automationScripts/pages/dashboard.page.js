const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.creditUtilizationKPI = page.locator('[data-testid="kpi-credit-utilization"]');
    
    // Layout Locators
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"]');
    this.kpiCardContainer = page.locator('[data-testid="kpi-card-container"]');
    this.chartContainer = page.locator('[data-testid="chart-container"]');
    
    // Navigation Locators
    this.manageCardsLink = page.locator('[data-testid="manage-cards-link"]');
    this.viewAnalyticsLink = page.locator('[data-testid="view-analytics-link"]');
    
    // Error Message Locators
    this.errorMessage = page.locator('[data-testid="error-message"]');
    
    // Loading Indicator
    this.loadingIndicator = page.locator('[data-testid="loading-indicator"]');
  }

  async navigate() {
    await this.page.goto('/dashboard');
  }

  async authenticate(userId, authToken) {
    await this.page.evaluate(({ userId, authToken }) => {
      window.sessionStorage.setItem('userId', userId);
      window.sessionStorage.setItem('authToken', authToken);
    }, { userId, authToken });
    await this.page.reload();
  }

  async waitForDashboardLoad() {
    await expect(this.loadingIndicator).not.toBeVisible({ timeout: 5000 });
    await expect(this.dashboardContainer).toBeVisible();
    await expect(this.monthlySpendKPI).toBeVisible();
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    return text.replace(/[^0-9]/g, '');
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    return text.replace(/[^0-9]/g, '');
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    return text.replace(/[^0-9]/g, '');
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.textContent();
    return text.replace(/[^0-9]/g, '');
  }

  async getCreditUtilization() {
    await expect(this.creditUtilizationKPI).toBeVisible();
    const text = await this.creditUtilizationKPI.textContent();
    return text.replace(/[^0-9.]/g, '');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async simulateServiceTimeout() {
    await this.page.route('**/api/cards', route => {
      setTimeout(() => route.abort(), 2500);
    });
  }

  async simulateServiceUnavailable() {
    await this.page.route('**/api/cards', route => {
      route.fulfill({
        status: 503,
        body: JSON.stringify({ error: 'Service unavailable' })
      });
    });
  }

  async getIndividualCardLimits() {
    const cardLimitElements = await this.page.locator('[data-testid="card-limit"]').all();
    const limits = [];
    for (const element of cardLimitElements) {
      const text = await element.textContent();
      limits.push(parseInt(text.replace(/[^0-9]/g, '')));
    }
    return limits;
  }

  async getLayoutType() {
    const containerClass = await this.kpiCardContainer.getAttribute('class');
    if (containerClass.includes('vertical-stack')) return 'vertical-stack';
    if (containerClass.includes('horizontal-grid')) return 'horizontal-grid';
    if (containerClass.includes('degraded-vertical')) return 'degraded-vertical';
    return 'unknown';
  }

  async getVisibleKPICount() {
    const kpis = await this.page.locator('[data-testid^="kpi-"]').all();
    let visibleCount = 0;
    for (const kpi of kpis) {
      if (await kpi.isVisible()) visibleCount++;
    }
    return visibleCount;
  }

  async isResponsiveLayout() {
    const viewport = this.page.viewportSize();
    const containerWidth = await this.dashboardContainer.evaluate(el => el.offsetWidth);
    return containerWidth <= viewport.width;
  }

  async isHorizontalLayout() {
    const firstKPI = await this.page.locator('[data-testid^="kpi-"]').first();
    const secondKPI = await this.page.locator('[data-testid^="kpi-"]').nth(1);
    
    const firstBox = await firstKPI.boundingBox();
    const secondBox = await secondKPI.boundingBox();
    
    return firstBox.y === secondBox.y;
  }

  async getChartWidth() {
    await expect(this.chartContainer).toBeVisible();
    return await this.chartContainer.evaluate(el => el.offsetWidth);
  }

  async isManageCardsLinkVisible() {
    return await this.manageCardsLink.isVisible();
  }

  async isViewAnalyticsLinkVisible() {
    return await this.viewAnalyticsLink.isVisible();
  }

  async getTouchTargetSize(linkName) {
    const link = linkName === 'manageCardsLink' ? this.manageCardsLink : this.viewAnalyticsLink;
    const box = await link.boundingBox();
    return { width: box.width, height: box.height };
  }
};