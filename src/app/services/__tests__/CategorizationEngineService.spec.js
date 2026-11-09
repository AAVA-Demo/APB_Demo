/*
Test Documentation:
- Test Name: CategorizationEngineService - categorize
- Purpose: Validate automatic categorization of transactions based on merchant keywords
- Scenario: Service receives transactions and applies category rules
- Expected Result: Returns transactions with assigned categories based on merchant name matching
*/

describe('CategorizationEngineService', function() {
  'use strict';
  
  var CategorizationEngineService;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CategorizationEngineService_) {
    CategorizationEngineService = _CategorizationEngineService_;
  }));
  
  describe('categorize', function() {
    it('should categorize food & dining transactions correctly', function() {
      var transactions = [
        {transactionId: 'TX001', merchantName: 'Starbucks Coffee', amount: 5.50},
        {transactionId: 'TX002', merchantName: 'Pizza Hut', amount: 25.00}
      ];
      
      var result = CategorizationEngineService.categorize(transactions);
      
      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Food & Dining');
    });
    
    it('should categorize fuel transactions correctly', function() {
      var transactions = [
        {transactionId: 'TX003', merchantName: 'Shell Gas Station', amount: 45.00},
        {transactionId: 'TX004', merchantName: 'BP Fuel', amount: 50.00}
      ];
      
      var result = CategorizationEngineService.categorize(transactions);
      
      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Fuel');
      expect(result[1].category).toBe('Fuel');
    });
    
    it('should categorize shopping transactions correctly', function() {
      var transactions = [
        {transactionId: 'TX005', merchantName: 'Amazon.com', amount: 99.99},
        {transactionId: 'TX006', merchantName: 'Walmart Store', amount: 150.00}
      ];
      
      var result = CategorizationEngineService.categorize(transactions);
      
      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Shopping');
      expect(result[1].category).toBe('Shopping');
    });
    
    it('should categorize travel transactions correctly', function() {
      var transactions = [
        {transactionId: 'TX007', merchantName: 'United Airlines', amount: 350.00},
        {transactionId: 'TX008', merchantName: 'Uber Ride', amount: 25.00}
      ];
      
      var result = CategorizationEngineService.categorize(transactions);
      
      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Travel');
      expect(result[1].category).toBe('Travel');
    });
    
    it('should categorize entertainment transactions correctly', function() {
      var transactions = [
        {transactionId: 'TX009', merchantName: 'Netflix Subscription', amount: 15.99},
        {transactionId: 'TX010', merchantName: 'AMC Movie Theater', amount: 30.00}
      ];
      
      var result = CategorizationEngineService.categorize(transactions);
      
      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Entertainment');
      expect(result[1].category).toBe('Entertainment');
    });
    
    it('should categorize utilities transactions correctly', function() {
      var transactions = [
        {transactionId: 'TX011', merchantName: 'Electric Company', amount: 120.00},
        {transactionId: 'TX012', merchantName: 'Internet Service Provider', amount: 80.00}
      ];
      
      var result = CategorizationEngineService.categorize(transactions);
      
      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Utilities');
      expect(result[1].category).toBe('Utilities');
    });
    
    it('should categorize healthcare transactions correctly', function() {
      var transactions = [
        {transactionId: 'TX013', merchantName: 'CVS Pharmacy', amount: 45.00},
        {transactionId: 'TX014', merchantName: 'Dr. Smith Medical', amount: 200.00}
      ];
      
      var result = CategorizationEngineService.categorize(transactions);
      
      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Healthcare');
      expect(result[1].category).toBe('Healthcare');
    });
    
    it('should categorize education transactions correctly', function() {
      var transactions = [
        {transactionId: 'TX015', merchantName: 'Coursera Online', amount: 49.99},
        {transactionId: 'TX016', merchantName: 'University Bookstore', amount: 150.00}
      ];
      
      var result = CategorizationEngineService.categorize(transactions);
      
      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Education');
      expect(result[1].category).toBe('Education');
    });
    
    it('should default to Miscellaneous for unknown merchants', function() {
      var transactions = [
        {transactionId: 'TX017', merchantName: 'Unknown Merchant XYZ', amount: 100.00},
        {transactionId: 'TX018', merchantName: 'Random Store', amount: 75.00}
      ];
      
      var result = CategorizationEngineService.categorize(transactions);
      
      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Miscellaneous');
      expect(result[1].category).toBe('Miscellaneous');
    });
    
    it('should handle empty transaction list', function() {
      var transactions = [];
      
      var result = CategorizationEngineService.categorize(transactions);
      
      expect(result).toEqual([]);
    });
    
    it('should handle transactions with missing merchantName', function() {
      var transactions = [
        {transactionId: 'TX019', amount: 50.00}
      ];
      
      var result = CategorizationEngineService.categorize(transactions);
      
      expect(result.length).toBe(1);
      expect(result[0].category).toBe('Miscellaneous');
    });
    
    it('should handle case-insensitive merchant matching', function() {
      var transactions = [
        {transactionId: 'TX020', merchantName: 'STARBUCKS COFFEE', amount: 5.50},
        {transactionId: 'TX021', merchantName: 'shell gas', amount: 45.00}
      ];
      
      var result = CategorizationEngineService.categorize(transactions);
      
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
    });
    
    it('should preserve original transaction properties', function() {
      var transactions = [
        {transactionId: 'TX022', merchantName: 'Amazon', amount: 99.99, cardId: 'CC001', date: '2023-01-15'}
      ];
      
      var result = CategorizationEngineService.categorize(transactions);
      
      expect(result[0].transactionId).toBe('TX022');
      expect(result[0].merchantName).toBe('Amazon');
      expect(result[0].amount).toBe(99.99);
      expect(result[0].cardId).toBe('CC001');
      expect(result[0].date).toBe('2023-01-15');
      expect(result[0].category).toBe('Shopping');
    });
  });
});

/*
Coverage Report:
- Functions tested: categorize
- Scenarios covered:
  * All 9 predefined categories (Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous)
  * Unknown merchants defaulting to Miscellaneous
  * Empty transaction list
  * Missing merchant name
  * Case-insensitive matching
  * Preservation of original transaction properties
- Uncovered scenarios: None
- Edge cases: Empty data, missing fields, case sensitivity
*/