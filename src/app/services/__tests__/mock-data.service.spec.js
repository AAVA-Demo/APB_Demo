/*
Test Documentation:
- Test Name: mockDataService - getCards
- Purpose: Validates that getCards returns an array of credit card objects
- Scenario: When getCards is called, it should return a copy of the cards array
- Expected Result: Returns array with 3 card objects, each with required properties
*/
/*
Test Documentation:
- Test Name: mockDataService - getCardById
- Purpose: Validates that getCardById returns the correct card for a given cardId
- Scenario: When getCardById is called with a valid cardId, it should return the matching card
- Expected Result: Returns the correct card object or undefined for invalid cardId
*/
/*
Test Documentation:
- Test Name: mockDataService - getTransactions
- Purpose: Validates that getTransactions returns an array of transaction objects
- Scenario: When getTransactions is called, it should return a copy of the transactions array
- Expected Result: Returns array with 10 transaction objects, each with required properties
*/
/*
Coverage Report:
- Functions tested: getCards, getCardById, getTransactions
- Scenarios covered: successful data retrieval, card lookup by ID, invalid card ID, data immutability
- Edge cases: invalid cardId, data copy verification, array structure validation
- Uncovered scenarios: none (mock service has no error paths)
*/

describe('mockDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var mockDataService;
  
  beforeEach(inject(function(_mockDataService_) {
    mockDataService = _mockDataService_;
  }));
  
  describe('getCards', function() {
    it('should return an array of cards', function() {
      var cards = mockDataService.getCards();
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBe(3);
    });
    
    it('should return cards with all required properties', function() {
      var cards = mockDataService.getCards();
      cards.forEach(function(card) {
        expect(card.cardId).toBeDefined();
        expect(card.cardNumber).toBeDefined();
        expect(card.cardType).toBeDefined();
        expect(card.cardName).toBeDefined();
        expect(card.totalLimit).toBeDefined();
        expect(card.availableCredit).toBeDefined();
        expect(card.outstandingBalance).toBeDefined();
        expect(card.monthlySpend).toBeDefined();
        expect(card.lastUpdated).toBeDefined();
      });
    });
    
    it('should return a copy of the cards array', function() {
      var cards1 = mockDataService.getCards();
      var cards2 = mockDataService.getCards();
      expect(cards1).not.toBe(cards2);
      expect(cards1).toEqual(cards2);
    });
    
    it('should return cards with correct data types', function() {
      var cards = mockDataService.getCards();
      cards.forEach(function(card) {
        expect(typeof card.cardId).toBe('string');
        expect(typeof card.cardNumber).toBe('string');
        expect(typeof card.cardType).toBe('string');
        expect(typeof card.cardName).toBe('string');
        expect(typeof card.totalLimit).toBe('number');
        expect(typeof card.availableCredit).toBe('number');
        expect(typeof card.outstandingBalance).toBe('number');
        expect(typeof card.monthlySpend).toBe('number');
        expect(card.lastUpdated instanceof Date).toBe(true);
      });
    });
    
    it('should return cards with valid financial data', function() {
      var cards = mockDataService.getCards();
      cards.forEach(function(card) {
        expect(card.totalLimit).toBeGreaterThan(0);
        expect(card.availableCredit).toBeGreaterThanOrEqual(0);
        expect(card.outstandingBalance).toBeGreaterThanOrEqual(0);
        expect(card.monthlySpend).toBeGreaterThanOrEqual(0);
        expect(card.availableCredit + card.outstandingBalance).toBe(card.totalLimit);
      });
    });
  });
  
  describe('getCardById', function() {
    it('should return the correct card for valid cardId', function() {
      var card = mockDataService.getCardById('card001');
      expect(card).toBeDefined();
      expect(card.cardId).toBe('card001');
      expect(card.cardName).toBe('Visa Platinum');
    });
    
    it('should return undefined for invalid cardId', function() {
      var card = mockDataService.getCardById('invalid-id');
      expect(card).toBeUndefined();
    });
    
    it('should return a copy of the card object', function() {
      var card1 = mockDataService.getCardById('card002');
      var card2 = mockDataService.getCardById('card002');
      expect(card1).not.toBe(card2);
      expect(card1).toEqual(card2);
    });
    
    it('should return card with all required properties', function() {
      var card = mockDataService.getCardById('card003');
      expect(card.cardId).toBe('card003');
      expect(card.cardNumber).toBe('**** **** **** 9012');
      expect(card.cardType).toBe('Amex');
      expect(card.cardName).toBe('American Express');
      expect(card.totalLimit).toBe(70000);
      expect(card.availableCredit).toBe(60000);
      expect(card.outstandingBalance).toBe(10000);
      expect(card.monthlySpend).toBe(5300);
    });
    
    it('should handle null or undefined cardId', function() {
      var cardNull = mockDataService.getCardById(null);
      var cardUndefined = mockDataService.getCardById(undefined);
      expect(cardNull).toBeUndefined();
      expect(cardUndefined).toBeUndefined();
    });
  });
  
  describe('getTransactions', function() {
    it('should return an array of transactions', function() {
      var transactions = mockDataService.getTransactions();
      expect(Array.isArray(transactions)).toBe(true);
      expect(transactions.length).toBe(10);
    });
    
    it('should return transactions with all required properties', function() {
      var transactions = mockDataService.getTransactions();
      transactions.forEach(function(txn) {
        expect(txn.transactionId).toBeDefined();
        expect(txn.cardId).toBeDefined();
        expect(txn.amount).toBeDefined();
        expect(txn.merchantName).toBeDefined();
        expect(txn.category).toBeDefined();
        expect(txn.transactionDate).toBeDefined();
        expect(txn.description).toBeDefined();
      });
    });
    
    it('should return a copy of the transactions array', function() {
      var txns1 = mockDataService.getTransactions();
      var txns2 = mockDataService.getTransactions();
      expect(txns1).not.toBe(txns2);
      expect(txns1).toEqual(txns2);
    });
    
    it('should return transactions with correct data types', function() {
      var transactions = mockDataService.getTransactions();
      transactions.forEach(function(txn) {
        expect(typeof txn.transactionId).toBe('string');
        expect(typeof txn.cardId).toBe('string');
        expect(typeof txn.amount).toBe('number');
        expect(typeof txn.merchantName).toBe('string');
        expect(typeof txn.category).toBe('string');
        expect(txn.transactionDate instanceof Date).toBe(true);
        expect(typeof txn.description).toBe('string');
      });
    });
    
    it('should return transactions with valid categories', function() {
      var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      var transactions = mockDataService.getTransactions();
      transactions.forEach(function(txn) {
        expect(validCategories).toContain(txn.category);
      });
    });
    
    it('should return transactions with positive amounts', function() {
      var transactions = mockDataService.getTransactions();
      transactions.forEach(function(txn) {
        expect(txn.amount).toBeGreaterThan(0);
      });
    });
    
    it('should return transactions linked to valid card IDs', function() {
      var validCardIds = ['card001', 'card002', 'card003'];
      var transactions = mockDataService.getTransactions();
      transactions.forEach(function(txn) {
        expect(validCardIds).toContain(txn.cardId);
      });
    });
  });
  
  describe('data integrity', function() {
    it('should maintain internal cards array immutability', function() {
      var cards = mockDataService.getCards();
      cards[0].cardName = 'Modified Name';
      var cardsAgain = mockDataService.getCards();
      expect(cardsAgain[0].cardName).not.toBe('Modified Name');
    });
    
    it('should maintain internal transactions array immutability', function() {
      var txns = mockDataService.getTransactions();
      txns[0].amount = 99999;
      var txnsAgain = mockDataService.getTransactions();
      expect(txnsAgain[0].amount).not.toBe(99999);
    });
  });
});