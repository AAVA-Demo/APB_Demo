/*
Test Documentation:
- Test Name: UserProfileService Test Suite
- Purpose: Validate user profile data retrieval and card association management
- Scenario: Tests fetching user's associated credit card IDs for portfolio management
- Expected Result: Service correctly retrieves array of card IDs linked to user account
*/

(function() {
'use strict';

describe('UserProfileService', function() {
  var UserProfileService, $httpBackend, API_ENDPOINTS;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_UserProfileService_, _$httpBackend_, _API_ENDPOINTS_) {
    UserProfileService = _UserProfileService_;
    $httpBackend = _$httpBackend_;
    API_ENDPOINTS = _API_ENDPOINTS_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getUserCardIds', function() {
    /*
    Test Documentation:
    - Test Name: should fetch user card IDs successfully
    - Purpose: Verify successful retrieval of user's card IDs
    - Scenario: API returns array of card IDs
    - Expected Result: Service returns array of card ID strings
    */
    it('should fetch user card IDs successfully', function() {
      var mockResponse = {
        cardIds: ['card1', 'card2', 'card3', 'card4', 'card5']
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.userCards)
        .respond(200, mockResponse);

      var result;
      UserProfileService.getUserCardIds().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(5);
      expect(result[0]).toBe('card1');
      expect(result[4]).toBe('card5');
    });

    /*
    Test Documentation:
    - Test Name: should handle empty card IDs array
    - Purpose: Verify service handles user with no cards
    - Scenario: API returns empty cardIds array
    - Expected Result: Service returns empty array
    */
    it('should handle empty card IDs array', function() {
      var mockResponse = {
        cardIds: []
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.userCards)
        .respond(200, mockResponse);

      var result;
      UserProfileService.getUserCardIds().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle missing cardIds property
    - Purpose: Verify service handles malformed API response
    - Scenario: API response does not include cardIds property
    - Expected Result: Service returns empty array
    */
    it('should handle missing cardIds property', function() {
      var mockResponse = {};

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.userCards)
        .respond(200, mockResponse);

      var result;
      UserProfileService.getUserCardIds().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle single card ID
    - Purpose: Verify service works with user having single card
    - Scenario: API returns single card ID
    - Expected Result: Service returns array with one card ID
    */
    it('should handle single card ID', function() {
      var mockResponse = {
        cardIds: ['card123']
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.userCards)
        .respond(200, mockResponse);

      var result;
      UserProfileService.getUserCardIds().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(1);
      expect(result[0]).toBe('card123');
    });

    /*
    Test Documentation:
    - Test Name: should handle maximum 20 card IDs
    - Purpose: Verify service supports maximum card limit per user
    - Scenario: API returns 20 card IDs (system maximum)
    - Expected Result: Service returns all 20 card IDs
    */
    it('should handle maximum 20 card IDs', function() {
      var cardIds = [];
      for (var i = 1; i <= 20; i++) {
        cardIds.push('card' + i);
      }
      var mockResponse = { cardIds: cardIds };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.userCards)
        .respond(200, mockResponse);

      var result;
      UserProfileService.getUserCardIds().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(20);
      expect(result[0]).toBe('card1');
      expect(result[19]).toBe('card20');
    });

    /*
    Test Documentation:
    - Test Name: should handle HTTP 401 unauthorized error
    - Purpose: Verify service handles authentication errors
    - Scenario: API returns 401 Unauthorized
    - Expected Result: Promise rejected with error
    */
    it('should handle HTTP 401 unauthorized error', function() {
      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.userCards)
        .respond(401, 'Unauthorized');

      var error;
      UserProfileService.getUserCardIds().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });

    /*
    Test Documentation:
    - Test Name: should handle HTTP 403 forbidden error
    - Purpose: Verify service handles access forbidden errors
    - Scenario: API returns 403 Forbidden
    - Expected Result: Promise rejected with error
    */
    it('should handle HTTP 403 forbidden error', function() {
      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.userCards)
        .respond(403, 'Forbidden');

      var error;
      UserProfileService.getUserCardIds().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(403);
    });

    /*
    Test Documentation:
    - Test Name: should handle HTTP 404 not found error
    - Purpose: Verify service handles user not found errors
    - Scenario: API returns 404 Not Found
    - Expected Result: Promise rejected with error
    */
    it('should handle HTTP 404 not found error', function() {
      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.userCards)
        .respond(404, 'User Not Found');

      var error;
      UserProfileService.getUserCardIds().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    /*
    Test Documentation:
    - Test Name: should handle HTTP 500 internal server error
    - Purpose: Verify service handles server errors
    - Scenario: API returns 500 Internal Server Error
    - Expected Result: Promise rejected with error
    */
    it('should handle HTTP 500 internal server error', function() {
      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.userCards)
        .respond(500, 'Internal Server Error');

      var error;
      UserProfileService.getUserCardIds().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    /*
    Test Documentation:
    - Test Name: should handle network timeout
    - Purpose: Verify service handles request timeouts
    - Scenario: API request times out
    - Expected Result: Promise rejected with timeout error
    */
    it('should handle network timeout', function() {
      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.userCards)
        .respond(-1, '');

      var error;
      UserProfileService.getUserCardIds().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should handle null cardIds
    - Purpose: Verify service handles null cardIds in response
    - Scenario: API returns null for cardIds
    - Expected Result: Service returns empty array
    */
    it('should handle null cardIds', function() {
      var mockResponse = {
        cardIds: null
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.userCards)
        .respond(200, mockResponse);

      var result;
      UserProfileService.getUserCardIds().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should preserve card ID order
    - Purpose: Verify service maintains order of card IDs from API
    - Scenario: API returns card IDs in specific order
    - Expected Result: Service returns card IDs in same order
    */
    it('should preserve card ID order', function() {
      var mockResponse = {
        cardIds: ['cardZ', 'cardA', 'cardM', 'cardB']
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.userCards)
        .respond(200, mockResponse);

      var result;
      UserProfileService.getUserCardIds().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result[0]).toBe('cardZ');
      expect(result[1]).toBe('cardA');
      expect(result[2]).toBe('cardM');
      expect(result[3]).toBe('cardB');
    });

    /*
    Test Documentation:
    - Test Name: should handle duplicate card IDs
    - Purpose: Verify service returns data as-is even with duplicates
    - Scenario: API returns duplicate card IDs
    - Expected Result: Service returns all IDs including duplicates
    */
    it('should handle duplicate card IDs', function() {
      var mockResponse = {
        cardIds: ['card1', 'card2', 'card1', 'card3']
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.userCards)
        .respond(200, mockResponse);

      var result;
      UserProfileService.getUserCardIds().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(4);
      expect(result[0]).toBe('card1');
      expect(result[2]).toBe('card1');
    });
  });
});

/*
Coverage Report:
- Functions tested: getUserCardIds
- Scenarios covered:
  * Successful card IDs retrieval
  * Empty card IDs array
  * Missing cardIds property
  * Single card ID
  * Maximum 20 card IDs
  * HTTP error responses (401, 403, 404, 500)
  * Network timeout
  * Null cardIds
  * Card ID order preservation
  * Duplicate card IDs
- Uncovered scenarios: None - comprehensive coverage achieved
*/
})();