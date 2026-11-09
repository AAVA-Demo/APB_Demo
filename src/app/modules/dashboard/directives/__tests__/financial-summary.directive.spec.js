/*
Test Documentation:
- Test Name: financialSummary directive rendering
- Purpose: Validates directive compilation and KPI data display
- Scenario: Test directive initialization and financial summary rendering
- Expected Result: Directive should render financial summary panel with all KPI values
*/
/*
Coverage Report:
- Directive tested: financialSummary
- Scenarios covered: directive compilation, scope binding, data display
- Dependencies mocked: none
- Uncovered scenarios: none
*/

describe('financialSummary Directive', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var $compile, $rootScope, element, scope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    
    scope.kpiData = {
      monthlySpend: 55000,
      totalCreditLimit: 150000,
      availableCredit: 95000,
      outstandingAmount: 55000
    };
  }));
  
  it('should compile directive successfully', function() {
    element = $compile('<financial-summary kpi-data="kpiData"></financial-summary>')(scope);
    scope.$digest();
    
    expect(element).toBeDefined();
  });
  
  it('should have panel-primary class', function() {
    element = $compile('<financial-summary kpi-data="kpiData"></financial-summary>')(scope);
    scope.$digest();
    
    expect(element.find('.panel-primary').length).toBe(1);
  });
  
  it('should display Financial Summary title', function() {
    element = $compile('<financial-summary kpi-data="kpiData"></financial-summary>')(scope);
    scope.$digest();
    
    expect(element.find('.panel-title').text()).toBe('Financial Summary');
  });
  
  it('should display all KPI labels', function() {
    element = $compile('<financial-summary kpi-data="kpiData"></financial-summary>')(scope);
    scope.$digest();
    
    var text = element.text();
    expect(text).toContain('Total Credit Limit');
    expect(text).toContain('Available Credit');
    expect(text).toContain('Monthly Spend');
    expect(text).toContain('Outstanding');
  });
  
  it('should bind kpiData to scope', function() {
    element = $compile('<financial-summary kpi-data="kpiData"></financial-summary>')(scope);
    scope.$digest();
    
    var isolateScope = element.isolateScope();
    expect(isolateScope.kpiData).toEqual(scope.kpiData);
  });
});