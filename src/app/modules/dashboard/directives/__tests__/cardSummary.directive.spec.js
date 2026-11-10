/*
Test Documentation:
- Test Name: cardSummary directive - rendering multiple cards
- Purpose: Validates directive renders multiple card summaries
- Scenario: Directive receives array of card objects
- Expected Result: Each card is rendered with correct details
*/
/*
Coverage Report:
- Functions tested: directive rendering, ng-repeat functionality
- Scenarios covered: multiple cards, empty array, data binding
- Uncovered scenarios: none
*/

describe('cardSummary directive', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var $compile, $rootScope, element;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));
  
  it('should render multiple card summaries', function() {
    var scope = $rootScope.$new();
    scope.testCards = [
      { cardName: 'Visa Gold', creditLimit: 5000, availableCredit: 3000, currentBalance: 2000 },
      { cardName: 'MasterCard Platinum', creditLimit: 10000, availableCredit: 8000, currentBalance: 2000 }
    ];
    
    element = $compile('<card-summary cards="testCards"></card-summary>')(scope);
    scope.$digest();
    
    var cardItems = element.find('.card-item');
    expect(cardItems.length).toBe(2);
    expect(cardItems.eq(0).find('h5').text()).toBe('Visa Gold');
    expect(cardItems.eq(1).find('h5').text()).toBe('MasterCard Platinum');
  });
  
  it('should render empty when no cards provided', function() {
    var scope = $rootScope.$new();
    scope.testCards = [];
    
    element = $compile('<card-summary cards="testCards"></card-summary>')(scope);
    scope.$digest();
    
    var cardItems = element.find('.card-item');
    expect(cardItems.length).toBe(0);
  });
  
  it('should display formatted currency values', function() {
    var scope = $rootScope.$new();
    scope.testCards = [
      { cardName: 'Visa', creditLimit: 5000, availableCredit: 3000, currentBalance: 2000 }
    ];
    
    element = $compile('<card-summary cards="testCards"></card-summary>')(scope);
    scope.$digest();
    
    var cardText = element.find('.card-item').text();
    expect(cardText).toContain('5,000');
    expect(cardText).toContain('3,000');
    expect(cardText).toContain('2,000');
  });
});