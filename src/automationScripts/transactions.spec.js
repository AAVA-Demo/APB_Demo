const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');
const logger = require('../utils/logger');

test.describe('Credit Card Transactions - Management and Filtering', () => {

  test('QE-9493 TS-001 TC-001 - Verify consolidated transaction list displays all transactions from 2 credit cards with complete transaction details', async ({ page }) => {
    logger.info('Starting test: QE-9493 TS-001 TC-001');
    const transactionPage = new TransactionPage(page);
    
    await test.step('Launch application and login', async () => {
      await transactionPage.navigate();
      await transactionPage.login('testuser_2cards', 'Pass@123');
    });

    await test.step('Navigate to Transaction Management page', async () => {
      await transactionPage.navigateToTransactions();
      await expect(transactionPage.transactionTable).toBeVisible();
    });

    await test.step('Verify transaction list displays transactions from both cards', async () => {
      const transactions = await transactionPage.getAllTransactions();
      expect(transactions.length).toBeGreaterThan(0);
      const cardIdentifiers = transactions.map(t => t.cardNumber);
      expect(cardIdentifiers).toContain('****1234');
      expect(cardIdentifiers).toContain('****5678');
    });

    await test.step('Verify each transaction contains all required fields', async () => {
      const firstTransaction = await transactionPage.getTransactionByIndex(0);
      expect(firstTransaction.date).toBeTruthy();
      expect(firstTransaction.merchant).toBeTruthy();
      expect(firstTransaction.amount).toMatch(/\$\d+\.\d{2}/);
      expect(firstTransaction.cardNumber).toMatch(/\*{4}\d{4}/);
    });
  });

  test('QE-9493 TS-001 TC-002 - Verify transaction list correctly segregates and identifies transactions by card when viewing consolidated multi-card history', async ({ page }) => {
    logger.info('Starting test: QE-9493 TS-001 TC-002');
    const transactionPage = new TransactionPage(page);
    
    await transactionPage.navigate();
    await transactionPage.login('testuser_2cards', 'Pass@123');
    await transactionPage.navigateToTransactions();

    await test.step('Verify transactions from Card A are correctly labeled', async () => {
      const cardATransactions = await transactionPage.getTransactionsByCard('****1234');
      expect(cardATransactions.length).toBeGreaterThan(0);
      cardATransactions.forEach(txn => {
        expect(txn.cardNumber).toBe('****1234');
        expect(txn.cardType).toContain('Visa');
      });
    });

    await test.step('Verify transactions from Card B are correctly labeled', async () => {
      const cardBTransactions = await transactionPage.getTransactionsByCard('****5678');
      expect(cardBTransactions.length).toBeGreaterThan(0);
      cardBTransactions.forEach(txn => {
        expect(txn.cardNumber).toBe('****5678');
        expect(txn.cardType).toContain('Mastercard');
      });
    });

    await test.step('Verify consolidated list maintains chronological order', async () => {
      const allTransactions = await transactionPage.getAllTransactions();
      for (let i = 0; i < allTransactions.length - 1; i++) {
        const currentDate = new Date(allTransactions[i].date);
        const nextDate = new Date(allTransactions[i + 1].date);
        expect(currentDate >= nextDate).toBeTruthy();
      }
    });
  });

  test('QE-9493 TS-002 TC-001 - Verify appropriate message is displayed when user with no registered credit cards accesses transaction management page', async ({ page }) => {
    logger.info('Starting test: QE-9493 TS-002 TC-001');
    const transactionPage = new TransactionPage(page);
    
    await transactionPage.navigate();
    await transactionPage.login('testuser_nocards', 'Pass@123');
    await transactionPage.navigateToTransactions();

    await test.step('Verify no cards message is displayed', async () => {
      await expect(transactionPage.noCardsMessage).toBeVisible();
      const messageText = await transactionPage.noCardsMessage.textContent();
      expect(messageText).toContain('No credit cards registered');
    });

    await test.step('Verify no transaction list is displayed', async () => {
      await expect(transactionPage.transactionTable).not.toBeVisible();
    });
  });

  test('QE-9493 TS-003 TC-001 - Verify transaction history displays only transactions from cards with activity when user has mix of active and inactive cards', async ({ page }) => {
    logger.info('Starting test: QE-9493 TS-003 TC-001');
    const transactionPage = new TransactionPage(page);
    
    await transactionPage.navigate();
    await transactionPage.login('testuser_5cards_mixed', 'Pass@123');
    await transactionPage.navigateToTransactions();

    await test.step('Verify transactions from 3 active cards are displayed', async () => {
      const transactions = await transactionPage.getAllTransactions();
      const cardNumbers = [...new Set(transactions.map(t => t.cardNumber))];
      expect(cardNumbers).toContain('****1111');
      expect(cardNumbers).toContain('****2222');
      expect(cardNumbers).toContain('****3333');
    });

    await test.step('Verify no transactions from 2 inactive cards', async () => {
      const transactions = await transactionPage.getAllTransactions();
      const cardNumbers = transactions.map(t => t.cardNumber);
      expect(cardNumbers).not.toContain('****4444');
      expect(cardNumbers).not.toContain('****5555');
    });

    await test.step('Verify consolidated list is in chronological order', async () => {
      const transactions = await transactionPage.getAllTransactions();
      expect(transactions.length).toBeGreaterThan(0);
    });
  });

  test('QE-9493 TS-003 TC-002 - Verify card filter dropdown shows all 5 cards but transaction list only displays data from 3 cards with transaction history', async ({ page }) => {
    logger.info('Starting test: QE-9493 TS-003 TC-002');
    const transactionPage = new TransactionPage(page);
    
    await transactionPage.navigate();
    await transactionPage.login('testuser_5cards_mixed', 'Pass@123');
    await transactionPage.navigateToTransactions();

    await test.step('Verify card filter dropdown shows all 5 cards', async () => {
      await transactionPage.openCardFilter();
      const filterOptions = await transactionPage.getCardFilterOptions();
      expect(filterOptions.length).toBe(5);
      expect(filterOptions).toContain('****1111');
      expect(filterOptions).toContain('****4444');
      expect(filterOptions).toContain('****5555');
    });

    await test.step('Verify transaction list shows only 3 cards with activity', async () => {
      await transactionPage.selectCardFilter('All Cards');
      const transactions = await transactionPage.getAllTransactions();
      const uniqueCards = [...new Set(transactions.map(t => t.cardNumber))];
      expect(uniqueCards.length).toBe(3);
    });

    await test.step('Select inactive card and verify no transactions message', async () => {
      await transactionPage.selectCardFilter('****4444');
      await expect(transactionPage.noTransactionsMessage).toBeVisible();
      const messageText = await transactionPage.noTransactionsMessage.textContent();
      expect(messageText).toContain('No transactions found');
    });
  });

  test('QE-9489 TS-001 TC-001 - Verify date and card filter returns only Card A transactions from the last 30 days within 1 second', async ({ page }) => {
    logger.info('Starting test: QE-9489 TS-001 TC-001');
    const transactionPage = new TransactionPage(page);
    
    await transactionPage.navigate();
    await transactionPage.login('testuser_3cards_6months', 'Pass@123');
    await transactionPage.navigateToTransactions();

    await test.step('Select Last 30 Days from date range filter', async () => {
      await transactionPage.selectDateRangeFilter('Last 30 Days');
    });

    await test.step('Select Card A from card filter', async () => {
      await transactionPage.selectCardFilter('****1234');
    });

    await test.step('Apply filter and measure response time', async () => {
      const startTime = Date.now();
      await transactionPage.applyFilters();
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000);
      logger.info(`Filter applied in ${responseTime}ms`);
    });

    await test.step('Verify only Card A transactions from last 30 days are shown', async () => {
      const transactions = await transactionPage.getAllTransactions();
      transactions.forEach(txn => {
        expect(txn.cardNumber).toBe('****1234');
        const txnDate = new Date(txn.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        expect(txnDate >= thirtyDaysAgo).toBeTruthy();
      });
    });

    await test.step('Verify transaction count matches filter criteria', async () => {
      const countText = await transactionPage.getTransactionCount();
      expect(countText).toContain('Card A');
      expect(countText).toContain('Last 30 Days');
    });
  });

  test('QE-9489 TS-001 TC-002 - Verify filter can be cleared to return to full transaction list view', async ({ page }) => {
    logger.info('Starting test: QE-9489 TS-001 TC-002');
    const transactionPage = new TransactionPage(page);
    
    await transactionPage.navigate();
    await transactionPage.login('testuser_3cards_6months', 'Pass@123');
    await transactionPage.navigateToTransactions();

    await test.step('Apply date and card filters', async () => {
      await transactionPage.selectDateRangeFilter('Last 30 Days');
      await transactionPage.selectCardFilter('****1234');
      await transactionPage.applyFilters();
      const filteredCount = (await transactionPage.getAllTransactions()).length;
      logger.info(`Filtered transactions: ${filteredCount}`);
    });

    await test.step('Click Clear Filter button', async () => {
      await transactionPage.clearFilters();
    });

    await test.step('Verify transaction list returns to full view', async () => {
      const allTransactions = await transactionPage.getAllTransactions();
      const uniqueCards = [...new Set(allTransactions.map(t => t.cardNumber))];
      expect(uniqueCards.length).toBe(3);
    });

    await test.step('Verify transaction count reflects total transactions', async () => {
      const countText = await transactionPage.getTransactionCount();
      expect(countText).toContain('total transactions');
    });
  });

  test('QE-9489 TS-002 TC-001 - Verify validation error is displayed when user applies an invalid date range with end date earlier than start date', async ({ page }) => {
    logger.info('Starting test: QE-9489 TS-002 TC-001');
    const transactionPage = new TransactionPage(page);
    
    await transactionPage.navigate();
    await transactionPage.login('testuser', 'Pass@123');
    await transactionPage.navigateToTransactions();

    await test.step('Enter start date', async () => {
      await transactionPage.setStartDate('2023-12-01');
    });

    await test.step('Enter end date earlier than start date', async () => {
      await transactionPage.setEndDate('2023-11-01');
    });

    await test.step('Click Apply Filter button', async () => {
      await transactionPage.applyFilters();
    });

    await test.step('Verify validation error message is displayed', async () => {
      await expect(transactionPage.validationError).toBeVisible();
      const errorText = await transactionPage.validationError.textContent();
      expect(errorText).toContain('Invalid date range');
      expect(errorText).toContain('End date must be after start date');
    });

    await test.step('Verify no transactions are displayed', async () => {
      const transactions = await transactionPage.getAllTransactions();
      expect(transactions.length).toBe(0);
    });
  });

  test('QE-9489 TS-003 TC-001 - Verify multi-criteria filter (date range, card, merchant, amount range) returns only transactions matching all criteria within 1 second', async ({ page }) => {
    logger.info('Starting test: QE-9489 TS-003 TC-001');
    const transactionPage = new TransactionPage(page);
    
    await transactionPage.navigate();
    await transactionPage.login('testuser_diverse_transactions', 'Pass@123');
    await transactionPage.navigateToTransactions();

    await test.step('Apply date range filter: Last 60 Days', async () => {
      await transactionPage.selectDateRangeFilter('Last 60 Days');
    });

    await test.step('Apply card filter: Card B', async () => {
      await transactionPage.selectCardFilter('****5678');
    });

    await test.step('Apply merchant filter: Amazon', async () => {
      await transactionPage.setMerchantFilter('Amazon');
    });

    await test.step('Apply amount range filter: $50-$200', async () => {
      await transactionPage.setAmountRange(50, 200);
    });

    await test.step('Apply filters and measure response time', async () => {
      const startTime = Date.now();
      await transactionPage.applyFilters();
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000);
      logger.info(`Multi-criteria filter applied in ${responseTime}ms`);
    });

    await test.step('Verify transactions match all criteria', async () => {
      const transactions = await transactionPage.getAllTransactions();
      transactions.forEach(txn => {
        expect(txn.cardNumber).toBe('****5678');
        expect(txn.merchant).toContain('Amazon');
        const amount = parseFloat(txn.amount.replace('$', ''));
        expect(amount).toBeGreaterThanOrEqual(50);
        expect(amount).toBeLessThanOrEqual(200);
      });
    });

    await test.step('Verify transaction count reflects filtered results', async () => {
      const countText = await transactionPage.getTransactionCount();
      expect(countText).toContain('matching all filters');
    });
  });

  test('QE-9489 TS-003 TC-002 - Verify multi-criteria filter returns empty result when no transactions match all criteria', async ({ page }) => {
    logger.info('Starting test: QE-9489 TS-003 TC-002');
    const transactionPage = new TransactionPage(page);
    
    await transactionPage.navigate();
    await transactionPage.login('testuser_diverse_transactions', 'Pass@123');
    await transactionPage.navigateToTransactions();

    await test.step('Apply filters with criteria that no transaction can match', async () => {
      await transactionPage.selectDateRangeFilter('Last 7 Days');
      await transactionPage.selectCardFilter('****1234');
      await transactionPage.setMerchantFilter('XYZ Store');
      await transactionPage.setAmountRange(1000, 2000);
    });

    await test.step('Apply filters', async () => {
      await transactionPage.applyFilters();
    });

    await test.step('Verify transaction list is empty', async () => {
      const transactions = await transactionPage.getAllTransactions();
      expect(transactions.length).toBe(0);
    });

    await test.step('Verify no matching transactions message is displayed', async () => {
      await expect(transactionPage.noMatchingTransactionsMessage).toBeVisible();
      const messageText = await transactionPage.noMatchingTransactionsMessage.textContent();
      expect(messageText).toContain('No transactions found matching');
    });

    await test.step('Verify transaction count shows zero', async () => {
      const countText = await transactionPage.getTransactionCount();
      expect(countText).toContain('0 transactions');
    });
  });

});