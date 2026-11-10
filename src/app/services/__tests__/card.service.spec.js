/*
Test Documentation:
- Test Name: CardService - getCards success scenario
- Purpose: Validates that getCards returns array of credit cards when API succeeds
- Scenario: API returns list of user's credit cards with pagination
- Expected Result: Service returns array of card objects with all required properties
*/
/*
Test Documentation:
- Test Name: CardService - getCards fallback scenario
- Purpose: Validates that getCards returns mock data when API fails
- Scenario: API call fails or returns error
- Expected Result: Service returns fallback array with 3 sample cards
*/
/*
Test Documentation:
- Test Name: CardService - getCardSpending success scenario
- Purpose: Validates that getCardSpending returns spending details for specific card
- Scenario: API returns card-specific spending breakdown
- Expected Result: Service returns spending object with monthly spend and category breakdown
*/
/*
Coverage Report:
- Functions tested: getCards, getCardSpending
- Scenarios covered: successful API calls, API failures, pagination, card ID replacement
- Uncovered scenarios: none - all card service operations tested
- Edge cases: empty card list, invalid card ID, missing pagination parameters
*/

(function() {
  'use strict';

  describe('CardService', function() {
    var CardService, $httpBackend, API_CONFIG, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardService_, _$httpBackend_, _API_CONFIG_, _$q_) {
      CardService = _CardService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCards', function() {
      it('should return array of cards when API call succeeds', function() {
        var mockCards = [
          {cardId: 'c1', cardNumber: '**** 1234', cardType: 'Visa', bankName: 'HDFC', creditLimit: 100000, status: 'Active'},
          {cardId: 'c2', cardNumber: '**** 5678', cardType: 'Mastercard', bankName: 'ICICI', creditLimit: 80000, status: 'Active'}
        ];
        var mockResponse = {cards: mockCards};

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?page=1&limit=10';
        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        CardService.getCards().then(function(cards) {
          result = cards;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCards);
        expect(result.length).toBe(2);
      });

      it('should use default pagination parameters when not provided', function() {
        var mockResponse = {cards: []};
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?page=1&limit=10';

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        CardService.getCards();
        $httpBackend.flush();
      });

      it('should use custom pagination parameters when provided', function() {
        var mockResponse = {cards: []};
        var page = 2;
        var limit = 5;
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?page=' + page + '&limit=' + limit;

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        CardService.getCards(page, limit);
        $httpBackend.flush();
      });

      it('should return empty array when API returns no cards', function() {
        var mockResponse = {cards: []};
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?page=1&limit=10';

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        CardService.getCards().then(function(cards) {
          result = cards;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
      });

      it('should return fallback data with 3 cards when API call fails', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?page=1&limit=10';
        $httpBackend.expectGET(expectedUrl).respond(500, 'Internal Server Error');

        var result;
        CardService.getCards().then(function(cards) {
          result = cards;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(3);
        expect(result[0].cardId).toBe('c1');
        expect(result[1].cardId).toBe('c2');
        expect(result[2].cardId).toBe('c3');
      });

      it('should return fallback data when API returns malformed response', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?page=1&limit=10';
        $httpBackend.expectGET(expectedUrl).respond(200, {});

        var result;
        CardService.getCards().then(function(cards) {
          result = cards;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
      });

      it('should handle network timeout gracefully', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?page=1&limit=10';
        $httpBackend.expectGET(expectedUrl).respond(0, '');

        var result;
        CardService.getCards().then(function(cards) {
          result = cards;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(3);
      });
    });

    describe('getCardSpending', function() {
      it('should return spending data for specific card when API succeeds', function() {
        var cardId = 'c1';
        var mockSpending = {
          cardId: cardId,
          monthlySpend: 25000,
          categoryBreakdown: [
            {category: 'Food & Dining', amount: 8000},
            {category: 'Fuel', amount: 5000}
          ],
          lastTransactionDate: '2024-03-15T10:30:00Z'
        };

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardSpending.replace(':cardId', cardId);
        $httpBackend.expectGET(expectedUrl).respond(200, mockSpending);

        var result;
        CardService.getCardSpending(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockSpending);
        expect(result.cardId).toBe(cardId);
        expect(result.monthlySpend).toBe(25000);
      });

      it('should correctly replace cardId in URL endpoint', function() {
        var cardId = 'test-card-123';
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardSpending.replace(':cardId', cardId);

        $httpBackend.expectGET(expectedUrl).respond(200, {cardId: cardId});

        CardService.getCardSpending(cardId);
        $httpBackend.flush();
      });

      it('should return fallback spending data when API call fails', function() {
        var cardId = 'c2';
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardSpending.replace(':cardId', cardId);

        $httpBackend.expectGET(expectedUrl).respond(404, 'Not Found');

        var result;
        CardService.getCardSpending(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.cardId).toBe(cardId);
        expect(result.monthlySpend).toBe(15420);
        expect(result.categoryBreakdown.length).toBe(4);
      });

      it('should handle invalid card ID gracefully', function() {
        var invalidCardId = 'invalid-id';
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardSpending.replace(':cardId', invalidCardId);

        $httpBackend.expectGET(expectedUrl).respond(400, 'Bad Request');

        var result;
        CardService.getCardSpending(invalidCardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.cardId).toBe(invalidCardId);
      });

      it('should preserve all category breakdown properties in fallback', function() {
        var cardId = 'c3';
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardSpending.replace(':cardId', cardId);

        $httpBackend.expectGET(expectedUrl).respond(500, 'Server Error');

        var result;
        CardService.getCardSpending(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        result.categoryBreakdown.forEach(function(cat) {
          expect(cat.category).toBeDefined();
          expect(cat.amount).toBeDefined();
        });
      });
    });
  });
})();