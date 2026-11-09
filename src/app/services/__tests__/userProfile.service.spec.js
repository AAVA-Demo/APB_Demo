/*
Test Documentation:
- Test Name: userProfile.service - getUserProfile
- Purpose: Validate user profile retrieval with mock data
- Scenario: Service provides mock user profile with card associations
- Expected Result: Returns user profile including card IDs
*/

describe('UserProfileService (userProfile.service.js)', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var UserProfileService;
  var $timeout;
  var $rootScope;
  
  beforeEach(inject(function(_UserProfileService_, _$timeout_, _$rootScope_) {
    UserProfileService = _UserProfileService_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getUserProfile', function() {
    it('should return mock user profile', function(done) {
      UserProfileService.getUserProfile().then(function(profile) {
        expect(profile).toBeDefined();
        expect(profile.userId).toBe('USER001');
        expect(profile.name).toBe('John Doe');
        expect(profile.email).toBe('john.doe@example.com');
        expect(profile.cardIds).toEqual(['CC001', 'CC002', 'CC003']);
        done();
      });
      
      $timeout.flush();
    });
    
    it('should include all required profile properties', function(done) {
      UserProfileService.getUserProfile().then(function(profile) {
        expect(profile.userId).toBeDefined();
        expect(profile.name).toBeDefined();
        expect(profile.email).toBeDefined();
        expect(profile.cardIds).toBeDefined();
        expect(Array.isArray(profile.cardIds)).toBe(true);
        done();
      });
      
      $timeout.flush();
    });
    
    it('should return a copy of the profile (not reference)', function(done) {
      UserProfileService.getUserProfile().then(function(firstCall) {
        firstCall.name = 'Modified Name';
        
        return UserProfileService.getUserProfile();
      }).then(function(secondCall) {
        expect(secondCall.name).toBe('John Doe');
        done();
      });
      
      $timeout.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getUserProfile
- Scenarios covered:
  * Retrieve user profile
  * Profile property validation
  * Data immutability (copy not reference)
- Uncovered scenarios: None
- Edge cases: Data immutability
*/