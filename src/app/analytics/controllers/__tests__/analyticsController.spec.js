/*
Test Documentation:
- Test Name: AnalyticsController - Initialization
- Purpose: Verify controller initializes with correct default state
- Scenario: Controller is instantiated
- Expected Result: All properties are initialized correctly
*/
/*
Test Documentation:
- Test Name: AnalyticsController - Load Analytics Success
- Purpose: Verify analytics data loads successfully
- Scenario: dataAnalyticsService returns valid data
- Expected Result: vm.analytics is populated and loading is false
*/
/*
Test Documentation:
- Test Name: AnalyticsController - Load Analytics Error
- Purpose: Verify error handling when analytics fail to load
- Scenario: dataAnalyticsService rejects promise
- Expected Result: vm.error is set and loading is false
*/
/*
Test Documentation:
- Test Name: AnalyticsController - Category Click
- Purpose: Verify category selection filters transactions
- Scenario: User clicks on a category
- Expected Result: selectedCategory is set and filteredTransactions contains only matching transactions
*/
/*
Coverage Report:
- Functions tested: initialization, loadAnalytics, onCategoryClick
- Scenarios covered: success path, error handling, category filtering
- Uncovered scenarios: none
*/

describe('AnalyticsController', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.analytics'));
  
  var $controller, $rootScope, $q, vm, mockDataAnalyticsService;
  
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    
    mockDataAnalyticsService = {
      getSpendingAnalytics: jasmine.createSpy('getSpendingAnalytics')
    };
  }));
  
  function createController() {
    var $scope = $rootScope.$new();
    vm = $controller('AnalyticsController', {
      $scope: $scope,
      $filter: {},
      dataAnalyticsService: mockDataAnalyticsService
    });
    return {vm: vm, $scope: $scope};
  }
  
  it('should initialize with correct default state', function() {
    mockDataAnalyticsService.getSpendingAnalytics.and.returnValue($q.resolve({}));
    var ctrl = createController();
    
    expect(ctrl.vm.analytics).toEqual({});
    expect(ctrl.vm.loading).toBe(true);
    expect(ctrl.vm.error).toBe(null);
    expect(ctrl.vm.selectedCategory).toBe(null);
    expect(ctrl.vm.filteredTransactions).toEqual([]);
    expect(ctrl.vm.dateRange).toBeDefined();
  });
  
  it('should load analytics successfully', function() {
    var mockAnalytics = {
      categories: [{categoryName: 'Food & Dining', totalSpend: 500}],
      monthlyTrends: [{month: '2024-01', totalSpend: 1000}],
      transactions: [{transactionId: 't1', category: 'Food & Dining', amount: 150}],
      totalSpend: 1000
    };
    mockDataAnalyticsService.getSpendingAnalytics.and.returnValue($q.resolve(mockAnalytics));
    
    var ctrl = createController();
    $rootScope.$digest();
    
    expect(ctrl.vm.analytics).toEqual(mockAnalytics);
    expect(ctrl.vm.loading).toBe(false);
    expect(ctrl.vm.error).toBe(null);
  });
  
  it('should handle analytics load error', function() {
    mockDataAnalyticsService.getSpendingAnalytics.and.returnValue($q.reject('Error'));
    
    var ctrl = createController();
    $rootScope.$digest();
    
    expect(ctrl.vm.error).toBe('Failed to load analytics');
    expect(ctrl.vm.loading).toBe(false);
  });
  
  it('should filter transactions when category is clicked', function() {
    var mockAnalytics = {
      transactions: [
        {transactionId: 't1', category: 'Food & Dining', amount: 150},
        {transactionId: 't2', category: 'Fuel', amount: 80},
        {transactionId: 't3', category: 'Food & Dining', amount: 200}
      ]
    };
    mockDataAnalyticsService.getSpendingAnalytics.and.returnValue($q.resolve(mockAnalytics));
    
    var ctrl = createController();
    $rootScope.$digest();
    
    var category = {categoryName: 'Food & Dining', totalSpend: 350};
    ctrl.vm.onCategoryClick(category);
    
    expect(ctrl.vm.selectedCategory).toEqual(category);
    expect(ctrl.vm.filteredTransactions.length).toBe(2);
    expect(ctrl.vm.filteredTransactions[0].transactionId).toBe('t1');
    expect(ctrl.vm.filteredTransactions[1].transactionId).toBe('t3');
  });
});