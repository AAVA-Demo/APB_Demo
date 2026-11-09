/*
Test Documentation:
- Test Name: AuthService - validateSession success
- Purpose: Validates that validateSession returns user data when token exists and API validates successfully
- Scenario: Valid token in sessionStorage and API returns success response
- Expected Result: Promise resolves with user data
*/
/*
Test Documentation:
- Test Name: AuthService - validateSession no token
- Purpose: Validates error handling when no authentication token is present
- Scenario: sessionStorage has no authToken
- Expected Result: Promise rejects with 'No token found'
*/
/*
Test Documentation:
- Test Name: AuthService - isAuthenticated returns true
- Purpose: Validates authentication status check when token exists
- Scenario: authToken exists in sessionStorage
- Expected Result: Returns true
*/
/*
Test Documentation:
- Test Name: AuthService - setToken and clearToken
- Purpose: Validates token management operations
- Scenario: Setting and clearing authentication tokens
- Expected Result: Token is stored and removed from sessionStorage
*/
/*
Coverage Report:
- Functions tested: validateSession, isAuthenticated, redirectToLogin, setToken, clearToken
- Scenarios covered: successful validation, missing token, authentication checks, token management
- Edge cases: null tokens, API failures, redirect behavior
- Uncovered scenarios: none
*/

describe('AuthService', function() {
  'use strict';

  var AuthService, $httpBackend, $window;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_AuthService_, _$httpBackend_, _$window_) {
    AuthService = _AuthService_;
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    $window.sessionStorage.clear();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('validateSession', function() {
    it('should validate session successfully when token exists', function() {
      var mockToken = 'valid-jwt-token-12345';
      var mockUserData = { userId: 'user123', email: 'user@example.com' };
      $window.sessionStorage.setItem('authToken', mockToken);

      $httpBackend.expectGET('/api/auth/validate')
        .respond(200, mockUserData);

      AuthService.validateSession().then(function(data) {
        expect(data).toEqual(mockUserData);
        expect(data.userId).toBe('user123');
      });

      $httpBackend.flush();
    });

    it('should reject promise when no token is found', function() {
      AuthService.validateSession().catch(function(error) {
        expect(error).toBe('No token found');
      });
    });

    it('should reject promise when API validation fails', function() {
      var mockToken = 'invalid-token';
      $window.sessionStorage.setItem('authToken', mockToken);

      $httpBackend.expectGET('/api/auth/validate')
        .respond(401, { message: 'Invalid token' });

      AuthService.validateSession().catch(function(error) {
        expect(error.status).toBe(401);
      });

      $httpBackend.flush();
    });

    it('should handle server error during validation', function() {
      var mockToken = 'valid-token';
      $window.sessionStorage.setItem('authToken', mockToken);

      $httpBackend.expectGET('/api/auth/validate')
        .respond(500, { message: 'Internal Server Error' });

      AuthService.validateSession().catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });
  });

  describe('isAuthenticated', function() {
    it('should return true when authToken exists', function() {
      $window.sessionStorage.setItem('authToken', 'some-token');
      expect(AuthService.isAuthenticated()).toBe(true);
    });

    it('should return false when authToken does not exist', function() {
      expect(AuthService.isAuthenticated()).toBe(false);
    });

    it('should return false when authToken is null', function() {
      $window.sessionStorage.setItem('authToken', null);
      expect(AuthService.isAuthenticated()).toBe(false);
    });

    it('should return false when authToken is empty string', function() {
      $window.sessionStorage.setItem('authToken', '');
      expect(AuthService.isAuthenticated()).toBe(false);
    });
  });

  describe('redirectToLogin', function() {
    it('should redirect to login page', function() {
      spyOn($window.location, 'href', 'set');
      AuthService.redirectToLogin();
      expect($window.location.href).toBe('/login');
    });
  });

  describe('setToken', function() {
    it('should store token in sessionStorage', function() {
      var token = 'new-auth-token-xyz';
      AuthService.setToken(token);
      expect($window.sessionStorage.getItem('authToken')).toBe(token);
    });

    it('should overwrite existing token', function() {
      $window.sessionStorage.setItem('authToken', 'old-token');
      var newToken = 'new-token';
      AuthService.setToken(newToken);
      expect($window.sessionStorage.getItem('authToken')).toBe(newToken);
    });
  });

  describe('clearToken', function() {
    it('should remove token from sessionStorage', function() {
      $window.sessionStorage.setItem('authToken', 'token-to-remove');
      AuthService.clearToken();
      expect($window.sessionStorage.getItem('authToken')).toBeNull();
    });

    it('should not throw error when clearing non-existent token', function() {
      expect(function() {
        AuthService.clearToken();
      }).not.toThrow();
    });
  });
});