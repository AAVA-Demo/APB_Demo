/*
Test Documentation:
- Test Name: KPIAggregationService - calculateKPIs with valid data
- Purpose: Validates KPI calculation from cards and transactions
- Scenario: Service receives array of cards and transactions
- Expected Result: Returns accurate KPIs including totalCreditLimit, totalAvailableCredit, totalOutstanding, monthlySpend

- Test Name: KPIAggregationService - calculateKPIs with empty arrays
- Purpose: Validates handling of empty data sets
- Scenario: Service receives empty cards and transactions arrays
- Expected Result: Returns KPIs with zero values

- Test Name: KPIAggregationService - calculateKPIs rounds to 2 decimal places
- Purpose: Validates financial calculation precision
- Scenario: Calculations result in more than 2 decimal places
- Expected Result: All KPI values are rounded to 2 decimal places

- Test Name: KPIAggregationService - calculateKPIs includes lastUpdated timestamp
- Purpose: Validates timestamp inclusion for cache management
- Scenario: KPIs are calculated
- Expected Result: Result includes lastUpdated Date object

Coverage Report:
- Functions tested: calculateKPIs
- Scenarios covered: normal calculation, empty data, rounding, timestamp, aggregation logic
- Uncovered scenarios: none
*/

describe('KPIAggregationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var KPIAggregationService;
  
  beforeEach(inject(function(_KPIAggregationService_) {
    KPIAggregationService = _KPIAggregationService_;
  }));
  
  describe('calculateKPIs', function() {
    it('should calculate KPIs with valid card and transaction data', function() {
      var cards = [
        { creditLimit: 10000, availableCredit: 7500, currentBalance: 2500 },
        { creditLimit: 15000, availableCredit: 10000, currentBalance: 5000 }
      ];
      
      var transactions = [
        { amount: 150.50 },
        { amount: 75.00 },
        { amount: 200.00 }
      ];
      
      var result = KPIAggregationService.calculateKPIs(cards, transactions);
      
      expect(result.totalCreditLimit).toBe(25000);
      expect(result.totalAvailableCredit).toBe(17500);
      expect(result.totalOutstanding).toBe(7500);
      expect(result.monthlySpend).toBe(425.50);
      expect(result.lastUpdated).toBeDefined();
      expect(result.lastUpdated instanceof Date).toBe(true);
    });
    
    it('should handle empty cards and transactions arrays', function() {
      var result = KPIAggregationService.calculateKPIs([], []);
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.monthlySpend).toBe(0);
    });
    
    it('should round all values to 2 decimal places', function() {
      var cards = [
        { creditLimit: 10000.556, availableCredit: 7500.444, currentBalance: 2500.112 }
      ];
      
      var transactions = [
        { amount: 150.556 },
        { amount: 75.444 }
      ];
      
      var result = KPIAggregationService.calculateKPIs(cards, transactions);
      
      expect(result.totalCreditLimit).toBe(10000.56);
      expect(result.totalAvailableCredit).toBe(7500.44);
      expect(result.totalOutstanding).toBe(2500.11);
      expect(result.monthlySpend).toBe(226.00);
    });
    
    it('should handle missing or undefined values in cards', function() {
      var cards = [
        { creditLimit: 10000 },
        { availableCredit: 5000 },
        {}
      ];
      
      var transactions = [{ amount: 100 }];
      
      var result = KPIAggregationService.calculateKPIs(cards, transactions);
      
      expect(result.totalCreditLimit).toBe(10000);
      expect(result.totalAvailableCredit).toBe(5000);
      expect(result.totalOutstanding).toBe(0);
    });
    
    it('should handle missing or undefined values in transactions', function() {
      var cards = [{ creditLimit: 10000, availableCredit: 7500, currentBalance: 2500 }];
      
      var transactions = [
        { amount: 100 },
        {},
        { amount: 50 }
      ];
      
      var result = KPIAggregationService.calculateKPIs(cards, transactions);
      expect(result.monthlySpend).toBe(150);
    });
    
    it('should include lastUpdated timestamp', function() {
      var beforeTime = new Date();
      var result = KPIAggregationService.calculateKPIs([], []);
      var afterTime = new Date();
      
      expect(result.lastUpdated).toBeDefined();
      expect(result.lastUpdated.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(result.lastUpdated.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });
  });
});