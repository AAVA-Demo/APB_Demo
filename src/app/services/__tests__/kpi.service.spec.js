/*
Test Documentation:
- Test Name: KPIService - getConsolidatedKPIs success scenario
- Purpose: Validates that getConsolidatedKPIs retrieves and consolidates KPI data from multiple endpoints
- Scenario: Service called with valid API responses
- Expected Result: Returns consolidated KPI object with all metrics calculated correctly
*/
/*
Test Documentation:
- Test Name: KPIService - utilization percentage calculation
- Purpose: Validates credit utilization percentage is calculated correctly
- Scenario: Outstanding amount and total credit limit provided
- Expected Result: Utilization percentage calculated as (outstanding/limit)*100 with 2 decimal places
*/
/*
Test Documentation:
- Test Name: KPIService - error handling for API failures
- Purpose: Validates error handling when API calls fail
- Scenario: One or both API endpoints return error responses
- Expected Result: Promise rejected with error and error logged to console
*/
/*
Coverage Report:
- Functions tested: getConsolidatedKPIs
- Scenarios covered: successful data retrieval, utilization calculation, zero credit limit, error handling, partial failures
- Edge cases: null values, zero values, missing data fields, API failures
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('KPIService', function() {
    var KPIService, $httpBackend, $rootScope, $q;
    var apiBaseUrl = 'https://api.creditcard.demo';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KPIService_, _$httpBackend_, _$rootScope_, _$q_) {
      KPIService = _KPIService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      $rootScope.apiBaseUrl = apiBaseUrl;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getConsolidatedKPIs', function() {
      it('should retrieve and consolidate KPI data successfully', function() {
        var mockCardSummary = {
          totalCreditLimit: 50000,
          availableCredit: 35000,
          outstandingAmount: 15000
        };

        var mockMonthlySpend = {
          amount: 8500
        };

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/summary')
          .respond(200, mockCardSummary);
        $httpBackend.expectGET(apiBaseUrl + '/api/transactions/monthly-spend')
          .respond(200, mockMonthlySpend);

        var result;
        KPIService.getConsolidatedKPIs().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.monthlySpend).toBe(8500);
        expect(result.totalCreditLimit).toBe(50000);
        expect(result.availableCredit).toBe(35000);
        expect(result.outstandingAmount).toBe(15000);
        expect(result.utilizationPercentage).toBe('30.00');
        expect(result.lastUpdated).toBeDefined();
        expect(result.lastUpdated instanceof Date).toBe(true);
      });

      it('should calculate utilization percentage correctly', function() {
        var mockCardSummary = {
          totalCreditLimit: 100000,
          availableCredit: 25000,
          outstandingAmount: 75000
        };

        var mockMonthlySpend = {
          amount: 5000
        };

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/summary')
          .respond(200, mockCardSummary);
        $httpBackend.expectGET(apiBaseUrl + '/api/transactions/monthly-spend')
          .respond(200, mockMonthlySpend);

        var result;
        KPIService.getConsolidatedKPIs().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.utilizationPercentage).toBe('75.00');
      });

      it('should handle zero credit limit without division error', function() {
        var mockCardSummary = {
          totalCreditLimit: 0,
          availableCredit: 0,
          outstandingAmount: 0
        };

        var mockMonthlySpend = {
          amount: 0
        };

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/summary')
          .respond(200, mockCardSummary);
        $httpBackend.expectGET(apiBaseUrl + '/api/transactions/monthly-spend')
          .respond(200, mockMonthlySpend);

        var result;
        KPIService.getConsolidatedKPIs().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.utilizationPercentage).toBe(0);
        expect(result.totalCreditLimit).toBe(0);
      });

      it('should use default values when API returns null or undefined', function() {
        var mockCardSummary = {
          totalCreditLimit: null,
          availableCredit: undefined,
          outstandingAmount: null
        };

        var mockMonthlySpend = {
          amount: undefined
        };

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/summary')
          .respond(200, mockCardSummary);
        $httpBackend.expectGET(apiBaseUrl + '/api/transactions/monthly-spend')
          .respond(200, mockMonthlySpend);

        var result;
        KPIService.getConsolidatedKPIs().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
      });

      it('should handle card summary API error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/summary')
          .respond(500, { message: 'Internal Server Error' });
        $httpBackend.expectGET(apiBaseUrl + '/api/transactions/monthly-spend')
          .respond(200, { amount: 5000 });

        var error;
        KPIService.getConsolidatedKPIs().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching KPIs:', jasmine.any(Object));
      });

      it('should handle monthly spend API error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/summary')
          .respond(200, { totalCreditLimit: 10000, availableCredit: 5000, outstandingAmount: 5000 });
        $httpBackend.expectGET(apiBaseUrl + '/api/transactions/monthly-spend')
          .respond(500, { message: 'Internal Server Error' });

        var error;
        KPIService.getConsolidatedKPIs().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching KPIs:', jasmine.any(Object));
      });

      it('should handle both API endpoints failing', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/summary')
          .respond(500, { message: 'Error' });
        $httpBackend.expectGET(apiBaseUrl + '/api/transactions/monthly-spend')
          .respond(500, { message: 'Error' });

        var error;
        KPIService.getConsolidatedKPIs().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle network errors', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/summary')
          .respond(-1, null);
        $httpBackend.expectGET(apiBaseUrl + '/api/transactions/monthly-spend')
          .respond(-1, null);

        var error;
        KPIService.getConsolidatedKPIs().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should calculate utilization with high precision', function() {
        var mockCardSummary = {
          totalCreditLimit: 33333,
          availableCredit: 23333,
          outstandingAmount: 10000
        };

        var mockMonthlySpend = {
          amount: 2500
        };

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/summary')
          .respond(200, mockCardSummary);
        $httpBackend.expectGET(apiBaseUrl + '/api/transactions/monthly-spend')
          .respond(200, mockMonthlySpend);

        var result;
        KPIService.getConsolidatedKPIs().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.utilizationPercentage).toBe('30.00');
      });

      it('should handle 100% utilization', function() {
        var mockCardSummary = {
          totalCreditLimit: 25000,
          availableCredit: 0,
          outstandingAmount: 25000
        };

        var mockMonthlySpend = {
          amount: 3000
        };

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/summary')
          .respond(200, mockCardSummary);
        $httpBackend.expectGET(apiBaseUrl + '/api/transactions/monthly-spend')
          .respond(200, mockMonthlySpend);

        var result;
        KPIService.getConsolidatedKPIs().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.utilizationPercentage).toBe('100.00');
      });
    });

    describe('service initialization', function() {
      it('should be defined', function() {
        expect(KPIService).toBeDefined();
      });

      it('should have getConsolidatedKPIs method', function() {
        expect(KPIService.getConsolidatedKPIs).toBeDefined();
        expect(typeof KPIService.getConsolidatedKPIs).toBe('function');
      });
    });
  });
})();