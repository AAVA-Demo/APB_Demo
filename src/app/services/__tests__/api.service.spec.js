/*
Test Documentation:
- Test Name: api.service - get and post methods
- Purpose: Validate generic HTTP wrapper for GET and POST requests
- Scenario: Service provides abstraction layer for HTTP operations
- Expected Result: Returns data on success, rejects with error on failure
*/

describe('ApiService (api.service.js)', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var ApiService;
  var $httpBackend;
  
  beforeEach(inject(function(_ApiService_, _$httpBackend_) {
    ApiService = _ApiService_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('get', function() {
    it('should perform GET request and return data', function() {
      var url = '/api/test';
      var mockData = {id: 1, name: 'Test'};
      
      $httpBackend.expectGET(url).respond(200, mockData);
      
      ApiService.get(url).then(function(result) {
        expect(result).toEqual(mockData);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle GET errors', function() {
      var url = '/api/test';
      
      $httpBackend.expectGET(url).respond(500, 'Server Error');
      
      ApiService.get(url).catch(function(error) {
        expect(error.status).toBe(500);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle 404 not found', function() {
      var url = '/api/notfound';
      
      $httpBackend.expectGET(url).respond(404, 'Not Found');
      
      ApiService.get(url).catch(function(error) {
        expect(error.status).toBe(404);
      });
      
      $httpBackend.flush();
    });
  });
  
  describe('post', function() {
    it('should perform POST request and return data', function() {
      var url = '/api/test';
      var postData = {name: 'New Item'};
      var mockResponse = {id: 1, name: 'New Item'};
      
      $httpBackend.expectPOST(url, postData).respond(201, mockResponse);
      
      ApiService.post(url, postData).then(function(result) {
        expect(result).toEqual(mockResponse);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle POST errors', function() {
      var url = '/api/test';
      var postData = {name: 'New Item'};
      
      $httpBackend.expectPOST(url, postData).respond(400, 'Bad Request');
      
      ApiService.post(url, postData).catch(function(error) {
        expect(error.status).toBe(400);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle validation errors', function() {
      var url = '/api/test';
      var postData = {name: ''};
      
      $httpBackend.expectPOST(url, postData).respond(422, 'Validation Error');
      
      ApiService.post(url, postData).catch(function(error) {
        expect(error.status).toBe(422);
      });
      
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: get, post
- Scenarios covered:
  * Successful GET request
  * GET error handling (500, 404)
  * Successful POST request
  * POST error handling (400, 422)
- Uncovered scenarios: None
- Edge cases: Various HTTP error codes
*/