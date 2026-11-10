/*
Test Documentation:
- Test Name: AuthService - getToken
- Purpose: Verify that getToken returns the stored authentication token
- Scenario: Service retrieves token from localStorage or default demo token
- Expected Result: Returns valid token string
*/
/*
Test Documentation:
- Test Name: AuthService - validateToken with valid token
- Purpose: Verify token validation succeeds when token exists
- Scenario: Token is present in localStorage
- Expected Result: Promise resolves with true
*/
/*
Test Documentation:
- Test Name: AuthService - validateToken without token
- Purpose: Verify token validation fails when no token exists
- Scenario: No token in localStorage
- Expected Result: Promise rejects with error message
*/
/*
Test Documentation:
- Test Name: AuthService - setAuthHeader
- Purpose: Verify Authorization header is set correctly on HTTP config
- Scenario: HTTP request config is passed to setAuthHeader
- Expected Result: Config object contains Authorization header with Bearer token
*/
/*
Test Documentation:
- Test Name: AuthInterceptor - request with API URL
- Purpose: Verify interceptor adds auth header to API requests
- Scenario: HTTP request to /api/ endpoint
- Expected Result: Request config includes Authorization header
*/
/*
Test Documentation:
- Test Name: AuthInterceptor - request with non-API URL
- Purpose: Verify interceptor does not modify non-API requests
- Scenario: HTTP request to external URL
- Expected Result: Request config returned unchanged
*/
/*
Coverage Report:
- Functions tested: getToken, validateToken, setAuthHeader, AuthInterceptor.request
- Scenarios covered: token retrieval, validation success, validation failure, header injection, interceptor filtering
- Uncovered scenarios: token refresh, token expiration handling
*/

describe('AuthService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AuthService, $window, $q, $rootScope;
  
  beforeEach(inject(function(_AuthService_, _$window_, _$q_, _$rootScope_) {
    AuthService = _AuthService_;
    $window = _$window_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  afterEach(function() {
    $window.localStorage.removeItem('authToken');
  });
  
  describe('getToken', function() {
    it('should return demo token when no token in localStorage', function() {
      $window.localStorage.removeItem('authToken');
      var token = AuthService.getToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
    
    it('should return stored token from localStorage', function() {
      $window.localStorage.setItem('authToken', 'test-token-123');
      var token = AuthService.getToken();
      expect(token).toBe('test-token-123');
    });
  });
  
  describe('validateToken', function() {
    it('should resolve promise when token exists', function() {
      var result;
      AuthService.validateToken().then(function(data) {
        result = data;
      });
      $rootScope.$apply();
      expect(result).toBe(true);
    });
    
    it('should reject promise when no token exists', function() {
      $window.localStorage.removeItem('authToken');
      AuthService = inject(function(_AuthService_) {
        return _AuthService_;
      });
      var error;
      AuthService.validateToken().catch(function(err) {
        error = err;
      });
      $rootScope.$apply();
      expect(error).toBe('No token found');
    });
  });
  
  describe('setAuthHeader', function() {
    it('should add Authorization header to config', function() {
      var config = { url: '/api/test' };
      var result = AuthService.setAuthHeader(config);
      expect(result.headers).toBeDefined();
      expect(result.headers.Authorization).toBeDefined();
      expect(result.headers.Authorization).toContain('Bearer');
    });
    
    it('should preserve existing headers', function() {
      var config = {
        url: '/api/test',
        headers: { 'Content-Type': 'application/json' }
      };
      var result = AuthService.setAuthHeader(config);
      expect(result.headers['Content-Type']).toBe('application/json');
      expect(result.headers.Authorization).toBeDefined();
    });
  });
});

describe('AuthInterceptor', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AuthInterceptor, AuthService;
  
  beforeEach(inject(function(_AuthInterceptor_, _AuthService_) {
    AuthInterceptor = _AuthInterceptor_;
    AuthService = _AuthService_;
  }));
  
  describe('request', function() {
    it('should add auth header to API requests', function() {
      spyOn(AuthService, 'setAuthHeader').and.callThrough();
      var config = { url: '/api/cards' };
      var result = AuthInterceptor.request(config);
      expect(AuthService.setAuthHeader).toHaveBeenCalledWith(config);
    });
    
    it('should not modify non-API requests', function() {
      spyOn(AuthService, 'setAuthHeader');
      var config = { url: 'https://external.com/data' };
      var result = AuthInterceptor.request(config);
      expect(AuthService.setAuthHeader).not.toHaveBeenCalled();
      expect(result).toBe(config);
    });
    
    it('should handle config without url', function() {
      var config = { method: 'GET' };
      var result = AuthInterceptor.request(config);
      expect(result).toBe(config);
    });
  });
});