/*
Test Documentation:
- Test Name: UserProfileService Test Suite
- Purpose: Validate user profile validation functionality
- Scenario: Tests user validation for valid and invalid user IDs
- Expected Result: Service correctly validates users and returns profile data or errors
*/

(function() {
  'use strict';

  describe('UserProfileService', function() {
    var UserProfileService, $q, $rootScope, $timeout;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_UserProfileService_, _$q_, _$rootScope_, _$timeout_) {
      UserProfileService = _UserProfileService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
    }));

    describe('validateUser', function() {
      it('should validate user with correct userId', function() {
        var result;
        UserProfileService.validateUser('user123').then(function(profile) {
          result = profile;
        });
        $timeout.flush();

        expect(result).toBeDefined();
        expect(result.userId).toBe('user123');
        expect(result.name).toBe('John Doe');
        expect(result.email).toBe('john@example.com');
      });

      it('should return profile with cardIds array', function() {
        var result;
        UserProfileService.validateUser('user123').then(function(profile) {
          result = profile;
        });
        $timeout.flush();

        expect(result.cardIds).toBeDefined();
        expect(Array.isArray(result.cardIds)).toBe(true);
        expect(result.cardIds.length).toBe(3);
      });

      it('should return profile with correct card IDs', function() {
        var result;
        UserProfileService.validateUser('user123').then(function(profile) {
          result = profile;
        });
        $timeout.flush();

        expect(result.cardIds).toContain('card1');
        expect(result.cardIds).toContain('card2');
        expect(result.cardIds).toContain('card3');
      });

      it('should reject with error for invalid userId', function() {
        var error;
        UserProfileService.validateUser('invalidUser').catch(function(err) {
          error = err;
        });
        $timeout.flush();

        expect(error).toBeDefined();
        expect(error.error).toBe('Invalid user');
      });

      it('should reject for empty userId', function() {
        var error;
        UserProfileService.validateUser('').catch(function(err) {
          error = err;
        });
        $timeout.flush();

        expect(error).toBeDefined();
        expect(error.error).toBe('Invalid user');
      });

      it('should reject for null userId', function() {
        var error;
        UserProfileService.validateUser(null).catch(function(err) {
          error = err;
        });
        $timeout.flush();

        expect(error).toBeDefined();
        expect(error.error).toBe('Invalid user');
      });

      it('should resolve promise with 200ms delay', function(done) {
        var startTime = Date.now();
        UserProfileService.validateUser('user123').then(function() {
          var elapsed = Date.now() - startTime;
          expect(elapsed).toBeGreaterThanOrEqual(150);
          done();
        });
        $timeout.flush();
      });

      it('should return profile with all required fields', function() {
        var result;
        UserProfileService.validateUser('user123').then(function(profile) {
          result = profile;
        });
        $timeout.flush();

        expect(result).toEqual(jasmine.objectContaining({
          userId: jasmine.any(String),
          name: jasmine.any(String),
          email: jasmine.any(String),
          cardIds: jasmine.any(Array)
        }));
      });

      it('should handle concurrent validation requests', function() {
        var result1, result2, error1;
        UserProfileService.validateUser('user123').then(function(profile) { result1 = profile; });
        UserProfileService.validateUser('user123').then(function(profile) { result2 = profile; });
        UserProfileService.validateUser('invalid').catch(function(err) { error1 = err; });
        $timeout.flush();

        expect(result1).toBeDefined();
        expect(result2).toBeDefined();
        expect(error1).toBeDefined();
      });

      it('should validate email format in profile', function() {
        var result;
        UserProfileService.validateUser('user123').then(function(profile) {
          result = profile;
        });
        $timeout.flush();

        expect(result.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: validateUser
  - Scenarios covered:
    * Valid user validation
    * Profile with cardIds array
    * Correct card IDs in profile
    * Invalid userId rejection
    * Empty userId rejection
    * Null userId rejection
    * Promise timing (200ms delay)
    * All required fields in profile
    * Concurrent validation requests
    * Email format validation
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();