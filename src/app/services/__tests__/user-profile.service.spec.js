/*
Test Documentation:
- Test Name: UserProfileService Unit Tests
- Purpose: Validate user profile retrieval with API and mock data fallback
- Scenario: Tests getProfile with successful API response and API failure scenarios
- Expected Result: Correct user profile data returned, proper fallback to mock data
*/

(function() {
  'use strict';

  describe('UserProfileService', function() {
    var UserProfileService, $httpBackend, API_ENDPOINTS;
    var mockProfileResponse;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_UserProfileService_, _$httpBackend_, _API_ENDPOINTS_) {
      UserProfileService = _UserProfileService_;
      $httpBackend = _$httpBackend_;
      API_ENDPOINTS = _API_ENDPOINTS_;

      mockProfileResponse = {
        userId: 'user456',
        userName: 'Jane Doe',
        email: 'jane.doe@example.com',
        cardIds: ['card1', 'card2', 'card3']
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getProfile', function() {
      it('should fetch user profile from API successfully', function() {
        $httpBackend.expectGET(API_ENDPOINTS.userProfile).respond(200, mockProfileResponse);

        var result;
        UserProfileService.getProfile().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockProfileResponse);
        expect(result.userId).toBe('user456');
        expect(result.cardIds).toEqual(['card1', 'card2', 'card3']);
      });

      it('should return mock profile when API call fails', function() {
        $httpBackend.expectGET(API_ENDPOINTS.userProfile).respond(500, 'Server Error');

        var result;
        UserProfileService.getProfile().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.userId).toBe('user123');
        expect(result.cardIds).toEqual(['card1', 'card2', 'card3', 'card4', 'card5']);
      });

      it('should handle 404 error with mock data', function() {
        $httpBackend.expectGET(API_ENDPOINTS.userProfile).respond(404, 'Not Found');

        var result;
        UserProfileService.getProfile().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.userId).toBe('user123');
        expect(result.cardIds.length).toBe(5);
      });

      it('should handle network timeout gracefully', function() {
        $httpBackend.expectGET(API_ENDPOINTS.userProfile).respond(0, '');

        var result;
        UserProfileService.getProfile().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.userId).toBe('user123');
      });

      it('should handle 401 unauthorized error', function() {
        $httpBackend.expectGET(API_ENDPOINTS.userProfile).respond(401, 'Unauthorized');

        var result;
        UserProfileService.getProfile().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.userId).toBe('user123');
        expect(result.cardIds).toBeDefined();
      });

      it('should handle 403 forbidden error', function() {
        $httpBackend.expectGET(API_ENDPOINTS.userProfile).respond(403, 'Forbidden');

        var result;
        UserProfileService.getProfile().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.cardIds.length).toBe(5);
      });

      it('should return profile with cardIds array', function() {
        $httpBackend.expectGET(API_ENDPOINTS.userProfile).respond(500);

        var result;
        UserProfileService.getProfile().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.cardIds).toEqual(jasmine.any(Array));
        expect(result.cardIds.length).toBeGreaterThan(0);
      });

      it('should return mock profile with 5 card IDs', function() {
        $httpBackend.expectGET(API_ENDPOINTS.userProfile).respond(500);

        var result;
        UserProfileService.getProfile().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.cardIds).toEqual(['card1', 'card2', 'card3', 'card4', 'card5']);
      });

      it('should return consistent mock data on multiple failures', function() {
        $httpBackend.expectGET(API_ENDPOINTS.userProfile).respond(500);

        var result1;
        UserProfileService.getProfile().then(function(data) {
          result1 = data;
        });

        $httpBackend.flush();

        $httpBackend.expectGET(API_ENDPOINTS.userProfile).respond(500);

        var result2;
        UserProfileService.getProfile().then(function(data) {
          result2 = data;
        });

        $httpBackend.flush();

        expect(result1.userId).toBe(result2.userId);
        expect(result1.cardIds).toEqual(result2.cardIds);
      });

      it('should handle empty response gracefully', function() {
        $httpBackend.expectGET(API_ENDPOINTS.userProfile).respond(200, null);

        var result;
        UserProfileService.getProfile().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeNull();
      });

      it('should preserve API response structure when successful', function() {
        var customProfile = {
          userId: 'custom123',
          cardIds: ['cardA', 'cardB'],
          additionalField: 'extra data'
        };

        $httpBackend.expectGET(API_ENDPOINTS.userProfile).respond(200, customProfile);

        var result;
        UserProfileService.getProfile().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(customProfile);
        expect(result.additionalField).toBe('extra data');
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getProfile
  - Scenarios covered:
    * Successful API fetch
    * API failure with mock data fallback (500, 404, 401, 403, 0 errors)
    * Network timeout handling
    * Mock data structure validation
    * Consistent mock data across failures
    * Empty response handling
    * Custom API response preservation
    * CardIds array validation
  - Edge cases: Various HTTP errors, network failures, null responses
  - Uncovered scenarios: Profile caching, profile updates, concurrent requests
  */
})();