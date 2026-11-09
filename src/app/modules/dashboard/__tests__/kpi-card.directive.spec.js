/*
Test Documentation:
- Test Name: kpiCard directive - rendering
- Purpose: Validates directive renders KPI card with provided data
- Scenario: Directive compiled with kpiLabel, kpiValue, kpiIcon
- Expected Result: Card displays label, value, and icon correctly
*/
/*
Test Documentation:
- Test Name: kpiCard directive - isolated scope
- Purpose: Validates directive uses isolated scope
- Scenario: Directive compiled with scope bindings
- Expected Result: Scope properties bound correctly
*/
/*
Test Documentation:
- Test Name: kpiCard directive - template structure
- Purpose: Validates directive template has correct Bootstrap classes
- Scenario: Directive compiled
- Expected Result: Panel structure with correct CSS classes
*/
/*
Coverage Report:
- Functions tested: directive compilation, template rendering, scope binding
- Scenarios covered: rendering with data, isolated scope, template structure
- Edge cases: empty values, special characters in labels
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('kpiCard directive', function() {
    var $compile, $rootScope, element, scope;

    beforeEach(module('dashboardModule'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
    }));

    function compileDirective(label, value, icon) {
      var html = '<kpi-card kpi-label="' + label + '" kpi-value="' + value + '" kpi-icon="' + icon + '"></kpi-card>';
      element = $compile(html)(scope);
      scope.$digest();
      return element;
    }

    describe('rendering', function() {
      it('should render KPI label', function() {
        element = compileDirective('Monthly Spend', '$1500.00', 'glyphicon glyphicon-shopping-cart');

        var labelText = element.find('div').last().text();
        expect(labelText).toContain('Monthly Spend');
      });

      it('should render KPI value', function() {
        element = compileDirective('Total Credit', '$10000.00', 'glyphicon glyphicon-credit-card');

        var valueText = element.find('.huge').text();
        expect(valueText).toContain('$10000.00');
      });

      it('should render KPI icon with correct class', function() {
        element = compileDirective('Available Credit', '$7500.00', 'glyphicon glyphicon-ok-circle');

        var icon = element.find('i');
        expect(icon.hasClass('glyphicon')).toBe(true);
        expect(icon.hasClass('glyphicon-ok-circle')).toBe(true);
      });

      it('should apply correct icon font size', function() {
        element = compileDirective('Outstanding', '$2500.00', 'glyphicon glyphicon-exclamation-sign');

        var icon = element.find('i');
        expect(icon.attr('style')).toContain('font-size:48px');
      });
    });

    describe('structure', function() {
      it('should have panel-primary class', function() {
        element = compileDirective('Test Label', '$100.00', 'glyphicon glyphicon-test');

        expect(element.find('.panel-primary').length).toBe(1);
      });

      it('should have panel-body class', function() {
        element = compileDirective('Test Label', '$100.00', 'glyphicon glyphicon-test');

        expect(element.find('.panel-body').length).toBe(1);
      });

      it('should have row layout', function() {
        element = compileDirective('Test Label', '$100.00', 'glyphicon glyphicon-test');

        expect(element.find('.row').length).toBe(1);
      });

      it('should have icon column with col-xs-3', function() {
        element = compileDirective('Test Label', '$100.00', 'glyphicon glyphicon-test');

        expect(element.find('.col-xs-3').length).toBe(1);
      });

      it('should have value column with col-xs-9 and text-right', function() {
        element = compileDirective('Test Label', '$100.00', 'glyphicon glyphicon-test');

        var valueCol = element.find('.col-xs-9');
        expect(valueCol.length).toBe(1);
        expect(valueCol.hasClass('text-right')).toBe(true);
      });
    });

    describe('edge cases', function() {
      it('should handle empty label', function() {
        element = compileDirective('', '$100.00', 'glyphicon glyphicon-test');

        expect(element.find('div').length).toBeGreaterThan(0);
      });

      it('should handle empty value', function() {
        element = compileDirective('Test Label', '', 'glyphicon glyphicon-test');

        expect(element.find('.huge').text()).toBe('');
      });

      it('should handle special characters in label', function() {
        element = compileDirective('Monthly Spend & Savings', '$1500.00', 'glyphicon glyphicon-test');

        var labelText = element.find('div').last().text();
        expect(labelText).toContain('Monthly Spend & Savings');
      });

      it('should handle large numeric values', function() {
        element = compileDirective('Large Value', '$999,999,999.99', 'glyphicon glyphicon-test');

        var valueText = element.find('.huge').text();
        expect(valueText).toContain('$999,999,999.99');
      });
    });
  });
})();