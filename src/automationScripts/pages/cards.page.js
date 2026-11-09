const { expect } = require('@playwright/test');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    this.cardsNavLink = page.locator('a[href*="cards"], nav a:has-text("Cards"), nav a:has-text("My Cards")');
    this.cardsList = page.locator('[data-testid="card-item"], .card-item, .panel');
    this.emptyStateMessage = page.locator('[data-testid="empty-state"], .alert-info, text=/No credit cards found/i');
    this.addCardButton = page.locator('[data-testid="add-card-btn"], button:has-text("Add Card")');
    this.cardSwitcher = page.locator('[data-testid="card-switcher"], .card-switcher select');
    this.spendAnalysisSection = page.locator('[data-testid="spend-analysis"], .spend-analysis, .panel:has-text("Spend Analysis")');
    this.transactionsTable = page.locator('[data-testid="transactions-table"], table');
    this.noTransactionsMessage = page.locator('text=/No transactions/i');
    this.dashboardNavLink = page.locator('a[href*="dashboard"], nav a:has-text("Dashboard")');
  }

  async navigateToCards() {
    await this.cardsNavLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToDashboard() {
    await this.dashboardNavLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardsLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async waitForCardDetailsLoad() {
    await expect(this.spendAnalysisSection).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    return await this.cardsList.count();
  }

  async getCardDetails(index) {
    const card = this.cardsList.nth(index);
    await expect(card).toBeVisible();
    
    const cardNumber = await card.locator('.card-number, p:has-text("****")').textContent();
    const cardType = await card.locator('.card-type, .label-primary').textContent();
    const creditLimitText = await card.locator('text=/Credit Limit/i').locator('..').textContent();
    const availableCreditText = await card.locator('text=/Available/i').locator('..').textContent();
    const outstandingText = await card.locator('text=/Outstanding/i').locator('..').textContent();
    const expiryDate = await card.locator('text=/Expires/i').locator('..').textContent();
    const status = await card.locator('.label, [data-testid="card-status"]').first().textContent();
    
    return {
      cardNumber: cardNumber.trim(),
      cardType: cardType.trim(),
      creditLimit: parseFloat(creditLimitText.replace(/[^0-9.-]/g, '')),
      availableCredit: parseFloat(availableCreditText.replace(/[^0-9.-]/g, '')),
      outstandingAmount: parseFloat(outstandingText.replace(/[^0-9.-]/g, '')),
      expiryDate: expiryDate.match(/\d{2}\/\d{2}/)?.[0] || '',
      status: status.trim()
    };
  }

  async getEmptyStateMessage() {
    if (await this.emptyStateMessage.isVisible()) {
      return await this.emptyStateMessage.textContent();
    }
    return '';
  }

  async isAddCardButtonVisible() {
    return await this.addCardButton.isVisible();
  }

  async getExpiredCards() {
    const count = await this.cardsList.count();
    const expiredCards = [];
    
    for (let i = 0; i < count; i++) {
      const card = this.cardsList.nth(i);
      const status = await card.locator('.label, [data-testid="card-status"]').first().textContent();
      if (status.match(/Expired|Inactive/i)) {
        const details = await this.getCardDetails(i);
        expiredCards.push(details);
      }
    }
    
    return expiredCards;
  }

  async getTotalCreditLimitFromDashboard() {
    const kpiCard = this.page.locator('[data-testid="kpi-total-credit-limit"], .kpi-card:has-text("Total Credit Limit")');
    await expect(kpiCard).toBeVisible();
    const text = await kpiCard.locator('h2, .kpi-value').textContent();
    return parseFloat(text.replace(/[^0-9.-]/g, ''));
  }

  async selectCard(index) {
    const card = this.cardsList.nth(index);
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async switchCard(index) {
    await this.cardSwitcher.selectOption({ index: index });
    await this.page.waitForLoadState('networkidle');
  }

  async getSpendAnalysis() {
    await expect(this.spendAnalysisSection).toBeVisible();
    
    const currentMonthText = await this.page.locator('text=/Current Month Spend/i').locator('..').textContent();
    const lastMonthText = await this.page.locator('text=/Last Month Spend/i').locator('..').textContent();
    const ytdText = await this.page.locator('text=/Year-to-Date/i').locator('..').textContent();
    const topCategoryText = await this.page.locator('text=/Top Category/i').locator('..').textContent();
    const transactionCountText = await this.page.locator('text=/Total Transactions/i').locator('..').textContent();
    
    return {
      currentMonthSpend: parseFloat(currentMonthText.replace(/[^0-9.-]/g, '')) || 0,
      lastMonthSpend: parseFloat(lastMonthText.replace(/[^0-9.-]/g, '')) || 0,
      ytdSpend: parseFloat(ytdText.replace(/[^0-9.-]/g, '')) || 0,
      topCategory: topCategoryText.split(':')[1]?.trim() || '',
      transactionCount: parseInt(transactionCountText.replace(/[^0-9]/g, '')) || 0
    };
  }

  async getNoTransactionsMessage() {
    if (await this.noTransactionsMessage.isVisible()) {
      return await this.noTransactionsMessage.textContent();
    }
    return '';
  }

  async getTransactionsList() {
    if (await this.transactionsTable.isVisible()) {
      const rows = await this.transactionsTable.locator('tbody tr').count();
      const transactions = [];
      
      for (let i = 0; i < rows; i++) {
        const row = this.transactionsTable.locator('tbody tr').nth(i);
        const cells = await row.locator('td').allTextContents();
        transactions.push({
          date: cells[0],
          description: cells[1],
          amount: parseFloat(cells[4]?.replace(/[^0-9.-]/g, '') || '0')
        });
      }
      
      return transactions;
    }
    return [];
  }
};
