/*
Test Documentation:
- Test Name: TransactionCategorizationService - categorize with existing category
- Purpose: Validates that transactions with existing category are not recategorized
- Scenario: Transaction has category field populated
- Expected Result: Returns existing category
*/
/*
Test Documentation:
- Test Name: TransactionCategorizationService - categorize by merchant code
- Purpose: Validates categorization based on merchant code mapping
- Scenario: Transaction has merchant code but no category
- Expected Result: Returns category based on merchant code
*/
/*
Test Documentation:
- Test Name: TransactionCategorizationService - categorize as Miscellaneous
- Purpose: Validates default categorization for unknown merchant codes
- Scenario: Transaction has unrecognized merchant code
- Expected Result: Returns 'Miscellaneous'
*/
/*
Coverage Report:
- Functions tested: categorize
- Scenarios covered: existing category, merchant code mapping, all 9 categories, miscellaneous fallback
- Uncovered scenarios: none
*/

describe('TransactionCategorizationService', function() {
  'use strict';
  
  beforeEach(module('creditCard.analytics'));
  
  var TransactionCategorizationService;
  
  beforeEach(inject(function(_TransactionCategorizationService_) {
    TransactionCategorizationService = _TransactionCategorizationService_;
  }));
  
  describe('categorize', function() {
    it('should return existing category if present', function() {
      var transaction = { merchantCode: '5812', category: 'Food & Dining' };
      var result = TransactionCategorizationService.categorize(transaction);
      expect(result).toBe('Food & Dining');
    });
    
    it('should categorize Food & Dining by merchant code 5812', function() {
      var transaction = { merchantCode: '5812' };
      var result = TransactionCategorizationService.categorize(transaction);
      expect(result).toBe('Food & Dining');
    });
    
    it('should categorize Food & Dining by merchant code 5814', function() {
      var transaction = { merchantCode: '5814' };
      var result = TransactionCategorizationService.categorize(transaction);
      expect(result).toBe('Food & Dining');
    });
    
    it('should categorize Fuel by merchant code 5541', function() {
      var transaction = { merchantCode: '5541' };
      var result = TransactionCategorizationService.categorize(transaction);
      expect(result).toBe('Fuel');
    });
    
    it('should categorize Shopping by merchant code 5311', function() {
      var transaction = { merchantCode: '5311' };
      var result = TransactionCategorizationService.categorize(transaction);
      expect(result).toBe('Shopping');
    });
    
    it('should categorize Travel by merchant code 4511', function() {
      var transaction = { merchantCode: '4511' };
      var result = TransactionCategorizationService.categorize(transaction);
      expect(result).toBe('Travel');
    });
    
    it('should categorize Entertainment by merchant code 7832', function() {
      var transaction = { merchantCode: '7832' };
      var result = TransactionCategorizationService.categorize(transaction);
      expect(result).toBe('Entertainment');
    });
    
    it('should categorize Utilities by merchant code 4900', function() {
      var transaction = { merchantCode: '4900' };
      var result = TransactionCategorizationService.categorize(transaction);
      expect(result).toBe('Utilities');
    });
    
    it('should categorize Healthcare by merchant code 8011', function() {
      var transaction = { merchantCode: '8011' };
      var result = TransactionCategorizationService.categorize(transaction);
      expect(result).toBe('Healthcare');
    });
    
    it('should categorize Education by merchant code 8211', function() {
      var transaction = { merchantCode: '8211' };
      var result = TransactionCategorizationService.categorize(transaction);
      expect(result).toBe('Education');
    });
    
    it('should categorize as Miscellaneous for unknown merchant code', function() {
      var transaction = { merchantCode: '9999' };
      var result = TransactionCategorizationService.categorize(transaction);
      expect(result).toBe('Miscellaneous');
    });
    
    it('should categorize as Miscellaneous when no merchant code', function() {
      var transaction = {};
      var result = TransactionCategorizationService.categorize(transaction);
      expect(result).toBe('Miscellaneous');
    });
  });
});