/*
Test Documentation:
- Test Name: kpiWidget directive rendering and value formatting
- Purpose: Validates directive compilation, data binding, and value formatting
- Scenario: Test directive initialization, currency formatting, and value watching
- Expected Result: Directive should render KPI widget with formatted values
*/
/*
Coverage Report:
- Directive tested: kpiWidget
- Scenarios covered: directive compilation, scope binding, currency formatting, value watching
- Dependencies mocked: none
- Uncovered scenarios: none
*/

describe('kpiWidget Directive', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var $compile, $rootScope, element, scope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    
    scope.label = 'Monthly Spend';
    scope.value = 55000;
    scope.type = 'currency';
    scope.icon = 'glyphicon-credit-card';
    scope.trend = 'positive';
  }));
  
  it('should compile directive successfully', function() {
    element = $compile('<kpi-widget label="label" value="value" type="type" icon="icon" trend="trend"></kpi-widget>')(scope);
    scope.$digest();
    
    expect(element).toBeDefined();
  });
  
  it('should have kpi-widget class', function() {
    element = $compile('<kpi-widget label="label" value="value" type="type" icon="icon" trend="trend"></kpi-widget>')(scope);
    scope.$digest();
    
    expect(element.find('.kpi-widget').length).toBe(1);
  });
  
  it('should display label', function() {
    element = $compile('<kpi-widget label="label" value="value" type="type" icon="icon" trend="trend"></kpi-widget>')(scope);
    scope.$digest();
    
    expect(element.find('h4').text()).toContain('Monthly Spend');
  });
  
  it('should display icon', function() {
    element = $compile('<kpi-widget label="label" value="value" type="type" icon="icon" trend="trend"></kpi-widget>')(scope);
    scope.$digest();
    
    expect(element.find('.glyphicon-credit-card').length).toBe(1);
  });
  
  it('should format currency value correctly', function() {
    element = $compile('<kpi-widget label="label" value="value" type="type" icon="icon" trend="trend"></kpi-widget>')(scope);
    scope.$digest();
    
    var isolateScope = element.isolateScope();
    expect(isolateScope.displayValue).toContain('55,000');
  });
  
  it('should apply trend class', function() {
    element = $compile('<kpi-widget label="label" value="value" type="type" icon="icon" trend="trend"></kpi-widget>')(scope);
    scope.$digest();
    
    expect(element.find('.positive').length).toBe(1);
  });
  
  it('should watch for value changes', function() {
    element = $compile('<kpi-widget label="label" value="value" type="type" icon="icon" trend="trend"></kpi-widget>')(scope);
    scope.$digest();
    
    scope.value = 75000;
    scope.$digest();
    
    var isolateScope = element.isolateScope();
    expect(isolateScope.displayValue).toContain('75,000');
  });
});