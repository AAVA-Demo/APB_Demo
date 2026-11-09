/*
Test Documentation:
- Test Name: HttpInterceptorService - request method with token
- Purpose: Validates that Authorization header is added when token exists
- Scenario: HTTP request is intercepted with valid authentication token
- Expected Result: Bearer token is added to request headers
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - request method without token
- Purpose: Validates behavior when no authentication token exists
- Scenario: HTTP request is intercepted without authentication
- Expected Result: Request proceeds without Authorization header
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - responseError method
- Purpose: Validates that HTTP errors are properly rejected
- Scenario: HTTP request fails with error response
- Expected Result: Promise is rejected with error object
*/
/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: token injection, missing token handling, error rejection, header preservation
- Uncovered scenarios: token refresh on 401, retry logic
*/

describe('HttpInterceptorService', function() {
  'use strict';
  
  var HttpInterceptorService, AuthService, $q, $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_HttpInterceptorService_, _AuthService_, _$q_, _$rootScope_) {
    HttpInterceptorService = _HttpInterceptorService_;
    AuthService = _AuthService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('request method', function() {
    it('should add Authorization header when token exists', function() {
      spyOn(AuthService, 'getToken').and.returnValue('mock-token-12345');
      
      var config = { headers: {} };
      var result = HttpInterceptorService.request(config);
      
      expect(result.headers.Authorization).toBe('Bearer mock-token-12345');
    });
    
    it('should not add Authorization header when token is null', function() {
      spyOn(AuthService, 'getToken').and.returnValue(null);
      
      var config = { headers: {} };
      var result = HttpInterceptorService.request(config);
      
      expect(result.headers.Authorization).toBeUndefined();
    });
    
    it('should not add Authorization header when token is undefined', function() {
      spyOn(AuthService, 'getToken').and.returnValue(undefined);
      
      var config = { headers: {} };
      var result = HttpInterceptorService.request(config);
      
      expect(result.headers.Authorization).toBeUndefined();
    });
    
    it('should initialize headers object if not present', function() {
      spyOn(AuthService, 'getToken').and.returnValue('valid-token');
      
      var config = {};
      var result = HttpInterceptorService.request(config);
      
      expect(result.headers).toBeDefined();
      expect(result.headers.Authorization).toBe('Bearer valid-token');
    });
    
    it('should preserve existing headers', function() {
      spyOn(AuthService, 'getToken').and.returnValue('test-token');
      
      var config = { 
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        } 
      };
      var result = HttpInterceptorService.request(config);
      
      expect(result.headers['Content-Type']).toBe('application/json');
      expect(result.headers['Accept']).toBe('application/json');
      expect(result.headers.Authorization).toBe('Bearer test-token');
    });
    
    it('should return the modified config object', function() {
      spyOn(AuthService, 'getToken').and.returnValue('token');
      
      var config = { url: '/api/test', method: 'GET', headers: {} };
      var result = HttpInterceptorService.request(config);
      
      expect(result.url).toBe('/api/test');
      expect(result.method).toBe('GET');
      expect(result).toBe(config);
    });
  });
  
  describe('responseError method', function() {
    it('should reject promise with error object', function() {
      var rejection = { 
        status: 404, 
        statusText: 'Not Found',
        data: { message: 'Resource not found' }
      };
      
      var error;
      HttpInterceptorService.responseError(rejection).catch(function(err) {
        error = err;
      });
      
      $rootScope.$apply();
      
      expect(error).toBe(rejection);
    });
    
    it('should handle 401 Unauthorized errors', function() {
      var rejection = { 
        status: 401, 
        statusText: 'Unauthorized',
        data: { message: 'Invalid token' }
      };
      
      var error;
      HttpInterceptorService.responseError(rejection).catch(function(err) {
        error = err;
      });
      
      $rootScope.$apply();
      
      expect(error.status).toBe(401);
    });
    
    it('should handle 500 Internal Server errors', function() {
      var rejection = { 
        status: 500, 
        statusText: 'Internal Server Error',
        data: { message: 'Server error' }
      };
      
      var error;
      HttpInterceptorService.responseError(rejection).catch(function(err) {
        error = err;
      });
      
      $rootScope.$apply();
      
      expect(error.status).toBe(500);
    });
    
    it('should handle network errors with status -1', function() {
      var rejection = { 
        status: -1, 
        statusText: '',
        data: null
      };
      
      var error;
      HttpInterceptorService.responseError(rejection).catch(function(err) {
        error = err;
      });
      
      $rootScope.$apply();
      
      expect(error.status).toBe(-1);
    });
    
    it('should return rejected promise', function() {
      var rejection = { status: 400 };
      var result = HttpInterceptorService.responseError(rejection);
      
      expect(result.$$state).toBeDefined();
      expect(result.then).toBeDefined();
      expect(result.catch).toBeDefined();
    });
  });
  
  describe('integration with AuthService', function() {
    it('should call AuthService.getToken on each request', function() {
      spyOn(AuthService, 'getToken').and.returnValue('integration-token');
      
      var config = { headers: {} };
      HttpInterceptorService.request(config);
      
      expect(AuthService.getToken).toHaveBeenCalled();
      expect(AuthService.getToken).toHaveBeenCalledTimes(1);
    });
    
    it('should use latest token from AuthService', function() {
      var tokenSequence = ['token-1', 'token-2', 'token-3'];
      var callCount = 0;
      
      spyOn(AuthService, 'getToken').and.callFake(function() {
        return tokenSequence[callCount++];
      });
      
      var config1 = { headers: {} };
      var result1 = HttpInterceptorService.request(config1);
      expect(result1.headers.Authorization).toBe('Bearer token-1');
      
      var config2 = { headers: {} };
      var result2 = HttpInterceptorService.request(config2);
      expect(result2.headers.Authorization).toBe('Bearer token-2');
      
      var config3 = { headers: {} };
      var result3 = HttpInterceptorService.request(config3);
      expect(result3.headers.Authorization).toBe('Bearer token-3');
    });
  });
});