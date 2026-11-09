/*
Test Documentation:
- Test Name: AuthInterceptorService - request method with token
- Purpose: Validates that the request interceptor adds Authorization header when token exists
- Scenario: User has valid token in sessionStorage
- Expected Result: Authorization header is added with Bearer token
*/
/*
Test Documentation:
- Test Name: AuthInterceptorService - request method without token
- Purpose: Validates that the request interceptor does not add Authorization header when token is absent
- Scenario: No token in sessionStorage
- Expected Result: Authorization header is not added
*/
/*
Test Documentation:
- Test Name: AuthInterceptorService - responseError with 401 status
- Purpose: Validates that 401 errors redirect to login page
- Scenario: API returns 401 Unauthorized
- Expected Result: User is redirected to /login
*/
/*
Test Documentation:
- Test Name: AuthInterceptorService - responseError with non-401 status
- Purpose: Validates that non-401 errors are rejected without redirect
- Scenario: API returns 500 Internal Server Error
- Expected Result: Promise is rejected without redirect
*/
/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: token present, token absent, 401 error, non-401 error, header initialization
- Uncovered scenarios: none
*/

describe('AuthInterceptorService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AuthInterceptorService;
  var $q;
  var $window;
  var $rootScope;
  
  beforeEach(inject(function(_AuthInterceptorService_, _$q_, _$window_, _$rootScope_) {
    AuthInterceptorService = _AuthInterceptorService_;
    $q = _$q_;
    $window = _$window_;
    $rootScope = _$rootScope_;
  }));
  
  afterEach(function() {
    $window.sessionStorage.clear();
  });
  
  describe('request interceptor', function() {
    it('should add Authorization header when token exists in sessionStorage', function() {
      var mockToken = 'test-auth-token-12345';
      $window.sessionStorage.setItem('authToken', mockToken);
      
      var config = {
        url: '/api/test',
        method: 'GET'
      };
      
      var result = AuthInterceptorService.request(config);
      
      expect(result.headers).toBeDefined();
      expect(result.headers.Authorization).toBe('Bearer ' + mockToken);
    });
    
    it('should not add Authorization header when token does not exist', function() {
      var config = {
        url: '/api/test',
        method: 'GET'
      };
      
      var result = AuthInterceptorService.request(config);
      
      expect(result.headers).toBeDefined();
      expect(result.headers.Authorization).toBeUndefined();
    });
    
    it('should initialize headers object if not present', function() {
      $window.sessionStorage.setItem('authToken', 'test-token');
      
      var config = {
        url: '/api/test',
        method: 'GET'
      };
      
      var result = AuthInterceptorService.request(config);
      
      expect(result.headers).toBeDefined();
      expect(typeof result.headers).toBe('object');
    });
    
    it('should preserve existing headers when adding Authorization', function() {
      $window.sessionStorage.setItem('authToken', 'test-token');
      
      var config = {
        url: '/api/test',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Custom-Header': 'custom-value'
        }
      };
      
      var result = AuthInterceptorService.request(config);
      
      expect(result.headers['Content-Type']).toBe('application/json');
      expect(result.headers['X-Custom-Header']).toBe('custom-value');
      expect(result.headers.Authorization).toBe('Bearer test-token');
    });
  });
  
  describe('responseError interceptor', function() {
    it('should redirect to /login on 401 Unauthorized error', function() {
      spyOn($window.location, 'href', 'set');
      
      var rejection = {
        status: 401,
        statusText: 'Unauthorized',
        data: { message: 'Authentication required' }
      };
      
      var result = AuthInterceptorService.responseError(rejection);
      
      expect($window.location.href).toBe('/login');
      expect(result).toBeDefined();
    });
    
    it('should reject promise on 401 error', function() {
      var rejection = {
        status: 401,
        statusText: 'Unauthorized'
      };
      
      var result = AuthInterceptorService.responseError(rejection);
      var rejected = false;
      
      result.catch(function(error) {
        rejected = true;
        expect(error.status).toBe(401);
      });
      
      $rootScope.$apply();
      expect(rejected).toBe(true);
    });
    
    it('should not redirect on non-401 errors', function() {
      var originalHref = $window.location.href;
      
      var rejection = {
        status: 500,
        statusText: 'Internal Server Error'
      };
      
      AuthInterceptorService.responseError(rejection);
      
      expect($window.location.href).toBe(originalHref);
    });
    
    it('should reject promise on 500 Internal Server Error', function() {
      var rejection = {
        status: 500,
        statusText: 'Internal Server Error',
        data: { message: 'Server error' }
      };
      
      var result = AuthInterceptorService.responseError(rejection);
      var rejected = false;
      
      result.catch(function(error) {
        rejected = true;
        expect(error.status).toBe(500);
        expect(error.data.message).toBe('Server error');
      });
      
      $rootScope.$apply();
      expect(rejected).toBe(true);
    });
    
    it('should reject promise on 404 Not Found error', function() {
      var rejection = {
        status: 404,
        statusText: 'Not Found'
      };
      
      var result = AuthInterceptorService.responseError(rejection);
      var rejected = false;
      
      result.catch(function(error) {
        rejected = true;
        expect(error.status).toBe(404);
      });
      
      $rootScope.$apply();
      expect(rejected).toBe(true);
    });
    
    it('should handle rejection with missing status', function() {
      var rejection = {
        statusText: 'Unknown Error'
      };
      
      var result = AuthInterceptorService.responseError(rejection);
      var rejected = false;
      
      result.catch(function(error) {
        rejected = true;
        expect(error.statusText).toBe('Unknown Error');
      });
      
      $rootScope.$apply();
      expect(rejected).toBe(true);
    });
  });
  
  describe('service structure', function() {
    it('should be defined', function() {
      expect(AuthInterceptorService).toBeDefined();
    });
    
    it('should have request method', function() {
      expect(AuthInterceptorService.request).toBeDefined();
      expect(typeof AuthInterceptorService.request).toBe('function');
    });
    
    it('should have responseError method', function() {
      expect(AuthInterceptorService.responseError).toBeDefined();
      expect(typeof AuthInterceptorService.responseError).toBe('function');
    });
  });
});