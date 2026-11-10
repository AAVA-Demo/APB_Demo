/*
Test Documentation:
- Test Name: UserProfileFactory - getUserProfile (success)
- Purpose: Validates that getUserProfile retrieves user profile from API
- Scenario: API returns user profile data
- Expected Result: Returns user profile object
*/
/*
Test Documentation:
- Test Name: UserProfileFactory - getUserProfile (cached)
- Purpose: Validates that getUserProfile returns cached profile on subsequent calls
- Scenario: Profile is already cached
- Expected Result: Returns cached profile without making HTTP request
*/
/*
Test Documentation:
- Test Name: UserProfileFactory - getUserProfile (error)
- Purpose: Validates that getUserProfile returns mock data on API failure
- Scenario: API request fails
- Expected Result: Returns default mock profile
*/
/*
Test Documentation:
- Test Name: UserProfileFactory - getUserProfile (empty response)
- Purpose: Validates that getUserProfile handles empty API response
- Scenario: API returns empty data
- Expected Result: Returns default mock profile
*/
/*
Coverage Report:
- Functions tested: getUserProfile
- Scenarios covered: successful API call, cached profile, API failure, empty response
- Uncovered scenarios: none
*/

describe('UserProfileFactory', function() {
  'use strict';

  var UserProfileFactory;
  var $httpBackend;
  var $q;
  var API_CONFIG;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_UserProfileFactory_, _$httpBackend_, _$q_, _API_CONFIG_) {
    UserProfileFactory = _UserProfileFactory_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getUserProfile', function() {
    it('should retrieve user profile from API successfully', function() {
      var mockProfile = {
        userId: 'user456',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        cardIds: ['card4', 'card5']
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.userProfile)
        .respond(200, mockProfile);

      var result;
      UserProfileFactory.getUserProfile().then(function(profile) {
        result = profile;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.userId).toBe('user456');
      expect(result.name).toBe('Jane Smith');
      expect(result.email).toBe('jane.smith@example.com');
      expect(result.cardIds).toEqual(['card4', 'card5']);
    });

    it('should return cached profile on subsequent calls without making HTTP request', function() {
      var mockProfile = {
        userId: 'user789',
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        cardIds: ['card6']
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.userProfile)
        .respond(200, mockProfile);

      var firstResult, secondResult;
      UserProfileFactory.getUserProfile().then(function(profile) {
        firstResult = profile;
      });

      $httpBackend.flush();

      // Second call should not trigger HTTP request
      UserProfileFactory.getUserProfile().then(function(profile) {
        secondResult = profile;
      });

      // No flush needed as no HTTP request should be made
      expect(firstResult).toEqual(secondResult);
      expect(firstResult.userId).toBe('user789');
    });

    it('should return mock profile when API request fails', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.userProfile)
        .respond(500, 'Server Error');

      var result;
      UserProfileFactory.getUserProfile().then(function(profile) {
        result = profile;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.userId).toBe('user123');
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john.doe@example.com');
      expect(result.cardIds).toEqual(['card1', 'card2', 'card3']);
    });

    it('should return mock profile when API returns empty data', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.userProfile)
        .respond(200, null);

      var result;
      UserProfileFactory.getUserProfile().then(function(profile) {
        result = profile;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.userId).toBe('user123');
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john.doe@example.com');
      expect(result.cardIds).toEqual(['card1', 'card2', 'card3']);
    });

    it('should handle network errors gracefully', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.userProfile)
        .respond(0, '');

      var result;
      UserProfileFactory.getUserProfile().then(function(profile) {
        result = profile;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.userId).toBe('user123');
    });

    it('should cache profile after API failure', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.userProfile)
        .respond(404, 'Not Found');

      var firstResult, secondResult;
      UserProfileFactory.getUserProfile().then(function(profile) {
        firstResult = profile;
      });

      $httpBackend.flush();

      // Second call should return cached mock profile
      UserProfileFactory.getUserProfile().then(function(profile) {
        secondResult = profile;
      });

      expect(firstResult).toEqual(secondResult);
      expect(firstResult.userId).toBe('user123');
    });
  });
});