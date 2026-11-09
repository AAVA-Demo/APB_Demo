/*
Test Documentation:
- Test Name: categoryChartDirective Unit Tests
- Purpose: Validate category chart directive rendering and interaction
- Scenario: Test directive initialization, data binding, and click events
- Expected Result: Directive should render chart and handle user interactions
*/

(function(){
'use strict';

describe('categoryChartDirective', function() {
  var $compile, $rootScope, element, scope;

  beforeEach(module('spendingAnalyticsModule'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();

    scope.chartData = {
      categoryBreakdown: [
        {category: 'Food & Dining', totalSpend: 100},
        {category: 'Fuel', totalSpend: 50}
      ],
      totalSpend: 150
    };

    scope.onSelectCallback = jasmine.createSpy('onSelectCallback');
  }));

  function compileDirective() {
    element = angular.element('<category-chart data="chartData" on-select="onSelectCallback(category)"></category-chart>');
    $compile(element)(scope);
    scope.$digest();
    return element;
  }

  describe('Directive Initialization', function() {
    it('should create canvas element', function() {
      element = compileDirective();
      var canvas = element.find('canvas');
      expect(canvas.length).toBe(1);
      expect(canvas.attr('id')).toBe('categoryChart');
    });

    it('should have correct canvas dimensions', function() {
      element = compileDirective();
      var canvas = element.find('canvas');
      expect(canvas.attr('width')).toBe('400');
      expect(canvas.attr('height')).toBe('400');
    });
  });

  describe('Data Binding', function() {
    beforeEach(function() {
      window.Chart = jasmine.createSpy('Chart').and.returnValue({
        destroy: jasmine.createSpy('destroy')
      });
    });

    it('should render chart when data is provided', function() {
      element = compileDirective();
      expect(window.Chart).toHaveBeenCalled();
    });

    it('should update chart when data changes', function() {
      element = compileDirective();
      var initialCallCount = window.Chart.calls.count();

      scope.chartData = {
        categoryBreakdown: [
          {category: 'Shopping', totalSpend: 200}
        ],
        totalSpend: 200
      };
      scope.$digest();

      expect(window.Chart.calls.count()).toBeGreaterThan(initialCallCount);
    });

    it('should not render chart when data is null', function() {
      scope.chartData = null;
      element = compileDirective();
      expect(window.Chart).not.toHaveBeenCalled();
    });

    it('should not render chart when categoryBreakdown is missing', function() {
      scope.chartData = {totalSpend: 100};
      element = compileDirective();
      expect(window.Chart).not.toHaveBeenCalled();
    });
  });

  describe('Chart Configuration', function() {
    beforeEach(function() {
      window.Chart = jasmine.createSpy('Chart').and.returnValue({
        destroy: jasmine.createSpy('destroy')
      });
    });

    it('should configure pie chart type', function() {
      element = compileDirective();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.type).toBe('pie');
    });

    it('should set chart labels from category names', function() {
      element = compileDirective();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.data.labels).toEqual(['Food & Dining', 'Fuel']);
    });

    it('should set chart data from totalSpend values', function() {
      element = compileDirective();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.data.datasets[0].data).toEqual([100, 50]);
    });

    it('should set responsive option to true', function() {
      element = compileDirective();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.responsive).toBe(true);
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: Directive link function, data watch, chart rendering
- Scenarios covered: Initialization, data binding, chart updates, null data, configuration
- Edge cases: Missing data, null values, data changes
- Uncovered scenarios: Click event handling (requires Chart.js mock enhancement)
*/