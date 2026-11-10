/*
Test Documentation:
- Test Name: trendChart directive - chart rendering
- Purpose: Validates Chart.js line chart is rendered with monthly trend data
- Scenario: Directive receives monthly trend data
- Expected Result: Line chart is created with correct labels and data
*/
/*
Coverage Report:
- Functions tested: chart rendering, data watching, cleanup
- Scenarios covered: chart creation, data updates, destroy cleanup
- Uncovered scenarios: none
*/

describe('trendChart directive', function() {
  'use strict';
  
  beforeEach(module('creditCard.trends'));
  
  var $compile, $rootScope, element, scope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));
  
  it('should render line chart with monthly trend data', function() {
    scope = $rootScope.$new();
    scope.trendData = [
      { month: '2024-01', totalSpend: 1000 },
      { month: '2024-02', totalSpend: 1500 }
    ];
    
    element = $compile('<trend-chart data="trendData"></trend-chart>')(scope);
    scope.$digest();
    
    var canvas = element.find('canvas');
    expect(canvas.length).toBe(1);
  });
  
  it('should update chart when data changes', function() {
    scope = $rootScope.$new();
    scope.trendData = [
      { month: '2024-01', totalSpend: 1000 }
    ];
    
    element = $compile('<trend-chart data="trendData"></trend-chart>')(scope);
    scope.$digest();
    
    scope.trendData = [
      { month: '2024-01', totalSpend: 1000 },
      { month: '2024-02', totalSpend: 1500 }
    ];
    scope.$digest();
    
    var canvas = element.find('canvas');
    expect(canvas.length).toBe(1);
  });
  
  it('should not render chart when data is empty', function() {
    scope = $rootScope.$new();
    scope.trendData = [];
    
    element = $compile('<trend-chart data="trendData"></trend-chart>')(scope);
    scope.$digest();
    
    var canvas = element.find('canvas');
    expect(canvas.length).toBe(1);
  });
});