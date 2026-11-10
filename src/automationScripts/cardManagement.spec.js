const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');

test.describe('Card Management - Card Details and Portfolio', () => {
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    await cardManagementPage.navigate();
  });

  test('QE-10382 TS001 TC-001: Verify card-specific detail page displays comprehensive spending analysis', async ({ page }) => {
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.selectCardByNumber('1234');
    
    await expect(cardManagementPage.monthlySpendValue).toHaveText('$1,200');
    await expect(cardManagementPage.currentBalanceValue).toHaveText('$3,500');
    await expect(cardManagementPage.creditLimitValue).toHaveText('$10,000');
    await expect(cardManagementPage.availableCreditValue).toHaveText('$6,500');
    await expect(cardManagementPage.recentTransactionsTable).toBeVisible();
  });

  test('QE-10382 TS002 TC-001: Verify recent transactions table displays 10 most recent transactions', async ({ page }) => {
    await cardManagementPage.navigateToCardDetailPage('card-1');
    
    await expect(cardManagementPage.recentTransactionsTable).toBeVisible();
    const transactionRows = await cardManagementPage.getTransactionRows();
    expect(transactionRows.length).toBeLessThanOrEqual(10);
    
    for (const row of transactionRows) {
      await expect(row.date).toBeVisible();
      await expect(row.merchant).toBeVisible();
      await expect(row.category).toBeVisible();
      await expect(row.amount).toBeVisible();
    }
    
    const isSortedDescending = await cardManagementPage.verifyTransactionsSortedByDateDescending();
    expect(isSortedDescending).toBe(true);
    
    const allBelongToCard = await cardManagementPage.verifyAllTransactionsBelongToCard('card-1');
    expect(allBelongToCard).toBe(true);
  });

  test('QE-10382 TS003 TC-001: Verify system handles non-existent card ID with error message', async ({ page }) => {
    await cardManagementPage.navigateToCardDetailPage('invalid-card-999');
    
    await expect(cardManagementPage.errorMessage).toBeVisible();
    await expect(cardManagementPage.errorMessage).toHaveText('Card not found');
    
    await cardManagementPage.waitForRedirect();
    await expect(page).toHaveURL(/\/cards$/);
    
    await expect(cardManagementPage.cardPortfolioContainer).toBeVisible();
  });

  test('QE-10380 TS001 TC-001: Verify consolidated list displays all credit cards with complete details', async ({ page }) => {
    await cardManagementPage.navigateToCardManagement();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);
    
    const cards = await cardManagementPage.getAllCardElements();
    for (const card of cards) {
      await expect(card.cardType).toBeVisible();
      await expect(card.maskedNumber).toBeVisible();
      await expect(card.currentBalance).toBeVisible();
      await expect(card.availableCredit).toBeVisible();
      await expect(card.creditLimit).toBeVisible();
      
      const maskedNumberText = await card.maskedNumber.textContent();
      expect(maskedNumberText).toMatch(/\*{4}\s\*{4}\s\*{4}\s\d{4}/);
    }
    
    await cardManagementPage.verifyResponsiveLayout('desktop');
  });

  test('QE-10380 TS002 TC-001: Verify interactive card selection with hover effect and navigation', async ({ page }) => {
    await cardManagementPage.navigateToCardManagement();
    
    const firstCard = await cardManagementPage.getFirstCardElement();
    await firstCard.hover();
    
    await cardManagementPage.waitForHoverEffect(firstCard);
    
    await firstCard.click();
    await page.waitForURL(/\/cards\/card-1/);
    
    await expect(cardManagementPage.cardDetailContainer).toBeVisible();
    await expect(cardManagementPage.monthlySpendValue).toBeVisible();
  });

  test('QE-10380 TS003 TC-001: Verify empty state message when user has no credit cards', async ({ page }) => {
    await cardManagementPage.setUserWithNoCards();
    await cardManagementPage.navigateToCardManagement();
    
    await expect(cardManagementPage.emptyStateContainer).toBeVisible();
    await expect(cardManagementPage.emptyStateMessage).toHaveText('No credit cards found. Please add a card to get started.');
    
    const cardListVisible = await cardManagementPage.cardListContainer.isVisible().catch(() => false);
    expect(cardListVisible).toBe(false);
  });
});
