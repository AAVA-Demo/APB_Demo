const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('[ng-controller="DashboardController as vm"]');
    this.kpiCards = page.locator('.kpi-card');
    this.loadingIndicator = page.locator('h4:has-text("Loading dashboard...")');
    this.errorAlert = page.locator('.alert-danger');
    this.refreshButton = page.locator('button:has-text("Refresh Dashboard")');
    this.utilizationBar = page.locator('.utilization-fill');
  }

  async loadKPIs() {
    await this.page.waitForFunction(() => {
      const scope = angular.element(document.querySelector('[ng-controller="DashboardController as vm"]')).scope();
      return scope && scope.vm && scope.vm.kpis;
    }, { timeout: 5000 });
  }

  async waitForKPIsLoad() {
    await this.dashboardContainer.waitFor({ state: 'visible', timeout: 5000 });
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async getTotalCreditLimit() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="DashboardController as vm"]')).scope();
      return scope.vm.kpis.totalCreditLimit;
    });
  }

  async getOutstandingAmount() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="DashboardController as vm"]')).scope();
      return scope.vm.kpis.outstandingAmount;
    });
  }

  async getAvailableCredit() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="DashboardController as vm"]')).scope();
      return scope.vm.kpis.availableCredit;
    });
  }

  async getMonthlySpend() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="DashboardController as vm"]')).scope();
      return scope.vm.kpis.monthlySpend;
    });
  }

  async getUtilizationPercentage() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="DashboardController as vm"]')).scope();
      return scope.vm.kpis.utilizationPercentage;
    });
  }

  async getLastUpdated() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="DashboardController as vm"]')).scope();
      return new Date(scope.vm.kpis.lastUpdated);
    });
  }

  async refreshKPIs() {
    await this.refreshButton.click();
    await this.page.waitForTimeout(500);
  }

  async hasConsoleErrors() {
    return await this.page.evaluate(() => {
      return window.consoleErrors && window.consoleErrors.length > 0;
    });
  }
};