/*
Test Documentation:
- Test Name: ApiService Unit Tests
- Purpose: Validate ApiService GET and POST methods, error handling, and HTTP integration
- Scenario: Tests cover successful API calls, error responses, parameter handling, and base URL configuration
- Expected Result: All API methods should correctly interact with $http service and handle responses/errors appropriately
*/

(function() {
  'use strict';

  describe('ApiService', function() {
    var ApiService, $httpBackend, $q, BASE_URL;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_ApiService_, _$httpBackend_, _$q_) {
      ApiService = _ApiService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      BASE_URL = '/api';
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('get method', function() {
      it('should make GET request to correct endpoint', function() {
        var endpoint = '/cards';
        var mockResponse = { data: [{ id: 1 }] };

        $httpBackend.expectGET(BASE_URL + endpoint).respond(200, mockResponse);

        var result;
        ApiService.get(endpoint).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
      });

      it('should include query parameters in GET request', function() {
        var endpoint = '/transactions';
        var params = { userId: 'user123', limit: 10 };
        var mockResponse = { transactions: [] };

        $httpBackend.expectGET(BASE_URL + endpoint + '?limit=10&userId=user123').respond(200, mockResponse);

        var result;
        ApiService.get(endpoint, params).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
      });

      it('should handle GET request errors', function() {
        var endpoint = '/cards';
        var errorResponse = { status: 500, statusText: 'Internal Server Error' };

        $httpBackend.expectGET(BASE_URL + endpoint).respond(500, errorResponse);

        var error;
        ApiService.get(endpoint).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle 404 errors gracefully', function() {
        var endpoint = '/nonexistent';

        $httpBackend.expectGET(BASE_URL + endpoint).respond(404, 'Not Found');

        var errorCaught = false;
        ApiService.get(endpoint).catch(function() {
          errorCaught = true;
        });

        $httpBackend.flush();
        expect(errorCaught).toBe(true);
      });
    });

    describe('post method', function() {
      it('should make POST request with data', function() {
        var endpoint = '/cards';
        var postData = { cardNumber: '1234', userId: 'user123' };
        var mockResponse = { success: true, cardId: 'card1' };

        $httpBackend.expectPOST(BASE_URL + endpoint, postData).respond(201, mockResponse);

        var result;
        ApiService.post(endpoint, postData).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
      });

      it('should handle POST request with empty data', function() {
        var endpoint = '/refresh';
        var mockResponse = { status: 'refreshed' };

        $httpBackend.expectPOST(BASE_URL + endpoint, {}).respond(200, mockResponse);

        var result;
        ApiService.post(endpoint, {}).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
      });

      it('should handle POST request errors', function() {
        var endpoint = '/cards';
        var postData = { invalid: 'data' };
        var errorResponse = { error: 'Validation failed' };

        $httpBackend.expectPOST(BASE_URL + endpoint, postData).respond(400, errorResponse);

        var error;
        ApiService.post(endpoint, postData).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error).toBeDefined();
        expect(error.status).toBe(400);
      });

      it('should handle network errors', function() {
        var endpoint = '/cards';
        var postData = { cardNumber: '1234' };

        $httpBackend.expectPOST(BASE_URL + endpoint, postData).respond(0, '');

        var errorCaught = false;
        ApiService.post(endpoint, postData).catch(function() {
          errorCaught = true;
        });

        $httpBackend.flush();
        expect(errorCaught).toBe(true);
      });
    });

    describe('error handling', function() {
      it('should reject promise on GET error', function() {
        var endpoint = '/error';
        $httpBackend.expectGET(BASE_URL + endpoint).respond(500, 'Server Error');

        var rejected = false;
        ApiService.get(endpoint).catch(function() {
          rejected = true;
        });

        $httpBackend.flush();
        expect(rejected).toBe(true);
      });

      it('should reject promise on POST error', function() {
        var endpoint = '/error';
        $httpBackend.expectPOST(BASE_URL + endpoint).respond(500, 'Server Error');

        var rejected = false;
        ApiService.post(endpoint, {}).catch(function() {
          rejected = true;
        });

        $httpBackend.flush();
        expect(rejected).toBe(true);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: get, post, handleError
- Scenarios covered:
  * Successful GET requests with and without parameters
  * Successful POST requests with data
  * Error handling for 400, 404, 500, and network errors
  * Query parameter serialization
  * Response data extraction
  * Promise rejection on errors
- Uncovered scenarios:
  * PUT/DELETE methods (not implemented in service)
  * Request timeout handling
  * Request cancellation
  * Custom headers beyond authentication
*/