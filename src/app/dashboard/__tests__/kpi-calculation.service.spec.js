/*
Test Documentation:
- Test Name: KpiCalculationService Unit Tests
- Purpose: Validate KPI calculations for monthly spend, credit limits, and balances
- Scenario: Tests computation accuracy with various data inputs and edge cases
- Expected Result: All KPIs calculated accurately to 2 decimal places
*/

(function() {
  'use strict';
  
  describe('KpiCalculationService', function() {
    var KpiCalculationService;
    
    beforeEach(module('dashboardModule'));
    
    beforeEach(inject(function(_KpiCalculationService_) {
      KpiCalculationService = _KpiCalculationService_;
    }));
    
    describe('computeKPIs()', function() {
      it('should calculate monthly spend correctly', function() {
        var cards = [{creditLimit: 50000, outstandingBalance: 10000}];
        var transactions = [{amount: 1500}, {amount: 2500}];
        
        var result = KpiCalculationService.computeKPIs(cards, transactions);
        expect(result.monthlySpend).toBe(4000.00);
      });
      
      it('should calculate total credit limit correctly', function() {
        var cards = [
          {creditLimit: 50000, outstandingBalance: 10000},
          {creditLimit: 30000, outstandingBalance: 5000}
        ];
        var transactions = [];
        
        var result = KpiCalculationService.computeKPIs(cards, transactions);
        expect(result.totalCreditLimit).toBe(80000.00);
      });
      
      it('should calculate available credit correctly', function() {
        var cards = [
          {creditLimit: 50000, outstandingBalance: 12500},
          {creditLimit: 30000, outstandingBalance: 8000}
        ];
        var transactions = [];
        
        var result = KpiCalculationService.computeKPIs(cards, transactions);
        expect(result.availableCredit).toBe(59500.00);
      });
      
      it('should calculate outstanding amount correctly', function() {
        var cards = [
          {creditLimit: 50000, outstandingBalance: 12500},
          {creditLimit: 30000, outstandingBalance: 8000}
        ];
        var transactions = [];
        
        var result = KpiCalculationService.computeKPIs(cards, transactions);
        expect(result.outstandingAmount).toBe(20500.00);
      });
      
      it('should round values to 2 decimal places', function() {
        var cards = [{creditLimit: 50000.555, outstandingBalance: 10000.444}];
        var transactions = [{amount: 1500.678}];
        
        var result = KpiCalculationService.computeKPIs(cards, transactions);
        expect(result.monthlySpend).toBe(1500.68);
        expect(result.totalCreditLimit).toBe(50000.56);
      });
      
      it('should handle empty arrays', function() {
        var result = KpiCalculationService.computeKPIs([], []);
        expect(result.monthlySpend).toBe(0.00);
        expect(result.totalCreditLimit).toBe(0.00);
        expect(result.availableCredit).toBe(0.00);
        expect(result.outstandingAmount).toBe(0.00);
      });
      
      it('should handle errors gracefully', function() {
        var result = KpiCalculationService.computeKPIs(null, null);
        expect(result).toEqual({
          monthlySpend: 0.00,
          totalCreditLimit: 0.00,
          availableCredit: 0.00,
          outstandingAmount: 0.00
        });
      });
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: computeKPIs
- Scenarios covered:
  * Monthly spend calculation
  * Total credit limit calculation
  * Available credit calculation
  * Outstanding amount calculation
  * Decimal precision (2 places)
  * Empty array handling
  * Error handling with null inputs
- Uncovered scenarios: Negative values, overflow scenarios
*/