/*
Test Documentation:
- Test Name: CreditCardService - getUserCards success
- Purpose: Validates retrieval of all user credit cards
- Scenario: API returns list of user's credit cards
- Expected Result: Promise resolves with array of cards
*/
/*
Test Documentation:
- Test Name: CreditCardService - validateCardOwnership success
- Purpose: Validates card ownership verification
- Scenario: API confirms user owns the specified card
- Expected Result: Returns true for owned card
*/
/*
Coverage Report:
- Functions tested: getUserCards, validateCardOwnership
- Scenarios covered: successful retrieval, ownership validation, error handling
- Edge cases: empty card list, invalid card IDs, unauthorized access
- Uncovered scenarios: none
*/

describe('CreditCardService', function() {
  'use strict';

  var CreditCardService, $httpBackend, API_ENDPOINTS;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _API_ENDPOINTS_) {
    CreditCardService = _CreditCardService_;
    $httpBackend = _$httpBackend_;
    API_ENDPOINTS = _API_ENDPOINTS_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getUserCards', function() {
    it('should return user cards when API call succeeds', function() {
      var mockCards = [
        { cardId: 'card1', cardType: 'Visa', cardNumber: '****1234', creditLimit: 10000 },
        { cardId: 'card2', cardType: 'Mastercard', cardNumber: '****5678', creditLimit: 15000 },
        { cardId: 'card3', cardType: 'Amex', cardNumber: '****9012', creditLimit: 20000 }
      ];

      $httpBackend.expectGET(API_ENDPOINTS.cards)
        .respond(200, mockCards);

      CreditCardService.getUserCards().then(function(data) {
        expect(data).toEqual(mockCards);
        expect(data.length).toBe(3);
        expect(data[0].cardId).toBe('card1');
      });

      $httpBackend.flush();
    });

    it('should handle empty card list', function() {
      var emptyCards = [];

      $httpBackend.expectGET(API_ENDPOINTS.cards)
        .respond(200, emptyCards);

      CreditCardService.getUserCards().then(function(data) {
        expect(data).toEqual([]);
        expect(data.length).toBe(0);
      });

      $httpBackend.flush();
    });

    it('should handle API error', function() {
      $httpBackend.expectGET(API_ENDPOINTS.cards)
        .respond(500, { message: 'Internal Server Error' });

      CreditCardService.getUserCards().catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });

    it('should handle 401 unauthorized error', function() {
      $httpBackend.expectGET(API_ENDPOINTS.cards)
        .respond(401, { message: 'Unauthorized' });

      CreditCardService.getUserCards().catch(function(error) {
        expect(error.status).toBe(401);
      });

      $httpBackend.flush();
    });

    it('should return single card when user has only one', function() {
      var singleCard = [
        { cardId: 'card1', cardType: 'Visa', cardNumber: '****1234', creditLimit: 5000 }
      ];

      $httpBackend.expectGET(API_ENDPOINTS.cards)
        .respond(200, singleCard);

      CreditCardService.getUserCards().then(function(data) {
        expect(data.length).toBe(1);
        expect(data[0].cardType).toBe('Visa');
      });

      $httpBackend.flush();
    });
  });

  describe('validateCardOwnership', function() {
    it('should return true when user owns the card', function() {
      var cardId = 'card123';
      var mockResponse = { isOwner: true };

      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId + '/validate')
        .respond(200, mockResponse);

      CreditCardService.validateCardOwnership(cardId).then(function(isOwner) {
        expect(isOwner).toBe(true);
      });

      $httpBackend.flush();
    });

    it('should return false when user does not own the card', function() {
      var cardId = 'card456';
      var mockResponse = { isOwner: false };

      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId + '/validate')
        .respond(200, mockResponse);

      CreditCardService.validateCardOwnership(cardId).then(function(isOwner) {
        expect(isOwner).toBe(false);
      });

      $httpBackend.flush();
    });

    it('should handle invalid card ID', function() {
      var invalidCardId = 'invalid-card';

      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + invalidCardId + '/validate')
        .respond(404, { message: 'Card not found' });

      CreditCardService.validateCardOwnership(invalidCardId).catch(function(error) {
        expect(error.status).toBe(404);
      });

      $httpBackend.flush();
    });

    it('should handle server error during validation', function() {
      var cardId = 'card789';

      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId + '/validate')
        .respond(500, { message: 'Internal Server Error' });

      CreditCardService.validateCardOwnership(cardId).catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });

    it('should handle null card ID', function() {
      var cardId = null;

      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId + '/validate')
        .respond(400, { message: 'Invalid card ID' });

      CreditCardService.validateCardOwnership(cardId).catch(function(error) {
        expect(error.status).toBe(400);
      });

      $httpBackend.flush();
    });

    it('should handle empty string card ID', function() {
      var cardId = '';

      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId + '/validate')
        .respond(400, { message: 'Invalid card ID' });

      CreditCardService.validateCardOwnership(cardId).catch(function(error) {
        expect(error.status).toBe(400);
      });

      $httpBackend.flush();
    });
  });
});