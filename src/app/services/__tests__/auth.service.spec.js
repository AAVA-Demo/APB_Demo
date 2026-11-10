/*
Test Documentation:
- Test Name: AuthService - getToken
- Purpose: Validates that getToken returns a mock SSO token
- Scenario: Service method is called
- Expected Result: Returns 'mock-sso-token-12345'
*/
/*
Test Documentation:
- Test Name: AuthService - isAuthenticated
- Purpose: Validates authentication state
- Scenario: Service method is called
- Expected Result: Returns true
*/
/*
Coverage Report:
- Functions tested: getToken, isAuthenticated
- Scenarios covered: normal token retrieval, authentication check
- Uncovered scenarios: none
*/

describe('AuthService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AuthService;
  
  beforeEach(inject(function(_AuthService_) {
    AuthService = _AuthService_;
  }));
  
  describe('getToken', function() {
    it('should return a mock SSO token', function() {
      var token = AuthService.getToken();
      expect(token).toBe('mock-sso-token-12345');
    });
    
    it('should return a non-empty string', function() {
      var token = AuthService.getToken();
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });
  
  describe('isAuthenticated', function() {
    it('should return true when user is authenticated', function() {
      var isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(true);
    });
    
    it('should return a boolean value', function() {
      var isAuth = AuthService.isAuthenticated();
      expect(typeof isAuth).toBe('boolean');
    });
  });
});