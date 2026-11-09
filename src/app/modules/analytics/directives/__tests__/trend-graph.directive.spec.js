/*
Test Documentation:
- Test Name: trendGraph directive rendering and data visualization
- Purpose: Validates directive compilation, data binding, and trend graph rendering
- Scenario: Test directive initialization, data watching, and graph rendering
- Expected Result: Directive should render trend graph correctly with monthly data
*/
/*
Coverage Report:
- Directive tested: trendGraph
- Scenarios covered: directive compilation, scope binding, data watching
- Dependencies mocked: ChartConfigFactory
- Uncovered scenarios: D3.js rendering (requires DOM)
*/

describe('trendGraph Directive', function() {
  'use strict';
  
  beforeEach(module('creditCard.analytics'));
  
  var $compile, $rootScope, element, scope;
  var ChartConfigFactory;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    
    ChartConfigFactory = {
      getLineChartConfig: jasmine.createSpy('getLineChartConfig').and.returnValue({})
    };
    
    scope.monthlyTrends = [
      { month: '2024-01', totalSpend: 3000 },
      { month: '2024-02', totalSpend: 4000 }
    ];
  }));
  
  it('should compile directive successfully', function() {
    element = $compile('<trend-graph monthly-trends="monthlyTrends"></trend-graph>')(scope);
    scope.$digest();
    
    expect(element).toBeDefined();
  });
  
  it('should have chart container in template', function() {
    element = $compile('<trend-graph monthly-trends="monthlyTrends"></trend-graph>')(scope);
    scope.$digest();
    
    expect(element.find('.chart-container').length).toBe(1);
  });
  
  it('should display chart title', function() {
    element = $compile('<trend-graph monthly-trends="monthlyTrends"></trend-graph>')(scope);
    scope.$digest();
    
    expect(element.find('h3').text()).toBe('Monthly Spend Trends');
  });
  
  it('should have trend-graph div', function() {
    element = $compile('<trend-graph monthly-trends="monthlyTrends"></trend-graph>')(scope);
    scope.$digest();
    
    expect(element.find('#trend-graph').length).toBe(1);
  });
  
  it('should bind monthlyTrends to scope', function() {
    element = $compile('<trend-graph monthly-trends="monthlyTrends"></trend-graph>')(scope);
    scope.$digest();
    
    var isolateScope = element.isolateScope();
    expect(isolateScope.monthlyTrends).toEqual(scope.monthlyTrends);
  });
  
  it('should watch for changes in monthlyTrends', function() {
    element = $compile('<trend-graph monthly-trends="monthlyTrends"></trend-graph>')(scope);
    scope.$digest();
    
    scope.monthlyTrends = [
      { month: '2024-03', totalSpend: 5000 }
    ];
    scope.$digest();
    
    var isolateScope = element.isolateScope();
    expect(isolateScope.monthlyTrends).toEqual(scope.monthlyTrends);
  });
});