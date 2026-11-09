/*
Test Documentation:
- Test Name: analyticsEngineService - processTransactions
- Purpose: Validates transaction processing, monthly trend calculation, category breakdown, and top spending categories identification
- Scenario: Tests with valid transactions, empty arrays, single transaction, multiple months, and category aggregation
- Expected Result: Returns correct monthly trends, category breakdown with percentages, and top 3 spending categories
*/
/*
Coverage Report:
- Functions tested: processTransactions, calculateMonthlyTrends, calculateCategoryBreakdown
- Scenarios covered: normal flow, empty input, single transaction, multiple months, category aggregation, percentage calculation
- Uncovered scenarios: none
*/

describe('analyticsEngineService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var analyticsEngineService;
  var categoryClassificationService;

  beforeEach(inject(function(_analyticsEngineService_, _categoryClassificationService_) {
    analyticsEngineService = _analyticsEngineService_;
    categoryClassificationService = _categoryClassificationService_;
  }));

  describe('processTransactions', function() {
    it('should process transactions and return analytics data', function() {
      var transactions = [
        { transactionDate: '2023-01-15', amount: 100, category: 'Food & Dining' },
        { transactionDate: '2023-01-20', amount: 50, category: 'Fuel' },
        { transactionDate: '2023-02-10', amount: 200, category: 'Shopping' }
      ];

      spyOn(categoryClassificationService, 'categorize').and.callFake(function(t) {
        return t.category;
      });

      var result = analyticsEngineService.processTransactions(transactions);

      expect(result.monthlyTrends).toBeDefined();
      expect(result.categoryBreakdown).toBeDefined();
      expect(result.topSpendingCategories).toBeDefined();
      expect(result.spendingPatterns).toBe('Analysis based on 3 transactions');
    });

    it('should handle empty transactions array', function() {
      var result = analyticsEngineService.processTransactions([]);

      expect(result.monthlyTrends.length).toBe(0);
      expect(result.categoryBreakdown.length).toBe(0);
      expect(result.topSpendingCategories.length).toBe(0);
      expect(result.spendingPatterns).toBe('Analysis based on 0 transactions');
    });

    it('should calculate monthly trends correctly', function() {
      var transactions = [
        { transactionDate: '2023-01-15', amount: 100, category: 'Food & Dining' },
        { transactionDate: '2023-01-20', amount: 50, category: 'Fuel' },
        { transactionDate: '2023-02-10', amount: 200, category: 'Shopping' }
      ];

      spyOn(categoryClassificationService, 'categorize').and.callFake(function(t) {
        return t.category;
      });

      var result = analyticsEngineService.processTransactions(transactions);

      expect(result.monthlyTrends.length).toBe(2);
      expect(result.monthlyTrends[0].month).toBe('2023-01');
      expect(result.monthlyTrends[0].totalSpend).toBe(150);
      expect(result.monthlyTrends[1].month).toBe('2023-02');
      expect(result.monthlyTrends[1].totalSpend).toBe(200);
    });

    it('should calculate category breakdown with percentages', function() {
      var transactions = [
        { transactionDate: '2023-01-15', amount: 100, category: 'Food & Dining' },
        { transactionDate: '2023-01-20', amount: 50, category: 'Fuel' },
        { transactionDate: '2023-02-10', amount: 50, category: 'Fuel' }
      ];

      spyOn(categoryClassificationService, 'categorize').and.callFake(function(t) {
        return t.category;
      });

      var result = analyticsEngineService.processTransactions(transactions);

      expect(result.categoryBreakdown.length).toBe(2);
      expect(result.categoryBreakdown[0].category).toBe('Fuel');
      expect(result.categoryBreakdown[0].totalSpend).toBe(100);
      expect(result.categoryBreakdown[0].percentage).toBe(50);
    });

    it('should identify top 3 spending categories', function() {
      var transactions = [
        { transactionDate: '2023-01-15', amount: 300, category: 'Shopping' },
        { transactionDate: '2023-01-20', amount: 200, category: 'Food & Dining' },
        { transactionDate: '2023-02-10', amount: 150, category: 'Fuel' },
        { transactionDate: '2023-02-15', amount: 100, category: 'Travel' }
      ];

      spyOn(categoryClassificationService, 'categorize').and.callFake(function(t) {
        return t.category;
      });

      var result = analyticsEngineService.processTransactions(transactions);

      expect(result.topSpendingCategories.length).toBe(3);
      expect(result.topSpendingCategories[0]).toBe('Shopping');
      expect(result.topSpendingCategories[1]).toBe('Food & Dining');
      expect(result.topSpendingCategories[2]).toBe('Fuel');
    });

    it('should sort monthly trends chronologically', function() {
      var transactions = [
        { transactionDate: '2023-03-15', amount: 100, category: 'Food & Dining' },
        { transactionDate: '2023-01-20', amount: 50, category: 'Fuel' },
        { transactionDate: '2023-02-10', amount: 200, category: 'Shopping' }
      ];

      spyOn(categoryClassificationService, 'categorize').and.callFake(function(t) {
        return t.category;
      });

      var result = analyticsEngineService.processTransactions(transactions);

      expect(result.monthlyTrends[0].month).toBe('2023-01');
      expect(result.monthlyTrends[1].month).toBe('2023-02');
      expect(result.monthlyTrends[2].month).toBe('2023-03');
    });

    it('should handle single transaction', function() {
      var transactions = [
        { transactionDate: '2023-01-15', amount: 100, category: 'Food & Dining' }
      ];

      spyOn(categoryClassificationService, 'categorize').and.returnValue('Food & Dining');

      var result = analyticsEngineService.processTransactions(transactions);

      expect(result.monthlyTrends.length).toBe(1);
      expect(result.categoryBreakdown.length).toBe(1);
      expect(result.categoryBreakdown[0].percentage).toBe(100);
    });
  });
});