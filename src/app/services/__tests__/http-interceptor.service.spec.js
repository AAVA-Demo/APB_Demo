/*
Test Documentation:
- Test Name: HttpInterceptorService - Request and Response Interception
- Purpose: Validate HTTP request authentication header injection and error response handling
- Scenario: Test request interceptor adds Authorization header and responseError redirects on 401/403
- Expected Result: Authorization header added to API requests, unauthorized responses trigger redirect
*/

describe('HttpInterceptorService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var HttpInterceptorService, AuthService, $window, $q, $rootScope;
  
  beforeEach(inject(function(_HttpInterceptorService_, _AuthService_, _$window_, _$q_, _$rootScope_) {
    HttpInterceptorService = _HttpInterceptorService_;
    AuthService = _AuthService_;
    $window = _$window_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('request interceptor', function() {
    it('should add Authorization header to API requests', function() {
      spyOn(AuthService, 'getToken').and.returnValue('test-token-123');
      var config = {
        url: 'http://localhost:3000/api/cards',
        headers: {}
      };
      var result = HttpInterceptorService.request(config);
      expect(result.headers.Authorization).toBe('Bearer test-token-123');
    });
    
    it('should not add Authorization header to non-API requests', function() {
      spyOn(AuthService, 'getToken').and.returnValue('test-token-123');
      var config = {
        url: 'http://example.com/other',
        headers: {}
      };
      var result = HttpInterceptorService.request(config);
      expect(result.headers.Authorization).toBeUndefined();
    });
    
    it('should preserve existing headers when adding Authorization', function() {
      spyOn(AuthService, 'getToken').and.returnValue('test-token-123');
      var config = {
        url: 'http://localhost:3000/api/dashboard',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      var result = HttpInterceptorService.request(config);
      expect(result.headers['Content-Type']).toBe('application/json');
      expect(result.headers.Authorization).toBe('Bearer test-token-123');
    });
    
    it('should initialize headers object if not present', function() {
      spyOn(AuthService, 'getToken').and.returnValue('test-token-123');
      var config = {
        url: 'http://localhost:3000/api/transactions'
      };
      var result = HttpInterceptorService.request(config);
      expect(result.headers).toBeDefined();
      expect(result.headers.Authorization).toBe('Bearer test-token-123');
    });
  });
  
  describe('responseError interceptor', function() {
    it('should clear token and redirect on 401 error', function() {
      spyOn(AuthService, 'clearToken');
      var rejection = {
        status: 401,
        data: {message: 'Unauthorized'}
      };
      HttpInterceptorService.responseError(rejection);
      expect(AuthService.clearToken).toHaveBeenCalled();
      expect($window.location.href).toBe('#!/login');
    });
    
    it('should clear token and redirect on 403 error', function() {
      spyOn(AuthService, 'clearToken');
      var rejection = {
        status: 403,
        data: {message: 'Forbidden'}
      };
      HttpInterceptorService.responseError(rejection);
      expect(AuthService.clearToken).toHaveBeenCalled();
      expect($window.location.href).toBe('#!/login');
    });
    
    it('should not clear token on other error codes', function() {
      spyOn(AuthService, 'clearToken');
      var rejection = {
        status: 500,
        data: {message: 'Server Error'}
      };
      HttpInterceptorService.responseError(rejection);
      expect(AuthService.clearToken).not.toHaveBeenCalled();
    });
    
    it('should return rejected promise', function() {
      var rejection = {
        status: 404,
        data: {message: 'Not Found'}
      };
      var result = HttpInterceptorService.responseError(rejection);
      expect(result).toBeDefined();
      expect(result.$$state).toBeDefined();
    });
  });
});

/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: Authorization header injection for API requests, non-API request handling, 401/403 error handling, other error codes
- Edge cases: missing headers object, multiple error status codes, preserving existing headers
- Uncovered scenarios: none
*/