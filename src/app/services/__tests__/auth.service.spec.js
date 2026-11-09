/*
Test Documentation:
- Test Name: AuthService - authenticate method
- Purpose: Validates that authenticate method stores token in localStorage and returns a promise
- Scenario: User authenticates successfully
- Expected Result: Token is stored in localStorage and promise resolves with token
*/
/*
Test Documentation:
- Test Name: AuthService - getAuthToken method
- Purpose: Validates that getAuthToken retrieves token from localStorage
- Scenario: Token exists in localStorage
- Expected Result: Returns the stored token
*/
/*
Test Documentation:
- Test Name: AuthService - isAuthenticated method
- Purpose: Validates authentication state based on token presence
- Scenario: Token exists or does not exist in localStorage
- Expected Result: Returns true if token exists, false otherwise
*/
/*
Test Documentation:
- Test Name: AuthService - logout method
- Purpose: Validates that logout removes token from localStorage
- Scenario: User logs out
- Expected Result: Token is removed from localStorage
*/
/*
Coverage Report:
- Functions tested: authenticate, getAuthToken, isAuthenticated, logout
- Scenarios covered: successful authentication, token retrieval, authentication check (authenticated and unauthenticated), logout
- Edge cases: null token, empty localStorage
- Uncovered scenarios: network failures (not applicable for mock implementation)
*/

describe('AuthService', function() {
  'use strict';

  var AuthService;
  var $window;
  var $q;
  var $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_AuthService_, _$window_, _$q_, _$rootScope_) {
    AuthService = _AuthService_;
    $window = _$window_;
    $q = _$q_;
    $rootScope = _$rootScope_;

    // Clear localStorage before each test
    $window.localStorage.clear();
  }));

  afterEach(function() {
    $window.localStorage.clear();
  });

  describe('authenticate', function() {
    it('should store authentication token in localStorage', function() {
      AuthService.authenticate();
      var token = $window.localStorage.getItem('cc_auth_token');
      expect(token).toBeDefined();
      expect(token).toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    });

    it('should return a promise that resolves with the token', function(done) {
      AuthService.authenticate().then(function(token) {
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);
        done();
      });
      $rootScope.$apply();
    });

    it('should store the correct mock token format', function() {
      AuthService.authenticate();
      var token = $window.localStorage.getItem('cc_auth_token');
      expect(token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMTIzIiwibmFtZSI6IkpvaG4gRG9lIn0.mock');
    });
  });

  describe('getAuthToken', function() {
    it('should return null when no token is stored', function() {
      var token = AuthService.getAuthToken();
      expect(token).toBeNull();
    });

    it('should return the stored token when it exists', function() {
      var mockToken = 'test-token-123';
      $window.localStorage.setItem('cc_auth_token', mockToken);
      var token = AuthService.getAuthToken();
      expect(token).toBe(mockToken);
    });

    it('should return the token after authentication', function() {
      AuthService.authenticate();
      var token = AuthService.getAuthToken();
      expect(token).toBeDefined();
      expect(token).toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    });
  });

  describe('isAuthenticated', function() {
    it('should return false when no token is stored', function() {
      var isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(false);
    });

    it('should return true when a token is stored', function() {
      $window.localStorage.setItem('cc_auth_token', 'valid-token');
      var isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(true);
    });

    it('should return true after successful authentication', function() {
      AuthService.authenticate();
      var isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(true);
    });

    it('should return false after logout', function() {
      AuthService.authenticate();
      AuthService.logout();
      var isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(false);
    });
  });

  describe('logout', function() {
    it('should remove token from localStorage', function() {
      $window.localStorage.setItem('cc_auth_token', 'test-token');
      AuthService.logout();
      var token = $window.localStorage.getItem('cc_auth_token');
      expect(token).toBeNull();
    });

    it('should handle logout when no token exists', function() {
      expect(function() {
        AuthService.logout();
      }).not.toThrow();
      var token = AuthService.getAuthToken();
      expect(token).toBeNull();
    });

    it('should make isAuthenticated return false after logout', function() {
      AuthService.authenticate();
      expect(AuthService.isAuthenticated()).toBe(true);
      AuthService.logout();
      expect(AuthService.isAuthenticated()).toBe(false);
    });
  });

  describe('edge cases', function() {
    it('should handle empty string token', function() {
      $window.localStorage.setItem('cc_auth_token', '');
      var isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(false);
    });

    it('should handle multiple authenticate calls', function() {
      AuthService.authenticate();
      var token1 = AuthService.getAuthToken();
      AuthService.authenticate();
      var token2 = AuthService.getAuthToken();
      expect(token1).toBe(token2);
    });

    it('should maintain token across service method calls', function() {
      AuthService.authenticate();
      var token1 = AuthService.getAuthToken();
      expect(AuthService.isAuthenticated()).toBe(true);
      var token2 = AuthService.getAuthToken();
      expect(token1).toBe(token2);
    });
  });
});