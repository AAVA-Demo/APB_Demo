/*
Test Documentation:
- Test Name: ccSpendingChart Directive
- Purpose: Validate spending chart directive for data visualization
- Scenario: Directive rendering, chart creation, data binding, chart types
- Expected Result: Charts render correctly for pie, line, and bar types
*/

describe('ccSpendingChart Directive', function() {
  'use strict';
  
  var $compile, $rootScope, $timeout, element, scope;
  var mockChartData;
  
  beforeEach(module('creditcard.analytics'));
  
  beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    scope = $rootScope.$new();
    
    window.Chart = jasmine.createSpy('Chart');
    
    mockChartData = [
      {category: 'Food & Dining', totalAmount: 4300},
      {category: 'Fuel', totalAmount: 2500},
      {category: 'Shopping', totalAmount: 9500}
    ];
  }));
  
  afterEach(function() {
    delete window.Chart;
  });
  
  describe('Directive Rendering - Pie Chart', function() {
    beforeEach(function() {
      scope.chartData = mockChartData;
      scope.chartType = 'pie';
      element = angular.element('<cc-spending-chart chart-data="chartData" chart-type="{{chartType}}"></cc-spending-chart>');
      $compile(element)(scope);
      scope.$digest();
    });
    
    it('should compile directive successfully', function() {
      expect(element).toBeDefined();
      expect(element.find('canvas').length).toBe(1);
    });
    
    it('should generate unique chart ID', function() {
      var canvas = element.find('canvas');
      var chartId = canvas.attr('id');
      expect(chartId).toContain('chart-');
      expect(chartId.length).toBeGreaterThan(6);
    });
    
    it('should render chart when data is provided', function() {
      $timeout.flush();
      expect(window.Chart).toHaveBeenCalled();
    });
    
    it('should create pie chart configuration', function() {
      $timeout.flush();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.type).toBe('pie');
      expect(chartConfig.data.labels.length).toBe(3);
      expect(chartConfig.data.datasets[0].data.length).toBe(3);
    });
  });
  
  describe('Directive Rendering - Line Chart', function() {
    beforeEach(function() {
      scope.chartData = [
        {month: '2024-01', totalAmount: 16700},
        {month: '2024-02', totalAmount: 13600}
      ];
      scope.chartType = 'line';
      element = angular.element('<cc-spending-chart chart-data="chartData" chart-type="{{chartType}}"></cc-spending-chart>');
      $compile(element)(scope);
      scope.$digest();
    });
    
    it('should create line chart configuration', function() {
      $timeout.flush();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.type).toBe('line');
      expect(chartConfig.data.labels.length).toBe(2);
      expect(chartConfig.data.datasets[0].label).toBe('Monthly Spend');
    });
    
    it('should configure line chart with scales', function() {
      $timeout.flush();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.scales).toBeDefined();
      expect(chartConfig.options.scales.yAxes).toBeDefined();
    });
  });
  
  describe('Directive Rendering - Bar Chart', function() {
    beforeEach(function() {
      scope.chartData = [
        {cardName: 'CC001', totalSpend: 14300},
        {cardName: 'CC002', totalSpend: 7800},
        {cardName: 'CC003', totalSpend: 8200}
      ];
      scope.chartType = 'bar';
      element = angular.element('<cc-spending-chart chart-data="chartData" chart-type="{{chartType}}"></cc-spending-chart>');
      $compile(element)(scope);
      scope.$digest();
    });
    
    it('should create bar chart configuration', function() {
      $timeout.flush();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.type).toBe('bar');
      expect(chartConfig.data.labels.length).toBe(3);
      expect(chartConfig.data.datasets[0].label).toBe('Card Spend');
    });
    
    it('should configure bar chart with scales', function() {
      $timeout.flush();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.scales).toBeDefined();
      expect(chartConfig.options.scales.yAxes[0].ticks.beginAtZero).toBe(true);
    });
  });
  
  describe('Data Binding', function() {
    beforeEach(function() {
      scope.chartData = mockChartData;
      scope.chartType = 'pie';
      element = angular.element('<cc-spending-chart chart-data="chartData" chart-type="{{chartType}}"></cc-spending-chart>');
      $compile(element)(scope);
      scope.$digest();
    });
    
    it('should watch for chartData changes', function() {
      $timeout.flush();
      window.Chart.calls.reset();
      
      scope.chartData = [
        {category: 'Travel', totalAmount: 5000}
      ];
      scope.$digest();
      $timeout.flush();
      
      expect(window.Chart).toHaveBeenCalled();
    });
    
    it('should not render chart when data is null', function() {
      window.Chart.calls.reset();
      scope.chartData = null;
      scope.$digest();
      
      expect(function() {
        $timeout.flush();
      }).toThrow();
    });
    
    it('should not render chart when data is undefined', function() {
      window.Chart.calls.reset();
      scope.chartData = undefined;
      scope.$digest();
      
      expect(function() {
        $timeout.flush();
      }).toThrow();
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle empty data array', function() {
      scope.chartData = [];
      scope.chartType = 'pie';
      element = angular.element('<cc-spending-chart chart-data="chartData" chart-type="{{chartType}}"></cc-spending-chart>');
      $compile(element)(scope);
      scope.$digest();
      $timeout.flush();
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.data.labels.length).toBe(0);
    });
    
    it('should handle single data point', function() {
      scope.chartData = [{category: 'Food', totalAmount: 1000}];
      scope.chartType = 'pie';
      element = angular.element('<cc-spending-chart chart-data="chartData" chart-type="{{chartType}}"></cc-spending-chart>');
      $compile(element)(scope);
      scope.$digest();
      $timeout.flush();
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.data.labels.length).toBe(1);
    });
    
    it('should handle missing canvas element', function() {
      scope.chartData = mockChartData;
      scope.chartType = 'pie';
      element = angular.element('<cc-spending-chart chart-data="chartData" chart-type="{{chartType}}"></cc-spending-chart>');
      
      spyOn(document, 'getElementById').and.returnValue(null);
      
      $compile(element)(scope);
      scope.$digest();
      $timeout.flush();
      
      expect(window.Chart).not.toHaveBeenCalled();
    });
  });
  
  describe('Chart Configuration', function() {
    it('should set responsive option for all chart types', function() {
      scope.chartData = mockChartData;
      scope.chartType = 'pie';
      element = angular.element('<cc-spending-chart chart-data="chartData" chart-type="{{chartType}}"></cc-spending-chart>');
      $compile(element)(scope);
      scope.$digest();
      $timeout.flush();
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.responsive).toBe(true);
      expect(chartConfig.options.maintainAspectRatio).toBe(false);
    });
    
    it('should use correct colors for pie chart', function() {
      scope.chartData = mockChartData;
      scope.chartType = 'pie';
      element = angular.element('<cc-spending-chart chart-data="chartData" chart-type="{{chartType}}"></cc-spending-chart>');
      $compile(element)(scope);
      scope.$digest();
      $timeout.flush();
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.data.datasets[0].backgroundColor).toBeDefined();
      expect(chartConfig.data.datasets[0].backgroundColor.length).toBeGreaterThan(0);
    });
  });
});

/*
Coverage Report:
- Functions tested: Directive compilation, chart rendering, data binding, chart configuration
- Scenarios covered: Pie chart, line chart, bar chart, data updates, empty data, single data point, missing canvas
- Edge cases: Null data, undefined data, empty array, single data point, missing canvas element
- Uncovered scenarios: None
*/