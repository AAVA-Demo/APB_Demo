/*
Test Documentation:
- Test Name: KPIFactory - getKPISummary success
- Purpose: Validates that getKPISummary returns KPI data successfully
- Scenario: API returns KPI summary
- Expected Result: Promise resolves with KPI data
*/
/*
Test Documentation:
- Test Name: KPIFactory - getKPISummary with complete data
- Purpose: Validates all KPI fields are returned correctly
- Scenario: API returns all KPI metrics
- Expected Result: All fields present and correct
*/
/*
Test Documentation:
- Test Name: KPIFactory - getKPISummary error handling
- Purpose: Validates error handling when API fails
- Scenario: API returns error
- Expected Result: Promise rejected with error
*/
/*
Coverage Report:
- Functions tested: getKPISummary
- Scenarios covered: success with complete data, API error, network error, unauthorized
- Uncovered scenarios: none
*/

describe('KPIFactory', function() {
  var KPIFactory, $httpBackend, API_CONFIG;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_KPIFactory_, _$httpBackend_, _API_CONFIG_) {
    KPIFactory = _KPIFactory_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getKPISummary', function() {
    it('should return KPI summary data successfully', function() {
      var mockResponse = {
        monthlySpend: 25000,
        totalCreditLimit: 150000,
        availableCredit: 110000,
        outstandingAmount: 40000
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/dashboard/kpis')
        .respond(200, mockResponse);

      var result;
      KPIFactory.getKPISummary().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.monthlySpend).toBe(25000);
      expect(result.totalCreditLimit).toBe(150000);
      expect(result.availableCredit).toBe(110000);
      expect(result.outstandingAmount).toBe(40000);
    });

    it('should handle zero values in KPI data', function() {
      var mockResponse = {
        monthlySpend: 0,
        totalCreditLimit: 50000,
        availableCredit: 50000,
        outstandingAmount: 0
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/dashboard/kpis')
        .respond(200, mockResponse);

      var result;
      KPIFactory.getKPISummary().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.monthlySpend).toBe(0);
      expect(result.outstandingAmount).toBe(0);
    });

    it('should handle API error and reject promise', function() {
      var errorResponse = {status: 500, statusText: 'Internal Server Error'};

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/dashboard/kpis')
        .respond(500, errorResponse);

      var error;
      KPIFactory.getKPISummary().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle network error', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/dashboard/kpis')
        .respond(-1, null);

      var error;
      KPIFactory.getKPISummary().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    it('should handle unauthorized access', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/dashboard/kpis')
        .respond(401, {error: 'Unauthorized'});

      var error;
      KPIFactory.getKPISummary().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });

    it('should handle service unavailable', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/dashboard/kpis')
        .respond(503, {error: 'Service Unavailable'});

      var error;
      KPIFactory.getKPISummary().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(503);
    });
  });
});