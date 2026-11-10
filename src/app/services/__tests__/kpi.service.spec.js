/*
Test Documentation:
- Test Name: KPIService Test Suite
- Purpose: Validate KPI data retrieval, caching mechanism, and available credit calculation
- Scenario: Tests cover successful API calls, cache hit/miss, cache expiration, and fallback to mock data
- Expected Result: Service returns accurate KPIs with proper caching and calculation logic
*/

(function() {
  'use strict';

  describe('KPIService', function() {
    var KPIService, $httpBackend, $q, KPICalculator;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KPIService_, _$httpBackend_, _$q_, _KPICalculator_) {
      KPIService = _KPIService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      KPICalculator = _KPICalculator_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getDashboardKPIs', function() {
      it('should retrieve KPIs from API successfully', function() {
        var userId = 'user-123';
        var mockKPIs = {
          userId: userId,
          monthlySpend: 3000,
          totalCreditLimit: 40000,
          outstandingAmount: 10000,
          lastUpdated: new Date()
        };

        spyOn(KPICalculator, 'calculateAvailableCredit').and.returnValue(30000);

        $httpBackend.expectGET('/api/dashboard/kpis?userId=' + userId).respond(200, mockKPIs);

        var result;
        KPIService.getDashboardKPIs(userId).then(function(kpis) {
          result = kpis;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.userId).toBe(userId);
        expect(result.monthlySpend).toBe(3000);
        expect(result.availableCredit).toBe(30000);
        expect(KPICalculator.calculateAvailableCredit).toHaveBeenCalledWith(40000, 10000);
      });

      it('should return cached data within cache timeout', function() {
        var userId = 'user-456';
        var mockKPIs = {
          userId: userId,
          monthlySpend: 2500,
          totalCreditLimit: 35000,
          outstandingAmount: 8000,
          lastUpdated: new Date()
        };

        spyOn(KPICalculator, 'calculateAvailableCredit').and.returnValue(27000);

        $httpBackend.expectGET('/api/dashboard/kpis?userId=' + userId).respond(200, mockKPIs);

        var result1, result2;
        KPIService.getDashboardKPIs(userId).then(function(kpis) {
          result1 = kpis;
        });

        $httpBackend.flush();

        KPIService.getDashboardKPIs(userId).then(function(kpis) {
          result2 = kpis;
        });

        expect(result1).toBe(result2);
      });

      it('should fallback to mock data when API call fails', function() {
        var userId = 'user-789';

        spyOn(KPICalculator, 'calculateAvailableCredit').and.returnValue(37699.25);

        $httpBackend.expectGET('/api/dashboard/kpis?userId=' + userId).respond(500, 'Server error');

        var result;
        KPIService.getDashboardKPIs(userId).then(function(kpis) {
          result = kpis;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.userId).toBe(userId);
        expect(result.monthlySpend).toBe(4250.50);
        expect(result.totalCreditLimit).toBe(50000);
        expect(result.outstandingAmount).toBe(12300.75);
        expect(result.availableCredit).toBe(37699.25);
      });

      it('should calculate available credit using KPICalculator', function() {
        var userId = 'user-999';
        var mockKPIs = {
          userId: userId,
          monthlySpend: 1500,
          totalCreditLimit: 20000,
          outstandingAmount: 5000,
          lastUpdated: new Date()
        };

        spyOn(KPICalculator, 'calculateAvailableCredit').and.returnValue(15000);

        $httpBackend.expectGET('/api/dashboard/kpis?userId=' + userId).respond(200, mockKPIs);

        var result;
        KPIService.getDashboardKPIs(userId).then(function(kpis) {
          result = kpis;
        });

        $httpBackend.flush();

        expect(KPICalculator.calculateAvailableCredit).toHaveBeenCalledWith(20000, 5000);
        expect(result.availableCredit).toBe(15000);
      });

      it('should handle multiple users with separate cache entries', function() {
        var user1 = 'user-111';
        var user2 = 'user-222';

        var mockKPIs1 = { userId: user1, monthlySpend: 1000, totalCreditLimit: 10000, outstandingAmount: 2000 };
        var mockKPIs2 = { userId: user2, monthlySpend: 2000, totalCreditLimit: 20000, outstandingAmount: 4000 };

        spyOn(KPICalculator, 'calculateAvailableCredit').and.callFake(function(limit, outstanding) {
          return limit - outstanding;
        });

        $httpBackend.expectGET('/api/dashboard/kpis?userId=' + user1).respond(200, mockKPIs1);
        $httpBackend.expectGET('/api/dashboard/kpis?userId=' + user2).respond(200, mockKPIs2);

        var result1, result2;
        KPIService.getDashboardKPIs(user1).then(function(kpis) {
          result1 = kpis;
        });
        KPIService.getDashboardKPIs(user2).then(function(kpis) {
          result2 = kpis;
        });

        $httpBackend.flush();

        expect(result1.userId).toBe(user1);
        expect(result2.userId).toBe(user2);
        expect(result1.availableCredit).toBe(8000);
        expect(result2.availableCredit).toBe(16000);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getDashboardKPIs
- Scenarios covered:
  * Successful API retrieval with available credit calculation
  * Cache hit within timeout period
  * API failure with fallback to mock data
  * KPICalculator integration
  * Multiple user cache separation
- Uncovered scenarios: Cache expiration after timeout, cache invalidation
*/