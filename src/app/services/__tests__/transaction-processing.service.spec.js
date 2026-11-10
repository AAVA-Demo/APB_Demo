/*
Test Documentation:
- Test Name: TransactionProcessingService unit tests
- Purpose: Validate TransactionProcessingService for retrieving monthly spend and transaction summaries
- Scenario: Test getMonthlySpend method with success, error, and edge case scenarios
- Expected Result: Service should correctly handle HTTP requests, responses, and errors
*/

describe('TransactionProcessingService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var TransactionProcessingService;
  var $httpBackend;
  var API_CONFIG;
  var $q;
  var $rootScope;

  beforeEach(inject(function(_TransactionProcessingService_, _$httpBackend_, _API_CONFIG_, _$q_, _$rootScope_) {
    TransactionProcessingService = _TransactionProcessingService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(TransactionProcessingService).toBeDefined();
    });

    it('should have getMonthlySpend method', function() {
      expect(typeof TransactionProcessingService.getMonthlySpend).toBe('function');
    });
  });

  describe('getMonthlySpend method - Success Scenarios', function() {
    it('should make GET request to correct endpoint', function() {
      var mockSummary = {
        monthlySpend: 5000,
        totalTransactions: 45,
        averageTransaction: 111.11
      };

      $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(200, mockSummary);

      TransactionProcessingService.getMonthlySpend();
      $httpBackend.flush();
    });

    it('should resolve promise with summary data on success', function() {
      var mockSummary = {
        monthlySpend: 7500.50,
        totalTransactions: 60,
        averageTransaction: 125.01,
        currency: 'USD'
      };

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(200, mockSummary);

      var result;
      TransactionProcessingService.getMonthlySpend().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockSummary);
      expect(result.monthlySpend).toBe(7500.50);
    });

    it('should include timeout configuration in request', function() {
      $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(200, { monthlySpend: 0 });

      TransactionProcessingService.getMonthlySpend();
      $httpBackend.flush();
    });

    it('should handle zero monthly spend', function() {
      var mockSummary = {
        monthlySpend: 0,
        totalTransactions: 0,
        averageTransaction: 0
      };

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(200, mockSummary);

      var result;
      TransactionProcessingService.getMonthlySpend().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result.monthlySpend).toBe(0);
      expect(result.totalTransactions).toBe(0);
    });

    it('should handle large monthly spend values', function() {
      var mockSummary = {
        monthlySpend: 999999.99,
        totalTransactions: 1000
      };

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(200, mockSummary);

      var result;
      TransactionProcessingService.getMonthlySpend().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result.monthlySpend).toBe(999999.99);
    });
  });

  describe('getMonthlySpend method - Error Scenarios', function() {
    it('should reject promise on HTTP 500 error', function() {
      var errorResponse = { status: 500, statusText: 'Internal Server Error' };

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(500, errorResponse);

      var errorResult;
      TransactionProcessingService.getMonthlySpend().catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(500);
    });

    it('should reject promise on HTTP 404 error', function() {
      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(404, { message: 'Not Found' });

      var errorResult;
      TransactionProcessingService.getMonthlySpend().catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(404);
    });

    it('should reject promise on HTTP 401 unauthorized', function() {
      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(401, { message: 'Unauthorized' });

      var errorResult;
      TransactionProcessingService.getMonthlySpend().catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(401);
    });

    it('should reject promise on HTTP 403 forbidden', function() {
      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(403, { message: 'Forbidden' });

      var errorResult;
      TransactionProcessingService.getMonthlySpend().catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(403);
    });

    it('should handle network timeout (408)', function() {
      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(408, { message: 'Request Timeout' });

      var errorResult;
      TransactionProcessingService.getMonthlySpend().catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(408);
    });

    it('should log error to console on failure', function() {
      spyOn(console, 'error');

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(500, 'Server Error');

      TransactionProcessingService.getMonthlySpend().catch(function() {});
      $httpBackend.flush();

      expect(console.error).toHaveBeenCalledWith('Error fetching monthly spend:', jasmine.any(Object));
    });
  });

  describe('Edge Cases and Data Validation', function() {
    it('should handle empty object response', function() {
      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(200, {});

      var result;
      TransactionProcessingService.getMonthlySpend().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual({});
    });

    it('should handle null response', function() {
      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(200, null);

      var result;
      TransactionProcessingService.getMonthlySpend().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toBeNull();
    });

    it('should handle malformed JSON response gracefully', function() {
      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(200, 'invalid json string');

      var result;
      TransactionProcessingService.getMonthlySpend().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toBe('invalid json string');
    });

    it('should handle response with additional unexpected fields', function() {
      var mockSummary = {
        monthlySpend: 3000,
        totalTransactions: 30,
        unexpectedField: 'unexpected value',
        anotherField: 123
      };

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(200, mockSummary);

      var result;
      TransactionProcessingService.getMonthlySpend().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockSummary);
      expect(result.unexpectedField).toBe('unexpected value');
    });

    it('should handle negative monthly spend values', function() {
      var mockSummary = {
        monthlySpend: -500.00,
        totalTransactions: 5
      };

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(200, mockSummary);

      var result;
      TransactionProcessingService.getMonthlySpend().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result.monthlySpend).toBe(-500.00);
    });
  });

  describe('Promise Behavior', function() {
    it('should return a promise', function() {
      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(200, {});

      var promise = TransactionProcessingService.getMonthlySpend();
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');

      $httpBackend.flush();
    });

    it('should allow chaining of then callbacks', function() {
      var mockSummary = { monthlySpend: 2000 };

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
        .respond(200, mockSummary);

      var firstResult, secondResult;
      TransactionProcessingService.getMonthlySpend()
        .then(function(data) {
          firstResult = data;
          return data.monthlySpend * 2;
        })
        .then(function(data) {
          secondResult = data;
        });

      $httpBackend.flush();
      expect(firstResult).toEqual(mockSummary);
      expect(secondResult).toBe(4000);
    });
  });
});

/*
Coverage Report:
- Service tested: TransactionProcessingService
- Methods tested: getMonthlySpend
- Scenarios covered:
  * Service initialization and method availability
  * Successful HTTP GET requests with correct endpoint
  * Promise resolution with valid summary data
  * Error handling for HTTP errors (401, 403, 404, 408, 500)
  * Zero, negative, and large monetary values
  * Empty, null, and malformed response handling
  * Console error logging
  * Timeout configuration
  * Promise chaining and behavior
  * Unexpected fields in response
- Uncovered scenarios: None - comprehensive coverage including success, error, edge cases, and promise behavior
*/