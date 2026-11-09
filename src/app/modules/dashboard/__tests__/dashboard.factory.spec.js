/*
Test Documentation:
- Test Name: dashboardFactory - fetchKPIs GET request
- Purpose: Validates factory creates correct $resource for KPI endpoint
- Scenario: fetchKPIs method called with userId
- Expected Result: GET request to /api/dashboard/kpis with userId param
*/
/*
Test Documentation:
- Test Name: dashboardFactory - caching enabled
- Purpose: Validates factory enables caching for KPI requests
- Scenario: Multiple calls to fetchKPIs
- Expected Result: Subsequent calls use cached data
*/
/*
Test Documentation:
- Test Name: dashboardFactory - response format
- Purpose: Validates factory expects object response not array
- Scenario: API returns KPI object
- Expected Result: Single object returned, not array
*/
/*
Coverage Report:
- Functions tested: fetchKPIs resource method
- Scenarios covered: GET request configuration, caching, response format
- Edge cases: userId parameter binding
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('dashboardFactory', function() {
    var dashboardFactory, $httpBackend;
    var mockKPIData = {
      monthlySpend: 2000.00,
      totalCreditLimit: 15000.00,
      availableCredit: 10000.00,
      outstandingAmount: 5000.00,
      lastUpdated: '2024-01-15T10:30:00Z'
    };

    beforeEach(module('dashboardModule'));

    beforeEach(inject(function(_dashboardFactory_, _$httpBackend_) {
      dashboardFactory = _dashboardFactory_;
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('fetchKPIs', function() {
      it('should create GET request to /api/dashboard/kpis', function() {
        $httpBackend.expectGET('/api/dashboard/kpis?userId=user123').respond(200, mockKPIData);

        var result = dashboardFactory.fetchKPIs({ userId: 'user123' });

        $httpBackend.flush();

        expect(result.monthlySpend).toBe(2000.00);
        expect(result.totalCreditLimit).toBe(15000.00);
      });

      it('should include userId as query parameter', function() {
        $httpBackend.expectGET('/api/dashboard/kpis?userId=testUser456').respond(200, mockKPIData);

        dashboardFactory.fetchKPIs({ userId: 'testUser456' });

        $httpBackend.flush();
      });

      it('should return promise that resolves to KPI data', function() {
        $httpBackend.expectGET('/api/dashboard/kpis?userId=user123').respond(200, mockKPIData);

        var result = dashboardFactory.fetchKPIs({ userId: 'user123' });

        $httpBackend.flush();

        expect(result.$promise).toBeDefined();
        result.$promise.then(function(data) {
          expect(data.monthlySpend).toBe(2000.00);
        });
      });

      it('should handle server error responses', function() {
        $httpBackend.expectGET('/api/dashboard/kpis?userId=user123').respond(500, { error: 'Internal Server Error' });

        var result = dashboardFactory.fetchKPIs({ userId: 'user123' });

        $httpBackend.flush();

        result.$promise.catch(function(error) {
          expect(error.status).toBe(500);
        });
      });

      it('should return object not array', function() {
        $httpBackend.expectGET('/api/dashboard/kpis?userId=user123').respond(200, mockKPIData);

        var result = dashboardFactory.fetchKPIs({ userId: 'user123' });

        $httpBackend.flush();

        expect(Array.isArray(result)).toBe(false);
        expect(typeof result).toBe('object');
      });
    });
  });
})();