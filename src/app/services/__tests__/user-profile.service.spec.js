/*
Test Documentation:
- Test Name: UserProfileService - validateUser success
- Purpose: Validates user authentication and authorization
- Scenario: Valid userId provided
- Expected Result: Returns true for valid user
*/
/*
Test Documentation:
- Test Name: UserProfileService - validateUser failure
- Purpose: Validates rejection of invalid users
- Scenario: Invalid userId or authentication failure
- Expected Result: Returns false or rejects promise
*/
/*
Test Documentation:
- Test Name: UserProfileService - getCurrentUser
- Purpose: Validates retrieval of current authenticated user
- Scenario: User is logged in
- Expected Result: Returns user object with userId
*/
/*
Coverage Report:
- Functions tested: validateUser, getCurrentUser
- Scenarios covered: valid user, invalid user, error handling, current user retrieval
- Uncovered scenarios: session expiration, token refresh
*/

(function() {
  'use strict';

  describe('UserProfileService', function() {
    var UserProfileService, $httpBackend, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_UserProfileService_, _$httpBackend_, _API_CONFIG_) {
      UserProfileService = _UserProfileService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('validateUser', function() {
      it('should validate a valid user', function() {
        var userId = 'user123';
        var mockResponse = { valid: true };

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/user/validate?userId=' + userId).respond(200, mockResponse);

        var result;
        UserProfileService.validateUser(userId).then(function(isValid) {
          result = isValid;
        });

        $httpBackend.flush();

        expect(result).toBe(true);
      });

      it('should reject an invalid user', function() {
        var userId = 'invalidUser';
        var mockResponse = { valid: false };

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/user/validate?userId=' + userId).respond(200, mockResponse);

        var result;
        UserProfileService.validateUser(userId).then(function(isValid) {
          result = isValid;
        });

        $httpBackend.flush();

        expect(result).toBe(false);
      });

      it('should handle error when validating user', function() {
        var userId = 'user123';
        spyOn(console, 'error');

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/user/validate?userId=' + userId).respond(500, 'Server Error');

        var error;
        UserProfileService.validateUser(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('User validation error:', jasmine.any(Object));
      });

      it('should handle 401 unauthorized error', function() {
        var userId = 'user123';
        spyOn(console, 'error');

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/user/validate?userId=' + userId).respond(401, 'Unauthorized');

        var error;
        UserProfileService.validateUser(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe('getCurrentUser', function() {
      it('should return the current user', function() {
        var user = UserProfileService.getCurrentUser();

        expect(user).toBeDefined();
        expect(user.userId).toBe('user123');
      });

      it('should return consistent user object', function() {
        var user1 = UserProfileService.getCurrentUser();
        var user2 = UserProfileService.getCurrentUser();

        expect(user1.userId).toBe(user2.userId);
      });
    });
  });
})();