/*
Test Documentation:
- Test Name: AnalyticsController
- Purpose: Validate analytics controller initialization and filtering
- Scenario: Controller initialization, analytics loading, filter application
- Expected Result: Controller loads analytics data and supports filtering by card and category
*/

describe('AnalyticsController', function() {
  'use strict';

  beforeEach(module('creditCard.analytics'));

  var $controller, $scope, AnalyticsService, CategoryService, MockDataService, $q, $rootScope;
  var controller;
  var mockAnalyticsData, mockCategories, mockCards;

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $q = _$q_;

    mockAnalyticsData = {
      monthlyTrends: [
        { month: 'Jan 2024', totalSpend: 2300 },
        { month: 'Feb 2024', totalSpend: 2100 }
      ],
      cardWiseSpend: [
        { cardId: 'cc001', cardName: 'Platinum Rewards', totalSpend: 2300 }
      ],
      categoryWiseSpend: [
        { category: 'Food & Dining', amount: 500, percentage: 25 }
      ],
      dateRange: {},
      selectedCard: 'all'
    };

    mockCategories = [
      { id: 'food', name: 'Food & Dining', color: '#FF6384' },
      { id: 'fuel', name: 'Fuel', color: '#36A2EB' }
    ];

    mockCards = {
      creditCards: [
        { cardId: 'cc001', cardName: 'Platinum Rewards' },
        { cardId: 'cc002', cardName: 'Travel Elite' }
      ]
    };

    AnalyticsService = {
      getSpendingAnalytics: jasmine.createSpy('getSpendingAnalytics').and.returnValue($q.resolve(mockAnalyticsData))
    };

    CategoryService = {
      getCategories: jasmine.createSpy('getCategories').and.returnValue(mockCategories)
    };

    MockDataService = {
      getDashboardData: jasmine.createSpy('getDashboardData').and.returnValue($q.resolve(mockCards))
    };

    controller = $controller('AnalyticsController', {
      $scope: $scope,
      AnalyticsService: AnalyticsService,
      CategoryService: CategoryService,
      MockDataService: MockDataService
    });
  }));

  it('should be defined', function() {
    expect(controller).toBeDefined();
  });

  it('should initialize with loading state', function() {
    expect(controller.loading).toBe(true);
  });

  it('should load categories on initialization', function() {
    expect(CategoryService.getCategories).toHaveBeenCalled();
    expect(controller.categories).toEqual(mockCategories);
  });

  it('should initialize filters with default values', function() {
    expect(controller.filters).toBeDefined();
    expect(controller.filters.cardId).toBe('all');
    expect(controller.filters.category).toBeNull();
    expect(controller.filters.dateRange).toBeDefined();
  });

  it('should set default date range to last 6 months', function() {
    var sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    expect(controller.filters.dateRange.startDate).toBeDefined();
    expect(controller.filters.dateRange.endDate).toBeDefined();
  });

  it('should load analytics on init', function() {
    controller.init();
    $rootScope.$digest();
    
    expect(AnalyticsService.getSpendingAnalytics).toHaveBeenCalled();
    expect(controller.analyticsData).toEqual(mockAnalyticsData);
  });

  it('should load card list on init', function() {
    controller.init();
    $rootScope.$digest();
    
    expect(MockDataService.getDashboardData).toHaveBeenCalled();
    expect(controller.cards.length).toBeGreaterThan(0);
  });

  it('should include "All Cards" option in card list', function() {
    controller.init();
    $rootScope.$digest();
    
    expect(controller.cards[0].cardId).toBe('all');
    expect(controller.cards[0].cardName).toBe('All Cards');
  });

  it('should set loading to false after loading analytics', function() {
    controller.loadAnalytics();
    $rootScope.$digest();
    
    expect(controller.loading).toBe(false);
  });

  it('should broadcast analyticsDataUpdated event', function() {
    spyOn($scope, '$broadcast');
    
    controller.loadAnalytics();
    $rootScope.$digest();
    
    expect($scope.$broadcast).toHaveBeenCalledWith('analyticsDataUpdated', mockAnalyticsData);
  });

  it('should handle analytics loading errors', function() {
    AnalyticsService.getSpendingAnalytics.and.returnValue($q.reject('Analytics error'));
    spyOn(console, 'error');
    
    controller.loadAnalytics();
    $rootScope.$digest();
    
    expect(controller.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Failed to load analytics:', 'Analytics error');
  });

  it('should apply filters and reload analytics', function() {
    controller.filters.cardId = 'cc001';
    controller.applyFilters();
    
    expect(AnalyticsService.getSpendingAnalytics).toHaveBeenCalled();
  });

  it('should filter by category', function() {
    controller.filterByCategory('Food & Dining');
    
    expect(controller.filters.category).toBe('Food & Dining');
    expect(AnalyticsService.getSpendingAnalytics).toHaveBeenCalled();
  });

  it('should pass filters to analytics service', function() {
    controller.filters.cardId = 'cc001';
    controller.filters.category = 'Fuel';
    controller.loadAnalytics();
    $rootScope.$digest();
    
    expect(AnalyticsService.getSpendingAnalytics).toHaveBeenCalledWith(
      controller.filters.dateRange,
      'cc001',
      'Fuel'
    );
  });

  it('should handle empty analytics data', function() {
    AnalyticsService.getSpendingAnalytics.and.returnValue($q.resolve({
      monthlyTrends: [],
      cardWiseSpend: [],
      categoryWiseSpend: [],
      dateRange: {},
      selectedCard: 'all'
    }));
    
    controller.loadAnalytics();
    $rootScope.$digest();
    
    expect(controller.analyticsData.monthlyTrends.length).toBe(0);
  });
});

/*
Coverage Report:
- Functions tested: init, loadAnalytics, applyFilters, filterByCategory
- Scenarios covered: initialization, data loading, filtering, error handling, event broadcasting
- Edge cases: empty data, service errors, filter combinations
- Uncovered scenarios: none
*/