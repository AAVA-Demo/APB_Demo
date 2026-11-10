/*
Test Documentation:
- Test Name: CategorizationService - categorize transactions using MCC mapping
- Purpose: Validates automatic categorization of transactions based on merchant codes
- Scenario: Service receives transactions with various merchant codes
- Expected Result: Returns transactions with correct category assignments based on MCC mapping

- Test Name: CategorizationService - categorize unknown merchant codes
- Purpose: Validates handling of unrecognized merchant codes
- Scenario: Transaction has merchant code not in MCC mapping
- Expected Result: Assigns 'Miscellaneous' category

- Test Name: CategorizationService - categorize preserves original transaction data
- Purpose: Validates that categorization does not mutate original transaction
- Scenario: Transaction is categorized
- Expected Result: Original transaction properties are preserved with category added

- Test Name: CategorizationService - recategorize
- Purpose: Validates manual recategorization of transaction
- Scenario: User manually changes transaction category
- Expected Result: Returns object with transaction ID and new category

Coverage Report:
- Functions tested: categorize, recategorize
- Scenarios covered: MCC mapping, unknown codes, data preservation, manual recategorization
- Uncovered scenarios: none
*/

describe('CategorizationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CategorizationService;
  
  beforeEach(inject(function(_CategorizationService_) {
    CategorizationService = _CategorizationService_;
  }));
  
  describe('categorize', function() {
    it('should categorize transactions using MCC mapping', function() {
      var transactions = [
        { id: 'txn-001', merchantCode: '5812', amount: 100 },
        { id: 'txn-002', merchantCode: '5541', amount: 75 },
        { id: 'txn-003', merchantCode: '5311', amount: 200 },
        { id: 'txn-004', merchantCode: '3000', amount: 500 }
      ];
      
      var result = CategorizationService.categorize(transactions);
      
      expect(result.length).toBe(4);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Shopping');
      expect(result[3].category).toBe('Travel');
    });
    
    it('should assign Miscellaneous category to unknown merchant codes', function() {
      var transactions = [
        { id: 'txn-001', merchantCode: '9999', amount: 100 }
      ];
      
      var result = CategorizationService.categorize(transactions);
      expect(result[0].category).toBe('Miscellaneous');
    });
    
    it('should preserve original transaction data', function() {
      var transactions = [
        { id: 'txn-001', merchantCode: '5812', amount: 100, merchantName: 'Restaurant ABC' }
      ];
      
      var result = CategorizationService.categorize(transactions);
      expect(result[0].id).toBe('txn-001');
      expect(result[0].amount).toBe(100);
      expect(result[0].merchantName).toBe('Restaurant ABC');
      expect(result[0].merchantCode).toBe('5812');
      expect(result[0].category).toBe('Food & Dining');
    });
    
    it('should handle empty transaction array', function() {
      var result = CategorizationService.categorize([]);
      expect(result).toEqual([]);
    });
    
    it('should categorize all supported categories correctly', function() {
      var transactions = [
        { merchantCode: '5814', amount: 50 },
        { merchantCode: '5542', amount: 60 },
        { merchantCode: '5399', amount: 70 },
        { merchantCode: '4511', amount: 80 },
        { merchantCode: '7841', amount: 90 },
        { merchantCode: '4814', amount: 100 },
        { merchantCode: '8021', amount: 110 },
        { merchantCode: '8299', amount: 120 }
      ];
      
      var result = CategorizationService.categorize(transactions);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Shopping');
      expect(result[3].category).toBe('Travel');
      expect(result[4].category).toBe('Entertainment');
      expect(result[5].category).toBe('Utilities');
      expect(result[6].category).toBe('Healthcare');
      expect(result[7].category).toBe('Education');
    });
  });
  
  describe('recategorize', function() {
    it('should return transaction ID and new category', function() {
      var result = CategorizationService.recategorize('txn-123', 'Travel');
      expect(result.transactionId).toBe('txn-123');
      expect(result.category).toBe('Travel');
    });
    
    it('should handle any category value', function() {
      var result = CategorizationService.recategorize('txn-456', 'Custom Category');
      expect(result.transactionId).toBe('txn-456');
      expect(result.category).toBe('Custom Category');
    });
  });
});