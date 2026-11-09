/*
Test Documentation:
- Test Name: categorizationService - categorizeTransactions
- Purpose: Validates automatic transaction categorization
- Scenario: Service categorizes transactions based on merchant/description keywords
- Expected Result: Transactions are assigned correct categories based on keyword matching
*/
/*
Test Documentation:
- Test Name: categorizationService - category detection
- Purpose: Validates keyword-based category detection
- Scenario: Service detects categories from merchant names
- Expected Result: Correct category assigned for each keyword pattern
*/
/*
Coverage Report:
- Functions tested: categorizeTransactions
- Scenarios covered: all 9 categories, existing categories, missing categories, miscellaneous fallback
- Uncovered scenarios: none
*/

describe('categorizationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var categorizationService;
  
  beforeEach(inject(function(_categorizationService_) {
    categorizationService = _categorizationService_;
  }));
  
  describe('categorizeTransactions', function() {
    it('should preserve existing categories', function() {
      var transactions = [
        {transactionId: 'txn1', merchant: 'Test Store', category: 'Shopping', amount: 100}
      ];
      
      var result = categorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Shopping');
    });
    
    it('should categorize Food & Dining transactions', function() {
      var transactions = [
        {transactionId: 'txn1', merchant: 'Restaurant ABC', category: '', amount: 50},
        {transactionId: 'txn2', merchant: 'Cafe XYZ', category: '', amount: 20}
      ];
      
      var result = categorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Food & Dining');
    });
    
    it('should categorize Fuel transactions', function() {
      var transactions = [
        {transactionId: 'txn1', merchant: 'Gas Station', category: '', amount: 60}
      ];
      
      var result = categorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Fuel');
    });
    
    it('should categorize Shopping transactions', function() {
      var transactions = [
        {transactionId: 'txn1', merchant: 'Amazon Store', category: '', amount: 100}
      ];
      
      var result = categorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Shopping');
    });
    
    it('should categorize Travel transactions', function() {
      var transactions = [
        {transactionId: 'txn1', merchant: 'Airline Booking', category: '', amount: 500},
        {transactionId: 'txn2', merchant: 'Hotel Stay', category: '', amount: 200}
      ];
      
      var result = categorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Travel');
      expect(result[1].category).toBe('Travel');
    });
    
    it('should categorize Entertainment transactions', function() {
      var transactions = [
        {transactionId: 'txn1', merchant: 'Movie Theater', category: '', amount: 30},
        {transactionId: 'txn2', merchant: 'Netflix Subscription', category: '', amount: 15}
      ];
      
      var result = categorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Entertainment');
      expect(result[1].category).toBe('Entertainment');
    });
    
    it('should categorize Utilities transactions', function() {
      var transactions = [
        {transactionId: 'txn1', merchant: 'Electric Company', category: '', amount: 80}
      ];
      
      var result = categorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Utilities');
    });
    
    it('should categorize Healthcare transactions', function() {
      var transactions = [
        {transactionId: 'txn1', merchant: 'Hospital Visit', category: '', amount: 150},
        {transactionId: 'txn2', merchant: 'Pharmacy Store', category: '', amount: 40}
      ];
      
      var result = categorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Healthcare');
      expect(result[1].category).toBe('Healthcare');
    });
    
    it('should categorize Education transactions', function() {
      var transactions = [
        {transactionId: 'txn1', merchant: 'University Tuition', category: '', amount: 5000},
        {transactionId: 'txn2', merchant: 'Book Store', category: '', amount: 75}
      ];
      
      var result = categorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Education');
      expect(result[1].category).toBe('Education');
    });
    
    it('should categorize as Miscellaneous when no match found', function() {
      var transactions = [
        {transactionId: 'txn1', merchant: 'Unknown Merchant', category: '', amount: 50}
      ];
      
      var result = categorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Miscellaneous');
    });
    
    it('should use description when merchant is missing', function() {
      var transactions = [
        {transactionId: 'txn1', description: 'restaurant payment', category: '', amount: 50}
      ];
      
      var result = categorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
    });
    
    it('should handle case-insensitive matching', function() {
      var transactions = [
        {transactionId: 'txn1', merchant: 'RESTAURANT ABC', category: '', amount: 50},
        {transactionId: 'txn2', merchant: 'gas station', category: '', amount: 60}
      ];
      
      var result = categorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
    });
  });
});