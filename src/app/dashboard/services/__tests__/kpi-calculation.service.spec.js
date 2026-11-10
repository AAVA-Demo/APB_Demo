/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKpis with valid data
- Purpose: Validates KPI calculation with card data
- Scenario: Valid card array is provided
- Expected Result: Returns calculated KPIs
*/
/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKpis with empty array
- Purpose: Validates handling of empty card array
- Scenario: Empty array is provided
- Expected Result: Returns zero values for all KPIs
*/
/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKpis with null
- Purpose: Validates handling of null input
- Scenario: Null is provided
- Expected Result: Returns zero values for all KPIs
*/
/*
Coverage Report:
- Functions tested: calculateKpis
- Scenarios covered: valid data, empty array, null input, missing properties
- Uncovered scenarios: none
*/

describe('KpiCalculationService', function() {
  'use strict';
  
  beforeEach(module('dashboardModule'));
  
  var KpiCalculationService;
  
  beforeEach(inject(function(_KpiCalculationService_) {
    KpiCalculationService = _KpiCalculationService_;
  }));
  
  describe('calculateKpis', function() {
    it('should calculate KPIs correctly with valid card data', function() {
      var cards = [
        { cardId: '1', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000 },
        { cardId: '2', creditLimit: 30000, availableCredit: 25000, outstandingAmount: 5000 }
      ];
      
      var kpis = KpiCalculationService.calculateKpis(cards);
      
      expect(kpis.totalCreditLimit).toBe(80000);
      expect(kpis.totalAvailableCredit).toBe(60000);
      expect(kpis.totalOutstanding).toBe(20000);
      expect(kpis.monthlySpend).toBe(20000);
    });
    
    it('should return zero KPIs for empty card array', function() {
      var kpis = KpiCalculationService.calculateKpis([]);
      
      expect(kpis.monthlySpend).toBe(0);
      expect(kpis.totalCreditLimit).toBe(0);
      expect(kpis.totalAvailableCredit).toBe(0);
      expect(kpis.totalOutstanding).toBe(0);
    });
    
    it('should return zero KPIs for null input', function() {
      var kpis = KpiCalculationService.calculateKpis(null);
      
      expect(kpis.monthlySpend).toBe(0);
      expect(kpis.totalCreditLimit).toBe(0);
      expect(kpis.totalAvailableCredit).toBe(0);
      expect(kpis.totalOutstanding).toBe(0);
    });
    
    it('should handle cards with missing properties', function() {
      var cards = [
        { cardId: '1', creditLimit: 50000 },
        { cardId: '2', availableCredit: 25000 }
      ];
      
      var kpis = KpiCalculationService.calculateKpis(cards);
      
      expect(kpis.totalCreditLimit).toBe(50000);
      expect(kpis.totalAvailableCredit).toBe(25000);
      expect(kpis.totalOutstanding).toBe(0);
    });
    
    it('should calculate monthly spend as total outstanding', function() {
      var cards = [
        { cardId: '1', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000 }
      ];
      
      var kpis = KpiCalculationService.calculateKpis(cards);
      
      expect(kpis.monthlySpend).toBe(kpis.totalOutstanding);
    });
  });
});