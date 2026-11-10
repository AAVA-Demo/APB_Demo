/*
Test Documentation:
- Test Name: DataAggregationService - getConsolidatedKPIs success
- Purpose: Validates aggregation of KPIs from multiple cards
- Scenario: User with multiple cards requests consolidated KPIs
- Expected Result: Returns aggregated KPI object with all metrics
*/
/*
Test Documentation:
- Test Name: DataAggregationService - getConsolidatedKPIs integration
- Purpose: Validates integration with CardDataService and KpiCalculationService
- Scenario: Service chain from data retrieval to KPI calculation
- Expected Result: Properly chains promises and returns calculated KPIs
*/
/*
Test Documentation:
- Test Name: DataAggregationService - getConsolidatedKPIs error handling
- Purpose: Validates error propagation from dependencies
- Scenario: CardDataService fails to retrieve cards
- Expected Result: Rejects promise with error
*/
/*
Coverage Report:
- Functions tested: getConsolidatedKPIs
- Scenarios covered: successful aggregation, service integration, error handling, promise chaining
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('DataAggregationService', function() {
    var DataAggregationService, CardDataService, KpiCalculationService, $rootScope, $q, $timeout;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_DataAggregationService_, _CardDataService_, _KpiCalculationService_, _$rootScope_, _$q_, _$timeout_) {
      DataAggregationService = _DataAggregationService_;
      CardDataService = _CardDataService_;
      KpiCalculationService = _KpiCalculationService_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      $timeout = _$timeout_;
    }));

    describe('getConsolidatedKPIs', function() {
      it('should retrieve cards and calculate consolidated KPIs', function() {
        var userId = 'user123';
        var result;

        DataAggregationService.getConsolidatedKPIs(userId).then(function(kpis) {
          result = kpis;
        });

        $timeout.flush();

        expect(result).toBeDefined();
        expect(result.userId).toBe('user123');
        expect(result.monthlySpend).toBeDefined();
        expect(result.totalCreditLimit).toBeDefined();
        expect(result.availableCredit).toBeDefined();
        expect(result.outstandingAmount).toBeDefined();
        expect(result.creditUtilization).toBeDefined();
      });

      it('should call CardDataService.getAllCards with correct userId', function() {
        var userId = 'testUser';
        spyOn(CardDataService, 'getAllCards').and.callThrough();

        DataAggregationService.getConsolidatedKPIs(userId);

        expect(CardDataService.getAllCards).toHaveBeenCalledWith(userId);
      });

      it('should call KpiCalculationService.calculateKPIs with cards', function() {
        var userId = 'user123';
        spyOn(KpiCalculationService, 'calculateKPIs').and.callThrough();

        DataAggregationService.getConsolidatedKPIs(userId);

        $timeout.flush();

        expect(KpiCalculationService.calculateKPIs).toHaveBeenCalled();
        var callArgs = KpiCalculationService.calculateKPIs.calls.argsFor(0)[0];
        expect(Array.isArray(callArgs)).toBe(true);
        expect(callArgs.length).toBe(3);
      });

      it('should return KPIs with correct aggregated values', function() {
        var userId = 'user123';
        var result;

        DataAggregationService.getConsolidatedKPIs(userId).then(function(kpis) {
          result = kpis;
        });

        $timeout.flush();

        expect(result.monthlySpend).toBe(35000);
        expect(result.totalCreditLimit).toBe(150000);
        expect(result.availableCredit).toBe(105000);
        expect(result.outstandingAmount).toBe(45000);
        expect(result.creditUtilization).toBe('30.00');
      });

      it('should handle CardDataService error', function() {
        var userId = 'user123';
        var error;

        spyOn(CardDataService, 'getAllCards').and.returnValue($q.reject('Card retrieval failed'));

        DataAggregationService.getConsolidatedKPIs(userId).catch(function(err) {
          error = err;
        });

        $rootScope.$apply();

        expect(error).toBe('Card retrieval failed');
      });

      it('should return promise', function() {
        var promise = DataAggregationService.getConsolidatedKPIs('user123');
        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');
      });

      it('should chain promises correctly', function() {
        var userId = 'user123';
        var getAllCardsCalled = false;
        var calculateKPIsCalled = false;

        spyOn(CardDataService, 'getAllCards').and.callFake(function() {
          getAllCardsCalled = true;
          return $q.resolve([{ cardId: 'card1', monthlySpend: 1000, creditLimit: 5000, availableCredit: 3000, outstandingBalance: 2000 }]);
        });

        spyOn(KpiCalculationService, 'calculateKPIs').and.callFake(function(cards) {
          calculateKPIsCalled = true;
          return { monthlySpend: 1000 };
        });

        DataAggregationService.getConsolidatedKPIs(userId);

        $rootScope.$apply();

        expect(getAllCardsCalled).toBe(true);
        expect(calculateKPIsCalled).toBe(true);
      });
    });
  });
})();