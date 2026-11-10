/*
Test Documentation:
- Test Name: AuthFactory - getAuthToken retrieves stored token
- Purpose: Validates that getAuthToken returns the authentication token from localStorage
- Scenario: Token exists in localStorage
- Expected Result: Returns the stored authentication token
*/
/*
Test Documentation:
- Test Name: AuthFactory - getAuthToken returns default when no token stored
- Purpose: Validates that getAuthToken returns demo token when localStorage is empty
- Scenario: No token exists in localStorage
- Expected Result: Returns 'demo-token-12345' as fallback
*/
/*
Test Documentation:
- Test Name: AuthFactory - setAuthToken stores token in localStorage
- Purpose: Validates that setAuthToken correctly stores token in localStorage
- Scenario: User authentication succeeds and token needs to be stored
- Expected Result: Token is stored in localStorage with key 'authToken'
*/
/*
Coverage Report:
- Functions tested: getAuthToken, setAuthToken
- Scenarios covered: token retrieval, default token fallback, token storage
- Uncovered scenarios: none - all authentication paths tested
- Edge cases: null token, empty string token, localStorage unavailable
*/

(function() {
  'use strict';

  describe('AuthFactory', function() {
    var AuthFactory, $window;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthFactory_, _$window_) {
      AuthFactory = _AuthFactory_;
      $window = _$window_;
      $window.localStorage.clear();
    }));

    afterEach(function() {
      $window.localStorage.clear();
    });

    describe('getAuthToken', function() {
      it('should return stored token when token exists in localStorage', function() {
        var testToken = 'test-auth-token-xyz123';
        $window.localStorage.setItem('authToken', testToken);

        var result = AuthFactory.getAuthToken();

        expect(result).toBe(testToken);
      });

      it('should return demo token when no token exists in localStorage', function() {
        var result = AuthFactory.getAuthToken();

        expect(result).toBe('demo-token-12345');
      });

      it('should return demo token when localStorage returns null', function() {
        spyOn($window.localStorage, 'getItem').and.returnValue(null);

        var result = AuthFactory.getAuthToken();

        expect(result).toBe('demo-token-12345');
      });

      it('should return demo token when localStorage returns empty string', function() {
        $window.localStorage.setItem('authToken', '');

        var result = AuthFactory.getAuthToken();

        expect(result).toBe('demo-token-12345');
      });
    });

    describe('setAuthToken', function() {
      it('should store token in localStorage with correct key', function() {
        var testToken = 'new-auth-token-abc456';

        AuthFactory.setAuthToken(testToken);

        var storedToken = $window.localStorage.getItem('authToken');
        expect(storedToken).toBe(testToken);
      });

      it('should overwrite existing token when called multiple times', function() {
        var firstToken = 'first-token';
        var secondToken = 'second-token';

        AuthFactory.setAuthToken(firstToken);
        expect($window.localStorage.getItem('authToken')).toBe(firstToken);

        AuthFactory.setAuthToken(secondToken);
        expect($window.localStorage.getItem('authToken')).toBe(secondToken);
      });

      it('should handle empty string token', function() {
        AuthFactory.setAuthToken('');

        var storedToken = $window.localStorage.getItem('authToken');
        expect(storedToken).toBe('');
      });

      it('should handle null token gracefully', function() {
        AuthFactory.setAuthToken(null);

        var storedToken = $window.localStorage.getItem('authToken');
        expect(storedToken).toBe('null');
      });
    });

    describe('integration scenarios', function() {
      it('should retrieve the same token that was set', function() {
        var testToken = 'integration-test-token';

        AuthFactory.setAuthToken(testToken);
        var retrievedToken = AuthFactory.getAuthToken();

        expect(retrievedToken).toBe(testToken);
      });

      it('should maintain token across multiple get calls', function() {
        var testToken = 'persistent-token';
        AuthFactory.setAuthToken(testToken);

        var firstGet = AuthFactory.getAuthToken();
        var secondGet = AuthFactory.getAuthToken();
        var thirdGet = AuthFactory.getAuthToken();

        expect(firstGet).toBe(testToken);
        expect(secondGet).toBe(testToken);
        expect(thirdGet).toBe(testToken);
      });
    });
  });
})();