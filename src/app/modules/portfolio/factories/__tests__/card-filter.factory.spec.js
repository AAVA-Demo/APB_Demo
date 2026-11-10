/*
Test Documentation:
- Test Name: CardFilterFactory - filter all cards
- Purpose: Verify factory returns all cards when filter is 'all'
- Scenario: filterCards called with 'all' filter type
- Expected Result: All cards returned unchanged
*/
/*
Test Documentation:
- Test Name: CardFilterFactory - filter high utilization
- Purpose: Verify factory filters cards with utilization > 70%
- Scenario: filterCards called with 'highUtilization' filter
- Expected Result: Only cards with utilization > 70% returned
*/
/*
Test Documentation:
- Test Name: CardFilterFactory - filter active cards
- Purpose: Verify factory filters active cards
- Scenario: filterCards called with 'active' filter
- Expected Result: Only active cards returned
*/
/*
Test Documentation:
- Test Name: CardFilterFactory - filter inactive cards
- Purpose: Verify factory filters inactive cards
- Scenario: filterCards called with 'inactive' filter
- Expected Result: Only inactive cards returned
*/
/*
Coverage Report:
- Functions tested: filterCards
- Scenarios covered: all filter types, edge cases
- Uncovered scenarios: none
*/

describe('CardFilterFactory', function() {
  'use strict';

  var CardFilterFactory;

  beforeEach(module('app.portfolio'));

  beforeEach(inject(function(_CardFilterFactory_) {
    CardFilterFactory = _CardFilterFactory_;
  }));

  it('should return all cards when filter is "all"', function() {
    var cards = [
      { cardId: 'card1', utilizationPercentage: '30.00', status: 'Active' },
      { cardId: 'card2', utilizationPercentage: '75.00', status: 'Active' },
      { cardId: 'card3', utilizationPercentage: '50.00', status: 'Inactive' }
    ];

    var result = CardFilterFactory.filterCards(cards, 'all');

    expect(result.length).toBe(3);
    expect(result).toEqual(cards);
  });

  it('should filter cards with high utilization (> 70%)', function() {
    var cards = [
      { cardId: 'card1', utilizationPercentage: '30.00', status: 'Active' },
      { cardId: 'card2', utilizationPercentage: '75.00', status: 'Active' },
      { cardId: 'card3', utilizationPercentage: '85.00', status: 'Active' },
      { cardId: 'card4', utilizationPercentage: '50.00', status: 'Inactive' }
    ];

    var result = CardFilterFactory.filterCards(cards, 'highUtilization');

    expect(result.length).toBe(2);
    expect(result[0].cardId).toBe('card2');
    expect(result[1].cardId).toBe('card3');
  });

  it('should filter active cards only', function() {
    var cards = [
      { cardId: 'card1', utilizationPercentage: '30.00', status: 'Active' },
      { cardId: 'card2', utilizationPercentage: '75.00', status: 'Active' },
      { cardId: 'card3', utilizationPercentage: '50.00', status: 'Inactive' }
    ];

    var result = CardFilterFactory.filterCards(cards, 'active');

    expect(result.length).toBe(2);
    expect(result[0].status).toBe('Active');
    expect(result[1].status).toBe('Active');
  });

  it('should filter inactive cards only', function() {
    var cards = [
      { cardId: 'card1', utilizationPercentage: '30.00', status: 'Active' },
      { cardId: 'card2', utilizationPercentage: '75.00', status: 'Active' },
      { cardId: 'card3', utilizationPercentage: '50.00', status: 'Inactive' },
      { cardId: 'card4', utilizationPercentage: '20.00', status: 'Inactive' }
    ];

    var result = CardFilterFactory.filterCards(cards, 'inactive');

    expect(result.length).toBe(2);
    expect(result[0].status).toBe('Inactive');
    expect(result[1].status).toBe('Inactive');
  });

  it('should return all cards for unknown filter type', function() {
    var cards = [
      { cardId: 'card1', utilizationPercentage: '30.00', status: 'Active' },
      { cardId: 'card2', utilizationPercentage: '75.00', status: 'Active' }
    ];

    var result = CardFilterFactory.filterCards(cards, 'unknownFilter');

    expect(result.length).toBe(2);
    expect(result).toEqual(cards);
  });

  it('should handle empty card array', function() {
    var cards = [];

    var result = CardFilterFactory.filterCards(cards, 'all');

    expect(result.length).toBe(0);
  });

  it('should handle edge case of exactly 70% utilization', function() {
    var cards = [
      { cardId: 'card1', utilizationPercentage: '70.00', status: 'Active' },
      { cardId: 'card2', utilizationPercentage: '70.01', status: 'Active' },
      { cardId: 'card3', utilizationPercentage: '69.99', status: 'Active' }
    ];

    var result = CardFilterFactory.filterCards(cards, 'highUtilization');

    expect(result.length).toBe(1);
    expect(result[0].cardId).toBe('card2');
  });
});