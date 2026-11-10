/*
Test Documentation:
- Test Name: KPICalculatorService - calculateKPIs with valid cards
- Purpose: Validates KPI calculation for valid credit card data
- Scenario: calculateKPIs called with array of credit card objects
- Expected Result: Returns KPI object with aggregated totals

- Test Name: KPICalculatorService - calculateKPIs with empty array
- Purpose: Validates handling of empty card array
- Scenario: calculateKPIs called with empty array
- Expected Result: Returns KPI object with all values set to 0

- Test Name: KPICalculatorService - calculateKPIs with null input
- Purpose: Validates handling of null input
- Scenario: calculateKPIs called with null
- Expected Result: Returns KPI object with all values set to 0

- Test Name: KPICalculatorService - calculateKPIs with missing fields
- Purpose: Validates handling of cards with missing numeric fields
- Scenario: calculateKPIs called with cards missing some numeric fields
- Expected Result: Returns KPI object treating missing values as 0

- Test Name: KPICalculatorService - calculateKPIs accuracy
- Purpose: Validates accuracy of KPI calculations
- Scenario: calculateKPIs called with known values
- Expected Result: Returns correct sum for all KPI fields

Coverage Report:
- Functions tested: calculateKPIs
- Scenarios covered: valid cards, empty array, null input, missing fields, calculation accuracy
- Edge cases: null input, empty array, missing fields
- Uncovered scenarios: none
*/

describe('KPICalculatorService', function() {
  'use strict';

  var KPICalculatorService;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_KPICalculatorService_) {
    KPICalculatorService = _KPICalculatorService_;
  }));

  describe('calculateKPIs', function() {
    it('should calculate KPIs for valid credit card data', function() {
      var cards = [
        {cardId: 'CC001', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, monthlySpend: 8500},
        {cardId: 'CC002', creditLimit: 30000, availableCredit: 22000, outstandingAmount: 8000, monthlySpend: 5200}
      ];

      var kpis = KPICalculatorService.calculateKPIs(cards);

      expect(kpis).toBeDefined();
      expect(kpis.totalCreditLimit).toBe(80000);
      expect(kpis.totalAvailableCredit).toBe(57000);
      expect(kpis.totalOutstanding).toBe(23000);
      expect(kpis.totalMonthlySpend).toBe(13700);
      expect(kpis.cardCount).toBe(2);
    });

    it('should return zero KPIs for empty card array', function() {
      var cards = [];

      var kpis = KPICalculatorService.calculateKPIs(cards);

      expect(kpis.totalCreditLimit).toBe(0);
      expect(kpis.totalAvailableCredit).toBe(0);
      expect(kpis.totalOutstanding).toBe(0);
      expect(kpis.totalMonthlySpend).toBe(0);
      expect(kpis.cardCount).toBe(0);
    });

    it('should return zero KPIs for null input', function() {
      var kpis = KPICalculatorService.calculateKPIs(null);

      expect(kpis.totalCreditLimit).toBe(0);
      expect(kpis.totalAvailableCredit).toBe(0);
      expect(kpis.totalOutstanding).toBe(0);
      expect(kpis.totalMonthlySpend).toBe(0);
      expect(kpis.cardCount).toBe(0);
    });

    it('should return zero KPIs for undefined input', function() {
      var kpis = KPICalculatorService.calculateKPIs(undefined);

      expect(kpis.totalCreditLimit).toBe(0);
      expect(kpis.totalAvailableCredit).toBe(0);
      expect(kpis.totalOutstanding).toBe(0);
      expect(kpis.totalMonthlySpend).toBe(0);
      expect(kpis.cardCount).toBe(0);
    });

    it('should handle cards with missing numeric fields', function() {
      var cards = [
        {cardId: 'CC001', creditLimit: 50000, availableCredit: 35000},
        {cardId: 'CC002', outstandingAmount: 8000, monthlySpend: 5200}
      ];

      var kpis = KPICalculatorService.calculateKPIs(cards);

      expect(kpis.totalCreditLimit).toBe(50000);
      expect(kpis.totalAvailableCredit).toBe(35000);
      expect(kpis.totalOutstanding).toBe(8000);
      expect(kpis.totalMonthlySpend).toBe(5200);
      expect(kpis.cardCount).toBe(2);
    });

    it('should calculate correct totals for multiple cards', function() {
      var cards = [
        {cardId: 'CC001', creditLimit: 10000, availableCredit: 8000, outstandingAmount: 2000, monthlySpend: 1500},
        {cardId: 'CC002', creditLimit: 20000, availableCredit: 15000, outstandingAmount: 5000, monthlySpend: 3000},
        {cardId: 'CC003', creditLimit: 30000, availableCredit: 25000, outstandingAmount: 5000, monthlySpend: 4500}
      ];

      var kpis = KPICalculatorService.calculateKPIs(cards);

      expect(kpis.totalCreditLimit).toBe(60000);
      expect(kpis.totalAvailableCredit).toBe(48000);
      expect(kpis.totalOutstanding).toBe(12000);
      expect(kpis.totalMonthlySpend).toBe(9000);
      expect(kpis.cardCount).toBe(3);
    });

    it('should handle cards with zero values', function() {
      var cards = [
        {cardId: 'CC001', creditLimit: 0, availableCredit: 0, outstandingAmount: 0, monthlySpend: 0}
      ];

      var kpis = KPICalculatorService.calculateKPIs(cards);

      expect(kpis.totalCreditLimit).toBe(0);
      expect(kpis.totalAvailableCredit).toBe(0);
      expect(kpis.totalOutstanding).toBe(0);
      expect(kpis.totalMonthlySpend).toBe(0);
      expect(kpis.cardCount).toBe(1);
    });
  });
});