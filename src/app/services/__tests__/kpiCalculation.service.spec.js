/*
Test Documentation:
- Test Name: KPICalculationService - calculateKPIs
- Purpose: Validate KPI calculation logic for credit card portfolio metrics
- Scenario: Service aggregates credit card data to compute total limits, outstanding amounts, available credit, and monthly spend
- Expected Result: Returns KPI object with accurate aggregated financial metrics
*/
/*
Coverage Report:
- Functions tested: calculateKPIs
- Scenarios covered: normal calculation with multiple cards, empty card array, null input, single card, zero values
- Uncovered scenarios: none
*/

describe('KPICalculationService', function() {
  'use strict';

  var KPICalculationService;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_KPICalculationService_) {
    KPICalculationService = _KPICalculationService_;
  }));

  describe('calculateKPIs', function() {
    it('should return zero KPIs for empty card array', function() {
      var result = KPICalculationService.calculateKPIs([]);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.cardCount).toBe(0);
      expect(result.cards).toEqual([]);
    });

    it('should return zero KPIs for null input', function() {
      var result = KPICalculationService.calculateKPIs(null);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.cardCount).toBe(0);
    });

    it('should calculate KPIs for single card', function() {
      var cards = [
        {cardId: 'CC001', creditLimit: 50000, outstandingAmount: 10000, availableCredit: 40000, monthlySpend: 5000}
      ];
      var result = KPICalculationService.calculateKPIs(cards);
      expect(result.totalCreditLimit).toBe(50000);
      expect(result.totalOutstanding).toBe(10000);
      expect(result.totalAvailableCredit).toBe(40000);
      expect(result.totalMonthlySpend).toBe(5000);
      expect(result.cardCount).toBe(1);
      expect(result.cards).toEqual(cards);
    });

    it('should calculate aggregated KPIs for multiple cards', function() {
      var cards = [
        {cardId: 'CC001', creditLimit: 50000, outstandingAmount: 10000, availableCredit: 40000, monthlySpend: 5000},
        {cardId: 'CC002', creditLimit: 75000, outstandingAmount: 20000, availableCredit: 55000, monthlySpend: 8000},
        {cardId: 'CC003', creditLimit: 100000, outstandingAmount: 30000, availableCredit: 70000, monthlySpend: 12000}
      ];
      var result = KPICalculationService.calculateKPIs(cards);
      expect(result.totalCreditLimit).toBe(225000);
      expect(result.totalOutstanding).toBe(60000);
      expect(result.totalAvailableCredit).toBe(165000);
      expect(result.totalMonthlySpend).toBe(25000);
      expect(result.cardCount).toBe(3);
    });

    it('should preserve original card array in result', function() {
      var cards = [
        {cardId: 'CC001', creditLimit: 50000, outstandingAmount: 10000, availableCredit: 40000, monthlySpend: 5000}
      ];
      var result = KPICalculationService.calculateKPIs(cards);
      expect(result.cards).toBe(cards);
      expect(result.cards[0].cardId).toBe('CC001');
    });

    it('should handle cards with zero values', function() {
      var cards = [
        {cardId: 'CC001', creditLimit: 0, outstandingAmount: 0, availableCredit: 0, monthlySpend: 0}
      ];
      var result = KPICalculationService.calculateKPIs(cards);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.cardCount).toBe(1);
    });

    it('should correctly sum large numbers', function() {
      var cards = [
        {cardId: 'CC001', creditLimit: 999999, outstandingAmount: 500000, availableCredit: 499999, monthlySpend: 100000},
        {cardId: 'CC002', creditLimit: 888888, outstandingAmount: 400000, availableCredit: 488888, monthlySpend: 80000}
      ];
      var result = KPICalculationService.calculateKPIs(cards);
      expect(result.totalCreditLimit).toBe(1888887);
      expect(result.totalOutstanding).toBe(900000);
      expect(result.totalAvailableCredit).toBe(988887);
      expect(result.totalMonthlySpend).toBe(180000);
    });
  });
});