/*
Test Documentation:
- Test Name: KPIService - getKPIs with cache hit
- Purpose: Validates cache retrieval for KPI data
- Scenario: KPI data exists in cache
- Expected Result: Returns cached data without API call
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIs with cache miss
- Purpose: Validates KPI calculation when cache is empty
- Scenario: No cached data available
- Expected Result: Fetches cards, calculates KPIs, and caches result
*/
/*
Test Documentation:
- Test Name: KPIService - calculateKPIs
- Purpose: Validates KPI calculation logic
- Scenario: Multiple cards with different balances and limits
- Expected Result: Correct aggregation of all KPI metrics
*/
/*
Coverage Report:
- Functions tested: getKPIs, calculateKPIs
- Scenarios covered: cache hit/miss, KPI calculation, data aggregation, caching behavior
- Uncovered scenarios: cache expiration, concurrent requests
*/

(function() {
  'use strict';

  describe('KPIService', function() {
    var KPIService, CreditCardService, CacheFactory, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KPIService_, _CreditCardService_, _CacheFactory_, _$q_, _$rootScope_) {
      KPIService = _KPIService_;
      CreditCardService = _CreditCardService_;
      CacheFactory = _CacheFactory_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getKPIs', function() {
      it('should return cached KPIs if available', function() {
        var userId = 'user123';
        var cachedKPIs = {
          monthlySpend: 1000,
          totalCreditLimit: 10000,
          availableCredit: 8000,
          outstandingAmount: 2000
        };

        spyOn(CacheFactory, 'get').and.returnValue(cachedKPIs);
        spyOn(CreditCardService, 'getAllCards');

        var result;
        KPIService.getKPIs(userId).then(function(data) {
          result = data;
        });

        $rootScope.$apply();

        expect(result).toEqual(cachedKPIs);
        expect(CacheFactory.get).toHaveBeenCalledWith('kpi_user123');
        expect(CreditCardService.getAllCards).not.toHaveBeenCalled();
      });

      it('should fetch and calculate KPIs when cache is empty', function() {
        var userId = 'user123';
        var mockCards = [
          { cardId: 'c1', balance: 1000, creditLimit: 5000, availableCredit: 4000, monthlySpend: 500 },
          { cardId: 'c2', balance: 1500, creditLimit: 8000, availableCredit: 6500, monthlySpend: 700 }
        ];

        spyOn(CacheFactory, 'get').and.returnValue(null);
        spyOn(CacheFactory, 'put');
        spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));

        var result;
        KPIService.getKPIs(userId).then(function(data) {
          result = data;
        });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result.monthlySpend).toBe(1200);
        expect(result.totalCreditLimit).toBe(13000);
        expect(result.availableCredit).toBe(10500);
        expect(result.outstandingAmount).toBe(2500);
        expect(result.userId).toBe(userId);
        expect(result.lastUpdated).toBeDefined();
        expect(result.cards).toEqual(mockCards);
        expect(CacheFactory.put).toHaveBeenCalledWith('kpi_user123', result);
      });

      it('should handle error when fetching cards', function() {
        var userId = 'user123';

        spyOn(CacheFactory, 'get').and.returnValue(null);
        spyOn(CreditCardService, 'getAllCards').and.returnValue($q.reject('API Error'));

        var error;
        KPIService.getKPIs(userId).catch(function(err) {
          error = err;
        });

        $rootScope.$apply();

        expect(error).toBe('API Error');
      });
    });

    describe('calculateKPIs', function() {
      it('should calculate KPIs correctly for multiple cards', function() {
        var cards = [
          { cardId: 'c1', balance: 1000, creditLimit: 5000, availableCredit: 4000, monthlySpend: 500 },
          { cardId: 'c2', balance: 1500, creditLimit: 8000, availableCredit: 6500, monthlySpend: 700 },
          { cardId: 'c3', balance: 500, creditLimit: 3000, availableCredit: 2500, monthlySpend: 200 }
        ];

        var result = KPIService.calculateKPIs(cards);

        expect(result.monthlySpend).toBe(1400);
        expect(result.totalCreditLimit).toBe(16000);
        expect(result.availableCredit).toBe(13000);
        expect(result.outstandingAmount).toBe(3000);
      });

      it('should handle cards with missing values', function() {
        var cards = [
          { cardId: 'c1', balance: 1000, creditLimit: 5000 },
          { cardId: 'c2' }
        ];

        var result = KPIService.calculateKPIs(cards);

        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(5000);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(1000);
      });

      it('should return zero values for empty cards array', function() {
        var cards = [];

        var result = KPIService.calculateKPIs(cards);

        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
      });

      it('should handle cards with zero values', function() {
        var cards = [
          { cardId: 'c1', balance: 0, creditLimit: 0, availableCredit: 0, monthlySpend: 0 }
        ];

        var result = KPIService.calculateKPIs(cards);

        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
      });
    });
  });
})();