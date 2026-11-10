const { test, expect } = require('@playwright/test');
const { CardSpecificAnalysisPage } = require('./pages/cardSpecificAnalysis.page');
const { AuthHelper } = require('./helpers/auth.helper');
const { Logger } = require('./utils/logger');

test.describe('Card-Specific Analysis - Individual Card Spending', () => {
  let cardAnalysisPage;
  let authHelper;
  let logger;

  test.beforeEach(async ({ page }) => {
    cardAnalysisPage = new CardSpecificAnalysisPage(page);
    authHelper = new AuthHelper(page);
    logger = new Logger();
    await authHelper.authenticate();
  });

  test('QE-10385 TS-001 TC-001: Verify card-specific analysis displays detailed spending data', async ({ page }) => {
    logger.info('Test Case ID: QE-10385 TS-001 TC-001');
    const userId = 'user-card-analysis-001';
    const cardId = 'card-123';
    
    await authHelper.authenticateAsUser(userId);
    await cardAnalysisPage.navigateToCardDetails(cardId);
    
    const spendingData = await cardAnalysisPage.getCardSpendingData();
    expect(spendingData.monthlySpend).toBeGreaterThanOrEqual(0);
    expect(spendingData.utilizationPercentage).toBeGreaterThanOrEqual(0);
    expect(spendingData.transactionCount).toBeGreaterThanOrEqual(0);
    expect(spendingData.topCategory).toBeTruthy();
    logger.info(`Spending data: Monthly=$${spendingData.monthlySpend}, Utilization=${spendingData.utilizationPercentage}%, Count=${spendingData.transactionCount}, Top Category=${spendingData.topCategory}`);
    
    const transactionHistory = await cardAnalysisPage.getTransactionHistory();
    expect(transactionHistory.length).toBeGreaterThan(0);
    logger.info(`Retrieved ${transactionHistory.length} transactions`);
    
    // Verify no cross-card contamination
    for (const txn of transactionHistory) {
      expect(txn.cardId).toBe(cardId);
    }
    logger.info('All transactions belong to the selected card');
  });

  test('QE-10385 TS-001 TC-002: Verify utilization percentage calculation', async ({ page }) => {
    logger.info('Test Case ID: QE-10385 TS-001 TC-002');
    const userId = 'user-utilization-test-001';
    const cardId = 'card-456';
    
    await authHelper.authenticateAsUser(userId);
    await cardAnalysisPage.navigateToCardDetails(cardId);
    
    const cardDetails = await cardAnalysisPage.getCardDetails();
    const creditLimit = cardDetails.creditLimit;
    const outstandingBalance = cardDetails.outstandingBalance;
    logger.info(`Credit Limit: $${creditLimit}, Outstanding: $${outstandingBalance}`);
    
    const expectedUtilization = (outstandingBalance / creditLimit) * 100;
    logger.info(`Expected utilization: ${expectedUtilization.toFixed(2)}%`);
    
    const spendingData = await cardAnalysisPage.getCardSpendingData();
    const actualUtilization = spendingData.utilizationPercentage;
    logger.info(`Actual utilization: ${actualUtilization.toFixed(2)}%`);
    
    expect(Math.abs(actualUtilization - expectedUtilization)).toBeLessThanOrEqual(0.1);
    logger.info('Utilization percentage matches expected calculation');
  });

  test('QE-10385 TS-002 TC-001: Verify error message for deactivated card', async ({ page }) => {
    logger.info('Test Case ID: QE-10385 TS-002 TC-001');
    const userId = 'user-deactivated-card-001';
    const cardId = 'card-deactivated-789';
    
    await authHelper.authenticateAsUser(userId);
    
    const response = await cardAnalysisPage.attemptNavigateToCardDetails(cardId);
    expect([404, 403]).toContain(response.status);
    logger.info(`Received HTTP ${response.status} for deactivated card`);
    
    const errorMessage = await cardAnalysisPage.getErrorMessage();
    expect(errorMessage).toMatch(/Card is no longer available|Card is not accessible/);
    logger.info(`Error message: ${errorMessage}`);
    
    // Verify no sensitive data exposed
    const pageContent = await page.content();
    expect(pageContent).not.toMatch(/\d{16}/);
    expect(pageContent).not.toMatch(/CVV/);
    expect(pageContent).not.toMatch(/\d{2}\/\d{2}/);
    logger.info('No sensitive card information exposed in error response');
    
    // Verify no server crash
    const errors = await page.evaluate(() => window.errors || []);
    const hasServerError = errors.some(e => e.status === 500);
    expect(hasServerError).toBeFalsy();
    logger.info('No server-side crashes detected');
  });

  test('QE-10385 TS-003 TC-001: Verify zero transaction card displays default values', async ({ page }) => {
    logger.info('Test Case ID: QE-10385 TS-003 TC-001');
    const userId = 'user-zero-transactions-001';
    const cardId = 'card-new-001';
    
    await authHelper.authenticateAsUser(userId);
    await cardAnalysisPage.navigateToCardDetails(cardId);
    
    const spendingData = await cardAnalysisPage.getCardSpendingData();
    expect(spendingData.monthlySpend).toBe(0);
    expect(spendingData.utilizationPercentage).toBe(0);
    expect(spendingData.transactionCount).toBe(0);
    logger.info('All spending metrics are zero');
    
    await expect(cardAnalysisPage.noActivityMessage).toBeVisible();
    const messageText = await cardAnalysisPage.noActivityMessage.textContent();
    expect(messageText).toMatch(/No transaction activity|No spending data/);
    logger.info(`Message displayed: ${messageText}`);
    
    const errors = await page.evaluate(() => window.errors || []);
    expect(errors.length).toBe(0);
    logger.info('No errors occurred');
  });
});
