/*
Test Documentation:
- Test Name: kpiCard Directive Unit Tests
- Purpose: Validate KPI card directive rendering and data binding
- Scenario: Tests directive compilation, scope isolation, and template rendering
- Expected Result: Directive renders KPI data correctly with proper formatting
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
    
    it('should render KPI card with provided data', function() {
      scope.testValue = 12345.67;
      element = $compile('<kpi-card kpi-name="Test KPI" kpi-value="testValue" kpi-icon="glyphicon-test"></kpi-card>')(scope);
      scope.$digest();
      
      expect(element.html()).toContain('Test KPI');
      expect(element.html()).toContain('glyphicon-test');
    });
    
    it('should format KPI value to 2 decimal places', function() {
      scope.testValue = 5000.5;
      element = $compile('<kpi-card kpi-name="Amount" kpi-value="testValue" kpi-icon="glyphicon-ok"></kpi-card>')(scope);
      scope.$digest();
      
      expect(element.html()).toContain('5,000.50');
    });
    
    it('should update when kpi-value changes', function() {
      scope.testValue = 1000;
      element = $compile('<kpi-card kpi-name="Dynamic" kpi-value="testValue" kpi-icon="glyphicon-refresh"></kpi-card>')(scope);
      scope.$digest();
      
      scope.testValue = 2000;
      scope.$digest();
      
      expect(element.html()).toContain('2,000.00');
    });
    
    it('should have isolated scope', function() {
      scope.testValue = 500;
      element = $compile('<kpi-card kpi-name="Isolated" kpi-value="testValue" kpi-icon="glyphicon-lock"></kpi-card>')(scope);
      scope.$digest();
      
      var isolatedScope = element.isolateScope();
      expect(isolatedScope.kpiName).toBe('Isolated');
      expect(isolatedScope.kpiValue).toBe(500);
      expect(isolatedScope.kpiIcon).toBe('glyphicon-lock');
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: Directive compilation, template rendering, data binding
- Scenarios covered:
  * Basic rendering with data
  * Number formatting to 2 decimals
  * Dynamic value updates
  * Scope isolation
- Uncovered scenarios: Icon validation, currency symbol customization
*/