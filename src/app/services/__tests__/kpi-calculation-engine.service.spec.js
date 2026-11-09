/*
Test Documentation:
- Test Name: KPICalculationEngine Test Suite
- Purpose: Validate KPI calculation logic for credit card metrics
- Scenario: Tests calculation of monthly spend, credit limits, available credit, and outstanding amounts
- Expected Result: Accurate KPI calculations for various input scenarios including edge cases
*/

(function() {
  'use strict';

  describe('KPICalculationEngine', function() {
    var KPICalculationEngine;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KPICalculationEngine_) {
      KPICalculationEngine = _KPICalculationEngine_;
    }));

    describe('calculate', function() {
      it('should calculate all KPIs correctly with valid data', function() {
        var cards = [
          {creditLimit: 10000, availableCredit: 7500, outstandingBalance: 2500},
          {creditLimit: 15000, availableCredit: 12000, outstandingBalance: 3000}
        ];
        var transactions = [
          {amount: 100},
          {amount: 200},
          {amount: 50}
        ];

        var result = KPICalculationEngine.calculate(cards, transactions);

        expect(result.totalCreditLimit).toBe(25000);
        expect(result.availableCredit).toBe(19500);
        expect(result.outstandingAmount).toBe(5500);
        expect(result.monthlySpend).toBe(350);
      });

      it('should handle empty cards array', function() {
        var transactions = [{amount: 100}];
        var result = KPICalculationEngine.calculate([], transactions);

        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
        expect(result.monthlySpend).toBe(100);
      });

      it('should handle empty transactions array', function() {
        var cards = [{creditLimit: 10000, availableCredit: 7500, outstandingBalance: 2500}];
        var result = KPICalculationEngine.calculate(cards, []);

        expect(result.totalCreditLimit).toBe(10000);
        expect(result.availableCredit).toBe(7500);
        expect(result.outstandingAmount).toBe(2500);
        expect(result.monthlySpend).toBe(0);
      });

      it('should handle null cards parameter', function() {
        var transactions = [{amount: 100}];
        var result = KPICalculationEngine.calculate(null, transactions);

        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
        expect(result.monthlySpend).toBe(100);
      });

      it('should handle null transactions parameter', function() {
        var cards = [{creditLimit: 10000, availableCredit: 7500, outstandingBalance: 2500}];
        var result = KPICalculationEngine.calculate(cards, null);

        expect(result.totalCreditLimit).toBe(10000);
        expect(result.availableCredit).toBe(7500);
        expect(result.outstandingAmount).toBe(2500);
        expect(result.monthlySpend).toBe(0);
      });

      it('should handle cards with missing fields', function() {
        var cards = [
          {creditLimit: 10000},
          {availableCredit: 5000},
          {outstandingBalance: 1000}
        ];
        var result = KPICalculationEngine.calculate(cards, []);

        expect(result.totalCreditLimit).toBe(10000);
        expect(result.availableCredit).toBe(5000);
        expect(result.outstandingAmount).toBe(1000);
      });

      it('should handle transactions with missing amount', function() {
        var transactions = [
          {amount: 100},
          {},
          {amount: 50}
        ];
        var result = KPICalculationEngine.calculate([], transactions);

        expect(result.monthlySpend).toBe(150);
      });

      it('should handle zero values correctly', function() {
        var cards = [{creditLimit: 0, availableCredit: 0, outstandingBalance: 0}];
        var transactions = [{amount: 0}];
        var result = KPICalculationEngine.calculate(cards, transactions);

        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
        expect(result.monthlySpend).toBe(0);
      });

      it('should handle large numbers correctly', function() {
        var cards = [{creditLimit: 1000000, availableCredit: 900000, outstandingBalance: 100000}];
        var transactions = [{amount: 50000}];
        var result = KPICalculationEngine.calculate(cards, transactions);

        expect(result.totalCreditLimit).toBe(1000000);
        expect(result.availableCredit).toBe(900000);
        expect(result.outstandingAmount).toBe(100000);
        expect(result.monthlySpend).toBe(50000);
      });

      it('should handle decimal amounts correctly', function() {
        var transactions = [
          {amount: 100.50},
          {amount: 200.75},
          {amount: 50.25}
        ];
        var result = KPICalculationEngine.calculate([], transactions);

        expect(result.monthlySpend).toBe(351.5);
      });

      it('should return all KPI fields', function() {
        var result = KPICalculationEngine.calculate([], []);

        expect(result).toEqual(jasmine.objectContaining({
          monthlySpend: jasmine.any(Number),
          totalCreditLimit: jasmine.any(Number),
          availableCredit: jasmine.any(Number),
          outstandingAmount: jasmine.any(Number)
        }));
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: calculate
  - Scenarios covered:
    * Valid data calculation
    * Empty cards array
    * Empty transactions array
    * Null cards parameter
    * Null transactions parameter
    * Cards with missing fields
    * Transactions with missing amount
    * Zero values
    * Large numbers
    * Decimal amounts
    * Complete KPI structure
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();