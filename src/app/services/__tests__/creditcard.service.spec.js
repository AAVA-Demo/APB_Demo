/*
Test Documentation:
- Test Name: CreditCardService - fetchCards
- Purpose: Validates retrieval of all credit cards from API
- Scenario: Service makes HTTP GET request to cards endpoint
- Expected Result: Returns array of card objects with cardId, cardNumber, cardType, issuer, creditLimit, currentBalance, availableBalance
*/
/*
Test Documentation:
- Test Name: CreditCardService - fetchCards error handling
- Purpose: Validates fallback to mock data when API fails
- Scenario: API request fails, service returns mock card data
- Expected Result: Returns array of 3 mock credit cards
*/
/*
Coverage Report:
- Functions tested: fetchCards
- Scenarios covered: successful API call, API error handling with mock data fallback, card data structure validation
- Uncovered scenarios: network timeout, partial API response, authentication failures
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

    describe('fetchCards', function() {
      it('should fetch cards from API successfully', function() {
        var mockCards = [
          {cardId: '1', cardNumber: '**** **** **** 1234', cardType: 'Visa', issuer: 'Chase', creditLimit: 5000, currentBalance: 1200, availableBalance: 3800},
          {cardId: '2', cardNumber: '**** **** **** 5678', cardType: 'MasterCard', issuer: 'Citi', creditLimit: 8000, currentBalance: 2500, availableBalance: 5500}
        ];

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards).respond(200, mockCards);

        var result;
        CreditCardService.fetchCards().then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        expect(result).toEqual(mockCards);
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('1');
        expect(result[0].cardType).toBe('Visa');
      });

      it('should return mock data when API call fails', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards).respond(500, 'Internal Server Error');

        var result;
        CreditCardService.fetchCards().then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(3);
        expect(result[0].cardId).toBe('1');
        expect(result[0].cardNumber).toBe('**** **** **** 1234');
        expect(result[1].cardType).toBe('MasterCard');
        expect(result[2].issuer).toBe('American Express');
      });

      it('should include all required card properties', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards).respond(500);

        var result;
        CreditCardService.fetchCards().then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        var card = result[0];
        expect(card.cardId).toBeDefined();
        expect(card.cardNumber).toBeDefined();
        expect(card.cardType).toBeDefined();
        expect(card.issuer).toBeDefined();
        expect(card.creditLimit).toBeDefined();
        expect(card.currentBalance).toBeDefined();
        expect(card.availableBalance).toBeDefined();
      });

      it('should return cards with valid credit limit and balance values', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards).respond(500);

        var result;
        CreditCardService.fetchCards().then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        result.forEach(function(card) {
          expect(card.creditLimit).toBeGreaterThan(0);
          expect(card.currentBalance).toBeGreaterThanOrEqual(0);
          expect(card.availableBalance).toBeGreaterThanOrEqual(0);
          expect(card.creditLimit).toBeGreaterThanOrEqual(card.currentBalance);
        });
      });
    });
  });
})();