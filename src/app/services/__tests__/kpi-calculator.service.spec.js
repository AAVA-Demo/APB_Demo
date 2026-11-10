/*
Test Documentation:
- Test Name: KpiCalculatorService - calculateKpis with valid data
- Purpose: Validates that calculateKpis correctly aggregates card data and transaction data
- Scenario: Service is called with array of cards and transaction data
- Expected Result: Returns KPI object with correct totals and utilization percentage
*/
/*
Test Documentation:
- Test Name: KpiCalculatorService - calculateKpis with empty cards
- Purpose: Validates that service handles empty card array gracefully
- Scenario: Service is called with empty array
- Expected Result: Returns KPI object with zero values and no division errors
*/
/*
Test Documentation:
- Test Name: KpiCalculatorService - calculateKpis utilization calculation
- Purpose: Validates that utilization percentage is calculated correctly
- Scenario: Service is called with cards having various credit limits and outstanding amounts
- Expected Result: Utilization percentage matches (totalOutstanding / totalCreditLimit) * 100
*/
/*
Coverage Report:
- Functions tested: calculateKpis
- Scenarios covered: valid data aggregation, empty data handling, utilization calculation, zero credit limit handling
- Uncovered scenarios: negative values, null values
*/

describe('KpiCalculatorService', function() {
  'use strict';
  
  beforeEach(module('app.dashboard'));
  
  var KpiCalculatorService;
  
  beforeEach(inject(function(_KpiCalculatorService_) {
    KpiCalculatorService = _KpiCalculatorService_;
  }));
  
  describe('calculateKpis', function() {
    it('should calculate KPIs correctly with valid data', function() {
      var cards = [
        {cardId: 'c1', creditLimit: 50000, outstandingAmount: 12000, availableCredit: 38000},
        {cardId: 'c2', creditLimit: 30000, outstandingAmount: 8000, availableCredit: 22000}
      ];
      var transactionData = {monthlySpend: 25000};
      
      var result = KpiCalculatorService.calculateKpis(cards, transactionData);
      
      expect(result).toBeDefined();
      expect(result.totalCreditLimit).toBe(80000);
      expect(result.totalOutstanding).toBe(20000);
      expect(result.totalAvailableCredit).toBe(60000);
      expect(result.monthlySpend).toBe(25000);
      expect(result.utilizationPercentage).toBe(25);
      expect(result.cardCount).toBe(2);
    });
    
    it('should handle empty card array gracefully', function() {
      var cards = [];
      var transactionData = {monthlySpend: 0};
      
      var result = KpiCalculatorService.calculateKpis(cards, transactionData);
      
      expect(result).toBeDefined();
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.utilizationPercentage).toBe(0);
      expect(result.cardCount).toBe(0);
    });
    
    it('should calculate utilization percentage correctly', function() {
      var cards = [
        {cardId: 'c1', creditLimit: 10000, outstandingAmount: 5000, availableCredit: 5000}
      ];
      var transactionData = {monthlySpend: 5000};
      
      var result = KpiCalculatorService.calculateKpis(cards, transactionData);
      
      expect(result.utilizationPercentage).toBe(50);
    });
    
    it('should handle zero credit limit without division error', function() {
      var cards = [
        {cardId: 'c1', creditLimit: 0, outstandingAmount: 0, availableCredit: 0}
      ];
      var transactionData = {monthlySpend: 0};
      
      var result = KpiCalculatorService.calculateKpis(cards, transactionData);
      
      expect(result.utilizationPercentage).toBe(0);
    });
    
    it('should default monthlySpend to 0 if not provided', function() {
      var cards = [{cardId: 'c1', creditLimit: 10000, outstandingAmount: 2000, availableCredit: 8000}];
      var transactionData = {};
      
      var result = KpiCalculatorService.calculateKpis(cards, transactionData);
      
      expect(result.monthlySpend).toBe(0);
    });
  });
});