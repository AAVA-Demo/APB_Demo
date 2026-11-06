/*
Test Documentation:
- Test Name: authService - authenticate
- Purpose: Validate login flow stores token and returns data on success; throws on failure
- Scenario: Successful login with token, response without token, HTTP error
- Expected Result: Token stored in sessionStorage; error thrown when token absent or HTTP fails

- Test Name: authService - getToken
- Purpose: Confirm token retrieval from sessionStorage
- Scenario: Token present, token absent
- Expected Result: Returns token string or null

- Test Name: authService - isAuthenticated
- Purpose: Validate boolean authentication check
- Scenario: Token exists, token missing
- Expected Result: true when token present, false otherwise

- Test Name: authService - logout
- Purpose: Ensure token is removed from sessionStorage on logout
- Scenario: Token present before logout
- Expected Result: Token removed after logout call

- Test Name: authService - validateSession
- Purpose: Validate session check against API; logout on failure
- Scenario: Valid session response, invalid/error response
- Expected Result: Returns true for valid, false and calls logout for invalid
*/

describe('authService', function() {
  'use strict';

  var authService;
  var $httpBackend;
  var $window;
  var $rootScope;

  beforeEach(module('dashboardModule'));

  beforeEach(inject(function(_authService_, _$httpBackend_, _$window_, _$rootScope_) {
    authService  = _authService_;
    $httpBackend = _$httpBackend_;
    $window      = _$window_;
    $rootScope   = _$rootScope_;
    $window.sessionStorage.clear();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.sessionStorage.clear();
  });

  // ─── authenticate ────────────────────────────────────────────────────────────

  describe('authenticate', function() {

    it('should store token and return data on successful authentication', function() {
      var credentials = { username: 'user1', password: 'pass1' };
      var responseData = { token: 'abc123', userId: 'u1' };
      $httpBackend.expectPOST('/api/auth/login', credentials).respond(200, responseData);

      var resolved;
      authService.authenticate(credentials).then(function(data) { resolved = data; });
      $httpBackend.flush();
      $rootScope.$digest();

      expect(resolved.token).toBe('abc123');
      expect($window.sessionStorage.getItem('sso_token')).toBe('abc123');
    });

    it('should throw an error when response contains no token', function() {
      var credentials = { username: 'user1', password: 'wrong' };
      $httpBackend.expectPOST('/api/auth/login', credentials).respond(200, { message: 'ok' });

      var rejected;
      authService.authenticate(credentials).catch(function(err) { rejected = err; });
      $httpBackend.flush();
      $rootScope.$digest();

      expect(rejected).toBeDefined();
      expect(rejected.message).toBe('Authentication failed');
    });

    it('should propagate HTTP error on failed login request', function() {
      var credentials = { username: 'bad', password: 'bad' };
      $httpBackend.expectPOST('/api/auth/login', credentials).respond(401, { error: 'Unauthorized' });

      var rejected;
      authService.authenticate(credentials).catch(function(err) { rejected = err; });
      $httpBackend.flush();
      $rootScope.$digest();

      expect(rejected).toBeDefined();
    });
  });

  // ─── getToken ────────────────────────────────────────────────────────────────

  describe('getToken', function() {

    it('should return token when it exists in sessionStorage', function() {
      $window.sessionStorage.setItem('sso_token', 'mytoken');
      expect(authService.getToken()).toBe('mytoken');
    });

    it('should return null when no token exists in sessionStorage', function() {
      expect(authService.getToken()).toBeNull();
    });
  });

  // ─── isAuthenticated ─────────────────────────────────────────────────────────

  describe('isAuthenticated', function() {

    it('should return true when a token is present', function() {
      $window.sessionStorage.setItem('sso_token', 'validtoken');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when no token is present', function() {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  // ─── logout ──────────────────────────────────────────────────────────────────

  describe('logout', function() {

    it('should remove the token from sessionStorage on logout', function() {
      $window.sessionStorage.setItem('sso_token', 'tokenToRemove');
      authService.logout();
      expect($window.sessionStorage.getItem('sso_token')).toBeNull();
    });

    it('should not throw when called with no token present', function() {
      expect(function() { authService.logout(); }).not.toThrow();
    });
  });

  // ─── validateSession ─────────────────────────────────────────────────────────

  describe('validateSession', function() {

    it('should return true when session is valid', function() {
      $httpBackend.expectGET('/api/auth/validate').respond(200, { valid: true });

      var result;
      authService.validateSession().then(function(val) { result = val; });
      $httpBackend.flush();
      $rootScope.$digest();

      expect(result).toBe(true);
    });

    it('should return false and call logout when session validation fails', function() {
      $window.sessionStorage.setItem('sso_token', 'expiredToken');
      $httpBackend.expectGET('/api/auth/validate').respond(500, {});

      var result;
      authService.validateSession().then(function(val) { result = val; });
      $httpBackend.flush();
      $rootScope.$digest();

      expect(result).toBe(false);
      expect($window.sessionStorage.getItem('sso_token')).toBeNull();
    });
  });
});

/*
Coverage Report:
- Functions tested: authenticate, getToken, isAuthenticated, logout, validateSession
- Scenarios covered: successful auth, missing token in response, HTTP 401, token present/absent, logout clears token, valid session, expired session
- Uncovered scenarios: none
*/