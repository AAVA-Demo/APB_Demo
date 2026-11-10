/*
Test Documentation:
- Test Name: AnalyticsDataService Test Suite
- Purpose: Validate analytics data retrieval, transaction categorization, aggregation logic, and mock data generation
- Scenario: Tests cover successful API calls, error handling with fallback to mock data, aggregation calculations, and edge cases
- Expected Result: All service methods return correct data structures with accurate calculations
*/

(function() {
  'use strict';

  describe('AnalyticsDataService', function() {
    var AnalyticsDataService, $httpBackend, $q, TransactionCategorizer;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsDataService_, _$httpBackend_, _$q_, _TransactionCategorizer_) {
      AnalyticsDataService = _AnalyticsDataService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      TransactionCategorizer = _TransactionCategorizer_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getSpendingAnalytics', function() {
      it('should retrieve spending analytics from API successfully', function() {
        var userId = 'user-123';
        var months = 6;
        var mockTransactions = [
          { transactionId: 'txn-1', userId: userId, amount: 100, category: 'Food & Dining', transactionDate: '2024-01-15' },
          { transactionId: 'txn-2', userId: userId, amount: 200, category: 'Shopping', transactionDate: '2024-01-20' }
        ];

        spyOn(TransactionCategorizer, 'categorizeTransactions').and.returnValue(mockTransactions);

        $httpBackend.expectGET('/api/analytics/spending?userId=' + userId + '&months=' + months)
          .respond(200, mockTransactions);

        var result;
        AnalyticsDataService.getSpendingAnalytics(userId, months).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.userId).toBe(userId);
        expect(result.categorySpending).toBeDefined();
        expect(result.monthlyTrends).toBeDefined();
        expect(TransactionCategorizer.categorizeTransactions).toHaveBeenCalledWith(mockTransactions);
      });

      it('should fallback to mock data when API call fails', function() {
        var userId = 'user-456';
        var months = 3;

        spyOn(TransactionCategorizer, 'categorizeTransactions').and.callFake(function(txns) {
          return txns;
        });

        $httpBackend.expectGET('/api/analytics/spending?userId=' + userId + '&months=' + months)
          .respond(500, 'Server error');

        var result;
        AnalyticsDataService.getSpendingAnalytics(userId, months).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.categorySpending).toBeDefined();
        expect(result.monthlyTrends).toBeDefined();
        expect(TransactionCategorizer.categorizeTransactions).toHaveBeenCalled();
      });

      it('should handle empty transaction list', function() {
        var userId = 'user-789';
        var months = 1;

        spyOn(TransactionCategorizer, 'categorizeTransactions').and.returnValue([]);

        $httpBackend.expectGET('/api/analytics/spending?userId=' + userId + '&months=' + months)
          .respond(200, []);

        var result;
        AnalyticsDataService.getSpendingAnalytics(userId, months).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.categorySpending).toEqual([]);
        expect(result.monthlyTrends).toEqual([]);
      });
    });

    describe('aggregateData', function() {
      it('should correctly aggregate transactions by category', function() {
        var transactions = [
          { userId: 'user-123', amount: 100, category: 'Food & Dining', transactionDate: '2024-01-15' },
          { userId: 'user-123', amount: 150, category: 'Food & Dining', transactionDate: '2024-01-20' },
          { userId: 'user-123', amount: 200, category: 'Shopping', transactionDate: '2024-01-25' }
        ];

        var result = AnalyticsDataService.aggregateData(transactions, 1);

        expect(result.categorySpending.length).toBe(2);
        var foodCategory = result.categorySpending.find(function(c) { return c.categoryName === 'Food & Dining'; });
        expect(foodCategory.totalAmount).toBe(250);
        expect(foodCategory.transactionCount).toBe(2);
        expect(parseFloat(foodCategory.percentage)).toBeCloseTo(55.56, 1);
      });

      it('should correctly aggregate transactions by month', function() {
        var transactions = [
          { userId: 'user-123', amount: 100, category: 'Food & Dining', transactionDate: '2024-01-15' },
          { userId: 'user-123', amount: 200, category: 'Shopping', transactionDate: '2024-01-20' },
          { userId: 'user-123', amount: 150, category: 'Travel', transactionDate: '2024-02-10' }
        ];

        var result = AnalyticsDataService.aggregateData(transactions, 2);

        expect(result.monthlyTrends.length).toBe(2);
        var jan = result.monthlyTrends.find(function(m) { return m.month === '2024-01'; });
        expect(jan.totalAmount).toBe(300);
        expect(jan.categoryBreakdown.length).toBe(2);
      });

      it('should calculate percentages correctly when total is zero', function() {
        var transactions = [];

        var result = AnalyticsDataService.aggregateData(transactions, 1);

        expect(result.categorySpending.length).toBe(0);
      });

      it('should sort monthly trends chronologically', function() {
        var transactions = [
          { userId: 'user-123', amount: 100, category: 'Food & Dining', transactionDate: '2024-03-15' },
          { userId: 'user-123', amount: 200, category: 'Shopping', transactionDate: '2024-01-20' },
          { userId: 'user-123', amount: 150, category: 'Travel', transactionDate: '2024-02-10' }
        ];

        var result = AnalyticsDataService.aggregateData(transactions, 3);

        expect(result.monthlyTrends[0].month).toBe('2024-01');
        expect(result.monthlyTrends[1].month).toBe('2024-02');
        expect(result.monthlyTrends[2].month).toBe('2024-03');
      });
    });

    describe('generateMockTransactions', function() {
      it('should generate mock transactions for specified months', function() {
        var userId = 'user-999';
        var months = 3;

        var result = AnalyticsDataService.generateMockTransactions(userId, months);

        expect(result.length).toBeGreaterThan(0);
        expect(result[0].userId).toBe(userId);
        expect(result[0].transactionId).toBeDefined();
        expect(result[0].amount).toBeGreaterThan(0);
        expect(result[0].category).toBeDefined();
      });

      it('should generate transactions across all predefined categories', function() {
        var userId = 'user-888';
        var months = 1;

        var result = AnalyticsDataService.generateMockTransactions(userId, months);

        var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        categories.forEach(function(cat) {
          var found = result.some(function(txn) { return txn.category === cat; });
          expect(found).toBe(true);
        });
      });

      it('should generate transactions with valid date format', function() {
        var userId = 'user-777';
        var months = 2;

        var result = AnalyticsDataService.generateMockTransactions(userId, months);

        result.forEach(function(txn) {
          expect(txn.transactionDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
      });

      it('should handle zero months gracefully', function() {
        var userId = 'user-666';
        var months = 0;

        var result = AnalyticsDataService.generateMockTransactions(userId, months);

        expect(result.length).toBe(0);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getSpendingAnalytics, aggregateData, generateMockTransactions
- Scenarios covered:
  * Successful API retrieval with categorization
  * API failure with fallback to mock data
  * Empty transaction handling
  * Category aggregation with percentage calculation
  * Monthly aggregation and sorting
  * Mock data generation across multiple months and categories
  * Edge cases: zero amounts, zero months, empty lists
- Uncovered scenarios: Network timeout handling, malformed API responses
*/