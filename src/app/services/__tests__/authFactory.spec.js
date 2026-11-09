/*
Test Documentation:
- Test Name: authFactory - getToken retrieves token from localStorage
- Purpose: Validates that getToken returns the stored authentication token
- Scenario: Token exists in localStorage
- Expected Result: Returns the stored token value

- Test Name: authFactory - getToken returns mock token when no token stored
- Purpose: Validates fallback behavior when no token is stored
- Scenario: localStorage has no authToken
- Expected Result: Returns 'mock-token-12345'

- Test Name: authFactory - getUserId retrieves userId from localStorage
- Purpose: Validates that getUserId returns the stored user identifier
- Scenario: userId exists in localStorage
- Expected Result: Returns the stored userId value

- Test Name: authFactory - getUserId returns default userId when not stored
- Purpose: Validates fallback behavior when no userId is stored
- Scenario: localStorage has no userId
- Expected Result: Returns 'user-001'

- Test Name: authFactory - setToken stores token in localStorage
- Purpose: Validates that setToken persists authentication token
- Scenario: setToken is called with a token value
- Expected Result: Token is stored in localStorage under 'authToken' key

- Test Name: authFactory - setUserId stores userId in localStorage
- Purpose: Validates that setUserId persists user identifier
- Scenario: setUserId is called with a userId value
- Expected Result: userId is stored in localStorage under 'userId' key

Coverage Report:
- Functions tested: getToken, getUserId, setToken, setUserId
- Scenarios covered: token retrieval with and without stored value, userId retrieval with and without stored value, token storage, userId storage
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('authFactory', function() {
    var authFactory;
    var $window;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_authFactory_, _$window_) {
      authFactory = _authFactory_;
      $window = _$window_;
      spyOn($window.localStorage, 'getItem').and.callThrough();
      spyOn($window.localStorage, 'setItem').and.callThrough();
    }));

    afterEach(function() {
      $window.localStorage.clear();
    });

    describe('getToken', function() {
      it('should retrieve token from localStorage when token exists', function() {
        $window.localStorage.setItem('authToken', 'test-token-abc');
        $window.localStorage.getItem.and.returnValue('test-token-abc');
        var token = authFactory.getToken();
        expect($window.localStorage.getItem).toHaveBeenCalledWith('authToken');
        expect(token).toBe('test-token-abc');
      });

      it('should return mock token when no token is stored in localStorage', function() {
        $window.localStorage.getItem.and.returnValue(null);
        var token = authFactory.getToken();
        expect($window.localStorage.getItem).toHaveBeenCalledWith('authToken');
        expect(token).toBe('mock-token-12345');
      });
    });

    describe('getUserId', function() {
      it('should retrieve userId from localStorage when userId exists', function() {
        $window.localStorage.setItem('userId', 'user-123');
        $window.localStorage.getItem.and.returnValue('user-123');
        var userId = authFactory.getUserId();
        expect($window.localStorage.getItem).toHaveBeenCalledWith('userId');
        expect(userId).toBe('user-123');
      });

      it('should return default userId when no userId is stored in localStorage', function() {
        $window.localStorage.getItem.and.returnValue(null);
        var userId = authFactory.getUserId();
        expect($window.localStorage.getItem).toHaveBeenCalledWith('userId');
        expect(userId).toBe('user-001');
      });
    });

    describe('setToken', function() {
      it('should store token in localStorage', function() {
        authFactory.setToken('new-auth-token');
        expect($window.localStorage.setItem).toHaveBeenCalledWith('authToken', 'new-auth-token');
      });

      it('should handle empty string token', function() {
        authFactory.setToken('');
        expect($window.localStorage.setItem).toHaveBeenCalledWith('authToken', '');
      });
    });

    describe('setUserId', function() {
      it('should store userId in localStorage', function() {
        authFactory.setUserId('user-456');
        expect($window.localStorage.setItem).toHaveBeenCalledWith('userId', 'user-456');
      });

      it('should handle empty string userId', function() {
        authFactory.setUserId('');
        expect($window.localStorage.setItem).toHaveBeenCalledWith('userId', '');
      });
    });
  });
})();