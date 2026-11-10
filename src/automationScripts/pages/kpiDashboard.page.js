const { expect } = require('@playwright/test');
const { WaitUtils } = require('../utils/wait.utils');
const { Logger } = require('../utils/logger');

exports.KPIDashboardPage = class KPIDashboardPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger();
    this.waitUtils = new WaitUtils(page);
    
    // Locators
    this.dashboardLink = page.locator('a[href="#/dashboard"]');
    this.dashboardContainer = page.locator('.dashboard-container');
    this.monthlySpendKPI = page.locator('kpi-card[label="Monthly Spend"]');
    this.totalCreditLimitKPI = page.locator('kpi-card[label="Total Credit Limit"]');
    this.availableCreditKPI = page.locator('kpi-card[label="Available Credit"]');
    this.outstandingAmountKPI = page.locator('kpi-card[label="Outstanding Amount"]');
    this.missingDataMessage = page.locator('.dashboard-container .alert-warning, .missing-data-message');
  }

  async navigateToDashboard() {
    await this.dashboardLink.click();
    await this.waitUtils.waitForPageLoad();
    await expect(this.page).toHaveURL(/.*dashboard/);
    this.logger.info('Navigated to KPI Dashboard');
  }

  async getKPIData() {
    await this.waitUtils.waitForElement(this.dashboardContainer);
    
    const kpiData = await this.page.evaluate(() => {
      const controller = angular.element(document.querySelector('[ng-controller="DashboardController"]')).scope();
      return {
        monthlySpend: controller.vm.kpiData.monthlySpend || 0,
        totalCreditLimit: controller.vm.kpiData.totalCreditLimit || 0,
        availableCredit: controller.vm.kpiData.availableCredit || 0,
        outstandingAmount: controller.vm.kpiData.outstandingAmount || 0,
        utilizationRate: controller.vm.kpiData.utilizationRate || 0
      };
    });
    
    this.logger.info('Retrieved KPI data from dashboard');
    return kpiData;
  }

  async getMonthlySpendDisplayValue() {
    await this.waitUtils.waitForElement(this.monthlySpendKPI);
    const value = await this.monthlySpendKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  async getIndividualCardMonthlySpends(userId) {
    const spends = await this.page.evaluate(async (uid) => {
      const response = await fetch(`/api/transactions/monthly-spend/${uid}`);
      const data = await response.json();
      return data.cards ? data.cards.map(c => c.monthlySpend) : [];
    }, userId);
    
    this.logger.info(`Retrieved monthly spends for ${spends.length} cards`);
    return spends;
  }

  async getIndividualCardBalances(userId) {
    const balances = await this.page.evaluate(async (uid) => {
      const response = await fetch(`/api/cards/user/${uid}/balances`);
      const data = await response.json();
      return data.map(card => ({
        cardId: card.cardId,
        creditLimit: card.creditLimit || 0,
        availableCredit: card.availableCredit || 0,
        outstandingBalance: card.outstandingBalance || 0
      }));
    }, userId);
    
    this.logger.info(`Retrieved balances for ${balances.length} cards`);
    return balances;
  }

  async simulateTransaction(userId, cardId, amount) {
    await this.page.evaluate(async (params) => {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: params.userId,
          cardId: params.cardId,
          amount: params.amount,
          date: new Date().toISOString()
        })
      });
    }, { userId, cardId, amount });
    
    this.logger.info(`Simulated transaction: $${amount} on card ${cardId}`);
  }
};
