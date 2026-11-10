/*
Test Documentation:
- Test Name: CreditCalculationService - calculateAvailableCredit with valid cards
- Purpose: Verify that available credit is calculated correctly
- Scenario: User has multiple cards with limits and outstanding amounts
- Expected Result: Service returns total available credit (total limit - total outstanding)
*/
/*
Test Documentation:
- Test Name: CreditCalculationService - calculateAvailableCredit with empty array
- Purpose: Verify that service handles empty card array
- Scenario: User has no cards
- Expected Result: Service returns 0
*/
/*
Test Documentation:
- Test Name: CreditCalculationService - calculateAvailableCredit with null input
- Purpose: Verify that service handles null input gracefully
- Scenario: Service receives null instead of card array
- Expected Result: Service returns 0
*/
/*
Test Documentation:
- Test Name: CreditCalculationService - calculateAvailableCredit with undefined input
- Purpose: Verify that service handles undefined input gracefully
- Scenario: Service receives undefined instead of card array
- Expected Result: Service returns 0
*/
/*
Test Documentation:
- Test Name: CreditCalculationService - calculateAvailableCredit with missing properties
- Purpose: Verify that service handles cards with missing creditLimit or outstandingAmount
- Scenario: Some cards have missing financial properties
- Expected Result: Service treats missing values as 0 and calculates correctly
*/
/*
Coverage Report:
- Functions tested: calculateAvailableCredit
- Scenarios covered: valid cards, empty array, null input, undefined input, missing properties, zero values, negative outstanding
- Uncovered scenarios: none
*/

describe('CreditCalculationService', function() {
  'use strict';

  var CreditCalculationService;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCalculationService_) {
    CreditCalculationService = _CreditCalculationService_;
  }));

  it('should calculate available credit correctly with valid cards', function() {
    var cards = [
      {cardId: 'card1', creditLimit: 10000, outstandingAmount: 3000},
      {cardId: 'card2', creditLimit: 15000, outstandingAmount: 5000},
      {cardId: 'card3', creditLimit: 20000, outstandingAmount: 8000}
    ];

    var result = CreditCalculationService.calculateAvailableCredit(cards);

    expect(result).toBe(29000);
  });

  it('should return 0 when cards array is empty', function() {
    var cards = [];

    var result = CreditCalculationService.calculateAvailableCredit(cards);

    expect(result).toBe(0);
  });

  it('should return 0 when cards is null', function() {
    var result = CreditCalculationService.calculateAvailableCredit(null);

    expect(result).toBe(0);
  });

  it('should return 0 when cards is undefined', function() {
    var result = CreditCalculationService.calculateAvailableCredit(undefined);

    expect(result).toBe(0);
  });

  it('should handle cards with missing creditLimit property', function() {
    var cards = [
      {cardId: 'card1', creditLimit: 10000, outstandingAmount: 3000},
      {cardId: 'card2', outstandingAmount: 2000}
    ];

    var result = CreditCalculationService.calculateAvailableCredit(cards);

    expect(result).toBe(5000);
  });

  it('should handle cards with missing outstandingAmount property', function() {
    var cards = [
      {cardId: 'card1', creditLimit: 10000, outstandingAmount: 3000},
      {cardId: 'card2', creditLimit: 5000}
    ];

    var result = CreditCalculationService.calculateAvailableCredit(cards);

    expect(result).toBe(12000);
  });

  it('should handle cards with both properties missing', function() {
    var cards = [
      {cardId: 'card1', creditLimit: 10000, outstandingAmount: 3000},
      {cardId: 'card2'}
    ];

    var result = CreditCalculationService.calculateAvailableCredit(cards);

    expect(result).toBe(7000);
  });

  it('should handle cards with zero values', function() {
    var cards = [
      {cardId: 'card1', creditLimit: 0, outstandingAmount: 0},
      {cardId: 'card2', creditLimit: 5000, outstandingAmount: 0}
    ];

    var result = CreditCalculationService.calculateAvailableCredit(cards);

    expect(result).toBe(5000);
  });

  it('should handle single card correctly', function() {
    var cards = [
      {cardId: 'card1', creditLimit: 10000, outstandingAmount: 3000}
    ];

    var result = CreditCalculationService.calculateAvailableCredit(cards);

    expect(result).toBe(7000);
  });

  it('should handle cards with full utilization', function() {
    var cards = [
      {cardId: 'card1', creditLimit: 10000, outstandingAmount: 10000}
    ];

    var result = CreditCalculationService.calculateAvailableCredit(cards);

    expect(result).toBe(0);
  });

  it('should handle cards with over-utilization (outstanding > limit)', function() {
    var cards = [
      {cardId: 'card1', creditLimit: 10000, outstandingAmount: 12000}
    ];

    var result = CreditCalculationService.calculateAvailableCredit(cards);

    expect(result).toBe(-2000);
  });

  it('should handle large numbers correctly', function() {
    var cards = [
      {cardId: 'card1', creditLimit: 1000000, outstandingAmount: 250000},
      {cardId: 'card2', creditLimit: 500000, outstandingAmount: 100000}
    ];

    var result = CreditCalculationService.calculateAvailableCredit(cards);

    expect(result).toBe(1150000);
  });
});