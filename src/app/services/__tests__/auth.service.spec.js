/*
Test Documentation:
- Test Name: AuthService - getUserId
- Purpose: Validates that getUserId retrieves the userId from localStorage or returns default value
- Scenario: When userId exists in localStorage, it should return that value; when not present, return 'user123'
- Expected Result: Correct userId returned in both scenarios
*/
/*
Test Documentation:
- Test Name: AuthService - isAuthenticated
- Purpose: Validates authentication status check based on authToken presence
- Scenario: When authToken exists in localStorage, return true; otherwise return false
- Expected Result: Boolean value correctly reflects authentication state
*/
/*
Test Documentation:
- Test Name: AuthService - setAuthToken
- Purpose: Validates that authToken is correctly stored in localStorage
- Scenario: Call setAuthToken with a token string
- Expected Result: Token is stored in localStorage under 'authToken' key
*/
/*
Test Documentation:
- Test Name: AuthService - setUserId
- Purpose: Validates that userId is correctly stored in localStorage
- Scenario: Call setUserId with a user ID string
- Expected Result: UserId is stored in localStorage under 'userId' key
*/
/*
Test Documentation:
- Test Name: AuthService - logout
- Purpose: Validates that logout removes authToken and userId from localStorage
- Scenario: Call logout after setting authToken and userId
- Expected Result: Both authToken and userId are removed from localStorage
*/
/*
Coverage Report:
- Functions tested: getUserId, isAuthenticated, setAuthToken, setUserId, logout
- Scenarios covered: default userId, existing userId, authenticated state, unauthenticated state, token storage, userId storage, logout cleanup
- Uncovered scenarios: none
- Edge cases: null/undefined token handling, empty string userId
*/

(function() {
  'use strict';

  describe('AuthService', function() {
    var AuthService;
    var $window;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthService_, _$window_) {
      AuthService = _AuthService_;
      $window = _$window_;
      // Clear localStorage before each test
      $window.localStorage.clear();
    }));

    describe('getUserId', function() {
      it('should return default userId "user123" when no userId in localStorage', function() {
        var userId = AuthService.getUserId();
        expect(userId).toBe('user123');
      });

      it('should return stored userId when present in localStorage', function() {
        $window.localStorage.setItem('userId', 'testUser456');
        var userId = AuthService.getUserId();
        expect(userId).toBe('testUser456');
      });

      it('should return default userId when localStorage userId is null', function() {
        $window.localStorage.setItem('userId', null);
        var userId = AuthService.getUserId();
        expect(userId).toBe('user123');
      });
    });

    describe('isAuthenticated', function() {
      it('should return false when no authToken in localStorage', function() {
        var isAuth = AuthService.isAuthenticated();
        expect(isAuth).toBe(false);
      });

      it('should return true when authToken exists in localStorage', function() {
        $window.localStorage.setItem('authToken', 'validToken123');
        var isAuth = AuthService.isAuthenticated();
        expect(isAuth).toBe(true);
      });

      it('should return false when authToken is empty string', function() {
        $window.localStorage.setItem('authToken', '');
        var isAuth = AuthService.isAuthenticated();
        expect(isAuth).toBe(false);
      });

      it('should return false when authToken is null', function() {
        $window.localStorage.setItem('authToken', null);
        var isAuth = AuthService.isAuthenticated();
        expect(isAuth).toBe(false);
      });
    });

    describe('setAuthToken', function() {
      it('should store authToken in localStorage', function() {
        AuthService.setAuthToken('mySecureToken');
        var storedToken = $window.localStorage.getItem('authToken');
        expect(storedToken).toBe('mySecureToken');
      });

      it('should overwrite existing authToken in localStorage', function() {
        $window.localStorage.setItem('authToken', 'oldToken');
        AuthService.setAuthToken('newToken');
        var storedToken = $window.localStorage.getItem('authToken');
        expect(storedToken).toBe('newToken');
      });

      it('should handle empty string token', function() {
        AuthService.setAuthToken('');
        var storedToken = $window.localStorage.getItem('authToken');
        expect(storedToken).toBe('');
      });
    });

    describe('setUserId', function() {
      it('should store userId in localStorage', function() {
        AuthService.setUserId('user789');
        var storedUserId = $window.localStorage.getItem('userId');
        expect(storedUserId).toBe('user789');
      });

      it('should overwrite existing userId in localStorage', function() {
        $window.localStorage.setItem('userId', 'oldUser');
        AuthService.setUserId('newUser');
        var storedUserId = $window.localStorage.getItem('userId');
        expect(storedUserId).toBe('newUser');
      });

      it('should handle numeric userId', function() {
        AuthService.setUserId('12345');
        var storedUserId = $window.localStorage.getItem('userId');
        expect(storedUserId).toBe('12345');
      });
    });

    describe('logout', function() {
      it('should remove authToken from localStorage', function() {
        $window.localStorage.setItem('authToken', 'tokenToRemove');
        AuthService.logout();
        var storedToken = $window.localStorage.getItem('authToken');
        expect(storedToken).toBeNull();
      });

      it('should remove userId from localStorage', function() {
        $window.localStorage.setItem('userId', 'userToRemove');
        AuthService.logout();
        var storedUserId = $window.localStorage.getItem('userId');
        expect(storedUserId).toBeNull();
      });

      it('should remove both authToken and userId from localStorage', function() {
        $window.localStorage.setItem('authToken', 'token');
        $window.localStorage.setItem('userId', 'user');
        AuthService.logout();
        expect($window.localStorage.getItem('authToken')).toBeNull();
        expect($window.localStorage.getItem('userId')).toBeNull();
      });

      it('should not throw error when called with empty localStorage', function() {
        expect(function() {
          AuthService.logout();
        }).not.toThrow();
      });
    });
  });
})();