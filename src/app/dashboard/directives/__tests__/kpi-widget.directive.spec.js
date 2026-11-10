/*
Test Documentation:
- Test Name: kpiWidget directive - rendering
- Purpose: Validates that kpiWidget directive renders correctly with provided attributes
- Scenario: When kpiWidget is used with title and value attributes, it should render the widget
- Expected Result: Directive compiles and displays title and value in the template
*/
/*
Test Documentation:
- Test Name: kpiWidget directive - isolated scope
- Purpose: Validates that kpiWidget has isolated scope with correct bindings
- Scenario: When kpiWidget is instantiated, it should have isolated scope with title, value, icon bindings
- Expected Result: Scope has title, value, icon properties bound from attributes
*/
/*
Coverage Report:
- Directive tested: kpiWidget
- Scenarios covered: directive compilation, template rendering, scope isolation, attribute binding
- Edge cases: empty values, special characters in title/value
- Uncovered scenarios: icon attribute (not used in template)
*/

describe('kpiWidget directive', function() {
  'use strict';
  
  beforeEach(module('dashboardModule'));
  
  var $compile;
  var $rootScope;
  var element;
  var scope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));
  
  afterEach(function() {
    if (element) {
      element.remove();
    }
  });
  
  describe('directive compilation', function() {
    it('should compile and render the directive', function() {
      element = angular.element('<kpi-widget title="Test Title" value="12345"></kpi-widget>');
      $compile(element)(scope);
      scope.$digest();
      
      expect(element.html()).toContain('kpi-widget');
    });
    
    it('should render title in the template', function() {
      element = angular.element('<kpi-widget title="Total Credit" value="50000"></kpi-widget>');
      $compile(element)(scope);
      scope.$digest();
      
      expect(element.text()).toContain('Total Credit');
    });
    
    it('should render value in the template', function() {
      element = angular.element('<kpi-widget title="Monthly Spend" value="8500"></kpi-widget>');
      $compile(element)(scope);
      scope.$digest();
      
      expect(element.text()).toContain('8500');
    });
    
    it('should render both title and value', function() {
      element = angular.element('<kpi-widget title="Available Credit" value="35000"></kpi-widget>');
      $compile(element)(scope);
      scope.$digest();
      
      var html = element.html();
      expect(html).toContain('Available Credit');
      expect(html).toContain('35000');
    });
  });
  
  describe('scope isolation', function() {
    it('should have isolated scope', function() {
      element = angular.element('<kpi-widget title="Test" value="100"></kpi-widget>');
      $compile(element)(scope);
      scope.$digest();
      
      var isolatedScope = element.isolateScope();
      expect(isolatedScope).toBeDefined();
    });
    
    it('should bind title attribute to scope', function() {
      element = angular.element('<kpi-widget title="Outstanding Balance" value="15000"></kpi-widget>');
      $compile(element)(scope);
      scope.$digest();
      
      var isolatedScope = element.isolateScope();
      expect(isolatedScope.title).toBe('Outstanding Balance');
    });
    
    it('should bind value attribute to scope', function() {
      element = angular.element('<kpi-widget title="Total Limit" value="150000"></kpi-widget>');
      $compile(element)(scope);
      scope.$digest();
      
      var isolatedScope = element.isolateScope();
      expect(isolatedScope.value).toBe('150000');
    });
    
    it('should bind icon attribute to scope', function() {
      element = angular.element('<kpi-widget title="Cards" value="3" icon="credit-card"></kpi-widget>');
      $compile(element)(scope);
      scope.$digest();
      
      var isolatedScope = element.isolateScope();
      expect(isolatedScope.icon).toBe('credit-card');
    });
  });
  
  describe('template structure', function() {
    it('should have kpi-widget class', function() {
      element = angular.element('<kpi-widget title="Test" value="100"></kpi-widget>');
      $compile(element)(scope);
      scope.$digest();
      
      var widget = element.find('.kpi-widget');
      expect(widget.length).toBe(1);
    });
    
    it('should have h3 element for title', function() {
      element = angular.element('<kpi-widget title="Credit Score" value="750"></kpi-widget>');
      $compile(element)(scope);
      scope.$digest();
      
      var h3 = element.find('h3');
      expect(h3.length).toBe(1);
      expect(h3.text()).toContain('Credit Score');
    });
    
    it('should have value div with value class', function() {
      element = angular.element('<kpi-widget title="Balance" value="25000"></kpi-widget>');
      $compile(element)(scope);
      scope.$digest();
      
      var valueDiv = element.find('.value');
      expect(valueDiv.length).toBe(1);
      expect(valueDiv.text()).toContain('25000');
    });
  });
  
  describe('edge cases', function() {
    it('should handle empty title', function() {
      element = angular.element('<kpi-widget title="" value="100"></kpi-widget>');
      $compile(element)(scope);
      scope.$digest();
      
      var isolatedScope = element.isolateScope();
      expect(isolatedScope.title).toBe('');
    });
    
    it('should handle empty value', function() {
      element = angular.element('<kpi-widget title="Test" value=""></kpi-widget>');
      $compile(element)(scope);
      scope.$digest();
      
      var isolatedScope = element.isolateScope();
      expect(isolatedScope.value).toBe('');
    });
    
    it('should handle special characters in title', function() {
      element = angular.element('<kpi-widget title="Total $ Amount" value="1000"></kpi-widget>');
      $compile(element)(scope);
      scope.$digest();
      
      expect(element.text()).toContain('Total $ Amount');
    });
    
    it('should handle numeric value with currency symbol', function() {
      element = angular.element('<kpi-widget title="Revenue" value="₹50000"></kpi-widget>');
      $compile(element)(scope);
      scope.$digest();
      
      expect(element.text()).toContain('₹50000');
    });
  });
});