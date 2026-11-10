/*
Test Documentation:
- Test Name: AnalyticsService Unit Tests
- Purpose: Validate getSpendingInsights method for retrieving and processing spending analytics data
- Scenario: Successful data retrieval, error handling from dependencies, integration with TransactionDataFactory, CategoryClassificationFactory, and AnalyticsEngineService
- Expected Result: Resolved promise with insights containing categoryBreakdown, monthlyTrends, and dateRange; proper error propagation
*/

describe('AnalyticsService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var AnalyticsService, TransactionDataFactory, CategoryClassificationFactory, AnalyticsEngineService, $q, $rootScope;

  beforeEach(inject(function(_AnalyticsService_, _TransactionDataFactory_, _CategoryClassificationFactory_, _AnalyticsEngineService_, _$q_, _$rootScope_) {
    AnalyticsService = _AnalyticsService_;
    TransactionDataFactory = _TransactionDataFactory_;
    CategoryClassificationFactory = _CategoryClassificationFactory_;
    AnalyticsEngineService = _AnalyticsEngineService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getSpendingInsights', function() {

    it('should retrieve spending insights successfully', function() {
      var dateRange = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31')
      };
      var mockTransactions = [
        { date: '2023-01-15', category: 'Food & Dining', amount: 50.00 },
        { date: '2023-02-20', category: 'Fuel', amount: 60.00 }
      ];
      var mockCategories = [
        { name: 'Food & Dining' },
        { name: 'Fuel' }
      ];
      var mockInsights = {
        categoryBreakdown: [
          { category: 'Food & Dining', amount: 50.00, percentage: '45.45', transactionCount: 1 },
          { category: 'Fuel', amount: 60.00, percentage: '54.55', transactionCount: 1 }
        ],
        monthlyTrends: [
          { month: '2023-01', totalSpend: 50.00, categoryBreakdown: [] },
          { month: '2023-02', totalSpend: 60.00, categoryBreakdown: [] }
        ]
      };

      spyOn(TransactionDataFactory, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategoryClassificationFactory, 'getCategoryMappings').and.returnValue($q.resolve(mockCategories));
      spyOn(AnalyticsEngineService, 'aggregateByCategory').and.returnValue(mockInsights);

      var result;
      AnalyticsService.getSpendingInsights(dateRange).then(function(insights) {
        result = insights;
      });

      $rootScope.$digest();

      expect(TransactionDataFactory.getTransactions).toHaveBeenCalledWith(dateRange);
      expect(CategoryClassificationFactory.getCategoryMappings).toHaveBeenCalled();
      expect(AnalyticsEngineService.aggregateByCategory).toHaveBeenCalledWith(mockTransactions, mockCategories);
      expect(result).toBeDefined();
      expect(result.categoryBreakdown).toEqual(mockInsights.categoryBreakdown);
      expect(result.monthlyTrends).toEqual(mockInsights.monthlyTrends);
      expect(result.dateRange).toEqual(dateRange);
    });

    it('should attach dateRange to insights', function() {
      var dateRange = {
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-06-30')
      };
      var mockTransactions = [];
      var mockCategories = [];
      var mockInsights = {
        categoryBreakdown: [],
        monthlyTrends: []
      };

      spyOn(TransactionDataFactory, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategoryClassificationFactory, 'getCategoryMappings').and.returnValue($q.resolve(mockCategories));
      spyOn(AnalyticsEngineService, 'aggregateByCategory').and.returnValue(mockInsights);

      var result;
      AnalyticsService.getSpendingInsights(dateRange).then(function(insights) {
        result = insights;
      });

      $rootScope.$digest();

      expect(result.dateRange).toBe(dateRange);
    });

    it('should handle error from TransactionDataFactory', function() {
      var dateRange = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31')
      };
      var mockError = { status: 500, message: 'Server error' };

      spyOn(TransactionDataFactory, 'getTransactions').and.returnValue($q.reject(mockError));
      spyOn(CategoryClassificationFactory, 'getCategoryMappings').and.returnValue($q.resolve([]));

      var error;
      AnalyticsService.getSpendingInsights(dateRange).catch(function(err) {
        error = err;
      });

      $rootScope.$digest();

      expect(error).toEqual(mockError);
    });

    it('should handle error from CategoryClassificationFactory', function() {
      var dateRange = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31')
      };
      var mockError = { status: 404, message: 'Categories not found' };

      spyOn(TransactionDataFactory, 'getTransactions').and.returnValue($q.resolve([]));
      spyOn(CategoryClassificationFactory, 'getCategoryMappings').and.returnValue($q.reject(mockError));

      var error;
      AnalyticsService.getSpendingInsights(dateRange).catch(function(err) {
        error = err;
      });

      $rootScope.$digest();

      expect(error).toEqual(mockError);
    });

    it('should call $q.all to retrieve both transactions and categories', function() {
      var dateRange = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31')
      };

      spyOn(TransactionDataFactory, 'getTransactions').and.returnValue($q.resolve([]));
      spyOn(CategoryClassificationFactory, 'getCategoryMappings').and.returnValue($q.resolve([]));
      spyOn(AnalyticsEngineService, 'aggregateByCategory').and.returnValue({ categoryBreakdown: [], monthlyTrends: [] });
      spyOn($q, 'all').and.callThrough();

      AnalyticsService.getSpendingInsights(dateRange);
      $rootScope.$digest();

      expect($q.all).toHaveBeenCalled();
    });

    it('should process insights with valid transactions and categories', function() {
      var dateRange = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31')
      };
      var mockTransactions = [
        { date: '2023-01-10', category: 'Shopping', amount: 100.00 }
      ];
      var mockCategories = [
        { name: 'Shopping' }
      ];
      var mockInsights = {
        categoryBreakdown: [{ category: 'Shopping', amount: 100.00, percentage: '100.00', transactionCount: 1 }],
        monthlyTrends: [{ month: '2023-01', totalSpend: 100.00, categoryBreakdown: [] }]
      };

      spyOn(TransactionDataFactory, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategoryClassificationFactory, 'getCategoryMappings').and.returnValue($q.resolve(mockCategories));
      spyOn(AnalyticsEngineService, 'aggregateByCategory').and.returnValue(mockInsights);

      var result;
      AnalyticsService.getSpendingInsights(dateRange).then(function(insights) {
        result = insights;
      });

      $rootScope.$digest();

      expect(result.categoryBreakdown.length).toBe(1);
      expect(result.monthlyTrends.length).toBe(1);
    });

    it('should return promise that resolves with insights object', function() {
      var dateRange = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31')
      };

      spyOn(TransactionDataFactory, 'getTransactions').and.returnValue($q.resolve([]));
      spyOn(CategoryClassificationFactory, 'getCategoryMappings').and.returnValue($q.resolve([]));
      spyOn(AnalyticsEngineService, 'aggregateByCategory').and.returnValue({ categoryBreakdown: [], monthlyTrends: [] });

      var promise = AnalyticsService.getSpendingInsights(dateRange);

      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });

    it('should handle empty transactions and categories gracefully', function() {
      var dateRange = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31')
      };
      var mockInsights = {
        categoryBreakdown: [],
        monthlyTrends: []
      };

      spyOn(TransactionDataFactory, 'getTransactions').and.returnValue($q.resolve([]));
      spyOn(CategoryClassificationFactory, 'getCategoryMappings').and.returnValue($q.resolve([]));
      spyOn(AnalyticsEngineService, 'aggregateByCategory').and.returnValue(mockInsights);

      var result;
      AnalyticsService.getSpendingInsights(dateRange).then(function(insights) {
        result = insights;
      });

      $rootScope.$digest();

      expect(result.categoryBreakdown).toEqual([]);
      expect(result.monthlyTrends).toEqual([]);
    });

  });

});

/*
Coverage Report:
- Functions tested: getSpendingInsights
- Scenarios covered:
  * Successful retrieval of spending insights
  * DateRange attachment to insights
  * Error handling from TransactionDataFactory
  * Error handling from CategoryClassificationFactory
  * $q.all integration for parallel data retrieval
  * Processing with valid transactions and categories
  * Promise resolution validation
  * Empty data handling
- Uncovered scenarios: None - comprehensive coverage achieved
- Dependencies mocked: TransactionDataFactory, CategoryClassificationFactory, AnalyticsEngineService
*/