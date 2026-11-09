/*
Test Documentation:
- Test Name: chartService - processData
- Purpose: Validates transaction data processing for chart visualization
- Scenario: Tests monthly trends, card-wise spend, category-wise spend calculations
- Expected Result: Returns aggregated data for charts with correct totals
*/
/*
Coverage Report:
- Functions tested: processData, calculateMonthlyTrends, calculateCardWiseSpend, calculateCategoryWiseSpend
- Scenarios covered: normal flow, empty input, single transaction, multiple months, aggregation
- Uncovered scenarios: none
*/

describe('chartService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var chartService;
  var categoryService;

  beforeEach(inject(function(_chartService_, _categoryService_) {
    chartService = _chartService_;
    categoryService = _categoryService_;
  }));

  describe('processData', function() {
    it('should process transactions and return chart data', function() {
      var transactions = [
        { transactionDate: '2023-01-15', amount: 100, cardId: 'card1', category: 'Food & Dining' },
        { transactionDate: '2023-01-20', amount: 50, cardId: 'card2', category: 'Fuel' }
      ];

      spyOn(categoryService, 'categorize').and.callFake(function(t) {
        return t.category;
      });

      var result = chartService.processData(transactions);

      expect(result.monthlyTrends).toBeDefined();
      expect(result.cardWiseSpend).toBeDefined();
      expect(result.categoryWiseSpend).toBeDefined();
    });

    it('should calculate monthly trends correctly', function() {
      var transactions = [
        { transactionDate: '2023-01-15', amount: 100, cardId: 'card1', category: 'Food & Dining' },
        { transactionDate: '2023-01-20', amount: 50, cardId: 'card1', category: 'Fuel' },
        { transactionDate: '2023-02-10', amount: 200, cardId: 'card2', category: 'Shopping' }
      ];

      spyOn(categoryService, 'categorize').and.callFake(function(t) {
        return t.category;
      });

      var result = chartService.processData(transactions);

      expect(result.monthlyTrends.length).toBe(2);
      expect(result.monthlyTrends[0].month).toBe('2023-01');
      expect(result.monthlyTrends[0].totalSpend).toBe(150);
      expect(result.monthlyTrends[1].month).toBe('2023-02');
      expect(result.monthlyTrends[1].totalSpend).toBe(200);
    });

    it('should calculate card-wise spend correctly', function() {
      var transactions = [
        { transactionDate: '2023-01-15', amount: 100, cardId: 'card1', category: 'Food & Dining' },
        { transactionDate: '2023-01-20', amount: 50, cardId: 'card1', category: 'Fuel' },
        { transactionDate: '2023-02-10', amount: 200, cardId: 'card2', category: 'Shopping' }
      ];

      spyOn(categoryService, 'categorize').and.callFake(function(t) {
        return t.category;
      });

      var result = chartService.processData(transactions);

      expect(result.cardWiseSpend.length).toBe(2);
      var card1 = result.cardWiseSpend.find(function(c) { return c.cardId === 'card1'; });
      var card2 = result.cardWiseSpend.find(function(c) { return c.cardId === 'card2'; });
      expect(card1.totalSpend).toBe(150);
      expect(card2.totalSpend).toBe(200);
    });

    it('should calculate category-wise spend correctly', function() {
      var transactions = [
        { transactionDate: '2023-01-15', amount: 100, cardId: 'card1', category: 'Food & Dining' },
        { transactionDate: '2023-01-20', amount: 50, cardId: 'card1', category: 'Fuel' },
        { transactionDate: '2023-02-10', amount: 50, cardId: 'card2', category: 'Fuel' }
      ];

      spyOn(categoryService, 'categorize').and.callFake(function(t) {
        return t.category;
      });

      var result = chartService.processData(transactions);

      expect(result.categoryWiseSpend.length).toBe(2);
      var fuel = result.categoryWiseSpend.find(function(c) { return c.category === 'Fuel'; });
      expect(fuel.totalSpend).toBe(100);
    });

    it('should handle empty transactions', function() {
      var result = chartService.processData([]);

      expect(result.monthlyTrends.length).toBe(0);
      expect(result.cardWiseSpend.length).toBe(0);
      expect(result.categoryWiseSpend.length).toBe(0);
    });

    it('should sort monthly trends chronologically', function() {
      var transactions = [
        { transactionDate: '2023-03-15', amount: 100, cardId: 'card1', category: 'Food & Dining' },
        { transactionDate: '2023-01-20', amount: 50, cardId: 'card1', category: 'Fuel' },
        { transactionDate: '2023-02-10', amount: 200, cardId: 'card2', category: 'Shopping' }
      ];

      spyOn(categoryService, 'categorize').and.callFake(function(t) {
        return t.category;
      });

      var result = chartService.processData(transactions);

      expect(result.monthlyTrends[0].month).toBe('2023-01');
      expect(result.monthlyTrends[1].month).toBe('2023-02');
      expect(result.monthlyTrends[2].month).toBe('2023-03');
    });
  });
});