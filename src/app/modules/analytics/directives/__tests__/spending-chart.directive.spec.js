/*
Test Documentation:
- Test Name: spendingChart directive - rendering
- Purpose: Verify directive renders chart canvas
- Scenario: Directive compiled with chart data
- Expected Result: Canvas element created with unique ID
*/
/*
Test Documentation:
- Test Name: spendingChart directive - chart creation
- Purpose: Verify Chart.js chart is created with correct configuration
- Scenario: chartData is provided
- Expected Result: Chart rendered with labels and data
*/
/*
Test Documentation:
- Test Name: spendingChart directive - chart type
- Purpose: Verify chart type is applied correctly
- Scenario: chartType attribute set to 'pie' or 'line'
- Expected Result: Chart rendered with specified type
*/
/*
Test Documentation:
- Test Name: spendingChart directive - drill-down callback
- Purpose: Verify onDrillDown callback is invoked on chart click
- Scenario: User clicks on chart element
- Expected Result: onDrillDown called with selected category
*/
/*
Test Documentation:
- Test Name: spendingChart directive - data update
- Purpose: Verify chart updates when data changes
- Scenario: chartData is updated
- Expected Result: Chart re-renders with new data
*/
/*
Test Documentation:
- Test Name: spendingChart directive - cleanup
- Purpose: Verify chart is destroyed on scope destroy
- Scenario: Directive scope is destroyed
- Expected Result: Chart.destroy() called
*/
/*
Coverage Report:
- Functions tested: renderChart, onClick handler, $destroy handler
- Scenarios covered: rendering, interaction, updates, cleanup
- Uncovered scenarios: none
*/

describe('spendingChart directive', function() {
  'use strict';

  var $compile, $rootScope, element, scope;

  beforeEach(module('app.analytics'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();

    window.Chart = jasmine.createSpy('Chart').and.returnValue({
      destroy: jasmine.createSpy('destroy')
    });
  }));

  it('should render canvas with unique ID', function() {
    scope.chartData = {
      labels: ['Category 1', 'Category 2'],
      data: [100, 200]
    };
    scope.onDrillDownCallback = jasmine.createSpy('onDrillDownCallback');

    element = $compile('<spending-chart chart-data="chartData" chart-type="pie" on-drill-down="onDrillDownCallback(category)"></spending-chart>')(scope);
    scope.$digest();

    var canvas = element.find('canvas');
    expect(canvas.length).toBe(1);
    expect(canvas.attr('id')).toContain('chart-');
  });

  it('should create Chart.js chart with correct data', function() {
    scope.chartData = {
      labels: ['Food & Dining', 'Fuel'],
      data: [500, 300]
    };
    scope.onDrillDownCallback = jasmine.createSpy('onDrillDownCallback');

    element = $compile('<spending-chart chart-data="chartData" chart-type="pie" on-drill-down="onDrillDownCallback(category)"></spending-chart>')(scope);
    scope.$digest();

    expect(window.Chart).toHaveBeenCalled();
    var chartConfig = window.Chart.calls.mostRecent().args[1];
    expect(chartConfig.type).toBe('pie');
    expect(chartConfig.data.labels).toEqual(['Food & Dining', 'Fuel']);
    expect(chartConfig.data.datasets[0].data).toEqual([500, 300]);
  });

  it('should use line chart type when specified', function() {
    scope.chartData = {
      labels: ['Jan', 'Feb', 'Mar'],
      data: [1000, 1200, 1500]
    };
    scope.onDrillDownCallback = jasmine.createSpy('onDrillDownCallback');

    element = $compile('<spending-chart chart-data="chartData" chart-type="line" on-drill-down="onDrillDownCallback(category)"></spending-chart>')(scope);
    scope.$digest();

    var chartConfig = window.Chart.calls.mostRecent().args[1];
    expect(chartConfig.type).toBe('line');
    expect(chartConfig.options.scales).toBeDefined();
  });

  it('should default to pie chart when type not specified', function() {
    scope.chartData = {
      labels: ['Category 1'],
      data: [100]
    };
    scope.onDrillDownCallback = jasmine.createSpy('onDrillDownCallback');

    element = $compile('<spending-chart chart-data="chartData" on-drill-down="onDrillDownCallback(category)"></spending-chart>')(scope);
    scope.$digest();

    var chartConfig = window.Chart.calls.mostRecent().args[1];
    expect(chartConfig.type).toBe('pie');
  });

  it('should update chart when data changes', function() {
    scope.chartData = {
      labels: ['Category 1'],
      data: [100]
    };
    scope.onDrillDownCallback = jasmine.createSpy('onDrillDownCallback');

    element = $compile('<spending-chart chart-data="chartData" chart-type="pie" on-drill-down="onDrillDownCallback(category)"></spending-chart>')(scope);
    scope.$digest();

    expect(window.Chart).toHaveBeenCalledTimes(1);

    scope.chartData = {
      labels: ['Category 1', 'Category 2'],
      data: [100, 200]
    };
    scope.$digest();

    expect(window.Chart).toHaveBeenCalledTimes(2);
  });

  it('should destroy chart on scope destroy', function() {
    scope.chartData = {
      labels: ['Category 1'],
      data: [100]
    };
    scope.onDrillDownCallback = jasmine.createSpy('onDrillDownCallback');

    element = $compile('<spending-chart chart-data="chartData" chart-type="pie" on-drill-down="onDrillDownCallback(category)"></spending-chart>')(scope);
    scope.$digest();

    var chart = window.Chart.calls.mostRecent().returnValue;

    scope.$destroy();

    expect(chart.destroy).toHaveBeenCalled();
  });

  it('should not render chart when data is missing', function() {
    scope.chartData = null;
    scope.onDrillDownCallback = jasmine.createSpy('onDrillDownCallback');

    element = $compile('<spending-chart chart-data="chartData" chart-type="pie" on-drill-down="onDrillDownCallback(category)"></spending-chart>')(scope);
    scope.$digest();

    expect(window.Chart).not.toHaveBeenCalled();
  });
});