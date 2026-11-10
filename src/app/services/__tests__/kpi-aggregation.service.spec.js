/*
Test Documentation:
- Test Name: KPIAggregationService - aggregateKPIs calculates total monthly spend
- Purpose: Validates aggregation of monthly spend across all cards
- Scenario: Service receives array of credit cards with monthlySpend values
- Expected Result: Returns KPI object with correct totalMonthlySpend
*/
/*
Test Documentation:
- Test Name: KPIAggregationService - aggregateKPIs calculates all KPI metrics
- Purpose: Validates calculation of all dashboard KPIs
- Scenario: Service receives multiple credit cards
- Expected Result: Returns object with totalCreditLimit, totalAvailableCredit, totalOutstanding, cardCount
*/
/*
Test Documentation:
- Test Name: KPIAggregationService - aggregateKPIs handles empty card array
- Purpose: Validates handling of edge case with no cards
- Scenario: Service receives empty array
- Expected Result: Returns KPI object with zero values
*/
/*
Coverage Report:
- Functions tested: aggregateKPIs
- Scenarios covered: KPI calculation, multiple cards, empty array, all metrics validation
- Uncovered scenarios: none
*/

describe('KPIAggregationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var KPIAggregationService;
  
  beforeEach(inject(function(_KPIAggregationService_) {
    KPIAggregationService = _KPIAggregationService_;
  }));
  
  describe('aggregateKPIs', function() {
    
    it('should calculate total monthly spend across all cards', function() {
      var mockCards = [
        { monthlySpend: 5000, creditLimit: 50000, availableCredit: 45000, outstandingAmount: 5000 },
        { monthlySpend: 3000, creditLimit: 30000, availableCredit: 27000, outstandingAmount: 3000 },
        { monthlySpend: 2000, creditLimit: 20000, availableCredit: 18000, outstandingAmount: 2000 }
      ];
      
      var result = KPIAggregationService.aggregateKPIs(mockCards);
      
      expect(result).toBeDefined();
      expect(result.totalMonthlySpend).toBe(10000);
    });
    
    it('should calculate total credit limit across all cards', function() {
      var mockCards = [
        { monthlySpend: 5000, creditLimit: 50000, availableCredit: 45000, outstandingAmount: 5000 },
        { monthlySpend: 3000, creditLimit: 30000, availableCredit: 27000, outstandingAmount: 3000 }
      ];
      
      var result = KPIAggregationService.aggregateKPIs(mockCards);
      
      expect(result.totalCreditLimit).toBe(80000);
    });
    
    it('should calculate total available credit across all cards', function() {
      var mockCards = [
        { monthlySpend: 5000, creditLimit: 50000, availableCredit: 45000, outstandingAmount: 5000 },
        { monthlySpend: 3000, creditLimit: 30000, availableCredit: 27000, outstandingAmount: 3000 }
      ];
      
      var result = KPIAggregationService.aggregateKPIs(mockCards);
      
      expect(result.totalAvailableCredit).toBe(72000);
    });
    
    it('should calculate total outstanding amount across all cards', function() {
      var mockCards = [
        { monthlySpend: 5000, creditLimit: 50000, availableCredit: 45000, outstandingAmount: 5000 },
        { monthlySpend: 3000, creditLimit: 30000, availableCredit: 27000, outstandingAmount: 3000 }
      ];
      
      var result = KPIAggregationService.aggregateKPIs(mockCards);
      
      expect(result.totalOutstanding).toBe(8000);
    });
    
    it('should include card count in KPI result', function() {
      var mockCards = [
        { monthlySpend: 5000, creditLimit: 50000, availableCredit: 45000, outstandingAmount: 5000 },
        { monthlySpend: 3000, creditLimit: 30000, availableCredit: 27000, outstandingAmount: 3000 },
        { monthlySpend: 2000, creditLimit: 20000, availableCredit: 18000, outstandingAmount: 2000 }
      ];
      
      var result = KPIAggregationService.aggregateKPIs(mockCards);
      
      expect(result.cardCount).toBe(3);
    });
    
    it('should include original cards array in result', function() {
      var mockCards = [
        { monthlySpend: 5000, creditLimit: 50000, availableCredit: 45000, outstandingAmount: 5000 }
      ];
      
      var result = KPIAggregationService.aggregateKPIs(mockCards);
      
      expect(result.cards).toBeDefined();
      expect(result.cards).toBe(mockCards);
      expect(result.cards.length).toBe(1);
    });
    
    it('should handle empty card array', function() {
      var result = KPIAggregationService.aggregateKPIs([]);
      
      expect(result).toBeDefined();
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.cardCount).toBe(0);
    });
    
    it('should calculate all KPIs correctly with single card', function() {
      var mockCards = [
        { monthlySpend: 5000, creditLimit: 50000, availableCredit: 45000, outstandingAmount: 5000 }
      ];
      
      var result = KPIAggregationService.aggregateKPIs(mockCards);
      
      expect(result.totalMonthlySpend).toBe(5000);
      expect(result.totalCreditLimit).toBe(50000);
      expect(result.totalAvailableCredit).toBe(45000);
      expect(result.totalOutstanding).toBe(5000);
      expect(result.cardCount).toBe(1);
    });
  });
});