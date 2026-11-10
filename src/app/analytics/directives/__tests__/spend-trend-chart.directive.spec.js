/*
Test Documentation:
- Test Name: spendTrendChart Directive Unit Tests
- Purpose: Validate spend trend chart directive rendering with Chart.js
- Scenario: Tests directive compilation, chart initialization, and data updates
- Expected Result: Directive renders line chart correctly with monthly trend data
*/

(function() {
  'use strict';
  
  describe('spendTrendChart directive', function() {
    var $compile, $rootScope, $timeout, element, scope;
    
    beforeEach(module('analyticsModule'));
    
    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
      scope = $rootScope.$new();
      
      window.Chart = jasmine.createSpy('Chart').and.returnValue({
        destroy: jasmine.createSpy('destroy')
      });
    }));
    
    it('should render canvas element', function() {
      element = $compile('<spend-trend-chart data="trendData"></spend-trend-chart>')(scope);
      scope.$digest();
      
      expect(element.find('canvas').length).toBe(1);
      expect(element.find('canvas').attr('id')).toBe('trendChart');
    });
    
    it('should initialize chart on analyticsDataReady event', function() {
      element = $compile('<spend-trend-chart data="trendData"></spend-trend-chart>')(scope);
      scope.$digest();
      
      var mockAggregated = {
        monthlyTrends: [
          {month: '2024-01', totalSpend: 5000},
          {month: '2024-02', totalSpend: 6000}
        ]
      };
      
      scope.$broadcast('analyticsDataReady', mockAggregated);
      $timeout.flush();
      
      expect(window.Chart).toHaveBeenCalled();
    });
    
    it('should pass correct data to Chart.js', function() {
      element = $compile('<spend-trend-chart data="trendData"></spend-trend-chart>')(scope);
      scope.$digest();
      
      var mockAggregated = {
        monthlyTrends: [
          {month: '2024-01', totalSpend: 5000},
          {month: '2024-02', totalSpend: 6000}
        ]
      };
      
      scope.$broadcast('analyticsDataReady', mockAggregated);
      $timeout.flush();
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.type).toBe('line');
      expect(chartConfig.data.labels).toEqual(['2024-01', '2024-02']);
      expect(chartConfig.data.datasets[0].data).toEqual([5000, 6000]);
    });
    
    it('should destroy existing chart before creating new one', function() {
      var mockChart = {destroy: jasmine.createSpy('destroy')};
      window.Chart.and.returnValue(mockChart);
      
      element = $compile('<spend-trend-chart data="trendData"></spend-trend-chart>')(scope);
      scope.$digest();
      
      var mockAggregated = {monthlyTrends: [{month: '2024-01', totalSpend: 5000}]};
      scope.$broadcast('analyticsDataReady', mockAggregated);
      $timeout.flush();
      
      scope.$broadcast('analyticsDataReady', mockAggregated);
      $timeout.flush();
      
      expect(mockChart.destroy).toHaveBeenCalled();
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: Directive compilation, chart initialization, data binding
- Scenarios covered:
  * Canvas rendering
  * Chart initialization on event
  * Data passing to Chart.js
  * Chart destruction and recreation
- Uncovered scenarios: Chart options customization, responsive behavior
*/