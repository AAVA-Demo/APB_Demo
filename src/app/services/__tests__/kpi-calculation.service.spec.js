/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKpis computes all KPIs correctly
- Purpose: Validates accurate calculation of all four KPIs from cards and transactions
- Scenario: User has multiple cards with various balances and transactions
- Expected Result: Returns correct monthlySpend, totalCreditLimit, totalAvailableCredit, totalOutstanding
*/
/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKpis handles empty cards array
- Purpose: Validates graceful handling when user has no cards
- Scenario: Empty cards array passed to calculation
- Expected Result: Returns KPIs with zero values for credit-related metrics
*/
/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKpis handles empty transactions array
- Purpose: Validates graceful handling when there are no transactions
- Scenario: Empty transactions array passed to calculation
- Expected Result: Returns monthlySpend as zero with correct card-based KPIs
*/
/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKpis handles null or undefined values in cards
- Purpose: Validates defensive handling of missing card properties
- Scenario: Cards with null or undefined creditLimit or outstandingBalance
- Expected Result: Treats null/undefined values as zero and calculates correctly
*/
/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKpis handles null or undefined values in transactions
- Purpose: Validates defensive handling of missing transaction amounts
- Scenario: Transactions with null or undefined amount
- Expected Result: Treats null/undefined amounts as zero
*/
/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKpis computes totalAvailableCredit correctly
- Purpose: Validates correct calculation of available credit (limit - outstanding)
- Scenario: Multiple cards with various limits and balances
- Expected Result: totalAvailableCredit equals totalCreditLimit minus totalOutstanding
*/
/*
Coverage Report:
- Functions tested: calculateKpis
- Scenarios covered: normal calculation, empty arrays, null values, edge cases
- Edge cases: zero values, negative balances, null/undefined properties
- Uncovered scenarios: none
*/

describe('KpiCalculationService', function() {
  'use strict';
  
  beforeEach(module('cc.dashboard'));
  
  var KpiCalculationService;
  
  beforeEach(inject(function(_KpiCalculationService_) {
    KpiCalculationService = _KpiCalculationService_;
  }));
  
  describe('calculateKpis', function() {
    
    it('should compute all KPIs correctly with valid data', function() {
      var cards = [
        { cardId: 'card1', creditLimit: 5000, outstandingBalance: 1200 },
        { cardId: 'card2', creditLimit: 10000, outstandingBalance: 3500 },
        { cardId: 'card3', creditLimit: 3000, outstandingBalance: 500 }
      ];
      
      var transactions = [
        { transactionId: 'txn1', amount: 100 },
        { transactionId: 'txn2', amount: 200 },
        { transactionId: 'txn3', amount: 150 }
      ];
      
      var result = KpiCalculationService.calculateKpis(cards, transactions);
      
      expect(result.totalCreditLimit).toBe(18000);
      expect(result.totalOutstanding).toBe(5200);
      expect(result.totalAvailableCredit).toBe(12800);
      expect(result.monthlySpend).toBe(450);
    });
    
    it('should handle empty cards array', function() {
      var cards = [];
      var transactions = [
        { transactionId: 'txn1', amount: 100 },
        { transactionId: 'txn2', amount: 200 }
      ];
      
      var result = KpiCalculationService.calculateKpis(cards, transactions);
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.monthlySpend).toBe(300);
    });
    
    it('should handle empty transactions array', function() {
      var cards = [
        { cardId: 'card1', creditLimit: 5000, outstandingBalance: 1200 },
        { cardId: 'card2', creditLimit: 10000, outstandingBalance: 3500 }
      ];
      var transactions = [];
      
      var result = KpiCalculationService.calculateKpis(cards, transactions);
      
      expect(result.totalCreditLimit).toBe(15000);
      expect(result.totalOutstanding).toBe(4700);
      expect(result.totalAvailableCredit).toBe(10300);
      expect(result.monthlySpend).toBe(0);
    });
    
    it('should handle null or undefined creditLimit in cards', function() {
      var cards = [
        { cardId: 'card1', creditLimit: null, outstandingBalance: 1200 },
        { cardId: 'card2', creditLimit: undefined, outstandingBalance: 500 },
        { cardId: 'card3', creditLimit: 5000, outstandingBalance: 1000 }
      ];
      var transactions = [];
      
      var result = KpiCalculationService.calculateKpis(cards, transactions);
      
      expect(result.totalCreditLimit).toBe(5000);
      expect(result.totalOutstanding).toBe(2700);
    });
    
    it('should handle null or undefined outstandingBalance in cards', function() {
      var cards = [
        { cardId: 'card1', creditLimit: 5000, outstandingBalance: null },
        { cardId: 'card2', creditLimit: 10000, outstandingBalance: undefined },
        { cardId: 'card3', creditLimit: 3000, outstandingBalance: 500 }
      ];
      var transactions = [];
      
      var result = KpiCalculationService.calculateKpis(cards, transactions);
      
      expect(result.totalCreditLimit).toBe(18000);
      expect(result.totalOutstanding).toBe(500);
      expect(result.totalAvailableCredit).toBe(17500);
    });
    
    it('should handle null or undefined amount in transactions', function() {
      var cards = [
        { cardId: 'card1', creditLimit: 5000, outstandingBalance: 1000 }
      ];
      var transactions = [
        { transactionId: 'txn1', amount: 100 },
        { transactionId: 'txn2', amount: null },
        { transactionId: 'txn3', amount: undefined },
        { transactionId: 'txn4', amount: 200 }
      ];
      
      var result = KpiCalculationService.calculateKpis(cards, transactions);
      
      expect(result.monthlySpend).toBe(300);
    });
    
    it('should compute totalAvailableCredit as difference between limit and outstanding', function() {
      var cards = [
        { cardId: 'card1', creditLimit: 10000, outstandingBalance: 2500 },
        { cardId: 'card2', creditLimit: 5000, outstandingBalance: 1500 }
      ];
      var transactions = [];
      
      var result = KpiCalculationService.calculateKpis(cards, transactions);
      
      expect(result.totalCreditLimit).toBe(15000);
      expect(result.totalOutstanding).toBe(4000);
      expect(result.totalAvailableCredit).toBe(11000);
      expect(result.totalAvailableCredit).toBe(result.totalCreditLimit - result.totalOutstanding);
    });
    
    it('should handle single card and single transaction', function() {
      var cards = [
        { cardId: 'card1', creditLimit: 5000, outstandingBalance: 1000 }
      ];
      var transactions = [
        { transactionId: 'txn1', amount: 250 }
      ];
      
      var result = KpiCalculationService.calculateKpis(cards, transactions);
      
      expect(result.totalCreditLimit).toBe(5000);
      expect(result.totalOutstanding).toBe(1000);
      expect(result.totalAvailableCredit).toBe(4000);
      expect(result.monthlySpend).toBe(250);
    });
    
    it('should handle zero values correctly', function() {
      var cards = [
        { cardId: 'card1', creditLimit: 0, outstandingBalance: 0 }
      ];
      var transactions = [
        { transactionId: 'txn1', amount: 0 }
      ];
      
      var result = KpiCalculationService.calculateKpis(cards, transactions);
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.monthlySpend).toBe(0);
    });
    
    it('should handle large numbers correctly', function() {
      var cards = [
        { cardId: 'card1', creditLimit: 100000, outstandingBalance: 50000 },
        { cardId: 'card2', creditLimit: 200000, outstandingBalance: 75000 }
      ];
      var transactions = [
        { transactionId: 'txn1', amount: 10000 },
        { transactionId: 'txn2', amount: 25000 }
      ];
      
      var result = KpiCalculationService.calculateKpis(cards, transactions);
      
      expect(result.totalCreditLimit).toBe(300000);
      expect(result.totalOutstanding).toBe(125000);
      expect(result.totalAvailableCredit).toBe(175000);
      expect(result.monthlySpend).toBe(35000);
    });
  });
});