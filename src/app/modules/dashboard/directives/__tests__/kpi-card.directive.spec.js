/*
Test Documentation:
- Test Name: kpiCard Directive
- Purpose: Validate KPI card directive rendering and value formatting
- Scenario: Directive compilation, value binding, currency formatting
- Expected Result: Directive renders correctly with formatted currency values
*/

describe('kpiCard Directive', function() {
  'use strict';

  beforeEach(module('creditCard.dashboard'));

  var $compile, $rootScope, element, scope;

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));

  it('should compile and render the directive', function() {
    scope.testValue = 1234.56;
    element = $compile('<kpi-card label="Test KPI" value="testValue"></kpi-card>')(scope);
    scope.$digest();
    
    expect(element).toBeDefined();
    expect(element.find('h3').text()).toBe('Test KPI');
  });

  it('should format currency value correctly', function() {
    scope.testValue = 5000;
    element = $compile('<kpi-card label="Monthly Spend" value="testValue"></kpi-card>')(scope);
    scope.$digest();
    
    var formattedValue = element.find('.value').text();
    expect(formattedValue).toContain('$');
    expect(formattedValue).toContain('5,000.00');
  });

  it('should update formatted value when value changes', function() {
    scope.testValue = 1000;
    element = $compile('<kpi-card label="Test" value="testValue"></kpi-card>')(scope);
    scope.$digest();
    
    scope.testValue = 2000;
    scope.$digest();
    
    var formattedValue = element.find('.value').text();
    expect(formattedValue).toContain('2,000.00');
  });

  it('should handle zero value', function() {
    scope.testValue = 0;
    element = $compile('<kpi-card label="Zero Test" value="testValue"></kpi-card>')(scope);
    scope.$digest();
    
    var formattedValue = element.find('.value').text();
    expect(formattedValue).toBe('$0.00');
  });

  it('should handle null value', function() {
    scope.testValue = null;
    element = $compile('<kpi-card label="Null Test" value="testValue"></kpi-card>')(scope);
    scope.$digest();
    
    var formattedValue = element.find('.value').text();
    expect(formattedValue).toBe('');
  });

  it('should handle undefined value', function() {
    scope.testValue = undefined;
    element = $compile('<kpi-card label="Undefined Test" value="testValue"></kpi-card>')(scope);
    scope.$digest();
    
    var formattedValue = element.find('.value').text();
    expect(formattedValue).toBe('');
  });

  it('should format large numbers with commas', function() {
    scope.testValue = 1234567.89;
    element = $compile('<kpi-card label="Large Value" value="testValue"></kpi-card>')(scope);
    scope.$digest();
    
    var formattedValue = element.find('.value').text();
    expect(formattedValue).toBe('$1,234,567.89');
  });

  it('should have kpi-card class', function() {
    scope.testValue = 100;
    element = $compile('<kpi-card label="Test" value="testValue"></kpi-card>')(scope);
    scope.$digest();
    
    expect(element.find('.kpi-card').length).toBeGreaterThan(0);
  });
});

/*
Coverage Report:
- Functions tested: directive compilation, link function, value watching
- Scenarios covered: rendering, value formatting, value updates, null/undefined handling
- Edge cases: zero values, null, undefined, large numbers
- Uncovered scenarios: none
*/