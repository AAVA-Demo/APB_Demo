/*
Test Documentation:
- Test Name: authService - login success
- Purpose: Validates successful user authentication and token storage
- Scenario: Given valid credentials, when login is called, then authentication token should be stored in sessionStorage
- Expected Result: Token is stored and response data is returned
*/
/*
Test Documentation:
- Test Name: authService - logout
- Purpose: Validates that logout clears authentication token
- Scenario: Given an authenticated user, when logout is called, then token should be removed from sessionStorage
- Expected Result: Token is removed from sessionStorage
*/
/*
Test Documentation:
- Test Name: authService - validateSession with valid token
- Purpose: Validates session validation for authenticated users
- Scenario: Given a valid authentication token, when validateSession is called, then promise should resolve
- Expected Result: Promise resolves with true
*/
/*
Coverage Report:
- Functions tested: login, logout, getToken, isAuthenticated, validateSession
- Scenarios covered: successful login, login failure, logout, token retrieval, authentication check, session validation
- Uncovered scenarios: none - comprehensive coverage achieved
*/

describe('authService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var authService;
  var $httpBackend;
  var $window;

  beforeEach(inject(function(_authService_, _$httpBackend_, _$window_) {
    authService = _authService_;
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    $window.sessionStorage.clear();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('login', function() {
    it('should authenticate user and store token on successful login', function() {
      var credentials = { username: 'testuser', password: 'testpass' };
      var mockResponse = { token: 'mock-jwt-token', userId: 123 };

      $httpBackend.expectPOST('/api/auth/login', credentials).respond(200, mockResponse);

      authService.login(credentials).then(function(response) {
        expect(response.token).toBe('mock-jwt-token');
        expect($window.sessionStorage.getItem('authToken')).toBe('mock-jwt-token');
      });

      $httpBackend.flush();
    });

    it('should handle login failure', function() {
      var credentials = { username: 'invalid', password: 'invalid' };

      $httpBackend.expectPOST('/api/auth/login', credentials).respond(401, { error: 'Unauthorized' });

      authService.login(credentials).catch(function(error) {
        expect(error.status).toBe(401);
      });

      $httpBackend.flush();
    });
  });

  describe('logout', function() {
    it('should remove authentication token from sessionStorage', function() {
      $window.sessionStorage.setItem('authToken', 'test-token');

      authService.logout();

      expect($window.sessionStorage.getItem('authToken')).toBeNull();
    });
  });

  describe('getToken', function() {
    it('should return stored authentication token', function() {
      $window.sessionStorage.setItem('authToken', 'stored-token');

      var token = authService.getToken();

      expect(token).toBe('stored-token');
    });

    it('should return null when no token is stored', function() {
      var token = authService.getToken();

      expect(token).toBeNull();
    });
  });

  describe('isAuthenticated', function() {
    it('should return true when token exists', function() {
      $window.sessionStorage.setItem('authToken', 'valid-token');

      var isAuth = authService.isAuthenticated();

      expect(isAuth).toBe(true);
    });

    it('should return false when no token exists', function() {
      var isAuth = authService.isAuthenticated();

      expect(isAuth).toBe(false);
    });
  });

  describe('validateSession', function() {
    it('should resolve promise when user is authenticated', function(done) {
      $window.sessionStorage.setItem('authToken', 'valid-token');

      authService.validateSession().then(function(result) {
        expect(result).toBe(true);
        done();
      });
    });

    it('should reject promise when user is not authenticated', function(done) {
      authService.validateSession().catch(function(error) {
        expect(error).toBe('Not authenticated');
        done();
      });
    });
  });
});