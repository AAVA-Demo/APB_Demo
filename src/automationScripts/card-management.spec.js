const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/card-management.page');

// Test Cases for QE-8298 (Card-wise Spend Analysis Dashboard)
test.describe('QE-8298: Card-wise Spend Analysis Dashboard', () => {
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    await cardManagementPage.navigate();
  });

  test('QE-8298 TS-001 TC-001: Verify card-wise spend analysis displays detailed spending breakdown, monthly trends, and card details for a selected card', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*cards/);
    
    // Step 2: Navigate to My Cards section
    await cardManagementPage.waitForCardListLoad();
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(3);
    
    // Step 3: Select specific credit card from portfolio
    await cardManagementPage.selectCard('card001');
    
    // Step 4: Access card-wise spend analysis view
    await cardManagementPage.viewSpendAnalysis();
    const cardDetails = await cardManagementPage.getCardDetails();
    expect(cardDetails.limit).toBe('50,000');
    expect(cardDetails.available).toBe('35,000');
    expect(cardDetails.outstanding).toBe('15,000');
    
    // Step 5: Verify spending breakdown by category
    const categoryBreakdown = await cardManagementPage.getCategoryBreakdown();
    expect(categoryBreakdown['Food & Dining']).toBe('3,500');
    expect(categoryBreakdown['Fuel']).toBe('2,000');
    expect(categoryBreakdown['Shopping']).toBe('4,200');
    expect(categoryBreakdown['Entertainment']).toBe('800');
    expect(categoryBreakdown['Healthcare']).toBe('1,200');
    expect(categoryBreakdown['Utilities']).toBe('1,500');
    
    // Step 6: Verify monthly spend trends for last 4 months
    const monthlyTrends = await cardManagementPage.getMonthlyTrends();
    expect(monthlyTrends['Oct']).toBe('10,000');
    expect(monthlyTrends['Nov']).toBe('11,500');
    expect(monthlyTrends['Dec']).toBe('13,000');
    expect(monthlyTrends['Jan']).toBe('12,000');
  });

  test('QE-8298 TS-002 TC-001: Verify spend analysis view for a newly added card with zero transaction history displays card details with empty state message', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*cards/);
    
    // Step 2: Navigate to My Cards section
    await cardManagementPage.waitForCardListLoad();
    
    // Step 3: Select newly added card with zero transactions
    await cardManagementPage.selectCard('card004');
    
    // Step 4: Access card-wise spend analysis view
    await cardManagementPage.viewSpendAnalysis();
    const cardDetails = await cardManagementPage.getCardDetails();
    expect(cardDetails.limit).toBe('30,000');
    expect(cardDetails.available).toBe('30,000');
    expect(cardDetails.outstanding).toBe('0');
    
    // Step 5: Verify spending breakdown displays empty state
    const emptyStateMessage = await cardManagementPage.getEmptyStateMessage('breakdown');
    expect(emptyStateMessage).toContain('No transaction data available yet');
    expect(emptyStateMessage).toContain('Start using your card to see spending breakdown');
    
    // Step 6: Verify monthly trends displays empty state
    const trendsEmptyState = await cardManagementPage.getEmptyStateMessage('trends');
    expect(trendsEmptyState).toContain('No monthly trend data available');
    expect(trendsEmptyState).toContain('Transaction history will appear after your first billing cycle');
  });

  test('QE-8298 TS-003 TC-001: Verify multi-card spend comparison displays distinct spending patterns without data mixing when switching between cards', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*cards/);
    
    // Step 2: Navigate to My Cards section
    await cardManagementPage.waitForCardListLoad();
    
    // Step 3: Select first card and view spend analysis
    await cardManagementPage.selectCard('card001');
    await cardManagementPage.viewSpendAnalysis();
    const card001Breakdown = await cardManagementPage.getCategoryBreakdown();
    const card001Trends = await cardManagementPage.getMonthlyTrends();
    expect(card001Breakdown['Food & Dining']).toBe('3,500');
    expect(card001Trends['Jan']).toBe('12,000');
    
    // Step 4: Switch to second credit card
    const startTime = Date.now();
    await cardManagementPage.selectCard('card002');
    const switchTime = Date.now() - startTime;
    expect(switchTime).toBeLessThan(500);
    
    // Step 5: Verify spend analysis for card002 shows different pattern
    await cardManagementPage.viewSpendAnalysis();
    const card002Breakdown = await cardManagementPage.getCategoryBreakdown();
    const card002Trends = await cardManagementPage.getMonthlyTrends();
    expect(card002Breakdown['Shopping']).toBe('3,500');
    expect(card002Breakdown['Entertainment']).toBe('800');
    expect(card002Trends['Jan']).toBe('8,500');
    
    // Step 6: Switch back to first card and verify data consistency
    await cardManagementPage.selectCard('card001');
    await cardManagementPage.viewSpendAnalysis();
    const card001VerifyBreakdown = await cardManagementPage.getCategoryBreakdown();
    const card001VerifyTrends = await cardManagementPage.getMonthlyTrends();
    expect(card001VerifyBreakdown).toEqual(card001Breakdown);
    expect(card001VerifyTrends).toEqual(card001Trends);
  });
});

// Test Cases for QE-8294 (Unified Multi-Card Display Interface)
test.describe('QE-8294: Unified Multi-Card Display Interface', () => {
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    await cardManagementPage.navigate();
  });

  test('QE-8294 TS-001 TC-001: Verify fast card switching displays complete card details within 500ms response time', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*cards/);
    
    // Step 2: Navigate to My Cards section
    await cardManagementPage.waitForCardListLoad();
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);
    
    // Step 3: Note current card displayed
    const initialCard = await cardManagementPage.getCurrentCardDetails();
    expect(initialCard.issuer).toBe('HDFC Bank');
    expect(initialCard.cardNumber).toContain('****1234');
    
    // Step 4: Select different card and start timer
    const startTime = Date.now();
    await cardManagementPage.selectCard('card003');
    const responseTime = Date.now() - startTime;
    
    // Step 5: Verify card details displayed within 500ms without page reload
    expect(responseTime).toBeLessThan(500);
    const card003Details = await cardManagementPage.getCurrentCardDetails();
    expect(card003Details.issuer).toBe('SBI Card');
    expect(card003Details.cardNumber).toContain('****9012');
    expect(card003Details.cardType).toBe('Visa Signature');
    expect(card003Details.limit).toBe('20,000');
    expect(card003Details.available).toBe('15,000');
    expect(card003Details.outstanding).toBe('5,000');
    
    // Step 6: Verify all card details are complete
    await expect(cardManagementPage.cardNumberField).toBeVisible();
    await expect(cardManagementPage.issuerField).toBeVisible();
    await expect(cardManagementPage.cardTypeField).toBeVisible();
    await expect(cardManagementPage.creditLimitField).toBeVisible();
    await expect(cardManagementPage.availableCreditField).toBeVisible();
    await expect(cardManagementPage.outstandingBalanceField).toBeVisible();
  });

  test('QE-8294 TS-002 TC-001: Verify single card interface disables card switching functionality when user has only 1 registered card', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*cards/);
    
    // Step 2: Simulate user with only 1 card
    await cardManagementPage.setupSingleCard('card001');
    
    // Step 3: Navigate to My Cards section
    await cardManagementPage.waitForCardListLoad();
    
    // Step 4: Verify single card information is displayed
    const cardDetails = await cardManagementPage.getCurrentCardDetails();
    expect(cardDetails.issuer).toBe('HDFC Bank');
    expect(cardDetails.cardNumber).toContain('****1234');
    expect(cardDetails.limit).toBe('50,000');
    
    // Step 5: Verify card switching functionality is disabled or hidden
    const switcherState = await cardManagementPage.getCardSwitcherState();
    expect(switcherState.isDisabled || switcherState.isHidden).toBe(true);
    const switcherMessage = await cardManagementPage.getCardSwitcherMessage();
    expect(switcherMessage).toContain('Add more cards to enable card switching');
    
    // Step 6: Verify no card selection options available
    const selectionOptionsCount = await cardManagementPage.getCardSelectionOptionsCount();
    expect(selectionOptionsCount).toBe(0);
  });

  test('QE-8294 TS-003 TC-001: Verify system prevents selection of deactivated card and displays error message with automatic card list refresh', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*cards/);
    
    // Step 2: Navigate to My Cards with 3 active cards
    await cardManagementPage.waitForCardListLoad();
    let cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(3);
    
    // Step 3: Simulate card002 being deactivated in background
    await cardManagementPage.simulateCardDeactivation('card002');
    
    // Step 4: Attempt to switch to card002
    await cardManagementPage.selectCard('card002');
    
    // Step 5: Verify system prevents selection and displays error
    const errorMessage = await cardManagementPage.getErrorMessage();
    expect(errorMessage).toContain('This card is no longer available');
    expect(errorMessage).toContain('deactivated or removed from your profile');
    
    // Step 6: Verify card list automatically refreshes
    await cardManagementPage.waitForCardListRefresh();
    cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(2);
    const cardList = await cardManagementPage.getCardList();
    expect(cardList).toContain('card001');
    expect(cardList).toContain('card003');
    expect(cardList).not.toContain('card002');
  });
});