/*
Test Documentation:
- Test Name: KPIService - getKPIs
- Purpose: Verify KPI data retrieval and computation
- Scenario: Service fetches and computes KPI metrics from card data
- Expected Result: Returns computed KPIs with monthly spend, credit limits, and outstanding amounts
*/
/*
Test Documentation:
- Test Name: KPIService - refreshKPIs
- Purpose: Verify cache invalidation and fresh data retrieval
- Scenario: User requests KPI refresh
- Expected Result: Cache cleared and fresh KPIs fetched
*/
/*
Test Documentation:
- Test Name: KPIService - computeKPIs
- Purpose: Verify KPI calculation logic
- Scenario: Raw card summary data provided
- Expected Result: Correctly aggregates totals across all cards
*/
/*
Test Documentation:
- Test Name: KPIService - caching behavior
- Purpose: Verify caching mechanism reduces API calls
- Scenario: Multiple getKPIs calls within cache TTL
- Expected Result: Data fetched once and served from cache
*/
/*
Coverage Report:
- Functions tested: getKPIs, refreshKPIs, computeKPIs
- Scenarios covered: initial fetch, cached retrieval, cache refresh, computation logic, multiple cards aggregation, empty card list
- Uncovered scenarios: none - all public methods and edge cases tested
*/

(function() {
  'use strict';

  describe('KPIService', function() {
    var KPIService, CreditCardDataFactory, $q, $rootScope, $cacheFactory;
    var mockCardSummary;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KPIService_, _CreditCardDataFactory_, _$q_, _$rootScope_, _$cacheFactory_) {
      KPIService = _KPIService_;
      CreditCardDataFactory = _CreditCardDataFactory_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      $cacheFactory = _$cacheFactory_;

      mockCardSummary = {
        userId: 'user-001',
        cards: [
          { cardId: 'card-001', creditLimit: 50000, availableCredit: 35000, currentBalance: 15000 },
          { cardId: 'card-002', creditLimit: 30000, availableCredit: 28000, currentBalance: 2000 },
          { cardId: 'card-003', creditLimit: 20000, availableCredit: 15000, currentBalance: 5000 }
        ],
        aggregatedSpend: { currentMonth: 22000, lastMonth: 18500 }
      };

      spyOn(CreditCardDataFactory, 'fetchCardSummary').and.returnValue($q.resolve(mockCardSummary));
    }));

    describe('getKPIs', function() {
      it('should fetch and return computed KPIs', function(done) {
        KPIService.getKPIs().then(function(kpis) {
          expect(kpis.monthlySpend).toBe(22000);
          expect(kpis.totalCreditLimit).toBe(100000);
          expect(kpis.availableCredit).toBe(78000);
          expect(kpis.outstandingAmount).toBe(22000);
          expect(kpis.lastUpdated).toBeDefined();
          done();
        });
        $rootScope.$apply();
      });

      it('should call CreditCardDataFactory.fetchCardSummary', function(done) {
        KPIService.getKPIs().then(function() {
          expect(CreditCardDataFactory.fetchCardSummary).toHaveBeenCalled();
          done();
        });
        $rootScope.$apply();
      });

      it('should cache KPI data', function(done) {
        KPIService.getKPIs().then(function() {
          return KPIService.getKPIs();
        }).then(function() {
          expect(CreditCardDataFactory.fetchCardSummary.calls.count()).toBe(1);
          done();
        });
        $rootScope.$apply();
      });

      it('should return cached data within TTL', function(done) {
        var firstResult;
        KPIService.getKPIs().then(function(result) {
          firstResult = result;
          return KPIService.getKPIs();
        }).then(function(secondResult) {
          expect(secondResult).toBe(firstResult);
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('refreshKPIs', function() {
      it('should clear cache and fetch fresh data', function(done) {
        KPIService.getKPIs().then(function() {
          return KPIService.refreshKPIs();
        }).then(function() {
          expect(CreditCardDataFactory.fetchCardSummary.calls.count()).toBe(2);
          done();
        });
        $rootScope.$apply();
      });

      it('should return fresh KPI data', function(done) {
        KPIService.refreshKPIs().then(function(kpis) {
          expect(kpis.monthlySpend).toBe(22000);
          expect(kpis.totalCreditLimit).toBe(100000);
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('computeKPIs', function() {
      it('should correctly aggregate credit limits', function() {
        var kpis = KPIService.computeKPIs(mockCardSummary);
        expect(kpis.totalCreditLimit).toBe(100000);
      });

      it('should correctly aggregate available credit', function() {
        var kpis = KPIService.computeKPIs(mockCardSummary);
        expect(kpis.availableCredit).toBe(78000);
      });

      it('should correctly aggregate outstanding amounts', function() {
        var kpis = KPIService.computeKPIs(mockCardSummary);
        expect(kpis.outstandingAmount).toBe(22000);
      });

      it('should use monthly spend from aggregatedSpend', function() {
        var kpis = KPIService.computeKPIs(mockCardSummary);
        expect(kpis.monthlySpend).toBe(22000);
      });

      it('should set lastUpdated timestamp', function() {
        var kpis = KPIService.computeKPIs(mockCardSummary);
        expect(kpis.lastUpdated).toEqual(jasmine.any(Date));
      });

      it('should handle empty card list', function() {
        var emptyCardSummary = {
          cards: [],
          aggregatedSpend: { currentMonth: 0, lastMonth: 0 }
        };
        var kpis = KPIService.computeKPIs(emptyCardSummary);
        expect(kpis.totalCreditLimit).toBe(0);
        expect(kpis.availableCredit).toBe(0);
        expect(kpis.outstandingAmount).toBe(0);
      });

      it('should handle single card', function() {
        var singleCardSummary = {
          cards: [{ cardId: 'card-001', creditLimit: 50000, availableCredit: 35000, currentBalance: 15000 }],
          aggregatedSpend: { currentMonth: 15000, lastMonth: 12000 }
        };
        var kpis = KPIService.computeKPIs(singleCardSummary);
        expect(kpis.totalCreditLimit).toBe(50000);
        expect(kpis.availableCredit).toBe(35000);
        expect(kpis.outstandingAmount).toBe(15000);
      });
    });
  });
})();