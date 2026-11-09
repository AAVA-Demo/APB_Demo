/*
Test Documentation:
- Test Name: AuthService - authenticate method
- Purpose: Validates that authentication creates and stores token
- Scenario: User authenticates for the first time
- Expected Result: Token is created and stored in session storage
*/
/*
Test Documentation:
- Test Name: AuthService - isAuthenticated method
- Purpose: Validates authentication status check
- Scenario: Check if user has valid authentication token
- Expected Result: Returns true when token exists, false otherwise
*/
/*
Test Documentation:
- Test Name: AuthService - logout method
- Purpose: Validates that logout clears authentication state
- Scenario: Authenticated user logs out
- Expected Result: Token is removed from memory and session storage
*/
/*
Test Documentation:
- Test Name: AuthInterceptor - request method
- Purpose: Validates that Authorization header is added to HTTP requests
- Scenario: HTTP request is made with valid authentication
- Expected Result: Bearer token is added to request headers
*/
/*
Coverage Report:
- Functions tested: authenticate, isAuthenticated, getToken, logout, AuthInterceptor.request
- Scenarios covered: initial authentication, token retrieval, logout, HTTP interception, session storage
- Uncovered scenarios: token expiration, token refresh
*/

describe('AuthService', function() {
  'use strict';
  
  var AuthService, $window;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_AuthService_, _$window_) {
    AuthService = _AuthService_;
    $window = _$window_;
    $window.sessionStorage.clear();
  }));
  
  afterEach(function() {
    $window.sessionStorage.clear();
  });
  
  describe('authenticate method', function() {
    it('should create and return authentication token', function() {
      var token = AuthService.authenticate();
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
    
    it('should store token in session storage', function() {
      AuthService.authenticate();
      
      var storedToken = $window.sessionStorage.getItem('authToken');
      expect(storedToken).toBeDefined();
      expect(storedToken).toBe('mock-jwt-token-12345');
    });
    
    it('should return existing token if already authenticated', function() {
      var firstToken = AuthService.authenticate();
      var secondToken = AuthService.authenticate();
      
      expect(firstToken).toBe(secondToken);
    });
    
    it('should use token from session storage if available', function() {
      $window.sessionStorage.setItem('authToken', 'existing-token');
      
      var token = AuthService.getToken();
      expect(token).toBe('existing-token');
    });
  });
  
  describe('isAuthenticated method', function() {
    it('should return true when user is authenticated', function() {
      AuthService.authenticate();
      
      expect(AuthService.isAuthenticated()).toBe(true);
    });
    
    it('should return false when user is not authenticated', function() {
      AuthService.logout();
      
      expect(AuthService.isAuthenticated()).toBe(false);
    });
    
    it('should return true if token exists in session storage', function() {
      $window.sessionStorage.setItem('authToken', 'valid-token');
      
      expect(AuthService.isAuthenticated()).toBe(true);
    });
  });
  
  describe('getToken method', function() {
    it('should return current authentication token', function() {
      AuthService.authenticate();
      var token = AuthService.getToken();
      
      expect(token).toBe('mock-jwt-token-12345');
    });
    
    it('should return null after logout', function() {
      AuthService.authenticate();
      AuthService.logout();
      
      var token = AuthService.getToken();
      expect(token).toBeNull();
    });
  });
  
  describe('logout method', function() {
    it('should clear authentication token', function() {
      AuthService.authenticate();
      AuthService.logout();
      
      var token = AuthService.getToken();
      expect(token).toBeNull();
    });
    
    it('should remove token from session storage', function() {
      AuthService.authenticate();
      AuthService.logout();
      
      var storedToken = $window.sessionStorage.getItem('authToken');
      expect(storedToken).toBeNull();
    });
    
    it('should update authentication status', function() {
      AuthService.authenticate();
      expect(AuthService.isAuthenticated()).toBe(true);
      
      AuthService.logout();
      expect(AuthService.isAuthenticated()).toBe(false);
    });
  });
});

describe('AuthInterceptor', function() {
  'use strict';
  
  var AuthInterceptor, AuthService, $window;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_AuthInterceptor_, _AuthService_, _$window_) {
    AuthInterceptor = _AuthInterceptor_;
    AuthService = _AuthService_;
    $window = _$window_;
    $window.sessionStorage.clear();
  }));
  
  describe('request method', function() {
    it('should add Authorization header to request config', function() {
      AuthService.authenticate();
      
      var config = { headers: {} };
      var modifiedConfig = AuthInterceptor.request(config);
      
      expect(modifiedConfig.headers.Authorization).toBeDefined();
      expect(modifiedConfig.headers.Authorization).toContain('Bearer');
    });
    
    it('should use correct token in Authorization header', function() {
      AuthService.authenticate();
      var token = AuthService.getToken();
      
      var config = { headers: {} };
      var modifiedConfig = AuthInterceptor.request(config);
      
      expect(modifiedConfig.headers.Authorization).toBe('Bearer ' + token);
    });
    
    it('should not add Authorization header if no token exists', function() {
      AuthService.logout();
      
      var config = { headers: {} };
      var modifiedConfig = AuthInterceptor.request(config);
      
      expect(modifiedConfig.headers.Authorization).toBeUndefined();
    });
    
    it('should preserve existing headers', function() {
      AuthService.authenticate();
      
      var config = { 
        headers: { 
          'Content-Type': 'application/json',
          'X-Custom-Header': 'custom-value'
        } 
      };
      var modifiedConfig = AuthInterceptor.request(config);
      
      expect(modifiedConfig.headers['Content-Type']).toBe('application/json');
      expect(modifiedConfig.headers['X-Custom-Header']).toBe('custom-value');
      expect(modifiedConfig.headers.Authorization).toBeDefined();
    });
  });
});