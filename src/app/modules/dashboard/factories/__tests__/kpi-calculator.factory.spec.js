/*
Test Documentation:
- Test Name: KPICalculatorFactory functionality
- Purpose: Validate KPI calculation logic
- Scenario: Test calculateKPIs with various card data
- Expected Result: Correct KPI values calculated
*/

(function() {
  'use strict';

  describe('KPICalculatorFactory', function() {
    var KPICalculatorFactory;
    var mockCards = [
      {
        cardId: 'card1',
        creditLimit: 5000,
        availableCredit: 3000,
        outstandingAmount: 2000,
        monthlySpend: 1500,
        status: 'Active'
      },
      {
        cardId: 'card2',
        creditLimit: 10000,
        availableCredit: 7000,
        outstandingAmount: 3000,
        monthlySpend: 2500,
        status: 'Active'
      }
    ];

    beforeEach(module('app.dashboard'));

    beforeEach(inject(function(_KPICalculatorFactory_) {
      KPICalculatorFactory = _KPICalculatorFactory_;
    }));

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Ensure factory is injectable
    - Scenario: Inject KPICalculatorFactory
    - Expected Result: Factory is defined
    */
    it('should be defined', function() {
      expect(KPICalculatorFactory).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: calculateKPIs should return correct totals
    - Purpose: Validate KPI calculation
    - Scenario: Calculate KPIs from mock cards
    - Expected Result: All totals calculated correctly
    */
    it('calculateKPIs should return correct totals', function() {
      var result = KPICalculatorFactory.calculateKPIs(mockCards);

      expect(result.totalCreditLimit).toBe(15000);
      expect(result.totalAvailableCredit).toBe(10000);
      expect(result.totalOutstanding).toBe(5000);
      expect(result.totalMonthlySpend).toBe(4000);
      expect(result.activeCardsCount).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: calculateKPIs should calculate credit utilization percentage
    - Purpose: Validate utilization calculation
    - Scenario: Calculate utilization from outstanding and limit
    - Expected Result: Correct percentage (33.33%)
    */
    it('calculateKPIs should calculate credit utilization percentage', function() {
      var result = KPICalculatorFactory.calculateKPIs(mockCards);
      expect(result.creditUtilizationPercent).toBeCloseTo(33.33, 2);
    });

    /*
    Test Documentation:
    - Test Name: calculateKPIs should handle empty card array
    - Purpose: Validate edge case with no cards
    - Scenario: Pass empty array
    - Expected Result: All values return 0
    */
    it('calculateKPIs should handle empty card array', function() {
      var result = KPICalculatorFactory.calculateKPIs([]);

      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.creditUtilizationPercent).toBe(0);
      expect(result.activeCardsCount).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: calculateKPIs should handle null or undefined input
    - Purpose: Validate error handling
    - Scenario: Pass null/undefined
    - Expected Result: Returns default zero values
    */
    it('calculateKPIs should handle null or undefined input', function() {
      var resultNull = KPICalculatorFactory.calculateKPIs(null);
      var resultUndefined = KPICalculatorFactory.calculateKPIs(undefined);

      expect(resultNull.totalCreditLimit).toBe(0);
      expect(resultUndefined.totalCreditLimit).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: calculateKPIs should count only active cards
    - Purpose: Validate active card counting
    - Scenario: Mix of active and inactive cards
    - Expected Result: Only active cards counted
    */
    it('calculateKPIs should count only active cards', function() {
      var mixedCards = [
        { cardId: 'card1', creditLimit: 5000, status: 'Active' },
        { cardId: 'card2', creditLimit: 10000, status: 'Inactive' },
        { cardId: 'card3', creditLimit: 8000, status: 'Active' }
      ];

      var result = KPICalculatorFactory.calculateKPIs(mixedCards);
      expect(result.activeCardsCount).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: calculateKPIs should handle missing properties
    - Purpose: Validate handling of incomplete data
    - Scenario: Cards with missing properties
    - Expected Result: Missing values treated as 0
    */
    it('calculateKPIs should handle missing properties', function() {
      var incompleteCards = [
        { cardId: 'card1', creditLimit: 5000 },
        { cardId: 'card2', outstandingAmount: 1000 }
      ];

      var result = KPICalculatorFactory.calculateKPIs(incompleteCards);
      expect(result.totalCreditLimit).toBe(5000);
      expect(result.totalOutstanding).toBe(1000);
    });
  });

  /*
  Coverage Report:
  - Functions tested: calculateKPIs
  - Scenarios covered: normal calculation, empty array, null/undefined, active card counting, missing properties
  - Uncovered scenarios: none
  */
})();