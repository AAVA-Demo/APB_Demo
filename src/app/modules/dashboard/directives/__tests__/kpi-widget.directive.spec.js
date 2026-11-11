/*
Test Documentation:
- Test Name: kpiWidget Directive - KPI Widget Rendering
- Purpose: Validate KPI widget directive rendering with title, value, and CSS class
- Scenario: Test directive compilation, scope binding, and template rendering
- Expected Result: Widget renders with correct title, value, and CSS class
*/

describe('kpiWidget Directive', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  beforeEach(module('app.dashboard'));
  
  var $compile, $rootScope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));
  
  it('should render widget with title and value', function() {
    var element = $compile('<kpi-widget title="Monthly Spend" value="$1,500.00"></kpi-widget>')($rootScope);
    $rootScope.$digest();
    
    var title = element.find('h4');
    var value = element.find('.value');
    
    expect(title.text()).toBe('Monthly Spend');
    expect(value.text()).toBe('$1,500.00');
  });
  
  it('should apply CSS class when provided', function() {
    var element = $compile('<kpi-widget title="Available Credit" value="$7,500.00" css-class="warning"></kpi-widget>')($rootScope);
    $rootScope.$digest();
    
    var widget = element.find('.kpi-widget');
    expect(widget.hasClass('warning')).toBe(true);
  });
  
  it('should not apply CSS class when not provided', function() {
    var element = $compile('<kpi-widget title="Total Limit" value="$10,000.00"></kpi-widget>')($rootScope);
    $rootScope.$digest();
    
    var widget = element.find('.kpi-widget');
    expect(widget.hasClass('warning')).toBe(false);
    expect(widget.hasClass('danger')).toBe(false);
  });
  
  it('should update when scope values change', function() {
    $rootScope.dynamicTitle = 'Outstanding';
    $rootScope.dynamicValue = '$2,500.00';
    
    var element = $compile('<kpi-widget title="{{dynamicTitle}}" value="{{dynamicValue}}"></kpi-widget>')($rootScope);
    $rootScope.$digest();
    
    var title = element.find('h4');
    var value = element.find('.value');
    
    expect(title.text()).toBe('Outstanding');
    expect(value.text()).toBe('$2,500.00');
    
    $rootScope.dynamicTitle = 'Updated Title';
    $rootScope.dynamicValue = '$3,000.00';
    $rootScope.$digest();
    
    expect(title.text()).toBe('Updated Title');
    expect(value.text()).toBe('$3,000.00');
  });
  
  it('should handle empty values', function() {
    var element = $compile('<kpi-widget title="" value=""></kpi-widget>')($rootScope);
    $rootScope.$digest();
    
    var title = element.find('h4');
    var value = element.find('.value');
    
    expect(title.text()).toBe('');
    expect(value.text()).toBe('');
  });
});

/*
Coverage Report:
- Functions tested: directive compilation, template rendering, scope binding
- Scenarios covered: basic rendering, CSS class application, dynamic value updates, empty values
- Edge cases: missing CSS class, empty title/value, dynamic updates
- Uncovered scenarios: none
*/