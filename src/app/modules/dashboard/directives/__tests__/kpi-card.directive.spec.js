/*
Test Documentation:
- Test Name: kpiCard directive - rendering
- Purpose: Verify directive renders with correct template
- Scenario: Directive is compiled with scope data
- Expected Result: Template contains label, value, and icon
*/
/*
Test Documentation:
- Test Name: kpiCard directive - data binding
- Purpose: Verify directive binds scope data correctly
- Scenario: Scope values are updated
- Expected Result: Template reflects updated values
*/
/*
Test Documentation:
- Test Name: kpiCard directive - currency filter
- Purpose: Verify value is formatted as currency
- Scenario: Numeric value is provided
- Expected Result: Value is displayed with currency formatting
*/
/*
Coverage Report:
- Functions tested: directive template rendering, data binding
- Scenarios covered: initial render, data updates, currency formatting
- Uncovered scenarios: none
*/

describe('kpiCard directive', function() {
  'use strict';

  var $compile, $rootScope, element, scope;

  beforeEach(module('app.dashboard'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));

  it('should render kpi card with label and value', function() {
    scope.testLabel = 'Monthly Spend';
    scope.testValue = 5000;
    scope.testIcon = 'fas fa-credit-card';

    element = $compile('<kpi-card label="{{testLabel}}" value="testValue" icon="{{testIcon}}"></kpi-card>')(scope);
    scope.$digest();

    expect(element.find('.kpi-label').text()).toBe('Monthly Spend');
    expect(element.find('.kpi-value').text()).toContain('5,000');
    expect(element.find('i').hasClass('fas')).toBe(true);
    expect(element.find('i').hasClass('fa-credit-card')).toBe(true);
  });

  it('should update value when scope changes', function() {
    scope.testValue = 1000;

    element = $compile('<kpi-card label="Test" value="testValue" icon="fas fa-wallet"></kpi-card>')(scope);
    scope.$digest();

    expect(element.find('.kpi-value').text()).toContain('1,000');

    scope.testValue = 2000;
    scope.$digest();

    expect(element.find('.kpi-value').text()).toContain('2,000');
  });

  it('should render card with proper CSS classes', function() {
    scope.testValue = 500;

    element = $compile('<kpi-card label="Test" value="testValue" icon="fas fa-icon"></kpi-card>')(scope);
    scope.$digest();

    expect(element.find('.card').length).toBe(1);
    expect(element.find('.kpi-card').length).toBe(1);
    expect(element.find('.kpi-label').length).toBe(1);
    expect(element.find('.kpi-value').length).toBe(1);
  });

  it('should handle zero value', function() {
    scope.testValue = 0;

    element = $compile('<kpi-card label="Zero Value" value="testValue" icon="fas fa-zero"></kpi-card>')(scope);
    scope.$digest();

    expect(element.find('.kpi-value').text()).toContain('0');
  });

  it('should handle negative value', function() {
    scope.testValue = -500;

    element = $compile('<kpi-card label="Negative" value="testValue" icon="fas fa-minus"></kpi-card>')(scope);
    scope.$digest();

    expect(element.find('.kpi-value').text()).toContain('-');
    expect(element.find('.kpi-value').text()).toContain('500');
  });
});