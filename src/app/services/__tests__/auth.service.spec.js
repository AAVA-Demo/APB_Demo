/*
Test Documentation:
- Test Name: AuthService Test Suite
- Purpose: Validate session validation and user ID retrieval from sessionStorage
- Scenario: Tests cover valid session, invalid session, missing token, and getUserId with fallback
- Expected Result: Service correctly validates sessions and retrieves user IDs with proper fallback behavior
*/

(function() {
  'use strict';

  describe('AuthService', function() {
    var AuthService, $window, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthService_, _$window_, _$q_, _$rootScope_) {
      AuthService = _AuthService_;
      $window = _$window_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      $window.sessionStorage.clear();
    }));

    describe('validateSession', function() {
      it('should resolve with valid session when token exists', function() {
        $window.sessionStorage.setItem('authToken', 'test-token-123');
        $window.sessionStorage.setItem('userId', 'user-456');

        var result;
        AuthService.validateSession().then(function(session) {
          result = session;
        });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result.valid).toBe(true);
        expect(result.userId).toBe('user-456');
      });

      it('should reject when token does not exist', function() {
        var error;
        AuthService.validateSession().catch(function(err) {
          error = err;
        });

        $rootScope.$apply();

        expect(error).toBeDefined();
        expect(error.valid).toBe(false);
      });

      it('should resolve with userId from sessionStorage', function() {
        $window.sessionStorage.setItem('authToken', 'valid-token');
        $window.sessionStorage.setItem('userId', 'user-789');

        var result;
        AuthService.validateSession().then(function(session) {
          result = session;
        });

        $rootScope.$apply();

        expect(result.userId).toBe('user-789');
      });

      it('should handle null token gracefully', function() {
        $window.sessionStorage.removeItem('authToken');

        var error;
        AuthService.validateSession().catch(function(err) {
          error = err;
        });

        $rootScope.$apply();

        expect(error.valid).toBe(false);
      });
    });

    describe('getUserId', function() {
      it('should return userId from sessionStorage when available', function() {
        $window.sessionStorage.setItem('userId', 'user-123');

        var result = AuthService.getUserId();

        expect(result).toBe('user-123');
      });

      it('should return default userId when sessionStorage is empty', function() {
        $window.sessionStorage.removeItem('userId');

        var result = AuthService.getUserId();

        expect(result).toBe('user-123');
      });

      it('should handle null userId in sessionStorage', function() {
        $window.sessionStorage.setItem('userId', null);

        var result = AuthService.getUserId();

        expect(result).toBe('user-123');
      });

      it('should return userId immediately without promise', function() {
        $window.sessionStorage.setItem('userId', 'user-999');

        var result = AuthService.getUserId();

        expect(typeof result).toBe('string');
        expect(result).toBe('user-999');
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: validateSession, getUserId
- Scenarios covered:
  * Valid session with token and userId
  * Invalid session without token
  * getUserId with existing userId
  * getUserId with fallback to default
  * Null and missing token/userId handling
- Uncovered scenarios: Token expiration validation, token format validation
*/