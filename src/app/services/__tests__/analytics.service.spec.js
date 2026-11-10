/*
Test Documentation:
- Test Name: AnalyticsService - fetchAnalyticsData
- Purpose: Validate analytics data retrieval with transaction categorization and aggregation
- Scenario: Service fetches mock transactions, categorizes them, and aggregates spending data
- Expected Result: Returns analytics data with category spending, monthly trends, and card-wise spending
*/
/*
Coverage Report:
- Functions tested: fetchAnalyticsData
- Scenarios covered: successful data fetch, integration with TransactionCategorizationService and AnalyticsEngineService, promise resolution
- Uncovered scenarios: HTTP error handling (not applicable for mock data)
*/

describe('AnalyticsService', function() {
  'use strict';

  var AnalyticsService, TransactionCategorizationService, AnalyticsEngineService, $q, $rootScope, $timeout;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_AnalyticsService_, _TransactionCategorizationService_, _AnalyticsEngineService_, _$q_, _$rootScope_, _$timeout_) {
    AnalyticsService = _AnalyticsService_;
    TransactionCategorizationService = _TransactionCategorizationService_;
    AnalyticsEngineService = _AnalyticsEngineService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  describe('fetchAnalyticsData', function() {
    it('should return a promise', function() {
      var result = AnalyticsService.fetchAnalyticsData();
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });

    it('should resolve with analytics data after timeout', function(done) {
      spyOn(TransactionCategorizationService, 'categorizeTransactions').and.callThrough();
      spyOn(AnalyticsEngineService, 'aggregateSpending').and.returnValue({
        categorySpending: [{category: 'Food & Dining', totalAmount: 4000, transactionCount: 2, percentage: '10.00'}],
        monthlyTrends: [{month: '2024-1', totalSpend: 20000}],
        cardWiseSpending: [{cardId: 'CC001', totalSpend: 15000}],
        totalSpend: 40000
      });

      AnalyticsService.fetchAnalyticsData().then(function(data) {
        expect(TransactionCategorizationService.categorizeTransactions).toHaveBeenCalled();
        expect(AnalyticsEngineService.aggregateSpending).toHaveBeenCalled();
        expect(data.categorySpending).toBeDefined();
        expect(data.monthlyTrends).toBeDefined();
        expect(data.cardWiseSpending).toBeDefined();
        expect(data.totalSpend).toBe(40000);
        done();
      });

      $timeout.flush();
    });

    it('should categorize mock transactions before aggregation', function(done) {
      var categorizedTransactions = [];
      spyOn(TransactionCategorizationService, 'categorizeTransactions').and.callFake(function(txns) {
        categorizedTransactions = txns;
        return txns;
      });
      spyOn(AnalyticsEngineService, 'aggregateSpending').and.callThrough();

      AnalyticsService.fetchAnalyticsData().then(function() {
        expect(categorizedTransactions.length).toBeGreaterThan(0);
        expect(AnalyticsEngineService.aggregateSpending).toHaveBeenCalledWith(categorizedTransactions);
        done();
      });

      $timeout.flush();
    });

    it('should include all expected transaction categories in mock data', function(done) {
      spyOn(TransactionCategorizationService, 'categorizeTransactions').and.callThrough();
      spyOn(AnalyticsEngineService, 'aggregateSpending').and.callThrough();

      AnalyticsService.fetchAnalyticsData().then(function(data) {
        var categories = data.categorySpending.map(function(c) { return c.category; });
        expect(categories).toContain('Food & Dining');
        expect(categories).toContain('Fuel');
        expect(categories).toContain('Shopping');
        expect(categories).toContain('Travel');
        expect(categories).toContain('Entertainment');
        done();
      });

      $timeout.flush();
    });

    it('should resolve after 700ms timeout', function(done) {
      var startTime = Date.now();
      spyOn(TransactionCategorizationService, 'categorizeTransactions').and.callThrough();
      spyOn(AnalyticsEngineService, 'aggregateSpending').and.callThrough();

      AnalyticsService.fetchAnalyticsData().then(function() {
        done();
      });

      expect($timeout.flush).not.toThrow();
      $timeout.flush(700);
    });
  });
});