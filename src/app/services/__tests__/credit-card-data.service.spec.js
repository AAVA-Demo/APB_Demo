/*
Test Documentation:
- Test Name: CreditCardDataService - getAllCards - success scenario
- Purpose: Validates that getAllCards retrieves card summary successfully
- Scenario: Service calls API with valid userId
- Expected Result: Returns array of card summary data
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - getAllCards - error scenario
- Purpose: Validates error handling when API call fails
- Scenario: API returns error response
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - getCardDetails - success scenario
- Purpose: Validates that getCardDetails retrieves specific card details
- Scenario: Service calls API with valid cardId
- Expected Result: Returns card details object
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - getCardDetails - error scenario
- Purpose: Validates error handling when card details API fails
- Scenario: API returns 404 or error
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - getCardDetails - null cardId
- Purpose: Validates handling of null/undefined cardId
- Scenario: Service called with null cardId
- Expected Result: API call is made with null in URL
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardDetails
- Scenarios covered: success responses, error handling, null parameters, HTTP error codes
- Uncovered scenarios: network timeout (requires additional mocking)
*/

describe('CreditCardDataService', function() {
  'use strict';

  var CreditCardDataService;
  var $httpBackend;
  var $q;
  var $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _$q_, _$rootScope_) {
    CreditCardDataService = _CreditCardDataService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getAllCards', function() {
    it('should retrieve all cards for a given userId successfully', function() {
      var userId = 'user123';
      var mockResponse = [
        { cardId: 'card1', cardName: 'Visa Gold', creditLimit: 5000 },
        { cardId: 'card2', cardName: 'MasterCard Platinum', creditLimit: 10000 }
      ];

      $httpBackend.expectGET('/api/cards/summary?userId=' + userId)
        .respond(200, mockResponse);

      var result;
      CreditCardDataService.getAllCards(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card1');
    });

    it('should return empty array when user has no cards', function() {
      var userId = 'user456';
      var mockResponse = [];

      $httpBackend.expectGET('/api/cards/summary?userId=' + userId)
        .respond(200, mockResponse);

      var result;
      CreditCardDataService.getAllCards(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle API error and reject promise', function() {
      var userId = 'user789';
      var errorResponse = { message: 'Internal Server Error' };

      $httpBackend.expectGET('/api/cards/summary?userId=' + userId)
        .respond(500, errorResponse);

      var error;
      CreditCardDataService.getAllCards(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle 404 error when user not found', function() {
      var userId = 'nonexistent';

      $httpBackend.expectGET('/api/cards/summary?userId=' + userId)
        .respond(404, { message: 'User not found' });

      var error;
      CreditCardDataService.getAllCards(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    it('should handle null userId parameter', function() {
      var userId = null;
      var mockResponse = [];

      $httpBackend.expectGET('/api/cards/summary?userId=null')
        .respond(200, mockResponse);

      var result;
      CreditCardDataService.getAllCards(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
    });

    it('should handle undefined userId parameter', function() {
      var userId = undefined;
      var mockResponse = [];

      $httpBackend.expectGET('/api/cards/summary')
        .respond(200, mockResponse);

      var result;
      CreditCardDataService.getAllCards(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
    });
  });

  describe('getCardDetails', function() {
    it('should retrieve card details for a given cardId successfully', function() {
      var cardId = 'card123';
      var mockResponse = {
        cardId: 'card123',
        cardName: 'Visa Signature',
        cardNumber: '**** **** **** 1234',
        creditLimit: 15000,
        availableCredit: 12000,
        outstandingAmount: 3000
      };

      $httpBackend.expectGET('/api/cards/' + cardId + '/details')
        .respond(200, mockResponse);

      var result;
      CreditCardDataService.getCardDetails(cardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.cardId).toBe('card123');
      expect(result.creditLimit).toBe(15000);
    });

    it('should handle API error and reject promise', function() {
      var cardId = 'card456';
      var errorResponse = { message: 'Card not found' };

      $httpBackend.expectGET('/api/cards/' + cardId + '/details')
        .respond(404, errorResponse);

      var error;
      CreditCardDataService.getCardDetails(cardId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    it('should handle 500 server error', function() {
      var cardId = 'card789';

      $httpBackend.expectGET('/api/cards/' + cardId + '/details')
        .respond(500, { message: 'Internal Server Error' });

      var error;
      CreditCardDataService.getCardDetails(cardId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle null cardId parameter', function() {
      var cardId = null;
      var mockResponse = { error: 'Invalid card ID' };

      $httpBackend.expectGET('/api/cards/null/details')
        .respond(400, mockResponse);

      var error;
      CreditCardDataService.getCardDetails(cardId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(400);
    });

    it('should handle undefined cardId parameter', function() {
      var cardId = undefined;
      var mockResponse = { error: 'Invalid card ID' };

      $httpBackend.expectGET('/api/cards/undefined/details')
        .respond(400, mockResponse);

      var error;
      CreditCardDataService.getCardDetails(cardId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(400);
    });

    it('should handle empty string cardId', function() {
      var cardId = '';
      var mockResponse = { error: 'Invalid card ID' };

      $httpBackend.expectGET('/api/cards//details')
        .respond(400, mockResponse);

      var error;
      CreditCardDataService.getCardDetails(cardId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(400);
    });

    it('should handle unauthorized access (401)', function() {
      var cardId = 'card999';

      $httpBackend.expectGET('/api/cards/' + cardId + '/details')
        .respond(401, { message: 'Unauthorized' });

      var error;
      CreditCardDataService.getCardDetails(cardId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });
  });

  describe('Service initialization', function() {
    it('should be defined', function() {
      expect(CreditCardDataService).toBeDefined();
    });

    it('should have getAllCards method', function() {
      expect(CreditCardDataService.getAllCards).toBeDefined();
      expect(typeof CreditCardDataService.getAllCards).toBe('function');
    });

    it('should have getCardDetails method', function() {
      expect(CreditCardDataService.getCardDetails).toBeDefined();
      expect(typeof CreditCardDataService.getCardDetails).toBe('function');
    });
  });
});