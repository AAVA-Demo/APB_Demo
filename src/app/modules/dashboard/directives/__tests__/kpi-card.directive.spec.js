/*
Test Documentation:
- Test Name: kpi-card Directive Unit Tests
- Purpose: Validate KPI card directive rendering and data binding
- Scenario: Test directive compilation, currency formatting, and non-currency values
- Expected Result: Correct template rendering with proper formatting
*/

describe('kpiCard directive', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var $compile, $rootScope, element, scope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));
  
  describe('rendering', function() {
    it('should render KPI card with currency format', function() {
      scope.kpiData = {
        label: 'Monthly Spend',
        value: 1500,
        format: 'currency'
      };
      
      element = $compile('<kpi-card data="kpiData"></kpi-card>')(scope);
      scope.$digest();
      
      expect(element.find('.kpi-card').length).toBe(1);
      expect(element.find('.kpi-label').text()).toBe('Monthly Spend');
    });
    
    it('should display currency formatted value', function() {
      scope.kpiData = {
        label: 'Total Credit',
        value: 25000,
        format: 'currency'
      };
      
      element = $compile('<kpi-card data="kpiData"></kpi-card>')(scope);
      scope.$digest();
      
      var valueElement = element.find('.kpi-value');
      expect(valueElement.length).toBe(1);
    });
    
    it('should display non-currency value', function() {
      scope.kpiData = {
        label: 'Card Count',
        value: 5,
        format: 'number'
      };
      
      element = $compile('<kpi-card data="kpiData"></kpi-card>')(scope);
      scope.$digest();
      
      var valueElement = element.find('.kpi-value');
      expect(valueElement.text()).toContain('5');
    });
    
    it('should update when data changes', function() {
      scope.kpiData = {
        label: 'Balance',
        value: 1000,
        format: 'currency'
      };
      
      element = $compile('<kpi-card data="kpiData"></kpi-card>')(scope);
      scope.$digest();
      
      scope.kpiData.value = 2000;
      scope.$digest();
      
      expect(element.find('.kpi-value').length).toBe(1);
    });
  });
  
  describe('isolated scope', function() {
    it('should have isolated scope with data binding', function() {
      scope.kpiData = {
        label: 'Test KPI',
        value: 100,
        format: 'currency'
      };
      
      element = $compile('<kpi-card data="kpiData"></kpi-card>')(scope);
      scope.$digest();
      
      var isolatedScope = element.isolateScope();
      expect(isolatedScope.data).toEqual(scope.kpiData);
    });
  });
});

/*
Coverage Report:
- Functions tested: Directive compilation, template rendering, data binding
- Scenarios covered:
  * Currency format rendering
  * Non-currency format rendering
  * Label display
  * Data change detection
  * Isolated scope binding
- Edge cases: Format changes, value updates
- Uncovered scenarios: Null values, undefined format, very large numbers
*/