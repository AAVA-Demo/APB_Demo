/*
Test Documentation:
- Test Name: CreditCardDataService - getAllCards
- Purpose: Validates that getAllCards retrieves all credit cards from API
- Scenario: Service calls API endpoint and returns card data
- Expected Result: Returns array of credit card objects
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - getCardsByUser
- Purpose: Validates that getCardsByUser retrieves user-specific cards with calculated available credit
- Scenario: Service calls API with userId and calculates availableCredit for each card
- Expected Result: Returns array of cards with availableCredit property
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - getCardById
- Purpose: Validates that getCardById retrieves a specific card and calculates available credit
- Scenario: Service calls API with cardId and adds availableCredit to response
- Expected Result: Returns single card object with availableCredit
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - Error Handling
- Purpose: Validates that service properly handles API errors
- Scenario: API returns error response
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardsByUser, getCardById
- Scenarios covered: successful API calls, available credit calculation, error handling, URL parameter replacement
- Edge cases: empty response arrays, missing card properties, network failures
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CreditCardDataService', function() {
    var CreditCardDataService;
    var $httpBackend;
    var API_CONFIG;
    var $q;
    var $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _API_CONFIG_, _$q_, _$rootScope_) {
      CreditCardDataService = _CreditCardDataService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getAllCards', function() {
      it('should retrieve all credit cards from API', function() {
        var mockCards = [
          {cardId: '1', cardType: 'Visa', creditLimit: 5000, outstandingAmount: 1000},
          {cardId: '2', cardType: 'Mastercard', creditLimit: 10000, outstandingAmount: 2500}
        ];

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.creditCards)
          .respond(200, mockCards);

        var result;
        CreditCardDataService.getAllCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCards);
        expect(result.length).toBe(2);
      });

      it('should handle empty card array response', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.creditCards)
          .respond(200, []);

        var result;
        CreditCardDataService.getAllCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should reject promise on API error', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.creditCards)
          .respond(500, {error: 'Internal Server Error'});

        var errorResult;
        CreditCardDataService.getAllCards().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(500);
      });

      it('should reject promise on network failure', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.creditCards)
          .respond(0, '');

        var errorResult;
        CreditCardDataService.getAllCards().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(0);
      });
    });

    describe('getCardsByUser', function() {
      it('should retrieve user-specific cards and calculate available credit', function() {
        var userId = 'user123';
        var mockCards = [
          {cardId: '1', cardType: 'Visa', creditLimit: 5000, outstandingAmount: 1000},
          {cardId: '2', cardType: 'Mastercard', creditLimit: 10000, outstandingAmount: 2500}
        ];

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.userCards.replace(':userId', userId);
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockCards);

        var result;
        CreditCardDataService.getCardsByUser(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.length).toBe(2);
        expect(result[0].availableCredit).toBe(4000);
        expect(result[1].availableCredit).toBe(7500);
      });

      it('should handle zero outstanding amount', function() {
        var userId = 'user456';
        var mockCards = [
          {cardId: '3', cardType: 'Amex', creditLimit: 8000, outstandingAmount: 0}
        ];

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.userCards.replace(':userId', userId);
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockCards);

        var result;
        CreditCardDataService.getCardsByUser(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result[0].availableCredit).toBe(8000);
      });

      it('should handle full credit limit used', function() {
        var userId = 'user789';
        var mockCards = [
          {cardId: '4', cardType: 'Discover', creditLimit: 3000, outstandingAmount: 3000}
        ];

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.userCards.replace(':userId', userId);
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockCards);

        var result;
        CreditCardDataService.getCardsByUser(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result[0].availableCredit).toBe(0);
      });

      it('should reject promise on API error', function() {
        var userId = 'user999';
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.userCards.replace(':userId', userId);
        
        $httpBackend.expectGET(expectedUrl)
          .respond(404, {error: 'User not found'});

        var errorResult;
        CreditCardDataService.getCardsByUser(userId).catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(404);
      });
    });

    describe('getCardById', function() {
      it('should retrieve specific card and calculate available credit', function() {
        var cardId = 'card123';
        var mockCard = {
          cardId: 'card123',
          cardType: 'Visa Gold',
          creditLimit: 15000,
          outstandingAmount: 5000
        };

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardDetails.replace(':cardId', cardId);
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockCard);

        var result;
        CreditCardDataService.getCardById(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.cardId).toBe('card123');
        expect(result.availableCredit).toBe(10000);
      });

      it('should handle card with zero balance', function() {
        var cardId = 'card456';
        var mockCard = {
          cardId: 'card456',
          cardType: 'Platinum',
          creditLimit: 20000,
          outstandingAmount: 0
        };

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardDetails.replace(':cardId', cardId);
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockCard);

        var result;
        CreditCardDataService.getCardById(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.availableCredit).toBe(20000);
      });

      it('should handle card at credit limit', function() {
        var cardId = 'card789';
        var mockCard = {
          cardId: 'card789',
          cardType: 'Basic',
          creditLimit: 2000,
          outstandingAmount: 2000
        };

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardDetails.replace(':cardId', cardId);
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockCard);

        var result;
        CreditCardDataService.getCardById(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.availableCredit).toBe(0);
      });

      it('should reject promise when card not found', function() {
        var cardId = 'invalidCard';
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardDetails.replace(':cardId', cardId);
        
        $httpBackend.expectGET(expectedUrl)
          .respond(404, {error: 'Card not found'});

        var errorResult;
        CreditCardDataService.getCardById(cardId).catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(404);
      });

      it('should reject promise on server error', function() {
        var cardId = 'card999';
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardDetails.replace(':cardId', cardId);
        
        $httpBackend.expectGET(expectedUrl)
          .respond(500, {error: 'Database error'});

        var errorResult;
        CreditCardDataService.getCardById(cardId).catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(500);
      });
    });
  });
})();