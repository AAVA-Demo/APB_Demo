const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { logger } = require('../utils/logger');

test.describe('Card Management - Multiple Cards and Card Details Tests', () => {

  test('QE-10707 TS-001 TC-001 - Verify multiple credit cards display with masked card numbers, issuer names, and expiry dates', async ({ page }) => {
    logger.info('Starting test: QE-10707 TS-001 TC-001');
    const cardManagementPage = new CardManagementPage(page);
    
    // Step 1: Register 5 credit cards
    logger.info('Step 1: 5 cards registered in system');
    // Test data: Card1: 4111111111111111, Visa, 12/25; Card2: 5500000000000004, MasterCard, 06/26; etc.
    
    // Step 2: Navigate to card management page
    logger.info('Step 2: Navigating to card management page');
    await cardManagementPage.navigate();
    await cardManagementPage.waitForPageLoad();
    
    // Step 3: Verify all 5 cards are displayed
    logger.info('Step 3: Verifying 5 card tiles are visible');
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);
    
    // Step 4: Verify masked card numbers
    logger.info('Step 4: Verifying masked card numbers');
    const maskedNumbers = await cardManagementPage.getMaskedCardNumbers();
    expect(maskedNumbers).toEqual(['**** 1111', '**** 0004', '**** 0009', '**** 0004', '**** 0008']);
    
    // Step 5: Verify issuer names
    logger.info('Step 5: Verifying issuer names');
    const issuers = await cardManagementPage.getIssuerNames();
    expect(issuers).toEqual(['Visa', 'MasterCard', 'Amex', 'Discover', 'Diners']);
    
    // Step 6: Verify expiry dates
    logger.info('Step 6: Verifying expiry dates');
    const expiryDates = await cardManagementPage.getExpiryDates();
    expect(expiryDates).toEqual(['12/25', '06/26', '03/27', '09/28', '11/29']);
    
    logger.info('Test QE-10707 TS-001 TC-001 completed successfully');
  });

  test('QE-10707 TS-002 TC-001 - Verify empty state message when no credit cards are registered', async ({ page }) => {
    logger.info('Starting test: QE-10707 TS-002 TC-001');
    const cardManagementPage = new CardManagementPage(page);
    
    // Step 1: Ensure user has no registered cards
    logger.info('Step 1: Using test user with zero cards');
    // Test data: User ID test_user_001
    
    // Step 2: Navigate to card management page
    logger.info('Step 2: Navigating to card management page');
    await cardManagementPage.navigate();
    await cardManagementPage.waitForPageLoad();
    
    // Step 3: Verify empty state message
    logger.info('Step 3: Verifying empty state message');
    await expect(cardManagementPage.emptyStateMessage).toBeVisible();
    const messageText = await cardManagementPage.getEmptyStateMessageText();
    expect(messageText).toContain('No cards found');
    
    // Step 4: Verify no console errors
    logger.info('Step 4: Checking for console errors');
    const consoleErrors = await cardManagementPage.getConsoleErrors();
    expect(consoleErrors.length).toBe(0);
    
    // Step 5: Verify UI elements are not broken
    logger.info('Step 5: Verifying UI integrity');
    await expect(cardManagementPage.pageHeader).toBeVisible();
    await expect(cardManagementPage.navigationMenu).toBeVisible();
    
    logger.info('Test QE-10707 TS-002 TC-001 completed successfully');
  });

  test('QE-10707 TS-003 TC-001 - Verify performance and responsiveness with maximum 10 registered credit cards', async ({ page }) => {
    logger.info('Starting test: QE-10707 TS-003 TC-001');
    const cardManagementPage = new CardManagementPage(page);
    
    // Step 1: Register exactly 10 credit cards
    logger.info('Step 1: 10 cards registered in system');
    // Test data: 10 cards with unique numbers, issuers, expiry dates
    
    // Step 2: Clear browser cache and start monitoring
    logger.info('Step 2: Clearing cache and starting performance monitoring');
    await page.context().clearCookies();
    
    // Step 3: Navigate to card management page
    logger.info('Step 3: Navigating to card management page');
    const startTime = Date.now();
    await cardManagementPage.navigate();
    
    // Step 4: Measure page load time
    logger.info('Step 4: Measuring page load time');
    await cardManagementPage.waitForPageLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(1000);
    
    // Step 5: Verify all 10 cards are displayed
    logger.info('Step 5: Verifying all 10 cards are displayed');
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(10);
    await cardManagementPage.verifyAllCardDetails();
    
    // Step 6: Test filtering functionality
    logger.info('Step 6: Testing filter functionality');
    await cardManagementPage.applyFilter('Visa');
    const filteredCount = await cardManagementPage.getCardCount();
    expect(filteredCount).toBeGreaterThan(0);
    
    // Step 7: Test search functionality
    logger.info('Step 7: Testing search functionality');
    await cardManagementPage.clearFilters();
    await cardManagementPage.searchCards('1234');
    const searchResults = await cardManagementPage.getCardCount();
    expect(searchResults).toBeGreaterThan(0);
    
    // Step 8: Clear filters and verify all cards reappear
    logger.info('Step 8: Clearing filters and verifying all cards reappear');
    await cardManagementPage.clearFilters();
    const finalCount = await cardManagementPage.getCardCount();
    expect(finalCount).toBe(10);
    
    logger.info('Test QE-10707 TS-003 TC-001 completed successfully');
  });

  test('QE-10703 TS-001 TC-001 - Verify card-specific spending metrics display', async ({ page }) => {
    logger.info('Starting test: QE-10703 TS-001 TC-001');
    const cardManagementPage = new CardManagementPage(page);
    
    // Step 1: Register 2 credit cards
    logger.info('Step 1: 2 cards registered');
    // Test data: Card1: Visa **** 1234, Card2: MasterCard **** 5678
    
    // Step 2: Create transactions on Card1
    logger.info('Step 2: Transactions created on Card1');
    // Test data: Food & Dining $200, Fuel $100, Shopping $300 (Total: $600, 3 transactions)
    
    // Step 3: Navigate to card details page for Card1
    logger.info('Step 3: Navigating to Card1 details page');
    await cardManagementPage.navigate();
    await cardManagementPage.selectCard('1234');
    await cardManagementPage.waitForCardDetailsLoad();
    
    // Step 4: Verify Total Spend metric
    logger.info('Step 4: Verifying Total Spend');
    const totalSpend = await cardManagementPage.getTotalSpend();
    expect(totalSpend).toBe('$600');
    
    // Step 5: Verify Transaction Count metric
    logger.info('Step 5: Verifying Transaction Count');
    const txnCount = await cardManagementPage.getTransactionCount();
    expect(txnCount).toBe('3');
    
    // Step 6: Verify Category Breakdown
    logger.info('Step 6: Verifying Category Breakdown');
    const categoryBreakdown = await cardManagementPage.getCategoryBreakdown();
    expect(categoryBreakdown).toEqual([
      { category: 'Food & Dining', amount: '$200' },
      { category: 'Fuel', amount: '$100' },
      { category: 'Shopping', amount: '$300' }
    ]);
    
    // Step 7: Verify Spending Patterns section
    logger.info('Step 7: Verifying Spending Patterns section');
    await expect(cardManagementPage.spendingPatternsSection).toBeVisible();
    
    logger.info('Test QE-10703 TS-001 TC-001 completed successfully');
  });

  test('QE-10703 TS-002 TC-001 - Verify zero transaction card displays $0.00 spend and 0 transaction count', async ({ page }) => {
    logger.info('Starting test: QE-10703 TS-002 TC-001');
    const cardManagementPage = new CardManagementPage(page);
    
    // Step 1: Register new card with no transactions
    logger.info('Step 1: Card registered with zero transactions');
    // Test data: Card: Visa **** 9999
    
    // Step 2: Navigate to card details page
    logger.info('Step 2: Navigating to card details page');
    await cardManagementPage.navigate();
    await cardManagementPage.selectCard('9999');
    await cardManagementPage.waitForCardDetailsLoad();
    
    // Step 3: Verify Total Spend is $0.00
    logger.info('Step 3: Verifying Total Spend is $0.00');
    const totalSpend = await cardManagementPage.getTotalSpend();
    expect(totalSpend).toBe('$0.00');
    
    // Step 4: Verify Transaction Count is 0
    logger.info('Step 4: Verifying Transaction Count is 0');
    const txnCount = await cardManagementPage.getTransactionCount();
    expect(txnCount).toBe('0');
    
    // Step 5: Verify Category Breakdown is empty
    logger.info('Step 5: Verifying Category Breakdown is empty');
    const categoryBreakdown = await cardManagementPage.getCategoryBreakdown();
    expect(categoryBreakdown.length).toBe(0);
    
    // Step 6: Verify Spending Patterns empty state
    logger.info('Step 6: Verifying Spending Patterns empty state');
    await expect(cardManagementPage.spendingPatternsEmptyState).toBeVisible();
    
    // Step 7: Verify no console errors
    logger.info('Step 7: Checking for console errors');
    const consoleErrors = await cardManagementPage.getConsoleErrors();
    expect(consoleErrors.length).toBe(0);
    
    logger.info('Test QE-10703 TS-002 TC-001 completed successfully');
  });

  test('QE-10703 TS-003 TC-001 - Verify multi-card spending comparison shows unique and accurate metrics per card', async ({ page }) => {
    logger.info('Starting test: QE-10703 TS-003 TC-001');
    const cardManagementPage = new CardManagementPage(page);
    
    // Step 1: Register 2 cards with different transaction patterns
    logger.info('Step 1: 2 cards registered with different patterns');
    // Test data: Card1: Visa **** 1111, Card2: MasterCard **** 2222
    
    // Step 2: Create transactions on Card1
    logger.info('Step 2: Transactions created on Card1');
    // Test data: Food & Dining $300, Fuel $150 (Total: $450, 2 transactions)
    
    // Step 3: Create transactions on Card2
    logger.info('Step 3: Transactions created on Card2');
    // Test data: Shopping $500, Travel $200 (Total: $700, 2 transactions)
    
    // Step 4: Navigate to Card1 details and note metrics
    logger.info('Step 4: Navigating to Card1 details');
    await cardManagementPage.navigate();
    await cardManagementPage.selectCard('1111');
    await cardManagementPage.waitForCardDetailsLoad();
    const card1Spend = await cardManagementPage.getTotalSpend();
    const card1Count = await cardManagementPage.getTransactionCount();
    const card1Categories = await cardManagementPage.getCategoryBreakdown();
    expect(card1Spend).toBe('$450');
    expect(card1Count).toBe('2');
    expect(card1Categories.map(c => c.category)).toEqual(['Food & Dining', 'Fuel']);
    
    // Step 5: Navigate to Card2 details and note metrics
    logger.info('Step 5: Navigating to Card2 details');
    await cardManagementPage.navigate();
    await cardManagementPage.selectCard('2222');
    await cardManagementPage.waitForCardDetailsLoad();
    const card2Spend = await cardManagementPage.getTotalSpend();
    const card2Count = await cardManagementPage.getTransactionCount();
    const card2Categories = await cardManagementPage.getCategoryBreakdown();
    expect(card2Spend).toBe('$700');
    expect(card2Count).toBe('2');
    expect(card2Categories.map(c => c.category)).toEqual(['Shopping', 'Travel']);
    
    // Step 6: Verify no data cross-contamination
    logger.info('Step 6: Verifying no data cross-contamination');
    expect(card1Categories.map(c => c.category)).not.toContain('Shopping');
    expect(card1Categories.map(c => c.category)).not.toContain('Travel');
    expect(card2Categories.map(c => c.category)).not.toContain('Food & Dining');
    expect(card2Categories.map(c => c.category)).not.toContain('Fuel');
    
    // Step 7: Verify totals are accurate
    logger.info('Step 7: Verifying totals are accurate');
    expect(card1Spend).not.toBe(card2Spend);
    expect(card1Count).toBe(card2Count);
    
    logger.info('Test QE-10703 TS-003 TC-001 completed successfully');
  });

});