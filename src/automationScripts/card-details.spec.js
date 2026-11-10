const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/card-management.page');
const { AuthHelper } = require('./helpers/auth.helper');

test.describe('Individual Card Detail Views - QE-10016', () => {
  let cardManagementPage;
  
  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    await AuthHelper.authenticate(page, 'user123');
    await cardManagementPage.navigate();
  });
  
  test('QE-10016 TS-001 TC-001 - Verify individual card details retrieval displays complete card information including financial metrics and spend analysis', async ({ page }) => {
    await cardManagementPage.selectCard('card1');
    await cardManagementPage.waitForCardDetailsLoad();
    
    const cardType = await cardManagementPage.getCardType();
    const maskedCardNumber = await cardManagementPage.getMaskedCardNumber();
    const creditLimit = await cardManagementPage.getCreditLimit();
    const currentBalance = await cardManagementPage.getCurrentBalance();
    const availableBalance = await cardManagementPage.getAvailableBalance();
    const outstandingAmount = await cardManagementPage.getOutstandingAmount();
    const monthlySpend = await cardManagementPage.getMonthlySpend();
    
    expect(cardType).toBe('Visa Platinum');
    expect(maskedCardNumber).toBe('**** **** **** 1234');
    expect(creditLimit).toBe('100000.00');
    expect(currentBalance).toBe('25000.00');
    expect(availableBalance).toBe('75000.00');
    expect(outstandingAmount).toBe('25000.00');
    expect(monthlySpend).toBe('15000.00');
  });
  
  test('QE-10016 TS-001 TC-002 - Verify card detail view calculates and displays credit utilization percentage', async ({ page }) => {
    await cardManagementPage.selectCard('card2');
    await cardManagementPage.waitForCardDetailsLoad();
    
    const utilization = await cardManagementPage.getCreditUtilization();
    expect(utilization).toBe('40.00%');
    
    const utilizationStatus = await cardManagementPage.getUtilizationStatus();
    expect(utilizationStatus).toBe('Warning');
  });
  
  test('QE-10016 TS-002 TC-001 - Verify system returns Card not found error for invalid card ID without exposing user data', async ({ page }) => {
    await cardManagementPage.selectCard('invalidCard999');
    
    const errorMessage = await cardManagementPage.getErrorMessage();
    expect(errorMessage).toContain('Card not found');
    
    const cardDataVisible = await cardManagementPage.isCardDataVisible();
    expect(cardDataVisible).toBe(false);
  });
  
  test('QE-10016 TS-003 TC-001 - Verify high utilization card details display accurate utilization percentage above 70% with all financial metrics to 2 decimal places', async ({ page }) => {
    await AuthHelper.authenticate(page, 'user456');
    await cardManagementPage.navigate();
    await cardManagementPage.selectCard('card5');
    await cardManagementPage.waitForCardDetailsLoad();
    
    const utilization = await cardManagementPage.getCreditUtilization();
    expect(parseFloat(utilization)).toBeGreaterThan(70);
    expect(utilization).toBe('75.00%');
    
    const utilizationStatus = await cardManagementPage.getUtilizationStatus();
    expect(utilizationStatus).toBe('Danger');
    
    const creditLimit = await cardManagementPage.getCreditLimit();
    const currentBalance = await cardManagementPage.getCurrentBalance();
    const availableBalance = await cardManagementPage.getAvailableBalance();
    const outstandingAmount = await cardManagementPage.getOutstandingAmount();
    
    expect(creditLimit).toMatch(/^\d+\.\d{2}$/);
    expect(currentBalance).toMatch(/^\d+\.\d{2}$/);
    expect(availableBalance).toMatch(/^\d+\.\d{2}$/);
    expect(outstandingAmount).toMatch(/^\d+\.\d{2}$/);
  });
});
