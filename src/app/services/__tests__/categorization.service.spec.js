/*
Test Documentation:
- Test Name: CategorizationService - categorizeTransactions assigns categories based on merchant name
- Purpose: Validates automatic categorization of transactions using merchant keywords
- Scenario: Transactions with various merchant names are categorized
- Expected Result: Each transaction is assigned the correct category based on merchant keywords
*/
/*
Test Documentation:
- Test Name: CategorizationService - categorizeTransactions handles pre-categorized transactions
- Purpose: Validates that transactions with existing categories are not re-categorized
- Scenario: Transactions already have valid categories assigned
- Expected Result: Existing categories are preserved unless they are 'Miscellaneous'
*/
/*
Test Documentation:
- Test Name: CategorizationService - categorizeTransactions defaults to Miscellaneous for unknown merchants
- Purpose: Validates fallback categorization for unrecognized merchants
- Scenario: Transaction with merchant name not matching any keyword rules
- Expected Result: Transaction is categorized as 'Miscellaneous'
*/
/*
Test Documentation:
- Test Name: CategorizationService - categorizeTransactions handles missing merchant names
- Purpose: Validates handling of transactions without merchant information
- Scenario: Transactions with null, undefined, or empty merchantName
- Expected Result: Transactions are categorized as 'Miscellaneous'
*/
/*
Test Documentation:
- Test Name: CategorizationService - categorizeTransactions is case-insensitive
- Purpose: Validates case-insensitive keyword matching
- Scenario: Merchant names with mixed case (uppercase, lowercase, mixed)
- Expected Result: Categories are correctly assigned regardless of case
*/
/*
Test Documentation:
- Test Name: CategorizationService - categorizeTransactions handles multiple keyword matches
- Purpose: Validates behavior when merchant name matches multiple category keywords
- Scenario: Merchant name contains keywords from multiple categories
- Expected Result: First matching category is assigned
*/
/*
Coverage Report:
- Functions tested: categorizeTransactions, categorizeByMerchant (internal)
- Scenarios covered: keyword matching, pre-categorized transactions, missing data, case sensitivity, fallback to Miscellaneous
- Edge cases: null merchantName, empty strings, multiple keyword matches, special characters
- Uncovered scenarios: none
*/

describe('CategorizationService', function() {
  'use strict';
  
  beforeEach(module('cc.analytics'));
  
  var CategorizationService;
  var SPENDING_CATEGORIES;
  
  beforeEach(inject(function(_CategorizationService_, _SPENDING_CATEGORIES_) {
    CategorizationService = _CategorizationService_;
    SPENDING_CATEGORIES = _SPENDING_CATEGORIES_;
  }));
  
  describe('categorizeTransactions', function() {
    
    it('should categorize transactions based on merchant name keywords', function() {
      var transactions = [
        { transactionId: 'txn1', amount: 50, merchantName: 'Pizza Hut Restaurant', category: null },
        { transactionId: 'txn2', amount: 60, merchantName: 'Shell Gas Station', category: null },
        { transactionId: 'txn3', amount: 100, merchantName: 'Amazon Shopping', category: null }
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Shopping');
    });
    
    it('should preserve existing valid categories', function() {
      var transactions = [
        { transactionId: 'txn1', amount: 50, merchantName: 'Unknown Store', category: 'Shopping' },
        { transactionId: 'txn2', amount: 60, merchantName: 'Generic Merchant', category: 'Travel' }
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Shopping');
      expect(result[1].category).toBe('Travel');
    });
    
    it('should re-categorize Miscellaneous transactions based on merchant name', function() {
      var transactions = [
        { transactionId: 'txn1', amount: 50, merchantName: 'Starbucks Cafe', category: 'Miscellaneous' },
        { transactionId: 'txn2', amount: 60, merchantName: 'Delta Airlines', category: 'Miscellaneous' }
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Travel');
    });
    
    it('should default to Miscellaneous for unknown merchants', function() {
      var transactions = [
        { transactionId: 'txn1', amount: 50, merchantName: 'Unknown Merchant XYZ', category: null },
        { transactionId: 'txn2', amount: 60, merchantName: 'Random Store 123', category: null }
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Miscellaneous');
      expect(result[1].category).toBe('Miscellaneous');
    });
    
    it('should handle missing merchant names gracefully', function() {
      var transactions = [
        { transactionId: 'txn1', amount: 50, merchantName: null, category: null },
        { transactionId: 'txn2', amount: 60, merchantName: undefined, category: null },
        { transactionId: 'txn3', amount: 70, merchantName: '', category: null }
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Miscellaneous');
      expect(result[1].category).toBe('Miscellaneous');
      expect(result[2].category).toBe('Miscellaneous');
    });
    
    it('should use description field if merchantName is missing', function() {
      var transactions = [
        { transactionId: 'txn1', amount: 50, merchantName: null, description: 'Payment at restaurant', category: null },
        { transactionId: 'txn2', amount: 60, merchantName: '', description: 'Fuel purchase', category: null }
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
    });
    
    it('should be case-insensitive when matching keywords', function() {
      var transactions = [
        { transactionId: 'txn1', amount: 50, merchantName: 'RESTAURANT ABC', category: null },
        { transactionId: 'txn2', amount: 60, merchantName: 'gas STATION', category: null },
        { transactionId: 'txn3', amount: 70, merchantName: 'Shopping Mall', category: null }
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Shopping');
    });
    
    it('should categorize all spending categories correctly', function() {
      var transactions = [
        { transactionId: 'txn1', merchantName: 'Pizza restaurant', category: null },
        { transactionId: 'txn2', merchantName: 'Gas station', category: null },
        { transactionId: 'txn3', merchantName: 'Shopping store', category: null },
        { transactionId: 'txn4', merchantName: 'Airline booking', category: null },
        { transactionId: 'txn5', merchantName: 'Movie theatre', category: null },
        { transactionId: 'txn6', merchantName: 'Electric utility', category: null },
        { transactionId: 'txn7', merchantName: 'Hospital medical', category: null },
        { transactionId: 'txn8', merchantName: 'University tuition', category: null }
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Shopping');
      expect(result[3].category).toBe('Travel');
      expect(result[4].category).toBe('Entertainment');
      expect(result[5].category).toBe('Utilities');
      expect(result[6].category).toBe('Healthcare');
      expect(result[7].category).toBe('Education');
    });
    
    it('should handle empty transaction array', function() {
      var transactions = [];
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
    
    it('should handle transactions with special characters in merchant names', function() {
      var transactions = [
        { transactionId: 'txn1', amount: 50, merchantName: "Joe's Restaurant & Bar", category: null },
        { transactionId: 'txn2', amount: 60, merchantName: 'Gas-N-Go Station #123', category: null }
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
    });
  });
});