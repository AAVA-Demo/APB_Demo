/*
Test Documentation:
- Test Name: CardAggregationFactory - calculateKPIs with valid cards
- Purpose: Validates KPI calculation for multiple credit cards
- Scenario: Factory receives array of cards with valid data
- Expected Result: Returns aggregated KPIs with correct totals
*/
/*
Test Documentation:
- Test Name: CardAggregationFactory - calculateKPIs with empty array
- Purpose: Validates handling of empty card array
- Scenario: Factory receives empty array
- Expected Result: Returns KPIs with zero values
*/
/*
Test Documentation:
- Test Name: CardAggregationFactory - calculateKPIs with null/undefined
- Purpose: Validates handling of null or undefined input
- Scenario: Factory receives null or undefined
- Expected Result: Returns KPIs with zero values
*/
/*
Test Documentation:
- Test Name: CardAggregationFactory - calculateKPIs with missing properties
- Purpose: Validates handling of cards with missing properties
- Scenario: Cards have undefined or null values for some properties
- Expected Result: Treats missing values as zero and calculates correctly
*/
/*
Coverage Report:
- Functions tested: calculateKPIs
- Scenarios covered: valid cards, empty array, null/undefined input, missing properties, single card, multiple cards
- Uncovered scenarios: none
*/

describe('CardAggregationFactory', function() {
  'use strict';
  
  var CardAggregationFactory;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CardAggregationFactory_) {
    CardAggregationFactory = _CardAggregationFactory_;
  }));
  
  describe('calculateKPIs', function() {
    it('should calculate KPIs correctly for multiple valid cards', function() {
      var cards = [
        {
          cardId: 'card1',
          creditLimit: 10000,
          availableCredit: 7000,
          outstandingAmount: 3000,
          monthlySpend: 1500
        },
        {
          cardId: 'card2',
          creditLimit: 5000,
          availableCredit: 3000,
          outstandingAmount: 2000,
          monthlySpend: 800
        },
        {
          cardId: 'card3',
          creditLimit: 15000,
          availableCredit: 12000,
          outstandingAmount: 3000,
          monthlySpend: 2000
        }
      ];
      
      var result = CardAggregationFactory.calculateKPIs(cards);
      
      expect(result.totalCreditLimit).toBe(30000);
      expect(result.totalAvailableCredit).toBe(22000);
      expect(result.totalOutstanding).toBe(8000);
      expect(result.totalMonthlySpend).toBe(4300);
      expect(result.cardCount).toBe(3);
    });
    
    it('should return zero KPIs for empty card array', function() {
      var cards = [];
      
      var result = CardAggregationFactory.calculateKPIs(cards);
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.cardCount).toBe(0);
    });
    
    it('should return zero KPIs when cards is null', function() {
      var result = CardAggregationFactory.calculateKPIs(null);
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.cardCount).toBe(0);
    });
    
    it('should return zero KPIs when cards is undefined', function() {
      var result = CardAggregationFactory.calculateKPIs(undefined);
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.cardCount).toBe(0);
    });
    
    it('should handle cards with missing properties by treating them as zero', function() {
      var cards = [
        {
          cardId: 'card1',
          creditLimit: 10000,
          availableCredit: 7000
          // outstandingAmount and monthlySpend are missing
        },
        {
          cardId: 'card2',
          creditLimit: 5000,
          outstandingAmount: 2000
          // availableCredit and monthlySpend are missing
        }
      ];
      
      var result = CardAggregationFactory.calculateKPIs(cards);
      
      expect(result.totalCreditLimit).toBe(15000);
      expect(result.totalAvailableCredit).toBe(7000);
      expect(result.totalOutstanding).toBe(2000);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.cardCount).toBe(2);
    });
    
    it('should handle cards with null values by treating them as zero', function() {
      var cards = [
        {
          cardId: 'card1',
          creditLimit: null,
          availableCredit: 5000,
          outstandingAmount: null,
          monthlySpend: 1000
        }
      ];
      
      var result = CardAggregationFactory.calculateKPIs(cards);
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(5000);
      expect(result.totalOutstanding).toBe(0);
      expect(result.totalMonthlySpend).toBe(1000);
      expect(result.cardCount).toBe(1);
    });
    
    it('should calculate KPIs correctly for single card', function() {
      var cards = [
        {
          cardId: 'card1',
          creditLimit: 8000,
          availableCredit: 6000,
          outstandingAmount: 2000,
          monthlySpend: 1200
        }
      ];
      
      var result = CardAggregationFactory.calculateKPIs(cards);
      
      expect(result.totalCreditLimit).toBe(8000);
      expect(result.totalAvailableCredit).toBe(6000);
      expect(result.totalOutstanding).toBe(2000);
      expect(result.totalMonthlySpend).toBe(1200);
      expect(result.cardCount).toBe(1);
    });
    
    it('should handle cards with zero values', function() {
      var cards = [
        {
          cardId: 'card1',
          creditLimit: 0,
          availableCredit: 0,
          outstandingAmount: 0,
          monthlySpend: 0
        },
        {
          cardId: 'card2',
          creditLimit: 5000,
          availableCredit: 5000,
          outstandingAmount: 0,
          monthlySpend: 0
        }
      ];
      
      var result = CardAggregationFactory.calculateKPIs(cards);
      
      expect(result.totalCreditLimit).toBe(5000);
      expect(result.totalAvailableCredit).toBe(5000);
      expect(result.totalOutstanding).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.cardCount).toBe(2);
    });
    
    it('should handle large numbers correctly', function() {
      var cards = [
        {
          cardId: 'card1',
          creditLimit: 999999,
          availableCredit: 500000,
          outstandingAmount: 499999,
          monthlySpend: 100000
        },
        {
          cardId: 'card2',
          creditLimit: 888888,
          availableCredit: 400000,
          outstandingAmount: 488888,
          monthlySpend: 200000
        }
      ];
      
      var result = CardAggregationFactory.calculateKPIs(cards);
      
      expect(result.totalCreditLimit).toBe(1888887);
      expect(result.totalAvailableCredit).toBe(900000);
      expect(result.totalOutstanding).toBe(988887);
      expect(result.totalMonthlySpend).toBe(300000);
      expect(result.cardCount).toBe(2);
    });
    
    it('should handle decimal values correctly', function() {
      var cards = [
        {
          cardId: 'card1',
          creditLimit: 10000.50,
          availableCredit: 7000.25,
          outstandingAmount: 3000.25,
          monthlySpend: 1500.75
        },
        {
          cardId: 'card2',
          creditLimit: 5000.25,
          availableCredit: 3000.50,
          outstandingAmount: 2000.75,
          monthlySpend: 800.25
        }
      ];
      
      var result = CardAggregationFactory.calculateKPIs(cards);
      
      expect(result.totalCreditLimit).toBeCloseTo(15000.75, 2);
      expect(result.totalAvailableCredit).toBeCloseTo(10000.75, 2);
      expect(result.totalOutstanding).toBeCloseTo(5001.00, 2);
      expect(result.totalMonthlySpend).toBeCloseTo(2301.00, 2);
      expect(result.cardCount).toBe(2);
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle cards with negative values (treat as provided)', function() {
      var cards = [
        {
          cardId: 'card1',
          creditLimit: 10000,
          availableCredit: -1000,
          outstandingAmount: 11000,
          monthlySpend: 2000
        }
      ];
      
      var result = CardAggregationFactory.calculateKPIs(cards);
      
      expect(result.totalCreditLimit).toBe(10000);
      expect(result.totalAvailableCredit).toBe(-1000);
      expect(result.totalOutstanding).toBe(11000);
      expect(result.totalMonthlySpend).toBe(2000);
    });
    
    it('should handle cards array with mixed valid and invalid objects', function() {
      var cards = [
        {
          cardId: 'card1',
          creditLimit: 10000,
          availableCredit: 7000,
          outstandingAmount: 3000,
          monthlySpend: 1500
        },
        {},
        {
          cardId: 'card2',
          creditLimit: 5000,
          availableCredit: 3000,
          outstandingAmount: 2000,
          monthlySpend: 800
        }
      ];
      
      var result = CardAggregationFactory.calculateKPIs(cards);
      
      expect(result.totalCreditLimit).toBe(15000);
      expect(result.totalAvailableCredit).toBe(10000);
      expect(result.totalOutstanding).toBe(5000);
      expect(result.totalMonthlySpend).toBe(2300);
      expect(result.cardCount).toBe(3);
    });
  });
});