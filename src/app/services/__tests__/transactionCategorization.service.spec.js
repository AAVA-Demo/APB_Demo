/*
Test Documentation:
- Test Name: TransactionCategorizationService - categorizeTransactions
- Purpose: Validate transaction categorization logic for spending analysis
- Scenario: Service validates and assigns categories to transactions based on predefined category list
- Expected Result: Returns transactions with valid categories, defaulting to Miscellaneous for invalid categories
*/
/*
Coverage Report:
- Functions tested: categorizeTransactions
- Scenarios covered: valid categories, invalid categories, missing categories, empty array, mixed valid/invalid categories
- Uncovered scenarios: none
*/

describe('TransactionCategorizationService', function() {
  'use strict';

  var TransactionCategorizationService;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionCategorizationService_) {
    TransactionCategorizationService = _TransactionCategorizationService_;
  }));

  describe('categorizeTransactions', function() {
    it('should return empty array for empty input', function() {
      var result = TransactionCategorizationService.categorizeTransactions([]);
      expect(result).toEqual([]);
    });

    it('should preserve valid categories', function() {
      var transactions = [
        {transactionId: 'TXN001', category: 'Food & Dining', amount: 1000},
        {transactionId: 'TXN002', category: 'Fuel', amount: 2000},
        {transactionId: 'TXN003', category: 'Shopping', amount: 3000}
      ];
      var result = TransactionCategorizationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Shopping');
    });

    it('should set invalid category to Miscellaneous', function() {
      var transactions = [
        {transactionId: 'TXN001', category: 'InvalidCategory', amount: 1000}
      ];
      var result = TransactionCategorizationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Miscellaneous');
    });

    it('should set missing category to Miscellaneous', function() {
      var transactions = [
        {transactionId: 'TXN001', amount: 1000}
      ];
      var result = TransactionCategorizationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Miscellaneous');
    });

    it('should handle all valid categories', function() {
      var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      var transactions = validCategories.map(function(cat, idx) {
        return {transactionId: 'TXN' + idx, category: cat, amount: 1000};
      });
      var result = TransactionCategorizationService.categorizeTransactions(transactions);
      result.forEach(function(txn, idx) {
        expect(txn.category).toBe(validCategories[idx]);
      });
    });

    it('should handle mixed valid and invalid categories', function() {
      var transactions = [
        {transactionId: 'TXN001', category: 'Food & Dining', amount: 1000},
        {transactionId: 'TXN002', category: 'InvalidCat', amount: 2000},
        {transactionId: 'TXN003', category: 'Travel', amount: 3000},
        {transactionId: 'TXN004', amount: 4000}
      ];
      var result = TransactionCategorizationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Miscellaneous');
      expect(result[2].category).toBe('Travel');
      expect(result[3].category).toBe('Miscellaneous');
    });

    it('should preserve other transaction properties', function() {
      var transactions = [
        {transactionId: 'TXN001', category: 'Food & Dining', amount: 1000, description: 'Restaurant', date: new Date()}
      ];
      var result = TransactionCategorizationService.categorizeTransactions(transactions);
      expect(result[0].transactionId).toBe('TXN001');
      expect(result[0].amount).toBe(1000);
      expect(result[0].description).toBe('Restaurant');
      expect(result[0].date).toBeDefined();
    });

    it('should handle case-sensitive category matching', function() {
      var transactions = [
        {transactionId: 'TXN001', category: 'food & dining', amount: 1000},
        {transactionId: 'TXN002', category: 'FUEL', amount: 2000}
      ];
      var result = TransactionCategorizationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Miscellaneous');
      expect(result[1].category).toBe('Miscellaneous');
    });
  });
});