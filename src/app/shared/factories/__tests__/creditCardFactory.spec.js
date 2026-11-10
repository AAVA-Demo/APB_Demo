/*
Test Documentation:
- Test Name: creditCardFactory - getCards success
- Purpose: Verify that getCards successfully retrieves all credit cards
- Scenario: API returns array of credit card data
- Expected Result: Promise resolves with array of credit cards
*/
/*
Test Documentation:
- Test Name: creditCardFactory - getCards error handling
- Purpose: Verify that getCards handles API errors gracefully
- Scenario: API call fails with server error
- Expected Result: Promise is rejected and error is logged
*/
/*
Coverage Report:
- Functions tested: getCards
- Scenarios covered: successful retrieval, error handling, empty array, multiple cards
- Uncovered scenarios: none
*/

describe('creditCardFactory', function() {
  'use strict';

  var creditCardFactory;
  var $httpBackend;
  var API_CONFIG;
  var $q;
  var $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_creditCardFactory_, _$httpBackend_, _API_CONFIG_, _$q_, _$rootScope_) {
    creditCardFactory = _creditCardFactory_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCards', function() {
    it('should successfully retrieve all credit cards', function() {
      var mockCards = [
        {
          cardId: 'card1',
          cardNumber: '**** 1234',
          creditLimit: 5000,
          outstandingBalance: 1500,
          availableBalance: 3500
        },
        {
          cardId: 'card2',
          cardNumber: '**** 5678',
          creditLimit: 10000,
          outstandingBalance: 2000,
          availableBalance: 8000
        }
      ];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(200, mockCards);

      var result;
      creditCardFactory.getCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCards);
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card1');
    });

    it('should handle API errors and reject promise', function() {
      var errorResponse = { status: 500, statusText: 'Internal Server Error' };

      spyOn(console, 'error');

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(500, errorResponse);

      var rejected = false;
      creditCardFactory.getCards().catch(function(error) {
        rejected = true;
      });

      $httpBackend.flush();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalledWith('Error fetching cards:', jasmine.any(Object));
    });

    it('should handle empty card array', function() {
      var emptyCards = [];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(200, emptyCards);

      var result;
      creditCardFactory.getCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should construct correct API endpoint', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(200, []);

      creditCardFactory.getCards();
      $httpBackend.flush();
    });

    it('should handle network timeout errors', function() {
      spyOn(console, 'error');

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(0, '');

      var rejected = false;
      creditCardFactory.getCards().catch(function(error) {
        rejected = true;
      });

      $httpBackend.flush();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });
  });
});