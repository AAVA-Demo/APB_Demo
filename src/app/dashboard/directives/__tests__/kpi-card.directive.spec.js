/*
Test Documentation:
- Test Name: kpiCard directive - rendering
- Purpose: Validates directive renders KPI card with correct data
- Scenario: Normal scenario with valid KPI data
- Expected Result: KPI card displays label, value, and icon
*/
/*
Test Documentation:
- Test Name: kpiCard directive - value updates
- Purpose: Validates directive updates when value changes
- Scenario: Normal scenario with dynamic value changes
- Expected Result: Display updates to reflect new value
*/
/*
Coverage Report:
- Functions tested: directive rendering, data binding
- Scenarios covered: initial render, value updates, currency formatting
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('kpiCard directive', function() {
    var $compile, $rootScope, element;

    beforeEach(module('app.dashboard'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should render KPI card with label, value, and icon', function() {
      $rootScope.testValue = 1500;
      element = $compile('<kpi-card label="Monthly Spend" value="testValue" icon="💳"></kpi-card>')($rootScope);
      $rootScope.$digest();

      var labelElement = element.find('.kpi-label');
      var valueElement = element.find('.kpi-value');
      var iconElement = element.find('.kpi-icon');

      expect(labelElement.text()).toBe('Monthly Spend');
      expect(iconElement.text()).toBe('💳');
      expect(valueElement.text()).toContain('1,500');
    });

    it('should update value when scope changes', function() {
      $rootScope.testValue = 1500;
      element = $compile('<kpi-card label="Monthly Spend" value="testValue" icon="💳"></kpi-card>')($rootScope);
      $rootScope.$digest();

      $rootScope.testValue = 2000;
      $rootScope.$digest();

      var valueElement = element.find('.kpi-value');
      expect(valueElement.text()).toContain('2,000');
    });

    it('should handle zero value', function() {
      $rootScope.testValue = 0;
      element = $compile('<kpi-card label="Outstanding" value="testValue" icon="⚠"></kpi-card>')($rootScope);
      $rootScope.$digest();

      var valueElement = element.find('.kpi-value');
      expect(valueElement.text()).toContain('0');
    });

    it('should handle negative value', function() {
      $rootScope.testValue = -500;
      element = $compile('<kpi-card label="Balance" value="testValue" icon="💰"></kpi-card>')($rootScope);
      $rootScope.$digest();

      var valueElement = element.find('.kpi-value');
      expect(valueElement.text()).toContain('-500');
    });

    it('should apply currency filter to value', function() {
      $rootScope.testValue = 1234.56;
      element = $compile('<kpi-card label="Amount" value="testValue" icon="$"></kpi-card>')($rootScope);
      $rootScope.$digest();

      var valueElement = element.find('.kpi-value');
      expect(valueElement.text()).toMatch(/\$.*1,234\.56/);
    });
  });
})();