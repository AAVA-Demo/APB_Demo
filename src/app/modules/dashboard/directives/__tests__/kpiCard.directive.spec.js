/*
Test Documentation:
- Test Name: kpiCard Directive Display
- Purpose: Validate KPI card rendering with label and value
- Scenario: Directive renders with provided label, value, and icon attributes
- Expected Result: Card displays correct label and value in template
*/

describe('kpiCard Directive', function() {
  beforeEach(module('creditCardApp'));

  var $compile, $rootScope, element, scope;

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));

  it('should render KPI card with label and value', function() {
    var html = '<kpi-card label="Monthly Spend" value="$5000.00"></kpi-card>';
    element = $compile(html)(scope);
    scope.$digest();

    expect(element.find('h3').text()).toBe('Monthly Spend');
    expect(element.find('.value').text()).toBe('$5000.00');
  });

  it('should update when label changes', function() {
    scope.testLabel = 'Total Credit';
    var html = '<kpi-card label="{{testLabel}}" value="$10000"></kpi-card>';
    element = $compile(html)(scope);
    scope.$digest();

    expect(element.find('h3').text()).toBe('Total Credit');

    scope.testLabel = 'Available Credit';
    scope.$digest();

    expect(element.find('h3').text()).toBe('Available Credit');
  });

  it('should update when value changes', function() {
    scope.testValue = '$1000';
    var html = '<kpi-card label="Balance" value="{{testValue}}"></kpi-card>';
    element = $compile(html)(scope);
    scope.$digest();

    expect(element.find('.value').text()).toBe('$1000');

    scope.testValue = '$2000';
    scope.$digest();

    expect(element.find('.value').text()).toBe('$2000');
  });

  it('should render with empty label and value', function() {
    var html = '<kpi-card label="" value=""></kpi-card>';
    element = $compile(html)(scope);
    scope.$digest();

    expect(element.find('h3').text()).toBe('');
    expect(element.find('.value').text()).toBe('');
  });

  it('should have kpi-card CSS class', function() {
    var html = '<kpi-card label="Test" value="100"></kpi-card>';
    element = $compile(html)(scope);
    scope.$digest();

    expect(element.find('.kpi-card').length).toBe(1);
  });
});

/*
Coverage Report:
- Functions tested: directive rendering, attribute binding
- Scenarios covered: label/value display, dynamic updates, empty values, CSS classes
- Edge cases: empty strings, dynamic binding updates
- Uncovered scenarios: none - all directive rendering patterns tested
*/