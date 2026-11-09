/*
Test Documentation:
- Test Name: kpiService - calculateKPIs
- Purpose: Validates KPI aggregation from card data
- Scenario: Tests multiple cards, empty input, missing fields, single card
- Expected Result: Returns correct aggregated KPIs with proper defaults
*/
/*
Coverage Report:
- Functions tested: calculateKPIs
- Scenarios covered: multiple cards, empty array, null input, missing fields, single card
- Uncovered scenarios: none
*/

describe('kpiService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var kpiService;

  beforeEach(inject(function(_kpiService_) {
    kpiService = _kpiService_;
  }));

  describe('calculateKPIs', function() {
    it('should calculate KPIs from multiple cards', function() {
      var cards = [
        { creditLimit: 5000, availableCredit: 3000, outstandingAmount: 2000, monthlySpend: 1500 },
        { creditLimit: 3000, availableCredit: 2000, outstandingAmount: 1000, monthlySpend: 800 }
      ];

      var result = kpiService.calculateKPIs(cards);

      expect(result.totalCreditLimit).toBe(8000);
      expect(result.totalAvailableCredit).toBe(5000);
      expect(result.totalOutstandingAmount).toBe(3000);
      expect(result.monthlySpend).toBe(2300);
      expect(result.cardCount).toBe(2);
    });

    it('should return defaults for empty array', function() {
      var result = kpiService.calculateKPIs([]);

      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.monthlySpend).toBe(0);
      expect(result.cardCount).toBe(0);
    });

    it('should return defaults for null input', function() {
      var result = kpiService.calculateKPIs(null);

      expect(result.totalCreditLimit).toBe(0);
      expect(result.cardCount).toBe(0);
    });

    it('should handle missing fields', function() {
      var cards = [
        { creditLimit: 5000 },
        { availableCredit: 2000 }
      ];

      var result = kpiService.calculateKPIs(cards);

      expect(result.totalCreditLimit).toBe(5000);
      expect(result.totalAvailableCredit).toBe(2000);
    });
  });
});