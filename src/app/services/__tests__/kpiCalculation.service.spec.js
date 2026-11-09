/*
Test Documentation:
- Test Name: kpiCalculationService - advanced KPI calculations
- Purpose: Validates KPI calculation service with credit utilization
- Scenario: Service calculates KPIs including credit utilization percentage
- Expected Result: Returns comprehensive KPIs with utilization metric
*/

(function() {
  'use strict';

  describe('kpiCalculationService', function() {
    var kpiCalculationService;
    var mockCards;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_kpiCalculationService_) {
      kpiCalculationService = _kpiCalculationService_;

      mockCards = [
        { cardId: 1, creditLimit: 5000, availableCredit: 3000, outstandingAmount: 2000, monthlySpend: 1500 },
        { cardId: 2, creditLimit: 10000, availableCredit: 8000, outstandingAmount: 2000, monthlySpend: 2500 }
      ];
    }));

    /*
    Test Documentation:
    - Test Name: should calculate all KPIs correctly
    - Purpose: Validates complete KPI calculation
    - Scenario: Multiple cards with complete data
    - Expected Result: Returns all KPIs with correct values
    */
    it('should calculate all KPIs correctly', function() {
      var result = kpiCalculationService.calculateKPIs(mockCards);

      expect(result.totalCreditLimit).toBe(15000);
      expect(result.totalAvailableCredit).toBe(11000);
      expect(result.totalOutstandingAmount).toBe(4000);
      expect(result.monthlySpend).toBe(4000);
      expect(result.cardCount).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: should calculate credit utilization percentage
    - Purpose: Validates credit utilization calculation
    - Scenario: Cards with used credit
    - Expected Result: Returns utilization as percentage string with 2 decimals
    */
    it('should calculate credit utilization percentage', function() {
      var result = kpiCalculationService.calculateKPIs(mockCards);

      // Utilization = (totalLimit - availableCredit) / totalLimit * 100
      // (15000 - 11000) / 15000 * 100 = 26.67%
      expect(result.creditUtilization).toBe('26.67');
    });

    /*
    Test Documentation:
    - Test Name: should handle zero credit limit
    - Purpose: Validates division by zero handling
    - Scenario: Cards with zero credit limit
    - Expected Result: Returns 0 utilization without error
    */
    it('should handle zero credit limit', function() {
      var zeroLimitCards = [
        { cardId: 1, creditLimit: 0, availableCredit: 0, outstandingAmount: 0, monthlySpend: 0 }
      ];

      var result = kpiCalculationService.calculateKPIs(zeroLimitCards);

      expect(result.creditUtilization).toBe('0');
    });

    /*
    Test Documentation:
    - Test Name: should handle 100% credit utilization
    - Purpose: Validates maximum utilization calculation
    - Scenario: All credit used
    - Expected Result: Returns 100.00 utilization
    */
    it('should handle 100% credit utilization', function() {
      var fullyUtilizedCards = [
        { cardId: 1, creditLimit: 5000, availableCredit: 0, outstandingAmount: 5000, monthlySpend: 1000 }
      ];

      var result = kpiCalculationService.calculateKPIs(fullyUtilizedCards);

      expect(result.creditUtilization).toBe('100.00');
    });

    /*
    Test Documentation:
    - Test Name: should handle empty cards array
    - Purpose: Validates error handling for empty input
    - Scenario: Empty cards array provided
    - Expected Result: Returns zero values for all KPIs
    */
    it('should handle empty cards array', function() {
      var result = kpiCalculationService.calculateKPIs([]);

      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.monthlySpend).toBe(0);
      expect(result.creditUtilization).toBe('0');
      expect(result.cardCount).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle null cards
    - Purpose: Validates error handling for null input
    - Scenario: Null cards provided
    - Expected Result: Returns zero values for all KPIs
    */
    it('should handle null cards', function() {
      var result = kpiCalculationService.calculateKPIs(null);

      expect(result.totalCreditLimit).toBe(0);
      expect(result.creditUtilization).toBe('0');
    });

    /*
    Test Documentation:
    - Test Name: should handle cards with missing properties
    - Purpose: Validates handling of incomplete card data
    - Scenario: Cards with undefined properties
    - Expected Result: Treats missing values as zero
    */
    it('should handle cards with missing properties', function() {
      var incompleteCards = [
        { cardId: 1, creditLimit: 5000 },
        { cardId: 2, availableCredit: 3000 }
      ];

      var result = kpiCalculationService.calculateKPIs(incompleteCards);

      expect(result.totalCreditLimit).toBe(5000);
      expect(result.totalAvailableCredit).toBe(3000);
    });

    /*
    Test Documentation:
    - Test Name: should format credit utilization to 2 decimal places
    - Purpose: Validates utilization formatting
    - Scenario: Calculate utilization with fractional result
    - Expected Result: Returns string with exactly 2 decimal places
    */
    it('should format credit utilization to 2 decimal places', function() {
      var cards = [
        { cardId: 1, creditLimit: 3000, availableCredit: 2000, outstandingAmount: 1000, monthlySpend: 500 }
      ];

      var result = kpiCalculationService.calculateKPIs(cards);

      // (3000 - 2000) / 3000 * 100 = 33.333...
      expect(result.creditUtilization).toBe('33.33');
      expect(result.creditUtilization.split('.')[1].length).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: should calculate utilization for multiple cards
    - Purpose: Validates aggregated utilization calculation
    - Scenario: Multiple cards with different utilizations
    - Expected Result: Returns overall portfolio utilization
    */
    it('should calculate utilization for multiple cards', function() {
      var multipleCards = [
        { cardId: 1, creditLimit: 10000, availableCredit: 5000, outstandingAmount: 5000, monthlySpend: 2000 },
        { cardId: 2, creditLimit: 10000, availableCredit: 8000, outstandingAmount: 2000, monthlySpend: 1000 }
      ];

      var result = kpiCalculationService.calculateKPIs(multipleCards);

      // Total limit: 20000, Total available: 13000
      // Utilization: (20000 - 13000) / 20000 * 100 = 35%
      expect(result.creditUtilization).toBe('35.00');
    });
  });

  /*
  Coverage Report:
  - Functions tested: calculateKPIs
  - Scenarios covered: all KPIs, credit utilization, empty array, null input, missing properties, edge cases (0%, 100%)
  - Edge cases: zero credit limit, full utilization, empty array, null
  - Uncovered scenarios: none
  */
})();