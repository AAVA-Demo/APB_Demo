/*
Test Documentation:
- Test Name: AnalyticsController Unit Tests
- Purpose: Validate analytics controller data loading and export functionality
- Scenario: Tests initialization, data aggregation, and CSV export
- Expected Result: Controller manages analytics state correctly with proper data flow
*/

(function() {
  'use strict';
  
  describe('AnalyticsController', function() {
    var $controller, $scope, AnalyticsApiService, TransactionDataFactory, CategoryService, AggregationService, ReportingService, $q, $rootScope;
    var controller;
    
    beforeEach(module('analyticsModule'));
    
    beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $q = _$q_;
      
      AnalyticsApiService = {
        getTransactions: jasmine.createSpy('getTransactions')
      };
      TransactionDataFactory = {
        setData: jasmine.createSpy('setData')
      };
      CategoryService = {
        categorizeTransactions: jasmine.createSpy('categorizeTransactions')
      };
      AggregationService = {
        computeTrendsAndTotals: jasmine.createSpy('computeTrendsAndTotals')
      };
      ReportingService = {
        generateReport: jasmine.createSpy('generateReport')
      };
    }));
    
    describe('initialization', function() {
      it('should load and process analytics data', function() {
        var mockTransactions = [{amount: 1000, category: 'Shopping'}];
        var mockAggregated = {
          monthlyTrends: [{month: '2024-01', totalSpend: 1000}],
          categoryBreakdown: [{category: 'Shopping', amount: 1000}]
        };
        
        AnalyticsApiService.getTransactions.and.returnValue($q.resolve(mockTransactions));
        CategoryService.categorizeTransactions.and.returnValue(mockTransactions);
        AggregationService.computeTrendsAndTotals.and.returnValue(mockAggregated);
        
        controller = $controller('AnalyticsController', {
          $scope: $scope,
          AnalyticsApiService: AnalyticsApiService,
          TransactionDataFactory: TransactionDataFactory,
          CategoryService: CategoryService,
          AggregationService: AggregationService,
          ReportingService: ReportingService
        });
        
        $rootScope.$digest();
        expect(TransactionDataFactory.setData).toHaveBeenCalledWith(mockTransactions);
        expect(CategoryService.categorizeTransactions).toHaveBeenCalledWith(mockTransactions);
        expect(AggregationService.computeTrendsAndTotals).toHaveBeenCalled();
        expect(controller.monthlyTrends).toEqual(mockAggregated.monthlyTrends);
        expect(controller.categoryBreakdown).toEqual(mockAggregated.categoryBreakdown);
        expect(controller.loading).toBe(false);
      });
      
      it('should broadcast analyticsDataReady event', function() {
        var mockTransactions = [];
        var mockAggregated = {monthlyTrends: [], categoryBreakdown: []};
        
        AnalyticsApiService.getTransactions.and.returnValue($q.resolve(mockTransactions));
        CategoryService.categorizeTransactions.and.returnValue(mockTransactions);
        AggregationService.computeTrendsAndTotals.and.returnValue(mockAggregated);
        
        spyOn($scope, '$broadcast');
        
        controller = $controller('AnalyticsController', {
          $scope: $scope,
          AnalyticsApiService: AnalyticsApiService,
          TransactionDataFactory: TransactionDataFactory,
          CategoryService: CategoryService,
          AggregationService: AggregationService,
          ReportingService: ReportingService
        });
        
        $rootScope.$digest();
        expect($scope.$broadcast).toHaveBeenCalledWith('analyticsDataReady', mockAggregated);
      });
      
      it('should handle load error', function() {
        AnalyticsApiService.getTransactions.and.returnValue($q.reject('Error'));
        
        controller = $controller('AnalyticsController', {
          $scope: $scope,
          AnalyticsApiService: AnalyticsApiService,
          TransactionDataFactory: TransactionDataFactory,
          CategoryService: CategoryService,
          AggregationService: AggregationService,
          ReportingService: ReportingService
        });
        
        $rootScope.$digest();
        expect(controller.error).toBe('Failed to load analytics data');
        expect(controller.loading).toBe(false);
      });
    });
    
    describe('exportData()', function() {
      beforeEach(function() {
        AnalyticsApiService.getTransactions.and.returnValue($q.resolve([]));
        CategoryService.categorizeTransactions.and.returnValue([]);
        AggregationService.computeTrendsAndTotals.and.returnValue({monthlyTrends: [], categoryBreakdown: []});
        
        controller = $controller('AnalyticsController', {
          $scope: $scope,
          AnalyticsApiService: AnalyticsApiService,
          TransactionDataFactory: TransactionDataFactory,
          CategoryService: CategoryService,
          AggregationService: AggregationService,
          ReportingService: ReportingService
        });
        $rootScope.$digest();
      });
      
      it('should call ReportingService with CSV format', function() {
        controller.exportData();
        expect(ReportingService.generateReport).toHaveBeenCalledWith('CSV', jasmine.any(Object));
      });
      
      it('should pass current data to ReportingService', function() {
        controller.monthlyTrends = [{month: '2024-01', totalSpend: 5000}];
        controller.categoryBreakdown = [{category: 'Shopping', amount: 5000}];
        
        controller.exportData();
        expect(ReportingService.generateReport).toHaveBeenCalledWith('CSV', {
          monthlyTrends: controller.monthlyTrends,
          categoryBreakdown: controller.categoryBreakdown
        });
      });
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: init, exportData
- Scenarios covered:
  * Successful data loading
  * Service orchestration
  * Event broadcasting
  * Error handling
  * CSV export functionality
- Uncovered scenarios: Multiple export formats, concurrent data loads
*/