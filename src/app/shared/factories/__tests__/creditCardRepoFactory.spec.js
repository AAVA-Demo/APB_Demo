/*
Test Documentation:
- Test Name: creditCardRepoFactory - getCardDetails success
- Purpose: Verify that getCardDetails successfully retrieves detailed card information
- Scenario: Valid card ID is provided and API returns card details
- Expected Result: Promise resolves with detailed card data
*/
/*
Test Documentation:
- Test Name: creditCardRepoFactory - getCardDetails error handling
- Purpose: Verify that getCardDetails handles API errors gracefully
- Scenario: Invalid card ID or API error occurs
- Expected Result: Promise is rejected and error is logged
*/
/*
Coverage Report:
- Functions tested: getCardDetails
- Scenarios covered: successful retrieval, error handling, endpoint construction, 404 errors
- Uncovered scenarios: none
*/

describe('creditCardRepoFactory', function() {
  'use strict';

  var creditCardRepoFactory;
  var $httpBackend;
  var API_CONFIG;
  var $q;
  var $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_creditCardRepoFactory_, _$httpBackend_, _API_CONFIG_, _$q_, _$rootScope_) {
    creditCardRepoFactory = _creditCardRepoFactory_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCardDetails', function() {
    it('should successfully retrieve card details for valid card ID', function() {
      var cardId = 'card123';
      var mockCardDetails = {
        cardId: 'card123',
        cardNumber: '**** 1234',
        cardType: 'Visa',
        creditLimit: 5000,
        outstandingBalance: 1500,
        availableBalance: 3500,
        status: 'Active',
        expiryDate: '12/25'
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/' + cardId)
        .respond(200, mockCardDetails);

      var result;
      creditCardRepoFactory.getCardDetails(cardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCardDetails);
      expect(result.cardId).toBe('card123');
      expect(result.creditLimit).toBe(5000);
    });

    it('should handle 404 error for non-existent card', function() {
      var cardId = 'nonExistentCard';
      var errorResponse = { status: 404, statusText: 'Not Found' };

      spyOn(console, 'error');

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/' + cardId)
        .respond(404, errorResponse);

      var rejected = false;
      creditCardRepoFactory.getCardDetails(cardId).catch(function(error) {
        rejected = true;
      });

      $httpBackend.flush();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalledWith('Error fetching card details:', jasmine.any(Object));
    });

    it('should construct correct API endpoint with card ID', function() {
      var cardId = 'card456';
      var mockData = { cardId: 'card456' };

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/card456')
        .respond(200, mockData);

      creditCardRepoFactory.getCardDetails(cardId);
      $httpBackend.flush();
    });

    it('should handle server errors gracefully', function() {
      var cardId = 'card789';
      var errorResponse = { status: 500, statusText: 'Internal Server Error' };

      spyOn(console, 'error');

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/' + cardId)
        .respond(500, errorResponse);

      var rejected = false;
      creditCardRepoFactory.getCardDetails(cardId).catch(function(error) {
        rejected = true;
      });

      $httpBackend.flush();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle unauthorized access errors', function() {
      var cardId = 'card999';
      var errorResponse = { status: 401, statusText: 'Unauthorized' };

      spyOn(console, 'error');

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/' + cardId)
        .respond(401, errorResponse);

      var rejected = false;
      creditCardRepoFactory.getCardDetails(cardId).catch(function(error) {
        rejected = true;
      });

      $httpBackend.flush();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });
  });
});