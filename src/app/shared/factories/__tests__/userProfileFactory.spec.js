/*
Test Documentation:
- Test Name: userProfileFactory - getUserCardAssociations success
- Purpose: Verify that getUserCardAssociations successfully retrieves user's card associations
- Scenario: API returns user's associated card IDs
- Expected Result: Promise resolves with card associations data
*/
/*
Test Documentation:
- Test Name: userProfileFactory - getUserCardAssociations error handling
- Purpose: Verify that getUserCardAssociations handles API errors gracefully
- Scenario: API call fails with error
- Expected Result: Promise is rejected and error is logged
*/
/*
Coverage Report:
- Functions tested: getUserCardAssociations
- Scenarios covered: successful retrieval, error handling, empty associations, multiple cards
- Uncovered scenarios: none
*/

describe('userProfileFactory', function() {
  'use strict';

  var userProfileFactory;
  var $httpBackend;
  var API_CONFIG;
  var $q;
  var $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_userProfileFactory_, _$httpBackend_, _API_CONFIG_, _$q_, _$rootScope_) {
    userProfileFactory = _userProfileFactory_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getUserCardAssociations', function() {
    it('should successfully retrieve user card associations', function() {
      var mockAssociations = {
        userId: 'user123',
        cardIds: ['card1', 'card2', 'card3'],
        primaryCardId: 'card1'
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/user/cards')
        .respond(200, mockAssociations);

      var result;
      userProfileFactory.getUserCardAssociations().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockAssociations);
      expect(result.cardIds.length).toBe(3);
      expect(result.primaryCardId).toBe('card1');
    });

    it('should handle empty card associations', function() {
      var emptyAssociations = {
        userId: 'user456',
        cardIds: [],
        primaryCardId: null
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/user/cards')
        .respond(200, emptyAssociations);

      var result;
      userProfileFactory.getUserCardAssociations().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.cardIds).toEqual([]);
      expect(result.cardIds.length).toBe(0);
    });

    it('should handle API errors and reject promise', function() {
      var errorResponse = { status: 500, statusText: 'Internal Server Error' };

      spyOn(console, 'error');

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/user/cards')
        .respond(500, errorResponse);

      var rejected = false;
      userProfileFactory.getUserCardAssociations().catch(function(error) {
        rejected = true;
      });

      $httpBackend.flush();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalledWith('Error fetching user card associations:', jasmine.any(Object));
    });

    it('should construct correct API endpoint', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/user/cards')
        .respond(200, { cardIds: [] });

      userProfileFactory.getUserCardAssociations();
      $httpBackend.flush();
    });

    it('should handle unauthorized access errors', function() {
      var errorResponse = { status: 401, statusText: 'Unauthorized' };

      spyOn(console, 'error');

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/user/cards')
        .respond(401, errorResponse);

      var rejected = false;
      userProfileFactory.getUserCardAssociations().catch(function(error) {
        rejected = true;
      });

      $httpBackend.flush();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle multiple card associations', function() {
      var multipleCards = {
        userId: 'user789',
        cardIds: ['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8', 'card9', 'card10'],
        primaryCardId: 'card1'
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/user/cards')
        .respond(200, multipleCards);

      var result;
      userProfileFactory.getUserCardAssociations().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.cardIds.length).toBe(10);
    });
  });
});