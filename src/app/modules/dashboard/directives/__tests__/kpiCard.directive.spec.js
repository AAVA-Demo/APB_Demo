/*
Test Documentation:
- Test Name: kpiCard directive - rendering
- Purpose: Validates directive renders KPI card with correct data
- Scenario: Directive is compiled with title, value, and icon
- Expected Result: Card displays title, formatted value, and icon
*/
/*
Coverage Report:
- Functions tested: directive rendering, data binding
- Scenarios covered: basic rendering, value formatting, icon display
- Uncovered scenarios: none
*/

describe('kpiCard directive', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var $compile, $rootScope, element;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));
  
  it('should render KPI card with correct data', function() {
    var scope = $rootScope.$new();
    scope.testTitle = 'Monthly Spend';
    scope.testValue = 1500;
    scope.testIcon = 'credit-card';
    
    element = $compile('<kpi-card title="{{testTitle}}" value="testValue" icon="{{testIcon}}"></kpi-card>')(scope);
    scope.$digest();
    
    expect(element.find('h4').text()).toBe('Monthly Spend');
    expect(element.find('.kpi-value').text()).toContain('1,500');
    expect(element.find('i').hasClass('glyphicon-credit-card')).toBe(true);
  });
  
  it('should update when value changes', function() {
    var scope = $rootScope.$new();
    scope.testValue = 1000;
    
    element = $compile('<kpi-card title="Test" value="testValue" icon="test"></kpi-card>')(scope);
    scope.$digest();
    
    expect(element.find('.kpi-value').text()).toContain('1,000');
    
    scope.testValue = 2000;
    scope.$digest();
    
    expect(element.find('.kpi-value').text()).toContain('2,000');
  });
});