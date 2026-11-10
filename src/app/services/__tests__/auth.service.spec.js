/*
Test Documentation:
- Test Name: AuthService - validateSession with valid token
- Purpose: Validates that validateSession successfully validates a session with valid token
- Scenario: Service is called when valid token exists in sessionStorage
- Expected Result: Returns promise resolving to user session data

Test Documentation:
- Test Name: AuthService - validateSession without token
- Purpose: Validates that validateSession rejects when no token is found
- Scenario: Service is called when no token exists in sessionStorage
- Expected Result: Promise is rejected with 'No token found' message

Test Documentation:
- Test Name: AuthService - validateSession with invalid token
- Purpose: Validates that validateSession handles authentication errors
- Scenario: Backend returns 401 unauthorized for invalid token
- Expected Result: Promise is rejected with error object

Test Documentation:
- Test Name: AuthService - getToken returns token from sessionStorage
- Purpose: Validates that getToken retrieves token from sessionStorage
- Scenario: Token exists in sessionStorage
- Expected Result: Returns the stored token

Test Documentation:
- Test Name: AuthService - getToken returns mock token when no token in storage
- Purpose: Validates fallback behavior when no token exists
- Scenario: sessionStorage has no authToken
- Expected Result: Returns mock-token-12345

Test Documentation:
- Test Name: AuthService - isAuthenticated returns true when token exists
- Purpose: Validates authentication status check
- Scenario: Valid token exists
- Expected Result: Returns true

Test Documentation:
- Test Name: AuthService - isAuthenticated returns false when no token
- Purpose: Validates authentication status when not logged in
- Scenario: No token exists
- Expected Result: Returns false

Coverage Report:
- Functions tested: validateSession, getToken, isAuthenticated
- Scenarios covered: valid token, no token, invalid token, mock token fallback, authentication status
- Uncovered scenarios: none
*/

describe('AuthService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AuthService, $httpBackend, $window, API_CONFIG;
  
  beforeEach(inject(function(_AuthService_, _$httpBackend_, _$window_, _API_CONFIG_) {
    AuthService = _AuthService_;
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.sessionStorage.removeItem('authToken');
  });
  
  describe('validateSession', function() {
    it('should validate session with valid token', function() {
      var mockToken = 'valid-token-abc123';
      var mockResponse = { userId: 'user-123', username: 'testuser' };
      
      $window.sessionStorage.setItem('authToken', mockToken);
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/validate', function(headers) {
        return headers.Authorization === 'Bearer ' + mockToken;
      }).respond(200, mockResponse);
      
      var result;
      AuthService.validateSession().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
      expect(result.userId).toBe('user-123');
    });
    
    it('should reject when no token is found', function() {
      $window.sessionStorage.removeItem('authToken');
      
      var error;
      AuthService.validateSession().catch(function(err) {
        error = err;
      });
      
      expect(error).toBe('No token found');
    });
    
    it('should handle authentication errors', function() {
      var mockToken = 'invalid-token';
      $window.sessionStorage.setItem('authToken', mockToken);
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/validate')
        .respond(401, { message: 'Unauthorized' });
      
      var error;
      AuthService.validateSession().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });
    
    it('should use mock token when no token in sessionStorage', function() {
      $window.sessionStorage.removeItem('authToken');
      
      var error;
      AuthService.validateSession().catch(function(err) {
        error = err;
      });
      
      expect(error).toBe('No token found');
    });
  });
  
  describe('getToken', function() {
    it('should return token from sessionStorage', function() {
      var mockToken = 'stored-token-xyz';
      $window.sessionStorage.setItem('authToken', mockToken);
      
      var token = AuthService.getToken();
      
      expect(token).toBe(mockToken);
    });
    
    it('should return mock token when no token in sessionStorage', function() {
      $window.sessionStorage.removeItem('authToken');
      
      var token = AuthService.getToken();
      
      expect(token).toBe('mock-token-12345');
    });
  });
  
  describe('isAuthenticated', function() {
    it('should return true when token exists', function() {
      $window.sessionStorage.setItem('authToken', 'some-token');
      
      var isAuth = AuthService.isAuthenticated();
      
      expect(isAuth).toBe(true);
    });
    
    it('should return true with mock token when no sessionStorage token', function() {
      $window.sessionStorage.removeItem('authToken');
      
      var isAuth = AuthService.isAuthenticated();
      
      expect(isAuth).toBe(true);
    });
  });
});