const { expect } = require('@playwright/test');

exports.MultiCardPage = class MultiCardPage {
  constructor(page) {
    this.page = page;
    this.multiCardContainer = page.locator('[ng-controller="MultiCardController as vm"]');
    this.cardItems = page.locator('.card-item');
    this.loadingIndicator = page.locator('h4:has-text("Loading cards...")');
    this.errorAlert = page.locator('.alert-danger');
    this.viewDetailsButtons = page.locator('button:has-text("View Details")');
    this.compareCheckboxes = page.locator('input[type="checkbox"]');
    this.compareButton = page.locator('button:has-text("Compare Selected Cards")');
    this.comparisonResultContainer = page.locator('.chart-container:has(h4:has-text("Comparison Results"))');
  }

  async loadAllCards() {
    await this.page.waitForFunction(() => {
      const scope = angular.element(document.querySelector('[ng-controller="MultiCardController as vm"]')).scope();
      return scope && scope.vm && scope.vm.cardPortfolio;
    }, { timeout: 5000 });
  }

  async waitForCardsLoad() {
    await this.multiCardContainer.waitFor({ state: 'visible', timeout: 5000 });
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async getTotalCardsCount() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="MultiCardController as vm"]')).scope();
      return scope.vm.cardPortfolio.totalCards;
    });
  }

  async getAllCards() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="MultiCardController as vm"]')).scope();
      return scope.vm.cardPortfolio.cards;
    });
  }

  async getCardByIndex(index) {
    return await this.page.evaluate((idx) => {
      const scope = angular.element(document.querySelector('[ng-controller="MultiCardController as vm"]')).scope();
      return scope.vm.cardPortfolio.cards[idx];
    }, index);
  }

  async getCardById(cardId) {
    return await this.page.evaluate((id) => {
      const scope = angular.element(document.querySelector('[ng-controller="MultiCardController as vm"]')).scope();
      return scope.vm.cardPortfolio.cards.find(c => c.cardId === id);
    }, cardId);
  }

  async getUserId() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="MultiCardController as vm"]')).scope();
      return scope.vm.cardPortfolio.userId;
    });
  }

  async hasConsoleErrors() {
    return await this.page.evaluate(() => {
      return window.consoleErrors && window.consoleErrors.length > 0;
    });
  }

  async loadCardsExpectingError() {
    try {
      await this.loadAllCards();
      return false;
    } catch (error) {
      return true;
    }
  }

  async hasUnauthorizedError() {
    return await this.page.evaluate(() => {
      return window.consoleErrors && window.consoleErrors.some(e => e.includes('Unauthorized access'));
    });
  }

  async hasCardDataInResponse() {
    const errorText = await this.errorAlert.textContent().catch(() => '');
    return errorText.includes('cardId') || errorText.includes('cardNumber');
  }

  async selectCardForComparison(cardId) {
    await this.page.evaluate((id) => {
      const scope = angular.element(document.querySelector('[ng-controller="MultiCardController as vm"]')).scope();
      const card = scope.vm.cardPortfolio.cards.find(c => c.cardId === id);
      scope.vm.toggleCardSelection(card);
      scope.$apply();
    }, cardId);
  }

  async compareSelectedCards() {
    await this.compareButton.click();
    await this.page.waitForTimeout(500);
  }

  async getComparisonResult() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="MultiCardController as vm"]')).scope();
      return scope.vm.comparisonResult;
    });
  }
};