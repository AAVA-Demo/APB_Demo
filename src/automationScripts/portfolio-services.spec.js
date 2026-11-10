const { test, expect } = require('@playwright/test');
const { PortfolioServicePage } = require('./pages/portfolio-service.page');
const { Logger } = require('../utils/logger');

test.describe('Portfolio Service - Credit Card Management', () => {
  let portfolioPage;
  const logger = new Logger('PortfolioServicesSpec');

  test.beforeEach(async ({ page }) => {
    portfolioPage = new PortfolioServicePage(page);
    logger.info('Test setup completed');
  });

  test('[QE-10370 TS-001 TC-001] Verify portfolio service fetches all 3 credit cards with complete details', async () => {
    logger.info('Starting test: Fetch all credit cards with complete details');
    
    // Step 1: Initialize credit card data service with 3 mock cards
    await portfolioPage.initializeMockCreditCards();
    logger.info('Mock credit cards initialized');
    
    // Step 2: Call fetchAllCards method
    const cards = await portfolioPage.fetchAllCards();
    logger.info(`Fetched ${cards.length} cards`);
    
    // Step 3: Verify array contains exactly 3 cards
    expect(cards.length).toBe(3);
    logger.info('Verified card count: 3');
    
    // Step 4: Validate all required fields
    const requiredFields = ['cardId', 'cardNumber', 'cardType', 'cardHolderName', 'totalCreditLimit', 'outstandingAmount', 'monthlySpend', 'expiryDate', 'status'];
    for (const card of cards) {
      await portfolioPage.validateCardFields(card, requiredFields);
    }
    logger.info('All required fields validated');
    
    // Step 5: Verify CC001 (Visa) details
    const visaCard = cards.find(c => c.cardId === 'CC001');
    expect(visaCard.cardType).toBe('Visa');
    expect(visaCard.cardNumber).toBe('**** **** **** 1234');
    expect(visaCard.totalCreditLimit).toBe(10000);
    expect(visaCard.outstandingAmount).toBe(2500);
    expect(visaCard.monthlySpend).toBe(1200);
    logger.info('Visa card details verified');
    
    // Step 6: Verify CC002 (MasterCard) details
    const masterCard = cards.find(c => c.cardId === 'CC002');
    expect(masterCard.cardType).toBe('MasterCard');
    expect(masterCard.cardNumber).toBe('**** **** **** 5678');
    expect(masterCard.totalCreditLimit).toBe(15000);
    expect(masterCard.outstandingAmount).toBe(5000);
    expect(masterCard.monthlySpend).toBe(2300);
    logger.info('MasterCard details verified');
    
    // Step 7: Verify CC003 (Amex) details
    const amexCard = cards.find(c => c.cardId === 'CC003');
    expect(amexCard.cardType).toBe('Amex');
    expect(amexCard.cardNumber).toBe('**** **** **** 9012');
    expect(amexCard.totalCreditLimit).toBe(20000);
    expect(amexCard.outstandingAmount).toBe(8000);
    expect(amexCard.monthlySpend).toBe(3500);
    logger.info('Amex card details verified');
    
    logger.info('Test completed successfully');
  });

  test('[QE-10370 TS-002 TC-001] Verify card numbers are properly masked', async () => {
    logger.info('Starting test: Card number masking validation');
    
    // Step 1: Initialize with full card numbers
    await portfolioPage.initializeMockCreditCardsWithFullNumbers();
    logger.info('Mock cards with full numbers initialized');
    
    // Step 2: Fetch all cards
    const cards = await portfolioPage.fetchAllCards();
    logger.info('Cards fetched');
    
    // Step 3-4: Validate masking pattern
    const maskingPattern = /^\*{4} \*{4} \*{4} \d{4}$/;
    for (const card of cards) {
      expect(card.cardNumber).toMatch(maskingPattern);
      expect(card.cardNumber).toContain('****');
    }
    logger.info('Card number masking validated');
    
    // Step 5: Verify no full card numbers exposed
    await portfolioPage.verifyNoFullCardNumbersExposed(cards);
    logger.info('Confirmed no full card numbers exposed');
    
    // Step 6: Verify consistent masking across card types
    const expectedPatterns = ['**** **** **** 1234', '**** **** **** 5678', '**** **** **** 9012'];
    const actualPatterns = cards.map(c => c.cardNumber);
    expect(actualPatterns).toEqual(expect.arrayContaining(expectedPatterns));
    logger.info('Masking consistency verified across all card types');
    
    logger.info('Test completed successfully');
  });

  test('[QE-10370 TS-003 TC-001] Verify empty portfolio handling', async () => {
    logger.info('Starting test: Empty portfolio graceful handling');
    
    // Step 1: Initialize with empty card array
    await portfolioPage.initializeEmptyPortfolio();
    logger.info('Empty portfolio initialized');
    
    // Step 2: Get portfolio summary
    const summary = await portfolioPage.getPortfolioSummary();
    logger.info('Portfolio summary retrieved');
    
    // Step 3: Verify no errors thrown
    expect(summary).toBeDefined();
    logger.info('Valid summary object returned');
    
    // Step 4: Verify empty cards array
    expect(summary.cards).toEqual([]);
    expect(summary.cards.length).toBe(0);
    logger.info('Empty cards array verified');
    
    // Step 5: Verify totalCards = 0
    expect(summary.totalCards).toBe(0);
    logger.info('Total cards count verified: 0');
    
    // Step 6: Verify all KPIs are zero
    expect(summary.totalCreditLimit).toBe(0);
    expect(summary.totalOutstanding).toBe(0);
    expect(summary.totalAvailableCredit).toBe(0);
    expect(summary.totalMonthlySpend).toBe(0);
    logger.info('All KPI values verified as zero');
    
    // Step 7: Verify graceful handling
    await portfolioPage.verifyGracefulEmptyStateHandling(summary);
    logger.info('Graceful empty state handling confirmed');
    
    logger.info('Test completed successfully');
  });

  test('[QE-10367 TS-001 TC-001] Verify aggregated KPI calculations', async () => {
    logger.info('Starting test: Aggregated KPI calculations');
    
    // Step 1: Initialize with 3 cards with specific values
    await portfolioPage.initializeMockCardsWithValues([
      { cardId: 'CC001', totalCreditLimit: 10000, outstandingAmount: 2500, monthlySpend: 1200 },
      { cardId: 'CC002', totalCreditLimit: 15000, outstandingAmount: 5000, monthlySpend: 2300 },
      { cardId: 'CC003', totalCreditLimit: 20000, outstandingAmount: 8000, monthlySpend: 3500 }
    ]);
    logger.info('Mock cards with specific values initialized');
    
    // Step 2: Get portfolio summary
    const summary = await portfolioPage.getPortfolioSummary();
    logger.info('Portfolio summary calculated');
    
    // Step 3: Verify totalCreditLimit
    expect(summary.totalCreditLimit).toBe(45000);
    logger.info('Total credit limit verified: 45000');
    
    // Step 4: Verify totalOutstanding
    expect(summary.totalOutstanding).toBe(15500);
    logger.info('Total outstanding verified: 15500');
    
    // Step 5: Verify totalAvailableCredit
    expect(summary.totalAvailableCredit).toBe(29500);
    logger.info('Total available credit verified: 29500');
    
    // Step 6: Verify totalMonthlySpend
    expect(summary.totalMonthlySpend).toBe(7000);
    logger.info('Total monthly spend verified: 7000');
    
    // Step 7: Verify all calculations are accurate
    await portfolioPage.verifyKPICalculationAccuracy(summary);
    logger.info('KPI calculation accuracy confirmed');
    
    // Step 8: Verify all required KPI fields present
    const requiredKPIs = ['totalCreditLimit', 'totalOutstanding', 'totalAvailableCredit', 'totalMonthlySpend'];
    for (const kpi of requiredKPIs) {
      expect(summary).toHaveProperty(kpi);
    }
    logger.info('All required KPI fields present');
    
    logger.info('Test completed successfully');
  });

  test('[QE-10367 TS-002 TC-001] Verify available credit calculation', async () => {
    logger.info('Starting test: Available credit calculation');
    
    // Step 1: Create mock card
    const mockCard = { totalCreditLimit: 10000, outstandingAmount: 2500 };
    logger.info('Mock card created');
    
    // Step 2: Calculate available credit
    const availableCredit = await portfolioPage.calculateAvailableCredit(mockCard);
    logger.info(`Available credit calculated: ${availableCredit}`);
    
    // Step 3: Verify calculation formula
    const expectedCredit = mockCard.totalCreditLimit - mockCard.outstandingAmount;
    expect(availableCredit).toBe(expectedCredit);
    logger.info('Calculation formula verified');
    
    // Step 4: Verify result equals 7500
    expect(availableCredit).toBe(7500);
    logger.info('Available credit verified: 7500');
    
    // Step 5: Verify result is number type
    expect(typeof availableCredit).toBe('number');
    logger.info('Result type verified as number');
    
    // Step 6: Verify original card not mutated
    expect(mockCard.totalCreditLimit).toBe(10000);
    expect(mockCard.outstandingAmount).toBe(2500);
    logger.info('Original card object not mutated');
    
    logger.info('Test completed successfully');
  });

  test('[QE-10367 TS-003 TC-001] Verify over-limit card handling', async () => {
    logger.info('Starting test: Over-limit card graceful handling');
    
    // Step 1: Create over-limit card
    const overLimitCard = { cardId: 'CC999', totalCreditLimit: 10000, outstandingAmount: 12000 };
    logger.info('Over-limit card created');
    
    // Step 2: Initialize service with over-limit card
    await portfolioPage.initializeMockCardsWithValues([overLimitCard]);
    logger.info('Service initialized with over-limit card');
    
    // Step 3: Get portfolio summary
    const summary = await portfolioPage.getPortfolioSummary();
    logger.info('Portfolio summary retrieved without errors');
    
    // Step 4: Verify calculation method invoked
    expect(summary.cards[0]).toHaveProperty('availableCredit');
    logger.info('Calculation method invoked');
    
    // Step 5: Verify negative available credit
    expect(summary.cards[0].availableCredit).toBe(-2000);
    logger.info('Negative available credit verified: -2000');
    
    // Step 6: Verify no errors thrown
    expect(summary).toBeDefined();
    logger.info('No errors thrown during calculation');
    
    // Step 7: Verify negative value in summary
    const cardInSummary = summary.cards.find(c => c.cardId === 'CC999');
    expect(cardInSummary.availableCredit).toBe(-2000);
    logger.info('Negative value present in portfolio summary');
    
    // Step 8: Verify display logic handles negative value
    await portfolioPage.verifyNegativeValueDisplay(cardInSummary);
    logger.info('Display logic handles negative value without crashes');
    
    logger.info('Test completed successfully');
  });
});
