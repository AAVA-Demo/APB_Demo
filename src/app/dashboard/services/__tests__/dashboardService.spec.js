/*
Test Documentation:
- Test Name: DashboardService Unit Tests
- Purpose: Validate DashboardService functionality for loading dashboard data including KPIs and credit cards
- Scenario: Tests cover successful dashboard loading, KPI aggregation, error handling, and integration with dependencies
- Expected Result: Service correctly loads dashboard data, aggregates KPIs, and handles errors appropriately
*/

(function() {
  'use strict';

  describe('DashboardService', function() {
    var DashboardService, CreditCardService, KpiAggregationUtil, DashboardKpi, $q, $rootScope;
    var mockCards, mockKpis;

    beforeEach(module('ccDashboardModule'));
    beforeEach(module('ccApp'));

    beforeEach(function() {
      mockCards = [
        { id: '1', cardName: 'Visa Platinum', creditLimit: 10000, availableCredit: 7500, outstandingAmount: 2500, monthlySpend: 1200 },
        { id: '2', cardName: 'MasterCard Gold', creditLimit: 15000, availableCredit: 12000, outstandingAmount: 3000, monthlySpend: 1800 }
      ];

      mockKpis = {
        totalCreditLimit: 25000,
        totalAvailableCredit: 19500,
        totalOutstanding: 5500,
        totalMonthlySpend: 3000,
        cardCount: 2,
        lastUpdated: new Date()
      };

      module(function($provide) {
        $provide.service('CreditCardService', function($q) {
          return {
            getAllCards: jasmine.createSpy('getAllCards').and.returnValue($q.resolve(mockCards))
          };
        });

        $provide.factory('KpiAggregationUtil', function() {
          return {
            calculateKpis: jasmine.createSpy('calculateKpis').and.returnValue(mockKpis)
          };
        });
      });
    });

    beforeEach(inject(function(_DashboardService_, _CreditCardService_, _KpiAggregationUtil_, _DashboardKpi_, _$q_, _$rootScope_) {
      DashboardService = _DashboardService_;
      CreditCardService = _CreditCardService_;
      KpiAggregationUtil = _KpiAggregationUtil_;
      DashboardKpi = _DashboardKpi_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('service initialization', function() {
      it('should be defined', function() {
        expect(DashboardService).toBeDefined();
      });

      it('should have loadDashboard method', function() {
        expect(DashboardService.loadDashboard).toBeDefined();
        expect(typeof DashboardService.loadDashboard).toBe('function');
      });
    });

    describe('loadDashboard method', function() {
      it('should call CreditCardService.getAllCards', function() {
        DashboardService.loadDashboard();
        expect(CreditCardService.getAllCards).toHaveBeenCalled();
      });

      it('should call KpiAggregationUtil.calculateKpis with cards', function(done) {
        DashboardService.loadDashboard().then(function() {
          expect(KpiAggregationUtil.calculateKpis).toHaveBeenCalledWith(mockCards);
          done();
        });
        $rootScope.$apply();
      });

      it('should return promise', function() {
        var result = DashboardService.loadDashboard();
        expect(result).toBeDefined();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should resolve with kpis and cards', function(done) {
        DashboardService.loadDashboard().then(function(data) {
          expect(data).toBeDefined();
          expect(data.kpis).toBeDefined();
          expect(data.cards).toBeDefined();
          expect(data.cards).toBe(mockCards);
          done();
        });
        $rootScope.$apply();
      });

      it('should wrap kpis in DashboardKpi model', function(done) {
        DashboardService.loadDashboard().then(function(data) {
          expect(data.kpis instanceof DashboardKpi).toBe(true);
          done();
        });
        $rootScope.$apply();
      });

      it('should include all KPI fields in response', function(done) {
        DashboardService.loadDashboard().then(function(data) {
          expect(data.kpis.totalCreditLimit).toBe(25000);
          expect(data.kpis.totalAvailableCredit).toBe(19500);
          expect(data.kpis.totalOutstanding).toBe(5500);
          expect(data.kpis.totalMonthlySpend).toBe(3000);
          expect(data.kpis.cardCount).toBe(2);
          done();
        });
        $rootScope.$apply();
      });

      it('should handle empty card list', function(done) {
        CreditCardService.getAllCards.and.returnValue($q.resolve([]));
        KpiAggregationUtil.calculateKpis.and.returnValue({
          totalCreditLimit: 0,
          totalAvailableCredit: 0,
          totalOutstanding: 0,
          totalMonthlySpend: 0,
          cardCount: 0,
          lastUpdated: new Date()
        });

        DashboardService.loadDashboard().then(function(data) {
          expect(data.cards.length).toBe(0);
          expect(data.kpis.cardCount).toBe(0);
          done();
        });
        $rootScope.$apply();
      });

      it('should reject promise when CreditCardService fails', function(done) {
        var errorMessage = 'Failed to load cards';
        CreditCardService.getAllCards.and.returnValue($q.reject({ message: errorMessage }));

        DashboardService.loadDashboard().catch(function(error) {
          expect(error).toBeDefined();
          expect(error.message).toBe(errorMessage);
          done();
        });
        $rootScope.$apply();
      });

      it('should not call KpiAggregationUtil when CreditCardService fails', function(done) {
        CreditCardService.getAllCards.and.returnValue($q.reject({ message: 'Error' }));

        DashboardService.loadDashboard().catch(function() {
          expect(KpiAggregationUtil.calculateKpis).not.toHaveBeenCalled();
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('integration with dependencies', function() {
      it('should pass cards array to KpiAggregationUtil', function(done) {
        DashboardService.loadDashboard().then(function() {
          var callArgs = KpiAggregationUtil.calculateKpis.calls.argsFor(0);
          expect(callArgs[0]).toBe(mockCards);
          expect(Array.isArray(callArgs[0])).toBe(true);
          done();
        });
        $rootScope.$apply();
      });

      it('should handle single card scenario', function(done) {
        var singleCard = [mockCards[0]];
        CreditCardService.getAllCards.and.returnValue($q.resolve(singleCard));
        KpiAggregationUtil.calculateKpis.and.returnValue({
          totalCreditLimit: 10000,
          totalAvailableCredit: 7500,
          totalOutstanding: 2500,
          totalMonthlySpend: 1200,
          cardCount: 1,
          lastUpdated: new Date()
        });

        DashboardService.loadDashboard().then(function(data) {
          expect(data.cards.length).toBe(1);
          expect(data.kpis.cardCount).toBe(1);
          done();
        });
        $rootScope.$apply();
      });

      it('should handle multiple cards scenario', function(done) {
        var multipleCards = mockCards.concat([
          { id: '3', cardName: 'Amex Blue', creditLimit: 20000, availableCredit: 18000, outstandingAmount: 2000, monthlySpend: 900 }
        ]);
        CreditCardService.getAllCards.and.returnValue($q.resolve(multipleCards));
        KpiAggregationUtil.calculateKpis.and.returnValue({
          totalCreditLimit: 45000,
          totalAvailableCredit: 37500,
          totalOutstanding: 7500,
          totalMonthlySpend: 3900,
          cardCount: 3,
          lastUpdated: new Date()
        });

        DashboardService.loadDashboard().then(function(data) {
          expect(data.cards.length).toBe(3);
          expect(data.kpis.cardCount).toBe(3);
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('error handling', function() {
      it('should propagate network errors', function(done) {
        CreditCardService.getAllCards.and.returnValue($q.reject({ status: 500, message: 'Server error' }));

        DashboardService.loadDashboard().catch(function(error) {
          expect(error.status).toBe(500);
          expect(error.message).toBe('Server error');
          done();
        });
        $rootScope.$apply();
      });

      it('should handle timeout errors', function(done) {
        CreditCardService.getAllCards.and.returnValue($q.reject({ status: 408, message: 'Request timeout' }));

        DashboardService.loadDashboard().catch(function(error) {
          expect(error.status).toBe(408);
          done();
        });
        $rootScope.$apply();
      });

      it('should handle authentication errors', function(done) {
        CreditCardService.getAllCards.and.returnValue($q.reject({ status: 401, message: 'Unauthorized' }));

        DashboardService.loadDashboard().catch(function(error) {
          expect(error.status).toBe(401);
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('edge cases', function() {
      it('should handle null response from CreditCardService', function(done) {
        CreditCardService.getAllCards.and.returnValue($q.resolve(null));
        KpiAggregationUtil.calculateKpis.and.callFake(function(cards) {
          return {
            totalCreditLimit: 0,
            totalAvailableCredit: 0,
            totalOutstanding: 0,
            totalMonthlySpend: 0,
            cardCount: 0,
            lastUpdated: new Date()
          };
        });

        DashboardService.loadDashboard().then(function(data) {
          expect(data.cards).toBeNull();
          done();
        });
        $rootScope.$apply();
      });

      it('should handle multiple simultaneous calls', function() {
        var results = [];
        DashboardService.loadDashboard().then(function(data) {
          results.push(data);
        });
        DashboardService.loadDashboard().then(function(data) {
          results.push(data);
        });
        $rootScope.$apply();
        expect(results.length).toBe(2);
        expect(CreditCardService.getAllCards).toHaveBeenCalledTimes(2);
      });

      it('should maintain data integrity across calls', function(done) {
        DashboardService.loadDashboard().then(function(data1) {
          DashboardService.loadDashboard().then(function(data2) {
            expect(data1.kpis.totalCreditLimit).toBe(data2.kpis.totalCreditLimit);
            expect(data1.cards.length).toBe(data2.cards.length);
            done();
          });
          $rootScope.$apply();
        });
        $rootScope.$apply();
      });
    });
  });
})();

/*
Coverage Report:
- Functions tested: loadDashboard
- Scenarios covered:
  * Successful dashboard data loading
  * CreditCardService integration
  * KpiAggregationUtil integration
  * DashboardKpi model wrapping
  * Empty card list handling
  * Single and multiple card scenarios
  * Error propagation from dependencies
  * Network, timeout, and authentication errors
  * Null response handling
  * Multiple simultaneous calls
  * Data integrity across calls
- Uncovered scenarios: Caching, real-time data updates, partial failure handling
*/