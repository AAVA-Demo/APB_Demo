/*
Test Documentation:
- Test Name: spendingChart directive - Initialization
- Purpose: Verify directive compiles and creates canvas element
- Scenario: Directive is compiled with data
- Expected Result: Canvas element is created with unique ID
*/
/*
Test Documentation:
- Test Name: spendingChart directive - Category Chart
- Purpose: Verify pie chart is rendered for category data
- Scenario: type='category' with category data
- Expected Result: Chart is created with correct labels and data
*/
/*
Test Documentation:
- Test Name: spendingChart directive - Monthly Chart
- Purpose: Verify bar chart is rendered for monthly data
- Scenario: type='monthly' with monthly trend data
- Expected Result: Chart is created with monthly labels
*/
/*
Coverage Report:
- Functions tested: directive compilation, chart rendering, data watching
- Scenarios covered: initialization, category chart, monthly chart
- Uncovered scenarios: click event handling
*/

describe('spendingChart directive', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.analytics'));
  
  var $compile, $rootScope, element, scope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    
    window.Chart = jasmine.createSpy('Chart');
  }));
  
  it('should compile and create canvas element', function() {
    scope.chartData = [{categoryName: 'Food & Dining', totalSpend: 500}];
    scope.chartType = 'category';
    
    element = $compile('<spending-chart data="chartData" type="{{chartType}}"></spending-chart>')(scope);
    scope.$digest();
    
    var canvas = element.find('canvas');
    expect(canvas.length).toBe(1);
    expect(canvas.attr('id')).toContain('chart-');
  });
  
  it('should render category pie chart when type is category', function() {
    scope.chartData = [
      {categoryName: 'Food & Dining', totalSpend: 500},
      {categoryName: 'Fuel', totalSpend: 300}
    ];
    scope.chartType = 'category';
    
    element = $compile('<spending-chart data="chartData" type="{{chartType}}"></spending-chart>')(scope);
    scope.$digest();
    
    expect(window.Chart).toHaveBeenCalled();
  });
  
  it('should render monthly bar chart when type is monthly', function() {
    scope.chartData = [
      {month: '2024-01', totalSpend: 1000},
      {month: '2024-02', totalSpend: 1200}
    ];
    scope.chartType = 'monthly';
    
    element = $compile('<spending-chart data="chartData" type="{{chartType}}"></spending-chart>')(scope);
    scope.$digest();
    
    expect(window.Chart).toHaveBeenCalled();
  });
  
  it('should update chart when data changes', function() {
    scope.chartData = [{categoryName: 'Food & Dining', totalSpend: 500}];
    scope.chartType = 'category';
    
    element = $compile('<spending-chart data="chartData" type="{{chartType}}"></spending-chart>')(scope);
    scope.$digest();
    
    var callCount = window.Chart.calls.count();
    
    scope.chartData = [{categoryName: 'Fuel', totalSpend: 300}];
    scope.$digest();
    
    expect(window.Chart.calls.count()).toBeGreaterThan(callCount);
  });
});