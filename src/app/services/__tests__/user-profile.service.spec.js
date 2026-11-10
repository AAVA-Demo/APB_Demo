/*
Test Documentation:
- Test Name: UserProfileService - authenticateUser with existing token
- Purpose: Validates user authentication when token exists in session storage
- Scenario: User has existing auth token
- Expected Result: Returns promise resolving with userId and existing authToken

- Test Name: UserProfileService - authenticateUser without token
- Purpose: Validates user authentication and token creation when no token exists
- Scenario: User has no auth token in session storage
- Expected Result: Creates new mock token, stores it, and returns promise with userId and new token

- Test Name: UserProfileService - authenticateUser returns consistent userId
- Purpose: Validates consistent user identification
- Scenario: User is authenticated
- Expected Result: Returns userId 'user-001'

Coverage Report:
- Functions tested: authenticateUser
- Scenarios covered: existing token, new token creation, token storage, userId consistency
- Uncovered scenarios: none
*/

describe('UserProfileService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var UserProfileService, $window, $q, $rootScope;
  
  beforeEach(inject(function(_UserProfileService_, _$window_, _$q_, _$rootScope_) {
    UserProfileService = _UserProfileService_;
    $window = _$window_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $window.sessionStorage.clear();
  }));
  
  afterEach(function() {
    $window.sessionStorage.clear();
  });
  
  describe('authenticateUser', function() {
    it('should resolve with userId and existing token when token exists', function() {
      var existingToken = 'existing-token-67890';
      $window.sessionStorage.setItem('authToken', existingToken);
      
      var result;
      UserProfileService.authenticateUser().then(function(data) {
        result = data;
      });
      
      $rootScope.$apply();
      
      expect(result).toBeDefined();
      expect(result.userId).toBe('user-001');
      expect(result.authToken).toBe(existingToken);
    });
    
    it('should create and store new token when no token exists', function() {
      var result;
      UserProfileService.authenticateUser().then(function(data) {
        result = data;
      });
      
      $rootScope.$apply();
      
      expect(result).toBeDefined();
      expect(result.userId).toBe('user-001');
      expect(result.authToken).toContain('mock-jwt-token-');
      expect($window.sessionStorage.getItem('authToken')).toBe(result.authToken);
    });
    
    it('should return consistent userId', function() {
      var result;
      UserProfileService.authenticateUser().then(function(data) {
        result = data;
      });
      
      $rootScope.$apply();
      
      expect(result.userId).toBe('user-001');
    });
    
    it('should return a promise', function() {
      var promise = UserProfileService.authenticateUser();
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });
    
    it('should generate unique tokens on multiple calls without existing token', function() {
      var result1, result2;
      
      UserProfileService.authenticateUser().then(function(data) {
        result1 = data;
      });
      $rootScope.$apply();
      
      $window.sessionStorage.clear();
      
      UserProfileService.authenticateUser().then(function(data) {
        result2 = data;
      });
      $rootScope.$apply();
      
      expect(result1.authToken).not.toBe(result2.authToken);
    });
  });
});