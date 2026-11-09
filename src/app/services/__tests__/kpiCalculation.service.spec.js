/*
Test Documentation:
- Test Name: kpiCalculationService - calculateKPIs with credit utilization
- Purpose: Validates KPI calculation including credit utilization percentage
- Scenario: Tests calculation with multiple cards, empty array, utilization calculation
- Expected Result: Returns correct KPIs including credit utilization percentage
*/
/*
Coverage Report:
- Functions tested: calculateKPIs
- Scenarios covered: multiple cards, empty array, utilization calculation, missing fields
- Uncovered scenarios: none
*/

describe('kpiCalculationService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var kpiCalculationService;

  beforeEach(inject(function(_kpiCalculationService_) {
    kpiCalculationService = _kpiCalculationService_;
  }));

  describe('calculateKPIs', function() {
    it('should calculate KPIs with credit utilization', function() {
      var cards = [
        { creditLimit: 10000, availableCredit: 6000, outstandingAmount: 4000, monthlySpend: 2000 },
        { creditLimit: 5000, availableCredit: 3000, outstandingAmount: 2000, monthlySpend: 1000 }
      ];

      var result = kpiCalculationService.calculateKPIs(cards);

      expect(result.totalCreditLimit).toBe(15000);
      expect(result.totalAvailableCredit).toBe(9000);
      expect(result.totalOutstandingAmount).toBe(6000);
      expect(result.monthlySpend).toBe(3000);
      expect(result.creditUtilization).toBe('40.00');
      expect(result.cardCount).toBe(2);
    });

    it('should return zero values for empty cards array', function() {
      var result = kpiCalculationService.calculateKPIs([]);

      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.monthlySpend).toBe(0);
      expect(result.creditUtilization).toBe(0);
      expect(result.cardCount).toBe(0);
    });

    it('should return zero values for null cards', function() {
      var result = kpiCalculationService.calculateKPIs(null);

      expect(result.totalCreditLimit).toBe(0);
      expect(result.creditUtilization).toBe(0);
    });

    it('should calculate 100% utilization correctly', function() {
      var cards = [
        { creditLimit: 5000, availableCredit: 0, outstandingAmount: 5000, monthlySpend: 1000 }
      ];

      var result = kpiCalculationService.calculateKPIs(cards);

      expect(result.creditUtilization).toBe('100.00');
    });

    it('should calculate 0% utilization correctly', function() {
      var cards = [
        { creditLimit: 5000, availableCredit: 5000, outstandingAmount: 0, monthlySpend: 0 }
      ];

      var result = kpiCalculationService.calculateKPIs(cards);

      expect(result.creditUtilization).toBe('0.00');
    });

    it('should handle cards with missing fields', function() {
      var cards = [
        { creditLimit: 5000 },
        { availableCredit: 2000 }
      ];

      var result = kpiCalculationService.calculateKPIs(cards);

      expect(result.totalCreditLimit).toBe(5000);
      expect(result.totalAvailableCredit).toBe(2000);
    });
  });
});