/*
Test Documentation:
- Test Name: AnalyticsController Unit Tests
- Purpose: Validate analytics controller for category-wise spending visualization
- Scenario: Test controller initialization, data loading, and category selection
- Expected Result: Controller should load analytics data and handle category interactions
*/

(function(){
'use strict';

describe('AnalyticsController', function() {
  var $controller, $scope, $q, TransactionDataService, CategoryAggregator;
  var controller;

  beforeEach(module('spendingAnalyticsModule'));

  beforeEach(inject(function(_$controller_, $rootScope, _$q_) {
    $controller = _$controller_;
    $scope = $rootScope.$new();
    $q = _$q_;

    var mockTransactions = [
      {id: 1, category: 'Food & Dining', amount: 100},
      {id: 2, category: 'Fuel', amount: 50}
    ];

    TransactionDataService = {
      getCategoryTransactions: jasmine.createSpy('getCategoryTransactions').and.returnValue($q.resolve(mockTransactions))
    };

    CategoryAggregator = {
      aggregateByCategory: jasmine.createSpy('aggregateByCategory').and.returnValue({
        categoryBreakdown: [
          {category: 'Food & Dining', totalSpend: 100, transactionCount: 1, percentage: 66.67},
          {category: 'Fuel', totalSpend: 50, transactionCount: 1, percentage: 33.33}
        ],
        totalSpend: 150,
        period: 'Current'
      })
    };
  }));

  function createController() {
    return $controller('AnalyticsController', {
      $scope: $scope,
      TransactionDataService: TransactionDataService,
      CategoryAggregator: CategoryAggregator
    });
  }

  describe('Initialization', function() {
    it('should initialize with default values', function() {
      controller = createController();
      expect(controller.analyticsData).toEqual({});
      expect(controller.selectedCategory).toBeNull();
      expect(controller.categoryTransactions).toEqual([]);
      expect(controller.loading).toBe(true);
    });

    it('should load analytics data on initialization', function() {
      controller = createController();
      $scope.$digest();

      expect(TransactionDataService.getCategoryTransactions).toHaveBeenCalled();
      expect(CategoryAggregator.aggregateByCategory).toHaveBeenCalled();
      expect(controller.loading).toBe(false);
      expect(controller.analyticsData.totalSpend).toBe(150);
    });
  });

  describe('Error Handling', function() {
    it('should handle error when loading analytics fails', function() {
      TransactionDataService.getCategoryTransactions.and.returnValue($q.reject('Error'));
      spyOn(console, 'error');

      controller = createController();
      $scope.$digest();

      expect(controller.loading).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Failed to load analytics:', 'Error');
    });
  });

  describe('onCategorySelect', function() {
    beforeEach(function() {
      controller = createController();
      $scope.$digest();
    });

    it('should set selected category', function() {
      controller.onCategorySelect('Food & Dining');
      expect(controller.selectedCategory).toBe('Food & Dining');
    });

    it('should filter transactions by selected category', function() {
      var mockTransactions = [
        {id: 1, category: 'Food & Dining', amount: 100},
        {id: 2, category: 'Fuel', amount: 50},
        {id: 3, category: 'Food & Dining', amount: 75}
      ];
      TransactionDataService.getCategoryTransactions.and.returnValue($q.resolve(mockTransactions));

      controller.onCategorySelect('Food & Dining');
      $scope.$digest();

      expect(controller.categoryTransactions.length).toBe(2);
      expect(controller.categoryTransactions[0].category).toBe('Food & Dining');
      expect(controller.categoryTransactions[1].category).toBe('Food & Dining');
    });

    it('should return empty array when no transactions match category', function() {
      var mockTransactions = [{id: 1, category: 'Fuel', amount: 50}];
      TransactionDataService.getCategoryTransactions.and.returnValue($q.resolve(mockTransactions));

      controller.onCategorySelect('Shopping');
      $scope.$digest();

      expect(controller.categoryTransactions.length).toBe(0);
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: Controller initialization, loadAnalytics, onCategorySelect
- Scenarios covered: Successful load, error handling, category filtering, empty results
- Edge cases: No matching transactions, service errors
- Uncovered scenarios: None - all interaction paths covered
*/