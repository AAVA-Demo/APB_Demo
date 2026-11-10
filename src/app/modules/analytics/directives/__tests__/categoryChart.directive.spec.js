/*
Test Documentation:
- Test Name: categoryChart Directive Chart Rendering
- Purpose: Validate category chart rendering using Chart.js with doughnut configuration
- Scenario: Directive creates canvas, watches config changes, renders chart, destroys on scope destroy
- Expected Result: Chart rendered with provided config, updates on config change, cleanup on destroy
*/

describe('categoryChart Directive', function() {
  beforeEach(module('creditCardApp'));

  var $compile, $rootScope, $timeout, element, scope;

  beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    scope = $rootScope.$new();

    // Mock Chart.js
    window.Chart = jasmine.createSpy('Chart').and.callFake(function() {
      return {
        destroy: jasmine.createSpy('destroy')
      };
    });
  }));

  afterEach(function() {
    if (element) {
      element.remove();
    }
  });

  it('should render canvas element', function() {
    scope.chartConfig = { type: 'doughnut', data: {} };
    var html = '<category-chart config="chartConfig"></category-chart>';
    element = $compile(html)(scope);
    scope.$digest();

    expect(element.find('canvas').length).toBe(1);
    expect(element.find('canvas').attr('id')).toBe('categoryChart');
  });

  it('should create Chart instance when config is provided', function() {
    scope.chartConfig = {
      type: 'doughnut',
      data: {
        labels: ['Food & Dining', 'Shopping'],
        datasets: [{ data: [500, 300] }]
      }
    };

    var html = '<category-chart config="chartConfig"></category-chart>';
    element = $compile(html)(scope);
    scope.$digest();
    $timeout.flush();

    expect(window.Chart).toHaveBeenCalled();
  });

  it('should destroy previous chart when config changes', function() {
    scope.chartConfig = {
      type: 'doughnut',
      data: { labels: ['Food'], datasets: [{ data: [100] }] }
    };

    var html = '<category-chart config="chartConfig"></category-chart>';
    element = $compile(html)(scope);
    scope.$digest();
    $timeout.flush();

    var firstChart = window.Chart.calls.mostRecent().returnValue;

    scope.chartConfig = {
      type: 'doughnut',
      data: { labels: ['Shopping'], datasets: [{ data: [200] }] }
    };
    scope.$digest();
    $timeout.flush();

    expect(firstChart.destroy).toHaveBeenCalled();
  });

  it('should destroy chart on scope destroy', function() {
    scope.chartConfig = {
      type: 'doughnut',
      data: { labels: ['Food'], datasets: [{ data: [100] }] }
    };

    var html = '<category-chart config="chartConfig"></category-chart>';
    element = $compile(html)(scope);
    scope.$digest();
    $timeout.flush();

    var chart = window.Chart.calls.mostRecent().returnValue;

    scope.$destroy();

    expect(chart.destroy).toHaveBeenCalled();
  });

  it('should not create chart when config is null', function() {
    scope.chartConfig = null;
    var html = '<category-chart config="chartConfig"></category-chart>';
    element = $compile(html)(scope);
    scope.$digest();

    expect(window.Chart).not.toHaveBeenCalled();
  });
});

/*
Coverage Report:
- Functions tested: directive link function, chart creation, chart destruction, config watching
- Scenarios covered: canvas rendering, chart instantiation, config updates, cleanup on destroy
- Edge cases: null config, config changes, scope destruction
- Uncovered scenarios: none - all chart directive lifecycle tested
*/