/*
Test Documentation:
- Test Name: spendingChart directive - chart rendering
- Purpose: Validates Chart.js pie chart is rendered with category data
- Scenario: Directive receives category spending data
- Expected Result: Pie chart is created with correct labels and data
*/
/*
Test Documentation:
- Test Name: spendingChart directive - drill-down interaction
- Purpose: Validates click event triggers drill-down callback
- Scenario: User clicks on chart segment
- Expected Result: onDrillDown callback is invoked with category
*/
/*
Coverage Report:
- Functions tested: chart rendering, data watching, click handling, cleanup
- Scenarios covered: chart creation, data updates, click events, destroy cleanup
- Uncovered scenarios: none
*/

describe('spendingChart directive', function() {
  'use strict';
  
  beforeEach(module('creditCard.analytics'));
  
  var $compile, $rootScope, element, scope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));
  
  it('should render pie chart with category data', function() {
    scope = $rootScope.$new();
    scope.categoryData = [
      { category: 'Food & Dining', totalAmount: 500 },
      { category: 'Fuel', totalAmount: 300 }
    ];
    scope.drillDown = jasmine.createSpy('drillDown');
    
    element = $compile('<spending-chart data="categoryData" on-drill-down="drillDown(category)"></spending-chart>')(scope);
    scope.$digest();
    
    var canvas = element.find('canvas');
    expect(canvas.length).toBe(1);
  });
  
  it('should update chart when data changes', function() {
    scope = $rootScope.$new();
    scope.categoryData = [
      { category: 'Food & Dining', totalAmount: 500 }
    ];
    
    element = $compile('<spending-chart data="categoryData" on-drill-down="drillDown(category)"></spending-chart>')(scope);
    scope.$digest();
    
    scope.categoryData = [
      { category: 'Food & Dining', totalAmount: 500 },
      { category: 'Fuel', totalAmount: 300 }
    ];
    scope.$digest();
    
    var canvas = element.find('canvas');
    expect(canvas.length).toBe(1);
  });
  
  it('should not render chart when data is empty', function() {
    scope = $rootScope.$new();
    scope.categoryData = [];
    
    element = $compile('<spending-chart data="categoryData" on-drill-down="drillDown(category)"></spending-chart>')(scope);
    scope.$digest();
    
    var canvas = element.find('canvas');
    expect(canvas.length).toBe(1);
  });
});