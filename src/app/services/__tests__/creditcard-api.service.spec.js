/*
Test Documentation:
- Test Name: CreditCardApiService - fetchAllCards
- Purpose: Validates that CreditCardApiService.fetchAllCards correctly filters and returns credit cards for a given user ID
- Scenario: Service is initialized and fetchAllCards is called with valid userId
- Expected Result: Returns a promise resolving to an array of credit card objects filtered by userId
*/
/*
Coverage Report:
- Functions tested: fetchAllCards
- Scenarios covered: valid userId, empty userId, non-existent userId, promise resolution
- Uncovered scenarios: HTTP error handling (not applicable for mock implementation)
*/

(function() {
  'use strict';

  describe('CreditCardApiService', function() {
    var CreditCardApiService, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardApiService_, _$q_, _$rootScope_) {
      CreditCardApiService = _CreditCardApiService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('fetchAllCards', function() {
      it('should be defined', function() {
        expect(CreditCardApiService.fetchAllCards).toBeDefined();
        expect(typeof CreditCardApiService.fetchAllCards).toBe('function');
      });

      it('should return a promise', function() {
        var result = CreditCardApiService.fetchAllCards('user123');
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should resolve with an array of credit cards for valid userId', function(done) {
        CreditCardApiService.fetchAllCards('user123').then(function(cards) {
          expect(Array.isArray(cards)).toBe(true);
          expect(cards.length).toBeGreaterThan(0);
          done();
        });
        $rootScope.$digest();
      });

      it('should return cards with correct structure', function(done) {
        CreditCardApiService.fetchAllCards('user123').then(function(cards) {
          var card = cards[0];
          expect(card.cardId).toBeDefined();
          expect(card.userId).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.cardHolderName).toBeDefined();
          expect(card.cardType).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.outstandingAmount).toBeDefined();
          expect(card.expiryDate).toBeDefined();
          expect(card.status).toBeDefined();
          done();
        });
        $rootScope.$digest();
      });

      it('should filter cards by userId', function(done) {
        CreditCardApiService.fetchAllCards('user123').then(function(cards) {
          cards.forEach(function(card) {
            expect(card.userId).toBe('user123');
          });
          done();
        });
        $rootScope.$digest();
      });

      it('should return empty array for non-existent userId', function(done) {
        CreditCardApiService.fetchAllCards('nonExistentUser').then(function(cards) {
          expect(Array.isArray(cards)).toBe(true);
          expect(cards.length).toBe(0);
          done();
        });
        $rootScope.$digest();
      });

      it('should return cards with transactions array', function(done) {
        CreditCardApiService.fetchAllCards('user123').then(function(cards) {
          cards.forEach(function(card) {
            expect(Array.isArray(card.transactions)).toBe(true);
          });
          done();
        });
        $rootScope.$digest();
      });

      it('should return cards with valid transaction structure', function(done) {
        CreditCardApiService.fetchAllCards('user123').then(function(cards) {
          var card = cards[0];
          if (card.transactions.length > 0) {
            var txn = card.transactions[0];
            expect(txn.transactionId).toBeDefined();
            expect(txn.cardId).toBeDefined();
            expect(txn.amount).toBeDefined();
            expect(txn.category).toBeDefined();
            expect(txn.date).toBeDefined();
            expect(txn.description).toBeDefined();
            expect(txn.merchantName).toBeDefined();
            expect(txn.status).toBeDefined();
          }
          done();
        });
        $rootScope.$digest();
      });

      it('should return multiple cards for user123', function(done) {
        CreditCardApiService.fetchAllCards('user123').then(function(cards) {
          expect(cards.length).toBe(3);
          done();
        });
        $rootScope.$digest();
      });

      it('should return cards with different cardIds', function(done) {
        CreditCardApiService.fetchAllCards('user123').then(function(cards) {
          var cardIds = cards.map(function(card) { return card.cardId; });
          var uniqueIds = cardIds.filter(function(id, index) {
            return cardIds.indexOf(id) === index;
          });
          expect(uniqueIds.length).toBe(cards.length);
          done();
        });
        $rootScope.$digest();
      });

      it('should return cards with numeric creditLimit', function(done) {
        CreditCardApiService.fetchAllCards('user123').then(function(cards) {
          cards.forEach(function(card) {
            expect(typeof card.creditLimit).toBe('number');
            expect(card.creditLimit).toBeGreaterThan(0);
          });
          done();
        });
        $rootScope.$digest();
      });

      it('should return cards with valid status', function(done) {
        CreditCardApiService.fetchAllCards('user123').then(function(cards) {
          cards.forEach(function(card) {
            expect(card.status).toBe('Active');
          });
          done();
        });
        $rootScope.$digest();
      });

      it('should handle edge case with empty string userId', function(done) {
        CreditCardApiService.fetchAllCards('').then(function(cards) {
          expect(Array.isArray(cards)).toBe(true);
          expect(cards.length).toBe(0);
          done();
        });
        $rootScope.$digest();
      });

      it('should handle edge case with null userId', function(done) {
        CreditCardApiService.fetchAllCards(null).then(function(cards) {
          expect(Array.isArray(cards)).toBe(true);
          done();
        });
        $rootScope.$digest();
      });

      it('should return cards with availableCredit less than or equal to creditLimit', function(done) {
        CreditCardApiService.fetchAllCards('user123').then(function(cards) {
          cards.forEach(function(card) {
            expect(card.availableCredit).toBeLessThanOrEqual(card.creditLimit);
          });
          done();
        });
        $rootScope.$digest();
      });

      it('should return cards with outstandingAmount matching creditLimit minus availableCredit', function(done) {
        CreditCardApiService.fetchAllCards('user123').then(function(cards) {
          cards.forEach(function(card) {
            var expectedOutstanding = card.creditLimit - card.availableCredit;
            expect(card.outstandingAmount).toBe(expectedOutstanding);
          });
          done();
        });
        $rootScope.$digest();
      });
    });
  });
})();