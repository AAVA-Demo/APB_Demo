/*
Test Documentation:
- Test Name: categoryPieChart Directive Unit Tests
- Purpose: Validate category pie chart directive rendering with Chart.js
- Scenario: Tests directive compilation, pie chart initialization, and data visualization
- Expected Result: Directive renders pie chart correctly with category breakdown data
*/

(function() {
  'use strict';
  
  describe('categoryPieChart directive', function() {
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
      element = $compile('<category-pie-chart data="categoryData"></category-pie-chart>')(scope);
      scope.$digest();
      
      expect(element.find('canvas').length).toBe(1);
      expect(element.find('canvas').attr('id')).toBe('categoryChart');
    });
    
    it('should initialize pie chart on analyticsDataReady event', function() {
      element = $compile('<category-pie-chart data="categoryData"></category-pie-chart>')(scope);
      scope.$digest();
      
      var mockAggregated = {
        categoryBreakdown: [
          {category: 'Food & Dining', amount: 5000},
          {category: 'Fuel', amount: 3000}
        ]
      };
      
      scope.$broadcast('analyticsDataReady', mockAggregated);
      $timeout.flush();
      
      expect(window.Chart).toHaveBeenCalled();
    });
    
    it('should pass correct data to Chart.js', function() {
      element = $compile('<category-pie-chart data="categoryData"></category-pie-chart>')(scope);
      scope.$digest();
      
      var mockAggregated = {
        categoryBreakdown: [
          {category: 'Food & Dining', amount: 5000},
          {category: 'Fuel', amount: 3000}
        ]
      };
      
      scope.$broadcast('analyticsDataReady', mockAggregated);
      $timeout.flush();
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.type).toBe('pie');
      expect(chartConfig.data.labels).toEqual(['Food & Dining', 'Fuel']);
      expect(chartConfig.data.datasets[0].data).toEqual([5000, 3000]);
    });
    
    it('should include color configuration', function() {
      element = $compile('<category-pie-chart data="categoryData"></category-pie-chart>')(scope);
      scope.$digest();
      
      var mockAggregated = {
        categoryBreakdown: [{category: 'Shopping', amount: 1000}]
      };
      
      scope.$broadcast('analyticsDataReady', mockAggregated);
      $timeout.flush();
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.data.datasets[0].backgroundColor).toBeDefined();
      expect(Array.isArray(chartConfig.data.datasets[0].backgroundColor)).toBe(true);
    });
    
    it('should destroy existing chart before creating new one', function() {
      var mockChart = {destroy: jasmine.createSpy('destroy')};
      window.Chart.and.returnValue(mockChart);
      
      element = $compile('<category-pie-chart data="categoryData"></category-pie-chart>')(scope);
      scope.$digest();
      
      var mockAggregated = {categoryBreakdown: [{category: 'Shopping', amount: 1000}]};
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
- Functions tested: Directive compilation, pie chart initialization, data binding
- Scenarios covered:
  * Canvas rendering
  * Pie chart initialization on event
  * Data passing to Chart.js
  * Color configuration
  * Chart destruction and recreation
- Uncovered scenarios: Legend customization, interactive tooltips
*/