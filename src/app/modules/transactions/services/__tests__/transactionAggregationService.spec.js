/*
Test Documentation:
- Test Name: TransactionAggregationService Unit Tests
- Purpose: Validate transaction aggregation logic including card mapping and sorting
- Scenario: Test getAggregatedTransactions with multiple cards, transaction sorting, and error handling
- Expected Result: Correct transaction aggregation with card details and chronological sorting
*/

describe('TransactionAggregationService', function() {
  'use strict';
  
  beforeEach(module('creditCard.transactions'));
  
  var TransactionAggregationService, TransactionDataFactory, CreditCardService, $q, $rootScope;
  var mockTransactions, mockCards;
  
  beforeEach(inject(function(_TransactionAggregationService_, _TransactionDataFactory_, _CreditCardService_, _$q_, _$rootScope_) {
    TransactionAggregationService = _TransactionAggregationService_;
    TransactionDataFactory = _TransactionDataFactory_;
    CreditCardService = _CreditCardService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    mockTransactions = [
      { id: 'txn1', cardId: 'card1', amount: 50, merchant: 'Store A', date: '2023-01-15', status: 'posted' },
      { id: 'txn2', cardId: 'card2', amount: 100, merchant: 'Store B', date: '2023-01-20', status: 'posted' },
      { id: 'txn3', cardId: 'card1', amount: 75, merchant: 'Store C', date: '2023-01-10', status: 'pending' }
    ];
    
    mockCards = [
      { id: 'card1', cardName: 'Visa Gold', cardNumber: '**** 1234' },
      { id: 'card2', cardName: 'Mastercard', cardNumber: '**** 5678' }
    ];
  }));
  
  describe('getAggregatedTransactions', function() {
    it('should aggregate transactions with card details', function(done) {
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CreditCardService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      
      TransactionAggregationService.getAggregatedTransactions('user123').then(function(result) {
        expect(result.transactions.length).toBe(3);
        expect(result.cards).toEqual(mockCards);
        expect(result.transactions[0].cardName).toBeDefined();
        expect(result.transactions[0].cardNumber).toBeDefined();
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should sort transactions by date in descending order', function(done) {
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CreditCardService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      
      TransactionAggregationService.getAggregatedTransactions('user123').then(function(result) {
        expect(new Date(result.transactions[0].date)).toBeGreaterThanOrEqual(new Date(result.transactions[1].date));
        expect(new Date(result.transactions[1].date)).toBeGreaterThanOrEqual(new Date(result.transactions[2].date));
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should map card names to transactions', function(done) {
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CreditCardService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      
      TransactionAggregationService.getAggregatedTransactions('user123').then(function(result) {
        var card1Txns = result.transactions.filter(function(t) { return t.cardId === 'card1'; });
        card1Txns.forEach(function(txn) {
          expect(txn.cardName).toBe('Visa Gold');
          expect(txn.cardNumber).toBe('**** 1234');
        });
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle empty transactions array', function(done) {
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve([]));
      spyOn(CreditCardService, 'getCardDetails').and.returnValue($q.resolve([]));
      
      TransactionAggregationService.getAggregatedTransactions('user123').then(function(result) {
        expect(result.transactions).toEqual([]);
        expect(result.cards).toEqual([]);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should extract unique card IDs', function(done) {
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CreditCardService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      
      TransactionAggregationService.getAggregatedTransactions('user123').then(function() {
        expect(CreditCardService.getCardDetails).toHaveBeenCalledWith(['card1', 'card2']);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle transaction fetch errors', function(done) {
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.reject('API Error'));
      
      TransactionAggregationService.getAggregatedTransactions('user123').catch(function(error) {
        expect(error).toBe('API Error');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle card details fetch errors', function(done) {
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CreditCardService, 'getCardDetails').and.returnValue($q.reject('Card API Error'));
      
      TransactionAggregationService.getAggregatedTransactions('user123').catch(function(error) {
        expect(error).toBe('Card API Error');
        done();
      });
      
      $rootScope.$apply();
    });
  });
});

/*
Coverage Report:
- Functions tested: getAggregatedTransactions
- Scenarios covered:
  * Transaction aggregation with card details
  * Chronological sorting (descending)
  * Card name mapping
  * Empty transactions handling
  * Unique card ID extraction
  * Transaction fetch errors
  * Card details fetch errors
- Edge cases: Empty arrays, error conditions, duplicate card IDs
- Uncovered scenarios: Transactions with missing cardId, partial card data, concurrent requests
*/