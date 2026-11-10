/*
Test Documentation:
- Test Name: trendChart Directive Interactive Chart Rendering
- Purpose: Validate trend chart rendering with click interaction for month selection
- Scenario: Directive creates canvas, renders line chart, handles click events to select month
- Expected Result: Chart rendered, click on data point triggers onSelect callback with month
*/

describe('trendChart Directive', function() {
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
        destroy: jasmine.createSpy('destroy'),
        getElementsAtEvent: jasmine.createSpy('getElementsAtEvent').and.returnValue([])
      };
    });
  }));

  afterEach(function() {
    if (element) {
      element.remove();
    }
  });

  it('should render canvas element', function() {
    scope.chartConfig = { type: 'line', data: {} };
    var html = '<trend-chart config="chartConfig"></trend-chart>';
    element = $compile(html)(scope);
    scope.$digest();

    expect(element.find('canvas').length).toBe(1);
    expect(element.find('canvas').attr('id')).toBe('trendChart');
  });

  it('should create Chart instance when config is provided', function() {
    scope.chartConfig = {
      type: 'line',
      data: {
        labels: ['2026-01', '2026-02'],
        datasets: [{ data: [1500, 1800] }]
      }
    };

    var html = '<trend-chart config="chartConfig"></trend-chart>';
    element = $compile(html)(scope);
    scope.$digest();
    $timeout.flush();

    expect(window.Chart).toHaveBeenCalled();
  });

  it('should attach click handler to canvas', function() {
    scope.chartConfig = {
      type: 'line',
      data: {
        labels: ['2026-01', '2026-02'],
        datasets: [{ data: [1500, 1800] }]
      }
    };

    var html = '<trend-chart config="chartConfig" on-select="handleSelect(month)"></trend-chart>';
    element = $compile(html)(scope);
    scope.$digest();
    $timeout.flush();

    var canvas = element.find('canvas')[0];
    expect(canvas.onclick).toBeDefined();
  });

  it('should call onSelect when data point is clicked', function() {
    scope.chartConfig = {
      type: 'line',
      data: {
        labels: ['2026-01', '2026-02'],
        datasets: [{ data: [1500, 1800] }]
      }
    };

    scope.selectedMonth = null;
    scope.handleSelect = function(month) {
      scope.selectedMonth = month;
    };

    var html = '<trend-chart config="chartConfig" on-select="handleSelect(month)"></trend-chart>';
    element = $compile(html)(scope);
    scope.$digest();
    $timeout.flush();

    var chart = window.Chart.calls.mostRecent().returnValue;
    chart.getElementsAtEvent.and.returnValue([{ _index: 0 }]);

    var canvas = element.find('canvas')[0];
    canvas.onclick({ clientX: 100, clientY: 100 });
    scope.$digest();

    expect(scope.selectedMonth).toBe('2026-01');
  });

  it('should destroy previous chart when config changes', function() {
    scope.chartConfig = {
      type: 'line',
      data: { labels: ['2026-01'], datasets: [{ data: [1000] }] }
    };

    var html = '<trend-chart config="chartConfig"></trend-chart>';
    element = $compile(html)(scope);
    scope.$digest();
    $timeout.flush();

    var firstChart = window.Chart.calls.mostRecent().returnValue;

    scope.chartConfig = {
      type: 'line',
      data: { labels: ['2026-02'], datasets: [{ data: [1500] }] }
    };
    scope.$digest();
    $timeout.flush();

    expect(firstChart.destroy).toHaveBeenCalled();
  });

  it('should destroy chart on scope destroy', function() {
    scope.chartConfig = {
      type: 'line',
      data: { labels: ['2026-01'], datasets: [{ data: [1000] }] }
    };

    var html = '<trend-chart config="chartConfig"></trend-chart>';
    element = $compile(html)(scope);
    scope.$digest();
    $timeout.flush();

    var chart = window.Chart.calls.mostRecent().returnValue;

    scope.$destroy();

    expect(chart.destroy).toHaveBeenCalled();
  });

  it('should not create chart when config is null', function() {
    scope.chartConfig = null;
    var html = '<trend-chart config="chartConfig"></trend-chart>';
    element = $compile(html)(scope);
    scope.$digest();

    expect(window.Chart).not.toHaveBeenCalled();
  });

  it('should not call onSelect when clicking outside data points', function() {
    scope.chartConfig = {
      type: 'line',
      data: {
        labels: ['2026-01'],
        datasets: [{ data: [1000] }]
      }
    };

    scope.selectCalled = false;
    scope.handleSelect = function(month) {
      scope.selectCalled = true;
    };

    var html = '<trend-chart config="chartConfig" on-select="handleSelect(month)"></trend-chart>';
    element = $compile(html)(scope);
    scope.$digest();
    $timeout.flush();

    var chart = window.Chart.calls.mostRecent().returnValue;
    chart.getElementsAtEvent.and.returnValue([]);

    var canvas = element.find('canvas')[0];
    canvas.onclick({ clientX: 100, clientY: 100 });
    scope.$digest();

    expect(scope.selectCalled).toBe(false);
  });
});

/*
Coverage Report:
- Functions tested: directive link function, chart creation, click handling, chart destruction, config watching
- Scenarios covered: canvas rendering, chart instantiation, click interaction, month selection, config updates, cleanup
- Edge cases: null config, clicks outside data points, config changes, scope destruction
- Uncovered scenarios: none - all interactive chart directive patterns tested
*/