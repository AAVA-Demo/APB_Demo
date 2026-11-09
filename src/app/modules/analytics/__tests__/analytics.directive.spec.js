/*
Test Documentation:
- Test Name: spendingChart directive - category chart rendering
- Purpose: Validates directive renders pie chart for category data
- Scenario: Directive compiled with category chartType and data
- Expected Result: Pie chart rendered with Chart.js
*/
/*
Test Documentation:
- Test Name: spendingChart directive - trend chart rendering
- Purpose: Validates directive renders line chart for trend data
- Scenario: Directive compiled with trend chartType and data
- Expected Result: Line chart rendered with Chart.js
*/
/*
Test Documentation:
- Test Name: spendingChart directive - data watch
- Purpose: Validates directive re-renders on data change
- Scenario: chartData binding updated
- Expected Result: Chart re-rendered with new data
*/
/*
Test Documentation:
- Test Name: spendingChart directive - analyticsDataLoaded event
- Purpose: Validates directive responds to analyticsDataLoaded event
- Scenario: Event broadcast on scope
- Expected Result: Chart re-rendered
*/
/*
Test Documentation:
- Test Name: spendingChart directive - cleanup on destroy
- Purpose: Validates chart instance destroyed on scope destroy
- Scenario: $destroy event fired
- Expected Result: Chart.destroy() called, no memory leak
*/
/*
Coverage Report:
- Functions tested: renderChart, data watch, event listener, cleanup
- Scenarios covered: category chart, trend chart, data updates, event handling, cleanup
- Edge cases: null data, empty data, scope destruction
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('spendingChart directive', function() {
    var $compile, $rootScope, $scope, $timeout, element;
    var mockCategoryData = [
      { category: 'Food & Dining', amount: 1200.50 },
      { category: 'Fuel', amount: 450.00 },
      { category: 'Shopping', amount: 800.75 }
    ];
    var mockTrendData = [
      { month: 'Jan 2024', totalSpend: 2500.00 },
      { month: 'Feb 2024', totalSpend: 2800.00 },
      { month: 'Mar 2024', totalSpend: 2300.00 }
    ];

    beforeEach(module('analyticsModule'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
      $scope = $rootScope.$new();

      // Mock Chart.js
      window.Chart = jasmine.createSpy('Chart').and.returnValue({
        destroy: jasmine.createSpy('destroy')
      });
    }));

    afterEach(function() {
      if (element) {
        element.remove();
      }
    });

    function compileDirective(chartData, chartType) {
      $scope.testChartData = chartData;
      $scope.testChartType = chartType;

      var html = '<spending-chart chart-data="testChartData" chart-type="' + chartType + '"></spending-chart>';
      element = $compile(html)($scope);
      $scope.$digest();
      return element;
    }

    describe('directive compilation', function() {
      it('should compile and create canvas element', function() {
        element = compileDirective(mockCategoryData, 'category');

        var canvas = element.find('canvas');
        expect(canvas.length).toBe(1);
      });

      it('should generate unique canvas id', function() {
        element = compileDirective(mockCategoryData, 'category');

        var canvas = element.find('canvas');
        var canvasId = canvas.attr('id');
        expect(canvasId).toMatch(/^chart-/);
      });

      it('should set canvas dimensions', function() {
        element = compileDirective(mockCategoryData, 'category');

        var canvas = element.find('canvas');
        expect(canvas.attr('width')).toBe('400');
        expect(canvas.attr('height')).toBe('200');
      });
    });

    describe('category chart rendering', function() {
      beforeEach(function() {
        window.Chart = jasmine.createSpy('Chart').and.callFake(function(ctx, config) {
          return {
            destroy: jasmine.createSpy('destroy'),
            config: config
          };
        });
      });

      it('should render pie chart for category type', function() {
        element = compileDirective(mockCategoryData, 'category');
        $timeout.flush();

        expect(window.Chart).toHaveBeenCalled();
        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.type).toBe('pie');
      });

      it('should map category data to chart labels', function() {
        element = compileDirective(mockCategoryData, 'category');
        $timeout.flush();

        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.data.labels).toEqual(['Food & Dining', 'Fuel', 'Shopping']);
      });

      it('should map category data to chart values', function() {
        element = compileDirective(mockCategoryData, 'category');
        $timeout.flush();

        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.data.datasets[0].data).toEqual([1200.50, 450.00, 800.75]);
      });

      it('should configure chart as responsive', function() {
        element = compileDirective(mockCategoryData, 'category');
        $timeout.flush();

        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.options.responsive).toBe(true);
      });

      it('should position legend at bottom', function() {
        element = compileDirective(mockCategoryData, 'category');
        $timeout.flush();

        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.options.legend.position).toBe('bottom');
      });
    });

    describe('trend chart rendering', function() {
      beforeEach(function() {
        window.Chart = jasmine.createSpy('Chart').and.callFake(function(ctx, config) {
          return {
            destroy: jasmine.createSpy('destroy'),
            config: config
          };
        });
      });

      it('should render line chart for trend type', function() {
        element = compileDirective(mockTrendData, 'trend');
        $timeout.flush();

        expect(window.Chart).toHaveBeenCalled();
        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.type).toBe('line');
      });

      it('should map trend data to chart labels', function() {
        element = compileDirective(mockTrendData, 'trend');
        $timeout.flush();

        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.data.labels).toEqual(['Jan 2024', 'Feb 2024', 'Mar 2024']);
      });

      it('should map trend data to chart values', function() {
        element = compileDirective(mockTrendData, 'trend');
        $timeout.flush();

        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.data.datasets[0].data).toEqual([2500.00, 2800.00, 2300.00]);
      });

      it('should configure y-axis to begin at zero', function() {
        element = compileDirective(mockTrendData, 'trend');
        $timeout.flush();

        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.options.scales.yAxes[0].ticks.beginAtZero).toBe(true);
      });

      it('should format y-axis labels with dollar sign', function() {
        element = compileDirective(mockTrendData, 'trend');
        $timeout.flush();

        var chartConfig = window.Chart.calls.mostRecent().args[1];
        var formatter = chartConfig.options.scales.yAxes[0].ticks.callback;
        expect(formatter(100)).toBe('$100');
      });
    });

    describe('data watch', function() {
      beforeEach(function() {
        window.Chart = jasmine.createSpy('Chart').and.callFake(function(ctx, config) {
          return {
            destroy: jasmine.createSpy('destroy'),
            config: config
          };
        });
      });

      it('should re-render chart when data changes', function() {
        element = compileDirective(mockCategoryData, 'category');
        $timeout.flush();

        var initialCallCount = window.Chart.calls.count();

        $scope.testChartData = [
          { category: 'New Category', amount: 500.00 }
        ];
        $scope.$digest();
        $timeout.flush();

        expect(window.Chart.calls.count()).toBeGreaterThan(initialCallCount);
      });

      it('should not render when data is null', function() {
        element = compileDirective(null, 'category');

        expect(window.Chart).not.toHaveBeenCalled();
      });

      it('should not render when data is undefined', function() {
        element = compileDirective(undefined, 'category');

        expect(window.Chart).not.toHaveBeenCalled();
      });
    });

    describe('analyticsDataLoaded event', function() {
      beforeEach(function() {
        window.Chart = jasmine.createSpy('Chart').and.callFake(function(ctx, config) {
          return {
            destroy: jasmine.createSpy('destroy'),
            config: config
          };
        });
      });

      it('should re-render chart on analyticsDataLoaded event', function() {
        element = compileDirective(mockCategoryData, 'category');
        $timeout.flush();

        var initialCallCount = window.Chart.calls.count();

        $scope.$broadcast('analyticsDataLoaded');
        $timeout.flush();

        expect(window.Chart.calls.count()).toBeGreaterThan(initialCallCount);
      });
    });

    describe('cleanup', function() {
      var chartInstance;

      beforeEach(function() {
        chartInstance = {
          destroy: jasmine.createSpy('destroy')
        };
        window.Chart = jasmine.createSpy('Chart').and.returnValue(chartInstance);
      });

      it('should destroy chart instance on scope destroy', function() {
        element = compileDirective(mockCategoryData, 'category');
        $timeout.flush();

        var isolateScope = element.isolateScope();
        isolateScope.$destroy();

        expect(chartInstance.destroy).toHaveBeenCalled();
      });

      it('should not throw error if chart instance is null on destroy', function() {
        element = compileDirective(null, 'category');

        var isolateScope = element.isolateScope();

        expect(function() {
          isolateScope.$destroy();
        }).not.toThrow();
      });
    });

    describe('edge cases', function() {
      beforeEach(function() {
        window.Chart = jasmine.createSpy('Chart').and.callFake(function(ctx, config) {
          return {
            destroy: jasmine.createSpy('destroy'),
            config: config
          };
        });
      });

      it('should handle empty data array', function() {
        element = compileDirective([], 'category');
        $timeout.flush();

        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.data.labels).toEqual([]);
        expect(chartConfig.data.datasets[0].data).toEqual([]);
      });

      it('should handle single data point', function() {
        var singleData = [{ category: 'Single', amount: 100.00 }];
        element = compileDirective(singleData, 'category');
        $timeout.flush();

        var chartConfig = window.Chart.calls.mostRecent().args[1];
        expect(chartConfig.data.labels).toEqual(['Single']);
        expect(chartConfig.data.datasets[0].data).toEqual([100.00]);
      });

      it('should destroy previous chart instance before creating new one', function() {
        var firstInstance = { destroy: jasmine.createSpy('destroy') };
        var secondInstance = { destroy: jasmine.createSpy('destroy') };
        window.Chart = jasmine.createSpy('Chart').and.returnValues(firstInstance, secondInstance);

        element = compileDirective(mockCategoryData, 'category');
        $timeout.flush();

        $scope.testChartData = [{ category: 'New', amount: 200 }];
        $scope.$digest();
        $timeout.flush();

        expect(firstInstance.destroy).toHaveBeenCalled();
      });
    });
  });
})();