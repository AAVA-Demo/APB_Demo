/*
Test Documentation:
- Test Name: kpiService - KPI calculations
- Purpose: Validates KPI service calculates financial metrics correctly
- Scenario: Service aggregates card data into KPIs
- Expected Result: Returns calculated KPIs with correct values
*/

(function() {
  'use strict';

  describe('kpiService', function() {
    var kpiService;
    var mockCards;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_kpiService_) {
      kpiService = _kpiService_;

      mockCards = [
        { cardId: 1, creditLimit: 5000, availableCredit: 3000, outstandingAmount: 2000, monthlySpend: 1500 },
        { cardId: 2, creditLimit: 10000, availableCredit: 8000, outstandingAmount: 2000, monthlySpend: 2500 }
      ];
    }));

    /*
    Test Documentation:
    - Test Name: should calculate total credit limit
    - Purpose: Validates total credit limit aggregation
    - Scenario: Multiple cards with different credit limits
    - Expected Result: Returns sum of all credit limits
    */
    it('should calculate total credit limit', function() {
      var result = kpiService.calculateKPIs(mockCards);

      expect(result.totalCreditLimit).toBe(15000);
    });

    /*
    Test Documentation:
    - Test Name: should calculate total available credit
    - Purpose: Validates total available credit aggregation
    - Scenario: Multiple cards with different available credits
    - Expected Result: Returns sum of all available credits
    */
    it('should calculate total available credit', function() {
      var result = kpiService.calculateKPIs(mockCards);

      expect(result.totalAvailableCredit).toBe(11000);
    });

    /*
    Test Documentation:
    - Test Name: should calculate total outstanding amount
    - Purpose: Validates total outstanding amount aggregation
    - Scenario: Multiple cards with outstanding balances
    - Expected Result: Returns sum of all outstanding amounts
    */
    it('should calculate total outstanding amount', function() {
      var result = kpiService.calculateKPIs(mockCards);

      expect(result.totalOutstandingAmount).toBe(4000);
    });

    /*
    Test Documentation:
    - Test Name: should calculate monthly spend
    - Purpose: Validates monthly spend aggregation
    - Scenario: Multiple cards with monthly spending
    - Expected Result: Returns sum of all monthly spends
    */
    it('should calculate monthly spend', function() {
      var result = kpiService.calculateKPIs(mockCards);

      expect(result.monthlySpend).toBe(4000);
    });

    /*
    Test Documentation:
    - Test Name: should count number of cards
    - Purpose: Validates card count
    - Scenario: Multiple cards provided
    - Expected Result: Returns correct card count
    */
    it('should count number of cards', function() {
      var result = kpiService.calculateKPIs(mockCards);

      expect(result.cardCount).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: should include last updated timestamp
    - Purpose: Validates timestamp is included in KPIs
    - Scenario: Calculate KPIs
    - Expected Result: Returns lastUpdated as Date object
    */
    it('should include last updated timestamp', function() {
      var result = kpiService.calculateKPIs(mockCards);

      expect(result.lastUpdated).toBeDefined();
      expect(result.lastUpdated instanceof Date).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: should handle empty cards array
    - Purpose: Validates error handling for empty input
    - Scenario: Empty cards array provided
    - Expected Result: Returns zero values for all KPIs
    */
    it('should handle empty cards array', function() {
      var result = kpiService.calculateKPIs([]);

      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.monthlySpend).toBe(0);
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
      var result = kpiService.calculateKPIs(null);

      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.monthlySpend).toBe(0);
      expect(result.cardCount).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle cards with missing properties
    - Purpose: Validates handling of incomplete card data
    - Scenario: Cards with undefined or null properties
    - Expected Result: Treats missing values as zero
    */
    it('should handle cards with missing properties', function() {
      var incompleteCards = [
        { cardId: 1, creditLimit: 5000 },
        { cardId: 2, availableCredit: 3000 }
      ];

      var result = kpiService.calculateKPIs(incompleteCards);

      expect(result.totalCreditLimit).toBe(5000);
      expect(result.totalAvailableCredit).toBe(3000);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.monthlySpend).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle single card
    - Purpose: Validates calculation with single card
    - Scenario: Array with one card
    - Expected Result: Returns KPIs for single card
    */
    it('should handle single card', function() {
      var singleCard = [mockCards[0]];
      var result = kpiService.calculateKPIs(singleCard);

      expect(result.totalCreditLimit).toBe(5000);
      expect(result.cardCount).toBe(1);
    });
  });

  /*
  Coverage Report:
  - Functions tested: calculateKPIs
  - Scenarios covered: all KPI calculations, empty array, null input, missing properties, single card
  - Edge cases: empty array, null, undefined properties
  - Uncovered scenarios: none
  */
})();