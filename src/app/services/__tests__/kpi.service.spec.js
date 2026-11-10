/*
Test Documentation:
- Test Name: KPIService - getKPIData returns consolidated KPI metrics
- Purpose: Validates that getKPIData aggregates data from multiple sources
- Scenario: User requests KPI data for dashboard display
- Expected Result: Returns object with monthlySpend, totalCreditLimit, totalOutstanding, availableCredit
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIData uses cache when valid
- Purpose: Validates caching mechanism to reduce API calls
- Scenario: Multiple calls to getKPIData within cache validity period
- Expected Result: Second call returns cached data without calling factories
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIData refreshes cache after expiry
- Purpose: Validates cache expiration and refresh logic
- Scenario: Call getKPIData after cache expiry time (5 seconds)
- Expected Result: Fresh data is fetched from factories and cache is updated
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIData calculates availableCredit correctly
- Purpose: Validates business logic for available credit calculation
- Scenario: Total credit limit minus total outstanding
- Expected Result: availableCredit equals totalCreditLimit - totalOutstanding
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIData handles missing data gracefully
- Purpose: Validates error handling when factories return null/undefined
- Scenario: CreditCardDataFactory or TransactionFactory returns incomplete data
- Expected Result: Returns KPI data with default values (0) for missing fields
*/
/*
Coverage Report:
- Functions tested: getKPIData
- Scenarios covered: normal flow, caching, cache expiry, calculation logic, error handling, missing data
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('KPIService', function() {
    var KPIService, CreditCardDataFactory, TransactionFactory, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KPIService_, _CreditCardDataFactory_, _TransactionFactory_, _$q_, _$rootScope_) {
      KPIService = _KPIService_;
      CreditCardDataFactory = _CreditCardDataFactory_;
      TransactionFactory = _TransactionFactory_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      KPIService.cache = null;
      KPIService.cacheTimestamp = null;
    });

    describe('getKPIData', function() {
      it('should return consolidated KPI data with all required fields', function() {
        var mockCardSummary = {
          totalLimit: 50000,
          totalOutstanding: 12500,
          cardCount: 3
        };
        var mockMonthlySpend = {
          currentMonthSpend: 8500,
          month: 'November 2026',
          year: 2026
        };

        spyOn(CreditCardDataFactory, 'getSummary').and.returnValue($q.resolve(mockCardSummary));
        spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

        var result;
        KPIService.getKPIData().then(function(data) {
          result = data;
        });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result.monthlySpend).toBe(8500);
        expect(result.totalCreditLimit).toBe(50000);
        expect(result.totalOutstanding).toBe(12500);
        expect(result.availableCredit).toBe(37500);
        expect(CreditCardDataFactory.getSummary).toHaveBeenCalled();
        expect(TransactionFactory.getMonthlySpend).toHaveBeenCalled();
      });

      it('should calculate availableCredit as totalCreditLimit minus totalOutstanding', function() {
        var mockCardSummary = {
          totalLimit: 30000,
          totalOutstanding: 10000
        };
        var mockMonthlySpend = {
          currentMonthSpend: 5000
        };

        spyOn(CreditCardDataFactory, 'getSummary').and.returnValue($q.resolve(mockCardSummary));
        spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

        var result;
        KPIService.getKPIData().then(function(data) {
          result = data;
        });

        $rootScope.$apply();

        expect(result.availableCredit).toBe(20000);
      });

      it('should use cached data when cache is valid (within 5 seconds)', function() {
        var mockCardSummary = {
          totalLimit: 50000,
          totalOutstanding: 12500
        };
        var mockMonthlySpend = {
          currentMonthSpend: 8500
        };

        spyOn(CreditCardDataFactory, 'getSummary').and.returnValue($q.resolve(mockCardSummary));
        spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

        var result1, result2;
        KPIService.getKPIData().then(function(data) {
          result1 = data;
        });
        $rootScope.$apply();

        KPIService.getKPIData().then(function(data) {
          result2 = data;
        });
        $rootScope.$apply();

        expect(CreditCardDataFactory.getSummary.calls.count()).toBe(1);
        expect(TransactionFactory.getMonthlySpend.calls.count()).toBe(1);
        expect(result1).toEqual(result2);
      });

      it('should refresh cache after expiry (> 5 seconds)', function() {
        var mockCardSummary = {
          totalLimit: 50000,
          totalOutstanding: 12500
        };
        var mockMonthlySpend = {
          currentMonthSpend: 8500
        };

        spyOn(CreditCardDataFactory, 'getSummary').and.returnValue($q.resolve(mockCardSummary));
        spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

        KPIService.getKPIData();
        $rootScope.$apply();

        KPIService.cacheTimestamp = Date.now() - 6000;

        KPIService.getKPIData();
        $rootScope.$apply();

        expect(CreditCardDataFactory.getSummary.calls.count()).toBe(2);
        expect(TransactionFactory.getMonthlySpend.calls.count()).toBe(2);
      });

      it('should handle missing currentMonthSpend with default value 0', function() {
        var mockCardSummary = {
          totalLimit: 50000,
          totalOutstanding: 12500
        };
        var mockMonthlySpend = {};

        spyOn(CreditCardDataFactory, 'getSummary').and.returnValue($q.resolve(mockCardSummary));
        spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

        var result;
        KPIService.getKPIData().then(function(data) {
          result = data;
        });

        $rootScope.$apply();

        expect(result.monthlySpend).toBe(0);
      });

      it('should handle missing totalLimit with default value 0', function() {
        var mockCardSummary = {
          totalOutstanding: 12500
        };
        var mockMonthlySpend = {
          currentMonthSpend: 8500
        };

        spyOn(CreditCardDataFactory, 'getSummary').and.returnValue($q.resolve(mockCardSummary));
        spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

        var result;
        KPIService.getKPIData().then(function(data) {
          result = data;
        });

        $rootScope.$apply();

        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(-12500);
      });

      it('should handle missing totalOutstanding with default value 0', function() {
        var mockCardSummary = {
          totalLimit: 50000
        };
        var mockMonthlySpend = {
          currentMonthSpend: 8500
        };

        spyOn(CreditCardDataFactory, 'getSummary').and.returnValue($q.resolve(mockCardSummary));
        spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

        var result;
        KPIService.getKPIData().then(function(data) {
          result = data;
        });

        $rootScope.$apply();

        expect(result.totalOutstanding).toBe(0);
        expect(result.availableCredit).toBe(50000);
      });

      it('should handle promise rejection from CreditCardDataFactory', function() {
        spyOn(CreditCardDataFactory, 'getSummary').and.returnValue($q.reject('Error fetching card summary'));
        spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve({ currentMonthSpend: 8500 }));

        var error;
        KPIService.getKPIData().catch(function(err) {
          error = err;
        });

        $rootScope.$apply();

        expect(error).toBeDefined();
      });

      it('should handle promise rejection from TransactionFactory', function() {
        spyOn(CreditCardDataFactory, 'getSummary').and.returnValue($q.resolve({ totalLimit: 50000, totalOutstanding: 12500 }));
        spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.reject('Error fetching monthly spend'));

        var error;
        KPIService.getKPIData().catch(function(err) {
          error = err;
        });

        $rootScope.$apply();

        expect(error).toBeDefined();
      });

      it('should update cache and cacheTimestamp after successful fetch', function() {
        var mockCardSummary = {
          totalLimit: 50000,
          totalOutstanding: 12500
        };
        var mockMonthlySpend = {
          currentMonthSpend: 8500
        };

        spyOn(CreditCardDataFactory, 'getSummary').and.returnValue($q.resolve(mockCardSummary));
        spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

        KPIService.getKPIData();
        $rootScope.$apply();

        expect(KPIService.cache).toBeDefined();
        expect(KPIService.cache.monthlySpend).toBe(8500);
        expect(KPIService.cacheTimestamp).toBeDefined();
        expect(typeof KPIService.cacheTimestamp).toBe('number');
      });
    });
  });
})();