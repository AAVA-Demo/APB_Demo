/*
Test Documentation:
- Test Name: KpiAggregationService - calculateKpis
- Purpose: Validates calculation of KPI metrics from credit card data
- Scenario: Service aggregates credit limits, balances, and spending across cards
- Expected Result: Returns object with totalCreditLimit, totalAvailableCredit, totalOutstanding, monthlySpend, cardCount
*/
/*
Coverage Report:
- Functions tested: calculateKpis
- Scenarios covered: normal aggregation, empty card array, null input, single card, multiple cards, zero values, edge cases
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('KpiAggregationService', function() {
    var KpiAggregationService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KpiAggregationService_) {
      KpiAggregationService = _KpiAggregationService_;
    }));

    describe('calculateKpis', function() {
      it('should return zero values for empty card array', function() {
        var result = KpiAggregationService.calculateKpis([], 0);
        expect(result.totalCreditLimit).toBe(0);
        expect(result.totalAvailableCredit).toBe(0);
        expect(result.totalOutstanding).toBe(0);
        expect(result.monthlySpend).toBe(0);
        expect(result.cardCount).toBe(0);
      });

      it('should return zero values for null cards input', function() {
        var result = KpiAggregationService.calculateKpis(null, 0);
        expect(result.totalCreditLimit).toBe(0);
        expect(result.totalAvailableCredit).toBe(0);
        expect(result.totalOutstanding).toBe(0);
        expect(result.monthlySpend).toBe(0);
        expect(result.cardCount).toBe(0);
      });

      it('should return zero values for undefined cards input', function() {
        var result = KpiAggregationService.calculateKpis(undefined, 0);
        expect(result.totalCreditLimit).toBe(0);
        expect(result.totalAvailableCredit).toBe(0);
        expect(result.totalOutstanding).toBe(0);
        expect(result.monthlySpend).toBe(0);
        expect(result.cardCount).toBe(0);
      });

      it('should calculate KPIs correctly for single card', function() {
        var cards = [
          {creditLimit: 10000, availableCredit: 6500, currentBalance: 3500}
        ];
        var result = KpiAggregationService.calculateKpis(cards, 1200);
        expect(result.totalCreditLimit).toBe(10000);
        expect(result.totalAvailableCredit).toBe(6500);
        expect(result.totalOutstanding).toBe(3500);
        expect(result.monthlySpend).toBe(1200);
        expect(result.cardCount).toBe(1);
      });

      it('should calculate KPIs correctly for multiple cards', function() {
        var cards = [
          {creditLimit: 10000, availableCredit: 6500, currentBalance: 3500},
          {creditLimit: 15000, availableCredit: 9800, currentBalance: 5200},
          {creditLimit: 20000, availableCredit: 11900, currentBalance: 8100}
        ];
        var result = KpiAggregationService.calculateKpis(cards, 2500);
        expect(result.totalCreditLimit).toBe(45000);
        expect(result.totalAvailableCredit).toBe(28200);
        expect(result.totalOutstanding).toBe(16800);
        expect(result.monthlySpend).toBe(2500);
        expect(result.cardCount).toBe(3);
      });

      it('should handle zero monthly spend', function() {
        var cards = [
          {creditLimit: 10000, availableCredit: 10000, currentBalance: 0}
        ];
        var result = KpiAggregationService.calculateKpis(cards, 0);
        expect(result.monthlySpend).toBe(0);
        expect(result.totalOutstanding).toBe(0);
      });

      it('should handle null monthly spend parameter', function() {
        var cards = [
          {creditLimit: 10000, availableCredit: 6500, currentBalance: 3500}
        ];
        var result = KpiAggregationService.calculateKpis(cards, null);
        expect(result.monthlySpend).toBe(0);
      });

      it('should handle undefined monthly spend parameter', function() {
        var cards = [
          {creditLimit: 10000, availableCredit: 6500, currentBalance: 3500}
        ];
        var result = KpiAggregationService.calculateKpis(cards);
        expect(result.monthlySpend).toBe(0);
      });

      it('should handle cards with zero credit limit', function() {
        var cards = [
          {creditLimit: 0, availableCredit: 0, currentBalance: 0}
        ];
        var result = KpiAggregationService.calculateKpis(cards, 0);
        expect(result.totalCreditLimit).toBe(0);
        expect(result.totalAvailableCredit).toBe(0);
        expect(result.totalOutstanding).toBe(0);
        expect(result.cardCount).toBe(1);
      });

      it('should handle cards with maxed out credit', function() {
        var cards = [
          {creditLimit: 10000, availableCredit: 0, currentBalance: 10000}
        ];
        var result = KpiAggregationService.calculateKpis(cards, 500);
        expect(result.totalCreditLimit).toBe(10000);
        expect(result.totalAvailableCredit).toBe(0);
        expect(result.totalOutstanding).toBe(10000);
      });

      it('should return all required KPI properties', function() {
        var cards = [
          {creditLimit: 5000, availableCredit: 3000, currentBalance: 2000}
        ];
        var result = KpiAggregationService.calculateKpis(cards, 800);
        expect(result.hasOwnProperty('totalCreditLimit')).toBe(true);
        expect(result.hasOwnProperty('totalAvailableCredit')).toBe(true);
        expect(result.hasOwnProperty('totalOutstanding')).toBe(true);
        expect(result.hasOwnProperty('monthlySpend')).toBe(true);
        expect(result.hasOwnProperty('cardCount')).toBe(true);
      });

      it('should handle large numbers correctly', function() {
        var cards = [
          {creditLimit: 100000, availableCredit: 75000, currentBalance: 25000},
          {creditLimit: 200000, availableCredit: 150000, currentBalance: 50000}
        ];
        var result = KpiAggregationService.calculateKpis(cards, 15000);
        expect(result.totalCreditLimit).toBe(300000);
        expect(result.totalAvailableCredit).toBe(225000);
        expect(result.totalOutstanding).toBe(75000);
      });

      it('should handle decimal values correctly', function() {
        var cards = [
          {creditLimit: 10000.50, availableCredit: 6500.25, currentBalance: 3500.25}
        ];
        var result = KpiAggregationService.calculateKpis(cards, 1200.75);
        expect(result.totalCreditLimit).toBe(10000.50);
        expect(result.totalAvailableCredit).toBe(6500.25);
        expect(result.totalOutstanding).toBe(3500.25);
        expect(result.monthlySpend).toBe(1200.75);
      });
    });
  });
})();