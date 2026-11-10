/*
Test Documentation:
- Test Name: ApiGatewayService Test Suite
- Purpose: Validate API Gateway service functionality for HTTP operations
- Scenario: Tests GET and POST methods with authentication, error handling, and promise resolution
- Expected Result: All API calls should properly handle authentication headers, resolve/reject promises correctly
*/

(function() {
  'use strict';

  describe('ApiGatewayService', function() {
    var ApiGatewayService, $httpBackend, $window;
    var baseUrl = '/api';
    var mockToken = 'mock-token-12345';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_ApiGatewayService_, _$httpBackend_, _$window_) {
      ApiGatewayService = _ApiGatewayService_;
      $httpBackend = _$httpBackend_;
      $window = _$window_;
      $window.localStorage.setItem('authToken', mockToken);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $window.localStorage.clear();
    });

    describe('get method', function() {
      it('should make GET request with authorization header', function() {
        var endpoint = '/test-endpoint';
        var mockResponse = { data: 'test data' };

        $httpBackend.expectGET(baseUrl + endpoint, function(headers) {
          return headers['Authorization'] === 'Bearer ' + mockToken;
        }).respond(200, mockResponse);

        var result;
        ApiGatewayService.get(endpoint).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
      });

      it('should handle GET request errors and reject promise', function() {
        var endpoint = '/error-endpoint';
        var errorResponse = { error: 'Not Found' };

        $httpBackend.expectGET(baseUrl + endpoint).respond(404, errorResponse);

        var error;
        ApiGatewayService.get(endpoint).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error).toBeDefined();
        expect(error.status).toBe(404);
      });

      it('should retrieve token from localStorage', function() {
        var endpoint = '/test';
        spyOn($window.localStorage, 'getItem').and.returnValue(mockToken);

        $httpBackend.expectGET(baseUrl + endpoint).respond(200, {});
        ApiGatewayService.get(endpoint);
        $httpBackend.flush();

        expect($window.localStorage.getItem).toHaveBeenCalledWith('authToken');
      });
    });

    describe('post method', function() {
      it('should make POST request with authorization header and data', function() {
        var endpoint = '/create-endpoint';
        var postData = { name: 'test', value: 123 };
        var mockResponse = { id: 1, success: true };

        $httpBackend.expectPOST(baseUrl + endpoint, postData, function(headers) {
          return headers['Authorization'] === 'Bearer ' + mockToken;
        }).respond(201, mockResponse);

        var result;
        ApiGatewayService.post(endpoint, postData).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
      });

      it('should handle POST request errors and reject promise', function() {
        var endpoint = '/error-post';
        var postData = { invalid: 'data' };
        var errorResponse = { error: 'Bad Request' };

        $httpBackend.expectPOST(baseUrl + endpoint, postData).respond(400, errorResponse);

        var error;
        ApiGatewayService.post(endpoint, postData).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error).toBeDefined();
        expect(error.status).toBe(400);
      });

      it('should retrieve token from localStorage for POST', function() {
        var endpoint = '/test-post';
        var postData = { test: 'data' };
        spyOn($window.localStorage, 'getItem').and.returnValue(mockToken);

        $httpBackend.expectPOST(baseUrl + endpoint, postData).respond(200, {});
        ApiGatewayService.post(endpoint, postData);
        $httpBackend.flush();

        expect($window.localStorage.getItem).toHaveBeenCalledWith('authToken');
      });
    });

    describe('error handling', function() {
      it('should log errors to console on GET failure', function() {
        spyOn(console, 'error');
        var endpoint = '/fail-endpoint';

        $httpBackend.expectGET(baseUrl + endpoint).respond(500, 'Server Error');
        ApiGatewayService.get(endpoint).catch(function() {});
        $httpBackend.flush();

        expect(console.error).toHaveBeenCalledWith('API Error:', jasmine.any(Object));
      });

      it('should log errors to console on POST failure', function() {
        spyOn(console, 'error');
        var endpoint = '/fail-post';
        var postData = { test: 'fail' };

        $httpBackend.expectPOST(baseUrl + endpoint, postData).respond(500, 'Server Error');
        ApiGatewayService.post(endpoint, postData).catch(function() {});
        $httpBackend.flush();

        expect(console.error).toHaveBeenCalledWith('API Error:', jasmine.any(Object));
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: get(), post()
- Scenarios covered:
  * Successful GET request with authentication
  * Successful POST request with authentication and data
  * Error handling for GET requests (404)
  * Error handling for POST requests (400)
  * Token retrieval from localStorage
  * Console error logging on failures
  * Promise resolution and rejection
- Uncovered scenarios: Network timeout, token refresh, concurrent requests
*/