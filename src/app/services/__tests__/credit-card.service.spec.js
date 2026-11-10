/*
Test Documentation:
- Test Name: CreditCardService - getAllCards success
- Purpose: Validates retrieval of all credit cards for a user
- Scenario: Valid userId provided
- Expected Result: Returns array of credit card objects
*/
/*
Test Documentation:
- Test Name: CreditCardService - getAllCards error handling
- Purpose: Validates error handling when API fails
- Scenario: Server returns 500 error
- Expected Result: Promise rejected and error logged
*/
/*
Test Documentation:
- Test Name: CreditCardService - getCardById success
- Purpose: Validates retrieval of single card details
- Scenario: Valid cardId provided
- Expected Result: Returns specific card object
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardById
- Scenarios covered: success retrieval, error handling, timeout configuration
- Uncovered scenarios: network timeout, partial response
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService, $httpBackend, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _API_CONFIG_) {
      CreditCardService = _CreditCardService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getAllCards', function() {
      it('should retrieve all credit cards for a user', function() {
        var userId = 'user123';
        var mockCards = [
          { cardId: 'c1', cardNumber: '1234', balance: 1000 },
          { cardId: 'c2', cardNumber: '5678', balance: 2000 }
        ];

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards?userId=' + userId).respond(200, mockCards);

        var result;
        CreditCardService.getAllCards(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCards);
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('c1');
      });

      it('should handle error when fetching all cards', function() {
        var userId = 'user123';
        spyOn(console, 'error');

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards?userId=' + userId).respond(500, 'Server Error');

        var error;
        CreditCardService.getAllCards(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching credit cards:', jasmine.any(Object));
      });

      it('should include timeout configuration', function() {
        var userId = 'user123';
        var mockCards = [];

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards?userId=' + userId).respond(200, mockCards);

        CreditCardService.getAllCards(userId);

        $httpBackend.flush();

        expect(API_CONFIG.timeout).toBeDefined();
      });
    });

    describe('getCardById', function() {
      it('should retrieve a specific card by ID', function() {
        var cardId = 'c1';
        var mockCard = { cardId: 'c1', cardNumber: '1234', balance: 1000, creditLimit: 5000 };

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards/' + cardId).respond(200, mockCard);

        var result;
        CreditCardService.getCardById(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCard);
        expect(result.cardId).toBe(cardId);
      });

      it('should handle error when fetching card by ID', function() {
        var cardId = 'c1';
        spyOn(console, 'error');

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards/' + cardId).respond(404, 'Not Found');

        var error;
        CreditCardService.getCardById(cardId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching card details:', jasmine.any(Object));
      });

      it('should handle empty cardId', function() {
        var cardId = '';
        spyOn(console, 'error');

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards/').respond(400, 'Bad Request');

        var error;
        CreditCardService.getCardById(cardId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
      });
    });
  });
})();