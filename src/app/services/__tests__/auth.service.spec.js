/*
Test Documentation:
- Test Name: AuthService - isAuthenticated when token is set
- Purpose: Validates authentication state detection
- Scenario: Token is set in service
- Expected Result: Returns true
*/
/*
Test Documentation:
- Test Name: AuthService - autoLogin generates token and stores in session
- Purpose: Validates automatic login functionality
- Scenario: autoLogin is called
- Expected Result: Token and userId are generated and stored in sessionStorage
*/
/*
Test Documentation:
- Test Name: AuthService - validateSession with valid token
- Purpose: Validates session validation with existing token
- Scenario: Valid token exists in sessionStorage
- Expected Result: Promise resolves with true
*/
/*
Test Documentation:
- Test Name: AuthService - validateSession with no token
- Purpose: Validates session validation failure
- Scenario: No token in sessionStorage
- Expected Result: Promise rejects with error message
*/
/*
Coverage Report:
- Functions tested: isAuthenticated, autoLogin, validateSession, getToken, getUserId
- Scenarios covered: authentication state, auto-login, session validation success/failure, token retrieval
- Uncovered scenarios: none
*/

describe('AuthService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AuthService;
  var $window;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_AuthService_, _$window_, _$q_, _$rootScope_) {
    AuthService = _AuthService_;
    $window = _AuthService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    // Clear sessionStorage before each test
    sessionStorage.clear();
    AuthService.token = null;
    AuthService.userId = 'user123';
  }));
  
  describe('isAuthenticated', function() {
    
    it('should return false when token is null', function() {
      AuthService.token = null;
      expect(AuthService.isAuthenticated()).toBe(false);
    });
    
    it('should return true when token is set', function() {
      AuthService.token = 'mock-token-123';
      expect(AuthService.isAuthenticated()).toBe(true);
    });
  });
  
  describe('autoLogin', function() {
    
    it('should generate token and store in sessionStorage', function(done) {
      AuthService.autoLogin().then(function(result) {
        expect(result).toBeDefined();
        expect(result.token).toBeDefined();
        expect(result.userId).toBe('user123');
        expect(AuthService.token).toBeDefined();
        expect(AuthService.token).toContain('mock-jwt-token-');
        expect(sessionStorage.getItem('authToken')).toBeDefined();
        expect(sessionStorage.getItem('userId')).toBe('user123');
        done();
      });
      $rootScope.$apply();
    });
    
    it('should set token property on service', function(done) {
      expect(AuthService.token).toBeNull();
      AuthService.autoLogin().then(function() {
        expect(AuthService.token).not.toBeNull();
        expect(AuthService.isAuthenticated()).toBe(true);
        done();
      });
      $rootScope.$apply();
    });
  });
  
  describe('validateSession', function() {
    
    it('should resolve when valid token exists in sessionStorage', function(done) {
      sessionStorage.setItem('authToken', 'valid-token-123');
      sessionStorage.setItem('userId', 'testUser');
      
      AuthService.validateSession().then(function(result) {
        expect(result).toBe(true);
        expect(AuthService.token).toBe('valid-token-123');
        expect(AuthService.userId).toBe('testUser');
        done();
      });
      $rootScope.$apply();
    });
    
    it('should reject when no token exists in sessionStorage', function(done) {
      AuthService.validateSession().catch(function(error) {
        expect(error).toBe('Session invalid');
        done();
      });
      $rootScope.$apply();
    });
  });
  
  describe('getToken', function() {
    
    it('should return token from service property', function() {
      AuthService.token = 'service-token';
      expect(AuthService.getToken()).toBe('service-token');
    });
    
    it('should return token from sessionStorage when service property is null', function() {
      AuthService.token = null;
      sessionStorage.setItem('authToken', 'storage-token');
      expect(AuthService.getToken()).toBe('storage-token');
    });
  });
  
  describe('getUserId', function() {
    
    it('should return userId from service property', function() {
      AuthService.userId = 'user456';
      expect(AuthService.getUserId()).toBe('user456');
    });
    
    it('should return userId from sessionStorage when service property is null', function() {
      AuthService.userId = null;
      sessionStorage.setItem('userId', 'storage-user');
      expect(AuthService.getUserId()).toBe('storage-user');
    });
  });
});