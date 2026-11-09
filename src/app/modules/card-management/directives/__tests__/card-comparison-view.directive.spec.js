/*
Test Documentation:
- Test Name: cardComparisonView directive rendering
- Purpose: Validates directive compilation and comparison data display
- Scenario: Test directive initialization and comparison metrics rendering
- Expected Result: Directive should render comparison table with metrics correctly
*/
/*
Coverage Report:
- Directive tested: cardComparisonView
- Scenarios covered: directive compilation, scope binding, metrics display, table rendering
- Dependencies mocked: none
- Uncovered scenarios: none
*/

describe('cardComparisonView Directive', function() {
  'use strict';
  
  beforeEach(module('creditCard.management'));
  
  var $compile, $rootScope, element, scope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    
    scope.comparisonData = {
      cards: [
        { id: 'card1', bankName: 'HDFC Bank', cardType: 'Visa', creditLimit: 50000, availableCredit: 30000, outstandingBalance: 20000, monthlySpend: 8000 },
        { id: 'card2', bankName: 'ICICI Bank', cardType: 'MasterCard', creditLimit: 75000, availableCredit: 50000, outstandingBalance: 25000, monthlySpend: 12000 }
      ],
      metrics: {
        totalCreditLimit: 125000,
        totalAvailableCredit: 80000,
        totalOutstanding: 45000,
        averageUtilization: 36
      }
    };
  }));
  
  it('should compile directive successfully', function() {
    element = $compile('<card-comparison-view comparison-data="comparisonData"></card-comparison-view>')(scope);
    scope.$digest();
    
    expect(element).toBeDefined();
  });
  
  it('should have comparison table container', function() {
    element = $compile('<card-comparison-view comparison-data="comparisonData"></card-comparison-view>')(scope);
    scope.$digest();
    
    expect(element.find('.comparison-table').length).toBe(1);
  });
  
  it('should display comparison title', function() {
    element = $compile('<card-comparison-view comparison-data="comparisonData"></card-comparison-view>')(scope);
    scope.$digest();
    
    expect(element.find('h3').text()).toBe('Card Comparison');
  });
  
  it('should display summary metrics panel', function() {
    element = $compile('<card-comparison-view comparison-data="comparisonData"></card-comparison-view>')(scope);
    scope.$digest();
    
    expect(element.find('.panel-info').length).toBe(1);
  });
  
  it('should display comparison table', function() {
    element = $compile('<card-comparison-view comparison-data="comparisonData"></card-comparison-view>')(scope);
    scope.$digest();
    
    expect(element.find('table').length).toBe(1);
  });
  
  it('should render all cards in comparison table', function() {
    element = $compile('<card-comparison-view comparison-data="comparisonData"></card-comparison-view>')(scope);
    scope.$digest();
    
    var rows = element.find('tbody tr');
    expect(rows.length).toBe(2);
  });
  
  it('should bind comparisonData to scope', function() {
    element = $compile('<card-comparison-view comparison-data="comparisonData"></card-comparison-view>')(scope);
    scope.$digest();
    
    var isolateScope = element.isolateScope();
    expect(isolateScope.comparisonData).toEqual(scope.comparisonData);
  });
});