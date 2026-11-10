/*
Test Documentation:
- Test Name: UserProfileService - getCurrentUser with cached user
- Purpose: Validates retrieval of current user from AuthService
- Scenario: User is already authenticated and cached
- Expected Result: Returns cached user object immediately
*/
/*
Test Documentation:
- Test Name: UserProfileService - getCurrentUser with authentication
- Purpose: Validates user retrieval when authentication is required
- Scenario: User is not cached and needs authentication
- Expected Result: Authenticates user and returns user object
*/
/*
Coverage Report:
- Functions tested: getCurrentUser
- Scenarios covered: cached user retrieval, authentication flow, error handling
- Uncovered scenarios: none
*/

describe('UserProfileService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var UserProfileService;
  var AuthService;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_UserProfileService_, _AuthService_, _$q_, _$rootScope_) {
    UserProfileService = _UserProfileService_;
    AuthService = _AuthService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getCurrentUser', function() {
    it('should return cached user when available', function() {
      var mockUser = {userId: 'user123', name: 'John Doe', email: 'john@example.com'};
      spyOn(AuthService, 'getUser').and.returnValue(mockUser);
      
      var result;
      UserProfileService.getCurrentUser().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(AuthService.getUser).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.userId).toBe('user123');
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
    });
    
    it('should authenticate and return user when not cached', function() {
      var mockUser = {userId: 'user456', name: 'Jane Smith', email: 'jane@example.com'};
      spyOn(AuthService, 'getUser').and.returnValue(null);
      spyOn(AuthService, 'authenticate').and.returnValue($q.resolve({token: 'token123', user: mockUser}));
      
      var result;
      UserProfileService.getCurrentUser().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(AuthService.getUser).toHaveBeenCalled();
      expect(AuthService.authenticate).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.userId).toBe('user456');
      expect(result.name).toBe('Jane Smith');
    });
    
    it('should handle authentication error', function() {
      spyOn(AuthService, 'getUser').and.returnValue(null);
      spyOn(AuthService, 'authenticate').and.returnValue($q.reject('Authentication failed'));
      
      var error;
      UserProfileService.getCurrentUser().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('Authentication failed');
    });
    
    it('should not call authenticate if user is cached', function() {
      var mockUser = {userId: 'user123'};
      spyOn(AuthService, 'getUser').and.returnValue(mockUser);
      spyOn(AuthService, 'authenticate');
      
      UserProfileService.getCurrentUser();
      $rootScope.$digest();
      
      expect(AuthService.authenticate).not.toHaveBeenCalled();
    });
  });
});