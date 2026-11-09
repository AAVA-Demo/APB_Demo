/*
Test Documentation:
- Test Name: CardFactory
- Purpose: Verify credit card model creation and utilization calculation
- Scenario: Create card models and calculate utilization percentage
- Expected Result: Factory should create properly structured card objects
*/

describe('CardFactory', function() {
  'use strict';

  var CardFactory;

  beforeEach(module('cardManagementModule'));

  beforeEach(inject(function(_CardFactory_) {
    CardFactory = _CardFactory_;
  }));

  /*
  Test Documentation:
  - Test Name: should be defined
  - Purpose: Verify factory exists
  - Scenario: Inject CardFactory
  - Expected Result: Factory should be defined
  */
  it('should be defined', function() {
    expect(CardFactory).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should create card with all properties
  - Purpose: Verify complete card object creation
  - Scenario: Create card with full data
  - Expected Result: All properties should be set correctly
  */
  it('should create card with all properties', function() {
    var data = {
      cardId: 'card123',
      cardNumber: '1234567890123456',
      cardType: 'Visa',
      creditLimit: 10000,
      availableCredit: 7000,
      outstandingBalance: 3000,
      cardWiseSpend: 2500,
      expiryDate: '12/25',
      cardHolderName: 'John Doe'
    };

    var card = CardFactory.create(data);

    expect(card.cardId).toBe('card123');
    expect(card.cardNumber).toBe('1234567890123456');
    expect(card.cardType).toBe('Visa');
    expect(card.creditLimit).toBe(10000);
    expect(card.availableCredit).toBe(7000);
    expect(card.outstandingBalance).toBe(3000);
    expect(card.cardWiseSpend).toBe(2500);
    expect(card.expiryDate).toBe('12/25');
    expect(card.cardHolderName).toBe('John Doe');
  });

  /*
  Test Documentation:
  - Test Name: should calculate utilization percentage correctly
  - Purpose: Verify utilization calculation
  - Scenario: Card with 30% utilization
  - Expected Result: getUtilizationPercentage should return 30.0
  */
  it('should calculate utilization percentage correctly', function() {
    var card = CardFactory.create({
      creditLimit: 10000,
      availableCredit: 7000
    });

    expect(card.getUtilizationPercentage()).toBe('30.0');
  });

  /*
  Test Documentation:
  - Test Name: should handle zero credit limit
  - Purpose: Verify division by zero handling
  - Scenario: Card with zero credit limit
  - Expected Result: getUtilizationPercentage should return 0
  */
  it('should handle zero credit limit', function() {
    var card = CardFactory.create({
      creditLimit: 0,
      availableCredit: 0
    });

    expect(card.getUtilizationPercentage()).toBe(0);
  });

  /*
  Test Documentation:
  - Test Name: should use default values for missing properties
  - Purpose: Verify default values are applied
  - Scenario: Create card with empty data
  - Expected Result: All properties should have default values
  */
  it('should use default values for missing properties', function() {
    var card = CardFactory.create({});

    expect(card.cardId).toBe('');
    expect(card.cardNumber).toBe('');
    expect(card.cardType).toBe('');
    expect(card.creditLimit).toBe(0);
    expect(card.availableCredit).toBe(0);
    expect(card.outstandingBalance).toBe(0);
    expect(card.cardWiseSpend).toBe(0);
    expect(card.expiryDate).toBe('');
    expect(card.cardHolderName).toBe('');
  });

  /*
  Test Documentation:
  - Test Name: should create list of cards
  - Purpose: Verify batch card creation
  - Scenario: Create multiple cards from array
  - Expected Result: Should return array of card objects
  */
  it('should create list of cards', function() {
    var dataArray = [
      { cardId: 'card1', cardType: 'Visa' },
      { cardId: 'card2', cardType: 'Mastercard' }
    ];

    var cards = CardFactory.createList(dataArray);

    expect(cards.length).toBe(2);
    expect(cards[0].cardId).toBe('card1');
    expect(cards[1].cardId).toBe('card2');
  });

  /*
  Test Documentation:
  - Test Name: should calculate 100% utilization
  - Purpose: Verify maximum utilization calculation
  - Scenario: Card fully utilized
  - Expected Result: getUtilizationPercentage should return 100.0
  */
  it('should calculate 100% utilization', function() {
    var card = CardFactory.create({
      creditLimit: 5000,
      availableCredit: 0
    });

    expect(card.getUtilizationPercentage()).toBe('100.0');
  });
});

/*
Coverage Report:
- Functions tested: create, createList, getUtilizationPercentage
- Scenarios covered: complete object creation, utilization calculation, default values, batch creation, edge cases
- Uncovered scenarios: none
*/