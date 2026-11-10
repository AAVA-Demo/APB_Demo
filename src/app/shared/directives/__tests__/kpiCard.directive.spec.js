/*
Test Documentation:
- Test Name: kpiCard directive - Compile and Render
- Purpose: Verify directive compiles and displays KPI data
- Scenario: Directive with title, value, and icon
- Expected Result: Renders KPI card with all elements
*/
/*
Test Documentation:
- Test Name: kpiCard directive - Display Title and Value
- Purpose: Verify directive displays correct title and value
- Scenario: Provide title and value attributes
- Expected Result: Title and value are rendered in template
*/
/*
Test Documentation:
- Test Name: kpiCard directive - Display Icon
- Purpose: Verify directive displays correct icon
- Scenario: Provide icon class attribute
- Expected Result: Icon element has correct class
*/
/*
Coverage Report:
- Functions tested: directive compilation, template rendering
- Scenarios covered: basic rendering, attribute binding
- Uncovered scenarios: none
*/

describe('kpiCard directive', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var $compile, $rootScope, element, scope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));
  
  it('should compile and render KPI card', function() {
    element = $compile('<kpi-card title="Monthly Spend" value="$730.00" icon="glyphicon-shopping-cart"></kpi-card>')(scope);
    scope.$digest();
    
    expect(element.find('.kpi-card').length).toBe(1);
    expect(element.find('.kpi-icon').length).toBe(1);
    expect(element.find('.kpi-content').length).toBe(1);
  });
  
  it('should display title and value correctly', function() {
    element = $compile('<kpi-card title="Total Credit" value="$45,000.00" icon="glyphicon-credit-card"></kpi-card>')(scope);
    scope.$digest();
    
    var content = element.find('.kpi-content');
    expect(content.find('h4').text()).toBe('Total Credit');
    expect(content.find('h2').text()).toBe('$45,000.00');
  });
  
  it('should display icon with correct class', function() {
    element = $compile('<kpi-card title="Available" value="$29,500.00" icon="glyphicon-ok-circle"></kpi-card>')(scope);
    scope.$digest();
    
    var icon = element.find('.kpi-icon i');
    expect(icon.hasClass('glyphicon')).toBe(true);
    expect(icon.hasClass('glyphicon-ok-circle')).toBe(true);
  });
  
  it('should handle empty values', function() {
    element = $compile('<kpi-card title="" value="" icon=""></kpi-card>')(scope);
    scope.$digest();
    
    expect(element.find('.kpi-card').length).toBe(1);
  });
});