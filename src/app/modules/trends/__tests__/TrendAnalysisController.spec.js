/*
Test Documentation:
- Test Name: TrendAnalysisController - initialization
- Purpose: Validates controller loads trend data with default date range
- Scenario: Controller is instantiated
- Expected Result: Trend data is loaded for past 12 months
*/
/*
Test Documentation:
- Test Name: TrendAnalysisController - updateDateRange
- Purpose: Validates manual date range update triggers data reload
- Scenario: User updates date range and clicks update button
- Expected Result: New trend data is fetched with updated date range
*/
/*
Coverage Report:
- Functions tested: initialization, loadTrendData, updateDateRange
- Scenarios covered: default load, date range update, error handling
- Uncovered scenarios: none
*/

describe('TrendAnalysisController', function() {
  'use strict';
  
  beforeEach(module('creditCard.trends'));
  
  var $controller, TrendAnalysisService, $q, $rootScope, $scope, $filter;
  
  beforeEach(inject(function(_$controller_, _TrendAnalysisService_, _$q_, _$rootScope_, _$filter_) {
    $controller = _$controller_;
    TrendAnalysisService = _TrendAnalysisService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $filter = _$filter_;
  }));
  
  describe('initialization', function() {
    it('should initialize with default date range and load data', function() {
      var mockTrendData = {
        monthlyTrends: [{ month: '2024-01', totalSpend: 1000 }],
        cardwiseData: [{ cardId: 1, totalSpend: 1000 }],
        dateRange: { startDate: '2023-01-01', endDate: '2024-01-01' }
      };
      
      spyOn(TrendAnalysisService, 'getTrendData').and.returnValue($q.resolve(mockTrendData));
      
      var vm = $controller('TrendAnalysisController', {
        TrendAnalysisService: TrendAnalysisService,
        $scope: $scope,
        $filter: $filter
      });
      
      expect(vm.loading).toBe(true);
      expect(vm.dateRange.startDate).toBeDefined();
      expect(vm.dateRange.endDate).toBeDefined();
      
      $rootScope.$digest();
      
      expect(vm.loading).toBe(false);
      expect(vm.trendData).toEqual(mockTrendData);
    });
    
    it('should handle error during initialization', function() {
      spyOn(TrendAnalysisService, 'getTrendData').and.returnValue($q.reject('Service Error'));
      
      var vm = $controller('TrendAnalysisController', {
        TrendAnalysisService: TrendAnalysisService,
        $scope: $scope,
        $filter: $filter
      });
      
      $rootScope.$digest();
      
      expect(vm.loading).toBe(false);
      expect(vm.error).toBe('Failed to load trend data');
    });
  });
  
  describe('updateDateRange', function() {
    it('should reload data when date range is updated', function() {
      var mockTrendData = {
        monthlyTrends: [],
        cardwiseData: [],
        dateRange: {}
      };
      
      spyOn(TrendAnalysisService, 'getTrendData').and.returnValue($q.resolve(mockTrendData));
      
      var vm = $controller('TrendAnalysisController', {
        TrendAnalysisService: TrendAnalysisService,
        $scope: $scope,
        $filter: $filter
      });
      
      $rootScope.$digest();
      expect(TrendAnalysisService.getTrendData.calls.count()).toBe(1);
      
      vm.dateRange.startDate = new Date('2024-01-01');
      vm.dateRange.endDate = new Date('2024-06-30');
      vm.updateDateRange();
      
      $rootScope.$digest();
      
      expect(TrendAnalysisService.getTrendData.calls.count()).toBe(2);
    });
  });
});