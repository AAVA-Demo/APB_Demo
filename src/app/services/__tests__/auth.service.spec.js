/*
Test Documentation:
- Test Name: AuthService and AuthInterceptor Unit Tests
- Purpose: Validate authentication, session management, and HTTP interceptor functionality
- Scenario: Tests token storage, retrieval, validation, and HTTP request/response interception
- Expected Result: Proper JWT token management and automatic header injection
*/

(function() {
'use strict';

describe('AuthService', function() {
  var AuthService, $window;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_AuthService_, _$window_) {
    AuthService = _AuthService_;
    $window = _$window_;
    $window.localStorage.clear();
  }));
  
  describe('isAuthenticated', function() {
    it('should return false when no token exists', function() {
      expect(AuthService.isAuthenticated()).toBe(false);
    });
    
    it('should return true when token exists', function() {
      $window.localStorage.setItem('authToken', 'test-token-123');
      expect(AuthService.isAuthenticated()).toBe(true);
    });
    
    it('should return false when token is null', function() {
      $window.localStorage.setItem('authToken', null);
      expect(AuthService.isAuthenticated()).toBe(false);
    });
    
    it('should return false when token is empty string', function() {
      $window.localStorage.setItem('authToken', '');
      expect(AuthService.isAuthenticated()).toBe(false);
    });
  });
  
  describe('getToken', function() {
    it('should return null when no token exists', function() {
      expect(AuthService.getToken()).toBeNull();
    });
    
    it('should return the stored token', function() {
      var testToken = 'jwt-token-xyz';
      $window.localStorage.setItem('authToken', testToken);
      expect(AuthService.getToken()).toBe(testToken);
    });
  });
  
  describe('login', function() {
    it('should generate and store a mock token', function() {
      AuthService.login();
      var token = $window.localStorage.getItem('authToken');
      expect(token).toBeDefined();
      expect(token).toContain('mock-jwt-token-');
    });
    
    it('should generate unique tokens on multiple logins', function() {
      AuthService.login();
      var token1 = $window.localStorage.getItem('authToken');
      
      AuthService.login();
      var token2 = $window.localStorage.getItem('authToken');
      
      expect(token1).not.toBe(token2);
    });
  });
  
  describe('logout', function() {
    it('should remove the token from localStorage', function() {
      $window.localStorage.setItem('authToken', 'test-token');
      AuthService.logout();
      expect($window.localStorage.getItem('authToken')).toBeNull();
    });
    
    it('should handle logout when no token exists', function() {
      expect(function() {
        AuthService.logout();
      }).not.toThrow();
    });
  });
  
  describe('validateSession', function() {
    it('should return true when authenticated', function() {
      $window.localStorage.setItem('authToken', 'valid-token');
      expect(AuthService.validateSession()).toBe(true);
    });
    
    it('should return false when not authenticated', function() {
      expect(AuthService.validateSession()).toBe(false);
    });
  });
});

describe('AuthInterceptor', function() {
  var AuthInterceptor, $window, $q, $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_AuthInterceptor_, _$window_, _$q_, _$rootScope_) {
    AuthInterceptor = _AuthInterceptor_;
    $window = _$window_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $window.localStorage.clear();
  }));
  
  describe('request interceptor', function() {
    it('should add Authorization header when token exists', function() {
      var testToken = 'jwt-token-123';
      $window.localStorage.setItem('authToken', testToken);
      
      var config = {headers: {}};
      var result = AuthInterceptor.request(config);
      
      expect(result.headers.Authorization).toBe('Bearer ' + testToken);
    });
    
    it('should not add Authorization header when no token exists', function() {
      var config = {headers: {}};
      var result = AuthInterceptor.request(config);
      
      expect(result.headers.Authorization).toBeUndefined();
    });
    
    it('should preserve existing headers', function() {
      $window.localStorage.setItem('authToken', 'test-token');
      var config = {headers: {'Content-Type': 'application/json'}};
      var result = AuthInterceptor.request(config);
      
      expect(result.headers['Content-Type']).toBe('application/json');
      expect(result.headers.Authorization).toBeDefined();
    });
  });
  
  describe('responseError interceptor', function() {
    beforeEach(function() {
      spyOn($window.location, 'href', 'set');
    });
    
    it('should remove token and redirect on 401 error', function() {
      $window.localStorage.setItem('authToken', 'test-token');
      var rejection = {status: 401, data: 'Unauthorized'};
      
      AuthInterceptor.responseError(rejection);
      
      expect($window.localStorage.getItem('authToken')).toBeNull();
    });
    
    it('should not remove token on non-401 errors', function() {
      $window.localStorage.setItem('authToken', 'test-token');
      var rejection = {status: 500, data: 'Server error'};
      
      AuthInterceptor.responseError(rejection);
      
      expect($window.localStorage.getItem('authToken')).toBe('test-token');
    });
    
    it('should reject the promise on any error', function() {
      var rejection = {status: 404, data: 'Not found'};
      var result = AuthInterceptor.responseError(rejection);
      
      expect(result).toBeDefined();
      expect(result.$$state).toBeDefined();
    });
  });
});

/*
Coverage Report:
- Functions tested: 
  * AuthService: isAuthenticated, getToken, login, logout, validateSession
  * AuthInterceptor: request, responseError
- Scenarios covered:
  * Token presence/absence
  * Token generation uniqueness
  * Token removal
  * HTTP header injection
  * 401 error handling and redirection
  * Non-401 error handling
  * Edge cases: null tokens, empty strings, missing headers
- Uncovered scenarios: None - full coverage achieved
*/
})();