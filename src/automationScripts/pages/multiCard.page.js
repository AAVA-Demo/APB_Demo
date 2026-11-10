const { expect } = require('@playwright/test');

exports.MultiCardPage = class MultiCardPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.myCardsLink = page.locator('a[href="#!/multi-card"]');
    this.cardListItems = page.locator('card-list-item, .list-group-item');
    this.noCardsMessage = page.locator('.alert-info:has-text("No credit cards found")');
    this.addCardGuidance = page.locator('text=Click here to add your first credit card, text=add a card');
    this.errorIndicator = page.locator('.alert-danger, .error-indicator');
    this.selectedCardDetails = page.locator('.panel:has-text("Card Details")');
    this.monthlySpendTrendsSection = page.locator('h4:has-text("Monthly Spend Trends"), spend-trend-chart');
    this.detailedSpendingAnalysis = page.locator('.panel-body');
    this.noSpendingDataMessage = page.locator('text=No spending data available for this card');
    this.emptyTrendChart = page.locator('canvas, text=No data to display');
    this.trendChart = page.locator('canvas#spendTrendCanvas');
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await expect(this.page).toHaveURL(/creditcard-dashboard/);
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToMyCards() {
    await this.myCardsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardsToLoad() {
    await expect(this.cardListItems.first().or(this.noCardsMessage)).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(500);
  }

  async getCardCount() {
    const isNoCardsVisible = await this.noCardsMessage.isVisible().catch(() => false);
    if (isNoCardsVisible) {
      return 0;
    }
    return await this.cardListItems.count();
  }

  async getCardDetails(index) {
    const card = this.cardListItems.nth(index);
    await expect(card).toBeVisible();
    const text = await card.textContent();
    const nameMatch = text.match(/([A-Za-z\s]+)/);
    const numberMatch = text.match(/(\*{4}\s?\*{4}\s?\*{4}\s?\d{4}|\*{4}\s?\d{4})/);
    const typeMatch = text.match(/(Credit|Debit)/);
    const limitMatch = text.match(/Limit[:\s]*\$([\d,]+\.\d{2})/);
    const availableMatch = text.match(/Available[:\s]*\$([\d,]+\.\d{2})/);
    const balanceMatch = text.match(/Balance[:\s]*\$([\d,]+\.\d{2})/);
    return {
      name: nameMatch ? nameMatch[1].trim() : '',
      number: numberMatch ? numberMatch[1] : '',
      type: typeMatch ? typeMatch[1] : '',
      creditLimit: limitMatch ? parseFloat(limitMatch[1].replace(/,/g, '')) : 0,
      availableCredit: availableMatch ? parseFloat(availableMatch[1].replace(/,/g, '')) : 0,
      outstandingAmount: balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, '')) : 0
    };
  }

  async getNoCardsMessageText() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async getErrorIndicatorText() {
    await expect(this.errorIndicator).toBeVisible();
    return await this.errorIndicator.textContent();
  }

  async isInterfaceInteractive() {
    const firstCard = this.cardListItems.first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      return await this.selectedCardDetails.isVisible().catch(() => false);
    }
    return false;
  }

  async selectCard(cardIdentifier) {
    const card = this.cardListItems.filter({ hasText: cardIdentifier });
    await expect(card).toBeVisible();
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlyTrendData() {
    await expect(this.monthlySpendTrendsSection).toBeVisible();
    await this.page.waitForTimeout(1000);
    const chartData = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas#spendTrendCanvas');
      if (canvas && canvas.chart) {
        const chart = canvas.chart;
        return chart.data.labels.map((label, index) => ({
          month: label,
          totalSpend: chart.data.datasets[0].data[index]
        }));
      }
      return [];
    });
    return chartData;
  }

  async getCategoryBreakdown() {
    await expect(this.detailedSpendingAnalysis).toBeVisible();
    const text = await this.detailedSpendingAnalysis.textContent();
    const categories = [];
    const categoryNames = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    categoryNames.forEach(category => {
      if (text.includes(category)) {
        const regex = new RegExp(category + '[:\s]*\$([\d,]+\.\d{2})');
        const match = text.match(regex);
        if (match) {
          categories.push({
            category: category,
            amount: parseFloat(match[1].replace(/,/g, ''))
          });
        }
      }
    });
    return categories;
  }

  async getNoSpendingDataMessageText() {
    await expect(this.noSpendingDataMessage).toBeVisible();
    return await this.noSpendingDataMessage.textContent();
  }

  async getEmptyTrendChartText() {
    await expect(this.emptyTrendChart).toBeVisible();
    return await this.emptyTrendChart.textContent();
  }
};