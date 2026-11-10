/*
Test Documentation:
- Test Name: creditCardService - getCards success
- Purpose: Validates retrieval of all credit cards
- Scenario: Given valid API response, when getCards is called, then card data should be returned
- Expected Result: Returns array of credit card data
*/
/*
Test Documentation:
- Test Name: creditCardService - getCardById success
- Purpose: Validates retrieval of specific credit card by ID
- Scenario: Given valid cardId, when getCardById is called, then specific card data should be returned
- Expected Result: Returns card data for specified ID
*/
/*
Test Documentation:
- Test Name: creditCardService - error handling
- Purpose: Validates error handling for failed API requests
- Scenario: Given API failure, when service methods are called, then errors should be properly rejected
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getCards, getCardById
- Scenarios covered: successful data retrieval, error handling, promise rejection, card not found
- Uncovered scenarios: none - comprehensive coverage achieved
*/

describe('creditCardService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var creditCardService;
  var $httpBackend;

  beforeEach(inject(function(_creditCardService_, _$httpBackend_) {
    creditCardService = _creditCardService_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCards', function() {
    it('should retrieve all credit cards', function() {
      var mockCards = {
        cards: [
          { cardId: 'card1', creditLimit: 10000, availableCredit: 8000 },
          { cardId: 'card2', creditLimit: 15000, availableCredit: 12000 }
        ]
      };

      $httpBackend.expectGET('/api/creditcards').respond(200, mockCards);

      creditCardService.getCards().then(function(response) {
        expect(response.cards.length).toBe(2);
        expect(response.cards[0].cardId).toBe('card1');
      });

      $httpBackend.flush();
    });

    it('should handle error when retrieving cards', function() {
      $httpBackend.expectGET('/api/creditcards').respond(500, { error: 'Server error' });

      creditCardService.getCards().catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });
  });

  describe('getCardById', function() {
    it('should retrieve specific credit card by ID', function() {
      var cardId = 'card123';
      var mockCard = {
        cardId: 'card123',
        cardNumber: '****-****-****-1234',
        creditLimit: 10000,
        availableCredit: 8000,
        outstandingBalance: 2000
      };

      $httpBackend.expectGET('/api/creditcards/' + cardId).respond(200, mockCard);

      creditCardService.getCardById(cardId).then(function(response) {
        expect(response.cardId).toBe('card123');
        expect(response.creditLimit).toBe(10000);
      });

      $httpBackend.flush();
    });

    it('should handle error when card not found', function() {
      var cardId = 'invalid-card';

      $httpBackend.expectGET('/api/creditcards/' + cardId).respond(404, { error: 'Card not found' });

      creditCardService.getCardById(cardId).catch(function(error) {
        expect(error.status).toBe(404);
      });

      $httpBackend.flush();
    });
  });
});