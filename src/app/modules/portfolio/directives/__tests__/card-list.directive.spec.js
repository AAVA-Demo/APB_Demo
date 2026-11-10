/*
Test Documentation:
- Test Name: cardList directive - rendering
- Purpose: Verify directive renders card list correctly
- Scenario: Directive compiled with card data
- Expected Result: All cards rendered with correct information
*/
/*
Test Documentation:
- Test Name: cardList directive - card selection
- Purpose: Verify card selection callback is invoked
- Scenario: User clicks on a card
- Expected Result: onSelect callback called with selected card
*/
/*
Test Documentation:
- Test Name: cardList directive - utilization bar
- Purpose: Verify utilization bar width reflects percentage
- Scenario: Cards with different utilization percentages
- Expected Result: Bar width matches utilization percentage
*/
/*
Coverage Report:
- Functions tested: directive rendering, card selection, data display
- Scenarios covered: rendering, interaction, data binding
- Uncovered scenarios: none
*/

describe('cardList directive', function() {
  'use strict';

  var $compile, $rootScope, element, scope;

  beforeEach(module('app.portfolio'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));

  it('should render all cards in the list', function() {
    scope.cards = [
      { cardId: 'card1', cardName: 'Card 1', cardNumber: '**** 1234', creditLimit: 10000, currentBalance: 3000, availableCredit: 7000, utilizationPercentage: '30.00' },
      { cardId: 'card2', cardName: 'Card 2', cardNumber: '**** 5678', creditLimit: 20000, currentBalance: 15000, availableCredit: 5000, utilizationPercentage: '75.00' }
    ];
    scope.onSelectCallback = jasmine.createSpy('onSelectCallback');

    element = $compile('<card-list cards="cards" on-select="onSelectCallback(card)"></card-list>')(scope);
    scope.$digest();

    var cards = element.find('.card-item');
    expect(cards.length).toBe(2);
    expect(element.text()).toContain('Card 1');
    expect(element.text()).toContain('Card 2');
  });

  it('should display card details correctly', function() {
    scope.cards = [
      { cardId: 'card1', cardName: 'Test Card', cardNumber: '**** 9999', creditLimit: 5000, currentBalance: 1000, availableCredit: 4000, utilizationPercentage: '20.00' }
    ];
    scope.onSelectCallback = jasmine.createSpy('onSelectCallback');

    element = $compile('<card-list cards="cards" on-select="onSelectCallback(card)"></card-list>')(scope);
    scope.$digest();

    expect(element.text()).toContain('Test Card');
    expect(element.text()).toContain('**** 9999');
    expect(element.text()).toContain('5,000');
    expect(element.text()).toContain('1,000');
    expect(element.text()).toContain('4,000');
    expect(element.text()).toContain('20.00%');
  });

  it('should invoke onSelect callback when card is clicked', function() {
    scope.cards = [
      { cardId: 'card1', cardName: 'Card 1', cardNumber: '**** 1234', creditLimit: 10000, currentBalance: 3000, availableCredit: 7000, utilizationPercentage: '30.00' }
    ];
    scope.onSelectCallback = jasmine.createSpy('onSelectCallback');

    element = $compile('<card-list cards="cards" on-select="onSelectCallback(card)"></card-list>')(scope);
    scope.$digest();

    var cardElement = element.find('.card-item').first();
    cardElement.click();
    scope.$digest();

    expect(scope.onSelectCallback).toHaveBeenCalledWith(scope.cards[0]);
  });

  it('should render utilization bar with correct width', function() {
    scope.cards = [
      { cardId: 'card1', cardName: 'Card 1', cardNumber: '**** 1234', creditLimit: 10000, currentBalance: 5000, availableCredit: 5000, utilizationPercentage: '50.00' }
    ];
    scope.onSelectCallback = jasmine.createSpy('onSelectCallback');

    element = $compile('<card-list cards="cards" on-select="onSelectCallback(card)"></card-list>')(scope);
    scope.$digest();

    var utilizationFill = element.find('.utilization-fill').first();
    var width = utilizationFill.css('width');

    expect(width).toBe('50%');
  });

  it('should handle empty card list', function() {
    scope.cards = [];
    scope.onSelectCallback = jasmine.createSpy('onSelectCallback');

    element = $compile('<card-list cards="cards" on-select="onSelectCallback(card)"></card-list>')(scope);
    scope.$digest();

    var cards = element.find('.card-item');
    expect(cards.length).toBe(0);
  });

  it('should update when cards array changes', function() {
    scope.cards = [
      { cardId: 'card1', cardName: 'Card 1', cardNumber: '**** 1234', creditLimit: 10000, currentBalance: 3000, availableCredit: 7000, utilizationPercentage: '30.00' }
    ];
    scope.onSelectCallback = jasmine.createSpy('onSelectCallback');

    element = $compile('<card-list cards="cards" on-select="onSelectCallback(card)"></card-list>')(scope);
    scope.$digest();

    expect(element.find('.card-item').length).toBe(1);

    scope.cards.push({ cardId: 'card2', cardName: 'Card 2', cardNumber: '**** 5678', creditLimit: 20000, currentBalance: 15000, availableCredit: 5000, utilizationPercentage: '75.00' });
    scope.$digest();

    expect(element.find('.card-item').length).toBe(2);
  });
});