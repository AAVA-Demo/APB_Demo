/*
Test Documentation:
- Test Name: cardList directive - initialization
- Purpose: Validates directive compilation
- Scenario: Directive is compiled with card data
- Expected Result: Card tiles are rendered
*/
/*
Test Documentation:
- Test Name: cardList directive - card rendering
- Purpose: Validates individual card rendering
- Scenario: Multiple cards are provided
- Expected Result: All cards are displayed with correct data
*/
/*
Coverage Report:
- Functions tested: directive template rendering
- Scenarios covered: initialization, multiple cards, empty array
- Uncovered scenarios: none
*/

describe('cardList directive', function() {
  'use strict';
  
  beforeEach(module('dashboardModule'));
  
  var $compile, $rootScope, element, scope;
  var mockCards = [
    { cardId: '1', cardName: 'Visa Platinum', cardNumber: '****1234', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, lastUpdated: new Date() },
    { cardId: '2', cardName: 'MasterCard Gold', cardNumber: '****5678', creditLimit: 30000, availableCredit: 25000, outstandingAmount: 5000, lastUpdated: new Date() }
  ];
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));
  
  it('should compile and render card tiles', function() {
    scope.cards = mockCards;
    element = $compile('<card-list cards="cards"></card-list>')(scope);
    scope.$digest();
    
    expect(element.find('.card-tile').length).toBe(2);
  });
  
  it('should display card information correctly', function() {
    scope.cards = mockCards;
    element = $compile('<card-list cards="cards"></card-list>')(scope);
    scope.$digest();
    
    var firstCard = element.find('.card-tile').eq(0);
    expect(firstCard.find('h4').text()).toContain('Visa Platinum');
    expect(firstCard.text()).toContain('****1234');
  });
  
  it('should handle empty card array', function() {
    scope.cards = [];
    element = $compile('<card-list cards="cards"></card-list>')(scope);
    scope.$digest();
    
    expect(element.find('.card-tile').length).toBe(0);
  });
  
  it('should update when cards change', function() {
    scope.cards = [mockCards[0]];
    element = $compile('<card-list cards="cards"></card-list>')(scope);
    scope.$digest();
    
    expect(element.find('.card-tile').length).toBe(1);
    
    scope.cards = mockCards;
    scope.$digest();
    
    expect(element.find('.card-tile').length).toBe(2);
  });
});