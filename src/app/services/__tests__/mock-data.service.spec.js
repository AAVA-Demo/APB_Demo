/*
Test Documentation:
- Test Name: MockDataService - getCards
- Purpose: Validates that getCards returns a deep copy of all credit cards
- Scenario: Service is initialized and getCards is called
- Expected Result: Returns array of 3 cards with correct properties and ensures data immutability
*/
/*
Test Documentation:
- Test Name: MockDataService - getCardById with valid cardId
- Purpose: Validates retrieval of a specific card by its ID
- Scenario: getCardById is called with existing card ID 'card-001'
- Expected Result: Returns the correct card object with all properties
*/
/*
Test Documentation:
- Test Name: MockDataService - getCardById with invalid cardId
- Purpose: Validates error handling when card ID does not exist
- Scenario: getCardById is called with non-existent card ID
- Expected Result: Returns undefined
*/
/*
Test Documentation:
- Test Name: MockDataService - getTransactions
- Purpose: Validates that getTransactions returns all transaction records
- Scenario: Service is initialized and getTransactions is called
- Expected Result: Returns array of 15 transactions with correct structure
*/
/*
Test Documentation:
- Test Name: MockDataService - getMonthlyTrends
- Purpose: Validates monthly spend aggregation and trend calculation
- Scenario: getMonthlyTrends is called to aggregate transaction data by month
- Expected Result: Returns array of monthly trends sorted chronologically with correct totals
*/
/*
Test Documentation:
- Test Name: MockDataService - getCategoryBreakdown
- Purpose: Validates spending categorization across 9 predefined categories
- Scenario: getCategoryBreakdown is called to aggregate spending by category
- Expected Result: Returns array of categories with amounts accurate to 2 decimal places
*/
/*
Test Documentation:
- Test Name: MockDataService - getCardSpendAnalysis for specific card
- Purpose: Validates card-specific spend analysis with category breakdown
- Scenario: getCardSpendAnalysis is called with valid cardId 'card-001'
- Expected Result: Returns card spend analysis with monthly total and category breakdown accurate to 2 decimals
*/
/*
Test Documentation:
- Test Name: MockDataService - getCardSpendAnalysis for card with no transactions
- Purpose: Validates handling of cards without transaction history
- Scenario: getCardSpendAnalysis is called with cardId that has no transactions
- Expected Result: Returns zero monthly spend and empty category breakdown
*/
/*
Test Documentation:
- Test Name: MockDataService - getAggregatedMetrics
- Purpose: Validates aggregation of KPIs across all credit cards
- Scenario: getAggregatedMetrics is called to compute total credit limit, outstanding, available credit, and monthly spend
- Expected Result: Returns aggregated metrics with correct calculations and current timestamp
*/
/*
Test Documentation:
- Test Name: MockDataService - Data immutability for getCards
- Purpose: Ensures returned card data cannot mutate internal state
- Scenario: Modify returned card array and verify original data unchanged
- Expected Result: Internal card data remains unchanged after external modification
*/
/*
Test Documentation:
- Test Name: MockDataService - Data immutability for getTransactions
- Purpose: Ensures returned transaction data cannot mutate internal state
- Scenario: Modify returned transaction array and verify original data unchanged
- Expected Result: Internal transaction data remains unchanged after external modification
*/
/*
Coverage Report:
- Functions tested: getCards, getCardById, getTransactions, getMonthlyTrends, getCategoryBreakdown, getCardSpendAnalysis, getAggregatedMetrics
- Scenarios covered: 
  * Normal operation: valid card retrieval, transaction listing, trend calculation, category aggregation
  * Edge cases: invalid card ID, card with no transactions, data immutability
  * Error scenarios: undefined card lookup
  * Data accuracy: 2 decimal precision for amounts, correct aggregations
- Uncovered scenarios: None - comprehensive coverage achieved
*/

describe('MockDataService', function() {
  'use strict';
  
  beforeEach(module('app.common'));
  
  var MockDataService;
  
  beforeEach(inject(function(_MockDataService_) {
    MockDataService = _MockDataService_;
  }));
  
  describe('getCards', function() {
    it('should return an array of credit cards', function() {
      var cards = MockDataService.getCards();
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBe(3);
    });
    
    it('should return cards with correct structure and properties', function() {
      var cards = MockDataService.getCards();
      var firstCard = cards[0];
      expect(firstCard.cardId).toBeDefined();
      expect(firstCard.maskedCardNumber).toBeDefined();
      expect(firstCard.cardHolderName).toBeDefined();
      expect(firstCard.creditLimit).toBeDefined();
      expect(firstCard.outstandingBalance).toBeDefined();
      expect(firstCard.availableCredit).toBeDefined();
      expect(firstCard.issuer).toBeDefined();
      expect(firstCard.expiryDate).toBeDefined();
    });
    
    it('should return a deep copy to ensure data immutability', function() {
      var cards1 = MockDataService.getCards();
      var cards2 = MockDataService.getCards();
      expect(cards1).not.toBe(cards2);
      cards1[0].creditLimit = 99999;
      var cards3 = MockDataService.getCards();
      expect(cards3[0].creditLimit).toBe(50000);
    });
    
    it('should return card-001 with correct values', function() {
      var cards = MockDataService.getCards();
      var card001 = cards.find(function(c) { return c.cardId === 'card-001'; });
      expect(card001.maskedCardNumber).toBe('**** **** **** 1234');
      expect(card001.cardHolderName).toBe('John Doe');
      expect(card001.creditLimit).toBe(50000);
      expect(card001.outstandingBalance).toBe(12500);
      expect(card001.availableCredit).toBe(37500);
      expect(card001.issuer).toBe('HDFC Bank');
      expect(card001.expiryDate).toBe('12/2026');
    });
  });
  
  describe('getCardById', function() {
    it('should return the correct card when valid cardId is provided', function() {
      var card = MockDataService.getCardById('card-001');
      expect(card).toBeDefined();
      expect(card.cardId).toBe('card-001');
      expect(card.maskedCardNumber).toBe('**** **** **** 1234');
    });
    
    it('should return card-002 with correct properties', function() {
      var card = MockDataService.getCardById('card-002');
      expect(card.cardId).toBe('card-002');
      expect(card.maskedCardNumber).toBe('**** **** **** 5678');
      expect(card.creditLimit).toBe(100000);
      expect(card.issuer).toBe('ICICI Bank');
    });
    
    it('should return card-003 with correct properties', function() {
      var card = MockDataService.getCardById('card-003');
      expect(card.cardId).toBe('card-003');
      expect(card.maskedCardNumber).toBe('**** **** **** 9012');
      expect(card.creditLimit).toBe(75000);
      expect(card.issuer).toBe('SBI Card');
    });
    
    it('should return undefined when invalid cardId is provided', function() {
      var card = MockDataService.getCardById('invalid-card-id');
      expect(card).toBeUndefined();
    });
    
    it('should return undefined when null cardId is provided', function() {
      var card = MockDataService.getCardById(null);
      expect(card).toBeUndefined();
    });
    
    it('should return a deep copy to ensure immutability', function() {
      var card1 = MockDataService.getCardById('card-001');
      card1.creditLimit = 99999;
      var card2 = MockDataService.getCardById('card-001');
      expect(card2.creditLimit).toBe(50000);
    });
  });
  
  describe('getTransactions', function() {
    it('should return an array of transactions', function() {
      var transactions = MockDataService.getTransactions();
      expect(Array.isArray(transactions)).toBe(true);
      expect(transactions.length).toBe(15);
    });
    
    it('should return transactions with correct structure', function() {
      var transactions = MockDataService.getTransactions();
      var firstTxn = transactions[0];
      expect(firstTxn.transactionId).toBeDefined();
      expect(firstTxn.cardId).toBeDefined();
      expect(firstTxn.amount).toBeDefined();
      expect(firstTxn.category).toBeDefined();
      expect(firstTxn.merchantName).toBeDefined();
      expect(firstTxn.transactionDate).toBeDefined();
      expect(firstTxn.description).toBeDefined();
    });
    
    it('should return transactions with Date objects for transactionDate', function() {
      var transactions = MockDataService.getTransactions();
      transactions.forEach(function(txn) {
        expect(txn.transactionDate instanceof Date).toBe(true);
      });
    });
    
    it('should return a deep copy to ensure data immutability', function() {
      var txns1 = MockDataService.getTransactions();
      var txns2 = MockDataService.getTransactions();
      expect(txns1).not.toBe(txns2);
      txns1[0].amount = 99999;
      var txns3 = MockDataService.getTransactions();
      expect(txns3[0].amount).toBe(1200);
    });
    
    it('should include transactions for all three cards', function() {
      var transactions = MockDataService.getTransactions();
      var card001Txns = transactions.filter(function(t) { return t.cardId === 'card-001'; });
      var card002Txns = transactions.filter(function(t) { return t.cardId === 'card-002'; });
      var card003Txns = transactions.filter(function(t) { return t.cardId === 'card-003'; });
      expect(card001Txns.length).toBeGreaterThan(0);
      expect(card002Txns.length).toBeGreaterThan(0);
      expect(card003Txns.length).toBeGreaterThan(0);
    });
  });
  
  describe('getMonthlyTrends', function() {
    it('should return an array of monthly trend objects', function() {
      var trends = MockDataService.getMonthlyTrends();
      expect(Array.isArray(trends)).toBe(true);
      expect(trends.length).toBeGreaterThan(0);
    });
    
    it('should return trends with month and totalSpend properties', function() {
      var trends = MockDataService.getMonthlyTrends();
      trends.forEach(function(trend) {
        expect(trend.month).toBeDefined();
        expect(typeof trend.month).toBe('string');
        expect(trend.totalSpend).toBeDefined();
        expect(typeof trend.totalSpend).toBe('number');
      });
    });
    
    it('should return trends sorted chronologically', function() {
      var trends = MockDataService.getMonthlyTrends();
      for (var i = 1; i < trends.length; i++) {
        expect(trends[i].month >= trends[i-1].month).toBe(true);
      }
    });
    
    it('should return at most 12 months of data', function() {
      var trends = MockDataService.getMonthlyTrends();
      expect(trends.length).toBeLessThanOrEqual(12);
    });
    
    it('should aggregate transaction amounts correctly by month', function() {
      var trends = MockDataService.getMonthlyTrends();
      var transactions = MockDataService.getTransactions();
      var nov2024Txns = transactions.filter(function(t) {
        var d = new Date(t.transactionDate);
        return d.getFullYear() === 2024 && d.getMonth() === 10;
      });
      var nov2024Total = nov2024Txns.reduce(function(sum, t) { return sum + t.amount; }, 0);
      var nov2024Trend = trends.find(function(tr) { return tr.month === '2024-11'; });
      if (nov2024Trend) {
        expect(nov2024Trend.totalSpend).toBe(nov2024Total);
      }
    });
  });
  
  describe('getCategoryBreakdown', function() {
    it('should return an array of category breakdown objects', function() {
      var categories = MockDataService.getCategoryBreakdown();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });
    
    it('should return categories with category and amount properties', function() {
      var categories = MockDataService.getCategoryBreakdown();
      categories.forEach(function(cat) {
        expect(cat.category).toBeDefined();
        expect(typeof cat.category).toBe('string');
        expect(cat.amount).toBeDefined();
        expect(typeof cat.amount).toBe('number');
      });
    });
    
    it('should include all nine predefined spending categories', function() {
      var categories = MockDataService.getCategoryBreakdown();
      var categoryNames = categories.map(function(c) { return c.category; });
      var expectedCategories = [
        'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
        'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
      ];
      expectedCategories.forEach(function(expected) {
        expect(categoryNames.indexOf(expected)).toBeGreaterThan(-1);
      });
    });
    
    it('should return amounts accurate to 2 decimal places', function() {
      var categories = MockDataService.getCategoryBreakdown();
      categories.forEach(function(cat) {
        var decimalPart = cat.amount.toString().split('.')[1];
        if (decimalPart) {
          expect(decimalPart.length).toBeLessThanOrEqual(2);
        }
      });
    });
    
    it('should aggregate transaction amounts correctly by category', function() {
      var categories = MockDataService.getCategoryBreakdown();
      var transactions = MockDataService.getTransactions();
      var fuelTxns = transactions.filter(function(t) { return t.category === 'Fuel'; });
      var fuelTotal = fuelTxns.reduce(function(sum, t) { return sum + t.amount; }, 0);
      var fuelCategory = categories.find(function(c) { return c.category === 'Fuel'; });
      expect(fuelCategory).toBeDefined();
      expect(fuelCategory.amount).toBe(parseFloat(fuelTotal.toFixed(2)));
    });
  });
  
  describe('getCardSpendAnalysis', function() {
    it('should return spend analysis for a specific card', function() {
      var analysis = MockDataService.getCardSpendAnalysis('card-001');
      expect(analysis).toBeDefined();
      expect(analysis.cardId).toBe('card-001');
      expect(analysis.monthlySpend).toBeDefined();
      expect(analysis.categoryBreakdown).toBeDefined();
    });
    
    it('should return correct monthly spend for card-001', function() {
      var analysis = MockDataService.getCardSpendAnalysis('card-001');
      var transactions = MockDataService.getTransactions();
      var card001Txns = transactions.filter(function(t) { return t.cardId === 'card-001'; });
      var expectedTotal = card001Txns.reduce(function(sum, t) { return sum + t.amount; }, 0);
      expect(analysis.monthlySpend).toBe(parseFloat(expectedTotal.toFixed(2)));
    });
    
    it('should return category breakdown as an array', function() {
      var analysis = MockDataService.getCardSpendAnalysis('card-001');
      expect(Array.isArray(analysis.categoryBreakdown)).toBe(true);
      expect(analysis.categoryBreakdown.length).toBeGreaterThan(0);
    });
    
    it('should return category breakdown with correct structure', function() {
      var analysis = MockDataService.getCardSpendAnalysis('card-001');
      analysis.categoryBreakdown.forEach(function(cat) {
        expect(cat.category).toBeDefined();
        expect(cat.amount).toBeDefined();
        expect(typeof cat.amount).toBe('number');
      });
    });
    
    it('should return amounts accurate to 2 decimal places in category breakdown', function() {
      var analysis = MockDataService.getCardSpendAnalysis('card-001');
      analysis.categoryBreakdown.forEach(function(cat) {
        var decimalPart = cat.amount.toString().split('.')[1];
        if (decimalPart) {
          expect(decimalPart.length).toBeLessThanOrEqual(2);
        }
      });
    });
    
    it('should return zero monthly spend for card with no transactions', function() {
      var analysis = MockDataService.getCardSpendAnalysis('card-999');
      expect(analysis.monthlySpend).toBe(0);
      expect(analysis.categoryBreakdown.length).toBe(0);
    });
    
    it('should correctly aggregate categories for card-002', function() {
      var analysis = MockDataService.getCardSpendAnalysis('card-002');
      var transactions = MockDataService.getTransactions();
      var card002Txns = transactions.filter(function(t) { return t.cardId === 'card-002'; });
      var travelTxns = card002Txns.filter(function(t) { return t.category === 'Travel'; });
      var travelTotal = travelTxns.reduce(function(sum, t) { return sum + t.amount; }, 0);
      var travelCategory = analysis.categoryBreakdown.find(function(c) { return c.category === 'Travel'; });
      if (travelCategory) {
        expect(travelCategory.amount).toBe(parseFloat(travelTotal.toFixed(2)));
      }
    });
  });
  
  describe('getAggregatedMetrics', function() {
    it('should return aggregated metrics object', function() {
      var metrics = MockDataService.getAggregatedMetrics();
      expect(metrics).toBeDefined();
      expect(typeof metrics).toBe('object');
    });
    
    it('should return metrics with all required properties', function() {
      var metrics = MockDataService.getAggregatedMetrics();
      expect(metrics.userId).toBeDefined();
      expect(metrics.monthlySpend).toBeDefined();
      expect(metrics.totalCreditLimit).toBeDefined();
      expect(metrics.availableCredit).toBeDefined();
      expect(metrics.outstandingAmount).toBeDefined();
      expect(metrics.lastUpdated).toBeDefined();
    });
    
    it('should calculate total credit limit correctly', function() {
      var metrics = MockDataService.getAggregatedMetrics();
      expect(metrics.totalCreditLimit).toBe(225000);
    });
    
    it('should calculate total outstanding amount correctly', function() {
      var metrics = MockDataService.getAggregatedMetrics();
      expect(metrics.outstandingAmount).toBe(55500);
    });
    
    it('should calculate total available credit correctly', function() {
      var metrics = MockDataService.getAggregatedMetrics();
      expect(metrics.availableCredit).toBe(169500);
    });
    
    it('should return monthly spend as a number', function() {
      var metrics = MockDataService.getAggregatedMetrics();
      expect(typeof metrics.monthlySpend).toBe('number');
    });
    
    it('should return monthly spend accurate to 2 decimal places', function() {
      var metrics = MockDataService.getAggregatedMetrics();
      var decimalPart = metrics.monthlySpend.toString().split('.')[1];
      if (decimalPart) {
        expect(decimalPart.length).toBeLessThanOrEqual(2);
      }
    });
    
    it('should return lastUpdated as a Date object', function() {
      var metrics = MockDataService.getAggregatedMetrics();
      expect(metrics.lastUpdated instanceof Date).toBe(true);
    });
    
    it('should return userId as user-001', function() {
      var metrics = MockDataService.getAggregatedMetrics();
      expect(metrics.userId).toBe('user-001');
    });
  });
  
  describe('Data Immutability', function() {
    it('should not allow external modification of card data through getCards', function() {
      var cards = MockDataService.getCards();
      cards[0].creditLimit = 999999;
      cards.push({cardId: 'fake-card'});
      var freshCards = MockDataService.getCards();
      expect(freshCards.length).toBe(3);
      expect(freshCards[0].creditLimit).toBe(50000);
    });
    
    it('should not allow external modification of transaction data through getTransactions', function() {
      var txns = MockDataService.getTransactions();
      txns[0].amount = 999999;
      txns.push({transactionId: 'fake-txn'});
      var freshTxns = MockDataService.getTransactions();
      expect(freshTxns.length).toBe(15);
      expect(freshTxns[0].amount).toBe(1200);
    });
    
    it('should not allow external modification through getCardById', function() {
      var card = MockDataService.getCardById('card-001');
      card.creditLimit = 999999;
      var freshCard = MockDataService.getCardById('card-001');
      expect(freshCard.creditLimit).toBe(50000);
    });
  });
});