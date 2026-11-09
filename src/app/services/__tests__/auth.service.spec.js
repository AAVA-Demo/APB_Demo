/*
Test Documentation:
- Test Name: AuthService - validateSession
- Purpose: Validates that validateSession resolves when authToken exists in sessionStorage
- Scenario: User has valid session token stored
- Expected Result: Promise resolves with valid:true and token
*/
/*
Test Documentation:
- Test Name: AuthService - validateSession rejection
- Purpose: Validates that validateSession rejects when no authToken exists
- Scenario: User has no session token
- Expected Result: Promise rejects with valid:false
*/
/*
Test Documentation:
- Test Name: AuthService - getUserId
- Purpose: Validates that getUserId returns userId from sessionStorage or default
- Scenario: User retrieves userId
- Expected Result: Returns stored userId or 'user123'
*/
/*
Coverage Report:
- Functions tested: validateSession, getUserId
- Scenarios covered: valid session, invalid session, default userId
- Uncovered scenarios: none
*/

describe('AuthService', function() {
  'use strict';

  var AuthService, $window, $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_AuthService_, _$window_, _$rootScope_) {
    AuthService = _AuthService_;
    $window = _$window_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(function() {
    $window.sessionStorage.clear();
  });

  describe('validateSession', function() {
    it('should resolve with valid:true when authToken exists', function() {
      $window.sessionStorage.setItem('authToken', 'test-token-123');

      var result;
      AuthService.validateSession().then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(result.valid).toBe(true);
      expect(result.token).toBe('test-token-123');
    });

    it('should reject with valid:false when authToken does not exist', function() {
      var error;
      AuthService.validateSession().catch(function(err) {
        error = err;
      });
      $rootScope.$digest();

      expect(error.valid).toBe(false);
    });
  });

  describe('getUserId', function() {
    it('should return userId from sessionStorage when it exists', function() {
      $window.sessionStorage.setItem('userId', 'user456');

      var userId = AuthService.getUserId();

      expect(userId).toBe('user456');
    });

    it('should return default userId when sessionStorage is empty', function() {
      var userId = AuthService.getUserId();

      expect(userId).toBe('user123');
    });
  });
});