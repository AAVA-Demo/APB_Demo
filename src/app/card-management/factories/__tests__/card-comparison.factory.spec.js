/*
Test Documentation:
- Test Name: cardComparisonFactory - compareCards
- Purpose: Validates that compareCards creates a comparison structure for multiple cards
- Scenario: When compareCards is called with card array, it should return comparison data
- Expected Result: Returns object with cards array and comparison metrics (limits, balances, available, utilization)
*/
/*
Test Documentation:
- Test Name: cardComparisonFactory - compareCards with insufficient cards
- Purpose: Validates that compareCards handles cases with fewer than 2 cards
- Scenario: When compareCards is called with less than 2 cards, it should return null
- Expected Result: Returns null for empty array, single card, or null input
*/
/*
Coverage Report:
- Functions tested: compareCards
- Scenarios covered: valid comparison, insufficient cards, comparison structure, utilization calculation
- Edge cases: empty array, single card, null input, undefined input, utilization percentage calculation
- Uncovered scenarios: none
*/

describe('cardComparisonFactory', function() {
  'use strict';
  
  beforeEach(module('cardManagementModule'));
  
  var cardComparisonFactory;
  
  beforeEach(inject(function(_cardComparisonFactory_) {
    cardComparisonFactory = _cardComparisonFactory_;
  }));
  
  describe('compareCards', function() {
    it('should be defined', function() {
      expect(cardComparisonFactory.compareCards).toBeDefined();
      expect(typeof cardComparisonFactory.compareCards).toBe('function');
    });
    
    it('should return null for empty array', function() {
      var result = cardComparisonFactory.compareCards([]);
      expect(result).toBeNull();
    });
    
    it('should return null for single card', function() {
      var cards = [
        {cardName: 'Visa', totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000}
      ];
      var result = cardComparisonFactory.compareCards(cards);
      expect(result).toBeNull();
    });
    
    it('should return null for null input', function() {
      var result = cardComparisonFactory.compareCards(null);
      expect(result).toBeNull();
    });
    
    it('should return null for undefined input', function() {
      var result = cardComparisonFactory.compareCards(undefined);
      expect(result).toBeNull();
    });
    
    it('should return comparison object for two cards', function() {
      var cards = [
        {cardName: 'Visa', totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000},
        {cardName: 'MasterCard', totalLimit: 30000, outstandingBalance: 8000, availableCredit: 22000}
      ];
      var result = cardComparisonFactory.compareCards(cards);
      expect(result).not.toBeNull();
      expect(result.cards).toBeDefined();
      expect(result.comparison).toBeDefined();
    });
    
    it('should include cards array in result', function() {
      var cards = [
        {cardName: 'Visa', totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000},
        {cardName: 'MasterCard', totalLimit: 30000, outstandingBalance: 8000, availableCredit: 22000}
      ];
      var result = cardComparisonFactory.compareCards(cards);
      expect(result.cards).toEqual(cards);
    });
    
    it('should include comparison with limits', function() {
      var cards = [
        {cardName: 'Visa', totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000},
        {cardName: 'MasterCard', totalLimit: 30000, outstandingBalance: 8000, availableCredit: 22000}
      ];
      var result = cardComparisonFactory.compareCards(cards);
      expect(result.comparison.limits).toBeDefined();
      expect(result.comparison.limits.length).toBe(2);
      expect(result.comparison.limits[0]).toEqual({cardName: 'Visa', value: 50000});
      expect(result.comparison.limits[1]).toEqual({cardName: 'MasterCard', value: 30000});
    });
    
    it('should include comparison with balances', function() {
      var cards = [
        {cardName: 'Visa', totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000},
        {cardName: 'MasterCard', totalLimit: 30000, outstandingBalance: 8000, availableCredit: 22000}
      ];
      var result = cardComparisonFactory.compareCards(cards);
      expect(result.comparison.balances).toBeDefined();
      expect(result.comparison.balances.length).toBe(2);
      expect(result.comparison.balances[0]).toEqual({cardName: 'Visa', value: 15000});
      expect(result.comparison.balances[1]).toEqual({cardName: 'MasterCard', value: 8000});
    });
    
    it('should include comparison with available credit', function() {
      var cards = [
        {cardName: 'Visa', totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000},
        {cardName: 'MasterCard', totalLimit: 30000, outstandingBalance: 8000, availableCredit: 22000}
      ];
      var result = cardComparisonFactory.compareCards(cards);
      expect(result.comparison.available).toBeDefined();
      expect(result.comparison.available.length).toBe(2);
      expect(result.comparison.available[0]).toEqual({cardName: 'Visa', value: 35000});
      expect(result.comparison.available[1]).toEqual({cardName: 'MasterCard', value: 22000});
    });
    
    it('should calculate utilization percentage correctly', function() {
      var cards = [
        {cardName: 'Visa', totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000},
        {cardName: 'MasterCard', totalLimit: 30000, outstandingBalance: 8000, availableCredit: 22000}
      ];
      var result = cardComparisonFactory.compareCards(cards);
      expect(result.comparison.utilization).toBeDefined();
      expect(result.comparison.utilization.length).toBe(2);
      expect(result.comparison.utilization[0]).toEqual({cardName: 'Visa', value: '30.0%'});
      expect(result.comparison.utilization[1]).toEqual({cardName: 'MasterCard', value: '26.7%'});
    });
    
    it('should handle three or more cards', function() {
      var cards = [
        {cardName: 'Visa', totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000},
        {cardName: 'MasterCard', totalLimit: 30000, outstandingBalance: 8000, availableCredit: 22000},
        {cardName: 'Amex', totalLimit: 70000, outstandingBalance: 10000, availableCredit: 60000}
      ];
      var result = cardComparisonFactory.compareCards(cards);
      expect(result).not.toBeNull();
      expect(result.cards.length).toBe(3);
      expect(result.comparison.limits.length).toBe(3);
      expect(result.comparison.balances.length).toBe(3);
      expect(result.comparison.available.length).toBe(3);
      expect(result.comparison.utilization.length).toBe(3);
    });
    
    it('should format utilization to one decimal place', function() {
      var cards = [
        {cardName: 'Card1', totalLimit: 100000, outstandingBalance: 33333, availableCredit: 66667},
        {cardName: 'Card2', totalLimit: 50000, outstandingBalance: 12345, availableCredit: 37655}
      ];
      var result = cardComparisonFactory.compareCards(cards);
      expect(result.comparison.utilization[0].value).toBe('33.3%');
      expect(result.comparison.utilization[1].value).toBe('24.7%');
    });
    
    it('should handle zero balance utilization', function() {
      var cards = [
        {cardName: 'Card1', totalLimit: 50000, outstandingBalance: 0, availableCredit: 50000},
        {cardName: 'Card2', totalLimit: 30000, outstandingBalance: 0, availableCredit: 30000}
      ];
      var result = cardComparisonFactory.compareCards(cards);
      expect(result.comparison.utilization[0].value).toBe('0.0%');
      expect(result.comparison.utilization[1].value).toBe('0.0%');
    });
    
    it('should handle full balance utilization', function() {
      var cards = [
        {cardName: 'Card1', totalLimit: 50000, outstandingBalance: 50000, availableCredit: 0},
        {cardName: 'Card2', totalLimit: 30000, outstandingBalance: 30000, availableCredit: 0}
      ];
      var result = cardComparisonFactory.compareCards(cards);
      expect(result.comparison.utilization[0].value).toBe('100.0%');
      expect(result.comparison.utilization[1].value).toBe('100.0%');
    });
  });
  
  describe('factory structure', function() {
    it('should return an object with compareCards function', function() {
      expect(typeof cardComparisonFactory).toBe('object');
      expect(cardComparisonFactory.compareCards).toBeDefined();
    });
  });
});