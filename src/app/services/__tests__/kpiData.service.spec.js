/*
Test Documentation:
- Test Name: KpiDataService Test Suite
- Purpose: Validate KPI metrics retrieval functionality
- Scenario: Tests KPI data fetching via API with fallback to mock data on errors
- Expected Result: Service should retrieve KPI metrics or return mock data on failure
*/

(function() {
  'use strict';

  describe('KpiDataService', function() {
    var KpiDataService, ApiGatewayService, $rootScope, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KpiDataService_, _ApiGatewayService_, _$rootScope_, _$q_) {
      KpiDataService = _KpiDataService_;
      ApiGatewayService = _ApiGatewayService_;
      $rootScope = _$rootScope_;
      $q = _$q_;
    }));

    describe('getKpiMetrics', function() {
      it('should call ApiGatewayService.get with correct endpoint', function() {
        var userId = 'user-123';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        KpiDataService.getKpiMetrics(userId);

        expect(ApiGatewayService.get).toHaveBeenCalledWith('/kpi/metrics?userId=' + userId);
      });

      it('should return API data when request succeeds', function() {
        var userId = 'user-456';
        var apiResponse = {
          userId: userId,
          monthlySpend: 15000.50,
          totalCreditLimit: 75000.00,
          availableCredit: 55000.50,
          outstandingAmount: 19999.50,
          lastUpdated: new Date('2026-01-15')
        };

        spyOn(ApiGatewayService, 'get').and.returnValue($q.resolve(apiResponse));

        var result;
        KpiDataService.getKpiMetrics(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toEqual(apiResponse);
      });

      it('should return mock data when API request fails', function() {
        var userId = 'user-789';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject({ status: 404 }));

        var result;
        KpiDataService.getKpiMetrics(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.userId).toBe(userId);
        expect(result.monthlySpend).toBe(12450.75);
        expect(result.totalCreditLimit).toBe(50000.00);
        expect(result.availableCredit).toBe(35549.25);
        expect(result.outstandingAmount).toBe(14450.75);
      });

      it('should include all required KPI fields in mock data', function() {
        var userId = 'user-mock';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        KpiDataService.getKpiMetrics(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.userId).toBeDefined();
        expect(result.monthlySpend).toBeDefined();
        expect(result.totalCreditLimit).toBeDefined();
        expect(result.availableCredit).toBeDefined();
        expect(result.outstandingAmount).toBeDefined();
        expect(result.lastUpdated).toBeDefined();
      });

      it('should set lastUpdated to current date in mock data', function() {
        var userId = 'user-date';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));
        var beforeTime = new Date();

        var result;
        KpiDataService.getKpiMetrics(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        var afterTime = new Date();
        expect(result.lastUpdated).toBeDefined();
        expect(result.lastUpdated.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
        expect(result.lastUpdated.getTime()).toBeLessThanOrEqual(afterTime.getTime());
      });

      it('should return promise', function() {
        var userId = 'user-promise';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var promise = KpiDataService.getKpiMetrics(userId);
        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');
      });

      it('should handle network errors gracefully', function() {
        var userId = 'user-network-error';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject({ status: 500, message: 'Server Error' }));

        var result;
        KpiDataService.getKpiMetrics(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.userId).toBe(userId);
      });

      it('should handle timeout errors', function() {
        var userId = 'user-timeout';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject({ status: -1, message: 'Timeout' }));

        var result;
        KpiDataService.getKpiMetrics(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.userId).toBe(userId);
      });

      it('should preserve userId in mock data', function() {
        var userId = 'user-preserve-123';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        KpiDataService.getKpiMetrics(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.userId).toBe(userId);
      });
    });

    describe('data validation', function() {
      it('should have numeric values for financial metrics in mock data', function() {
        var userId = 'user-numeric';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        KpiDataService.getKpiMetrics(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(typeof result.monthlySpend).toBe('number');
        expect(typeof result.totalCreditLimit).toBe('number');
        expect(typeof result.availableCredit).toBe('number');
        expect(typeof result.outstandingAmount).toBe('number');
      });

      it('should have Date object for lastUpdated in mock data', function() {
        var userId = 'user-date-type';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        KpiDataService.getKpiMetrics(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.lastUpdated instanceof Date).toBe(true);
      });

      it('should have positive values for credit metrics in mock data', function() {
        var userId = 'user-positive';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        KpiDataService.getKpiMetrics(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.monthlySpend).toBeGreaterThan(0);
        expect(result.totalCreditLimit).toBeGreaterThan(0);
        expect(result.availableCredit).toBeGreaterThan(0);
        expect(result.outstandingAmount).toBeGreaterThan(0);
      });
    });

    describe('integration scenarios', function() {
      it('should work with different user IDs', function() {
        var userIds = ['user-1', 'user-2', 'user-3'];
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        userIds.forEach(function(userId) {
          var result;
          KpiDataService.getKpiMetrics(userId).then(function(data) {
            result = data;
          });
          $rootScope.$digest();

          expect(result.userId).toBe(userId);
        });
      });

      it('should handle empty userId', function() {
        var userId = '';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        KpiDataService.getKpiMetrics(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.userId).toBe('');
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getKpiMetrics()
- Scenarios covered:
  * API Gateway service invocation
  * Successful API response handling
  * API failure with mock data fallback
  * All required KPI fields in mock data
  * Current date for lastUpdated
  * Promise return validation
  * Network error handling
  * Timeout error handling
  * UserId preservation in mock data
  * Numeric values validation
  * Date object validation
  * Positive values validation
  * Multiple user IDs
  * Empty user ID handling
- Uncovered scenarios: Real-time KPI updates, historical KPI trends, KPI aggregation across time periods
*/