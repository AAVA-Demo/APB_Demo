/*
Test Documentation:
- Test Name: KPICalculatorFactory - calculateKPIs - successful aggregation
- Purpose: Validates KPI calculation across multiple credit cards
- Scenario: Factory receives array of card objects
- Expected Result: Returns aggregated KPIs including totalCreditLimit, totalAvailableCredit, totalOutstanding, totalMonthlySpend, cardCount
*/
/*
Test Documentation:
- Test Name: KPICalculatorFactory - calculateKPIs - empty card array
- Purpose: Validates handling of empty input
- Scenario: Factory receives empty array
- Expected Result: Returns KPI object with all values set to 0
*/
/*
Test Documentation:
- Test Name: KPICalculatorFactory - calculateKPIs - null/undefined input
- Purpose: Validates handling of invalid input
- Scenario: Factory receives null or undefined
- Expected Result: Returns KPI object with all values set to 0
*/
/*
Test Documentation:
- Test Name: KPICalculatorFactory - calculateKPIs - single card
- Purpose: Validates calculation with single card
- Scenario: Factory receives array with one card
- Expected Result: Returns KPIs matching the single card's values
*/
/*
Coverage Report:
- Functions tested: calculateKPIs
- Scenarios covered: multiple cards aggregation, empty array, null input, undefined input, single card
- Uncovered scenarios: None - all edge cases and normal paths covered
*/

describe('KPICalculatorFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var KPICalculatorFactory;
  
  beforeEach(inject(function(_KPICalculatorFactory_) {
    KPICalculatorFactory = _KPICalculatorFactory_;
  }));
  
  describe('calculateKPIs', function() {
    it('should calculate aggregated KPIs for multiple cards', function() {
      var cards = [
        {creditLimit: 10000, availableCredit: 6500, outstandingAmount: 3500, monthlySpend: 1200},
        {creditLimit: 15000, availableCredit: 10000, outstandingAmount: 5000, monthlySpend: 2100},
        {creditLimit: 20000, availableCredit: 12000, outstandingAmount: 8000, monthlySpend: 3200}
      ];
      
      var kpis = KPICalculatorFactory.calculateKPIs(cards);
      
      expect(kpis.totalCreditLimit).toBe(45000);
      expect(kpis.totalAvailableCredit).toBe(28500);
      expect(kpis.totalOutstanding).toBe(16500);
      expect(kpis.totalMonthlySpend).toBe(6500);
      expect(kpis.cardCount).toBe(3);
    });
    
    it('should return zero values when card array is empty', function() {
      var kpis = KPICalculatorFactory.calculateKPIs([]);
      
      expect(kpis.totalCreditLimit).toBe(0);
      expect(kpis.totalAvailableCredit).toBe(0);
      expect(kpis.totalOutstanding).toBe(0);
      expect(kpis.totalMonthlySpend).toBe(0);
      expect(kpis.cardCount).toBe(0);
    });
    
    it('should return zero values when cards is null', function() {
      var kpis = KPICalculatorFactory.calculateKPIs(null);
      
      expect(kpis.totalCreditLimit).toBe(0);
      expect(kpis.totalAvailableCredit).toBe(0);
      expect(kpis.totalOutstanding).toBe(0);
      expect(kpis.totalMonthlySpend).toBe(0);
      expect(kpis.cardCount).toBe(0);
    });
    
    it('should return zero values when cards is undefined', function() {
      var kpis = KPICalculatorFactory.calculateKPIs(undefined);
      
      expect(kpis.totalCreditLimit).toBe(0);
      expect(kpis.totalAvailableCredit).toBe(0);
      expect(kpis.totalOutstanding).toBe(0);
      expect(kpis.totalMonthlySpend).toBe(0);
      expect(kpis.cardCount).toBe(0);
    });
    
    it('should calculate KPIs correctly for a single card', function() {
      var cards = [
        {creditLimit: 8000, availableCredit: 6000, outstandingAmount: 2000, monthlySpend: 800}
      ];
      
      var kpis = KPICalculatorFactory.calculateKPIs(cards);
      
      expect(kpis.totalCreditLimit).toBe(8000);
      expect(kpis.totalAvailableCredit).toBe(6000);
      expect(kpis.totalOutstanding).toBe(2000);
      expect(kpis.totalMonthlySpend).toBe(800);
      expect(kpis.cardCount).toBe(1);
    });
    
    it('should handle cards with zero values', function() {
      var cards = [
        {creditLimit: 0, availableCredit: 0, outstandingAmount: 0, monthlySpend: 0},
        {creditLimit: 5000, availableCredit: 5000, outstandingAmount: 0, monthlySpend: 0}
      ];
      
      var kpis = KPICalculatorFactory.calculateKPIs(cards);
      
      expect(kpis.totalCreditLimit).toBe(5000);
      expect(kpis.totalAvailableCredit).toBe(5000);
      expect(kpis.totalOutstanding).toBe(0);
      expect(kpis.totalMonthlySpend).toBe(0);
      expect(kpis.cardCount).toBe(2);
    });
  });
});