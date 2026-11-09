/*
Test Documentation:
- Test Name: ApiService - GET request success
- Purpose: Validates that GET requests are properly constructed and return data
- Scenario: Service makes a successful GET request to an endpoint
- Expected Result: Promise resolves with response data
*/
/*
Test Documentation:
- Test Name: ApiService - POST request success
- Purpose: Validates that POST requests are properly constructed and send data
- Scenario: Service makes a successful POST request with payload
- Expected Result: Promise resolves with response data
*/
/*
Test Documentation:
- Test Name: ApiService - Error handling
- Purpose: Validates that API errors are properly handled and rejected
- Scenario: Service receives error response from backend
- Expected Result: Promise rejects with error object
*/
/*
Coverage Report:
- Functions tested: get, post, handleError
- Scenarios covered: successful GET, successful POST, error handling, endpoint construction, parameter passing
- Uncovered scenarios: network timeout, retry logic
*/

describe('ApiService', function() {
  'use strict';
  
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
    it('should make GET request to correct endpoint and return data', function() {
      var endpoint = '/cards';
      var params = { userId: 'user-001' };
      var mockResponse = { cards: [{ id: 'card-001' }] };
      
      $httpBackend.expectGET(BASE_URL + endpoint + '?userId=user-001')
        .respond(200, mockResponse);
      
      var result;
      ApiService.get(endpoint, params).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
    });
    
    it('should handle GET request without parameters', function() {
      var endpoint = '/dashboard';
      var mockResponse = { kpis: {} };
      
      $httpBackend.expectGET(BASE_URL + endpoint)
        .respond(200, mockResponse);
      
      var result;
      ApiService.get(endpoint).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
    });
    
    it('should reject promise on GET request error', function() {
      var endpoint = '/cards';
      var errorResponse = { message: 'Not Found' };
      
      $httpBackend.expectGET(BASE_URL + endpoint)
        .respond(404, errorResponse);
      
      var error;
      ApiService.get(endpoint).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
  });
  
  describe('post method', function() {
    it('should make POST request with data and return response', function() {
      var endpoint = '/transactions';
      var postData = { amount: 100, category: 'Food' };
      var mockResponse = { success: true, transactionId: 'txn-001' };
      
      $httpBackend.expectPOST(BASE_URL + endpoint, postData)
        .respond(201, mockResponse);
      
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
      
      $httpBackend.expectPOST(BASE_URL + endpoint, {})
        .respond(200, mockResponse);
      
      var result;
      ApiService.post(endpoint, {}).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
    });
    
    it('should reject promise on POST request error', function() {
      var endpoint = '/transactions';
      var postData = { amount: -100 };
      var errorResponse = { message: 'Invalid amount' };
      
      $httpBackend.expectPOST(BASE_URL + endpoint, postData)
        .respond(400, errorResponse);
      
      var error;
      ApiService.post(endpoint, postData).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(400);
    });
  });
  
  describe('error handling', function() {
    it('should handle network errors gracefully', function() {
      var endpoint = '/cards';
      
      $httpBackend.expectGET(BASE_URL + endpoint)
        .respond(500, { message: 'Internal Server Error' });
      
      var error;
      ApiService.get(endpoint).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should handle timeout errors', function() {
      var endpoint = '/slow-endpoint';
      
      $httpBackend.expectGET(BASE_URL + endpoint)
        .respond(-1, '');
      
      var error;
      ApiService.get(endpoint).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
  });
});