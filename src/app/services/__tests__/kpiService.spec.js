/*
Test Documentation:
- Test Name: kpiService.spec.js
- Purpose: Validate KPI calculation logic for credit card portfolio
- Scenario: Tests aggregation of credit limits, available credit, outstanding amounts, and monthly spend
- Expected Result: All KPI calculations return accurate aggregated values
*/

(function() {
  'use strict';

  describe('kpiService', function() {
    var kpiService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_kpiService_) {
      kpiService = _kpiService_;
    }));

    describe('calculateKPIs', function() {
      it('should calculate total credit limit correctly', function() {
        var cards = [
          {cardId: 'CC001', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, monthlySpend: 8500},
          {cardId: 'CC002', creditLimit: 30000, availableCredit: 22000, outstandingAmount: 8000, monthlySpend: 5200},
          {cardId: 'CC003', creditLimit: 75000, availableCredit: 60000, outstandingAmount: 15000, monthlySpend: 12300}
        ];

        var kpis = kpiService.calculateKPIs(cards);

        expect(kpis.totalCreditLimit).toBe(155000);
      });

      it('should calculate total available credit correctly', function() {
        var cards = [
          {cardId: 'CC001', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, monthlySpend: 8500},
          {cardId: 'CC002', creditLimit: 30000, availableCredit: 22000, outstandingAmount: 8000, monthlySpend: 5200}
        ];

        var kpis = kpiService.calculateKPIs(cards);

        expect(kpis.totalAvailableCredit).toBe(57000);
      });

      it('should calculate total outstanding amount correctly', function() {
        var cards = [
          {cardId: 'CC001', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, monthlySpend: 8500},
          {cardId: 'CC002', creditLimit: 30000, availableCredit: 22000, outstandingAmount: 8000, monthlySpend: 5200},
          {cardId: 'CC003', creditLimit: 75000, availableCredit: 60000, outstandingAmount: 15000, monthlySpend: 12300}
        ];

        var kpis = kpiService.calculateKPIs(cards);

        expect(kpis.totalOutstanding).toBe(38000);
      });

      it('should calculate total monthly spend correctly', function() {
        var cards = [
          {cardId: 'CC001', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, monthlySpend: 8500},
          {cardId: 'CC002', creditLimit: 30000, availableCredit: 22000, outstandingAmount: 8000, monthlySpend: 5200}
        ];

        var kpis = kpiService.calculateKPIs(cards);

        expect(kpis.totalMonthlySpend).toBe(13700);
      });

      it('should calculate card count correctly', function() {
        var cards = [
          {cardId: 'CC001', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, monthlySpend: 8500},
          {cardId: 'CC002', creditLimit: 30000, availableCredit: 22000, outstandingAmount: 8000, monthlySpend: 5200},
          {cardId: 'CC003', creditLimit: 75000, availableCredit: 60000, outstandingAmount: 15000, monthlySpend: 12300}
        ];

        var kpis = kpiService.calculateKPIs(cards);

        expect(kpis.cardCount).toBe(3);
      });

      it('should return all KPI properties', function() {
        var cards = [
          {cardId: 'CC001', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, monthlySpend: 8500}
        ];

        var kpis = kpiService.calculateKPIs(cards);

        expect(kpis.totalCreditLimit).toBeDefined();
        expect(kpis.totalAvailableCredit).toBeDefined();
        expect(kpis.totalOutstanding).toBeDefined();
        expect(kpis.totalMonthlySpend).toBeDefined();
        expect(kpis.cardCount).toBeDefined();
      });

      it('should handle single card correctly', function() {
        var cards = [
          {cardId: 'CC001', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, monthlySpend: 8500}
        ];

        var kpis = kpiService.calculateKPIs(cards);

        expect(kpis.totalCreditLimit).toBe(50000);
        expect(kpis.totalAvailableCredit).toBe(35000);
        expect(kpis.totalOutstanding).toBe(15000);
        expect(kpis.totalMonthlySpend).toBe(8500);
        expect(kpis.cardCount).toBe(1);
      });

      it('should return zero values for empty card array', function() {
        var cards = [];
        var kpis = kpiService.calculateKPIs(cards);

        expect(kpis.totalCreditLimit).toBe(0);
        expect(kpis.totalAvailableCredit).toBe(0);
        expect(kpis.totalOutstanding).toBe(0);
        expect(kpis.totalMonthlySpend).toBe(0);
        expect(kpis.cardCount).toBe(0);
      });

      it('should return zero values for null input', function() {
        var kpis = kpiService.calculateKPIs(null);

        expect(kpis.totalCreditLimit).toBe(0);
        expect(kpis.totalAvailableCredit).toBe(0);
        expect(kpis.totalOutstanding).toBe(0);
        expect(kpis.totalMonthlySpend).toBe(0);
        expect(kpis.cardCount).toBe(0);
      });

      it('should return zero values for undefined input', function() {
        var kpis = kpiService.calculateKPIs(undefined);

        expect(kpis.totalCreditLimit).toBe(0);
        expect(kpis.totalAvailableCredit).toBe(0);
        expect(kpis.totalOutstanding).toBe(0);
        expect(kpis.totalMonthlySpend).toBe(0);
        expect(kpis.cardCount).toBe(0);
      });

      it('should handle cards with zero values', function() {
        var cards = [
          {cardId: 'CC001', creditLimit: 0, availableCredit: 0, outstandingAmount: 0, monthlySpend: 0},
          {cardId: 'CC002', creditLimit: 0, availableCredit: 0, outstandingAmount: 0, monthlySpend: 0}
        ];

        var kpis = kpiService.calculateKPIs(cards);

        expect(kpis.totalCreditLimit).toBe(0);
        expect(kpis.totalAvailableCredit).toBe(0);
        expect(kpis.totalOutstanding).toBe(0);
        expect(kpis.totalMonthlySpend).toBe(0);
        expect(kpis.cardCount).toBe(2);
      });

      it('should handle large numbers correctly', function() {
        var cards = [
          {cardId: 'CC001', creditLimit: 1000000, availableCredit: 800000, outstandingAmount: 200000, monthlySpend: 150000},
          {cardId: 'CC002', creditLimit: 2000000, availableCredit: 1500000, outstandingAmount: 500000, monthlySpend: 300000}
        ];

        var kpis = kpiService.calculateKPIs(cards);

        expect(kpis.totalCreditLimit).toBe(3000000);
        expect(kpis.totalAvailableCredit).toBe(2300000);
        expect(kpis.totalOutstanding).toBe(700000);
        expect(kpis.totalMonthlySpend).toBe(450000);
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: calculateKPIs
  - Scenarios covered:
    * Total credit limit calculation
    * Total available credit calculation
    * Total outstanding amount calculation
    * Total monthly spend calculation
    * Card count calculation
    * All KPI properties validation
    * Single card handling
    * Empty array handling
    * Null input handling
    * Undefined input handling
    * Zero values handling
    * Large numbers handling
  - Uncovered scenarios: None
  */
})();