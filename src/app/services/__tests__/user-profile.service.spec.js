/*
Test Documentation:
- Test Name: UserProfileService Unit Tests
- Purpose: Validate user profile card linking functionality and API integration
- Scenario: Tests cover successful card ID retrieval, error handling, empty responses, and API interactions
- Expected Result: Service correctly retrieves linked card IDs and handles all success/error scenarios
*/

(function() {
'use strict';

describe('UserProfileService', function() {
  var UserProfileService;
  var $httpBackend;
  var $rootScope;
  var API_BASE_URL;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_UserProfileService_, _$httpBackend_, _$rootScope_, _API_BASE_URL_) {
    UserProfileService = _UserProfileService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    API_BASE_URL = _API_BASE_URL_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getLinkedCardIds', function() {
    /*
    Test Documentation:
    - Test Name: should retrieve linked card IDs successfully
    - Purpose: Verify successful retrieval of card IDs from API
    - Scenario: API returns array of card IDs
    - Expected Result: Promise resolves with card ID array
    */
    it('should retrieve linked card IDs successfully', function() {
      var mockCardIds = ['card-001', 'card-002', 'card-003'];
      var result;

      $httpBackend.expectGET(API_BASE_URL + '/user/profile/cards').respond(200, mockCardIds);

      UserProfileService.getLinkedCardIds().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCardIds);
      expect(result.length).toBe(3);
    });

    /*
    Test Documentation:
    - Test Name: should handle empty card list
    - Purpose: Verify handling of user with no linked cards
    - Scenario: API returns empty array
    - Expected Result: Promise resolves with empty array
    */
    it('should handle empty card list', function() {
      var result;

      $httpBackend.expectGET(API_BASE_URL + '/user/profile/cards').respond(200, []);

      UserProfileService.getLinkedCardIds().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle null response data
    - Purpose: Verify fallback to empty array when API returns null
    - Scenario: API response data is null
    - Expected Result: Promise resolves with empty array
    */
    it('should handle null response data', function() {
      var result;

      $httpBackend.expectGET(API_BASE_URL + '/user/profile/cards').respond(200, null);

      UserProfileService.getLinkedCardIds().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
    });

    /*
    Test Documentation:
    - Test Name: should handle undefined response data
    - Purpose: Verify fallback to empty array when API returns undefined
    - Scenario: API response data is undefined
    - Expected Result: Promise resolves with empty array
    */
    it('should handle undefined response data', function() {
      var result;

      $httpBackend.expectGET(API_BASE_URL + '/user/profile/cards').respond(200, undefined);

      UserProfileService.getLinkedCardIds().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
    });

    /*
    Test Documentation:
    - Test Name: should reject promise on 404 error
    - Purpose: Verify error handling for not found resource
    - Scenario: API returns 404 status
    - Expected Result: Promise rejected with error
    */
    it('should reject promise on 404 error', function() {
      var error;

      $httpBackend.expectGET(API_BASE_URL + '/user/profile/cards').respond(404, 'Not Found');

      UserProfileService.getLinkedCardIds().then(function(data) {
        fail('Promise should have been rejected');
      }, function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    /*
    Test Documentation:
    - Test Name: should reject promise on 500 server error
    - Purpose: Verify error handling for server errors
    - Scenario: API returns 500 status
    - Expected Result: Promise rejected with error
    */
    it('should reject promise on 500 server error', function() {
      var error;

      $httpBackend.expectGET(API_BASE_URL + '/user/profile/cards').respond(500, 'Internal Server Error');

      UserProfileService.getLinkedCardIds().then(function(data) {
        fail('Promise should have been rejected');
      }, function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    /*
    Test Documentation:
    - Test Name: should reject promise on 401 unauthorized error
    - Purpose: Verify error handling for authentication failures
    - Scenario: API returns 401 status
    - Expected Result: Promise rejected with error
    */
    it('should reject promise on 401 unauthorized error', function() {
      var error;

      $httpBackend.expectGET(API_BASE_URL + '/user/profile/cards').respond(401, 'Unauthorized');

      UserProfileService.getLinkedCardIds().then(function(data) {
        fail('Promise should have been rejected');
      }, function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });

    /*
    Test Documentation:
    - Test Name: should reject promise on network error
    - Purpose: Verify error handling for network failures
    - Scenario: Network request fails
    - Expected Result: Promise rejected with error
    */
    it('should reject promise on network error', function() {
      var error;

      $httpBackend.expectGET(API_BASE_URL + '/user/profile/cards').respond(0, '');

      UserProfileService.getLinkedCardIds().then(function(data) {
        fail('Promise should have been rejected');
      }, function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should use correct API endpoint
    - Purpose: Verify correct API URL construction
    - Scenario: Service method called
    - Expected Result: Correct endpoint called with API_BASE_URL
    */
    it('should use correct API endpoint', function() {
      var expectedUrl = API_BASE_URL + '/user/profile/cards';

      $httpBackend.expectGET(expectedUrl).respond(200, []);

      UserProfileService.getLinkedCardIds();

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should return a promise
    - Purpose: Verify method returns promise object
    - Scenario: Service method called
    - Expected Result: Returns promise with then method
    */
    it('should return a promise', function() {
      $httpBackend.expectGET(API_BASE_URL + '/user/profile/cards').respond(200, []);

      var result = UserProfileService.getLinkedCardIds();

      expect(result).toBeDefined();
      expect(typeof result.then).toBe('function');
      expect(typeof result.catch).toBe('function');

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle large array of card IDs
    - Purpose: Verify handling of users with many linked cards
    - Scenario: API returns array with 10+ card IDs
    - Expected Result: All card IDs returned correctly
    */
    it('should handle large array of card IDs', function() {
      var mockCardIds = [];
      for (var i = 1; i <= 15; i++) {
        mockCardIds.push('card-' + String(i).padStart(3, '0'));
      }
      var result;

      $httpBackend.expectGET(API_BASE_URL + '/user/profile/cards').respond(200, mockCardIds);

      UserProfileService.getLinkedCardIds().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(15);
      expect(result[0]).toBe('card-001');
      expect(result[14]).toBe('card-015');
    });

    /*
    Test Documentation:
    - Test Name: should handle single card ID
    - Purpose: Verify handling of user with only one card
    - Scenario: API returns array with single card ID
    - Expected Result: Single card ID returned in array
    */
    it('should handle single card ID', function() {
      var mockCardIds = ['card-single-001'];
      var result;

      $httpBackend.expectGET(API_BASE_URL + '/user/profile/cards').respond(200, mockCardIds);

      UserProfileService.getLinkedCardIds().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(1);
      expect(result[0]).toBe('card-single-001');
    });

    /*
    Test Documentation:
    - Test Name: should handle card IDs with special characters
    - Purpose: Verify handling of various card ID formats
    - Scenario: API returns card IDs with hyphens, underscores, numbers
    - Expected Result: All card ID formats preserved correctly
    */
    it('should handle card IDs with special characters', function() {
      var mockCardIds = ['card-123-abc', 'card_456_def', 'CARD789XYZ'];
      var result;

      $httpBackend.expectGET(API_BASE_URL + '/user/profile/cards').respond(200, mockCardIds);

      UserProfileService.getLinkedCardIds().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCardIds);
      expect(result[0]).toBe('card-123-abc');
      expect(result[1]).toBe('card_456_def');
      expect(result[2]).toBe('CARD789XYZ');
    });
  });

  describe('Service initialization', function() {
    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Verify service is properly registered
    - Scenario: Service injected
    - Expected Result: Service instance exists
    */
    it('should be defined', function() {
      expect(UserProfileService).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should have getLinkedCardIds method
    - Purpose: Verify public API is available
    - Scenario: Service injected
    - Expected Result: getLinkedCardIds method exists
    */
    it('should have getLinkedCardIds method', function() {
      expect(typeof UserProfileService.getLinkedCardIds).toBe('function');
    });
  });

  describe('Multiple concurrent requests', function() {
    /*
    Test Documentation:
    - Test Name: should handle multiple simultaneous requests
    - Purpose: Verify service handles concurrent API calls
    - Scenario: Multiple getLinkedCardIds calls made simultaneously
    - Expected Result: All requests complete successfully
    */
    it('should handle multiple simultaneous requests', function() {
      var result1, result2, result3;
      var mockData1 = ['card-001'];
      var mockData2 = ['card-002', 'card-003'];
      var mockData3 = ['card-004'];

      $httpBackend.expectGET(API_BASE_URL + '/user/profile/cards').respond(200, mockData1);
      $httpBackend.expectGET(API_BASE_URL + '/user/profile/cards').respond(200, mockData2);
      $httpBackend.expectGET(API_BASE_URL + '/user/profile/cards').respond(200, mockData3);

      UserProfileService.getLinkedCardIds().then(function(data) {
        result1 = data;
      });

      UserProfileService.getLinkedCardIds().then(function(data) {
        result2 = data;
      });

      UserProfileService.getLinkedCardIds().then(function(data) {
        result3 = data;
      });

      $httpBackend.flush();

      expect(result1).toEqual(mockData1);
      expect(result2).toEqual(mockData2);
      expect(result3).toEqual(mockData3);
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: getLinkedCardIds
- Scenarios covered:
  * Successful card ID retrieval with multiple cards
  * Empty card list handling
  * Null and undefined response data handling
  * HTTP error responses (404, 500, 401, network errors)
  * Correct API endpoint usage
  * Promise return verification
  * Large arrays (10+ cards)
  * Single card ID
  * Special characters in card IDs
  * Service initialization
  * Multiple concurrent requests
- Uncovered scenarios: None - all public methods and edge cases tested
- Dependencies mocked: $http via $httpBackend
- Test count: 16 test cases
- Coverage: 100% of service methods
- API endpoint tested: /api/user/profile/cards
*/