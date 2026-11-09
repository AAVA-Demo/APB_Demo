/*
Test Documentation:
- Test Name: CreditCardMapperFactory Test Suite
- Purpose: Validate the CreditCardMapperFactory maps transactions to credit cards correctly
- Scenario: Tests transaction mapping with valid cards, missing cards, and error handling
- Expected Result: Transactions are enriched with card information when cards exist
*/

(function() {
  'use strict';

  describe('CreditCardMapperFactory', function() {
    var CreditCardMapperFactory, CreditCardDataService, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardMapperFactory_, _CreditCardDataService_, _$q_, _$rootScope_) {
      CreditCardMapperFactory = _CreditCardMapperFactory_;
      CreditCardDataService = _CreditCardDataService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('mapTransactionsToCards', function() {
      it('should map transactions to cards successfully', function() {
        var mockCards = [
          { cardId: 'card123', cardName: 'Visa Gold', cardType: 'Credit' },
          { cardId: 'card456', cardName: 'MasterCard Platinum', cardType: 'Credit' }
        ];

        var transactions = [
          { transactionId: 'txn1', cardId: 'card123', amount: 100 },
          { transactionId: 'txn2', cardId: 'card456', amount: 200 }
        ];

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));

        var result;
        CreditCardMapperFactory.mapTransactionsToCards(transactions).then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(CreditCardDataService.getAllCards).toHaveBeenCalled();
        expect(result[0].cardName).toBe('Visa Gold');
        expect(result[0].cardType).toBe('Credit');
        expect(result[1].cardName).toBe('MasterCard Platinum');
        expect(result[1].cardType).toBe('Credit');
      });

      it('should handle transactions with non-existent cardId', function() {
        var mockCards = [
          { cardId: 'card123', cardName: 'Visa Gold', cardType: 'Credit' }
        ];

        var transactions = [
          { transactionId: 'txn1', cardId: 'card123', amount: 100 },
          { transactionId: 'txn2', cardId: 'card999', amount: 200 }
        ];

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));

        var result;
        CreditCardMapperFactory.mapTransactionsToCards(transactions).then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result[0].cardName).toBe('Visa Gold');
        expect(result[1].cardName).toBeUndefined();
        expect(result[1].cardType).toBeUndefined();
      });

      it('should handle empty transactions array', function() {
        var mockCards = [
          { cardId: 'card123', cardName: 'Visa Gold', cardType: 'Credit' }
        ];

        var transactions = [];

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));

        var result;
        CreditCardMapperFactory.mapTransactionsToCards(transactions).then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(CreditCardDataService.getAllCards).toHaveBeenCalled();
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should handle empty cards array', function() {
        var mockCards = [];

        var transactions = [
          { transactionId: 'txn1', cardId: 'card123', amount: 100 }
        ];

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));

        var result;
        CreditCardMapperFactory.mapTransactionsToCards(transactions).then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result[0].cardName).toBeUndefined();
        expect(result[0].cardType).toBeUndefined();
      });

      it('should handle CreditCardDataService error', function() {
        var transactions = [
          { transactionId: 'txn1', cardId: 'card123', amount: 100 }
        ];

        var errorResponse = { status: 500, message: 'Internal Server Error' };
        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.reject(errorResponse));

        var error;
        CreditCardMapperFactory.mapTransactionsToCards(transactions).catch(function(err) {
          error = err;
        });

        $rootScope.$digest();

        expect(CreditCardDataService.getAllCards).toHaveBeenCalled();
        expect(error).toEqual(errorResponse);
      });

      it('should preserve original transaction properties', function() {
        var mockCards = [
          { cardId: 'card123', cardName: 'Visa Gold', cardType: 'Credit' }
        ];

        var transactions = [
          {
            transactionId: 'txn1',
            cardId: 'card123',
            amount: 100,
            merchantName: 'Amazon',
            category: 'Shopping'
          }
        ];

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));

        var result;
        CreditCardMapperFactory.mapTransactionsToCards(transactions).then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result[0].transactionId).toBe('txn1');
        expect(result[0].amount).toBe(100);
        expect(result[0].merchantName).toBe('Amazon');
        expect(result[0].category).toBe('Shopping');
        expect(result[0].cardName).toBe('Visa Gold');
        expect(result[0].cardType).toBe('Credit');
      });

      it('should handle multiple transactions for same card', function() {
        var mockCards = [
          { cardId: 'card123', cardName: 'Visa Gold', cardType: 'Credit' }
        ];

        var transactions = [
          { transactionId: 'txn1', cardId: 'card123', amount: 100 },
          { transactionId: 'txn2', cardId: 'card123', amount: 200 },
          { transactionId: 'txn3', cardId: 'card123', amount: 300 }
        ];

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));

        var result;
        CreditCardMapperFactory.mapTransactionsToCards(transactions).then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result.length).toBe(3);
        result.forEach(function(txn) {
          expect(txn.cardName).toBe('Visa Gold');
          expect(txn.cardType).toBe('Credit');
        });
      });

      it('should return a promise', function() {
        var mockCards = [];
        var transactions = [];

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));

        var promise = CreditCardMapperFactory.mapTransactionsToCards(transactions);

        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');

        $rootScope.$digest();
      });

      it('should not modify original transactions array reference', function() {
        var mockCards = [
          { cardId: 'card123', cardName: 'Visa Gold', cardType: 'Credit' }
        ];

        var transactions = [
          { transactionId: 'txn1', cardId: 'card123', amount: 100 }
        ];

        var originalRef = transactions;

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));

        var result;
        CreditCardMapperFactory.mapTransactionsToCards(transactions).then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result).toBe(originalRef);
        expect(result[0]).toBe(transactions[0]);
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: mapTransactionsToCards
  - Scenarios covered:
    * Successful transaction to card mapping
    * Transactions with non-existent cardId
    * Empty transactions array
    * Empty cards array
    * CreditCardDataService error handling
    * Preservation of original transaction properties
    * Multiple transactions for same card
    * Promise return validation
    * Original array reference preservation
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();