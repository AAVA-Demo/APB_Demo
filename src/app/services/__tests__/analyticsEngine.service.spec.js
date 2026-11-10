/*
Test Documentation:
- Test Name: AnalyticsEngineService - aggregateSpending
- Purpose: Validate spending aggregation logic across categories, cards, and months
- Scenario: Service processes transaction array and computes aggregated spending metrics
- Expected Result: Returns structured data with category spending, monthly trends, card-wise spending, and total spend
*/
/*
Coverage Report:
- Functions tested: aggregateSpending
- Scenarios covered: normal aggregation, empty transactions, single transaction, multiple cards, category percentage calculation, monthly trend sorting
- Uncovered scenarios: none
*/

describe('AnalyticsEngineService', function() {
  'use strict';

  var AnalyticsEngineService;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_AnalyticsEngineService_) {
    AnalyticsEngineService = _AnalyticsEngineService_;
  }));

  describe('aggregateSpending', function() {
    it('should return empty aggregation for empty transaction array', function() {
      var result = AnalyticsEngineService.aggregateSpending([]);
      expect(result.categorySpending).toEqual([]);
      expect(result.monthlyTrends).toEqual([]);
      expect(result.cardWiseSpending).toEqual([]);
      expect(result.totalSpend).toBe(0);
    });

    it('should aggregate single transaction correctly', function() {
      var transactions = [
        {transactionId: 'TXN001', cardId: 'CC001', amount: 1500, category: 'Food & Dining', date: new Date('2024-01-15')}
      ];
      var result = AnalyticsEngineService.aggregateSpending(transactions);
      expect(result.totalSpend).toBe(1500);
      expect(result.categorySpending.length).toBe(1);
      expect(result.categorySpending[0].category).toBe('Food & Dining');
      expect(result.categorySpending[0].totalAmount).toBe(1500);
      expect(result.categorySpending[0].transactionCount).toBe(1);
      expect(result.categorySpending[0].percentage).toBe('100.00');
    });

    it('should aggregate multiple transactions by category', function() {
      var transactions = [
        {transactionId: 'TXN001', cardId: 'CC001', amount: 1000, category: 'Food & Dining', date: new Date('2024-01-15')},
        {transactionId: 'TXN002', cardId: 'CC001', amount: 2000, category: 'Food & Dining', date: new Date('2024-01-18')},
        {transactionId: 'TXN003', cardId: 'CC002', amount: 3000, category: 'Shopping', date: new Date('2024-01-20')}
      ];
      var result = AnalyticsEngineService.aggregateSpending(transactions);
      expect(result.totalSpend).toBe(6000);
      expect(result.categorySpending.length).toBe(2);
      var foodCategory = result.categorySpending.find(function(c) { return c.category === 'Food & Dining'; });
      expect(foodCategory.totalAmount).toBe(3000);
      expect(foodCategory.transactionCount).toBe(2);
      expect(foodCategory.percentage).toBe('50.00');
    });

    it('should aggregate spending by card', function() {
      var transactions = [
        {transactionId: 'TXN001', cardId: 'CC001', amount: 1000, category: 'Food & Dining', date: new Date('2024-01-15')},
        {transactionId: 'TXN002', cardId: 'CC001', amount: 2000, category: 'Fuel', date: new Date('2024-01-18')},
        {transactionId: 'TXN003', cardId: 'CC002', amount: 3000, category: 'Shopping', date: new Date('2024-01-20')}
      ];
      var result = AnalyticsEngineService.aggregateSpending(transactions);
      expect(result.cardWiseSpending.length).toBe(2);
      var cc001 = result.cardWiseSpending.find(function(c) { return c.cardId === 'CC001'; });
      var cc002 = result.cardWiseSpending.find(function(c) { return c.cardId === 'CC002'; });
      expect(cc001.totalSpend).toBe(3000);
      expect(cc002.totalSpend).toBe(3000);
    });

    it('should aggregate spending by month and sort chronologically', function() {
      var transactions = [
        {transactionId: 'TXN001', cardId: 'CC001', amount: 1000, category: 'Food & Dining', date: new Date('2024-02-15')},
        {transactionId: 'TXN002', cardId: 'CC001', amount: 2000, category: 'Fuel', date: new Date('2024-01-18')},
        {transactionId: 'TXN003', cardId: 'CC002', amount: 3000, category: 'Shopping', date: new Date('2024-01-20')}
      ];
      var result = AnalyticsEngineService.aggregateSpending(transactions);
      expect(result.monthlyTrends.length).toBe(2);
      expect(result.monthlyTrends[0].month).toBe('2024-1');
      expect(result.monthlyTrends[0].totalSpend).toBe(5000);
      expect(result.monthlyTrends[1].month).toBe('2024-2');
      expect(result.monthlyTrends[1].totalSpend).toBe(1000);
    });

    it('should calculate percentage correctly for multiple categories', function() {
      var transactions = [
        {transactionId: 'TXN001', cardId: 'CC001', amount: 2500, category: 'Food & Dining', date: new Date('2024-01-15')},
        {transactionId: 'TXN002', cardId: 'CC001', amount: 5000, category: 'Travel', date: new Date('2024-01-18')},
        {transactionId: 'TXN003', cardId: 'CC002', amount: 2500, category: 'Shopping', date: new Date('2024-01-20')}
      ];
      var result = AnalyticsEngineService.aggregateSpending(transactions);
      expect(result.totalSpend).toBe(10000);
      var foodCategory = result.categorySpending.find(function(c) { return c.category === 'Food & Dining'; });
      var travelCategory = result.categorySpending.find(function(c) { return c.category === 'Travel'; });
      expect(foodCategory.percentage).toBe('25.00');
      expect(travelCategory.percentage).toBe('50.00');
    });

    it('should handle transactions from multiple cards in same category', function() {
      var transactions = [
        {transactionId: 'TXN001', cardId: 'CC001', amount: 1000, category: 'Food & Dining', date: new Date('2024-01-15')},
        {transactionId: 'TXN002', cardId: 'CC002', amount: 1500, category: 'Food & Dining', date: new Date('2024-01-18')},
        {transactionId: 'TXN003', cardId: 'CC003', amount: 2000, category: 'Food & Dining', date: new Date('2024-01-20')}
      ];
      var result = AnalyticsEngineService.aggregateSpending(transactions);
      expect(result.categorySpending.length).toBe(1);
      expect(result.categorySpending[0].totalAmount).toBe(4500);
      expect(result.categorySpending[0].transactionCount).toBe(3);
      expect(result.cardWiseSpending.length).toBe(3);
    });
  });
});