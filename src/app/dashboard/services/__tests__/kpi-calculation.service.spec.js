/*
Test Documentation:
- Test Name: kpiCalculationService - calculateKPIs with valid data
- Purpose: Validates that calculateKPIs correctly aggregates card data into KPIs
- Scenario: When calculateKPIs is called with valid card data, it should return aggregated metrics
- Expected Result: Returns object with totalCreditLimit, totalOutstanding, totalAvailableCredit, totalMonthlySpend, cardCount
*/
/*
Test Documentation:
- Test Name: kpiCalculationService - calculateKPIs with empty data
- Purpose: Validates that calculateKPIs handles empty or null input gracefully
- Scenario: When calculateKPIs is called with empty array or null, it should return zero values
- Expected Result: Returns object with all values set to 0
*/
/*
Test Documentation:
- Test Name: kpiCalculationService - calculateKPIs accuracy
- Purpose: Validates the mathematical accuracy of KPI calculations
- Scenario: When calculateKPIs is called with known data, verify calculations are correct
- Expected Result: Sum of all card limits, balances, and spends match expected totals
*/
/*
Coverage Report:
- Functions tested: calculateKPIs
- Scenarios covered: valid data aggregation, empty data handling, null input, calculation accuracy, edge cases
- Edge cases: empty array, null input, undefined values in card data, single card, multiple cards
- Uncovered scenarios: none
*/

describe('kpiCalculationService', function() {
  'use strict';
  
  beforeEach(module('dashboardModule'));
  
  var kpiCalculationService;
  
  beforeEach(inject(function(_kpiCalculationService_) {
    kpiCalculationService = _kpiCalculationService_;
  }));
  
  describe('calculateKPIs', function() {
    it('should be defined', function() {
      expect(kpiCalculationService.calculateKPIs).toBeDefined();
      expect(typeof kpiCalculationService.calculateKPIs).toBe('function');
    });
    
    it('should return KPI object with required properties', function() {
      var cardData = [
        {totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000, monthlySpend: 8500}
      ];
      var kpis = kpiCalculationService.calculateKPIs(cardData);
      expect(kpis.totalCreditLimit).toBeDefined();
      expect(kpis.totalOutstanding).toBeDefined();
      expect(kpis.totalAvailableCredit).toBeDefined();
      expect(kpis.totalMonthlySpend).toBeDefined();
      expect(kpis.cardCount).toBeDefined();
    });
    
    it('should calculate correct totals for single card', function() {
      var cardData = [
        {totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000, monthlySpend: 8500}
      ];
      var kpis = kpiCalculationService.calculateKPIs(cardData);
      expect(kpis.totalCreditLimit).toBe(50000);
      expect(kpis.totalOutstanding).toBe(15000);
      expect(kpis.totalAvailableCredit).toBe(35000);
      expect(kpis.totalMonthlySpend).toBe(8500);
      expect(kpis.cardCount).toBe(1);
    });
    
    it('should calculate correct totals for multiple cards', function() {
      var cardData = [
        {totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000, monthlySpend: 8500},
        {totalLimit: 30000, outstandingBalance: 8000, availableCredit: 22000, monthlySpend: 4200},
        {totalLimit: 70000, outstandingBalance: 10000, availableCredit: 60000, monthlySpend: 5300}
      ];
      var kpis = kpiCalculationService.calculateKPIs(cardData);
      expect(kpis.totalCreditLimit).toBe(150000);
      expect(kpis.totalOutstanding).toBe(33000);
      expect(kpis.totalAvailableCredit).toBe(117000);
      expect(kpis.totalMonthlySpend).toBe(18000);
      expect(kpis.cardCount).toBe(3);
    });
    
    it('should return zero values for empty array', function() {
      var kpis = kpiCalculationService.calculateKPIs([]);
      expect(kpis.totalCreditLimit).toBe(0);
      expect(kpis.totalOutstanding).toBe(0);
      expect(kpis.totalAvailableCredit).toBe(0);
      expect(kpis.totalMonthlySpend).toBe(0);
      expect(kpis.cardCount).toBe(0);
    });
    
    it('should return zero values for null input', function() {
      var kpis = kpiCalculationService.calculateKPIs(null);
      expect(kpis.totalCreditLimit).toBe(0);
      expect(kpis.totalOutstanding).toBe(0);
      expect(kpis.totalAvailableCredit).toBe(0);
      expect(kpis.totalMonthlySpend).toBe(0);
      expect(kpis.cardCount).toBe(0);
    });
    
    it('should return zero values for undefined input', function() {
      var kpis = kpiCalculationService.calculateKPIs(undefined);
      expect(kpis.totalCreditLimit).toBe(0);
      expect(kpis.totalOutstanding).toBe(0);
      expect(kpis.totalAvailableCredit).toBe(0);
      expect(kpis.totalMonthlySpend).toBe(0);
      expect(kpis.cardCount).toBe(0);
    });
    
    it('should handle cards with missing or undefined properties', function() {
      var cardData = [
        {totalLimit: 50000, outstandingBalance: undefined, availableCredit: 35000, monthlySpend: 8500},
        {totalLimit: null, outstandingBalance: 8000, availableCredit: 22000, monthlySpend: 4200}
      ];
      var kpis = kpiCalculationService.calculateKPIs(cardData);
      expect(kpis.totalCreditLimit).toBe(50000);
      expect(kpis.totalOutstanding).toBe(8000);
      expect(kpis.totalAvailableCredit).toBe(57000);
      expect(kpis.totalMonthlySpend).toBe(12700);
      expect(kpis.cardCount).toBe(2);
    });
    
    it('should handle cards with zero values', function() {
      var cardData = [
        {totalLimit: 0, outstandingBalance: 0, availableCredit: 0, monthlySpend: 0}
      ];
      var kpis = kpiCalculationService.calculateKPIs(cardData);
      expect(kpis.totalCreditLimit).toBe(0);
      expect(kpis.totalOutstanding).toBe(0);
      expect(kpis.totalAvailableCredit).toBe(0);
      expect(kpis.totalMonthlySpend).toBe(0);
      expect(kpis.cardCount).toBe(1);
    });
    
    it('should correctly count cards', function() {
      var cardData = [
        {totalLimit: 10000, outstandingBalance: 5000, availableCredit: 5000, monthlySpend: 1000},
        {totalLimit: 20000, outstandingBalance: 10000, availableCredit: 10000, monthlySpend: 2000},
        {totalLimit: 30000, outstandingBalance: 15000, availableCredit: 15000, monthlySpend: 3000},
        {totalLimit: 40000, outstandingBalance: 20000, availableCredit: 20000, monthlySpend: 4000}
      ];
      var kpis = kpiCalculationService.calculateKPIs(cardData);
      expect(kpis.cardCount).toBe(4);
    });
    
    it('should handle large numbers correctly', function() {
      var cardData = [
        {totalLimit: 1000000, outstandingBalance: 500000, availableCredit: 500000, monthlySpend: 100000},
        {totalLimit: 2000000, outstandingBalance: 1000000, availableCredit: 1000000, monthlySpend: 200000}
      ];
      var kpis = kpiCalculationService.calculateKPIs(cardData);
      expect(kpis.totalCreditLimit).toBe(3000000);
      expect(kpis.totalOutstanding).toBe(1500000);
      expect(kpis.totalAvailableCredit).toBe(1500000);
      expect(kpis.totalMonthlySpend).toBe(300000);
    });
  });
});