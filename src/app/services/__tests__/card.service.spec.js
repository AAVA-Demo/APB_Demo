/*
Test Documentation:
- Test Name: CardService - fetchUserCards
- Purpose: Validates retrieval of all user credit cards from API
- Scenario: Service makes HTTP GET request to cards endpoint and returns card data
- Expected Result: Returns array of card objects with cardId, cardNumber, cardType, issuer, creditLimit, currentBalance, availableBalance, dueDate, minPayment
*/
/*
Test Documentation:
- Test Name: CardService - fetchUserCards error handling
- Purpose: Validates fallback to mock data when API fails
- Scenario: API request fails, service returns mock card data
- Expected Result: Returns array of 3 mock credit cards
*/
/*
Test Documentation:
- Test Name: CardService - getCardDetails
- Purpose: Validates retrieval of specific card details by cardId
- Scenario: Service makes HTTP GET request with cardId parameter
- Expected Result: Returns single card object with complete details
*/
/*
Test Documentation:
- Test Name: CardService - getCardDetails error handling
- Purpose: Validates fallback to mock data when API fails for specific card
- Scenario: API request fails, service returns mock card matching cardId
- Expected Result: Returns mock card object matching requested cardId
*/
/*
Coverage Report:
- Functions tested: fetchUserCards, getCardDetails
- Scenarios covered: successful API calls, API error handling with mock data fallback, card retrieval by ID, default card fallback when ID not found
- Uncovered scenarios: network timeout, malformed API response, authentication failures
*/

(function() {
  'use strict';

  describe('CardService', function() {
    var CardService, $httpBackend, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardService_, _$httpBackend_, _API_CONFIG_) {
      CardService = _CardService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('fetchUserCards', function() {
      it('should fetch user cards from API successfully', function() {
        var mockCards = [
          {cardId: '1', cardNumber: '**** **** **** 1234', cardType: 'Visa', issuer: 'Chase', creditLimit: 5000, currentBalance: 1200, availableBalance: 3800, dueDate: '2024-02-15', minPayment: 50},
          {cardId: '2', cardNumber: '**** **** **** 5678', cardType: 'MasterCard', issuer: 'Citi', creditLimit: 8000, currentBalance: 2500, availableBalance: 5500, dueDate: '2024-02-20', minPayment: 75}
        ];

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards).respond(200, mockCards);

        var result;
        CardService.fetchUserCards().then(function(data) {
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
        CardService.fetchUserCards().then(function(data) {
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
        CardService.fetchUserCards().then(function(data) {
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
        expect(card.dueDate).toBeDefined();
        expect(card.minPayment).toBeDefined();
      });
    });

    describe('getCardDetails', function() {
      it('should fetch specific card details from API successfully', function() {
        var cardId = '2';
        var mockCard = {cardId: '2', cardNumber: '**** **** **** 5678', cardType: 'MasterCard', issuer: 'Citi', creditLimit: 8000, currentBalance: 2500, availableBalance: 5500, dueDate: '2024-02-20', minPayment: 75};

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + cardId).respond(200, mockCard);

        var result;
        CardService.getCardDetails(cardId).then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        expect(result).toEqual(mockCard);
        expect(result.cardId).toBe('2');
        expect(result.cardType).toBe('MasterCard');
      });

      it('should return mock card matching cardId when API call fails', function() {
        var cardId = '3';
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + cardId).respond(404, 'Not Found');

        var result;
        CardService.getCardDetails(cardId).then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.cardId).toBe('3');
        expect(result.cardType).toBe('Amex');
        expect(result.issuer).toBe('American Express');
      });

      it('should return first mock card when requested cardId not found', function() {
        var cardId = '999';
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + cardId).respond(404);

        var result;
        CardService.getCardDetails(cardId).then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.cardId).toBe('1');
      });
    });
  });
})();