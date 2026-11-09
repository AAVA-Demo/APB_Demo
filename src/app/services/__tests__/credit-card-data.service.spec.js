/*
Test Documentation:
- Test Name: CreditCardDataService Test Suite
- Purpose: Validate the CreditCardDataService retrieves credit card data from API correctly
- Scenario: Tests getAllCards and getCardById methods with success and error scenarios
- Expected Result: Service correctly calls API endpoints and handles responses and errors
*/

(function() {
  'use strict';

  describe('CreditCardDataService', function() {
    var CreditCardDataService, $httpBackend, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _API_CONFIG_) {
      CreditCardDataService = _CreditCardDataService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getAllCards', function() {
      it('should retrieve all credit cards successfully', function() {
        var mockCards = [
          {
            cardId: 'card123',
            cardName: 'Visa Gold',
            creditLimit: 5000,
            availableCredit: 3000,
            outstandingBalance: 2000,
            status: 'active'
          },
          {
            cardId: 'card456',
            cardName: 'MasterCard Platinum',
            creditLimit: 10000,
            availableCredit: 7500,
            outstandingBalance: 2500,
            status: 'active'
          }
        ];

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
          .respond(200, mockCards);

        var result;
        CreditCardDataService.getAllCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCards);
        expect(result.length).toBe(2);
      });

      it('should return empty array when no cards exist', function() {
        var mockCards = [];

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
          .respond(200, mockCards);

        var result;
        CreditCardDataService.getAllCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should handle API error response', function() {
        var errorResponse = { message: 'Unauthorized' };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
          .respond(401, errorResponse);

        var error;
        CreditCardDataService.getAllCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(401);
      });

      it('should handle server error', function() {
        var errorResponse = { message: 'Internal Server Error' };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
          .respond(500, errorResponse);

        var error;
        CreditCardDataService.getAllCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle network error', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
          .respond(-1, '');

        var error;
        CreditCardDataService.getAllCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(-1);
      });

      it('should return a promise', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
          .respond(200, []);

        var promise = CreditCardDataService.getAllCards();

        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');

        $httpBackend.flush();
      });
    });

    describe('getCardById', function() {
      it('should retrieve specific card by ID successfully', function() {
        var cardId = 'card123';
        var mockCard = {
          cardId: 'card123',
          cardName: 'Visa Gold',
          creditLimit: 5000,
          availableCredit: 3000,
          outstandingBalance: 2000,
          status: 'active',
          lastFourDigits: '1234'
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + cardId)
          .respond(200, mockCard);

        var result;
        CreditCardDataService.getCardById(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCard);
        expect(result.cardId).toBe(cardId);
      });

      it('should handle card not found error', function() {
        var cardId = 'invalidCard';
        var errorResponse = { message: 'Card not found' };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + cardId)
          .respond(404, errorResponse);

        var error;
        CreditCardDataService.getCardById(cardId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(404);
      });

      it('should handle unauthorized access', function() {
        var cardId = 'card456';
        var errorResponse = { message: 'Unauthorized' };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + cardId)
          .respond(401, errorResponse);

        var error;
        CreditCardDataService.getCardById(cardId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(401);
      });

      it('should handle server error', function() {
        var cardId = 'card789';
        var errorResponse = { message: 'Internal Server Error' };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + cardId)
          .respond(500, errorResponse);

        var error;
        CreditCardDataService.getCardById(cardId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle network error', function() {
        var cardId = 'card999';

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + cardId)
          .respond(-1, '');

        var error;
        CreditCardDataService.getCardById(cardId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(-1);
      });

      it('should return a promise', function() {
        var cardId = 'card123';

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + cardId)
          .respond(200, {});

        var promise = CreditCardDataService.getCardById(cardId);

        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');

        $httpBackend.flush();
      });

      it('should handle empty cardId parameter', function() {
        var cardId = '';

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + cardId)
          .respond(400, { message: 'Bad Request' });

        var error;
        CreditCardDataService.getCardById(cardId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(400);
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getAllCards, getCardById
  - Scenarios covered:
    * Successful retrieval of all cards
    * Empty cards array
    * Successful retrieval of card by ID
    * Card not found (404)
    * Unauthorized access (401)
    * Server error (500)
    * Network error
    * Promise return validation
    * Empty cardId parameter
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();