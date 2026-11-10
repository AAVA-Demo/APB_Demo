/*
Test Documentation:
- Test Name: authService - Get Current User
- Purpose: Verify service retrieves or creates current user
- Scenario: User data exists in localStorage
- Expected Result: Returns parsed user object
*/
/*
Test Documentation:
- Test Name: authService - Create Mock User
- Purpose: Verify service creates mock user when none exists
- Scenario: No user in localStorage
- Expected Result: Creates and stores mock user
*/
/*
Test Documentation:
- Test Name: authService - Get Token
- Purpose: Verify service extracts token from user
- Scenario: Request authentication token
- Expected Result: Returns user token
*/
/*
Coverage Report:
- Functions tested: getCurrentUser, getToken
- Scenarios covered: existing user, new user, token extraction
- Uncovered scenarios: none
*/

describe('authService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var authService, $rootScope, $window;
  
  beforeEach(inject(function(_authService_, _$rootScope_, _$window_) {
    authService = _authService_;
    $rootScope = _$rootScope_;
    $window = _$window_;
    $window.localStorage.clear();
  }));
  
  it('should return existing user from localStorage', function() {
    var mockUser = {userId: 'user456', name: 'Jane Doe', token: 'existing-token'};
    $window.localStorage.setItem('currentUser', JSON.stringify(mockUser));
    
    var result;
    authService.getCurrentUser().then(function(user) {
      result = user;
    });
    $rootScope.$digest();
    
    expect(result).toEqual(mockUser);
  });
  
  it('should create and store mock user when none exists', function() {
    var result;
    authService.getCurrentUser().then(function(user) {
      result = user;
    });
    $rootScope.$digest();
    
    expect(result.userId).toBe('user123');
    expect(result.name).toBe('John Doe');
    expect(result.token).toBe('mock-jwt-token');
    
    var stored = JSON.parse($window.localStorage.getItem('currentUser'));
    expect(stored).toEqual(result);
  });
  
  it('should return user token', function() {
    var result;
    authService.getToken().then(function(token) {
      result = token;
    });
    $rootScope.$digest();
    
    expect(result).toBe('mock-jwt-token');
  });
});