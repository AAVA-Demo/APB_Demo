/*
Test Documentation:
- Test Name: userProfileService Unit Tests
- Purpose: Validates user profile service for retrieving user profile and associated card IDs
- Scenario: Tests getUserProfile with success and error scenarios including mock data fallback
- Expected Result: Service should fetch user profile or provide mock data on failure
*/

describe('userProfileService', function() {
  'use strict';

  var userProfileService, $httpBackend, $q, API_CONFIG;
  var mockUserId = 'user123';
  var mockProfile = {
    userId: 'user123',
    cards: ['card1', 'card2', 'card3']
  };

  beforeEach(module('creditCardApp.cardManagement'));

  beforeEach(inject(function(_userProfileService_, _$httpBackend_, _$q_, _API_CONFIG_) {
    userProfileService = _userProfileService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(userProfileService).toBeDefined();
    });

    it('should have getUserProfile method', function() {
      expect(userProfileService.getUserProfile).toBeDefined();
      expect(typeof userProfileService.getUserProfile).toBe('function');
    });
  });

  describe('getUserProfile() - Success Scenarios', function() {
    it('should make GET request to correct endpoint with userId', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.users + '/' + mockUserId + '/profile';
      $httpBackend.expectGET(expectedUrl).respond(200, mockProfile);

      userProfileService.getUserProfile(mockUserId);
      $httpBackend.flush();
    });

    it('should return user profile on success', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.users + '/' + mockUserId + '/profile';
      $httpBackend.expectGET(expectedUrl).respond(200, mockProfile);

      userProfileService.getUserProfile(mockUserId).then(function(data) {
        expect(data).toEqual(mockProfile);
      });
      $httpBackend.flush();
    });

    it('should return profile with userId field', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.users + '/' + mockUserId + '/profile';
      $httpBackend.expectGET(expectedUrl).respond(200, mockProfile);

      userProfileService.getUserProfile(mockUserId).then(function(data) {
        expect(data.userId).toBe(mockUserId);
      });
      $httpBackend.flush();
    });

    it('should return profile with cards array', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.users + '/' + mockUserId + '/profile';
      $httpBackend.expectGET(expectedUrl).respond(200, mockProfile);

      userProfileService.getUserProfile(mockUserId).then(function(data) {
        expect(data.cards).toBeDefined();
        expect(Array.isArray(data.cards)).toBe(true);
        expect(data.cards.length).toBe(3);
      });
      $httpBackend.flush();
    });
  });

  describe('getUserProfile() - Error Handling', function() {
    it('should return mock profile on 500 server error', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.users + '/' + mockUserId + '/profile';
      $httpBackend.expectGET(expectedUrl).respond(500, {error: 'Server Error'});

      userProfileService.getUserProfile(mockUserId).then(function(data) {
        expect(data).toBeDefined();
        expect(data.userId).toBe('user123');
        expect(Array.isArray(data.cards)).toBe(true);
      });
      $httpBackend.flush();
    });

    it('should return mock profile on 404 not found', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.users + '/' + mockUserId + '/profile';
      $httpBackend.expectGET(expectedUrl).respond(404, {error: 'User not found'});

      userProfileService.getUserProfile(mockUserId).then(function(data) {
        expect(data).toBeDefined();
        expect(data.userId).toBeDefined();
      });
      $httpBackend.flush();
    });

    it('should return mock profile on network error', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.users + '/' + mockUserId + '/profile';
      $httpBackend.expectGET(expectedUrl).respond(-1, '');

      userProfileService.getUserProfile(mockUserId).then(function(data) {
        expect(data).toBeDefined();
        expect(data.cards).toBeDefined();
      });
      $httpBackend.flush();
    });

    it('should return mock profile on unauthorized access', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.users + '/' + mockUserId + '/profile';
      $httpBackend.expectGET(expectedUrl).respond(401, {error: 'Unauthorized'});

      userProfileService.getUserProfile(mockUserId).then(function(data) {
        expect(data).toBeDefined();
      });
      $httpBackend.flush();
    });
  });

  describe('Mock Profile Generation', function() {
    it('should generate valid mock profile structure', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.users + '/' + mockUserId + '/profile';
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      userProfileService.getUserProfile(mockUserId).then(function(data) {
        expect(data.userId).toBe('user123');
        expect(data.cards).toBeDefined();
        expect(Array.isArray(data.cards)).toBe(true);
      });
      $httpBackend.flush();
    });

    it('should generate mock profile with three card IDs', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.users + '/' + mockUserId + '/profile';
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      userProfileService.getUserProfile(mockUserId).then(function(data) {
        expect(data.cards.length).toBe(3);
        expect(data.cards).toEqual(['card1', 'card2', 'card3']);
      });
      $httpBackend.flush();
    });
  });

  describe('Multiple User Scenarios', function() {
    it('should handle requests for different users', function() {
      var user1 = 'user123';
      var user2 = 'user456';
      var baseUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.users;
      
      $httpBackend.expectGET(baseUrl + '/' + user1 + '/profile').respond(200, {userId: user1, cards: []});
      $httpBackend.expectGET(baseUrl + '/' + user2 + '/profile').respond(200, {userId: user2, cards: []});

      userProfileService.getUserProfile(user1);
      userProfileService.getUserProfile(user2);
      $httpBackend.flush();
    });

    it('should handle concurrent requests for same user', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.users + '/' + mockUserId + '/profile';
      $httpBackend.expectGET(expectedUrl).respond(200, mockProfile);
      $httpBackend.expectGET(expectedUrl).respond(200, mockProfile);

      userProfileService.getUserProfile(mockUserId);
      userProfileService.getUserProfile(mockUserId);
      $httpBackend.flush();
    });
  });

  describe('Profile Data Validation', function() {
    it('should validate profile structure', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.users + '/' + mockUserId + '/profile';
      $httpBackend.expectGET(expectedUrl).respond(200, mockProfile);

      userProfileService.getUserProfile(mockUserId).then(function(data) {
        expect(typeof data).toBe('object');
        expect(data.userId).toBeDefined();
        expect(data.cards).toBeDefined();
      });
      $httpBackend.flush();
    });

    it('should validate cards array contains strings', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.users + '/' + mockUserId + '/profile';
      $httpBackend.expectGET(expectedUrl).respond(200, mockProfile);

      userProfileService.getUserProfile(mockUserId).then(function(data) {
        data.cards.forEach(function(cardId) {
          expect(typeof cardId).toBe('string');
        });
      });
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getUserProfile, getMockProfile (internal)
- Scenarios covered:
  * Successful profile retrieval
  * Error handling (500, 404, 401, network errors)
  * Mock profile generation
  * Multiple user requests
  * Concurrent requests
  * Profile data structure validation
- Uncovered scenarios: Profile caching, request cancellation
*/