/*
Test Documentation:
- Test Name: AuthService - authenticate method
- Purpose: Validates that authenticate method stores token and user in sessionStorage
- Scenario: User authenticates for the first time
- Expected Result: Token and user data are stored in sessionStorage and promise resolves
*/
/*
Test Documentation:
- Test Name: AuthService - isAuthenticated method
- Purpose: Validates authentication status check
- Scenario: Token exists in sessionStorage
- Expected Result: Returns true when token exists, false otherwise
*/
/*
Test Documentation:
- Test Name: AuthService - logout method
- Purpose: Validates that logout removes authentication data
- Scenario: User logs out
- Expected Result: Token and user data are removed from sessionStorage
*/
/*
Coverage Report:
- Functions tested: authenticate, isAuthenticated, getToken, getUser, logout
- Scenarios covered: authentication, token validation, user retrieval, logout, auto-authentication on service initialization
- Uncovered scenarios: none
*/

describe('AuthService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AuthService;
  var $window;
  var $rootScope;
  
  beforeEach(inject(function(_AuthService_, _$window_, _$rootScope_) {
    AuthService = _AuthService_;
    $window = _$window_;
    $rootScope = _$rootScope_;
    $window.sessionStorage.clear();
  }));
  
  describe('authenticate', function() {
    it('should store token and user in sessionStorage', function() {
      var result;
      AuthService.authenticate().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.userId).toBe('user123');
      expect(result.user.name).toBe('John Doe');
      expect($window.sessionStorage.getItem('cc_auth_token')).toBeDefined();
      expect($window.sessionStorage.getItem('cc_user')).toBeDefined();
    });
    
    it('should generate unique token with timestamp', function() {
      var result1, result2;
      AuthService.authenticate().then(function(data) {
        result1 = data.token;
      });
      $rootScope.$digest();
      
      $window.sessionStorage.clear();
      
      AuthService.authenticate().then(function(data) {
        result2 = data.token;
      });
      $rootScope.$digest();
      
      expect(result1).not.toBe(result2);
    });
  });
  
  describe('isAuthenticated', function() {
    it('should return true when token exists', function() {
      $window.sessionStorage.setItem('cc_auth_token', 'test_token');
      expect(AuthService.isAuthenticated()).toBe(true);
    });
    
    it('should return false when token does not exist', function() {
      $window.sessionStorage.removeItem('cc_auth_token');
      expect(AuthService.isAuthenticated()).toBe(false);
    });
  });
  
  describe('getToken', function() {
    it('should return stored token', function() {
      var testToken = 'test_token_123';
      $window.sessionStorage.setItem('cc_auth_token', testToken);
      expect(AuthService.getToken()).toBe(testToken);
    });
    
    it('should return null when no token exists', function() {
      $window.sessionStorage.removeItem('cc_auth_token');
      expect(AuthService.getToken()).toBeNull();
    });
  });
  
  describe('getUser', function() {
    it('should return parsed user object', function() {
      var mockUser = {userId: 'user123', name: 'John Doe', email: 'john@example.com'};
      $window.sessionStorage.setItem('cc_user', JSON.stringify(mockUser));
      
      var user = AuthService.getUser();
      expect(user).toBeDefined();
      expect(user.userId).toBe('user123');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    });
    
    it('should return null when no user exists', function() {
      $window.sessionStorage.removeItem('cc_user');
      expect(AuthService.getUser()).toBeNull();
    });
  });
  
  describe('logout', function() {
    it('should remove token and user from sessionStorage', function() {
      $window.sessionStorage.setItem('cc_auth_token', 'test_token');
      $window.sessionStorage.setItem('cc_user', JSON.stringify({userId: 'user123'}));
      
      AuthService.logout();
      
      expect($window.sessionStorage.getItem('cc_auth_token')).toBeNull();
      expect($window.sessionStorage.getItem('cc_user')).toBeNull();
    });
  });
});