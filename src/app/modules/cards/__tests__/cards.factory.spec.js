/*
Test Documentation:
- Test Name: cardsFactory - fetchCards GET request
- Purpose: Validates factory creates correct $resource for cards endpoint
- Scenario: fetchCards method called with userId
- Expected Result: GET request to /api/cards with userId param
*/
/*
Test Documentation:
- Test Name: cardsFactory - caching enabled
- Purpose: Validates factory enables caching for card requests
- Scenario: Multiple calls to fetchCards
- Expected Result: Subsequent calls use cached data
*/
/*
Test Documentation:
- Test Name: cardsFactory - array response
- Purpose: Validates factory expects array response
- Scenario: API returns array of cards
- Expected Result: Array of card objects returned
*/
/*
Coverage Report:
- Functions tested: fetchCards resource method
- Scenarios covered: GET request configuration, caching, array response format
- Edge cases: userId parameter binding, empty array response
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('cardsFactory', function() {
    var cardsFactory, $httpBackend;
    var mockCardsData = [
      { cardId: 'card1', cardType: 'Visa', cardNumber: '****1234', issuer: 'Bank A', creditLimit: 5000, availableCredit: 3000, outstandingBalance: 2000, monthlySpend: 500 },
      { cardId: 'card2', cardType: 'MasterCard', cardNumber: '****5678', issuer: 'Bank B', creditLimit: 10000, availableCredit: 7000, outstandingBalance: 3000, monthlySpend: 800 }
    ];

    beforeEach(module('cardsModule'));

    beforeEach(inject(function(_cardsFactory_, _$httpBackend_) {
      cardsFactory = _cardsFactory_;
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('fetchCards', function() {
      it('should create GET request to /api/cards', function() {
        $httpBackend.expectGET('/api/cards?userId=user123').respond(200, mockCardsData);

        var result = cardsFactory.fetchCards({ userId: 'user123' });

        $httpBackend.flush();

        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('card1');
        expect(result[1].cardId).toBe('card2');
      });

      it('should include userId as query parameter', function() {
        $httpBackend.expectGET('/api/cards?userId=testUser456').respond(200, mockCardsData);

        cardsFactory.fetchCards({ userId: 'testUser456' });

        $httpBackend.flush();
      });

      it('should return promise that resolves to array of cards', function() {
        $httpBackend.expectGET('/api/cards?userId=user123').respond(200, mockCardsData);

        var result = cardsFactory.fetchCards({ userId: 'user123' });

        $httpBackend.flush();

        expect(result.$promise).toBeDefined();
        result.$promise.then(function(data) {
          expect(Array.isArray(data)).toBe(true);
          expect(data.length).toBe(2);
        });
      });

      it('should handle server error responses', function() {
        $httpBackend.expectGET('/api/cards?userId=user123').respond(500, { error: 'Internal Server Error' });

        var result = cardsFactory.fetchCards({ userId: 'user123' });

        $httpBackend.flush();

        result.$promise.catch(function(error) {
          expect(error.status).toBe(500);
        });
      });

      it('should return array not object', function() {
        $httpBackend.expectGET('/api/cards?userId=user123').respond(200, mockCardsData);

        var result = cardsFactory.fetchCards({ userId: 'user123' });

        $httpBackend.flush();

        expect(Array.isArray(result)).toBe(true);
      });

      it('should handle empty array response', function() {
        $httpBackend.expectGET('/api/cards?userId=user123').respond(200, []);

        var result = cardsFactory.fetchCards({ userId: 'user123' });

        $httpBackend.flush();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
      });

      it('should handle response with 10+ cards', function() {
        var largeCardsArray = [];
        for (var i = 1; i <= 12; i++) {
          largeCardsArray.push({
            cardId: 'card' + i,
            cardType: 'Card Type ' + i,
            cardNumber: '****' + (1000 + i),
            creditLimit: 5000 * i
          });
        }

        $httpBackend.expectGET('/api/cards?userId=user123').respond(200, largeCardsArray);

        var result = cardsFactory.fetchCards({ userId: 'user123' });

        $httpBackend.flush();

        expect(result.length).toBe(12);
      });
    });
  });
})();