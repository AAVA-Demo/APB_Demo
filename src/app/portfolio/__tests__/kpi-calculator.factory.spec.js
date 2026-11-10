/*
Test Documentation:
- Test Name: KpiCalculator - calculateKpis with valid cards
- Purpose: Validates KPI calculation with multiple cards
- Scenario: Factory receives array of cards with financial data
- Expected Result: Returns correct aggregated KPIs
*/
/*
Test Documentation:
- Test Name: KpiCalculator - calculateKpis with empty array
- Purpose: Validates handling of empty cards array
- Scenario: Factory receives empty array
- Expected Result: Returns zero values for all KPIs
*/
/*
Test Documentation:
- Test Name: KpiCalculator - calculateKpis with null input
- Purpose: Validates handling of null input
- Scenario: Factory receives null
- Expected Result: Returns zero values for all KPIs
*/
/*
Test Documentation:
- Test Name: KpiCalculator - credit utilization calculation
- Purpose: Validates credit utilization percentage calculation
- Scenario: Cards with various credit limits and available credit
- Expected Result: Correct utilization percentage
*/
/*
Test Documentation:
- Test Name: KpiCalculator - active card count
- Purpose: Validates counting of active cards
- Scenario: Mix of active and blocked cards
- Expected Result: Returns count of only active cards
*/
/*
Coverage Report:
- Functions tested: calculateKpis()
- Scenarios covered: valid data, empty data, null data, edge cases, active card filtering
- Uncovered scenarios: invalid data types, negative values
*/

(function() {
  'use strict';

  describe('KpiCalculator', function() {
    var KpiCalculator;

    beforeEach(module('app.portfolio'));

    beforeEach(inject(function(_KpiCalculator_) {
      KpiCalculator = _KpiCalculator_;
    }));

    describe('calculateKpis()', function() {
      it('should calculate KPIs correctly with valid cards', function() {
        var cards = [
          {
            creditLimit: 5000,
            availableCredit: 3000,
            outstandingAmount: 2000,
            currentBalance: 1500,
            status: 'active'
          },
          {
            creditLimit: 3000,
            availableCredit: 2000,
            outstandingAmount: 1000,
            currentBalance: 800,
            status: 'active'
          }
        ];

        var result = KpiCalculator.calculateKpis(cards);

        expect(result.totalCreditLimit).toBe(8000);
        expect(result.totalAvailableCredit).toBe(5000);
        expect(result.totalOutstanding).toBe(3000);
        expect(result.monthlySpend).toBe(2300);
        expect(result.activeCardCount).toBe(2);
        expect(result.creditUtilization).toBe(37.50);
      });

      it('should return zero KPIs for empty cards array', function() {
        var result = KpiCalculator.calculateKpis([]);

        expect(result.totalCreditLimit).toBe(0);
        expect(result.totalAvailableCredit).toBe(0);
        expect(result.totalOutstanding).toBe(0);
        expect(result.monthlySpend).toBe(0);
        expect(result.creditUtilization).toBe(0);
        expect(result.activeCardCount).toBe(0);
      });

      it('should return zero KPIs for null input', function() {
        var result = KpiCalculator.calculateKpis(null);

        expect(result.totalCreditLimit).toBe(0);
        expect(result.totalAvailableCredit).toBe(0);
        expect(result.totalOutstanding).toBe(0);
        expect(result.monthlySpend).toBe(0);
        expect(result.creditUtilization).toBe(0);
        expect(result.activeCardCount).toBe(0);
      });

      it('should calculate credit utilization correctly', function() {
        var cards = [
          {
            creditLimit: 10000,
            availableCredit: 6000,
            outstandingAmount: 4000,
            currentBalance: 4000,
            status: 'active'
          }
        ];

        var result = KpiCalculator.calculateKpis(cards);
        expect(result.creditUtilization).toBe(40.00);
      });

      it('should count only active cards', function() {
        var cards = [
          { creditLimit: 5000, availableCredit: 3000, outstandingAmount: 2000, currentBalance: 2000, status: 'active' },
          { creditLimit: 3000, availableCredit: 2000, outstandingAmount: 1000, currentBalance: 1000, status: 'blocked' },
          { creditLimit: 4000, availableCredit: 2500, outstandingAmount: 1500, currentBalance: 1500, status: 'active' }
        ];

        var result = KpiCalculator.calculateKpis(cards);
        expect(result.activeCardCount).toBe(2);
      });

      it('should handle cards with missing fields gracefully', function() {
        var cards = [
          { creditLimit: 5000, status: 'active' },
          { availableCredit: 2000, status: 'active' }
        ];

        var result = KpiCalculator.calculateKpis(cards);
        expect(result.totalCreditLimit).toBe(5000);
        expect(result.totalAvailableCredit).toBe(2000);
        expect(result.totalOutstanding).toBe(0);
        expect(result.monthlySpend).toBe(0);
      });

      it('should return 0 credit utilization when total credit limit is 0', function() {
        var cards = [
          { creditLimit: 0, availableCredit: 0, outstandingAmount: 0, currentBalance: 0, status: 'active' }
        ];

        var result = KpiCalculator.calculateKpis(cards);
        expect(result.creditUtilization).toBe(0);
      });
    });
  });
})();