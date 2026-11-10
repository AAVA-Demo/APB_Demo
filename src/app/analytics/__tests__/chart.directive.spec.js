/*
Test Documentation:
- Test Name: chartDirective - rendering
- Purpose: Validates directive renders canvas element
- Scenario: Directive compiled with chart data
- Expected Result: Canvas element created with unique ID
*/
/*
Test Documentation:
- Test Name: chartDirective - chart initialization
- Purpose: Validates Chart.js initialization
- Scenario: Directive receives data and labels
- Expected Result: Chart instance created with correct config
*/
/*
Test Documentation:
- Test Name: chartDirective - chart type
- Purpose: Validates different chart types
- Scenario: Directive with chartType='pie', 'bar', 'line'
- Expected Result: Correct chart type rendered
*/
/*
Test Documentation:
- Test Name: chartDirective - data updates
- Purpose: Validates chart updates when data changes
- Scenario: Scope data is updated
- Expected Result: Chart re-renders with new data
*/
/*
Test Documentation:
- Test Name: chartDirective - cleanup
- Purpose: Validates chart cleanup on destroy
- Scenario: Directive scope is destroyed
- Expected Result: Chart instance destroyed
*/
/*
Coverage Report:
- Functions tested: link function, renderChart, cleanup
- Scenarios covered: rendering, initialization, updates, cleanup, chart types
- Uncovered scenarios: chart options customization, animations
*/

(function() {
  'use strict';

  describe('chartDirective', function() {
    var $compile, $rootScope, element, scope;

    beforeEach(module('app.analytics'));

    beforeEach(function() {
      window.Chart = jasmine.createSpy('Chart').and.callFake(function(ctx, config) {
        return {
          destroy: jasmine.createSpy('destroy'),
          update: jasmine.createSpy('update'),
          config: config
        };
      });
    });

    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
    }));

    function compileDirective(chartType, chartData, chartLabels, chartOptions) {
      scope.chartType = chartType;
      scope.chartData = chartData;
      scope.chartLabels = chartLabels;
      scope.chartOptions = chartOptions;

      var html = '<chart-directive chart-type="{{chartType}}" chart-data="chartData" chart-labels="chartLabels" chart-options="chartOptions"></chart-directive>';
      element = $compile(html)(scope);
      scope.$digest();
      return element;
    }

    describe('rendering', function() {
      it('should render canvas element', function() {
        element = compileDirective('bar', [10, 20, 30], ['A', 'B', 'C'], null);
        var canvas = element.find('canvas');
        expect(canvas.length).toBe(1);
      });

      it('should generate unique chart ID', function() {
        var element1 = compileDirective('bar', [10], ['A'], null);
        var element2 = compileDirective('bar', [20], ['B'], null);

        var id1 = element1.find('canvas').attr('id');
        var id2 = element2.find('canvas').attr('id');

        expect(id1).toBeDefined();
        expect(id2).toBeDefined();
        expect(id1).not.toBe(id2);
      });
    });

    describe('chart initialization', function() {
      it('should initialize Chart.js with correct data', function() {
        var chartData = [100, 200, 150];
        var chartLabels = ['Food', 'Fuel', 'Shopping'];

        element = compileDirective('pie', chartData, chartLabels, null);

        expect(window.Chart).toHaveBeenCalled();
        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.type).toBe('pie');
        expect(chartConfig.data.labels).toEqual(chartLabels);
        expect(chartConfig.data.datasets[0].data).toEqual(chartData);
      });

      it('should use bar chart as default type', function() {
        element = compileDirective('', [10, 20], ['A', 'B'], null);

        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.type).toBe('bar');
      });

      it('should apply custom chart options', function() {
        var customOptions = {
          responsive: false,
          maintainAspectRatio: true
        };

        element = compileDirective('line', [10, 20], ['A', 'B'], customOptions);

        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.options).toEqual(customOptions);
      });

      it('should use default options when none provided', function() {
        element = compileDirective('bar', [10, 20], ['A', 'B'], null);

        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.options.responsive).toBe(true);
        expect(chartConfig.options.maintainAspectRatio).toBe(false);
      });
    });

    describe('data updates', function() {
      it('should re-render chart when data changes', function() {
        element = compileDirective('bar', [10, 20], ['A', 'B'], null);
        var initialCallCount = window.Chart.calls.count();

        scope.chartData = [30, 40];
        scope.$digest();

        expect(window.Chart.calls.count()).toBeGreaterThan(initialCallCount);
      });

      it('should re-render chart when labels change', function() {
        element = compileDirective('bar', [10, 20], ['A', 'B'], null);
        var initialCallCount = window.Chart.calls.count();

        scope.chartLabels = ['C', 'D'];
        scope.$digest();

        expect(window.Chart.calls.count()).toBeGreaterThan(initialCallCount);
      });

      it('should destroy previous chart before creating new one', function() {
        element = compileDirective('bar', [10, 20], ['A', 'B'], null);
        var firstChart = window.Chart.calls.mostRecent().returnValue;

        scope.chartData = [30, 40];
        scope.$digest();

        expect(firstChart.destroy).toHaveBeenCalled();
      });
    });

    describe('cleanup', function() {
      it('should destroy chart on scope destroy', function() {
        element = compileDirective('bar', [10, 20], ['A', 'B'], null);
        var chart = window.Chart.calls.mostRecent().returnValue;

        scope.$destroy();

        expect(chart.destroy).toHaveBeenCalled();
      });
    });

    describe('chart types', function() {
      it('should render pie chart', function() {
        element = compileDirective('pie', [100, 200], ['A', 'B'], null);
        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.type).toBe('pie');
      });

      it('should render line chart', function() {
        element = compileDirective('line', [100, 200], ['Jan', 'Feb'], null);
        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.type).toBe('line');
      });

      it('should render bar chart', function() {
        element = compileDirective('bar', [100, 200], ['Card1', 'Card2'], null);
        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.type).toBe('bar');
      });
    });
  });
})();