/*
Test Documentation:
- Test Name: authService Unit Tests
- Purpose: Validates authentication service functionality including login, logout, token management, and user identification
- Scenario: Tests all authentication operations with success and error scenarios
- Expected Result: All authentication methods should work correctly with proper token and user management
*/

describe('authService', function() {
  'use strict';

  var authService, $httpBackend, $window, API_CONFIG;
  var mockCredentials = {username: 'testuser', password: 'testpass'};
  var mockResponse = {token: 'mock-token-123', userId: 'user456'};

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_authService_, _$httpBackend_, _$window_, _API_CONFIG_) {
    authService = _authService_;
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    API_CONFIG = _API_CONFIG_;
    
    // Clear localStorage before each test
    $window.localStorage.removeItem('authToken');
    $window.localStorage.removeItem('userId');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.localStorage.removeItem('authToken');
    $window.localStorage.removeItem('userId');
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(authService).toBeDefined();
    });

    it('should have login method', function() {
      expect(authService.login).toBeDefined();
      expect(typeof authService.login).toBe('function');
    });

    it('should have logout method', function() {
      expect(authService.logout).toBeDefined();
      expect(typeof authService.logout).toBe('function');
    });

    it('should have getAuthToken method', function() {
      expect(authService.getAuthToken).toBeDefined();
      expect(typeof authService.getAuthToken).toBe('function');
    });

    it('should have getUserId method', function() {
      expect(authService.getUserId).toBeDefined();
      expect(typeof authService.getUserId).toBe('function');
    });

    it('should have isAuthenticated method', function() {
      expect(authService.isAuthenticated).toBeDefined();
      expect(typeof authService.isAuthenticated).toBe('function');
    });
  });

  describe('login()', function() {
    it('should send POST request to auth endpoint with credentials', function() {
      var loginUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/login';
      $httpBackend.expectPOST(loginUrl, mockCredentials).respond(200, mockResponse);

      authService.login(mockCredentials);
      $httpBackend.flush();
    });

    it('should store token in localStorage on successful login', function() {
      var loginUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/login';
      $httpBackend.expectPOST(loginUrl).respond(200, mockResponse);

      authService.login(mockCredentials).then(function() {
        expect($window.localStorage.getItem('authToken')).toBe('mock-token-123');
      });
      $httpBackend.flush();
    });

    it('should store userId in localStorage on successful login', function() {
      var loginUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/login';
      $httpBackend.expectPOST(loginUrl).respond(200, mockResponse);

      authService.login(mockCredentials).then(function() {
        expect($window.localStorage.getItem('userId')).toBe('user456');
      });
      $httpBackend.flush();
    });

    it('should return response data on successful login', function() {
      var loginUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/login';
      $httpBackend.expectPOST(loginUrl).respond(200, mockResponse);

      authService.login(mockCredentials).then(function(data) {
        expect(data).toEqual(mockResponse);
      });
      $httpBackend.flush();
    });

    it('should handle login failure gracefully', function() {
      var loginUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/login';
      $httpBackend.expectPOST(loginUrl).respond(401, {error: 'Unauthorized'});

      authService.login(mockCredentials).catch(function(error) {
        expect(error.status).toBe(401);
      });
      $httpBackend.flush();
    });

    it('should not store token if response is missing token', function() {
      var loginUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/login';
      var incompleteResponse = {userId: 'user456'};
      $httpBackend.expectPOST(loginUrl).respond(200, incompleteResponse);

      authService.login(mockCredentials);
      $httpBackend.flush();
      
      expect($window.localStorage.getItem('authToken')).toBeNull();
    });

    it('should not store userId if response is missing userId', function() {
      var loginUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/login';
      var incompleteResponse = {token: 'mock-token-123'};
      $httpBackend.expectPOST(loginUrl).respond(200, incompleteResponse);

      authService.login(mockCredentials);
      $httpBackend.flush();
      
      expect($window.localStorage.getItem('userId')).toBeNull();
    });
  });

  describe('logout()', function() {
    beforeEach(function() {
      $window.localStorage.setItem('authToken', 'test-token');
      $window.localStorage.setItem('userId', 'test-user');
    });

    it('should remove authToken from localStorage', function() {
      authService.logout();
      expect($window.localStorage.getItem('authToken')).toBeNull();
    });

    it('should remove userId from localStorage', function() {
      authService.logout();
      expect($window.localStorage.getItem('userId')).toBeNull();
    });

    it('should clear both authToken and userId', function() {
      authService.logout();
      expect($window.localStorage.getItem('authToken')).toBeNull();
      expect($window.localStorage.getItem('userId')).toBeNull();
    });
  });

  describe('getAuthToken()', function() {
    it('should return null when no token is stored', function() {
      expect(authService.getAuthToken()).toBeNull();
    });

    it('should return stored token when available', function() {
      $window.localStorage.setItem('authToken', 'stored-token');
      expect(authService.getAuthToken()).toBe('stored-token');
    });

    it('should return updated token after login', function() {
      var loginUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/login';
      $httpBackend.expectPOST(loginUrl).respond(200, mockResponse);

      authService.login(mockCredentials).then(function() {
        expect(authService.getAuthToken()).toBe('mock-token-123');
      });
      $httpBackend.flush();
    });
  });

  describe('getUserId()', function() {
    it('should return default userId when none is stored', function() {
      expect(authService.getUserId()).toBe('user123');
    });

    it('should return stored userId when available', function() {
      $window.localStorage.setItem('userId', 'stored-user-id');
      expect(authService.getUserId()).toBe('stored-user-id');
    });

    it('should return updated userId after login', function() {
      var loginUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/login';
      $httpBackend.expectPOST(loginUrl).respond(200, mockResponse);

      authService.login(mockCredentials).then(function() {
        expect(authService.getUserId()).toBe('user456');
      });
      $httpBackend.flush();
    });
  });

  describe('isAuthenticated()', function() {
    it('should return false when no token is stored', function() {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return true when token is stored', function() {
      $window.localStorage.setItem('authToken', 'valid-token');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false after logout', function() {
      $window.localStorage.setItem('authToken', 'valid-token');
      authService.logout();
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return true after successful login', function() {
      var loginUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/login';
      $httpBackend.expectPOST(loginUrl).respond(200, mockResponse);

      authService.login(mockCredentials).then(function() {
        expect(authService.isAuthenticated()).toBe(true);
      });
      $httpBackend.flush();
    });
  });

  describe('Integration Scenarios', function() {
    it('should handle complete login-logout cycle', function() {
      var loginUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/login';
      $httpBackend.expectPOST(loginUrl).respond(200, mockResponse);

      authService.login(mockCredentials).then(function() {
        expect(authService.isAuthenticated()).toBe(true);
        expect(authService.getAuthToken()).toBe('mock-token-123');
        expect(authService.getUserId()).toBe('user456');
        
        authService.logout();
        
        expect(authService.isAuthenticated()).toBe(false);
        expect(authService.getAuthToken()).toBeNull();
      });
      $httpBackend.flush();
    });

    it('should handle multiple login attempts', function() {
      var loginUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/login';
      var firstResponse = {token: 'token1', userId: 'user1'};
      var secondResponse = {token: 'token2', userId: 'user2'};
      
      $httpBackend.expectPOST(loginUrl).respond(200, firstResponse);
      authService.login(mockCredentials);
      $httpBackend.flush();
      
      expect(authService.getAuthToken()).toBe('token1');
      
      $httpBackend.expectPOST(loginUrl).respond(200, secondResponse);
      authService.login(mockCredentials);
      $httpBackend.flush();
      
      expect(authService.getAuthToken()).toBe('token2');
    });
  });
});

/*
Coverage Report:
- Functions tested: login, logout, getAuthToken, getUserId, isAuthenticated
- Scenarios covered:
  * Successful login with token and userId storage
  * Failed login handling
  * Incomplete response handling
  * Token retrieval (present and absent)
  * UserId retrieval with default fallback
  * Authentication status checking
  * Logout clearing credentials
  * Complete login-logout cycle
  * Multiple login attempts
- Uncovered scenarios: Network timeout (requires additional timeout configuration)
*/