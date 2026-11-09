const { test, expect } = require('@playwright/test');
const { CardsPage } = require('./pages/cards.page');

test.describe('QE-8447 - Multiple Credit Card Display Tests', () => {
  let cardsPage;

  test.beforeEach(async ({ page }) => {
    cardsPage = new CardsPage(page);
  });

  test.describe('TS-001 - Complete Card List Display', () => {
    test('TC-001 - Verify user with 3 registered credit cards views complete list with all key details accurately displayed', async ({ page }) => {
      await cardsPage.navigate();
      await expect(cardsPage.page).toHaveURL(/\/cards/);
      await cardsPage.verifyCardCount(3);
      await cardsPage.verifyCardType('CC001', 'Visa Platinum');
      await cardsPage.verifyCardType('CC002', 'Mastercard Gold');
      await cardsPage.verifyCardType('CC003', 'Amex Blue');
      await cardsPage.verifyMaskedCardNumber('CC001', '**** **** **** 1234');
      await cardsPage.verifyMaskedCardNumber('CC002', '**** **** **** 5678');
      await cardsPage.verifyMaskedCardNumber('CC003', '**** **** **** 9012');
      await cardsPage.verifyCardFinancialDetails('CC001', { limit: '₹50,000', outstanding: '₹12,500', available: '₹37,500' });
      await cardsPage.verifyCardFinancialDetails('CC002', { limit: '₹30,000', outstanding: '₹5,000', available: '₹25,000' });
      await cardsPage.verifyCardFinancialDetails('CC003', { limit: '₹75,000', outstanding: '₹22,000', available: '₹53,000' });
    });

    test('TC-002 - Verify card list displays cards in correct order and allows user to select individual cards', async ({ page }) => {
      await cardsPage.navigate();
      await cardsPage.verifyCardOrder(['CC001', 'CC002', 'CC003']);
      await cardsPage.selectCard('CC001');
      await cardsPage.verifyCardSelected('CC001');
      await cardsPage.verifyTransactionPanelDisplaysForCard('CC001', 4);
    });

    test('TC-003 - Verify card list displays accurate available credit calculated as (Credit Limit - Outstanding Amount)', async ({ page }) => {
      await cardsPage.navigate();
      await cardsPage.verifyAvailableCreditCalculation('CC001', 50000, 12500, 37500);
      await cardsPage.verifyAvailableCreditCalculation('CC002', 30000, 5000, 25000);
      await cardsPage.verifyAvailableCreditCalculation('CC003', 75000, 22000, 53000);
    });
  });

  test.describe('TS-002 - No Cards Registered Scenario', () => {
    test('TC-001 - Verify user with no registered credit cards receives appropriate message without system errors', async ({ page }) => {
      await cardsPage.navigate();
      await cardsPage.verifyNoCardsMessage('No credit cards registered. Please add a credit card to get started.');
      await cardsPage.verifyNoSystemErrors();
    });

    test('TC-002 - Verify transaction panel displays appropriate message when user has no cards', async ({ page }) => {
      await cardsPage.navigate();
      await cardsPage.verifyTransactionPanelMessage('No transactions found');
      await cardsPage.verifyNoTransactionPanelErrors();
    });

    test('TC-003 - Verify page layout remains intact when user has no cards (no broken UI elements)', async ({ page }) => {
      await cardsPage.navigate();
      await cardsPage.verifyPageHeaderDisplayed();
      await cardsPage.verifyNavigationDisplayed();
      await cardsPage.verifyFooterDisplayed();
      await cardsPage.verifyCardListSectionDisplaysMessage();
      await cardsPage.verifyNoBrokenUIElements();
    });
  });

  test.describe('TS-003 - Incomplete Card Data Handling', () => {
    test('TC-001 - Verify system displays default value for missing credit limit in card data', async ({ page }) => {
      await cardsPage.navigate();
      await cardsPage.verifyCardDisplayedWithMissingField('CC007', 'creditLimit', 'N/A');
      await cardsPage.verifyOtherCardDetailsDisplayed('CC007');
    });

    test('TC-002 - Verify system displays error indicator for missing outstanding amount in card data', async ({ page }) => {
      await cardsPage.navigate();
      await cardsPage.verifyCardDisplayedWithMissingField('CC008', 'outstanding', 'N/A');
      await cardsPage.verifyAvailableCreditHandlesMissingOutstanding('CC008');
    });

    test('TC-003 - Verify system handles card with multiple missing fields without breaking the interface', async ({ page }) => {
      await cardsPage.navigate();
      await cardsPage.verifyCardDisplayedWithMultipleMissingFields('CC009', ['creditLimit', 'outstanding', 'available']);
      await cardsPage.verifyOtherValidCardsDisplayed(['CC001', 'CC002', 'CC003']);
    });
  });
});
