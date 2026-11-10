const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');

exports.TransactionServicePage = class TransactionServicePage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger('TransactionServicePage');
    this.mockTransactions = [];
    this.serviceInvoked = false;
    this.queryExecuted = false;
  }

  async initializeTransactionsSpanning90Days(count) {
    this.mockTransactions = [];
    for (let i = 0; i < count; i++) {
      this.mockTransactions.push({
        transactionId: `TXN${i + 1}`,
        cardId: `CC00${(i % 3) + 1}`,
        cardNumber: `**** ${1000 + i}`,
        amount: 100 + i * 10,
        category: 'Food & Dining',
        merchantName: `Merchant ${i + 1}`,
        transactionDate: new Date(Date.now() - (i * 2) * 24 * 60 * 60 * 1000),
        status: 'Completed'
      });
    }
    this.logger.info(`${count} transactions initialized spanning 90 days`);
  }

  async initializeTransactionsByCategory(categoryDistribution) {
    this.mockTransactions = [];
    let txnId = 1;
    for (const [category, count] of Object.entries(categoryDistribution)) {
      for (let i = 0; i < count; i++) {
        this.mockTransactions.push({
          transactionId: `TXN${txnId++}`,
          cardId: 'CC001',
          cardNumber: '**** 1234',
          amount: 100 + i * 10,
          category: category,
          merchantName: `Merchant ${txnId}`,
          transactionDate: new Date(),
          status: 'Completed'
        });
      }
    }
    this.logger.info('Transactions initialized by category');
  }

  async initializeTransactionsByCard(cardDistribution) {
    this.mockTransactions = [];
    let txnId = 1;
    for (const [cardId, count] of Object.entries(cardDistribution)) {
      for (let i = 0; i < count; i++) {
        this.mockTransactions.push({
          transactionId: `TXN${txnId++}`,
          cardId: cardId,
          cardNumber: `**** ${cardId.slice(-4)}`,
          amount: 100 + i * 10,
          category: 'Food & Dining',
          merchantName: `Merchant ${txnId}`,
          transactionDate: new Date(Date.now() - i * 60 * 60 * 1000),
          status: 'Completed'
        });
      }
    }
    this.logger.info('Transactions initialized by card');
  }

  async initializeTransactionsForMultipleCards(count) {
    this.mockTransactions = [];
    for (let i = 0; i < count; i++) {
      this.mockTransactions.push({
        transactionId: `TXN${i + 1}`,
        cardId: `CC00${(i % 3) + 1}`,
        cardNumber: `**** ${1000 + i}`,
        amount: 100 + i * 10,
        category: 'Food & Dining',
        merchantName: `Merchant ${i + 1}`,
        transactionDate: new Date(Date.now() - i * 60 * 60 * 1000),
        status: 'Completed'
      });
    }
    this.logger.info(`${count} transactions initialized for multiple cards`);
  }

  async initializeEmptyTransactionList() {
    this.mockTransactions = [];
    this.logger.info('Empty transaction list initialized');
  }

  async getTransactions(pageNumber, pageSize, filters) {
    this.serviceInvoked = true;
    this.queryExecuted = true;
    await this.page.waitForTimeout(100); // Simulate service call
    
    let filtered = this.mockTransactions.slice();
    
    if (filters.startDate) {
      filtered = filtered.filter(t => new Date(t.transactionDate) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter(t => new Date(t.transactionDate) <= new Date(filters.endDate));
    }
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }
    if (filters.cardId) {
      filtered = filtered.filter(t => t.cardId === filters.cardId);
    }

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const paginated = filtered.slice(start, end);

    this.logger.info(`Transactions retrieved: ${paginated.length} of ${filtered.length}`);
    return {
      transactions: paginated,
      totalCount: filtered.length,
      pageNumber: pageNumber,
      pageSize: pageSize,
      hasMore: end < filtered.length
    };
  }

  async validateFilter(filter) {
    await this.page.waitForTimeout(50); // Simulate validation
    if (filter.startDate && filter.endDate) {
      if (new Date(filter.startDate) > new Date(filter.endDate)) {
        throw new Error('Start date must be before end date');
      }
    }
    this.logger.info('Filter validated');
  }

  async countTransactionsInDateRange(startDate, endDate) {
    return this.mockTransactions.filter(t => {
      const txnDate = new Date(t.transactionDate);
      return txnDate >= startDate && txnDate <= endDate;
    }).length;
  }

  async verifyNoTransactionsOutsideRange(transactions, filter) {
    for (const txn of transactions) {
      const txnDate = new Date(txn.transactionDate);
      expect(txnDate >= new Date(filter.startDate) && txnDate <= new Date(filter.endDate)).toBe(true);
    }
    this.logger.info('No transactions outside date range');
  }

  async wasServiceInvoked() {
    return this.serviceInvoked;
  }

  async wasQueryExecuted() {
    return this.queryExecuted;
  }

  async verifyErrorPropagation(errorMessage) {
    expect(errorMessage).toBeDefined();
    expect(errorMessage.length).toBeGreaterThan(0);
    this.logger.info('Error propagation verified');
  }

  async verifyAllTransactionFieldsPreserved(transactions) {
    const requiredFields = ['transactionId', 'cardId', 'cardNumber', 'amount', 'category', 'merchantName', 'transactionDate', 'status'];
    for (const txn of transactions) {
      for (const field of requiredFields) {
        expect(txn).toHaveProperty(field);
      }
    }
    this.logger.info('All transaction fields preserved');
  }

  async verifyCardIdentification(transactions) {
    for (const txn of transactions) {
      expect(txn.cardId).toBeDefined();
      expect(txn.cardNumber).toBeDefined();
      expect(txn.cardNumber).toMatch(/\*{4}/);
    }
    this.logger.info('Card identification verified');
  }

  async verifyDescendingDateOrder(transactions) {
    for (let i = 0; i < transactions.length - 1; i++) {
      const date1 = new Date(transactions[i].transactionDate);
      const date2 = new Date(transactions[i + 1].transactionDate);
      expect(date1 >= date2).toBe(true);
    }
    this.logger.info('Descending date order verified');
  }

  async verifyGracefulEmptyStateHandling(result) {
    expect(result).toBeDefined();
    expect(result.transactions).toBeDefined();
    expect(result.totalCount).toBeDefined();
    expect(result.hasMore).toBeDefined();
    this.logger.info('Graceful empty state handling verified');
  }
};
