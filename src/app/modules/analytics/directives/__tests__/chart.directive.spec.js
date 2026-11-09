/*
Test Documentation:
- Test Name: chart-directive Unit Tests
- Purpose: Validate chart directive rendering, Chart.js integration, and data watching
- Scenario: Test directive compilation, canvas creation, chart initialization, and data updates
- Expected Result: Correct Chart.js chart creation with proper configuration and data binding
*/

describe('chartDirective', function() {
  'use strict';
  
  beforeEach(module('creditCard.analytics'));
  
  var $compile, $rootScope, element, scope;
  var mockChartInstance;
  
  beforeEach(function() {
    mockChartInstance = {
      destroy: jasmine.createSpy('destroy')
    };
    
    window.Chart = jasmine.createSpy('Chart').and.returnValue(mockChartInstance);
  });
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));
  
  describe('rendering', function() {
    it('should create canvas element', function() {
      scope.chartData = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{ data: [100, 200, 150] }]
      };
      
      element = $compile('<chart-directive chart-data="chartData" chart-type="line" chart-id="test-chart"></chart-directive>')(scope);
      scope.$digest();
      
      expect(element.find('canvas').length).toBe(1);
    });
    
    it('should set canvas id from chart-id attribute', function() {
      scope.chartData = {
        labels: ['Jan', 'Feb'],
        datasets: [{ data: [100, 200] }]
      };
      
      element = $compile('<chart-directive chart-data="chartData" chart-type="bar" chart-id="my-chart"></chart-directive>')(scope);
      scope.$digest();
      
      var canvas = element.find('canvas')[0];
      expect(canvas.id).toBe('my-chart');
    });
  });
  
  describe('Chart.js integration', function() {
    it('should create Chart instance when data is provided', function() {
      scope.chartData = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{ label: 'Sales', data: [100, 200, 150] }]
      };
      scope.chartType = 'line';
      
      element = $compile('<chart-directive chart-data="chartData" chart-type="{{chartType}}" chart-id="test"></chart-directive>')(scope);
      scope.$digest();
      
      expect(window.Chart).toHaveBeenCalled();
    });
    
    it('should pass correct chart type to Chart.js', function() {
      scope.chartData = {
        labels: ['A', 'B'],
        datasets: [{ data: [10, 20] }]
      };
      
      element = $compile('<chart-directive chart-data="chartData" chart-type="bar" chart-id="test"></chart-directive>')(scope);
      scope.$digest();
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.type).toBe('bar');
    });
    
    it('should configure responsive options', function() {
      scope.chartData = {
        labels: ['A', 'B'],
        datasets: [{ data: [10, 20] }]
      };
      
      element = $compile('<chart-directive chart-data="chartData" chart-type="line" chart-id="test"></chart-directive>')(scope);
      scope.$digest();
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.responsive).toBe(true);
      expect(chartConfig.options.maintainAspectRatio).toBe(true);
    });
    
    it('should configure legend options', function() {
      scope.chartData = {
        labels: ['A', 'B'],
        datasets: [{ data: [10, 20] }]
      };
      
      element = $compile('<chart-directive chart-data="chartData" chart-type="doughnut" chart-id="test"></chart-directive>')(scope);
      scope.$digest();
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.legend.display).toBe(true);
      expect(chartConfig.options.legend.position).toBe('bottom');
    });
    
    it('should configure scales for line and bar charts', function() {
      scope.chartData = {
        labels: ['A', 'B'],
        datasets: [{ data: [10, 20] }]
      };
      
      element = $compile('<chart-directive chart-data="chartData" chart-type="line" chart-id="test"></chart-directive>')(scope);
      scope.$digest();
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.scales).toBeDefined();
      expect(chartConfig.options.scales.yAxes).toBeDefined();
    });
    
    it('should not configure scales for doughnut charts', function() {
      scope.chartData = {
        labels: ['A', 'B'],
        datasets: [{ data: [10, 20] }]
      };
      
      element = $compile('<chart-directive chart-data="chartData" chart-type="doughnut" chart-id="test"></chart-directive>')(scope);
      scope.$digest();
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.scales).toBeUndefined();
    });
  });
  
  describe('data watching', function() {
    it('should update chart when data changes', function() {
      scope.chartData = {
        labels: ['Jan', 'Feb'],
        datasets: [{ data: [100, 200] }]
      };
      
      element = $compile('<chart-directive chart-data="chartData" chart-type="line" chart-id="test"></chart-directive>')(scope);
      scope.$digest();
      
      var initialCallCount = window.Chart.calls.count();
      
      scope.chartData = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{ data: [100, 200, 300] }]
      };
      scope.$digest();
      
      expect(window.Chart.calls.count()).toBeGreaterThan(initialCallCount);
    });
    
    it('should destroy previous chart before creating new one', function() {
      scope.chartData = {
        labels: ['Jan'],
        datasets: [{ data: [100] }]
      };
      
      element = $compile('<chart-directive chart-data="chartData" chart-type="line" chart-id="test"></chart-directive>')(scope);
      scope.$digest();
      
      scope.chartData = {
        labels: ['Jan', 'Feb'],
        datasets: [{ data: [100, 200] }]
      };
      scope.$digest();
      
      expect(mockChartInstance.destroy).toHaveBeenCalled();
    });
  });
  
  describe('cleanup', function() {
    it('should destroy chart on scope destroy', function() {
      scope.chartData = {
        labels: ['Jan', 'Feb'],
        datasets: [{ data: [100, 200] }]
      };
      
      element = $compile('<chart-directive chart-data="chartData" chart-type="line" chart-id="test"></chart-directive>')(scope);
      scope.$digest();
      
      scope.$destroy();
      
      expect(mockChartInstance.destroy).toHaveBeenCalled();
    });
  });
  
  describe('isolated scope', function() {
    it('should have isolated scope with correct bindings', function() {
      scope.chartData = {
        labels: ['A'],
        datasets: [{ data: [10] }]
      };
      scope.chartType = 'bar';
      scope.chartId = 'test-id';
      
      element = $compile('<chart-directive chart-data="chartData" chart-type="{{chartType}}" chart-id="{{chartId}}"></chart-directive>')(scope);
      scope.$digest();
      
      var isolatedScope = element.isolateScope();
      expect(isolatedScope.chartData).toEqual(scope.chartData);
      expect(isolatedScope.chartType).toBe('bar');
      expect(isolatedScope.chartId).toBe('test-id');
    });
  });
});

/*
Coverage Report:
- Functions tested: Directive link function, chart creation, data watching, cleanup
- Scenarios covered:
  * Canvas element creation
  * Canvas ID assignment
  * Chart.js instance creation
  * Chart type configuration
  * Responsive options
  * Legend configuration
  * Scales configuration for line/bar charts
  * No scales for doughnut charts
  * Data change detection
  * Previous chart destruction
  * Scope destroy cleanup
  * Isolated scope bindings
- Edge cases: Data updates, chart destruction, different chart types
- Uncovered scenarios: Null data, invalid chart types, very large datasets, animation options
*/