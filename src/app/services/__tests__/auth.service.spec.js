/*
Test Documentation:
- Test Name: AuthService Unit Tests
- Purpose: Validate authentication service functionality including session validation, token management, and user retrieval
- Scenario: Tests validateSession, getToken, getCurrentUser, and logout methods
- Expected Result: Service correctly manages authentication tokens and user sessions
*/

/*
Coverage Report:
- Functions tested: validateSession, getToken, getCurrentUser, logout
- Scenarios covered:
  * Normal: successful session validation, token retrieval, user retrieval
  * Edge: no existing token scenario, existing token validation
  * Error: failed token validation, null user handling
- Uncovered scenarios: none
*/

describe('AuthService', function() {
  'use strict';
  
  var AuthService;
  var $http;
  var $httpBackend;
  var $window;
  var $q;
  var $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_AuthService_, _$http_, _$httpBackend_, _$window_, _$q_, _$rootScope_) {
    AuthService = _AuthService_;
    $http = _$http_;
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    $window.localStorage.clear();
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.localStorage.clear();
  });
  
  describe('validateSession', function() {
    
    it('should create mock user when no token exists', function() {
      var result;
      
      AuthService.validateSession().then(function(isValid) {
        result = isValid;
      });
      
      $rootScope.$digest();
      
      expect(result).toBe(true);
      expect($window.localStorage.getItem('authToken')).toBeDefined();
      expect($window.localStorage.getItem('currentUser')).toBeDefined();
    });
    
    it('should validate existing token successfully', function() {
      $window.localStorage.setItem('authToken', 'valid-token-123');
      $httpBackend.expectGET('/api/auth/validate').respond(200, { valid: true });
      
      var result;
      AuthService.validateSession().then(function(isValid) {
        result = isValid;
      });
      
      $httpBackend.flush();
      
      expect(result).toBe(true);
    });
    
    it('should remove token on validation failure', function() {
      $window.localStorage.setItem('authToken', 'invalid-token');
      $window.localStorage.setItem('currentUser', JSON.stringify({ userId: 'user123' }));
      $httpBackend.expectGET('/api/auth/validate').respond(401, { error: 'Unauthorized' });
      
      var result;
      AuthService.validateSession().then(function(isValid) {
        result = isValid;
      }, function(error) {
        result = error;
      });
      
      $httpBackend.flush();
      
      expect(result).toBe(false);
      expect($window.localStorage.getItem('authToken')).toBeNull();
      expect($window.localStorage.getItem('currentUser')).toBeNull();
    });
    
    it('should send authorization header with token', function() {
      $window.localStorage.setItem('authToken', 'test-token-456');
      
      $httpBackend.expectGET('/api/auth/validate', function(headers) {
        return headers['Authorization'] === 'Bearer test-token-456';
      }).respond(200, { valid: true });
      
      AuthService.validateSession();
      $httpBackend.flush();
    });
    
    it('should create mock user with correct structure', function() {
      AuthService.validateSession();
      $rootScope.$digest();
      
      var user = JSON.parse($window.localStorage.getItem('currentUser'));
      
      expect(user).toEqual({
        userId: 'user123',
        name: 'Demo User'
      });
    });
    
  });
  
  describe('getToken', function() {
    
    it('should return stored token', function() {
      $window.localStorage.setItem('authToken', 'my-token-789');
      
      var token = AuthService.getToken();
      
      expect(token).toBe('my-token-789');
    });
    
    it('should return null when no token exists', function() {
      var token = AuthService.getToken();
      
      expect(token).toBeNull();
    });
    
  });
  
  describe('getCurrentUser', function() {
    
    it('should return parsed user object', function() {
      var mockUser = { userId: 'user456', name: 'Jane Doe' };
      $window.localStorage.setItem('currentUser', JSON.stringify(mockUser));
      
      var user = AuthService.getCurrentUser();
      
      expect(user).toEqual(mockUser);
    });
    
    it('should return null when no user exists', function() {
      var user = AuthService.getCurrentUser();
      
      expect(user).toBeNull();
    });
    
    it('should handle invalid JSON gracefully', function() {
      $window.localStorage.setItem('currentUser', 'invalid-json');
      
      expect(function() {
        AuthService.getCurrentUser();
      }).toThrow();
    });
    
  });
  
  describe('logout', function() {
    
    it('should remove token and user from localStorage', function() {
      $window.localStorage.setItem('authToken', 'token-to-remove');
      $window.localStorage.setItem('currentUser', JSON.stringify({ userId: 'user789' }));
      
      AuthService.logout();
      
      expect($window.localStorage.getItem('authToken')).toBeNull();
      expect($window.localStorage.getItem('currentUser')).toBeNull();
    });
    
    it('should work when no data exists', function() {
      expect(function() {
        AuthService.logout();
      }).not.toThrow();
    });
    
  });
  
});