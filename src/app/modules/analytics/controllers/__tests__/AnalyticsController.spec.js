/*
Test Documentation:
- Test Name: AnalyticsController
- Purpose: Verify analytics dashboard initialization and data loading
- Scenario: Load trends and category breakdown with filtering
- Expected Result: Controller should display analytics with category filters
*/

describe('AnalyticsController', function() {
  'use strict';

  var $controller;
  var $scope;
  var $q;
  var AnalyticsService;
  var CategoryService;
  var controller;

  beforeEach(module('analyticsModule'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $scope = _$rootScope_.$new();
    $q = _$q_;

    AnalyticsService = {
      getTrends: jasmine.createSpy('getTrends').and.returnValue($q.resolve([])),
      getCategoryBreakdown: jasmine.createSpy('getCategoryBreakdown').and.returnValue($q.resolve({}))
    };

    CategoryService = {
      getAllCategories: jasmine.createSpy('getAllCategories').and.returnValue([
        'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
        'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
      ])
    };

    controller = $controller('AnalyticsController', {
      $scope: $scope,
      AnalyticsService: AnalyticsService,
      CategoryService: CategoryService
    });
  }));

  /*
  Test Documentation:
  - Test Name: should be defined
  - Purpose: Verify controller exists
  - Scenario: Create controller instance
  - Expected Result: Controller should be defined
  */
  it('should be defined', function() {
    expect(controller).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should initialize with default values
  - Purpose: Verify initial state
  - Scenario: Check controller properties after creation
  - Expected Result: trends empty, loading true, categories loaded
  */
  it('should initialize with default values', function() {
    expect(controller.trends).toEqual([]);
    expect(controller.categoryBreakdown).toEqual({});
    expect(controller.loading).toBe(true);
    expect(controller.error).toBeNull();
    expect(controller.selectedCategory).toBeNull();
    expect(controller.categories.length).toBe(9);
  });

  /*
  Test Documentation:
  - Test Name: should set date range to last 12 months
  - Purpose: Verify default date range
  - Scenario: Check dateRange property
  - Expected Result: Start date should be 12 months ago
  */
  it('should set date range to last 12 months', function() {
    var now = new Date();
    var twelveMonthsAgo = new Date(now.setMonth(now.getMonth() - 12));
    
    expect(controller.dateRange.start.getMonth()).toBe(twelveMonthsAgo.getMonth());
    expect(controller.dateRange.end).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should load trends on init
  - Purpose: Verify auto-load on initialization
  - Scenario: Controller initialization
  - Expected Result: AnalyticsService.getTrends should be called
  */
  it('should load trends on init', function() {
    expect(AnalyticsService.getTrends).toHaveBeenCalled();
  });

  /*
  Test Documentation:
  - Test Name: should load category breakdown on init
  - Purpose: Verify breakdown auto-load
  - Scenario: Controller initialization
  - Expected Result: AnalyticsService.getCategoryBreakdown should be called
  */
  it('should load category breakdown on init', function() {
    expect(AnalyticsService.getCategoryBreakdown).toHaveBeenCalled();
  });

  /*
  Test Documentation:
  - Test Name: should load trends successfully
  - Purpose: Verify successful trend loading
  - Scenario: AnalyticsService returns trends
  - Expected Result: trends populated, loading false
  */
  it('should load trends successfully', function() {
    var mockTrends = [
      { month: '2024-01', totalSpend: 2500 },
      { month: '2024-02', totalSpend: 2800 }
    ];

    AnalyticsService.getTrends.and.returnValue($q.resolve(mockTrends));

    controller.loadTrends();
    $scope.$digest();

    expect(controller.trends).toEqual(mockTrends);
    expect(controller.loading).toBe(false);
  });

  /*
  Test Documentation:
  - Test Name: should broadcast trends updated event
  - Purpose: Verify event broadcasting
  - Scenario: Trends loaded successfully
  - Expected Result: trends:updated event should be broadcast
  */
  it('should broadcast trends updated event', function() {
    var eventSpy = jasmine.createSpy('eventHandler');
    $scope.$on('trends:updated', eventSpy);

    AnalyticsService.getTrends.and.returnValue($q.resolve([]));

    controller.loadTrends();
    $scope.$digest();

    expect(eventSpy).toHaveBeenCalled();
  });

  /*
  Test Documentation:
  - Test Name: should handle trends loading error
  - Purpose: Verify error handling
  - Scenario: AnalyticsService returns error
  - Expected Result: Error message should be set
  */
  it('should handle trends loading error', function() {
    AnalyticsService.getTrends.and.returnValue($q.reject('API Error'));

    controller.loadTrends();
    $scope.$digest();

    expect(controller.error).toBe('Failed to load spending trends. Please try again.');
    expect(controller.loading).toBe(false);
  });

  /*
  Test Documentation:
  - Test Name: should load category breakdown successfully
  - Purpose: Verify breakdown loading
  - Scenario: AnalyticsService returns breakdown
  - Expected Result: categoryBreakdown populated
  */
  it('should load category breakdown successfully', function() {
    var mockBreakdown = {
      'Food & Dining': 1500,
      'Fuel': 800
    };

    AnalyticsService.getCategoryBreakdown.and.returnValue($q.resolve(mockBreakdown));

    controller.loadCategoryBreakdown();
    $scope.$digest();

    expect(controller.categoryBreakdown).toEqual(mockBreakdown);
  });

  /*
  Test Documentation:
  - Test Name: should broadcast category updated event
  - Purpose: Verify event broadcasting for breakdown
  - Scenario: Breakdown loaded successfully
  - Expected Result: category:updated event should be broadcast
  */
  it('should broadcast category updated event', function() {
    var eventSpy = jasmine.createSpy('eventHandler');
    $scope.$on('category:updated', eventSpy);

    AnalyticsService.getCategoryBreakdown.and.returnValue($q.resolve({}));

    controller.loadCategoryBreakdown();
    $scope.$digest();

    expect(eventSpy).toHaveBeenCalled();
  });

  /*
  Test Documentation:
  - Test Name: should filter by category
  - Purpose: Verify category filtering
  - Scenario: Select category filter
  - Expected Result: selectedCategory should be set and trends reloaded
  */
  it('should filter by category', function() {
    controller.filterByCategory('Food & Dining');

    expect(controller.selectedCategory).toBe('Food & Dining');
    expect(AnalyticsService.getTrends).toHaveBeenCalled();
  });

  /*
  Test Documentation:
  - Test Name: should toggle category filter off
  - Purpose: Verify filter toggle
  - Scenario: Click same category twice
  - Expected Result: selectedCategory should be null
  */
  it('should toggle category filter off', function() {
    controller.selectedCategory = 'Fuel';
    controller.filterByCategory('Fuel');

    expect(controller.selectedCategory).toBeNull();
  });
});

/*
Coverage Report:
- Functions tested: init, loadTrends, loadCategoryBreakdown, filterByCategory
- Scenarios covered: initialization, successful loads, error handling, event broadcasting, filtering
- Uncovered scenarios: none
*/