/*
Test Documentation:
- Test Name: authFactory Unit Tests
- Purpose: Validate user context retrieval, authentication status, and logout functionality
- Scenario: Test factory methods with various session storage states
- Expected Result: Correct user context, authentication status, and session cleanup
*/

describe('authFactory', function() {
  'use strict';
  
  var authFactory, $window;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_authFactory_, _$window_) {
    authFactory = _authFactory_;
    $window = _$window_;
    $window.sessionStorage.clear();
  }));
  
  afterEach(function() {
    $window.sessionStorage.clear();
  });
  
  describe('getUserContext', function() {
    it('should return user context with existing token', function() {
      $window.sessionStorage.setItem('authToken', 'existing-token');
      $window.sessionStorage.setItem('userId', 'user456');
      
      var context = authFactory.getUserContext();
      
      expect(context.userId).toBe('user456');
      expect(context.token).toBe('existing-token');
    });
    
    it('should create mock token when no token exists', function() {
      var context = authFactory.getUserContext();
      
      expect(context.userId).toBe('user123');
      expect(context.token).toBe('mock-jwt-token');
      expect($window.sessionStorage.getItem('authToken')).toBe('mock-jwt-token');
    });
    
    it('should use default userId when not set', function() {
      $window.sessionStorage.removeItem('userId');
      
      var context = authFactory.getUserContext();
      
      expect(context.userId).toBe('user123');
    });
  });
  
  describe('isAuthenticated', function() {
    it('should return false when no token exists', function() {
      var isAuth = authFactory.isAuthenticated();
      expect(isAuth).toBe(false);
    });
    
    it('should return true when token exists', function() {
      $window.sessionStorage.setItem('authToken', 'valid-token');
      var isAuth = authFactory.isAuthenticated();
      expect(isAuth).toBe(true);
    });
  });
  
  describe('logout', function() {
    it('should remove authToken and userId from sessionStorage', function() {
      $window.sessionStorage.setItem('authToken', 'token-to-remove');
      $window.sessionStorage.setItem('userId', 'user-to-remove');
      
      authFactory.logout();
      
      expect($window.sessionStorage.getItem('authToken')).toBeNull();
      expect($window.sessionStorage.getItem('userId')).toBeNull();
    });
    
    it('should not throw error when logging out without existing session', function() {
      expect(function() {
        authFactory.logout();
      }).not.toThrow();
    });
  });
});

/*
Coverage Report:
- Functions tested: getUserContext, isAuthenticated, logout
- Scenarios covered:
  * User context retrieval with existing/missing token
  * Default userId handling
  * Authentication status validation
  * Logout and session cleanup
- Uncovered scenarios: None
*/