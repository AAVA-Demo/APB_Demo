/*
Test Documentation:
- Test Name: CategoryClassifier - categorize - classifies transactions into correct categories
- Purpose: Validates that the service correctly categorizes transactions based on merchant names
- Scenario: Transactions with various merchant names are provided
- Expected Result: Each transaction is assigned the appropriate category
*/
/*
Test Documentation:
- Test Name: CategoryClassifier - categorize - assigns Miscellaneous to unrecognized merchants
- Purpose: Validates that transactions with unrecognized merchants default to Miscellaneous category
- Scenario: Transaction with merchant name not matching any rules
- Expected Result: Transaction is categorized as Miscellaneous
*/
/*
Test Documentation:
- Test Name: CategoryClassifier - categorize - handles empty merchant names
- Purpose: Validates that service handles missing or empty merchant names gracefully
- Scenario: Transaction with null or empty merchant field
- Expected Result: Transaction is categorized as Miscellaneous
*/
/*
Coverage Report:
- Functions tested: categorize
- Scenarios covered: all 9 categories, keyword matching, case insensitivity, empty merchants, miscellaneous fallback
- Uncovered scenarios: none
*/

describe('CategoryClassifier', function() {
  'use strict';
  
  var CategoryClassifier;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CategoryClassifier_) {
    CategoryClassifier = _CategoryClassifier_;
  }));
  
  describe('categorize', function() {
    
    it('should categorize restaurant transaction as Food & Dining', function() {
      var transactions = [{merchant: 'Italian Restaurant', amount: 50}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
    });
    
    it('should categorize cafe transaction as Food & Dining', function() {
      var transactions = [{merchant: 'Starbucks Cafe', amount: 10}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
    });
    
    it('should categorize gas station transaction as Fuel', function() {
      var transactions = [{merchant: 'Shell Gas Station', amount: 60}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Fuel');
    });
    
    it('should categorize petrol transaction as Fuel', function() {
      var transactions = [{merchant: 'BP Petrol', amount: 55}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Fuel');
    });
    
    it('should categorize Amazon transaction as Shopping', function() {
      var transactions = [{merchant: 'Amazon.com', amount: 120}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Shopping');
    });
    
    it('should categorize Walmart transaction as Shopping', function() {
      var transactions = [{merchant: 'Walmart Store', amount: 85}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Shopping');
    });
    
    it('should categorize airline transaction as Travel', function() {
      var transactions = [{merchant: 'United Airlines', amount: 450}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Travel');
    });
    
    it('should categorize hotel transaction as Travel', function() {
      var transactions = [{merchant: 'Marriott Hotel', amount: 200}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Travel');
    });
    
    it('should categorize Uber transaction as Travel', function() {
      var transactions = [{merchant: 'Uber Trip', amount: 25}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Travel');
    });
    
    it('should categorize movie transaction as Entertainment', function() {
      var transactions = [{merchant: 'AMC Movie Theater', amount: 30}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Entertainment');
    });
    
    it('should categorize Netflix transaction as Entertainment', function() {
      var transactions = [{merchant: 'Netflix Subscription', amount: 15}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Entertainment');
    });
    
    it('should categorize electric utility transaction as Utilities', function() {
      var transactions = [{merchant: 'Electric Company', amount: 120}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Utilities');
    });
    
    it('should categorize internet transaction as Utilities', function() {
      var transactions = [{merchant: 'Comcast Internet', amount: 80}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Utilities');
    });
    
    it('should categorize hospital transaction as Healthcare', function() {
      var transactions = [{merchant: 'City Hospital', amount: 500}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Healthcare');
    });
    
    it('should categorize pharmacy transaction as Healthcare', function() {
      var transactions = [{merchant: 'CVS Pharmacy', amount: 35}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Healthcare');
    });
    
    it('should categorize university transaction as Education', function() {
      var transactions = [{merchant: 'State University', amount: 2000}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Education');
    });
    
    it('should categorize course transaction as Education', function() {
      var transactions = [{merchant: 'Online Course Platform', amount: 99}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Education');
    });
    
    it('should categorize unrecognized merchant as Miscellaneous', function() {
      var transactions = [{merchant: 'Unknown Merchant', amount: 75}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Miscellaneous');
    });
    
    it('should handle empty merchant name by categorizing as Miscellaneous', function() {
      var transactions = [{merchant: '', amount: 50}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Miscellaneous');
    });
    
    it('should handle null merchant name by categorizing as Miscellaneous', function() {
      var transactions = [{merchant: null, amount: 50}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Miscellaneous');
    });
    
    it('should be case insensitive when matching keywords', function() {
      var transactions = [
        {merchant: 'RESTAURANT ABC', amount: 50},
        {merchant: 'Gas Station', amount: 60}
      ];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
    });
    
    it('should categorize multiple transactions correctly', function() {
      var transactions = [
        {merchant: 'Pizza Hut', amount: 30},
        {merchant: 'Shell Gas', amount: 50},
        {merchant: 'Target Store', amount: 100},
        {merchant: 'Delta Airlines', amount: 400}
      ];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Shopping');
      expect(result[3].category).toBe('Travel');
    });
    
    it('should preserve original transaction properties', function() {
      var transactions = [{merchant: 'Restaurant', amount: 50, transactionId: 'txn123'}];
      
      var result = CategoryClassifier.categorize(transactions);
      
      expect(result[0].merchant).toBe('Restaurant');
      expect(result[0].amount).toBe(50);
      expect(result[0].transactionId).toBe('txn123');
      expect(result[0].category).toBe('Food & Dining');
    });
  });
});