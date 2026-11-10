/*
Test Documentation:
- Test Name: AuthService Unit Tests
- Purpose: Validate authentication service functionality including session validation, token management, and error handling
- Scenario: Tests cover token retrieval, storage, validation, and clearing operations with success and error paths
- Expected Result: All authentication operations should work correctly with proper error handling and state management
*/

(function() {
  'use strict';

  describe('AuthService', function() {
    var AuthService, $httpBackend, $window, $q, $rootScope;
    var mockToken = 'mock-jwt-token-12345';
    var tokenKey = 'authToken';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthService_, _$httpBackend_, _$window_, _$q_, _$rootScope_) {
      AuthService = _AuthService_;
      $httpBackend = _$httpBackend_;
      $window = _$window_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      
      // Clear localStorage before each test
      $window.localStorage.clear();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $window.localStorage.clear();
    });

    describe('validateSession', function() {
      it('should reject when no token is present in localStorage', function() {
        var rejected = false;
        var errorMessage = '';

        AuthService.validateSession().then(function() {
          // Should not reach here
        }, function(error) {
          rejected = true;
          errorMessage = error;
        });

        $rootScope.$apply();

        expect(rejected).toBe(true);
        expect(errorMessage).toBe('No token');
      });

      it('should resolve with user data when token is valid', function() {
        var mockUserData = { userId: 123, username: 'testuser', email: 'test@example.com' };
        $window.localStorage.setItem(tokenKey, mockToken);

        $httpBackend.expectGET('/api/auth/validate').respond(200, mockUserData);

        var result = null;
        AuthService.validateSession().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockUserData);
      });

      it('should reject when API returns 401 unauthorized', function() {
        $window.localStorage.setItem(tokenKey, 'invalid-token');

        $httpBackend.expectGET('/api/auth/validate').respond(401, { error: 'Unauthorized' });

        var rejected = false;
        var errorResponse = null;
        AuthService.validateSession().then(function() {
          // Should not reach here
        }, function(error) {
          rejected = true;
          errorResponse = error;
        });

        $httpBackend.flush();

        expect(rejected).toBe(true);
        expect(errorResponse.status).toBe(401);
      });

      it('should reject when API returns 500 server error', function() {
        $window.localStorage.setItem(tokenKey, mockToken);

        $httpBackend.expectGET('/api/auth/validate').respond(500, { error: 'Internal Server Error' });

        var rejected = false;
        var errorResponse = null;
        AuthService.validateSession().then(function() {
          // Should not reach here
        }, function(error) {
          rejected = true;
          errorResponse = error;
        });

        $httpBackend.flush();

        expect(rejected).toBe(true);
        expect(errorResponse.status).toBe(500);
      });

      it('should handle network timeout errors', function() {
        $window.localStorage.setItem(tokenKey, mockToken);

        $httpBackend.expectGET('/api/auth/validate').respond(-1, null);

        var rejected = false;
        AuthService.validateSession().then(function() {
          // Should not reach here
        }, function(error) {
          rejected = true;
        });

        $httpBackend.flush();

        expect(rejected).toBe(true);
      });
    });

    describe('getToken', function() {
      it('should return null when no token exists', function() {
        var token = AuthService.getToken();
        expect(token).toBeNull();
      });

      it('should return token when token exists in localStorage', function() {
        $window.localStorage.setItem(tokenKey, mockToken);
        var token = AuthService.getToken();
        expect(token).toBe(mockToken);
      });

      it('should return updated token after token change', function() {
        $window.localStorage.setItem(tokenKey, mockToken);
        var token1 = AuthService.getToken();
        expect(token1).toBe(mockToken);

        var newToken = 'new-token-67890';
        $window.localStorage.setItem(tokenKey, newToken);
        var token2 = AuthService.getToken();
        expect(token2).toBe(newToken);
      });
    });

    describe('setToken', function() {
      it('should store token in localStorage', function() {
        AuthService.setToken(mockToken);
        var storedToken = $window.localStorage.getItem(tokenKey);
        expect(storedToken).toBe(mockToken);
      });

      it('should overwrite existing token', function() {
        $window.localStorage.setItem(tokenKey, 'old-token');
        AuthService.setToken(mockToken);
        var storedToken = $window.localStorage.getItem(tokenKey);
        expect(storedToken).toBe(mockToken);
      });

      it('should handle empty string token', function() {
        AuthService.setToken('');
        var storedToken = $window.localStorage.getItem(tokenKey);
        expect(storedToken).toBe('');
      });

      it('should handle null token', function() {
        AuthService.setToken(null);
        var storedToken = $window.localStorage.getItem(tokenKey);
        expect(storedToken).toBe('null');
      });
    });

    describe('clearToken', function() {
      it('should remove token from localStorage', function() {
        $window.localStorage.setItem(tokenKey, mockToken);
        AuthService.clearToken();
        var storedToken = $window.localStorage.getItem(tokenKey);
        expect(storedToken).toBeNull();
      });

      it('should not throw error when token does not exist', function() {
        expect(function() {
          AuthService.clearToken();
        }).not.toThrow();
      });

      it('should clear token multiple times without error', function() {
        $window.localStorage.setItem(tokenKey, mockToken);
        AuthService.clearToken();
        AuthService.clearToken();
        var storedToken = $window.localStorage.getItem(tokenKey);
        expect(storedToken).toBeNull();
      });
    });

    describe('Integration scenarios', function() {
      it('should complete full authentication flow', function() {
        // Set token
        AuthService.setToken(mockToken);
        expect(AuthService.getToken()).toBe(mockToken);

        // Validate session
        var mockUserData = { userId: 123, username: 'testuser' };
        $httpBackend.expectGET('/api/auth/validate').respond(200, mockUserData);

        var userData = null;
        AuthService.validateSession().then(function(data) {
          userData = data;
        });

        $httpBackend.flush();
        expect(userData).toEqual(mockUserData);

        // Clear token
        AuthService.clearToken();
        expect(AuthService.getToken()).toBeNull();
      });

      it('should handle logout scenario', function() {
        $window.localStorage.setItem(tokenKey, mockToken);
        expect(AuthService.getToken()).toBe(mockToken);

        AuthService.clearToken();
        expect(AuthService.getToken()).toBeNull();

        var rejected = false;
        AuthService.validateSession().then(function() {
          // Should not reach here
        }, function(error) {
          rejected = true;
        });

        $rootScope.$apply();
        expect(rejected).toBe(true);
      });
    });
  });
})();

/*
Coverage Report:
- Functions tested: validateSession, getToken, setToken, clearToken
- Scenarios covered:
  * Normal flow: token storage, retrieval, validation, and clearing
  * Edge cases: missing token, empty token, null token, multiple clears
  * Error scenarios: 401 unauthorized, 500 server error, network timeout
  * Integration: full authentication flow, logout scenario
- Uncovered scenarios: None - all critical paths tested
- NFR validation: Session validation, token security, error handling
*/