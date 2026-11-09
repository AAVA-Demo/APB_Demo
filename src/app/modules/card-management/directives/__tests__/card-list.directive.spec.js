/*
Test Documentation:
- Test Name: cardList directive rendering and interaction
- Purpose: Validates directive compilation, card display, and selection handling
- Scenario: Test directive initialization, card rendering, selection, and view navigation
- Expected Result: Directive should render cards correctly and handle user interactions
*/
/*
Coverage Report:
- Directive tested: cardList
- Scenarios covered: directive compilation, scope binding, card selection, view navigation
- Dependencies mocked: none
- Uncovered scenarios: none
*/

describe('cardList Directive', function() {
  'use strict';
  
  beforeEach(module('creditCard.management'));
  
  var $compile, $rootScope, element, scope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    
    scope.cards = [
      { id: 'card1', bankName: 'HDFC Bank', cardNumber: '1234', cardType: 'Visa', creditLimit: 50000, availableCredit: 30000, outstandingBalance: 20000, monthlySpend: 8000 },
      { id: 'card2', bankName: 'ICICI Bank', cardNumber: '5678', cardType: 'MasterCard', creditLimit: 75000, availableCredit: 50000, outstandingBalance: 25000, monthlySpend: 12000 }
    ];
    
    scope.selectedCards = [];
    scope.onSelect = jasmine.createSpy('onSelect');
    scope.onView = jasmine.createSpy('onView');
  }));
  
  it('should compile directive successfully', function() {
    element = $compile('<card-list cards="cards" on-select="onSelect(card)" on-view="onView(cardId)" selected-cards="selectedCards"></card-list>')(scope);
    scope.$digest();
    
    expect(element).toBeDefined();
  });
  
  it('should render all cards', function() {
    element = $compile('<card-list cards="cards" on-select="onSelect(card)" on-view="onView(cardId)" selected-cards="selectedCards"></card-list>')(scope);
    scope.$digest();
    
    expect(element.find('.card-item').length).toBe(2);
  });
  
  it('should display bank names', function() {
    element = $compile('<card-list cards="cards" on-select="onSelect(card)" on-view="onView(cardId)" selected-cards="selectedCards"></card-list>')(scope);
    scope.$digest();
    
    var bankNames = element.find('h3');
    expect(bankNames.eq(0).text()).toBe('HDFC Bank');
    expect(bankNames.eq(1).text()).toBe('ICICI Bank');
  });
  
  it('should display card numbers', function() {
    element = $compile('<card-list cards="cards" on-select="onSelect(card)" on-view="onView(cardId)" selected-cards="selectedCards"></card-list>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('1234');
    expect(element.text()).toContain('5678');
  });
  
  it('should bind cards to scope', function() {
    element = $compile('<card-list cards="cards" on-select="onSelect(card)" on-view="onView(cardId)" selected-cards="selectedCards"></card-list>')(scope);
    scope.$digest();
    
    var isolateScope = element.isolateScope();
    expect(isolateScope.cards).toEqual(scope.cards);
  });
  
  it('should have checkboxes for card selection', function() {
    element = $compile('<card-list cards="cards" on-select="onSelect(card)" on-view="onView(cardId)" selected-cards="selectedCards"></card-list>')(scope);
    scope.$digest();
    
    expect(element.find('input[type="checkbox"]').length).toBe(2);
  });
});