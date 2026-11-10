/*
Test Documentation:
- Test Name: CardComparisonService - calculateComparison with valid cards
- Purpose: Verify service calculates comparison metrics for multiple cards
- Scenario: Array of cards with spend and utilization data
- Expected Result: Returns comparison object with totals and extremes
*/
/*
Test Documentation:
- Test Name: CardComparisonService - calculateComparison with empty array
- Purpose: Verify service handles empty card list gracefully
- Scenario: Empty array passed to calculateComparison
- Expected Result: Returns default comparison object with zero values
*/
/*
Test Documentation:
- Test Name: CardComparisonService - highest spend card identification
- Purpose: Verify service correctly identifies card with highest monthly spend
- Scenario: Multiple cards with varying spend amounts
- Expected Result: Returns card with maximum monthlySpend value
*/
/*
Test Documentation:
- Test Name: CardComparisonService - lowest utilization card identification
- Purpose: Verify service identifies card with lowest utilization rate
- Scenario: Multiple cards with different utilization rates
- Expected Result: Returns card with minimum utilizationRate
*/
/*
Test Documentation:
- Test Name: CardComparisonService - average utilization calculation
- Purpose: Verify accurate calculation of average utilization across cards
- Scenario: Cards with known utilization rates
- Expected Result: Correct average with 2 decimal places
*/
/*
Coverage Report:
- Functions tested: calculateComparison
- Scenarios covered: valid cards, empty array, highest spend, lowest utilization, average calculation
- Uncovered scenarios: null input, cards with missing properties
*/

describe('CardComparisonService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CardComparisonService;
  
  beforeEach(inject(function(_CardComparisonService_) {
    CardComparisonService = _CardComparisonService_;
  }));
  
  describe('calculateComparison', function() {
    it('should calculate comparison metrics for multiple cards', function() {
      var cards = [
        {
          cardId: 'card1',
          monthlySpend: 15000,
          utilizationRate: 45.5
        },
        {
          cardId: 'card2',
          monthlySpend: 20000,
          utilizationRate: 60.0
        },
        {
          cardId: 'card3',
          monthlySpend: 10000,
          utilizationRate: 30.0
        }
      ];
      
      var result = CardComparisonService.calculateComparison(cards);
      
      expect(result).toBeDefined();
      expect(result.cards).toEqual(cards);
      expect(result.totalSpend).toBe(45000);
      expect(result.averageUtilization).toBe('45.17');
      expect(result.highestSpendCard.cardId).toBe('card2');
      expect(result.lowestUtilizationCard.cardId).toBe('card3');
    });
    
    it('should return default object for empty card array', function() {
      var result = CardComparisonService.calculateComparison([]);
      
      expect(result).toEqual({
        cards: [],
        totalSpend: 0,
        averageUtilization: 0,
        highestSpendCard: null,
        lowestUtilizationCard: null
      });
    });
    
    it('should return default object for null input', function() {
      var result = CardComparisonService.calculateComparison(null);
      
      expect(result.cards).toEqual([]);
      expect(result.totalSpend).toBe(0);
    });
    
    it('should return default object for undefined input', function() {
      var result = CardComparisonService.calculateComparison(undefined);
      
      expect(result.totalSpend).toBe(0);
      expect(result.highestSpendCard).toBe(null);
    });
    
    it('should handle cards with zero spend', function() {
      var cards = [
        { cardId: 'card1', monthlySpend: 0, utilizationRate: 0 },
        { cardId: 'card2', monthlySpend: 0, utilizationRate: 0 }
      ];
      
      var result = CardComparisonService.calculateComparison(cards);
      
      expect(result.totalSpend).toBe(0);
      expect(result.averageUtilization).toBe('0.00');
    });
    
    it('should handle cards with missing monthlySpend', function() {
      var cards = [
        { cardId: 'card1', utilizationRate: 50 },
        { cardId: 'card2', monthlySpend: 10000, utilizationRate: 40 }
      ];
      
      var result = CardComparisonService.calculateComparison(cards);
      
      expect(result.totalSpend).toBe(10000);
      expect(result.highestSpendCard.cardId).toBe('card2');
    });
    
    it('should handle cards with missing utilizationRate', function() {
      var cards = [
        { cardId: 'card1', monthlySpend: 5000 },
        { cardId: 'card2', monthlySpend: 8000, utilizationRate: 60 }
      ];
      
      var result = CardComparisonService.calculateComparison(cards);
      
      expect(result.totalSpend).toBe(13000);
      expect(result.lowestUtilizationCard.cardId).toBe('card1');
    });
    
    it('should handle single card', function() {
      var cards = [
        { cardId: 'card1', monthlySpend: 12000, utilizationRate: 55.5 }
      ];
      
      var result = CardComparisonService.calculateComparison(cards);
      
      expect(result.totalSpend).toBe(12000);
      expect(result.averageUtilization).toBe('55.50');
      expect(result.highestSpendCard.cardId).toBe('card1');
      expect(result.lowestUtilizationCard.cardId).toBe('card1');
    });
    
    it('should identify highest spend card correctly', function() {
      var cards = [
        { cardId: 'card1', monthlySpend: 5000, utilizationRate: 20 },
        { cardId: 'card2', monthlySpend: 25000, utilizationRate: 70 },
        { cardId: 'card3', monthlySpend: 15000, utilizationRate: 50 }
      ];
      
      var result = CardComparisonService.calculateComparison(cards);
      
      expect(result.highestSpendCard.cardId).toBe('card2');
      expect(result.highestSpendCard.monthlySpend).toBe(25000);
    });
    
    it('should identify lowest utilization card correctly', function() {
      var cards = [
        { cardId: 'card1', monthlySpend: 10000, utilizationRate: 80 },
        { cardId: 'card2', monthlySpend: 15000, utilizationRate: 15 },
        { cardId: 'card3', monthlySpend: 12000, utilizationRate: 45 }
      ];
      
      var result = CardComparisonService.calculateComparison(cards);
      
      expect(result.lowestUtilizationCard.cardId).toBe('card2');
      expect(result.lowestUtilizationCard.utilizationRate).toBe(15);
    });
  });
});