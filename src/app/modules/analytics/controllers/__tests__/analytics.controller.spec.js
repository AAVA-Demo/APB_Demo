/*
Test Documentation:
- Test Name: AnalyticsController - Initialization
- Purpose: Verify controller initializes with correct date range
- Scenario: Controller is instantiated
- Expected Result: Date range set to last 12 months, data loading initiated
*/
/*
Test Documentation:
- Test Name: AnalyticsController - loadSpendingInsights success
- Purpose: Verify spending insights are loaded and charts prepared
- Scenario: AnalyticsService returns valid data
- Expected Result: spendingData populated, charts prepared, loading false
*/
/*
Test Documentation:
- Test Name: AnalyticsController - prepareCategoryChart
- Purpose: Verify category chart data is prepared correctly
- Scenario: Spending data contains category information
- Expected Result: categoryChartData contains labels, data, and percentages
*/
/*
Test Documentation:
- Test Name: AnalyticsController - prepareTrendChart with category filter
- Purpose: Verify trend chart filters by selected category
- Scenario: User selects a category for drill-down
- Expected Result: trendChartData shows only selected category trends
*/
/*
Test Documentation:
- Test Name: AnalyticsController - onDateRangeChange
- Purpose: Verify date range change triggers data reload
- Scenario: User changes date range
- Expected Result: loadSpendingInsights called with new date range
*/
/*
Test Documentation:
- Test Name: AnalyticsController - onCategoryDrillDown
- Purpose: Verify category drill-down updates trend chart
- Scenario: User clicks on category in chart
- Expected Result: selectedCategory set, trend chart updated
*/
/*
Test Documentation:
- Test Name: AnalyticsController - clearCategoryFilter
- Purpose: Verify category filter can be cleared
- Scenario: User clears category filter
- Expected Result: selectedCategory null, trend chart shows all data
*/
/*
Coverage Report:
- Functions tested: initializeDateRange, loadSpendingInsights, prepareCategoryChart, prepareTrendChart, onDateRangeChange, onCategoryDrillDown, clearCategoryFilter
- Scenarios covered: initialization, data loading, chart preparation, filtering, error handling
- Uncovered scenarios: none
*/

describe('AnalyticsController', function() {
  'use strict';

  var $controller, $rootScope, $q, AnalyticsService, CategoryService, controller, scope;

  beforeEach(module('app.analytics'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _AnalyticsService_, _CategoryService_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    AnalyticsService = _AnalyticsService_;
    CategoryService = _CategoryService_;
    scope = $rootScope.$new();

    var mockSpendingData = {
      userId: 'user123',
      dateRange: { startMonth: '2025-11', endMonth: '2026-11' },
      categorySpending: [
        { category: 'Food & Dining', totalAmount: 1500, percentage: '30.00', transactionCount: 25 },
        { category: 'Fuel', totalAmount: 800, percentage: '16.00', transactionCount: 15 },
        { category: 'Shopping', totalAmount: 2000, percentage: '40.00', transactionCount: 30 }
      ],
      monthlyTrends: [
        { month: '2025-11', totalSpend: 1000, categoryBreakdown: { 'Food & Dining': 300, 'Fuel': 200, 'Shopping': 500 } },
        { month: '2025-12', totalSpend: 1200, categoryBreakdown: { 'Food & Dining': 400, 'Fuel': 300, 'Shopping': 500 } },
        { month: '2026-01', totalSpend: 1500, categoryBreakdown: { 'Food & Dining': 500, 'Fuel': 300, 'Shopping': 700 } }
      ]
    };

    spyOn(AnalyticsService, 'getSpendingInsights').and.returnValue($q.resolve(mockSpendingData));
    spyOn(CategoryService, 'getCategories').and.returnValue(['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous']);
  }));

  it('should initialize with correct date range (last 12 months)', function() {
    controller = $controller('AnalyticsController', {
      AnalyticsService: AnalyticsService,
      CategoryService: CategoryService,
      $scope: scope
    });

    var now = new Date();
    var expectedEndMonth = now.toISOString().slice(0, 7);
    var startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    var expectedStartMonth = startDate.toISOString().slice(0, 7);

    expect(controller.dateRange.startMonth).toBe(expectedStartMonth);
    expect(controller.dateRange.endMonth).toBe(expectedEndMonth);
  });

  it('should load spending insights on initialization', function() {
    controller = $controller('AnalyticsController', {
      AnalyticsService: AnalyticsService,
      CategoryService: CategoryService,
      $scope: scope
    });

    $rootScope.$digest();

    expect(AnalyticsService.getSpendingInsights).toHaveBeenCalledWith('user123', controller.dateRange);
    expect(controller.spendingData).toBeDefined();
    expect(controller.spendingData.categorySpending.length).toBe(3);
    expect(controller.loading).toBe(false);
    expect(controller.error).toBeNull();
  });

  it('should prepare category chart data correctly', function() {
    controller = $controller('AnalyticsController', {
      AnalyticsService: AnalyticsService,
      CategoryService: CategoryService,
      $scope: scope
    });

    $rootScope.$digest();

    expect(controller.categoryChartData).toBeDefined();
    expect(controller.categoryChartData.labels).toEqual(['Food & Dining', 'Fuel', 'Shopping']);
    expect(controller.categoryChartData.data).toEqual([1500, 800, 2000]);
    expect(controller.categoryChartData.percentages).toEqual(['30.00', '16.00', '40.00']);
  });

  it('should prepare trend chart data for all categories', function() {
    controller = $controller('AnalyticsController', {
      AnalyticsService: AnalyticsService,
      CategoryService: CategoryService,
      $scope: scope
    });

    $rootScope.$digest();

    expect(controller.trendChartData).toBeDefined();
    expect(controller.trendChartData.labels).toEqual(['2025-11', '2025-12', '2026-01']);
    expect(controller.trendChartData.data).toEqual([1000, 1200, 1500]);
  });

  it('should filter trend chart by selected category', function() {
    controller = $controller('AnalyticsController', {
      AnalyticsService: AnalyticsService,
      CategoryService: CategoryService,
      $scope: scope
    });

    $rootScope.$digest();

    controller.onCategoryDrillDown('Food & Dining');

    expect(controller.selectedCategory).toBe('Food & Dining');
    expect(controller.trendChartData.data).toEqual([300, 400, 500]);
  });

  it('should clear category filter and show all trends', function() {
    controller = $controller('AnalyticsController', {
      AnalyticsService: AnalyticsService,
      CategoryService: CategoryService,
      $scope: scope
    });

    $rootScope.$digest();

    controller.onCategoryDrillDown('Fuel');
    expect(controller.selectedCategory).toBe('Fuel');

    controller.clearCategoryFilter();
    expect(controller.selectedCategory).toBeNull();
    expect(controller.trendChartData.data).toEqual([1000, 1200, 1500]);
  });

  it('should reload data when date range changes', function() {
    controller = $controller('AnalyticsController', {
      AnalyticsService: AnalyticsService,
      CategoryService: CategoryService,
      $scope: scope
    });

    $rootScope.$digest();
    AnalyticsService.getSpendingInsights.calls.reset();

    controller.onDateRangeChange('2026-01', '2026-11');
    $rootScope.$digest();

    expect(controller.dateRange.startMonth).toBe('2026-01');
    expect(controller.dateRange.endMonth).toBe('2026-11');
    expect(AnalyticsService.getSpendingInsights).toHaveBeenCalledWith('user123', controller.dateRange);
  });

  it('should handle error when loading spending insights fails', function() {
    AnalyticsService.getSpendingInsights.and.returnValue($q.reject('Service error'));

    controller = $controller('AnalyticsController', {
      AnalyticsService: AnalyticsService,
      CategoryService: CategoryService,
      $scope: scope
    });

    $rootScope.$digest();

    expect(controller.error).toBe('Failed to load analytics data');
    expect(controller.loading).toBe(false);
    expect(controller.spendingData).toBeNull();
  });

  it('should load categories from CategoryService', function() {
    controller = $controller('AnalyticsController', {
      AnalyticsService: AnalyticsService,
      CategoryService: CategoryService,
      $scope: scope
    });

    expect(CategoryService.getCategories).toHaveBeenCalled();
    expect(controller.categories.length).toBe(9);
    expect(controller.categories).toContain('Food & Dining');
    expect(controller.categories).toContain('Miscellaneous');
  });

  it('should handle category with no data in trend chart', function() {
    controller = $controller('AnalyticsController', {
      AnalyticsService: AnalyticsService,
      CategoryService: CategoryService,
      $scope: scope
    });

    $rootScope.$digest();

    controller.onCategoryDrillDown('Travel');

    expect(controller.trendChartData.data).toEqual([0, 0, 0]);
  });
});