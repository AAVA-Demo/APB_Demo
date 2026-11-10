/*
Test Documentation:
- Test Name: AuthService - isAuthenticated
- Purpose: Verify authentication state detection
- Scenario: User has valid token in sessionStorage
- Expected Result: Returns true when token exists, false otherwise
*/
/*
Test Documentation:
- Test Name: AuthService - authenticate
- Purpose: Verify user authentication process
- Scenario: User initiates authentication
- Expected Result: Token and userId stored in sessionStorage, promise resolves with credentials
*/
/*
Test Documentation:
- Test Name: AuthService - getToken
- Purpose: Verify token retrieval
- Scenario: Token exists in sessionStorage
- Expected Result: Returns stored token value
*/
/*
Test Documentation:
- Test Name: AuthService - getUserId
- Purpose: Verify userId retrieval
- Scenario: UserId exists in sessionStorage
- Expected Result: Returns stored userId value
*/
/*
Test Documentation:
- Test Name: AuthService - logout
- Purpose: Verify logout clears session data
- Scenario: User logs out
- Expected Result: Token and userId removed from sessionStorage
*/
/*
Coverage Report:
- Functions tested: isAuthenticated, authenticate, getToken, getUserId, logout
- Scenarios covered: authentication check, login flow, token retrieval, userId retrieval, logout flow, edge cases with missing data
- Uncovered scenarios: none - all public methods tested
*/

(function() {
  'use strict';

  describe('AuthService', function() {
    var AuthService, $window, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthService_, _$window_, _$rootScope_) {
      AuthService = _AuthService_;
      $window = _$window_;
      $rootScope = _$rootScope_;
      $window.sessionStorage.clear();
    }));

    afterEach(function() {
      $window.sessionStorage.clear();
    });

    describe('isAuthenticated', function() {
      it('should return false when no token exists', function() {
        expect(AuthService.isAuthenticated()).toBe(false);
      });

      it('should return true when token exists', function() {
        $window.sessionStorage.setItem('authToken', 'test-token');
        expect(AuthService.isAuthenticated()).toBe(true);
      });

      it('should return false when token is empty string', function() {
        $window.sessionStorage.setItem('authToken', '');
        expect(AuthService.isAuthenticated()).toBe(false);
      });
    });

    describe('authenticate', function() {
      it('should store token and userId in sessionStorage', function(done) {
        AuthService.authenticate().then(function(result) {
          expect($window.sessionStorage.getItem('authToken')).toContain('mock-jwt-token-');
          expect($window.sessionStorage.getItem('userId')).toBe('user-001');
          done();
        });
        $rootScope.$apply();
      });

      it('should resolve promise with token and userId', function(done) {
        AuthService.authenticate().then(function(result) {
          expect(result.token).toContain('mock-jwt-token-');
          expect(result.userId).toBe('user-001');
          done();
        });
        $rootScope.$apply();
      });

      it('should generate unique tokens on multiple calls', function(done) {
        var token1, token2;
        AuthService.authenticate().then(function(result) {
          token1 = result.token;
          return AuthService.authenticate();
        }).then(function(result) {
          token2 = result.token;
          expect(token1).not.toBe(token2);
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('getToken', function() {
      it('should return null when no token exists', function() {
        expect(AuthService.getToken()).toBeNull();
      });

      it('should return stored token', function() {
        $window.sessionStorage.setItem('authToken', 'test-token-123');
        expect(AuthService.getToken()).toBe('test-token-123');
      });
    });

    describe('getUserId', function() {
      it('should return null when no userId exists', function() {
        expect(AuthService.getUserId()).toBeNull();
      });

      it('should return stored userId', function() {
        $window.sessionStorage.setItem('userId', 'user-999');
        expect(AuthService.getUserId()).toBe('user-999');
      });
    });

    describe('logout', function() {
      it('should remove authToken from sessionStorage', function() {
        $window.sessionStorage.setItem('authToken', 'test-token');
        $window.sessionStorage.setItem('userId', 'user-001');
        AuthService.logout();
        expect($window.sessionStorage.getItem('authToken')).toBeNull();
      });

      it('should remove userId from sessionStorage', function() {
        $window.sessionStorage.setItem('authToken', 'test-token');
        $window.sessionStorage.setItem('userId', 'user-001');
        AuthService.logout();
        expect($window.sessionStorage.getItem('userId')).toBeNull();
      });

      it('should not throw error when called with empty sessionStorage', function() {
        expect(function() {
          AuthService.logout();
        }).not.toThrow();
      });
    });
  });
})();