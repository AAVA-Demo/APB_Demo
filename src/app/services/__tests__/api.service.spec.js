/*
Test Documentation:
- Test Name: ApiService - request method with authentication token
- Purpose: Validates that request method adds Authorization header when token is available
- Scenario: AuthService returns valid token and request is made
- Expected Result: Authorization header is added to request config
*/
/*
Test Documentation:
- Test Name: ApiService - request method success
- Purpose: Validates successful HTTP request returns data
- Scenario: $http resolves successfully with response data
- Expected Result: Returns response.data
*/
/*
Test Documentation:
- Test Name: ApiService - request method error handling
- Purpose: Validates error handling and logging
- Scenario: $http rejects with error
- Expected Result: Logs error and returns rejected promise
*/
/*
Test Documentation:
- Test Name: ApiService - get method
- Purpose: Validates GET request with parameters
- Scenario: get method is called with URL and params
- Expected Result: Calls request with correct config
*/
/*
Test Documentation:
- Test Name: ApiService - post method
- Purpose: Validates POST request with data
- Scenario: post method is called with URL and data
- Expected Result: Calls request with correct config
*/
/*
Coverage Report:
- Functions tested: request, get, post
- Scenarios covered: authentication token injection, successful requests, error handling, GET/POST methods
- Uncovered scenarios: none
*/

describe('ApiService', function() {
  'use strict';
  
  var ApiService, $http, $q, AuthService, $rootScope, $httpBackend;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_ApiService_, _$http_, _$q_, _AuthService_, _$rootScope_, _$httpBackend_) {
    ApiService = _ApiService_;
    $http = _$http_;
    $q = _$q_;
    AuthService = _AuthService_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    
    spyOn(console, 'error');
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('request method', function() {
    it('should add Authorization header when token is available', function() {
      var mockToken = 'test-jwt-token-123';
      spyOn(AuthService, 'getToken').and.returnValue(mockToken);
      
      $httpBackend.expectGET('/api/test', function(headers) {
        return headers['Authorization'] === 'Bearer ' + mockToken;
      }).respond(200, { data: 'success' });
      
      ApiService.request({ method: 'GET', url: '/api/test' });
      
      $httpBackend.flush();
      expect(AuthService.getToken).toHaveBeenCalled();
    });
    
    it('should not add Authorization header when token is null', function() {
      spyOn(AuthService, 'getToken').and.returnValue(null);
      
      $httpBackend.expectGET('/api/test', function(headers) {
        return !headers.hasOwnProperty('Authorization');
      }).respond(200, { data: 'success' });
      
      ApiService.request({ method: 'GET', url: '/api/test' });
      
      $httpBackend.flush();
    });
    
    it('should return response data on successful request', function(done) {
      var mockResponse = { users: ['user1', 'user2'] };
      spyOn(AuthService, 'getToken').and.returnValue('token');
      
      $httpBackend.expectGET('/api/users').respond(200, mockResponse);
      
      ApiService.request({ method: 'GET', url: '/api/users' }).then(function(data) {
        expect(data).toEqual(mockResponse);
        done();
      });
      
      $httpBackend.flush();
    });
    
    it('should handle HTTP errors and log error message', function(done) {
      spyOn(AuthService, 'getToken').and.returnValue('token');
      
      $httpBackend.expectGET('/api/error').respond(500, 'Internal Server Error');
      
      ApiService.request({ method: 'GET', url: '/api/error' }).catch(function(error) {
        expect(console.error).toHaveBeenCalledWith('API Error:', jasmine.any(Object));
        expect(error.status).toBe(500);
        done();
      });
      
      $httpBackend.flush();
    });
    
    it('should handle 404 errors', function(done) {
      spyOn(AuthService, 'getToken').and.returnValue('token');
      
      $httpBackend.expectGET('/api/notfound').respond(404, 'Not Found');
      
      ApiService.request({ method: 'GET', url: '/api/notfound' }).catch(function(error) {
        expect(error.status).toBe(404);
        expect(console.error).toHaveBeenCalled();
        done();
      });
      
      $httpBackend.flush();
    });
    
    it('should handle 401 unauthorized errors', function(done) {
      spyOn(AuthService, 'getToken').and.returnValue('invalid-token');
      
      $httpBackend.expectGET('/api/secure').respond(401, 'Unauthorized');
      
      ApiService.request({ method: 'GET', url: '/api/secure' }).catch(function(error) {
        expect(error.status).toBe(401);
        done();
      });
      
      $httpBackend.flush();
    });
    
    it('should preserve existing headers in config', function() {
      spyOn(AuthService, 'getToken').and.returnValue('token');
      var customHeaders = { 'X-Custom-Header': 'custom-value' };
      
      $httpBackend.expectGET('/api/test', function(headers) {
        return headers['X-Custom-Header'] === 'custom-value' && headers['Authorization'] === 'Bearer token';
      }).respond(200, {});
      
      ApiService.request({ method: 'GET', url: '/api/test', headers: customHeaders });
      
      $httpBackend.flush();
    });
  });
  
  describe('get method', function() {
    it('should call request with GET method and URL', function(done) {
      spyOn(AuthService, 'getToken').and.returnValue('token');
      
      $httpBackend.expectGET('/api/cards').respond(200, [{ id: 1 }]);
      
      ApiService.get('/api/cards').then(function(data) {
        expect(data).toEqual([{ id: 1 }]);
        done();
      });
      
      $httpBackend.flush();
    });
    
    it('should include query parameters in GET request', function(done) {
      spyOn(AuthService, 'getToken').and.returnValue('token');
      var params = { page: 1, limit: 10 };
      
      $httpBackend.expectGET('/api/transactions?limit=10&page=1').respond(200, { transactions: [] });
      
      ApiService.get('/api/transactions', params).then(function(data) {
        expect(data.transactions).toEqual([]);
        done();
      });
      
      $httpBackend.flush();
    });
    
    it('should handle GET request without parameters', function(done) {
      spyOn(AuthService, 'getToken').and.returnValue('token');
      
      $httpBackend.expectGET('/api/categories').respond(200, ['Food', 'Fuel']);
      
      ApiService.get('/api/categories').then(function(data) {
        expect(data).toEqual(['Food', 'Fuel']);
        done();
      });
      
      $httpBackend.flush();
    });
  });
  
  describe('post method', function() {
    it('should call request with POST method, URL and data', function(done) {
      spyOn(AuthService, 'getToken').and.returnValue('token');
      var postData = { name: 'New Card', limit: 5000 };
      
      $httpBackend.expectPOST('/api/cards', postData).respond(201, { id: 123, name: 'New Card' });
      
      ApiService.post('/api/cards', postData).then(function(data) {
        expect(data.id).toBe(123);
        expect(data.name).toBe('New Card');
        done();
      });
      
      $httpBackend.flush();
    });
    
    it('should handle POST request with empty data', function(done) {
      spyOn(AuthService, 'getToken').and.returnValue('token');
      
      $httpBackend.expectPOST('/api/refresh', {}).respond(200, { status: 'refreshed' });
      
      ApiService.post('/api/refresh', {}).then(function(data) {
        expect(data.status).toBe('refreshed');
        done();
      });
      
      $httpBackend.flush();
    });
    
    it('should handle POST errors', function(done) {
      spyOn(AuthService, 'getToken').and.returnValue('token');
      var postData = { invalid: 'data' };
      
      $httpBackend.expectPOST('/api/cards', postData).respond(400, 'Bad Request');
      
      ApiService.post('/api/cards', postData).catch(function(error) {
        expect(error.status).toBe(400);
        expect(console.error).toHaveBeenCalled();
        done();
      });
      
      $httpBackend.flush();
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle request with undefined config.headers', function() {
      spyOn(AuthService, 'getToken').and.returnValue('token');
      var config = { method: 'GET', url: '/api/test' };
      delete config.headers;
      
      $httpBackend.expectGET('/api/test').respond(200, {});
      
      ApiService.request(config);
      
      $httpBackend.flush();
      expect(config.headers).toBeDefined();
    });
    
    it('should handle network timeout', function(done) {
      spyOn(AuthService, 'getToken').and.returnValue('token');
      
      $httpBackend.expectGET('/api/slow').respond(-1, '');
      
      ApiService.get('/api/slow').catch(function(error) {
        expect(error.status).toBe(-1);
        done();
      });
      
      $httpBackend.flush();
    });
  });
});