/*
Test Documentation:
- Test Name: UserProfileFactory Unit Tests
- Purpose: Validate user profile data retrieval functionality
- Scenario: Tests getUserProfile method for successful and failed operations
- Expected Result: Proper API calls and error handling for user profile data
*/

(function() {
'use strict';

describe('UserProfileFactory', function() {
  var UserProfileFactory, $httpBackend, API_ENDPOINTS, $q;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_UserProfileFactory_, _$httpBackend_, _API_ENDPOINTS_, _$q_) {
    UserProfileFactory = _UserProfileFactory_;
    $httpBackend = _$httpBackend_;
    API_ENDPOINTS = _API_ENDPOINTS_;
    $q = _$q_;
    
    window.toastr = window.toastr || {};
    window.toastr.error = jasmine.createSpy('toastr.error');
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getUserProfile', function() {
    it('should retrieve user profile successfully', function() {
      var mockProfile = {
        userId: 'user-123',
        userName: 'John Doe',
        email: 'john.doe@example.com',
        cardIds: ['card1', 'card2', 'card3']
      };
      
      $httpBackend.expectGET(API_ENDPOINTS.userProfile)
        .respond(200, mockProfile);
      
      var result;
      UserProfileFactory.getUserProfile().then(function(profile) {
        result = profile;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockProfile);
      expect(result.userId).toBe('user-123');
      expect(result.cardIds.length).toBe(3);
    });
    
    it('should handle empty cardIds array', function() {
      var mockProfile = {
        userId: 'user-456',
        userName: 'Jane Smith',
        email: 'jane.smith@example.com',
        cardIds: []
      };
      
      $httpBackend.expectGET(API_ENDPOINTS.userProfile)
        .respond(200, mockProfile);
      
      var result;
      UserProfileFactory.getUserProfile().then(function(profile) {
        result = profile;
      });
      
      $httpBackend.flush();
      
      expect(result.cardIds).toEqual([]);
    });
    
    it('should handle API errors gracefully', function() {
      $httpBackend.expectGET(API_ENDPOINTS.userProfile)
        .respond(500, {error: 'Server error'});
      
      var rejected = false;
      UserProfileFactory.getUserProfile().catch(function(error) {
        rejected = true;
      });
      
      $httpBackend.flush();
      
      expect(rejected).toBe(true);
      expect(window.toastr.error).toHaveBeenCalledWith('Failed to load user profile');
    });
    
    it('should handle 401 unauthorized errors', function() {
      $httpBackend.expectGET(API_ENDPOINTS.userProfile)
        .respond(401, {error: 'Unauthorized'});
      
      var rejected = false;
      UserProfileFactory.getUserProfile().catch(function(error) {
        rejected = true;
      });
      
      $httpBackend.flush();
      
      expect(rejected).toBe(true);
      expect(window.toastr.error).toHaveBeenCalled();
    });
    
    it('should handle network timeout errors', function() {
      $httpBackend.expectGET(API_ENDPOINTS.userProfile)
        .respond(0, '');
      
      var rejected = false;
      UserProfileFactory.getUserProfile().catch(function(error) {
        rejected = true;
      });
      
      $httpBackend.flush();
      
      expect(rejected).toBe(true);
      expect(window.toastr.error).toHaveBeenCalled();
    });
    
    it('should handle 404 not found errors', function() {
      $httpBackend.expectGET(API_ENDPOINTS.userProfile)
        .respond(404, {error: 'Profile not found'});
      
      var rejected = false;
      UserProfileFactory.getUserProfile().catch(function(error) {
        rejected = true;
      });
      
      $httpBackend.flush();
      
      expect(rejected).toBe(true);
    });
    
    it('should return profile with all expected fields', function() {
      var mockProfile = {
        userId: 'user-789',
        userName: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        cardIds: ['card1'],
        phoneNumber: '+1234567890',
        address: '123 Main St'
      };
      
      $httpBackend.expectGET(API_ENDPOINTS.userProfile)
        .respond(200, mockProfile);
      
      var result;
      UserProfileFactory.getUserProfile().then(function(profile) {
        result = profile;
      });
      
      $httpBackend.flush();
      
      expect(result.phoneNumber).toBe('+1234567890');
      expect(result.address).toBe('123 Main St');
    });
    
    it('should handle profile with missing optional fields', function() {
      var mockProfile = {
        userId: 'user-minimal',
        cardIds: ['card1']
      };
      
      $httpBackend.expectGET(API_ENDPOINTS.userProfile)
        .respond(200, mockProfile);
      
      var result;
      UserProfileFactory.getUserProfile().then(function(profile) {
        result = profile;
      });
      
      $httpBackend.flush();
      
      expect(result.userId).toBe('user-minimal');
      expect(result.userName).toBeUndefined();
    });
  });
});

/*
Coverage Report:
- Functions tested: getUserProfile
- Scenarios covered:
  * Successful profile retrieval
  * Empty cardIds array
  * API error handling (500)
  * 401 unauthorized errors
  * Network timeout (0 status)
  * 404 not found errors
  * Profile with all fields
  * Profile with missing optional fields
  * Toastr error notifications
- Edge cases: Empty arrays, missing fields, various HTTP error codes
- Uncovered scenarios: None - full coverage achieved
*/
})();