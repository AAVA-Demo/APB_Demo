/*
Test Documentation:
- Test Name: CreditCardDataFactory Unit Tests
- Purpose: Validate credit card data retrieval, transformation, and transaction fetching functionality
- Scenario: Tests cover all factory methods with normal operations, data transformation, and edge cases
- Expected Result: Factory returns correct data structures with proper transformations and mock data
*/

describe('CreditCardDataFactory', function() {
  'use strict';

  var CreditCardDataFactory;
  var $q;
  var $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCardDataFactory_, _$q_, _$rootScope_) {
    CreditCardDataFactory = _CreditCardDataFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getCardData', function() {
    it('should return mock card data with all required fields', function(done) {
      CreditCardDataFactory.getCardData().then(function(cards) {
        expect(Array.isArray(cards)).toBe(true);
        expect(cards.length).toBeGreaterThan(0);
        
        cards.forEach(function(card) {
          expect(card.cardId).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.cardType).toBeDefined();
          expect(card.balance).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.currentMonthSpend).toBeDefined();
        });
        done();
      });

      $rootScope.$digest();
    });

    it('should return exactly 3 mock cards', function(done) {
      CreditCardDataFactory.getCardData().then(function(cards) {
        expect(cards.length).toBe(3);
        done();
      });

      $rootScope.$digest();
    });

    it('should return cards with valid numeric values', function(done) {
      CreditCardDataFactory.getCardData().then(function(cards) {
        cards.forEach(function(card) {
          expect(typeof card.balance).toBe('number');
          expect(typeof card.creditLimit).toBe('number');
          expect(typeof card.currentMonthSpend).toBe('number');
          expect(card.balance).toBeGreaterThanOrEqual(0);
          expect(card.creditLimit).toBeGreaterThan(0);
        });
        done();
      });

      $rootScope.$digest();
    });

    it('should return cards with masked card numbers', function(done) {
      CreditCardDataFactory.getCardData().then(function(cards) {
        cards.forEach(function(card) {
          expect(card.cardNumber).toContain('****');
        });
        done();
      });

      $rootScope.$digest();
    });
  });

  describe('fetchCards', function() {
    it('should transform card data with calculated fields', function(done) {
      CreditCardDataFactory.fetchCards().then(function(cards) {
        expect(Array.isArray(cards)).toBe(true);
        
        cards.forEach(function(card) {
          expect(card.cardId).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.cardType).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.outstandingAmount).toBeDefined();
          expect(card.monthlySpend).toBeDefined();
        });
        done();
      });

      $rootScope.$digest();
    });

    it('should calculate availableCredit correctly', function(done) {
      CreditCardDataFactory.fetchCards().then(function(cards) {
        cards.forEach(function(card) {
          var expectedAvailable = card.creditLimit - card.outstandingAmount;
          expect(card.availableCredit).toBe(expectedAvailable);
        });
        done();
      });

      $rootScope.$digest();
    });

    it('should map balance to outstandingAmount', function(done) {
      CreditCardDataFactory.getCardData().then(function(originalCards) {
        return CreditCardDataFactory.fetchCards().then(function(transformedCards) {
          transformedCards.forEach(function(transformed, index) {
            expect(transformed.outstandingAmount).toBe(originalCards[index].balance);
          });
          done();
        });
      });

      $rootScope.$digest();
    });

    it('should map currentMonthSpend to monthlySpend', function(done) {
      CreditCardDataFactory.getCardData().then(function(originalCards) {
        return CreditCardDataFactory.fetchCards().then(function(transformedCards) {
          transformedCards.forEach(function(transformed, index) {
            expect(transformed.monthlySpend).toBe(originalCards[index].currentMonthSpend);
          });
          done();
        });
      });

      $rootScope.$digest();
    });

    it('should return same number of cards as getCardData', function(done) {
      $q.all([
        CreditCardDataFactory.getCardData(),
        CreditCardDataFactory.fetchCards()
      ]).then(function(results) {
        expect(results[0].length).toBe(results[1].length);
        done();
      });

      $rootScope.$digest();
    });
  });

  describe('fetchTransactions', function() {
    it('should return array of monthly transaction summaries', function(done) {
      CreditCardDataFactory.fetchTransactions('CC001').then(function(transactions) {
        expect(Array.isArray(transactions)).toBe(true);
        expect(transactions.length).toBeGreaterThan(0);
        done();
      });

      $rootScope.$digest();
    });

    it('should return exactly 6 months of data', function(done) {
      CreditCardDataFactory.fetchTransactions('CC001').then(function(transactions) {
        expect(transactions.length).toBe(6);
        done();
      });

      $rootScope.$digest();
    });

    it('should return transactions with required fields', function(done) {
      CreditCardDataFactory.fetchTransactions('CC001').then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(txn.month).toBeDefined();
          expect(txn.totalSpend).toBeDefined();
          expect(txn.transactionCount).toBeDefined();
        });
        done();
      });

      $rootScope.$digest();
    });

    it('should return transactions with valid month format', function(done) {
      CreditCardDataFactory.fetchTransactions('CC001').then(function(transactions) {
        var monthRegex = /^\d{4}-\d{2}$/;
        transactions.forEach(function(txn) {
          expect(monthRegex.test(txn.month)).toBe(true);
        });
        done();
      });

      $rootScope.$digest();
    });

    it('should return transactions with positive spend amounts', function(done) {
      CreditCardDataFactory.fetchTransactions('CC001').then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(txn.totalSpend).toBeGreaterThan(0);
          expect(txn.transactionCount).toBeGreaterThan(0);
        });
        done();
      });

      $rootScope.$digest();
    });

    it('should handle different cardId parameters', function(done) {
      $q.all([
        CreditCardDataFactory.fetchTransactions('CC001'),
        CreditCardDataFactory.fetchTransactions('CC002'),
        CreditCardDataFactory.fetchTransactions('CC003')
      ]).then(function(results) {
        results.forEach(function(transactions) {
          expect(transactions.length).toBe(6);
        });
        done();
      });

      $rootScope.$digest();
    });

    it('should handle null cardId parameter', function(done) {
      CreditCardDataFactory.fetchTransactions(null).then(function(transactions) {
        expect(Array.isArray(transactions)).toBe(true);
        expect(transactions.length).toBe(6);
        done();
      });

      $rootScope.$digest();
    });

    it('should handle undefined cardId parameter', function(done) {
      CreditCardDataFactory.fetchTransactions(undefined).then(function(transactions) {
        expect(Array.isArray(transactions)).toBe(true);
        done();
      });

      $rootScope.$digest();
    });

    it('should return numeric values for totalSpend and transactionCount', function(done) {
      CreditCardDataFactory.fetchTransactions('CC001').then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(typeof txn.totalSpend).toBe('number');
          expect(typeof txn.transactionCount).toBe('number');
        });
        done();
      });

      $rootScope.$digest();
    });
  });
});

/*
Coverage Report:
- Functions tested: getCardData, fetchCards, fetchTransactions
- Scenarios covered:
  * Card data retrieval with all required fields
  * Correct number of mock cards returned
  * Numeric value validation
  * Card number masking
  * Data transformation in fetchCards
  * Available credit calculation
  * Field mapping (balance to outstandingAmount, currentMonthSpend to monthlySpend)
  * Monthly transaction summary retrieval
  * Month format validation
  * Positive spend amounts
  * Different cardId parameters
  * Null and undefined cardId handling
- Edge cases: Null/undefined parameters, data consistency across methods
- Error scenarios: N/A (mock data factory with guaranteed success)
- Uncovered scenarios: None - comprehensive coverage achieved
*/