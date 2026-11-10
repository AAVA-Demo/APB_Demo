/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKPIs with multiple cards
- Purpose: Validates KPI calculation from multiple cards
- Scenario: Array of cards with various metrics
- Expected Result: Returns aggregated KPIs with correct calculations
*/
/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKPIs with single card
- Purpose: Validates KPI calculation for single card
- Scenario: Single card in array
- Expected Result: Returns KPIs matching single card values
*/
/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKPIs with empty array
- Purpose: Validates handling of empty card array
- Scenario: Empty array passed to calculateKPIs
- Expected Result: Returns KPIs with zero values
*/
/*
Test Documentation:
- Test Name: KpiCalculationService - credit utilization calculation
- Purpose: Validates credit utilization percentage calculation
- Scenario: Cards with various credit limits and balances
- Expected Result: Correct percentage calculation
*/
/*
Coverage Report:
- Functions tested: calculateKPIs
- Scenarios covered: multiple cards, single card, empty array, credit utilization, zero credit limit edge case
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('KpiCalculationService', function() {
    var KpiCalculationService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KpiCalculationService_) {
      KpiCalculationService = _KpiCalculationService_;
    }));

    describe('calculateKPIs', function() {
      it('should calculate KPIs correctly for multiple cards', function() {
        var cards = [
          { userId: 'user123', monthlySpend: 10000, creditLimit: 50000, availableCredit: 35000, outstandingBalance: 15000 },
          { userId: 'user123', monthlySpend: 8000, creditLimit: 30000, availableCredit: 20000, outstandingBalance: 10000 },
          { userId: 'user123', monthlySpend: 12000, creditLimit: 70000, availableCredit: 50000, outstandingBalance: 20000 }
        ];

        var result = KpiCalculationService.calculateKPIs(cards);

        expect(result.userId).toBe('user123');
        expect(result.monthlySpend).toBe(30000);
        expect(result.totalCreditLimit).toBe(150000);
        expect(result.availableCredit).toBe(105000);
        expect(result.outstandingAmount).toBe(45000);
        expect(result.creditUtilization).toBe('30.00');
        expect(result.lastUpdated).toBeDefined();
      });

      it('should calculate KPIs correctly for single card', function() {
        var cards = [
          { userId: 'user456', monthlySpend: 5000, creditLimit: 25000, availableCredit: 15000, outstandingBalance: 10000 }
        ];

        var result = KpiCalculationService.calculateKPIs(cards);

        expect(result.userId).toBe('user456');
        expect(result.monthlySpend).toBe(5000);
        expect(result.totalCreditLimit).toBe(25000);
        expect(result.availableCredit).toBe(15000);
        expect(result.outstandingAmount).toBe(10000);
        expect(result.creditUtilization).toBe('40.00');
      });

      it('should handle empty cards array', function() {
        var cards = [];

        var result = KpiCalculationService.calculateKPIs(cards);

        expect(result.userId).toBe('');
        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
        expect(result.creditUtilization).toBe(0);
      });

      it('should calculate credit utilization as 0 when total credit limit is 0', function() {
        var cards = [
          { userId: 'user789', monthlySpend: 0, creditLimit: 0, availableCredit: 0, outstandingBalance: 0 }
        ];

        var result = KpiCalculationService.calculateKPIs(cards);

        expect(result.creditUtilization).toBe(0);
      });

      it('should calculate credit utilization correctly at 100%', function() {
        var cards = [
          { userId: 'user999', monthlySpend: 10000, creditLimit: 50000, availableCredit: 0, outstandingBalance: 50000 }
        ];

        var result = KpiCalculationService.calculateKPIs(cards);

        expect(result.creditUtilization).toBe('100.00');
      });

      it('should format credit utilization to 2 decimal places', function() {
        var cards = [
          { userId: 'user111', monthlySpend: 5000, creditLimit: 30000, availableCredit: 20000, outstandingBalance: 10000 }
        ];

        var result = KpiCalculationService.calculateKPIs(cards);

        expect(result.creditUtilization).toBe('33.33');
        expect(typeof result.creditUtilization).toBe('string');
      });

      it('should include lastUpdated timestamp', function() {
        var cards = [
          { userId: 'user222', monthlySpend: 1000, creditLimit: 10000, availableCredit: 8000, outstandingBalance: 2000 }
        ];

        var result = KpiCalculationService.calculateKPIs(cards);

        expect(result.lastUpdated).toBeDefined();
        expect(new Date(result.lastUpdated)).toEqual(jasmine.any(Date));
      });

      it('should sum all card metrics correctly', function() {
        var cards = [
          { userId: 'user333', monthlySpend: 1000, creditLimit: 10000, availableCredit: 7000, outstandingBalance: 3000 },
          { userId: 'user333', monthlySpend: 2000, creditLimit: 20000, availableCredit: 15000, outstandingBalance: 5000 },
          { userId: 'user333', monthlySpend: 3000, creditLimit: 30000, availableCredit: 22000, outstandingBalance: 8000 }
        ];

        var result = KpiCalculationService.calculateKPIs(cards);

        expect(result.monthlySpend).toBe(6000);
        expect(result.totalCreditLimit).toBe(60000);
        expect(result.availableCredit).toBe(44000);
        expect(result.outstandingAmount).toBe(16000);
      });
    });
  });
})();