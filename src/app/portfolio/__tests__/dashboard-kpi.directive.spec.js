/*
Test Documentation:
- Test Name: dashboardKpi directive - rendering
- Purpose: Validates directive renders KPI widget with correct structure
- Scenario: Directive is compiled with label, value, icon, and format
- Expected Result: Widget displays with correct classes and content
*/
/*
Test Documentation:
- Test Name: dashboardKpi directive - currency formatting
- Purpose: Validates currency format displays correctly
- Scenario: format='currency' is set
- Expected Result: Value is formatted with $ and decimal places
*/
/*
Test Documentation:
- Test Name: dashboardKpi directive - percent formatting
- Purpose: Validates percent format displays correctly
- Scenario: format='percent' is set
- Expected Result: Value is formatted with % symbol
*/
/*
Test Documentation:
- Test Name: dashboardKpi directive - default formatting
- Purpose: Validates default format displays raw value
- Scenario: No format specified
- Expected Result: Value displays as-is
*/
/*
Test Documentation:
- Test Name: dashboardKpi directive - value updates
- Purpose: Validates directive updates when value changes
- Scenario: Scope value is updated
- Expected Result: Displayed value updates accordingly
*/
/*
Coverage Report:
- Functions tested: link function, value formatting, watch handler
- Scenarios covered: currency format, percent format, default format, value updates
- Uncovered scenarios: invalid format types, null values
*/

(function() {
  'use strict';

  describe('dashboardKpi directive', function() {
    var $compile, $rootScope, element, scope;

    beforeEach(module('app.portfolio'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
    }));

    function compileDirective(label, value, icon, format) {
      scope.testLabel = label;
      scope.testValue = value;
      scope.testIcon = icon;
      scope.testFormat = format;

      var html = '<dashboard-kpi label="' + label + '" value="testValue" icon="' + icon + '" format="' + format + '"></dashboard-kpi>';
      element = $compile(html)(scope);
      scope.$digest();
      return element;
    }

    it('should render KPI widget with correct structure', function() {
      element = compileDirective('Total Credit', 10000, 'credit-card', 'currency');

      expect(element.find('.kpi-widget').length).toBe(1);
      expect(element.find('.kpi-icon').length).toBe(1);
      expect(element.find('.kpi-content').length).toBe(1);
      expect(element.find('.kpi-label').length).toBe(1);
      expect(element.find('.kpi-value').length).toBe(1);
    });

    it('should display label correctly', function() {
      element = compileDirective('Total Credit Limit', 5000, 'credit-card', 'currency');
      var label = element.find('.kpi-label').text();
      expect(label).toBe('Total Credit Limit');
    });

    it('should format value as currency', function() {
      element = compileDirective('Amount', 1234.56, 'usd', 'currency');
      var value = element.find('.kpi-value').text();
      expect(value).toBe('$1,234.56');
    });

    it('should format value as percent', function() {
      element = compileDirective('Utilization', 45.75, 'stats', 'percent');
      var value = element.find('.kpi-value').text();
      expect(value).toBe('45.75%');
    });

    it('should display raw value when no format specified', function() {
      element = compileDirective('Count', 5, 'list', '');
      var value = element.find('.kpi-value').text();
      expect(value).toBe('5');
    });

    it('should update displayed value when scope value changes', function() {
      element = compileDirective('Dynamic Value', 100, 'refresh', 'currency');
      var valueElement = element.find('.kpi-value');
      expect(valueElement.text()).toBe('$100.00');

      scope.testValue = 200;
      scope.$digest();
      expect(valueElement.text()).toBe('$200.00');
    });

    it('should handle zero value correctly', function() {
      element = compileDirective('Zero Value', 0, 'ban-circle', 'currency');
      var value = element.find('.kpi-value').text();
      expect(value).toBe('$0.00');
    });

    it('should handle null value by displaying 0', function() {
      element = compileDirective('Null Value', null, 'question-sign', 'currency');
      var value = element.find('.kpi-value').text();
      expect(value).toBe('$0.00');
    });

    it('should display icon class correctly', function() {
      element = compileDirective('Test', 100, 'star', 'currency');
      var icon = element.find('.kpi-icon i');
      expect(icon.hasClass('glyphicon-star')).toBe(true);
    });
  });
})();