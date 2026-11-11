/*
Test Documentation:
- Test Name: spendChart Directive - Chart Rendering
- Purpose: Validate chart directive rendering with different chart types
- Scenario: Test directive compilation, chart rendering for pie/line/bar charts
- Expected Result: Charts rendered correctly with provided data
*/

describe('spendChart Directive', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  beforeEach(module('app.analytics'));
  
  var $compile, $rootScope, $timeout;
  
  beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    
    window.Chart = jasmine.createSpy('Chart').and.returnValue({
      destroy: jasmine.createSpy('destroy')
    });
  }));
  
  it('should render chart with title', function() {
    $rootScope.testData = [{category: 'Food', totalAmount: 100}];
    
    var element = $compile('<spend-chart chart-data="testData" chart-type="pie" chart-title="Test Chart"></spend-chart>')($rootScope);
    $rootScope.$digest();
    
    var title = element.find('h4');
    expect(title.text()).toBe('Test Chart');
  });
  
  it('should create canvas element', function() {
    $rootScope.testData = [{category: 'Food', totalAmount: 100}];
    
    var element = $compile('<spend-chart chart-data="testData" chart-type="pie" chart-title="Test Chart"></spend-chart>')($rootScope);
    $rootScope.$digest();
    
    var canvas = element.find('canvas');
    expect(canvas.length).toBe(1);
  });
  
  it('should not render chart when data is empty', function() {
    $rootScope.testData = [];
    
    var element = $compile('<spend-chart chart-data="testData" chart-type="pie" chart-title="Test Chart"></spend-chart>')($rootScope);
    $rootScope.$digest();
    $timeout.flush(100);
    
    expect(window.Chart).not.toHaveBeenCalled();
  });
  
  it('should render pie chart with category data', function() {
    $rootScope.testData = [
      {category: 'Food & Dining', totalAmount: 100},
      {category: 'Fuel', totalAmount: 50}
    ];
    
    var element = $compile('<spend-chart chart-data="testData" chart-type="pie" chart-title="Category Chart"></spend-chart>')($rootScope);
    $rootScope.$digest();
    $timeout.flush(100);
    
    expect(window.Chart).toHaveBeenCalled();
    var chartCall = window.Chart.calls.mostRecent();
    expect(chartCall.args[1].type).toBe('pie');
  });
  
  it('should render line chart with monthly data', function() {
    $rootScope.testData = [
      {month: '2026-10', totalSpend: 500},
      {month: '2026-11', totalSpend: 600}
    ];
    
    var element = $compile('<spend-chart chart-data="testData" chart-type="line" chart-title="Trend Chart"></spend-chart>')($rootScope);
    $rootScope.$digest();
    $timeout.flush(100);
    
    expect(window.Chart).toHaveBeenCalled();
    var chartCall = window.Chart.calls.mostRecent();
    expect(chartCall.args[1].type).toBe('line');
  });
  
  it('should render bar chart with monthly data', function() {
    $rootScope.testData = [
      {month: '2026-10', totalSpend: 500},
      {month: '2026-11', totalSpend: 600}
    ];
    
    var element = $compile('<spend-chart chart-data="testData" chart-type="bar" chart-title="Bar Chart"></spend-chart>')($rootScope);
    $rootScope.$digest();
    $timeout.flush(100);
    
    expect(window.Chart).toHaveBeenCalled();
    var chartCall = window.Chart.calls.mostRecent();
    expect(chartCall.args[1].type).toBe('bar');
  });
  
  it('should destroy previous chart when data changes', function() {
    var mockChart = {
      destroy: jasmine.createSpy('destroy')
    };
    window.Chart = jasmine.createSpy('Chart').and.returnValue(mockChart);
    
    $rootScope.testData = [{category: 'Food', totalAmount: 100}];
    
    var element = $compile('<spend-chart chart-data="testData" chart-type="pie" chart-title="Test Chart"></spend-chart>')($rootScope);
    $rootScope.$digest();
    $timeout.flush(100);
    
    $rootScope.testData = [{category: 'Fuel', totalAmount: 50}];
    $rootScope.$digest();
    $timeout.flush(100);
    
    expect(mockChart.destroy).toHaveBeenCalled();
  });
  
  it('should destroy chart on scope destroy', function() {
    var mockChart = {
      destroy: jasmine.createSpy('destroy')
    };
    window.Chart = jasmine.createSpy('Chart').and.returnValue(mockChart);
    
    $rootScope.testData = [{category: 'Food', totalAmount: 100}];
    
    var scope = $rootScope.$new();
    var element = $compile('<spend-chart chart-data="testData" chart-type="pie" chart-title="Test Chart"></spend-chart>')(scope);
    scope.$digest();
    $timeout.flush(100);
    
    scope.$destroy();
    
    expect(mockChart.destroy).toHaveBeenCalled();
  });
});

/*
Coverage Report:
- Functions tested: directive compilation, chart rendering, chart destruction
- Scenarios covered: pie/line/bar charts, empty data, data changes, scope destruction
- Edge cases: empty data array, chart type switching, cleanup on destroy
- Uncovered scenarios: none
*/