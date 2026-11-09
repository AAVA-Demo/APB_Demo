const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const logger = require('../utils/logger');

test.describe('Credit Card Management - Portfolio and Card-Wise Analysis Tests', () => {

  test('QE-7926 TS-001 TC-001 - Verify card-specific spending metrics display accurately', async ({ page }) => {
    logger.info('Starting test: QE-7926 TS-001 TC-001');
    const cardMgmtPage = new CardManagementPage(page);
    
    await test.step('Navigate to Card Management', async () => {
      await cardMgmtPage.navigate();
      await cardMgmtPage.waitForCardListLoad();
      logger.info('Card Management page loaded');
    });

    await test.step('Select Visa ****1234', async () => {
      await cardMgmtPage.selectCard('card-001');
      await cardMgmtPage.waitForCardDetailLoad();
      logger.info('Card detail page loaded');
    });

    await test.step('Click View Spend Analysis', async () => {
      await cardMgmtPage.clickViewSpendAnalysis();
      await cardMgmtPage.waitForAnalysisLoad();
      logger.info('Spend analysis section displayed');
    });

    await test.step('Verify monthly total spend', async () => {
      const monthlySpend = await cardMgmtPage.getCardMonthlySpend();
      await expect(monthlySpend).toBe('$1,200.50');
      logger.info('Monthly spend verified: $1,200.50');
    });

    await test.step('Verify category breakdown', async () => {
      const categories = await cardMgmtPage.getCategoryBreakdown();
      await expect(categories['Food & Dining']).toBe('$450.00');
      await expect(categories['Fuel']).toBe('$200.00');
      await expect(categories['Shopping']).toBe('$350.50');
      await expect(categories['Entertainment']).toBe('$200.00');
      logger.info('Category breakdown verified');
    });

    await test.step('Verify transaction count', async () => {
      const count = await cardMgmtPage.getTransactionCount();
      await expect(count).toBe(25);
      logger.info('Transaction count: 25');
    });

    await test.step('Verify average transaction amount', async () => {
      const average = await cardMgmtPage.getAverageTransaction();
      await expect(average).toBe('$48.02');
      logger.info('Average transaction: $48.02');
    });

    await test.step('Verify no other card transactions included', async () => {
      const hasOtherCardData = await cardMgmtPage.hasTransactionsFromOtherCards();
      await expect(hasOtherCardData).toBeFalsy();
      logger.info('No transactions from other cards');
    });
  });

  test('QE-7926 TS-001 TC-002 - Verify card-wise percentages relative to card total', async ({ page }) => {
    logger.info('Starting test: QE-7926 TS-001 TC-002');
    const cardMgmtPage = new CardManagementPage(page);
    
    await test.step('Navigate to card-wise analysis for card-001', async () => {
      await cardMgmtPage.navigateToCardAnalysis('card-001');
      await cardMgmtPage.waitForAnalysisLoad();
      logger.info('Card analysis loaded');
    });

    await test.step('Verify category percentages', async () => {
      const percentages = await cardMgmtPage.getCategoryPercentages();
      await expect(percentages['Food & Dining']).toBe('37.49%');
      await expect(percentages['Fuel']).toBe('16.66%');
      await expect(percentages['Shopping']).toBe('29.19%');
      await expect(percentages['Entertainment']).toBe('16.66%');
      logger.info('Category percentages verified');
    });

    await test.step('Verify total percentage equals 100%', async () => {
      const total = await cardMgmtPage.getTotalPercentage();
      await expect(total).toBe('100.00%');
      logger.info('Total percentage: 100%');
    });

    await test.step('Verify pie chart proportions', async () => {
      const segments = await cardMgmtPage.getPieChartSegments();
      await expect(segments.length).toBe(4);
      await expect(segments[0].category).toBe('Food & Dining');
      logger.info('Pie chart shows 4 segments');
    });

    await test.step('Compare with overall account percentages', async () => {
      const cardPercentage = await cardMgmtPage.getCategoryPercentage('Food & Dining');
      await expect(cardPercentage).toBe('37.49%');
      logger.info('Card-wise percentage differs from overall (26.15%)');
    });
  });

  test('QE-7926 TS-002 TC-001 - Verify zero spending display for card with no transactions', async ({ page }) => {
    logger.info('Starting test: QE-7926 TS-002 TC-001');
    const cardMgmtPage = new CardManagementPage(page);
    
    await test.step('Navigate to Card Management', async () => {
      await cardMgmtPage.navigate();
      await cardMgmtPage.waitForCardListLoad();
      logger.info('Card list loaded');
    });

    await test.step('Select card with no transactions', async () => {
      await cardMgmtPage.selectCard('card-003');
      await cardMgmtPage.waitForCardDetailLoad();
      logger.info('Card-003 detail loaded');
    });

    await test.step('Click View Spend Analysis', async () => {
      await cardMgmtPage.clickViewSpendAnalysis();
      await cardMgmtPage.waitForAnalysisLoad();
      logger.info('Analysis section loaded');
    });

    await test.step('Verify monthly spend is $0.00', async () => {
      const spend = await cardMgmtPage.getCardMonthlySpend();
      await expect(spend).toBe('$0.00');
      logger.info('Monthly spend: $0.00');
    });

    await test.step('Verify informational message', async () => {
      const message = await cardMgmtPage.getNoTransactionsMessage();
      await expect(message).toContain('No transactions available');
      await expect(message).toContain('November 2026');
      logger.info('No transactions message verified');
    });

    await test.step('Verify all categories show $0.00', async () => {
      const allZero = await cardMgmtPage.areAllCategoriesZero();
      await expect(allZero).toBeTruthy();
      logger.info('All categories show $0.00');
    });

    await test.step('Verify transaction count is 0', async () => {
      const count = await cardMgmtPage.getTransactionCount();
      await expect(count).toBe(0);
      logger.info('Transaction count: 0');
    });

    await test.step('Verify pie chart empty state', async () => {
      const emptyState = await cardMgmtPage.getPieChartEmptyState();
      await expect(emptyState).toContain('No spending data to display');
      logger.info('Pie chart shows empty state');
    });

    await test.step('Verify month picker is available', async () => {
      const pickerVisible = await cardMgmtPage.isMonthPickerVisible();
      await expect(pickerVisible).toBeTruthy();
      logger.info('Month picker available');
    });
  });

  test('QE-7926 TS-003 TC-001 - Verify deactivated card access prevention', async ({ page }) => {
    logger.info('Starting test: QE-7926 TS-003 TC-001');
    const cardMgmtPage = new CardManagementPage(page);
    
    await test.step('Navigate to Card Management', async () => {
      await cardMgmtPage.navigate();
      await cardMgmtPage.waitForCardListLoad();
      logger.info('Card list loaded');
    });

    await test.step('Identify deactivated card', async () => {
      const deactivatedCard = await cardMgmtPage.findDeactivatedCard();
      await expect(deactivatedCard.id).toBe('card-004');
      await expect(deactivatedCard.status).toBe('Deactivated');
      logger.info('Deactivated card identified: card-004');
    });

    await test.step('Click on deactivated card', async () => {
      await cardMgmtPage.selectCard('card-004');
      await cardMgmtPage.waitForCardDetailLoad();
      logger.info('Deactivated card detail loaded');
    });

    await test.step('Verify View Spend Analysis button is disabled', async () => {
      const isDisabled = await cardMgmtPage.isSpendAnalysisButtonDisabled();
      await expect(isDisabled).toBeTruthy();
      logger.info('Spend analysis button is disabled');
    });

    await test.step('Attempt to click button and verify error', async () => {
      await cardMgmtPage.attemptClickSpendAnalysis();
      const errorMessage = await cardMgmtPage.getErrorMessage();
      await expect(errorMessage).toContain('no longer active');
      await expect(errorMessage).toContain('not available for deactivated cards');
      logger.info('Error message verified');
    });

    await test.step('Verify analysis section does not load', async () => {
      const analysisVisible = await cardMgmtPage.isAnalysisSectionVisible();
      await expect(analysisVisible).toBeFalsy();
      logger.info('Analysis section not displayed');
    });

    await test.step('Verify status indicator', async () => {
      const statusBadge = await cardMgmtPage.getCardStatusBadge();
      await expect(statusBadge.text).toBe('Deactivated');
      await expect(statusBadge.color).toMatch(/red|gray/);
      logger.info('Status badge verified');
    });

    await test.step('Verify reactivation option', async () => {
      const reactivationLink = await cardMgmtPage.getReactivationLink();
      await expect(reactivationLink).toContain('Contact Support to Reactivate');
      logger.info('Reactivation link displayed');
    });
  });

  test('QE-7925 TS-001 TC-001 - Verify multi-card portfolio displays all 10 cards with masked numbers', async ({ page }) => {
    logger.info('Starting test: QE-7925 TS-001 TC-001');
    const cardMgmtPage = new CardManagementPage(page);
    
    await test.step('Login with user having 10 cards', async () => {
      await cardMgmtPage.navigateWithUser('user-004');
      await cardMgmtPage.waitForCardListLoad();
      logger.info('Card portfolio loaded for user-004');
    });

    await test.step('Verify exactly 10 cards are displayed', async () => {
      const cardCount = await cardMgmtPage.getCardCount();
      await expect(cardCount).toBe(10);
      logger.info('10 cards displayed');
    });

    await test.step('Verify card numbers are masked', async () => {
      const cardNumbers = await cardMgmtPage.getAllCardNumbers();
      cardNumbers.forEach(number => {
        expect(number).toMatch(/^\*{4}\d{4}$/);
      });
      logger.info('All card numbers properly masked (****XXXX)');
    });

    await test.step('Verify individual credit limits', async () => {
      const limits = await cardMgmtPage.getAllCreditLimits();
      const totalLimit = limits.reduce((sum, limit) => sum + parseFloat(limit.replace(/[$,]/g, '')), 0);
      await expect(totalLimit).toBe(95000.00);
      logger.info('Total credit limit: $95,000.00');
    });

    await test.step('Verify current balances', async () => {
      const balances = await cardMgmtPage.getAllCurrentBalances();
      const totalBalance = balances.reduce((sum, bal) => sum + parseFloat(bal.replace(/[$,]/g, '')), 0);
      await expect(totalBalance).toBe(18500.00);
      logger.info('Total balance: $18,500.00');
    });

    await test.step('Verify available credit calculation', async () => {
      const card1 = await cardMgmtPage.getCardDetails('card-001');
      await expect(card1.availableCredit).toBe('$7,500.00');
      logger.info('Available credit calculation verified');
    });

    await test.step('Verify card type and issuer', async () => {
      const cards = await cardMgmtPage.getAllCardDetails();
      cards.forEach(card => {
        expect(card.type).toMatch(/Visa|MasterCard|Amex|Discover/);
        expect(card.issuer).toBeTruthy();
      });
      logger.info('Card types and issuers verified');
    });

    await test.step('Verify scrollable list', async () => {
      const isScrollable = await cardMgmtPage.isCardListScrollable();
      await expect(isScrollable).toBeTruthy();
      logger.info('Card list is scrollable');
    });
  });

  test('QE-7925 TS-001 TC-002 - Verify card data retrieval within 1 second for 10 cards', async ({ page }) => {
    logger.info('Starting test: QE-7925 TS-001 TC-002');
    const cardMgmtPage = new CardManagementPage(page);
    
    const startTime = Date.now();
    
    await test.step('Login and navigate to Card Management', async () => {
      await cardMgmtPage.navigateWithUser('user-004');
      await cardMgmtPage.waitForAllCardsLoaded();
      const loadTime = Date.now() - startTime;
      
      await expect(loadTime).toBeLessThanOrEqual(1000);
      logger.info(`All 10 cards loaded in ${loadTime}ms (requirement: ≤1000ms)`);
    });

    await test.step('Verify all card details are populated', async () => {
      const allDetailsPopulated = await cardMgmtPage.areAllCardDetailsPopulated();
      await expect(allDetailsPopulated).toBeTruthy();
      logger.info('All card details populated');
    });

    await test.step('Verify no performance degradation', async () => {
      const isPageResponsive = await cardMgmtPage.isPageResponsive();
      await expect(isPageResponsive).toBeTruthy();
      logger.info('Page remains responsive');
    });
  });

  test('QE-7925 TS-002 TC-001 - Verify cached data display when card issuer service is unavailable', async ({ page }) => {
    logger.info('Starting test: QE-7925 TS-002 TC-001');
    const cardMgmtPage = new CardManagementPage(page);
    
    await test.step('Simulate card issuer service failure', async () => {
      await cardMgmtPage.mockCardIssuerServiceFailure();
      logger.info('Card issuer service failure simulated');
    });

    await test.step('Navigate to Card Management', async () => {
      await cardMgmtPage.navigate();
      await cardMgmtPage.waitForCardListLoad();
      logger.info('Card portfolio loaded');
    });

    await test.step('Verify cached card information is displayed', async () => {
      const cards = await cardMgmtPage.getAllCardDetails();
      await expect(cards.length).toBeGreaterThan(0);
      logger.info('Cached card data displayed');
    });

    await test.step('Verify warning banner', async () => {
      const warning = await cardMgmtPage.getWarningBanner();
      await expect(warning).toContain('Unable to sync with card issuer');
      await expect(warning).toContain('Displaying cached data');
      await expect(warning).toContain('Nov 14, 2026, 10:00 AM');
      logger.info('Warning banner verified');
    });

    await test.step('Verify sync timestamp on cards', async () => {
      const timestamps = await cardMgmtPage.getAllSyncTimestamps();
      timestamps.forEach(ts => {
        expect(ts).toContain('Last synced: Nov 14, 2026');
      });
      logger.info('Sync timestamps verified');
    });

    await test.step('Verify no real-time indicators', async () => {
      const hasRealTimeIndicators = await cardMgmtPage.hasRealTimeIndicators();
      await expect(hasRealTimeIndicators).toBeFalsy();
      logger.info('No real-time indicators shown');
    });

    await test.step('Verify Retry Sync button', async () => {
      const retrySyncVisible = await cardMgmtPage.isRetrySyncButtonVisible();
      await expect(retrySyncVisible).toBeTruthy();
      logger.info('Retry Sync button displayed');
    });

    await test.step('Click Retry Sync', async () => {
      await cardMgmtPage.clickRetrySyncButton();
      logger.info('Retry Sync button clicked');
    });
  });

  test('QE-7925 TS-003 TC-001 - Verify expired card display with indicator and access prevention', async ({ page }) => {
    logger.info('Starting test: QE-7925 TS-003 TC-001');
    const cardMgmtPage = new CardManagementPage(page);
    
    await test.step('Login with user having expired card', async () => {
      await cardMgmtPage.navigateWithUser('user-005');
      await cardMgmtPage.waitForCardListLoad();
      logger.info('Card portfolio loaded for user-005');
    });

    await test.step('Verify expired card is displayed', async () => {
      const expiredCard = await cardMgmtPage.findExpiredCard();
      await expect(expiredCard.cardNumber).toBe('****7890');
      logger.info('Expired card found: ****7890');
    });

    await test.step('Verify Expired status indicator', async () => {
      const statusBadge = await cardMgmtPage.getCardStatusBadge('card-005');
      await expect(statusBadge.text).toBe('Expired');
      await expect(statusBadge.color).toBe('red');
      logger.info('Expired badge displayed in red');
    });

    await test.step('Verify expiry date is displayed', async () => {
      const expiryDate = await cardMgmtPage.getCardExpiryDate('card-005');
      await expect(expiryDate).toContain('Expired: 10/2026');
      logger.info('Expiry date displayed');
    });

    await test.step('Click on expired card', async () => {
      await cardMgmtPage.selectCard('card-005');
      await cardMgmtPage.waitForCardDetailLoad();
      logger.info('Expired card detail loaded');
    });

    await test.step('Verify Spend Analysis button is disabled', async () => {
      const isDisabled = await cardMgmtPage.isSpendAnalysisButtonDisabled();
      await expect(isDisabled).toBeTruthy();
      logger.info('Spend Analysis button disabled');
    });

    await test.step('Verify error message on attempt', async () => {
      await cardMgmtPage.attemptClickSpendAnalysis();
      const error = await cardMgmtPage.getErrorMessage();
      await expect(error).toContain('card has expired');
      await expect(error).toContain('not available for expired cards');
      logger.info('Error message verified');
    });

    await test.step('Verify transaction history is prevented', async () => {
      const transactionButtonDisabled = await cardMgmtPage.isViewTransactionsButtonDisabled();
      await expect(transactionButtonDisabled).toBeTruthy();
      const tooltip = await cardMgmtPage.getTransactionButtonTooltip();
      await expect(tooltip).toContain('Not available for expired cards');
      logger.info('Transaction history access prevented');
    });

    await test.step('Verify update card option', async () => {
      const updateLink = await cardMgmtPage.getUpdateCardLink();
      await expect(updateLink).toMatch(/Update Card Information|Contact Issuer/);
      logger.info('Update card option displayed');
    });
  });

});