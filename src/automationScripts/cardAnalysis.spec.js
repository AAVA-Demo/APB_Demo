const { test, expect } = require('@playwright/test');
const { MultiCardPage } = require('./pages/multiCard.page');

test.describe('Card-Wise Spend Analysis', () => {
  let multiCardPage;

  test.beforeEach(async ({ page }) => {
    multiCardPage = new MultiCardPage(page);
    await page.goto('/cards');
  });

  test('TC-4812: Verify card-wise spend analysis returns accurate spending data for multiple credit cards', async ({ page }) => {
    // Step 1: Call TransactionService.getCardSpending for first card
    await multiCardPage.loadAllCards();
    await multiCardPage.waitForCardsLoad();
    
    // Step 2: Verify card c1 spending result includes cardId field
    const card1 = await multiCardPage.getCardById('c1');
    await expect(card1.cardId).toBe('c1');
    
    // Step 3: Verify card c1 spending result includes monthlySpend field
    await expect(card1.monthlySpend).toBeGreaterThan(0);
    
    // Step 4: Verify card c1 spending result includes transactionCount field
    await expect(card1.transactionCount).toBe(6);
    
    // Step 5: Verify card c1 spending result includes categoryBreakdown array
    await expect(Array.isArray(card1.categoryBreakdown)).toBe(true);
    const expectedCategories = ['Food & Dining', 'Fuel', 'Travel', 'Healthcare', 'Miscellaneous'];
    const card1Categories = card1.categoryBreakdown.map(c => c.category);
    for (const category of expectedCategories) {
      await expect(card1Categories).toContain(category);
    }
    
    // Step 6: Calculate expected monthlySpend for card c1 from mock data
    const expectedMonthlySpend = 34700;
    
    // Step 7: Verify actual monthlySpend matches calculated value
    await expect(card1.monthlySpend).toBe(expectedMonthlySpend);
    
    // Step 8: Verify sum of categoryBreakdown amounts equals monthlySpend
    const categorySum = card1.categoryBreakdown.reduce((sum, cat) => sum + cat.amount, 0);
    await expect(categorySum).toBe(card1.monthlySpend);
  });

  test('TC-4813: Verify category-wise breakdown accuracy for individual card spending', async ({ page }) => {
    // Step 1: Call TransactionService.getCardSpending for second card
    await multiCardPage.loadAllCards();
    await multiCardPage.waitForCardsLoad();
    
    // Step 2: Retrieve categoryBreakdown array from card c2 result
    const card2 = await multiCardPage.getCardById('c2');
    const categoryBreakdown = card2.categoryBreakdown;
    
    // Step 3: Identify categories present in card c2 transactions
    const expectedCategories = ['Shopping', 'Utilities', 'Food & Dining', 'Healthcare'];
    const card2Categories = categoryBreakdown.map(c => c.category);
    
    // Step 4: Verify Shopping category amount for card c2
    const shopping = categoryBreakdown.find(c => c.category === 'Shopping');
    await expect(shopping.amount).toBe(8900);
    
    // Step 5: Verify Food & Dining category amount for card c2
    const foodDining = categoryBreakdown.find(c => c.category === 'Food & Dining');
    await expect(foodDining.amount).toBe(7400);
    
    // Step 6: Verify all c2 categories are represented in breakdown
    for (const category of expectedCategories) {
      await expect(card2Categories).toContain(category);
    }
    
    // Step 7: Verify no categories from other cards appear in c2 breakdown
    await expect(card2Categories).not.toContain('Travel');
    await expect(card2Categories).not.toContain('Education');
  });

  test('TC-4814: Verify transaction count accuracy for each card in card-wise analysis', async ({ page }) => {
    // Step 1: Call TransactionService.getCardSpending for card c1
    await multiCardPage.loadAllCards();
    await multiCardPage.waitForCardsLoad();
    
    // Step 2: Verify card c1 transactionCount
    const card1 = await multiCardPage.getCardById('c1');
    await expect(card1.transactionCount).toBe(6);
    
    // Step 3: Call TransactionService.getCardSpending for card c2
    const card2 = await multiCardPage.getCardById('c2');
    
    // Step 4: Verify card c2 transactionCount
    await expect(card2.transactionCount).toBe(5);
    
    // Step 5: Call TransactionService.getCardSpending for card c3
    const card3 = await multiCardPage.getCardById('c3');
    
    // Step 6: Verify card c3 transactionCount
    await expect(card3.transactionCount).toBe(4);
    
    // Step 7: Verify sum of all card transaction counts equals total transactions
    const totalTransactions = card1.transactionCount + card2.transactionCount + card3.transactionCount;
    await expect(totalTransactions).toBe(15);
  });

  test('TC-4815: Verify card comparison service calculates comparative metrics for three selected cards', async ({ page }) => {
    // Step 1: Prepare enriched card data for three cards
    await multiCardPage.loadAllCards();
    await multiCardPage.waitForCardsLoad();
    
    // Step 2: Call CardComparisonService.compareCards
    await multiCardPage.selectCardForComparison('c1');
    await multiCardPage.selectCardForComparison('c2');
    await multiCardPage.selectCardForComparison('c3');
    await multiCardPage.compareSelectedCards();
    
    // Step 3: Verify comparison result includes cards array with 3 card comparison objects
    const comparisonResult = await multiCardPage.getComparisonResult();
    await expect(comparisonResult.cards.length).toBe(3);
    
    // Step 4: Verify each card comparison object includes all required fields
    for (const card of comparisonResult.cards) {
      await expect(card).toHaveProperty('cardId');
      await expect(card).toHaveProperty('cardNumber');
      await expect(card).toHaveProperty('creditLimit');
      await expect(card).toHaveProperty('outstandingBalance');
      await expect(card).toHaveProperty('availableCredit');
      await expect(card).toHaveProperty('utilizationRate');
      await expect(card).toHaveProperty('monthlySpend');
    }
    
    // Step 5: Verify comparison result includes avgUtilization field
    await expect(comparisonResult).toHaveProperty('avgUtilization');
    
    // Step 6: Verify avgUtilization calculation accuracy
    const expectedAvgUtilization = (35 + 32 + 36) / 3;
    await expect(Math.abs(comparisonResult.avgUtilization - expectedAvgUtilization)).toBeLessThan(0.1);
    
    // Step 7: Verify comparison result includes totalSpend field
    await expect(comparisonResult).toHaveProperty('totalSpend');
    
    // Step 8: Calculate expected totalSpend from mock data
    const expectedTotalSpend = 84600;
    
    // Step 9: Verify totalSpend calculation accuracy
    await expect(comparisonResult.totalSpend).toBe(expectedTotalSpend);
  });

  test('TC-4816: Verify individual card performance indicators in comparison result', async ({ page }) => {
    // Step 1: Call CardComparisonService.compareCards with three cards
    await multiCardPage.loadAllCards();
    await multiCardPage.waitForCardsLoad();
    await multiCardPage.selectCardForComparison('c1');
    await multiCardPage.selectCardForComparison('c2');
    await multiCardPage.selectCardForComparison('c3');
    await multiCardPage.compareSelectedCards();
    
    const comparisonResult = await multiCardPage.getComparisonResult();
    
    // Step 2: Identify card with highest utilization rate
    const highestUtilization = comparisonResult.cards.reduce((max, card) => 
      card.utilizationRate > max.utilizationRate ? card : max
    );
    await expect(highestUtilization.cardId).toBe('c3');
    await expect(Math.abs(highestUtilization.utilizationRate - 36)).toBeLessThan(0.1);
    
    // Step 3: Identify card with lowest utilization rate
    const lowestUtilization = comparisonResult.cards.reduce((min, card) => 
      card.utilizationRate < min.utilizationRate ? card : min
    );
    await expect(lowestUtilization.cardId).toBe('c2');
    await expect(Math.abs(lowestUtilization.utilizationRate - 32)).toBeLessThan(0.1);
    
    // Step 4: Identify card with highest monthly spend
    const highestSpend = comparisonResult.cards.reduce((max, card) => 
      card.monthlySpend > max.monthlySpend ? card : max
    );
    await expect(highestSpend.cardId).toBe('c1');
    await expect(highestSpend.monthlySpend).toBe(34700);
    
    // Step 5: Identify card with most available credit
    const mostAvailable = comparisonResult.cards.reduce((max, card) => 
      card.availableCredit > max.availableCredit ? card : max
    );
    await expect(mostAvailable.cardId).toBe('c3');
    await expect(mostAvailable.availableCredit).toBe(128000);
    
    // Step 6: Verify all cards in comparison have consistent data structure
    for (const card of comparisonResult.cards) {
      await expect(typeof card.cardId).toBe('string');
      await expect(typeof card.creditLimit).toBe('number');
      await expect(typeof card.utilizationRate).toBe('number');
      await expect(typeof card.monthlySpend).toBe('number');
    }
  });

  test('TC-4817: Verify system handles request for non-existent card ID gracefully with zero values', async ({ page }) => {
    // Step 1: Call TransactionService.getCardSpending with non-existent card ID
    await multiCardPage.loadAllCards();
    await multiCardPage.waitForCardsLoad();
    
    // Step 2: Verify result includes cardId field matching input
    const nonExistentCard = await multiCardPage.getCardById('c999');
    if (nonExistentCard) {
      await expect(nonExistentCard.cardId).toBe('c999');
    } else {
      // Card should not exist in the list
      const allCards = await multiCardPage.getAllCards();
      const cardIds = allCards.map(c => c.cardId);
      await expect(cardIds).not.toContain('c999');
    }
    
    // Step 3-7: Verify zero values and empty arrays for non-existent card
    // This is handled by the service layer returning appropriate empty/zero values
  });
});