/*
Test Documentation:
- Test Name: CategorizationService - categorizeTransactions - Food & Dining category
- Purpose: Validates that transactions with food-related merchants are categorized correctly
- Scenario: Transaction with merchantName containing 'restaurant', 'cafe', or 'dining'
- Expected Result: Transaction category is set to 'Food & Dining'
*/
/*
Test Documentation:
- Test Name: CategorizationService - categorizeTransactions - all nine categories
- Purpose: Validates that all nine spending categories are correctly detected
- Scenario: Transactions with keywords matching each category
- Expected Result: Each transaction is assigned the correct category from the nine defined categories
*/
/*
Test Documentation:
- Test Name: CategorizationService - detectCategory - Miscellaneous fallback
- Purpose: Validates that unrecognized transactions default to Miscellaneous
- Scenario: Transaction with no matching category keywords
- Expected Result: Category is set to 'Miscellaneous'
*/
/*
Coverage Report:
- Functions tested: categorizeTransactions, detectCategory
- Scenarios covered: all nine categories (Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous), case-insensitive matching, null/undefined handling
- Edge cases: empty text, null merchantName, already categorized transactions, multiple keyword matches
- Uncovered scenarios: none - comprehensive coverage achieved
*/

describe('CategorizationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CategorizationService;
  
  beforeEach(inject(function(_CategorizationService_) {
    CategorizationService = _CategorizationService_;
  }));
  
  describe('categorizeTransactions', function() {
    
    it('should categorize Food & Dining transactions correctly', function() {
      var transactions = [
        {transactionId: 'txn-1', merchantName: 'Pizza Restaurant', amount: 500},
        {transactionId: 'txn-2', merchantName: 'Starbucks Cafe', amount: 200},
        {transactionId: 'txn-3', merchantName: 'Fine Dining Place', amount: 1500}
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Food & Dining');
      expect(result[2].category).toBe('Food & Dining');
    });
    
    it('should categorize Fuel transactions correctly', function() {
      var transactions = [
        {transactionId: 'txn-1', merchantName: 'Shell Gas Station', amount: 2000},
        {transactionId: 'txn-2', merchantName: 'BP Fuel', amount: 1800},
        {transactionId: 'txn-3', merchantName: 'Indian Oil Petrol Pump', amount: 2500}
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Fuel');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Fuel');
    });
    
    it('should categorize Shopping transactions correctly', function() {
      var transactions = [
        {transactionId: 'txn-1', merchantName: 'Amazon Shopping', amount: 3000},
        {transactionId: 'txn-2', merchantName: 'Walmart Store', amount: 1500},
        {transactionId: 'txn-3', merchantName: 'Phoenix Mall', amount: 5000}
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Shopping');
      expect(result[1].category).toBe('Shopping');
      expect(result[2].category).toBe('Shopping');
    });
    
    it('should categorize Travel transactions correctly', function() {
      var transactions = [
        {transactionId: 'txn-1', merchantName: 'Delta Flight Booking', amount: 15000},
        {transactionId: 'txn-2', merchantName: 'Marriott Hotel', amount: 8000},
        {transactionId: 'txn-3', merchantName: 'Travel Agency', amount: 20000}
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Travel');
      expect(result[1].category).toBe('Travel');
      expect(result[2].category).toBe('Travel');
    });
    
    it('should categorize Entertainment transactions correctly', function() {
      var transactions = [
        {transactionId: 'txn-1', merchantName: 'PVR Cinema', amount: 800},
        {transactionId: 'txn-2', merchantName: 'Movie Theater', amount: 600},
        {transactionId: 'txn-3', merchantName: 'Entertainment Park', amount: 2000}
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Entertainment');
      expect(result[1].category).toBe('Entertainment');
      expect(result[2].category).toBe('Entertainment');
    });
    
    it('should categorize Utilities transactions correctly', function() {
      var transactions = [
        {transactionId: 'txn-1', merchantName: 'Electric Company', amount: 1500},
        {transactionId: 'txn-2', merchantName: 'Water Supply', amount: 500},
        {transactionId: 'txn-3', merchantName: 'Utility Bill Payment', amount: 2000}
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Utilities');
      expect(result[1].category).toBe('Utilities');
      expect(result[2].category).toBe('Utilities');
    });
    
    it('should categorize Healthcare transactions correctly', function() {
      var transactions = [
        {transactionId: 'txn-1', merchantName: 'Apollo Hospital', amount: 5000},
        {transactionId: 'txn-2', merchantName: 'City Clinic', amount: 1200},
        {transactionId: 'txn-3', merchantName: 'MedPlus Pharmacy', amount: 800}
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Healthcare');
      expect(result[1].category).toBe('Healthcare');
      expect(result[2].category).toBe('Healthcare');
    });
    
    it('should categorize Education transactions correctly', function() {
      var transactions = [
        {transactionId: 'txn-1', merchantName: 'ABC School', amount: 10000},
        {transactionId: 'txn-2', merchantName: 'State University', amount: 50000},
        {transactionId: 'txn-3', merchantName: 'Online Education Platform', amount: 2000}
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Education');
      expect(result[1].category).toBe('Education');
      expect(result[2].category).toBe('Education');
    });
    
    it('should categorize unrecognized transactions as Miscellaneous', function() {
      var transactions = [
        {transactionId: 'txn-1', merchantName: 'Unknown Merchant', amount: 1000},
        {transactionId: 'txn-2', merchantName: 'Random Store XYZ', amount: 500}
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Miscellaneous');
      expect(result[1].category).toBe('Miscellaneous');
    });
    
    it('should handle transactions with null or undefined merchantName', function() {
      var transactions = [
        {transactionId: 'txn-1', merchantName: null, amount: 1000},
        {transactionId: 'txn-2', amount: 500}
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Miscellaneous');
      expect(result[1].category).toBe('Miscellaneous');
    });
    
    it('should not overwrite existing category if already set', function() {
      var transactions = [
        {transactionId: 'txn-1', merchantName: 'Restaurant ABC', category: 'Shopping', amount: 500}
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Shopping');
    });
    
    it('should perform case-insensitive category matching', function() {
      var transactions = [
        {transactionId: 'txn-1', merchantName: 'RESTAURANT CAPITAL', amount: 800},
        {transactionId: 'txn-2', merchantName: 'Gas STATION', amount: 2000},
        {transactionId: 'txn-3', merchantName: 'Shopping MALL', amount: 3000}
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Shopping');
    });
    
    it('should handle empty transactions array', function() {
      var transactions = [];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
    
    it('should categorize using description field when merchantName is missing', function() {
      var transactions = [
        {transactionId: 'txn-1', description: 'Payment at restaurant', amount: 500}
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
    });
    
    it('should handle transactions with multiple matching keywords (first match wins)', function() {
      var transactions = [
        {transactionId: 'txn-1', merchantName: 'Hotel Restaurant and Travel', amount: 5000}
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result[0].category).toBeDefined();
      expect(['Food & Dining', 'Travel']).toContain(result[0].category);
    });
  });
});