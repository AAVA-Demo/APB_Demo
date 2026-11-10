/*
Test Documentation:
- Test Name: ApiGatewayService - GET request success scenario
- Purpose: Validates that the ApiGatewayService correctly makes GET requests and resolves with response data
- Scenario: Service receives valid endpoint and API returns successful response
- Expected Result: Promise resolves with response.data
*/
/*
Test Documentation:
- Test Name: ApiGatewayService - GET request error scenario
- Purpose: Validates that the ApiGatewayService correctly handles GET request failures
- Scenario: Service receives valid endpoint but API returns error
- Expected Result: Promise rejects with error and logs to console
*/
/*
Test Documentation:
- Test Name: ApiGatewayService - POST request success scenario
- Purpose: Validates that the ApiGatewayService correctly makes POST requests with data and resolves with response data
- Scenario: Service receives valid endpoint and data, API returns successful response
- Expected Result: Promise resolves with response.data
*/
/*
Test Documentation:
- Test Name: ApiGatewayService - POST request error scenario
- Purpose: Validates that the ApiGatewayService correctly handles POST request failures
- Scenario: Service receives valid endpoint and data but API returns error
- Expected Result: Promise rejects with error and logs to console
*/
/*
Test Documentation:
- Test Name: ApiGatewayService - Authorization header injection
- Purpose: Validates that the ApiGatewayService correctly injects Authorization header with bearer token
- Scenario: Service makes request and AuthService provides token
- Expected Result: Request includes Authorization header with Bearer token
*/
/*
Coverage Report:
- Functions tested: get, post
- Scenarios covered: success responses, error handling, authorization header injection, promise resolution/rejection
- Uncovered scenarios: network timeout, malformed responses
*/

describe('ApiGatewayService', function() {
  'use strict';

  var ApiGatewayService;
  var $httpBackend;
  var AuthService;
  var $rootScope;
  var mockToken = 'mock-jwt-token-12345';
  var baseUrl = '/api';

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_ApiGatewayService_, _$httpBackend_, _AuthService_, _$rootScope_) {
    ApiGatewayService = _ApiGatewayService_;
    $httpBackend = _$httpBackend_;
    AuthService = _AuthService_;
    $rootScope = _$rootScope_;
    spyOn(console, 'error');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('get method', function() {
    it('should make GET request and resolve with response data on success', function() {
      var endpoint = '/test-endpoint';
      var mockResponse = {data: 'test data', status: 'success'};
      var result;

      $httpBackend.expectGET(baseUrl + endpoint, function(headers) {
        return headers.Authorization === 'Bearer ' + mockToken;
      }).respond(200, mockResponse);

      ApiGatewayService.get(endpoint).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
    });

    it('should reject promise and log error when GET request fails', function() {
      var endpoint = '/error-endpoint';
      var mockError = {status: 500, statusText: 'Internal Server Error'};
      var errorResult;

      $httpBackend.expectGET(baseUrl + endpoint).respond(500, mockError);

      ApiGatewayService.get(endpoint).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(500);
      expect(console.error).toHaveBeenCalledWith('API Error:', jasmine.any(Object));
    });

    it('should include Authorization header with bearer token in GET request', function() {
      var endpoint = '/secure-endpoint';
      var mockResponse = {secure: 'data'};
      var headerCheck = false;

      $httpBackend.expectGET(baseUrl + endpoint, function(headers) {
        headerCheck = headers.Authorization === 'Bearer ' + mockToken;
        return true;
      }).respond(200, mockResponse);

      ApiGatewayService.get(endpoint);
      $httpBackend.flush();

      expect(headerCheck).toBe(true);
    });
  });

  describe('post method', function() {
    it('should make POST request with data and resolve with response data on success', function() {
      var endpoint = '/create-endpoint';
      var postData = {name: 'test', value: 123};
      var mockResponse = {id: 1, created: true};
      var result;

      $httpBackend.expectPOST(baseUrl + endpoint, postData, function(headers) {
        return headers.Authorization === 'Bearer ' + mockToken;
      }).respond(201, mockResponse);

      ApiGatewayService.post(endpoint, postData).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
    });

    it('should reject promise and log error when POST request fails', function() {
      var endpoint = '/create-error';
      var postData = {invalid: 'data'};
      var mockError = {status: 400, statusText: 'Bad Request'};
      var errorResult;

      $httpBackend.expectPOST(baseUrl + endpoint, postData).respond(400, mockError);

      ApiGatewayService.post(endpoint, postData).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(400);
      expect(console.error).toHaveBeenCalledWith('API Error:', jasmine.any(Object));
    });

    it('should include Authorization header with bearer token in POST request', function() {
      var endpoint = '/secure-create';
      var postData = {secure: 'payload'};
      var mockResponse = {success: true};
      var headerCheck = false;

      $httpBackend.expectPOST(baseUrl + endpoint, postData, function(headers) {
        headerCheck = headers.Authorization === 'Bearer ' + mockToken;
        return true;
      }).respond(201, mockResponse);

      ApiGatewayService.post(endpoint, postData);
      $httpBackend.flush();

      expect(headerCheck).toBe(true);
    });

    it('should send empty object when no data provided to POST', function() {
      var endpoint = '/empty-post';
      var mockResponse = {received: 'empty'};
      var result;

      $httpBackend.expectPOST(baseUrl + endpoint, undefined).respond(200, mockResponse);

      ApiGatewayService.post(endpoint).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling', function() {
    it('should handle network errors gracefully for GET requests', function() {
      var endpoint = '/network-error';
      var errorResult;

      $httpBackend.expectGET(baseUrl + endpoint).respond(-1, '');

      ApiGatewayService.get(endpoint).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle network errors gracefully for POST requests', function() {
      var endpoint = '/network-error';
      var postData = {test: 'data'};
      var errorResult;

      $httpBackend.expectPOST(baseUrl + endpoint, postData).respond(-1, '');

      ApiGatewayService.post(endpoint, postData).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('integration with AuthService', function() {
    it('should retrieve token from AuthService for each request', function() {
      spyOn(AuthService, 'getToken').and.returnValue(mockToken);
      var endpoint = '/auth-test';

      $httpBackend.expectGET(baseUrl + endpoint).respond(200, {});

      ApiGatewayService.get(endpoint);
      $httpBackend.flush();

      expect(AuthService.getToken).toHaveBeenCalled();
    });

    it('should use updated token if AuthService token changes', function() {
      var newToken = 'new-token-67890';
      spyOn(AuthService, 'getToken').and.returnValue(newToken);
      var endpoint = '/token-change';
      var headerCheck = false;

      $httpBackend.expectGET(baseUrl + endpoint, function(headers) {
        headerCheck = headers.Authorization === 'Bearer ' + newToken;
        return true;
      }).respond(200, {});

      ApiGatewayService.get(endpoint);
      $httpBackend.flush();

      expect(headerCheck).toBe(true);
    });
  });
});