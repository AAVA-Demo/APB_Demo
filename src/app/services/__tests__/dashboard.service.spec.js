/*
Test Documentation:
- Test Name: DashboardService - getKPIs method
- Purpose: Validates KPI aggregation from credit card data
- Scenario: Retrieves cards and aggregates KPIs via KPIAggregator
- Expected Result: Returns promise with aggregated KPI data
*/

(function() {
  'use strict';

  describe('DashboardService', function() {
    var DashboardService, CreditCardApiService, KPIAggregator, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_DashboardService_, _CreditCardApiService_, _KPIAggregator_, _$q_, _$rootScope_) {
      DashboardService = _DashboardService_;
      CreditCardApiService = _CreditCardApiService_;
      KPIAggregator = _KPIAggregator_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getKPIs method', function() {
      it('should call CreditCardApiService.getAllCards', function() {
        spyOn(CreditCardApiService, 'getAllCards').and.returnValue($q.resolve([]));
        spyOn(KPIAggregator, 'aggregate').and.returnValue({});
        DashboardService.getKPIs();
        expect(CreditCardApiService.getAllCards).toHaveBeenCalled();
      });

      it('should call KPIAggregator.aggregate with cards', function(done) {
        var mockCards = [
          {cardId: 'CC001', creditLimit: 50000, outstandingAmount: 12500, availableCredit: 37500, monthlySpend: 8200}
        ];
        spyOn(CreditCardApiService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        spyOn(KPIAggregator, 'aggregate').and.callThrough();
        DashboardService.getKPIs().then(function() {
          expect(KPIAggregator.aggregate).toHaveBeenCalledWith(mockCards);
          done();
        });
        $rootScope.$apply();
      });

      it('should return a promise', function() {
        spyOn(CreditCardApiService, 'getAllCards').and.returnValue($q.resolve([]));
        var result = DashboardService.getKPIs();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should resolve with aggregated KPI data', function(done) {
        var mockCards = [
          {cardId: 'CC001', creditLimit: 50000, outstandingAmount: 12500, availableCredit: 37500, monthlySpend: 8200}
        ];
        var mockKPIs = {
          totalCreditLimit: 50000,
          totalOutstanding: 12500,
          totalAvailableCredit: 37500,
          totalMonthlySpend: 8200,
          cards: mockCards
        };
        spyOn(CreditCardApiService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        spyOn(KPIAggregator, 'aggregate').and.returnValue(mockKPIs);
        DashboardService.getKPIs().then(function(kpis) {
          expect(kpis).toEqual(mockKPIs);
          expect(kpis.totalCreditLimit).toBe(50000);
          expect(kpis.totalMonthlySpend).toBe(8200);
          done();
        });
        $rootScope.$apply();
      });

      it('should handle multiple cards', function(done) {
        var mockCards = [
          {cardId: 'CC001', creditLimit: 50000, outstandingAmount: 12500, availableCredit: 37500, monthlySpend: 8200},
          {cardId: 'CC002', creditLimit: 30000, outstandingAmount: 5000, availableCredit: 25000, monthlySpend: 4500}
        ];
        spyOn(CreditCardApiService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        spyOn(KPIAggregator, 'aggregate').and.callThrough();
        DashboardService.getKPIs().then(function(kpis) {
          expect(kpis.cards.length).toBe(2);
          done();
        });
        $rootScope.$apply();
      });

      it('should handle empty card array', function(done) {
        spyOn(CreditCardApiService, 'getAllCards').and.returnValue($q.resolve([]));
        spyOn(KPIAggregator, 'aggregate').and.callThrough();
        DashboardService.getKPIs().then(function(kpis) {
          expect(kpis.totalCreditLimit).toBe(0);
          expect(kpis.totalMonthlySpend).toBe(0);
          done();
        });
        $rootScope.$apply();
      });

      it('should propagate errors from CreditCardApiService', function(done) {
        spyOn(CreditCardApiService, 'getAllCards').and.returnValue($q.reject('API Error'));
        DashboardService.getKPIs().catch(function(error) {
          expect(error).toBe('API Error');
          done();
        });
        $rootScope.$apply();
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered:
  * CreditCardApiService.getAllCards invocation
  * KPIAggregator.aggregate invocation with correct parameters
  * Promise return validation
  * Aggregated KPI data structure
  * Multiple cards handling
  * Empty card array handling
  * Error propagation from API service
- Edge cases: Empty arrays, API errors, multiple cards
- Uncovered scenarios: None (comprehensive integration testing)
*/