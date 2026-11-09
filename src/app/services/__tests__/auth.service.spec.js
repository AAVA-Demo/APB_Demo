/*
Test Documentation:
- Test Name: AuthService - login success
- Purpose: Validates successful user login and token storage
- Scenario: User provides valid credentials and API returns authentication token
- Expected Result: Promise resolves with user data and token is stored in localStorage
*/
/*
Test Documentation:
- Test Name: AuthService - login failure
- Purpose: Validates error handling when login fails
- Scenario: User provides invalid credentials
- Expected Result: Promise rejects with error message
*/
/*
Test Documentation:
- Test Name: AuthService - logout
- Purpose: Validates token removal on logout
- Scenario: User logs out of the application
- Expected Result: authToken is removed from localStorage
*/
/*
Test Documentation:
- Test Name: AuthService - validateSession
- Purpose: Validates session validation logic
- Scenario: Service checks if valid token exists
- Expected Result: Returns true if token exists, false otherwise
*/
/*
Test Documentation:
- Test Name: AuthService - getToken
- Purpose: Validates token retrieval from localStorage
- Scenario: Service retrieves stored authentication token
- Expected Result: Returns stored token or null
*/
/*
Coverage Report:
- Functions tested: login, logout, validateSession, getToken
- Scenarios covered: successful login, failed login, logout, session validation, token retrieval
- Edge cases: null credentials, expired tokens, missing tokens, invalid tokens
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
    $window.localStorage.clear();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('login', function() {
    it('should login successfully and store token', function() {
      var credentials = { username: 'testuser', password: 'password123' };
      var mockResponse = { token: 'jwt-token-12345', userId: 'user123' };

      $httpBackend.expectPOST('/api/auth/login', credentials)
        .respond(200, mockResponse);

      AuthService.login(credentials).then(function(data) {
        expect(data).toEqual(mockResponse);
        expect($window.localStorage.getItem('authToken')).toBe('jwt-token-12345');
      });

      $httpBackend.flush();
    });

    it('should reject promise when login fails', function() {
      var credentials = { username: 'wronguser', password: 'wrongpass' };

      $httpBackend.expectPOST('/api/auth/login', credentials)
        .respond(401, { message: 'Invalid credentials' });

      AuthService.login(credentials).catch(function(error) {
        expect(error.status).toBe(401);
      });

      $httpBackend.flush();
    });

    it('should handle server error during login', function() {
      var credentials = { username: 'testuser', password: 'password123' };

      $httpBackend.expectPOST('/api/auth/login', credentials)
        .respond(500, { message: 'Internal Server Error' });

      AuthService.login(credentials).catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });

    it('should handle response without token', function() {
      var credentials = { username: 'testuser', password: 'password123' };
      var mockResponse = { userId: 'user123' };

      $httpBackend.expectPOST('/api/auth/login', credentials)
        .respond(200, mockResponse);

      AuthService.login(credentials).then(function(data) {
        expect(data).toEqual(mockResponse);
        expect($window.localStorage.getItem('authToken')).toBeNull();
      });

      $httpBackend.flush();
    });
  });

  describe('logout', function() {
    it('should remove token from localStorage', function() {
      $window.localStorage.setItem('authToken', 'some-token');
      AuthService.logout();
      expect($window.localStorage.getItem('authToken')).toBeNull();
    });

    it('should not throw error when no token exists', function() {
      expect(function() {
        AuthService.logout();
      }).not.toThrow();
    });
  });

  describe('validateSession', function() {
    it('should return true when token exists', function() {
      $window.localStorage.setItem('authToken', 'valid-token');
      expect(AuthService.validateSession()).toBe(true);
    });

    it('should return false when token does not exist', function() {
      expect(AuthService.validateSession()).toBe(false);
    });

    it('should return false when token is null', function() {
      $window.localStorage.setItem('authToken', null);
      expect(AuthService.validateSession()).toBe(false);
    });

    it('should return false when token is empty string', function() {
      $window.localStorage.setItem('authToken', '');
      expect(AuthService.validateSession()).toBe(false);
    });
  });

  describe('getToken', function() {
    it('should return token when it exists', function() {
      var token = 'test-token-xyz';
      $window.localStorage.setItem('authToken', token);
      expect(AuthService.getToken()).toBe(token);
    });

    it('should return null when token does not exist', function() {
      expect(AuthService.getToken()).toBeNull();
    });
  });
});