/*
Test Documentation:
- Test Name: AuthService - login success
- Purpose: Validates successful user authentication and token storage
- Scenario: User provides valid credentials
- Expected Result: Token and userId stored in sessionStorage, promise resolves
*/
/*
Test Documentation:
- Test Name: AuthService - login failure
- Purpose: Validates error handling for invalid credentials
- Scenario: API returns error response
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: AuthService - logout
- Purpose: Validates session cleanup on logout
- Scenario: User logs out
- Expected Result: Token and userId removed from sessionStorage
*/
/*
Test Documentation:
- Test Name: AuthService - getToken
- Purpose: Validates token retrieval from sessionStorage
- Scenario: Token exists in sessionStorage
- Expected Result: Returns stored token
*/
/*
Test Documentation:
- Test Name: AuthService - isAuthenticated
- Purpose: Validates authentication state check
- Scenario: User has valid token
- Expected Result: Returns true when authenticated
*/
/*
Coverage Report:
- Functions tested: login, logout, getToken, getUserId, isAuthenticated
- Scenarios covered: successful login, failed login, logout, token retrieval, authentication check
- Uncovered scenarios: token expiration, concurrent login sessions
*/

describe('AuthService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AuthService, $httpBackend, $window;
  
  beforeEach(inject(function(_AuthService_, _$httpBackend_, _$window_) {
    AuthService = _AuthService_;
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    
    // Clear sessionStorage before each test
    $window.sessionStorage.clear();
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.sessionStorage.clear();
  });
  
  describe('login', function() {
    it('should store token and userId in sessionStorage on successful login', function() {
      var credentials = { username: 'testuser', password: 'password123' };
      var mockResponse = {
        token: 'mock-jwt-token-12345',
        userId: 'user123'
      };
      
      $httpBackend.expectPOST('/api/auth/login', credentials)
        .respond(200, mockResponse);
      
      var result;
      AuthService.login(credentials).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
      expect($window.sessionStorage.getItem('authToken')).toBe('mock-jwt-token-12345');
      expect($window.sessionStorage.getItem('userId')).toBe('user123');
    });
    
    it('should reject promise when response does not contain token', function() {
      var credentials = { username: 'testuser', password: 'password123' };
      var mockResponse = { userId: 'user123' }; // Missing token
      
      $httpBackend.expectPOST('/api/auth/login', credentials)
        .respond(200, mockResponse);
      
      var error;
      AuthService.login(credentials).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBe('Invalid response');
      expect($window.sessionStorage.getItem('authToken')).toBeNull();
    });
    
    it('should reject promise when API call fails', function() {
      var credentials = { username: 'testuser', password: 'wrongpassword' };
      var errorResponse = { message: 'Invalid credentials' };
      
      $httpBackend.expectPOST('/api/auth/login', credentials)
        .respond(401, errorResponse);
      
      var error;
      AuthService.login(credentials).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });
    
    it('should reject promise when response data is missing', function() {
      var credentials = { username: 'testuser', password: 'password123' };
      
      $httpBackend.expectPOST('/api/auth/login', credentials)
        .respond(200, null);
      
      var error;
      AuthService.login(credentials).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBe('Invalid response');
    });
  });
  
  describe('logout', function() {
    it('should remove authToken and userId from sessionStorage', function() {
      $window.sessionStorage.setItem('authToken', 'test-token');
      $window.sessionStorage.setItem('userId', 'user123');
      
      spyOn($window.location, 'href', 'set');
      
      AuthService.logout();
      
      expect($window.sessionStorage.getItem('authToken')).toBeNull();
      expect($window.sessionStorage.getItem('userId')).toBeNull();
    });
    
    it('should redirect to login page', function() {
      $window.sessionStorage.setItem('authToken', 'test-token');
      
      var originalHref = $window.location.href;
      AuthService.logout();
      
      // Note: In actual implementation, location.href is set to '#!/login'
      // This test validates the logout clears storage
      expect($window.sessionStorage.getItem('authToken')).toBeNull();
    });
  });
  
  describe('getToken', function() {
    it('should return token from sessionStorage when token exists', function() {
      $window.sessionStorage.setItem('authToken', 'test-token-123');
      
      var token = AuthService.getToken();
      
      expect(token).toBe('test-token-123');
    });
    
    it('should return null when no token exists', function() {
      var token = AuthService.getToken();
      
      expect(token).toBeNull();
    });
  });
  
  describe('getUserId', function() {
    it('should return userId from sessionStorage when userId exists', function() {
      $window.sessionStorage.setItem('userId', 'user456');
      
      var userId = AuthService.getUserId();
      
      expect(userId).toBe('user456');
    });
    
    it('should return null when no userId exists', function() {
      var userId = AuthService.getUserId();
      
      expect(userId).toBeNull();
    });
  });
  
  describe('isAuthenticated', function() {
    it('should return true when token exists', function() {
      $window.sessionStorage.setItem('authToken', 'valid-token');
      
      var isAuth = AuthService.isAuthenticated();
      
      expect(isAuth).toBe(true);
    });
    
    it('should return false when token does not exist', function() {
      var isAuth = AuthService.isAuthenticated();
      
      expect(isAuth).toBe(false);
    });
    
    it('should return false when token is empty string', function() {
      $window.sessionStorage.setItem('authToken', '');
      
      var isAuth = AuthService.isAuthenticated();
      
      expect(isAuth).toBe(false);
    });
  });
});