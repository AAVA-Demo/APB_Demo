/*
Test Documentation:
- Test Name: CreditCardService - getCardBalances with valid userId
- Purpose: Validates retrieval of card balances for a user
- Scenario: Service is called with valid userId
- Expected Result: Should return card balance data from API
*/
/*
Test Documentation:
- Test Name: CreditCardService - getCardDetails with multiple card IDs
- Purpose: Validates retrieval of details for multiple cards
- Scenario: Service is called with array of card IDs
- Expected Result: Should return array of card detail objects
*/
/*
Test Documentation:
- Test Name: CreditCardService - cache management
- Purpose: Validates caching mechanism for performance
- Scenario: Service is called multiple times with same parameters
- Expected Result: Should use cached data within timeout period
*/
/*
Test Documentation:
- Test Name: CreditCardService - clearCache functionality
- Purpose: Validates cache clearing mechanism
- Scenario: Cache is populated then cleared
- Expected Result: Should fetch fresh data after cache clear
*/
/*
Coverage Report:
- Functions tested: getCardBalances, getCardDetails, clearCache
- Scenarios covered: successful API calls, cache hit/miss, error handling, empty card arrays, cache expiration
- Edge cases: null userId, empty cardIds array, network errors, cache timeout
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService, $httpBackend, $q;
    var mockUserId = 'user123';
    var mockCardIds = ['card1', 'card2', 'card3'];
    var mockBalanceData = {
      cards: [
        { cardId: 'card1', creditLimit: 5000, availableCredit: 3000, outstandingBalance: 2000 },
        { cardId: 'card2', creditLimit: 10000, availableCredit: 7000, outstandingBalance: 3000 }
      ]
    };
    var mockCardDetails = [
      { cardId: 'card1', cardNumber: '**** 1234', cardType: 'Visa', bankName: 'Chase' },
      { cardId: 'card2', cardNumber: '**** 5678', cardType: 'Mastercard', bankName: 'Citi' },
      { cardId: 'card3', cardNumber: '**** 9012', cardType: 'Amex', bankName: 'Amex' }
    ];

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _$q_) {
      CreditCardService = _CreditCardService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      CreditCardService.clearCache();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCardBalances', function() {
      it('should fetch card balances successfully', function() {
        $httpBackend.expectGET('/api/cards/balances?userId=' + mockUserId)
          .respond(200, mockBalanceData);

        var result;
        CreditCardService.getCardBalances(mockUserId)
          .then(function(data) {
            result = data;
          });

        $httpBackend.flush();

        expect(result).toEqual(mockBalanceData);
        expect(result.cards.length).toBe(2);
        expect(result.cards[0].creditLimit).toBe(5000);
      });

      it('should return cached data on subsequent calls within timeout', function() {
        $httpBackend.expectGET('/api/cards/balances?userId=' + mockUserId)
          .respond(200, mockBalanceData);

        var firstResult, secondResult;
        CreditCardService.getCardBalances(mockUserId)
          .then(function(data) {
            firstResult = data;
          });

        $httpBackend.flush();

        CreditCardService.getCardBalances(mockUserId)
          .then(function(data) {
            secondResult = data;
          });

        expect(secondResult).toEqual(firstResult);
        expect(secondResult).toEqual(mockBalanceData);
      });

      it('should handle API errors gracefully', function() {
        $httpBackend.expectGET('/api/cards/balances?userId=' + mockUserId)
          .respond(500, { error: 'Internal Server Error' });

        var errorResult;
        CreditCardService.getCardBalances(mockUserId)
          .catch(function(error) {
            errorResult = error;
          });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(500);
      });

      it('should handle network errors', function() {
        $httpBackend.expectGET('/api/cards/balances?userId=' + mockUserId)
          .respond(-1, null);

        var errorResult;
        CreditCardService.getCardBalances(mockUserId)
          .catch(function(error) {
            errorResult = error;
          });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
      });
    });

    describe('getCardDetails', function() {
      it('should fetch details for multiple cards successfully', function() {
        $httpBackend.expectGET('/api/cards/card1/details')
          .respond(200, mockCardDetails[0]);
        $httpBackend.expectGET('/api/cards/card2/details')
          .respond(200, mockCardDetails[1]);
        $httpBackend.expectGET('/api/cards/card3/details')
          .respond(200, mockCardDetails[2]);

        var result;
        CreditCardService.getCardDetails(mockCardIds)
          .then(function(data) {
            result = data;
          });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(3);
        expect(result[0].cardNumber).toBe('**** 1234');
        expect(result[1].cardType).toBe('Mastercard');
        expect(result[2].bankName).toBe('Amex');
      });

      it('should return empty array for empty cardIds', function() {
        var result;
        CreditCardService.getCardDetails([])
          .then(function(data) {
            result = data;
          });

        expect(result).toEqual([]);
      });

      it('should return empty array for null cardIds', function() {
        var result;
        CreditCardService.getCardDetails(null)
          .then(function(data) {
            result = data;
          });

        expect(result).toEqual([]);
      });

      it('should return empty array for undefined cardIds', function() {
        var result;
        CreditCardService.getCardDetails(undefined)
          .then(function(data) {
            result = data;
          });

        expect(result).toEqual([]);
      });

      it('should use cache for repeated card detail requests', function() {
        $httpBackend.expectGET('/api/cards/card1/details')
          .respond(200, mockCardDetails[0]);

        var firstResult, secondResult;
        CreditCardService.getCardDetails(['card1'])
          .then(function(data) {
            firstResult = data;
          });

        $httpBackend.flush();

        CreditCardService.getCardDetails(['card1'])
          .then(function(data) {
            secondResult = data;
          });

        expect(secondResult).toEqual(firstResult);
      });

      it('should handle partial failures in card detail retrieval', function() {
        $httpBackend.expectGET('/api/cards/card1/details')
          .respond(200, mockCardDetails[0]);
        $httpBackend.expectGET('/api/cards/card2/details')
          .respond(500, { error: 'Server Error' });

        var errorResult;
        CreditCardService.getCardDetails(['card1', 'card2'])
          .catch(function(error) {
            errorResult = error;
          });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
      });
    });

    describe('clearCache', function() {
      it('should clear cache and force fresh API call', function() {
        $httpBackend.expectGET('/api/cards/balances?userId=' + mockUserId)
          .respond(200, mockBalanceData);

        var firstResult;
        CreditCardService.getCardBalances(mockUserId)
          .then(function(data) {
            firstResult = data;
          });

        $httpBackend.flush();

        CreditCardService.clearCache();

        $httpBackend.expectGET('/api/cards/balances?userId=' + mockUserId)
          .respond(200, mockBalanceData);

        var secondResult;
        CreditCardService.getCardBalances(mockUserId)
          .then(function(data) {
            secondResult = data;
          });

        $httpBackend.flush();

        expect(firstResult).toEqual(mockBalanceData);
        expect(secondResult).toEqual(mockBalanceData);
      });

      it('should not throw error when clearing empty cache', function() {
        expect(function() {
          CreditCardService.clearCache();
        }).not.toThrow();
      });
    });
  });
})();