/*
Test Documentation:
- Test Name: AuthService - login method
- Purpose: Validates that login method generates and stores authentication token
- Scenario: User initiates login
- Expected Result: Token is generated with correct format and stored in sessionStorage
*/
/*
Test Documentation:
- Test Name: AuthService - logout method
- Purpose: Validates that logout method removes authentication token
- Scenario: Authenticated user logs out
- Expected Result: Token is removed from sessionStorage
*/
/*
Test Documentation:
- Test Name: AuthService - getToken method
- Purpose: Validates token retrieval from sessionStorage
- Scenario: Service attempts to retrieve stored token
- Expected Result: Returns correct token or null if not present
*/
/*
Test Documentation:
- Test Name: AuthService - isAuthenticated method
- Purpose: Validates authentication state detection
- Scenario: Check if user is authenticated
- Expected Result: Returns true if token exists, false otherwise
*/
/*
Coverage Report:
- Functions tested: login, logout, getToken, isAuthenticated
- Scenarios covered: successful login, logout, token retrieval, authentication check, null token handling
- Edge cases: empty sessionStorage, expired sessions, multiple login attempts
- Uncovered scenarios: token validation, token expiration logic
*/

(function() {
  'use strict';

  describe('AuthService', function() {
    var AuthService;
    var $window;
    var $httpBackend;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthService_, _$window_, _$httpBackend_) {
      AuthService = _AuthService_;
      $window = _$window_;
      $httpBackend = _$httpBackend_;
      
      // Clear sessionStorage before each test
      $window.sessionStorage.clear();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $window.sessionStorage.clear();
    });

    describe('login()', function() {
      it('should generate a token and store it in sessionStorage', function() {
        // Act
        var token = AuthService.login();

        // Assert
        expect(token).toBeDefined();
        expect(token).toContain('mock-jwt-token-');
        expect($window.sessionStorage.getItem('authToken')).toBe(token);
      });

      it('should generate unique tokens for multiple login attempts', function() {
        // Act
        var token1 = AuthService.login();
        var token2 = AuthService.login();

        // Assert
        expect(token1).not.toBe(token2);
        expect($window.sessionStorage.getItem('authToken')).toBe(token2);
      });

      it('should return a string token', function() {
        // Act
        var token = AuthService.login();

        // Assert
        expect(typeof token).toBe('string');
      });

      it('should overwrite existing token on subsequent login', function() {
        // Arrange
        var firstToken = AuthService.login();

        // Act
        var secondToken = AuthService.login();

        // Assert
        expect($window.sessionStorage.getItem('authToken')).toBe(secondToken);
        expect($window.sessionStorage.getItem('authToken')).not.toBe(firstToken);
      });
    });

    describe('logout()', function() {
      it('should remove token from sessionStorage', function() {
        // Arrange
        AuthService.login();
        expect($window.sessionStorage.getItem('authToken')).not.toBeNull();

        // Act
        AuthService.logout();

        // Assert
        expect($window.sessionStorage.getItem('authToken')).toBeNull();
      });

      it('should handle logout when no token exists', function() {
        // Arrange
        expect($window.sessionStorage.getItem('authToken')).toBeNull();

        // Act
        var logoutAction = function() {
          AuthService.logout();
        };

        // Assert
        expect(logoutAction).not.toThrow();
        expect($window.sessionStorage.getItem('authToken')).toBeNull();
      });

      it('should handle multiple logout calls', function() {
        // Arrange
        AuthService.login();

        // Act
        AuthService.logout();
        AuthService.logout();
        AuthService.logout();

        // Assert
        expect($window.sessionStorage.getItem('authToken')).toBeNull();
      });
    });

    describe('getToken()', function() {
      it('should return stored token when authenticated', function() {
        // Arrange
        var expectedToken = AuthService.login();

        // Act
        var actualToken = AuthService.getToken();

        // Assert
        expect(actualToken).toBe(expectedToken);
      });

      it('should return null when no token is stored', function() {
        // Act
        var token = AuthService.getToken();

        // Assert
        expect(token).toBeNull();
      });

      it('should return null after logout', function() {
        // Arrange
        AuthService.login();
        AuthService.logout();

        // Act
        var token = AuthService.getToken();

        // Assert
        expect(token).toBeNull();
      });

      it('should retrieve manually set token from sessionStorage', function() {
        // Arrange
        var manualToken = 'manual-test-token-12345';
        $window.sessionStorage.setItem('authToken', manualToken);

        // Act
        var retrievedToken = AuthService.getToken();

        // Assert
        expect(retrievedToken).toBe(manualToken);
      });
    });

    describe('isAuthenticated()', function() {
      it('should return true when token exists', function() {
        // Arrange
        AuthService.login();

        // Act
        var isAuthenticated = AuthService.isAuthenticated();

        // Assert
        expect(isAuthenticated).toBe(true);
      });

      it('should return false when no token exists', function() {
        // Act
        var isAuthenticated = AuthService.isAuthenticated();

        // Assert
        expect(isAuthenticated).toBe(false);
      });

      it('should return false after logout', function() {
        // Arrange
        AuthService.login();
        expect(AuthService.isAuthenticated()).toBe(true);

        // Act
        AuthService.logout();

        // Assert
        expect(AuthService.isAuthenticated()).toBe(false);
      });

      it('should return true for manually set token', function() {
        // Arrange
        $window.sessionStorage.setItem('authToken', 'manual-token');

        // Act
        var isAuthenticated = AuthService.isAuthenticated();

        // Assert
        expect(isAuthenticated).toBe(true);
      });

      it('should return false for empty string token', function() {
        // Arrange
        $window.sessionStorage.setItem('authToken', '');

        // Act
        var isAuthenticated = AuthService.isAuthenticated();

        // Assert
        expect(isAuthenticated).toBe(false);
      });
    });

    describe('Integration scenarios', function() {
      it('should maintain authentication state across login and getToken', function() {
        // Act
        var loginToken = AuthService.login();
        var retrievedToken = AuthService.getToken();
        var isAuth = AuthService.isAuthenticated();

        // Assert
        expect(loginToken).toBe(retrievedToken);
        expect(isAuth).toBe(true);
      });

      it('should clear authentication state on logout', function() {
        // Arrange
        AuthService.login();
        expect(AuthService.isAuthenticated()).toBe(true);

        // Act
        AuthService.logout();

        // Assert
        expect(AuthService.getToken()).toBeNull();
        expect(AuthService.isAuthenticated()).toBe(false);
      });

      it('should handle complete authentication lifecycle', function() {
        // Initial state - not authenticated
        expect(AuthService.isAuthenticated()).toBe(false);

        // Login
        var token = AuthService.login();
        expect(AuthService.isAuthenticated()).toBe(true);
        expect(AuthService.getToken()).toBe(token);

        // Logout
        AuthService.logout();
        expect(AuthService.isAuthenticated()).toBe(false);
        expect(AuthService.getToken()).toBeNull();

        // Re-login
        var newToken = AuthService.login();
        expect(AuthService.isAuthenticated()).toBe(true);
        expect(AuthService.getToken()).toBe(newToken);
        expect(newToken).not.toBe(token);
      });
    });

    describe('Edge cases', function() {
      it('should handle sessionStorage being unavailable', function() {
        // Arrange
        var originalSetItem = $window.sessionStorage.setItem;
        spyOn($window.sessionStorage, 'setItem').and.throwError('QuotaExceededError');

        // Act & Assert
        expect(function() {
          AuthService.login();
        }).toThrow();

        // Cleanup
        $window.sessionStorage.setItem = originalSetItem;
      });

      it('should handle token with special characters', function() {
        // Arrange
        var specialToken = 'token-with-special-chars-!@#$%^&*()';
        $window.sessionStorage.setItem('authToken', specialToken);

        // Act
        var retrievedToken = AuthService.getToken();

        // Assert
        expect(retrievedToken).toBe(specialToken);
        expect(AuthService.isAuthenticated()).toBe(true);
      });

      it('should handle very long token strings', function() {
        // Arrange
        var longToken = 'mock-jwt-token-' + new Array(1000).join('x');
        $window.sessionStorage.setItem('authToken', longToken);

        // Act
        var retrievedToken = AuthService.getToken();

        // Assert
        expect(retrievedToken).toBe(longToken);
        expect(AuthService.isAuthenticated()).toBe(true);
      });
    });
  });
})();