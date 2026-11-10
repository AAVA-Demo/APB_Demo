/*
Test Documentation:
- Test Name: UserAuthService - authenticate with valid credentials
- Purpose: Verify that user can authenticate with valid credentials
- Scenario: User provides valid username and password
- Expected Result: Service stores auth token and user data in session storage
*/
/*
Test Documentation:
- Test Name: UserAuthService - authenticate with invalid credentials
- Purpose: Verify that authentication fails with invalid credentials
- Scenario: User provides invalid credentials
- Expected Result: Service rejects promise with error
*/
/*
Test Documentation:
- Test Name: UserAuthService - getAuthToken retrieves token from memory
- Purpose: Verify that auth token is retrieved from memory when available
- Scenario: Auth token exists in service memory
- Expected Result: Service returns token from memory
*/
/*
Test Documentation:
- Test Name: UserAuthService - getAuthToken retrieves token from session storage
- Purpose: Verify that auth token is retrieved from session storage when not in memory
- Scenario: Auth token exists in session storage but not in memory
- Expected Result: Service retrieves and returns token from session storage
*/
/*
Test Documentation:
- Test Name: UserAuthService - getCurrentUser retrieves user from memory
- Purpose: Verify that current user is retrieved from memory when available
- Scenario: User data exists in service memory
- Expected Result: Service returns user from memory
*/
/*
Test Documentation:
- Test Name: UserAuthService - getCurrentUser retrieves user from session storage
- Purpose: Verify that current user is retrieved from session storage when not in memory
- Scenario: User data exists in session storage but not in memory
- Expected Result: Service retrieves and parses user from session storage
*/
/*
Test Documentation:
- Test Name: UserAuthService - logout clears all authentication data
- Purpose: Verify that logout clears token and user data
- Scenario: User logs out
- Expected Result: Service clears memory and session storage
*/
/*
Test Documentation:
- Test Name: UserAuthService - isAuthenticated returns true when token exists
- Purpose: Verify that isAuthenticated correctly identifies authenticated users
- Scenario: User has valid auth token
- Expected Result: Service returns true
*/
/*
Test Documentation:
- Test Name: UserAuthService - isAuthenticated returns false when no token
- Purpose: Verify that isAuthenticated correctly identifies unauthenticated users
- Scenario: User has no auth token
- Expected Result: Service returns false
*/
/*
Test Documentation:
- Test Name: UserAuthService - initialization creates mock token when not authenticated
- Purpose: Verify that service initializes with mock data for demo purposes
- Scenario: Service is instantiated without existing authentication
- Expected Result: Service creates mock token and user data
*/
/*
Coverage Report:
- Functions tested: authenticate (success), authenticate (failure), getAuthToken (memory), getAuthToken (storage), getCurrentUser (memory), getCurrentUser (storage), logout, isAuthenticated (true), isAuthenticated (false), initialization
- Scenarios covered: authentication success/failure, token retrieval from memory/storage, user retrieval from memory/storage, logout, authentication check, mock initialization
- Uncovered scenarios: none
*/

describe('UserAuthService', function() {
  'use strict';

  var UserAuthService, $httpBackend, $window, $q;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_UserAuthService_, _$httpBackend_, _$window_, _$q_) {
    UserAuthService = _UserAuthService_;
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    $q = _$q_;

    $window.sessionStorage.clear();
    UserAuthService.authToken = null;
    UserAuthService.currentUser = null;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.sessionStorage.clear();
  });

  describe('authenticate', function() {
    it('should authenticate user with valid credentials', function() {
      var credentials = {username: 'testuser', password: 'testpass'};
      var apiResponse = {
        token: 'valid-token-12345',
        user: {userId: 'user123', name: 'Test User'}
      };

      $httpBackend.expectPOST('/api/auth/login', credentials)
        .respond(200, apiResponse);

      var result;
      UserAuthService.authenticate(credentials).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(apiResponse);
      expect(UserAuthService.authToken).toBe('valid-token-12345');
      expect(UserAuthService.currentUser).toEqual(apiResponse.user);
      expect($window.sessionStorage.getItem('authToken')).toBe('valid-token-12345');
      expect($window.sessionStorage.getItem('currentUser')).toBe(JSON.stringify(apiResponse.user));
    });

    it('should reject promise when authentication fails', function() {
      var credentials = {username: 'baduser', password: 'badpass'};

      $httpBackend.expectPOST('/api/auth/login', credentials)
        .respond(401, 'Unauthorized');

      var error;
      UserAuthService.authenticate(credentials).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });
  });

  describe('getAuthToken', function() {
    it('should return auth token from memory when available', function() {
      UserAuthService.authToken = 'memory-token-123';

      var token = UserAuthService.getAuthToken();

      expect(token).toBe('memory-token-123');
    });

    it('should retrieve auth token from session storage when not in memory', function() {
      UserAuthService.authToken = null;
      $window.sessionStorage.setItem('authToken', 'storage-token-456');

      var token = UserAuthService.getAuthToken();

      expect(token).toBe('storage-token-456');
      expect(UserAuthService.authToken).toBe('storage-token-456');
    });

    it('should return null when no token exists', function() {
      UserAuthService.authToken = null;
      $window.sessionStorage.removeItem('authToken');

      var token = UserAuthService.getAuthToken();

      expect(token).toBeNull();
    });
  });

  describe('getCurrentUser', function() {
    it('should return current user from memory when available', function() {
      var user = {userId: 'user123', name: 'Test User'};
      UserAuthService.currentUser = user;

      var result = UserAuthService.getCurrentUser();

      expect(result).toEqual(user);
    });

    it('should retrieve current user from session storage when not in memory', function() {
      UserAuthService.currentUser = null;
      var user = {userId: 'user456', name: 'Storage User'};
      $window.sessionStorage.setItem('currentUser', JSON.stringify(user));

      var result = UserAuthService.getCurrentUser();

      expect(result).toEqual(user);
      expect(UserAuthService.currentUser).toEqual(user);
    });

    it('should return null when no user exists', function() {
      UserAuthService.currentUser = null;
      $window.sessionStorage.removeItem('currentUser');

      var result = UserAuthService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('logout', function() {
    it('should clear all authentication data', function() {
      UserAuthService.authToken = 'token-123';
      UserAuthService.currentUser = {userId: 'user123', name: 'Test User'};
      $window.sessionStorage.setItem('authToken', 'token-123');
      $window.sessionStorage.setItem('currentUser', JSON.stringify({userId: 'user123'}));

      UserAuthService.logout();

      expect(UserAuthService.authToken).toBeNull();
      expect(UserAuthService.currentUser).toBeNull();
      expect($window.sessionStorage.getItem('authToken')).toBeNull();
      expect($window.sessionStorage.getItem('currentUser')).toBeNull();
    });
  });

  describe('isAuthenticated', function() {
    it('should return true when auth token exists', function() {
      UserAuthService.authToken = 'valid-token';

      var result = UserAuthService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when auth token does not exist', function() {
      UserAuthService.authToken = null;
      $window.sessionStorage.removeItem('authToken');

      var result = UserAuthService.isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return true when token exists in session storage', function() {
      UserAuthService.authToken = null;
      $window.sessionStorage.setItem('authToken', 'storage-token');

      var result = UserAuthService.isAuthenticated();

      expect(result).toBe(true);
    });
  });

  describe('initialization', function() {
    it('should create mock token and user when not authenticated', function() {
      $window.sessionStorage.clear();
      UserAuthService.authToken = null;
      UserAuthService.currentUser = null;

      inject(function(_UserAuthService_) {
        var service = _UserAuthService_;

        expect($window.sessionStorage.getItem('authToken')).toBe('mock-token-12345');
        var storedUser = JSON.parse($window.sessionStorage.getItem('currentUser'));
        expect(storedUser.userId).toBe('user123');
        expect(storedUser.name).toBe('Demo User');
      });
    });
  });

  describe('edge cases', function() {
    it('should handle malformed JSON in session storage for currentUser', function() {
      UserAuthService.currentUser = null;
      $window.sessionStorage.setItem('currentUser', 'invalid-json{');

      expect(function() {
        UserAuthService.getCurrentUser();
      }).toThrow();
    });

    it('should handle empty string token', function() {
      UserAuthService.authToken = '';

      var result = UserAuthService.isAuthenticated();

      expect(result).toBe(false);
    });
  });
});