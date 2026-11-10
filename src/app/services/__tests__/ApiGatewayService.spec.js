/*
Test Documentation:
- Test Name: ApiGatewayService - get method success
- Purpose: Validates successful GET request through API gateway
- Scenario: Valid endpoint with successful response
- Expected Result: Returns response data
*/
/*
Test Documentation:
- Test Name: ApiGatewayService - get method error handling
- Purpose: Validates error handling for failed GET requests
- Scenario: GET request fails with error
- Expected Result: Rejects promise with error
*/
/*
Test Documentation:
- Test Name: ApiGatewayService - post method success
- Purpose: Validates successful POST request through API gateway
- Scenario: Valid endpoint with data payload
- Expected Result: Returns response data
*/
/*
Test Documentation:
- Test Name: ApiGatewayService - post method error handling
- Purpose: Validates error handling for failed POST requests
- Scenario: POST request fails with error
- Expected Result: Rejects promise with error
*/
/*
Coverage Report:
- Functions tested: get, post
- Scenarios covered: successful GET, GET error, successful POST, POST error, base URL construction
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('ApiGatewayService', function() {
    var ApiGatewayService, $httpBackend, $q, $rootScope;
    var baseUrl = 'https://api.creditcard.demo';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_ApiGatewayService_, _$httpBackend_, _$q_, _$rootScope_) {
      ApiGatewayService = _ApiGatewayService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('get method', function() {
      it('should make GET request and return data on success', function() {
        var endpoint = '/cards';
        var mockResponse = { cards: [{ id: 'card1' }] };

        $httpBackend.expectGET(baseUrl + endpoint).respond(200, mockResponse);

        var result;
        ApiGatewayService.get(endpoint).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should reject promise on GET request failure', function() {
        var endpoint = '/cards';
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

      it('should construct correct URL with base URL and endpoint', function() {
        var endpoint = '/users/123';
        $httpBackend.expectGET(baseUrl + endpoint).respond(200, {});

        ApiGatewayService.get(endpoint);
        $httpBackend.flush();
      });
    });

    describe('post method', function() {
      it('should make POST request with data and return response on success', function() {
        var endpoint = '/transactions';
        var postData = { amount: 1000, category: 'Food' };
        var mockResponse = { success: true, transactionId: 'txn123' };

        $httpBackend.expectPOST(baseUrl + endpoint, postData).respond(201, mockResponse);

        var result;
        ApiGatewayService.post(endpoint, postData).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should reject promise on POST request failure', function() {
        var endpoint = '/transactions';
        var postData = { amount: 1000 };
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

      it('should handle POST with empty data object', function() {
        var endpoint = '/ping';
        var mockResponse = { status: 'ok' };

        $httpBackend.expectPOST(baseUrl + endpoint, {}).respond(200, mockResponse);

        var result;
        ApiGatewayService.post(endpoint, {}).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should construct correct URL with base URL and endpoint for POST', function() {
        var endpoint = '/auth/login';
        var postData = { username: 'test' };
        $httpBackend.expectPOST(baseUrl + endpoint, postData).respond(200, {});

        ApiGatewayService.post(endpoint, postData);
        $httpBackend.flush();
      });
    });
  });
})();