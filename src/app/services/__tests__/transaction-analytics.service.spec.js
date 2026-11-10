/*
Test Documentation:
- Test Name: TransactionAnalyticsService - getSpendingInsights success
- Purpose: Validates aggregation of spending insights by category and month
- Scenario: CategorizationService returns transactions, service aggregates by category and month
- Expected Result: Promise resolves with currentMonthSpending, monthlyTrends, and topCategory
*/
/*
Test Documentation:
- Test Name: TransactionAnalyticsService - getSpendingInsights handles empty transactions
- Purpose: Validates handling of empty transaction list
- Scenario: CategorizationService returns empty array
- Expected Result: Returns insights with zero amounts and empty arrays
*/
/*
Test Documentation:
- Test Name: TransactionAnalyticsService - getSpendingInsights handles categorization failure
- Purpose: Validates error handling when categorization service fails
- Scenario: CategorizationService.getCategorizedTransactions rejects
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: TransactionAnalyticsService - aggregateByCategory
- Purpose: Validates category aggregation logic across nine predefined categories
- Scenario: Transactions with various categories are aggregated
- Expected Result: Returns array with correct amounts and percentages per category
*/
/*
Test Documentation:
- Test Name: TransactionAnalyticsService - aggregateByMonth
- Purpose: Validates monthly trend aggregation
- Scenario: Transactions spanning multiple months are aggregated
- Expected Result: Returns sorted array of monthly totals
*/
/*
Coverage Report:
- Functions tested: getSpendingInsights, aggregateByCategory, aggregateByMonth, findTopCategory
- Scenarios covered: success with data, empty data, service failures, all nine categories
- Uncovered scenarios: none
*/

describe('TransactionAnalyticsService', function() {
  'use strict';

  beforeEach(module('app.analytics'));

  var TransactionAnalyticsService, CategorizationService, $q, $rootScope;

  beforeEach(inject(function(_TransactionAnalyticsService_, _CategorizationService_, _$q_, _$rootScope_) {
    TransactionAnalyticsService = _TransactionAnalyticsService_;
    CategorizationService = _CategorizationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getSpendingInsights', function() {
    it('should aggregate spending insights successfully', function(done) {
      var mockTransactions = [
        { date: '2023-01-15', category: 'Food & Dining', amount: 100 },
        { date: '2023-01-14', category: 'Fuel', amount: 60 },
        { date: '2023-01-13', category: 'Shopping', amount: 200 },
        { date: '2023-02-10', category: 'Food & Dining', amount: 80 }
      ];

      spyOn(CategorizationService, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));

      TransactionAnalyticsService.getSpendingInsights().then(function(result) {
        expect(result.currentMonthSpending).toBeDefined();
        expect(result.currentMonthSpending.length).toBe(9);
        expect(result.monthlyTrends).toBeDefined();
        expect(result.topCategory).toBeDefined();
        expect(result.lastUpdated).toBeDefined();
        expect(CategorizationService.getCategorizedTransactions).toHaveBeenCalled();
        done();
      });

      $rootScope.$digest();
    });

    it('should handle empty transactions', function(done) {
      spyOn(CategorizationService, 'getCategorizedTransactions').and.returnValue($q.resolve([]));

      TransactionAnalyticsService.getSpendingInsights().then(function(result) {
        expect(result.currentMonthSpending.length).toBe(9);
        result.currentMonthSpending.forEach(function(cat) {
          expect(cat.amount).toBe(0);
          expect(cat.transactionCount).toBe(0);
        });
        expect(result.monthlyTrends.length).toBe(0);
        expect(result.topCategory).toBe('N/A');
        done();
      });

      $rootScope.$digest();
    });

    it('should reject when categorization service fails', function(done) {
      spyOn(CategorizationService, 'getCategorizedTransactions').and.returnValue($q.reject('Categorization error'));

      TransactionAnalyticsService.getSpendingInsights().catch(function(error) {
        expect(error).toBe('Categorization error');
        done();
      });

      $rootScope.$digest();
    });

    it('should identify top spending category correctly', function(done) {
      var mockTransactions = [
        { date: '2023-01-15', category: 'Food & Dining', amount: 100 },
        { date: '2023-01-14', category: 'Shopping', amount: 500 },
        { date: '2023-01-13', category: 'Fuel', amount: 60 }
      ];

      spyOn(CategorizationService, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));

      TransactionAnalyticsService.getSpendingInsights().then(function(result) {
        expect(result.topCategory).toBe('Shopping');
        done();
      });

      $rootScope.$digest();
    });

    it('should aggregate all nine predefined categories', function(done) {
      var mockTransactions = [
        { date: '2023-01-15', category: 'Food & Dining', amount: 100 },
        { date: '2023-01-14', category: 'Fuel', amount: 60 },
        { date: '2023-01-13', category: 'Shopping', amount: 200 },
        { date: '2023-01-12', category: 'Travel', amount: 300 },
        { date: '2023-01-11', category: 'Entertainment', amount: 80 },
        { date: '2023-01-10', category: 'Utilities', amount: 150 },
        { date: '2023-01-09', category: 'Healthcare', amount: 200 },
        { date: '2023-01-08', category: 'Education', amount: 500 },
        { date: '2023-01-07', category: 'Miscellaneous', amount: 25 }
      ];

      spyOn(CategorizationService, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));

      TransactionAnalyticsService.getSpendingInsights().then(function(result) {
        var categories = result.currentMonthSpending.map(function(c) { return c.category; });
        expect(categories).toContain('Food & Dining');
        expect(categories).toContain('Fuel');
        expect(categories).toContain('Shopping');
        expect(categories).toContain('Travel');
        expect(categories).toContain('Entertainment');
        expect(categories).toContain('Utilities');
        expect(categories).toContain('Healthcare');
        expect(categories).toContain('Education');
        expect(categories).toContain('Miscellaneous');
        done();
      });

      $rootScope.$digest();
    });

    it('should aggregate monthly trends correctly', function(done) {
      var mockTransactions = [
        { date: '2023-01-15', category: 'Food & Dining', amount: 100 },
        { date: '2023-01-14', category: 'Fuel', amount: 60 },
        { date: '2023-02-10', category: 'Shopping', amount: 200 },
        { date: '2023-02-09', category: 'Travel', amount: 300 },
        { date: '2023-03-05', category: 'Entertainment', amount: 80 }
      ];

      spyOn(CategorizationService, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));

      TransactionAnalyticsService.getSpendingInsights().then(function(result) {
        expect(result.monthlyTrends.length).toBe(3);
        expect(result.monthlyTrends[0].month).toBe('2023-01');
        expect(result.monthlyTrends[0].totalSpend).toBe(160);
        expect(result.monthlyTrends[1].month).toBe('2023-02');
        expect(result.monthlyTrends[1].totalSpend).toBe(500);
        expect(result.monthlyTrends[2].month).toBe('2023-03');
        expect(result.monthlyTrends[2].totalSpend).toBe(80);
        done();
      });

      $rootScope.$digest();
    });

    it('should calculate percentages correctly', function(done) {
      var mockTransactions = [
        { date: '2023-01-15', category: 'Food & Dining', amount: 100 },
        { date: '2023-01-14', category: 'Shopping', amount: 400 }
      ];

      spyOn(CategorizationService, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));

      TransactionAnalyticsService.getSpendingInsights().then(function(result) {
        var foodDining = result.currentMonthSpending.find(function(c) { return c.category === 'Food & Dining'; });
        var shopping = result.currentMonthSpending.find(function(c) { return c.category === 'Shopping'; });
        expect(foodDining.percentage).toBe(20);
        expect(shopping.percentage).toBe(80);
        done();
      });

      $rootScope.$digest();
    });

    it('should handle transactions with missing category', function(done) {
      var mockTransactions = [
        { date: '2023-01-15', amount: 100 },
        { date: '2023-01-14', category: 'Fuel', amount: 60 }
      ];

      spyOn(CategorizationService, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));

      TransactionAnalyticsService.getSpendingInsights().then(function(result) {
        var miscellaneous = result.currentMonthSpending.find(function(c) { return c.category === 'Miscellaneous'; });
        expect(miscellaneous.amount).toBe(100);
        done();
      });

      $rootScope.$digest();
    });
  });
});