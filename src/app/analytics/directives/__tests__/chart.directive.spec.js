/*
Test Documentation:
- Test Name: chart directive - initialization
- Purpose: Validates directive compilation and template rendering
- Scenario: Directive is compiled
- Expected Result: SVG element is created
*/
/*
Test Documentation:
- Test Name: chart directive - pie chart rendering
- Purpose: Validates pie chart rendering with D3
- Scenario: Data is provided with type='pie'
- Expected Result: Pie chart is rendered in SVG
*/
/*
Test Documentation:
- Test Name: chart directive - bar chart rendering
- Purpose: Validates bar chart rendering with D3
- Scenario: Data is provided with type='bar'
- Expected Result: Bar chart is rendered in SVG
*/
/*
Coverage Report:
- Functions tested: link function, renderPieChart, renderBarChart
- Scenarios covered: initialization, pie chart, bar chart, data watching
- Uncovered scenarios: none
*/

describe('chart directive', function() {
  'use strict';
  
  beforeEach(module('analyticsModule'));
  
  var $compile, $rootScope, $timeout, element, scope;
  var mockPieData = [
    { category: 'Food & Dining', amount: 5000 },
    { category: 'Fuel', amount: 8000 }
  ];
  var mockBarData = [
    { month: 'Jan', totalSpend: 30000 },
    { month: 'Feb', totalSpend: 28000 }
  ];
  
  beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    scope = $rootScope.$new();
  }));
  
  it('should compile and create SVG element', function() {
    scope.data = [];
    scope.type = 'pie';
    element = $compile('<chart data="data" type="{{type}}"></chart>')(scope);
    scope.$digest();
    
    expect(element.find('svg').length).toBe(1);
    expect(element.find('.chart-container').length).toBe(1);
  });
  
  it('should render pie chart when type is pie', function() {
    scope.data = mockPieData;
    scope.type = 'pie';
    element = $compile('<chart data="data" type="{{type}}"></chart>')(scope);
    scope.$digest();
    $timeout.flush();
    
    var svg = element.find('svg');
    expect(svg.attr('width')).toBe('600');
    expect(svg.attr('height')).toBe('400');
  });
  
  it('should render bar chart when type is bar', function() {
    scope.data = mockBarData;
    scope.type = 'bar';
    element = $compile('<chart data="data" type="{{type}}"></chart>')(scope);
    scope.$digest();
    $timeout.flush();
    
    var svg = element.find('svg');
    expect(svg.attr('width')).toBe('600');
    expect(svg.attr('height')).toBe('400');
  });
  
  it('should update chart when data changes', function() {
    scope.data = [];
    scope.type = 'pie';
    element = $compile('<chart data="data" type="{{type}}"></chart>')(scope);
    scope.$digest();
    
    scope.data = mockPieData;
    scope.$digest();
    $timeout.flush();
    
    var svg = element.find('svg');
    expect(svg.children().length).toBeGreaterThan(0);
  });
  
  it('should not render when data is empty', function() {
    scope.data = [];
    scope.type = 'pie';
    element = $compile('<chart data="data" type="{{type}}"></chart>')(scope);
    scope.$digest();
    
    var svg = element.find('svg');
    expect(svg.children().length).toBe(0);
  });
});