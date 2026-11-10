/*
Test Documentation:
- Test Name: KpiCalculationService - getKpiSummary
- Purpose: Validates retrieval and aggregation of KPI summary
- Scenario: User has multiple credit cards with various balances
- Expected Result: Returns aggregated KPIs including total spend, limits, available credit, and outstanding amounts

- Test Name: KpiCalculationService - aggregateCardData
- Purpose: Validates KPI aggregation logic
- Scenario: Multiple cards with different financial data
- Expected Result: Correctly sums all financial metrics

- Test Name: KpiCalculationService - empty card list
- Purpose: Validates behavior with no cards
- Scenario: User has no credit cards
- Expected Result: Returns zero values for all KPIs

- Test Name: KpiCalculationService - error handling
- Purpose: Validates error propagation from data factory
- Scenario: CreditCardDataFactory fails
- Expected Result: Promise is rejected

Coverage Report:
- Functions tested: getKpiSummary, aggregateCardData
- Scenarios covered: normal flow, empty cards, error handling, null values
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('KpiCalculationService', function() {
    var KpiCalculationService, CreditCardDataFactory, $q, $rootScope;

    beforeEach(module('dashboard'));

    beforeEach(inject(function(_KpiCalculationService_, _CreditCardDataFactory_, _$q_, _$rootScope_) {
      KpiCalculationService = _KpiCalculationService_;
      CreditCardDataFactory = _CreditCardDataFactory_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getKpiSummary', function() {
      it('should retrieve and aggregate KPI summary from cards', function(done) {
        var mockCards = [
          {monthlySpend: 1000, creditLimit: 5000, availableCredit: 3000, outstandingAmount: 2000},
          {monthlySpend: 1500, creditLimit: 10000, availableCredit: 7000, outstandingAmount: 3000}
        ];

        spyOn(CreditCardDataFactory, 'getAllCards').and.returnValue($q.resolve(mockCards));

        KpiCalculationService.getKpiSummary().then(function(summary) {
          expect(summary.totalMonthlySpend).toBe(2500);
          expect(summary.totalCreditLimit).toBe(15000);
          expect(summary.totalAvailableCredit).toBe(10000);
          expect(summary.totalOutstanding).toBe(5000);
          expect(summary.cardCount).toBe(2);
          done();
        });

        $rootScope.$apply();
      });

      it('should handle empty card list', function(done) {
        spyOn(CreditCardDataFactory, 'getAllCards').and.returnValue($q.resolve([]));

        KpiCalculationService.getKpiSummary().then(function(summary) {
          expect(summary.totalMonthlySpend).toBe(0);
          expect(summary.totalCreditLimit).toBe(0);
          expect(summary.totalAvailableCredit).toBe(0);
          expect(summary.totalOutstanding).toBe(0);
          expect(summary.cardCount).toBe(0);
          done();
        });

        $rootScope.$apply();
      });

      it('should reject promise when data factory fails', function(done) {
        spyOn(CreditCardDataFactory, 'getAllCards').and.returnValue($q.reject('Data fetch error'));

        KpiCalculationService.getKpiSummary().catch(function(error) {
          expect(error).toBe('Data fetch error');
          done();
        });

        $rootScope.$apply();
      });
    });

    describe('aggregateCardData', function() {
      it('should correctly aggregate card data', function() {
        var cards = [
          {monthlySpend: 500, creditLimit: 5000, availableCredit: 4000, outstandingAmount: 1000},
          {monthlySpend: 800, creditLimit: 8000, availableCredit: 6000, outstandingAmount: 2000},
          {monthlySpend: 1200, creditLimit: 12000, availableCredit: 9000, outstandingAmount: 3000}
        ];

        var summary = KpiCalculationService.aggregateCardData(cards);

        expect(summary.totalMonthlySpend).toBe(2500);
        expect(summary.totalCreditLimit).toBe(25000);
        expect(summary.totalAvailableCredit).toBe(19000);
        expect(summary.totalOutstanding).toBe(6000);
        expect(summary.cardCount).toBe(3);
      });

      it('should handle cards with null or undefined values', function() {
        var cards = [
          {monthlySpend: null, creditLimit: 5000, availableCredit: undefined, outstandingAmount: 1000},
          {monthlySpend: 500, creditLimit: null, availableCredit: 3000, outstandingAmount: undefined}
        ];

        var summary = KpiCalculationService.aggregateCardData(cards);

        expect(summary.totalMonthlySpend).toBe(500);
        expect(summary.totalCreditLimit).toBe(5000);
        expect(summary.totalAvailableCredit).toBe(3000);
        expect(summary.totalOutstanding).toBe(1000);
        expect(summary.cardCount).toBe(2);
      });

      it('should return zero totals for empty array', function() {
        var summary = KpiCalculationService.aggregateCardData([]);

        expect(summary.totalMonthlySpend).toBe(0);
        expect(summary.totalCreditLimit).toBe(0);
        expect(summary.totalAvailableCredit).toBe(0);
        expect(summary.totalOutstanding).toBe(0);
        expect(summary.cardCount).toBe(0);
      });

      it('should handle single card', function() {
        var cards = [{monthlySpend: 1000, creditLimit: 10000, availableCredit: 8000, outstandingAmount: 2000}];

        var summary = KpiCalculationService.aggregateCardData(cards);

        expect(summary.totalMonthlySpend).toBe(1000);
        expect(summary.totalCreditLimit).toBe(10000);
        expect(summary.totalAvailableCredit).toBe(8000);
        expect(summary.totalOutstanding).toBe(2000);
        expect(summary.cardCount).toBe(1);
      });
    });
  });
})();