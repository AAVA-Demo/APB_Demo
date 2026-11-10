/*
Test Documentation:
- Test Name: AnalyticsDashboardController - initialization
- Purpose: Validates controller initializes with correct default state
- Scenario: Normal initialization
- Expected Result: Loading is true, transactions array is empty, aggregatedData is null
*/
/*
Test Documentation:
- Test Name: AnalyticsDashboardController - loadAnalytics success
- Purpose: Validates successful loading and aggregation of analytics data
- Scenario: Normal scenario with successful API response
- Expected Result: Transactions and aggregated data are populated
*/
/*
Test Documentation:
- Test Name: AnalyticsDashboardController - loadAnalytics error
- Purpose: Validates error handling when analytics loading fails
- Scenario: Error scenario with API failure
- Expected Result: Error message is set, loading is false
*/
/*
Coverage Report:
- Functions tested: loadAnalytics
- Scenarios covered: initialization, successful load, error handling, data aggregation
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AnalyticsDashboardController', function() {
    var $controller, $scope, $q, TransactionDataService, CategoryAggregationService;
    var controller;

    beforeEach(module('app.analytics'));

    beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
      $controller = _$controller_;
      $scope = _$rootScope_.$new();
      $q = _$q_;

      TransactionDataService = {
        getTransactions: jasmine.createSpy('getTransactions')
      };

      CategoryAggregationService = {
        aggregateByCategory: jasmine.createSpy('aggregateByCategory')
      };
    }));

    function createController() {
      return $controller('AnalyticsDashboardController', {
        $scope: $scope,
        TransactionDataService: TransactionDataService,
        CategoryAggregationService: CategoryAggregationService
      });
    }

    describe('initialization', function() {
      it('should initialize with default state', function() {
        var deferred = $q.defer();
        TransactionDataService.getTransactions.and.returnValue(deferred.promise);

        controller = createController();

        expect(controller.loading).toBe(true);
        expect(controller.transactions).toEqual([]);
        expect(controller.aggregatedData).toBeNull();
        expect(controller.error).toBeNull();
      });

      it('should call loadAnalytics on initialization', function() {
        var deferred = $q.defer();
        TransactionDataService.getTransactions.and.returnValue(deferred.promise);

        controller = createController();

        expect(TransactionDataService.getTransactions).toHaveBeenCalledWith(12);
      });
    });

    describe('loadAnalytics', function() {
      it('should load and aggregate analytics data successfully', function() {
        var mockTransactions = [
          { date: '2024-01-15', amount: 100, category: 'Food & Dining', cardId: 'card-1' },
          { date: '2024-01-20', amount: 50, category: 'Fuel', cardId: 'card-1' }
        ];
        var mockAggregatedData = {
          monthlyTrends: [{ month: '2024-01', totalSpend: 150 }],
          categoryBreakdown: [
            { category: 'Food & Dining', totalSpend: 100, percentage: '66.67' },
            { category: 'Fuel', totalSpend: 50, percentage: '33.33' }
          ]
        };

        var deferred = $q.defer();
        TransactionDataService.getTransactions.and.returnValue(deferred.promise);
        CategoryAggregationService.aggregateByCategory.and.returnValue(mockAggregatedData);

        controller = createController();
        deferred.resolve(mockTransactions);
        $scope.$digest();

        expect(controller.transactions).toEqual(mockTransactions);
        expect(controller.aggregatedData).toEqual(mockAggregatedData);
        expect(controller.loading).toBe(false);
        expect(controller.error).toBeNull();
        expect(CategoryAggregationService.aggregateByCategory).toHaveBeenCalledWith(mockTransactions);
      });

      it('should handle empty transaction list', function() {
        var mockAggregatedData = {
          monthlyTrends: [],
          categoryBreakdown: []
        };

        var deferred = $q.defer();
        TransactionDataService.getTransactions.and.returnValue(deferred.promise);
        CategoryAggregationService.aggregateByCategory.and.returnValue(mockAggregatedData);

        controller = createController();
        deferred.resolve([]);
        $scope.$digest();

        expect(controller.transactions).toEqual([]);
        expect(controller.aggregatedData).toEqual(mockAggregatedData);
        expect(controller.loading).toBe(false);
      });

      it('should handle analytics loading error', function() {
        spyOn(console, 'error');
        var deferred = $q.defer();
        TransactionDataService.getTransactions.and.returnValue(deferred.promise);

        controller = createController();
        deferred.reject('API Error');
        $scope.$digest();

        expect(controller.error).toBe('Failed to load analytics data. Please try again.');
        expect(controller.loading).toBe(false);
        expect(console.error).toHaveBeenCalledWith('Analytics load error:', 'API Error');
      });

      it('should set loading to true when loadAnalytics is called', function() {
        var deferred = $q.defer();
        TransactionDataService.getTransactions.and.returnValue(deferred.promise);

        controller = createController();
        controller.loading = false;
        controller.loadAnalytics();

        expect(controller.loading).toBe(true);
        expect(controller.error).toBeNull();
      });
    });
  });
})();