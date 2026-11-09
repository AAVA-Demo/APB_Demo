/*
Test Documentation:
- Test Name: CardManagementService - getAllCards
- Purpose: Validates that all credit cards are retrieved correctly
- Scenario: Fetch all cards from CreditCardFactory
- Expected Result: Returns array of credit card objects
*/
/*
Test Documentation:
- Test Name: CardManagementService - getCardSpend
- Purpose: Validates card-specific spending analysis
- Scenario: Fetch card details and transactions, calculate spend summary
- Expected Result: Returns card details with spend summary including category breakdown
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardSpend
- Scenarios covered: successful retrieval, caching, card not found, empty transactions, category aggregation, error handling
- Uncovered scenarios: none
*/

describe('CardManagementService', function() {
  'use strict';

  beforeEach(module('app.cardManagement'));

  var CardManagementService, CreditCardFactory, TransactionFactory, $q, $rootScope;

  beforeEach(inject(function(_CardManagementService_, _CreditCardFactory_, _TransactionFactory_, _$q_, _$rootScope_) {
    CardManagementService = _CardManagementService_;
    CreditCardFactory = _CreditCardFactory_;
    TransactionFactory = _TransactionFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getAllCards', function() {
    var mockCards;

    beforeEach(function() {
      mockCards = [
        { cardId: 'card1', cardName: 'Visa Gold', creditLimit: 10000, outstandingAmount: 2000 },
        { cardId: 'card2', cardName: 'Mastercard Platinum', creditLimit: 15000, outstandingAmount: 5000 }
      ];

      spyOn(CreditCardFactory, 'getAllCards').and.returnValue($q.resolve(mockCards));
    });

    it('should retrieve all cards successfully', function() {
      var result;

      CardManagementService.getAllCards().then(function(cards) {
        result = cards;
      });

      $rootScope.$apply();

      expect(CreditCardFactory.getAllCards).toHaveBeenCalled();
      expect(result).toEqual(mockCards);
      expect(result.length).toBe(2);
    });

    it('should cache cards after first retrieval', function() {
      var result1, result2;

      CardManagementService.getAllCards().then(function(cards) {
        result1 = cards;
      });

      $rootScope.$apply();

      CardManagementService.getAllCards().then(function(cards) {
        result2 = cards;
      });

      $rootScope.$apply();

      expect(CreditCardFactory.getAllCards.calls.count()).toBe(1);
      expect(result1).toEqual(result2);
    });

    it('should handle empty card list', function() {
      CreditCardFactory.getAllCards.and.returnValue($q.resolve([]));

      var result;

      CardManagementService.getAllCards().then(function(cards) {
        result = cards;
      });

      $rootScope.$apply();

      expect(result).toEqual([]);
    });

    it('should reject promise when CreditCardFactory fails', function() {
      CreditCardFactory.getAllCards.and.returnValue($q.reject('Card retrieval error'));

      var error;

      CardManagementService.getAllCards().catch(function(err) {
        error = err;
      });

      $rootScope.$apply();

      expect(error).toBe('Card retrieval error');
    });
  });

  describe('getCardSpend', function() {
    var mockCards, mockTransactions;

    beforeEach(function() {
      mockCards = [
        { cardId: 'card1', cardName: 'Visa Gold', creditLimit: 10000, outstandingAmount: 2000 },
        { cardId: 'card2', cardName: 'Mastercard Platinum', creditLimit: 15000, outstandingAmount: 5000 }
      ];

      mockTransactions = [
        { transactionId: 'txn1', amount: 100, category: 'Food & Dining' },
        { transactionId: 'txn2', amount: 50, category: 'Food & Dining' },
        { transactionId: 'txn3', amount: 200, category: 'Fuel' },
        { transactionId: 'txn4', amount: 150, category: 'Shopping' }
      ];

      spyOn(CreditCardFactory, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionFactory, 'getCardTransactions').and.returnValue($q.resolve(mockTransactions));
    });

    it('should retrieve card spend summary successfully', function() {
      var result;

      CardManagementService.getCardSpend('card1').then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(TransactionFactory.getCardTransactions).toHaveBeenCalledWith('card1');
      expect(result.card).toEqual(mockCards[0]);
      expect(result.spendSummary.cardId).toBe('card1');
      expect(result.spendSummary.totalSpend).toBe(500);
      expect(result.spendSummary.transactionCount).toBe(4);
      expect(result.spendSummary.categoryBreakdown.length).toBe(3);
    });

    it('should calculate category breakdown correctly', function() {
      var result;

      CardManagementService.getCardSpend('card1').then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      var foodCategory = result.spendSummary.categoryBreakdown.find(function(cat) {
        return cat.categoryName === 'Food & Dining';
      });

      expect(foodCategory.amount).toBe(150);
      expect(parseFloat(foodCategory.percentage)).toBeCloseTo(30, 0);
      expect(foodCategory.transactionCount).toBe(2);
    });

    it('should handle transactions without category', function() {
      var transactionsWithoutCategory = [
        { transactionId: 'txn1', amount: 100 },
        { transactionId: 'txn2', amount: 50, category: null }
      ];

      TransactionFactory.getCardTransactions.and.returnValue($q.resolve(transactionsWithoutCategory));

      var result;

      CardManagementService.getCardSpend('card1').then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result.spendSummary.categoryBreakdown.length).toBe(1);
      expect(result.spendSummary.categoryBreakdown[0].categoryName).toBe('Miscellaneous');
      expect(result.spendSummary.categoryBreakdown[0].amount).toBe(150);
    });

    it('should reject promise when card is not found', function() {
      var error;

      CardManagementService.getCardSpend('invalidCardId').catch(function(err) {
        error = err;
      });

      $rootScope.$apply();

      expect(error).toBe('Card not found');
    });

    it('should handle empty transactions', function() {
      TransactionFactory.getCardTransactions.and.returnValue($q.resolve([]));

      var result;

      CardManagementService.getCardSpend('card1').then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result.spendSummary.totalSpend).toBe(0);
      expect(result.spendSummary.transactionCount).toBe(0);
      expect(result.spendSummary.categoryBreakdown.length).toBe(0);
    });

    it('should handle transactions with null or undefined amounts', function() {
      var transactionsWithNullAmounts = [
        { transactionId: 'txn1', amount: null, category: 'Food & Dining' },
        { transactionId: 'txn2', amount: undefined, category: 'Fuel' },
        { transactionId: 'txn3', amount: 100, category: 'Shopping' }
      ];

      TransactionFactory.getCardTransactions.and.returnValue($q.resolve(transactionsWithNullAmounts));

      var result;

      CardManagementService.getCardSpend('card1').then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result.spendSummary.totalSpend).toBe(100);
    });

    it('should reject promise when TransactionFactory fails', function() {
      TransactionFactory.getCardTransactions.and.returnValue($q.reject('Transaction error'));

      var error;

      CardManagementService.getCardSpend('card1').catch(function(err) {
        error = err;
      });

      $rootScope.$apply();

      expect(error).toBe('Transaction error');
    });
  });
});