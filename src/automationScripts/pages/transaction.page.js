const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.transactionList = page.locator('[data-testid="transaction-list"]');
    this.transactionRow = page.locator('[data-testid="transaction-row"]');
    this.cardIdField = page.locator('[data-testid="card-id"]');
    this.transactionDateField = page.locator('[data-testid="transaction-date"]');
    this.transactionAmountField = page.locator('[data-testid="transaction-amount"]');
    this.merchantNameField = page.locator('[data-testid="merchant-name"]');
    this.totalCountLabel = page.locator('[data-testid="total-count"]');
    this.hasMoreIndicator = page.locator('[data-testid="has-more"]');
    this.errorIndicator = page.locator('[data-testid="error-indicator"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.validationError = page.locator('[data-testid="validation-error"]');
    
    // Filter controls
    this.startDateInput = page.locator('[data-testid="filter-start-date"]');
    this.endDateInput = page.locator('[data-testid="filter-end-date"]');
    this.cardIdFilter = page.locator('[data-testid="filter-card-id"]');
    this.minAmountInput = page.locator('[data-testid="filter-min-amount"]');
    this.maxAmountInput = page.locator('[data-testid="filter-max-amount"]');
    this.searchTextInput = page.locator('[data-testid="filter-search-text"]');
    this.applyFiltersButton = page.locator('[data-testid="apply-filters"]');
    
    // Pagination controls
    this.pageNumberInput = page.locator('[data-testid="page-number"]');
    this.pageSizeInput = page.locator('[data-testid="page-size"]');
    this.loadButton = page.locator('[data-testid="load-transactions"]');
  }

  async navigate() {
    await this.page.goto('/transactions');
    await expect(this.transactionList).toBeVisible();
    logger.info('Navigated to transactions page');
  }

  async setupTestData(config) {
    // Mock API endpoint to return test data
    await this.page.route('**/api/transactions**', async route => {
      const url = new URL(route.request().url());
      const page = parseInt(url.searchParams.get('page') || '1');
      const size = parseInt(url.searchParams.get('size') || '20');
      
      const transactions = [];
      const cards = ['card-a', 'card-b', 'card-c'];
      let totalCount = 0;
      
      if (config.cardA) totalCount += config.cardA.transactionCount;
      if (config.cardB) totalCount += config.cardB.transactionCount;
      if (config.cardC) totalCount += config.cardC.transactionCount;
      
      if (config.totalTransactions) totalCount = config.totalTransactions;
      
      const start = (page - 1) * size;
      const end = Math.min(start + size, totalCount);
      
      for (let i = start; i < end; i++) {
        transactions.push({
          transactionId: i + 1,
          cardId: cards[i % cards.length],
          amount: 100 + (i * 10),
          merchantName: `Merchant ${i + 1}`,
          transactionDate: new Date(Date.now() - (i * 86400000)).toISOString(),
          status: 'Posted'
        });
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          transactions,
          totalCount,
          hasMore: end < totalCount
        })
      });
    });
    logger.info('Test data setup completed');
  }

  async setupTestDataWithError(config) {
    await this.page.route('**/api/transactions**', async route => {
      const transactions = [];
      let totalCount = 0;
      const errors = [];
      
      if (config.cardA && !config.cardA.status) totalCount += config.cardA.transactionCount;
      if (config.cardB && !config.cardB.status) totalCount += config.cardB.transactionCount;
      
      if (config.cardC && config.cardC.status) {
        errors.push({
          cardId: config.cardC.id,
          status: 'unavailable',
          message: config.cardC.error
        });
      }
      
      const url = new URL(route.request().url());
      const size = parseInt(url.searchParams.get('size') || '20');
      
      for (let i = 0; i < Math.min(size, totalCount); i++) {
        transactions.push({
          transactionId: i + 1,
          cardId: i < 15 ? 'card-a' : 'card-b',
          amount: 100 + (i * 10),
          merchantName: `Merchant ${i + 1}`,
          transactionDate: new Date().toISOString(),
          status: 'Posted'
        });
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          transactions,
          totalCount,
          hasMore: false,
          errors
        })
      });
    });
    logger.info('Test data with error setup completed');
  }

  async setupAllCardsWithError(config) {
    await this.page.route('**/api/transactions**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          transactions: [],
          totalCount: 0,
          hasMore: false,
          errors: [
            { cardId: 'card-a', status: 'error', message: 'Service error' },
            { cardId: 'card-b', status: 'error', message: 'Service error' },
            { cardId: 'card-c', status: 'error', message: 'Service error' }
          ]
        })
      });
    });
    logger.info('All cards configured with errors');
  }

  async setupTestDataWithDateRange(config) {
    await this.page.route('**/api/transactions**', async route => {
      const url = new URL(route.request().url());
      const startDate = url.searchParams.get('startDate');
      const endDate = url.searchParams.get('endDate');
      
      let transactions = [];
      let totalCount = 125;
      
      if (startDate === '2024-01-01' && endDate === '2024-01-31') {
        totalCount = 25;
        const size = parseInt(url.searchParams.get('size') || '20');
        for (let i = 0; i < Math.min(size, 25); i++) {
          transactions.push({
            transactionId: i + 1,
            cardId: 'card-a',
            amount: 100 + (i * 10),
            merchantName: `Merchant ${i + 1}`,
            transactionDate: `2024-01-${String(i + 1).padStart(2, '0')}T12:00:00Z`,
            status: 'Posted'
          });
        }
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          transactions,
          totalCount,
          hasMore: totalCount > transactions.length
        })
      });
    });
    logger.info('Test data with date range setup completed');
  }

  async setupDiverseTestData(config) {
    await this.page.route('**/api/transactions**', async route => {
      const url = new URL(route.request().url());
      const filters = {
        cardId: url.searchParams.get('cardId'),
        minAmount: parseFloat(url.searchParams.get('minAmount') || '0'),
        maxAmount: parseFloat(url.searchParams.get('maxAmount') || '999999'),
        searchText: url.searchParams.get('search') || '',
        startDate: url.searchParams.get('startDate'),
        endDate: url.searchParams.get('endDate')
      };
      
      let transactions = [];
      let matchingCount = 0;
      
      // Simulate filtering logic
      for (let i = 0; i < 200; i++) {
        const txn = {
          transactionId: i + 1,
          cardId: config.cardIds[i % config.cardIds.length],
          amount: config.amountRange.min + (i * 10),
          merchantName: config.merchants[i % config.merchants.length],
          transactionDate: new Date(Date.now() - (i * 86400000)).toISOString(),
          status: 'Posted'
        };
        
        let matches = true;
        if (filters.cardId && txn.cardId !== filters.cardId) matches = false;
        if (txn.amount < filters.minAmount || txn.amount > filters.maxAmount) matches = false;
        if (filters.searchText && !txn.merchantName.toLowerCase().includes(filters.searchText.toLowerCase())) matches = false;
        
        if (matches) {
          matchingCount++;
          if (transactions.length < 20) transactions.push(txn);
        }
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          transactions,
          totalCount: matchingCount,
          hasMore: matchingCount > 20
        })
      });
    });
    logger.info('Diverse test data setup completed');
  }

  async loadTransactions(pageNumber, pageSize) {
    await this.pageNumberInput.fill(String(pageNumber));
    await this.pageSizeInput.fill(String(pageSize));
    await this.loadButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info(`Loaded transactions: page ${pageNumber}, size ${pageSize}`);
  }

  async getDisplayedTransactions() {
    await expect(this.transactionRow.first()).toBeVisible();
    return await this.transactionRow.all();
  }

  async getTransactionCardId(transaction) {
    const cardId = await transaction.locator('[data-testid="card-id"]').textContent();
    return cardId.trim();
  }

  async getTotalCount() {
    const text = await this.totalCountLabel.textContent();
    return parseInt(text.match(/\d+/)[0]);
  }

  async verifyDateOrdering(order) {
    const dates = await this.transactionDateField.allTextContents();
    const timestamps = dates.map(d => new Date(d).getTime());
    
    for (let i = 0; i < timestamps.length - 1; i++) {
      if (order === 'descending') {
        if (timestamps[i] < timestamps[i + 1]) return false;
      } else {
        if (timestamps[i] > timestamps[i + 1]) return false;
      }
    }
    return true;
  }

  async getErrorIndicatorForCard(cardId) {
    return this.page.locator(`[data-testid="error-indicator-${cardId}"]`);
  }

  async getErrorMessage(cardId) {
    const errorMsg = await this.page.locator(`[data-testid="error-message-${cardId}"]`).textContent();
    return errorMsg.trim();
  }

  async getAllErrorIndicators() {
    return await this.errorIndicator.all();
  }

  async getTransactionIds() {
    const ids = await this.page.locator('[data-testid="transaction-id"]').allTextContents();
    return ids.map(id => parseInt(id));
  }

  async verifyCardIdentificationForAll() {
    const transactions = await this.getDisplayedTransactions();
    for (const txn of transactions) {
      const cardId = await this.getTransactionCardId(txn);
      expect(cardId).toBeTruthy();
    }
    logger.info('Card identification verified for all transactions');
  }

  async applyDateRangeFilter(startDate, endDate) {
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
    await this.applyFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info(`Date range filter applied: ${startDate} to ${endDate}`);
  }

  async applyAmountRangeFilter(minAmount, maxAmount) {
    await this.minAmountInput.fill(String(minAmount));
    await this.maxAmountInput.fill(String(maxAmount));
    await this.applyFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info(`Amount range filter applied: ${minAmount} to ${maxAmount}`);
  }

  async applyMultipleFilters(filters) {
    if (filters.startDate) await this.startDateInput.fill(filters.startDate);
    if (filters.endDate) await this.endDateInput.fill(filters.endDate);
    if (filters.cardId) await this.cardIdFilter.fill(filters.cardId);
    if (filters.minAmount) await this.minAmountInput.fill(String(filters.minAmount));
    if (filters.maxAmount) await this.maxAmountInput.fill(String(filters.maxAmount));
    if (filters.searchText) await this.searchTextInput.fill(filters.searchText);
    
    await this.applyFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Multiple filters applied');
  }

  async getDisplayedTransactionCount() {
    return await this.transactionRow.count();
  }

  async verifyAllTransactionDatesInRange(startDate, endDate) {
    const dates = await this.transactionDateField.allTextContents();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    for (const dateStr of dates) {
      const timestamp = new Date(dateStr).getTime();
      if (timestamp < start || timestamp > end) return false;
    }
    return true;
  }

  async getHasMoreStatus() {
    const isVisible = await this.hasMoreIndicator.isVisible();
    return isVisible;
  }

  async verifyAllTransactionsMatchCard(cardId) {
    const cardIds = await this.cardIdField.allTextContents();
    return cardIds.every(id => id.trim() === cardId);
  }

  async verifyAllAmountsInRange(min, max) {
    const amounts = await this.transactionAmountField.allTextContents();
    for (const amountStr of amounts) {
      const amount = parseFloat(amountStr.replace(/[^0-9.]/g, ''));
      if (amount < min || amount > max) return false;
    }
    return true;
  }

  async verifyAllTransactionsContainText(searchText) {
    const merchants = await this.merchantNameField.allTextContents();
    return merchants.every(merchant => merchant.toLowerCase().includes(searchText.toLowerCase()));
  }

  async isValidationErrorVisible() {
    return await this.validationError.isVisible();
  }

  async getValidationErrorMessage() {
    return await this.validationError.textContent();
  }
};
