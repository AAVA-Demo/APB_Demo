/*
Test Documentation:
- Test Name: kpiCalculationService KPI Calculation Logic
- Purpose: Validate KPI aggregation calculations for credit card data
- Scenario: Calculate total limits, available credit, outstanding amounts, monthly spend, utilization rate
- Expected Result: Accurate calculations for all KPIs, proper handling of edge cases
*/

describe('kpiCalculationService', function() {
  beforeEach(module('creditCardApp'));

  var kpiCalculationService;

  beforeEach(inject(function(_kpiCalculationService_) {
    kpiCalculationService = _kpiCalculationService_;
  }));

  describe('calculateKPIs()', function() {
    it('should calculate KPIs correctly for multiple cards', function() {
      var cardData = [
        { creditLimit: 10000, availableCredit: 5000, outstandingAmount: 5000, currentMonthSpend: 1500 },
        { creditLimit: 5000, availableCredit: 3000, outstandingAmount: 2000, currentMonthSpend: 800 },
        { creditLimit: 8000, availableCredit: 6000, outstandingAmount: 2000, currentMonthSpend: 600 }
      ];

      var result = kpiCalculationService.calculateKPIs(cardData);

      expect(result.totalCreditLimit).toBe(23000);
      expect(result.totalAvailableCredit).toBe(14000);
      expect(result.totalOutstandingAmount).toBe(9000);
      expect(result.monthlySpend).toBe(2900);
      expect(result.cardCount).toBe(3);
      expect(parseFloat(result.utilizationRate)).toBeCloseTo(39.13, 1);
    });

    it('should return zero values for empty card array', function() {
      var result = kpiCalculationService.calculateKPIs([]);

      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.monthlySpend).toBe(0);
      expect(result.cardCount).toBe(0);
      expect(parseFloat(result.utilizationRate)).toBe(0);
    });

    it('should return zero values for null input', function() {
      var result = kpiCalculationService.calculateKPIs(null);

      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.monthlySpend).toBe(0);
      expect(result.cardCount).toBe(0);
      expect(parseFloat(result.utilizationRate)).toBe(0);
    });

    it('should return zero values for undefined input', function() {
      var result = kpiCalculationService.calculateKPIs(undefined);

      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.monthlySpend).toBe(0);
      expect(result.cardCount).toBe(0);
      expect(parseFloat(result.utilizationRate)).toBe(0);
    });

    it('should handle missing card properties gracefully', function() {
      var cardData = [
        { creditLimit: 10000 },
        { availableCredit: 3000, outstandingAmount: 2000 },
        { currentMonthSpend: 500 }
      ];

      var result = kpiCalculationService.calculateKPIs(cardData);

      expect(result.totalCreditLimit).toBe(10000);
      expect(result.totalAvailableCredit).toBe(3000);
      expect(result.totalOutstandingAmount).toBe(2000);
      expect(result.monthlySpend).toBe(500);
      expect(result.cardCount).toBe(3);
    });

    it('should calculate utilization rate correctly', function() {
      var cardData = [
        { creditLimit: 10000, outstandingAmount: 3000 }
      ];

      var result = kpiCalculationService.calculateKPIs(cardData);
      expect(parseFloat(result.utilizationRate)).toBe(30.00);
    });

    it('should return zero utilization rate when credit limit is zero', function() {
      var cardData = [
        { creditLimit: 0, outstandingAmount: 1000 }
      ];

      var result = kpiCalculationService.calculateKPIs(cardData);
      expect(parseFloat(result.utilizationRate)).toBe(0);
    });

    it('should include lastUpdated timestamp', function() {
      var cardData = [{ creditLimit: 5000 }];
      var result = kpiCalculationService.calculateKPIs(cardData);

      expect(result.lastUpdated).toBeDefined();
      expect(result.lastUpdated instanceof Date).toBe(true);
    });

    it('should handle single card correctly', function() {
      var cardData = [
        { creditLimit: 5000, availableCredit: 2000, outstandingAmount: 3000, currentMonthSpend: 1200 }
      ];

      var result = kpiCalculationService.calculateKPIs(cardData);

      expect(result.totalCreditLimit).toBe(5000);
      expect(result.totalAvailableCredit).toBe(2000);
      expect(result.totalOutstandingAmount).toBe(3000);
      expect(result.monthlySpend).toBe(1200);
      expect(result.cardCount).toBe(1);
      expect(parseFloat(result.utilizationRate)).toBe(60.00);
    });
  });
});

/*
Coverage Report:
- Functions tested: calculateKPIs
- Scenarios covered: multiple cards, single card, empty array, null/undefined input, missing properties, utilization calculation
- Edge cases: zero credit limit, missing card properties, empty/null/undefined inputs
- Uncovered scenarios: none - all calculation paths and edge cases tested
*/