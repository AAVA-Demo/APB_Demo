/*
Test Documentation:
- Test Name: AnalyticsController - initialization
- Purpose: Validates controller initialization with default state
- Scenario: Controller is instantiated
- Expected Result: Default properties are set correctly
*/
/*
Test Documentation:
- Test Name: AnalyticsController - loadAnalytics success
- Purpose: Validates successful analytics data loading
- Scenario: Service returns valid data
- Expected Result: Analytics data is populated and loading flag is false
*/
/*
Test Documentation:
- Test Name: AnalyticsController - loadAnalytics error handling
- Purpose: Validates error handling with fallback to mock data
- Scenario: Service call fails
- Expected Result: Error message is set and mock data is loaded
*/
/*
Coverage Report:
- Functions tested: loadAnalytics, applyFilters
- Scenarios covered: initialization, successful load, error handling, filter application
- Uncovered scenarios: none
*/

describe('AnalyticsController', function() {
  'use strict';
  
  beforeEach(module('analyticsModule'));
  
  var $controller, $scope, $q, AnalyticsService, FilterFactory;
  var mockAnalyticsData = {
    categoryBreakdown: [
      { category: 'Food & Dining', amount: 5000, percentage: 15 },
      { category: 'Fuel', amount: 8000, percentage: 24 }
    ],
    monthlyTrends: [
      { month: 'Jan', totalSpend: 30000 },
      { month: 'Feb', totalSpend: 28000 }
    ],
    cardWiseSpend: [
      { cardId: '1', cardName: 'Visa Platinum', totalSpend: 15000 }
    ]
  };
  
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _AnalyticsService_, _FilterFactory_) {
    $controller = _$controller_;
    $scope = _$rootScope_.$new();
    $q = _$q_;
    AnalyticsService = _AnalyticsService_;
    FilterFactory = _FilterFactory_;
  }));
  
  describe('initialization', function() {
    it('should initialize with default state', function() {
      spyOn(AnalyticsService, 'getSpendingData').and.returnValue($q.resolve(mockAnalyticsData));
      spyOn(FilterFactory, 'getDefaultFilters').and.returnValue({ dateRange: {}, cardIds: [], categories: [] });
      
      var vm = $controller('AnalyticsController', { $scope: $scope, AnalyticsService: AnalyticsService, FilterFactory: FilterFactory });
      
      expect(vm.analyticsData).toBeDefined();
      expect(vm.filters).toBeDefined();
      expect(vm.loading).toBe(true);
      expect(vm.errorMessage).toBe('');
    });
  });
  
  describe('loadAnalytics', function() {
    it('should load analytics data successfully', function() {
      spyOn(AnalyticsService, 'getSpendingData').and.returnValue($q.resolve(mockAnalyticsData));
      spyOn(FilterFactory, 'getDefaultFilters').and.returnValue({ dateRange: {}, cardIds: [], categories: [] });
      
      var vm = $controller('AnalyticsController', { $scope: $scope, AnalyticsService: AnalyticsService, FilterFactory: FilterFactory });
      $scope.$digest();
      
      expect(vm.analyticsData.categoryBreakdown.length).toBe(2);
      expect(vm.analyticsData.monthlyTrends.length).toBe(2);
      expect(vm.loading).toBe(false);
      expect(vm.errorMessage).toBe('');
    });
    
    it('should handle errors and load mock data', function() {
      spyOn(AnalyticsService, 'getSpendingData').and.returnValue($q.reject('API Error'));
      spyOn(AnalyticsService, 'getMockAnalytics').and.returnValue($q.resolve(mockAnalyticsData));
      spyOn(FilterFactory, 'getDefaultFilters').and.returnValue({ dateRange: {}, cardIds: [], categories: [] });
      
      var vm = $controller('AnalyticsController', { $scope: $scope, AnalyticsService: AnalyticsService, FilterFactory: FilterFactory });
      $scope.$digest();
      
      expect(vm.errorMessage).toBe('Failed to load analytics. Showing sample data.');
      expect(vm.analyticsData.categoryBreakdown.length).toBe(2);
      expect(vm.loading).toBe(false);
    });
    
    it('should set loading flag during data fetch', function() {
      var deferred = $q.defer();
      spyOn(AnalyticsService, 'getSpendingData').and.returnValue(deferred.promise);
      spyOn(FilterFactory, 'getDefaultFilters').and.returnValue({ dateRange: {}, cardIds: [], categories: [] });
      
      var vm = $controller('AnalyticsController', { $scope: $scope, AnalyticsService: AnalyticsService, FilterFactory: FilterFactory });
      
      expect(vm.loading).toBe(true);
      
      deferred.resolve(mockAnalyticsData);
      $scope.$digest();
      
      expect(vm.loading).toBe(false);
    });
  });
  
  describe('applyFilters', function() {
    it('should reload analytics when filters are applied', function() {
      spyOn(AnalyticsService, 'getSpendingData').and.returnValue($q.resolve(mockAnalyticsData));
      spyOn(FilterFactory, 'getDefaultFilters').and.returnValue({ dateRange: {}, cardIds: [], categories: [] });
      
      var vm = $controller('AnalyticsController', { $scope: $scope, AnalyticsService: AnalyticsService, FilterFactory: FilterFactory });
      $scope.$digest();
      
      AnalyticsService.getSpendingData.calls.reset();
      vm.applyFilters();
      
      expect(AnalyticsService.getSpendingData).toHaveBeenCalled();
    });
  });
});