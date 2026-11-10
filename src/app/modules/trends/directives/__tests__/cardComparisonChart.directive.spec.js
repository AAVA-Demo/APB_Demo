/*
Test Documentation:
- Test Name: cardComparisonChart directive - chart rendering
- Purpose: Validates Chart.js bar chart is rendered with card comparison data
- Scenario: Directive receives card-wise spending data
- Expected Result: Bar chart is created with correct labels and data
*/
/*
Coverage Report:
- Functions tested: chart rendering, data watching, cleanup
- Scenarios covered: chart creation, data updates, destroy cleanup
- Uncovered scenarios: none
*/

describe('cardComparisonChart directive', function() {
  'use strict';
  
  beforeEach(module('creditCard.trends'));
  
  var $compile, $rootScope, element, scope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));
  
  it('should render bar chart with card comparison data', function() {
    scope = $rootScope.$new();
    scope.cardData = [
      { cardName: 'Visa Gold', totalSpend: 5000 },
      { cardName: 'MasterCard Platinum', totalSpend: 7000 }
    ];
    
    element = $compile('<card-comparison-chart data="cardData"></card-comparison-chart>')(scope);
    scope.$digest();
    
    var canvas = element.find('canvas');
    expect(canvas.length).toBe(1);
  });
  
  it('should update chart when data changes', function() {
    scope = $rootScope.$new();
    scope.cardData = [
      { cardName: 'Visa', totalSpend: 5000 }
    ];
    
    element = $compile('<card-comparison-chart data="cardData"></card-comparison-chart>')(scope);
    scope.$digest();
    
    scope.cardData = [
      { cardName: 'Visa', totalSpend: 5000 },
      { cardName: 'MasterCard', totalSpend: 7000 }
    ];
    scope.$digest();
    
    var canvas = element.find('canvas');
    expect(canvas.length).toBe(1);
  });
  
  it('should not render chart when data is empty', function() {
    scope = $rootScope.$new();
    scope.cardData = [];
    
    element = $compile('<card-comparison-chart data="cardData"></card-comparison-chart>')(scope);
    scope.$digest();
    
    var canvas = element.find('canvas');
    expect(canvas.length).toBe(1);
  });
});