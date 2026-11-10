/*
Test Documentation:
- Test Name: CategoryClassificationService Test Suite
- Purpose: Validate transaction categorization logic and category retrieval
- Scenario: Tests categorization of transactions based on merchant names and retrieval of predefined categories
- Expected Result: Transactions are correctly categorized into 9 predefined categories; getCategories returns all category names
*/

(function() {
'use strict';

describe('CategoryClassificationService', function() {
  var CategoryClassificationService;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CategoryClassificationService_) {
    CategoryClassificationService = _CategoryClassificationService_;
  }));

  describe('getCategories', function() {
    /*
    Test Documentation:
    - Test Name: should return all 9 predefined categories
    - Purpose: Verify that the service returns the complete list of spending categories
    - Scenario: Call getCategories method
    - Expected Result: Returns array with 9 category names
    */
    it('should return all 9 predefined categories', function() {
      var categories = CategoryClassificationService.getCategories();
      expect(categories).toBeDefined();
      expect(categories.length).toBe(9);
      expect(categories).toContain('Food & Dining');
      expect(categories).toContain('Fuel');
      expect(categories).toContain('Shopping');
      expect(categories).toContain('Travel');
      expect(categories).toContain('Entertainment');
      expect(categories).toContain('Utilities');
      expect(categories).toContain('Healthcare');
      expect(categories).toContain('Education');
      expect(categories).toContain('Miscellaneous');
    });
  });

  describe('categorizeTransactions', function() {
    /*
    Test Documentation:
    - Test Name: should categorize restaurant transaction as Food & Dining
    - Purpose: Verify correct categorization for food-related merchants
    - Scenario: Transaction with merchantName containing 'restaurant'
    - Expected Result: Transaction category set to 'Food & Dining'
    */
    it('should categorize restaurant transaction as Food & Dining', function() {
      var transactions = [{ merchantName: 'McDonald Restaurant', amount: 25.50 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Food & Dining');
    });

    /*
    Test Documentation:
    - Test Name: should categorize cafe transaction as Food & Dining
    - Purpose: Verify correct categorization for cafe merchants
    - Scenario: Transaction with merchantName containing 'cafe'
    - Expected Result: Transaction category set to 'Food & Dining'
    */
    it('should categorize cafe transaction as Food & Dining', function() {
      var transactions = [{ merchantName: 'Starbucks Cafe', amount: 5.75 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Food & Dining');
    });

    /*
    Test Documentation:
    - Test Name: should categorize gas station as Fuel
    - Purpose: Verify correct categorization for fuel merchants
    - Scenario: Transaction with merchantName containing 'gas'
    - Expected Result: Transaction category set to 'Fuel'
    */
    it('should categorize gas station as Fuel', function() {
      var transactions = [{ merchantName: 'Shell Gas Station', amount: 45.00 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Fuel');
    });

    /*
    Test Documentation:
    - Test Name: should categorize petrol pump as Fuel
    - Purpose: Verify correct categorization for petrol merchants
    - Scenario: Transaction with merchantName containing 'petrol'
    - Expected Result: Transaction category set to 'Fuel'
    */
    it('should categorize petrol pump as Fuel', function() {
      var transactions = [{ merchantName: 'BP Petrol', amount: 50.00 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Fuel');
    });

    /*
    Test Documentation:
    - Test Name: should categorize shopping mall as Shopping
    - Purpose: Verify correct categorization for shopping merchants
    - Scenario: Transaction with merchantName containing 'mall'
    - Expected Result: Transaction category set to 'Shopping'
    */
    it('should categorize shopping mall as Shopping', function() {
      var transactions = [{ merchantName: 'Westfield Mall', amount: 120.00 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Shopping');
    });

    /*
    Test Documentation:
    - Test Name: should categorize airline as Travel
    - Purpose: Verify correct categorization for travel merchants
    - Scenario: Transaction with merchantName containing 'airline'
    - Expected Result: Transaction category set to 'Travel'
    */
    it('should categorize airline as Travel', function() {
      var transactions = [{ merchantName: 'United Airlines', amount: 350.00 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Travel');
    });

    /*
    Test Documentation:
    - Test Name: should categorize hotel as Travel
    - Purpose: Verify correct categorization for hotel merchants
    - Scenario: Transaction with merchantName containing 'hotel'
    - Expected Result: Transaction category set to 'Travel'
    */
    it('should categorize hotel as Travel', function() {
      var transactions = [{ merchantName: 'Hilton Hotel', amount: 200.00 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Travel');
    });

    /*
    Test Documentation:
    - Test Name: should categorize movie theater as Entertainment
    - Purpose: Verify correct categorization for entertainment merchants
    - Scenario: Transaction with merchantName containing 'movie'
    - Expected Result: Transaction category set to 'Entertainment'
    */
    it('should categorize movie theater as Entertainment', function() {
      var transactions = [{ merchantName: 'AMC Movie Theater', amount: 30.00 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Entertainment');
    });

    /*
    Test Documentation:
    - Test Name: should categorize electric utility as Utilities
    - Purpose: Verify correct categorization for utility merchants
    - Scenario: Transaction with merchantName containing 'electric'
    - Expected Result: Transaction category set to 'Utilities'
    */
    it('should categorize electric utility as Utilities', function() {
      var transactions = [{ merchantName: 'City Electric Company', amount: 85.00 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Utilities');
    });

    /*
    Test Documentation:
    - Test Name: should categorize hospital as Healthcare
    - Purpose: Verify correct categorization for healthcare merchants
    - Scenario: Transaction with merchantName containing 'hospital'
    - Expected Result: Transaction category set to 'Healthcare'
    */
    it('should categorize hospital as Healthcare', function() {
      var transactions = [{ merchantName: 'General Hospital', amount: 150.00 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Healthcare');
    });

    /*
    Test Documentation:
    - Test Name: should categorize pharmacy as Healthcare
    - Purpose: Verify correct categorization for pharmacy merchants
    - Scenario: Transaction with merchantName containing 'pharmacy'
    - Expected Result: Transaction category set to 'Healthcare'
    */
    it('should categorize pharmacy as Healthcare', function() {
      var transactions = [{ merchantName: 'CVS Pharmacy', amount: 25.00 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Healthcare');
    });

    /*
    Test Documentation:
    - Test Name: should categorize university as Education
    - Purpose: Verify correct categorization for education merchants
    - Scenario: Transaction with merchantName containing 'university'
    - Expected Result: Transaction category set to 'Education'
    */
    it('should categorize university as Education', function() {
      var transactions = [{ merchantName: 'State University', amount: 500.00 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Education');
    });

    /*
    Test Documentation:
    - Test Name: should categorize unknown merchant as Miscellaneous
    - Purpose: Verify default categorization for unrecognized merchants
    - Scenario: Transaction with merchantName not matching any category keywords
    - Expected Result: Transaction category set to 'Miscellaneous'
    */
    it('should categorize unknown merchant as Miscellaneous', function() {
      var transactions = [{ merchantName: 'Random Vendor XYZ', amount: 75.00 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Miscellaneous');
    });

    /*
    Test Documentation:
    - Test Name: should preserve existing valid category
    - Purpose: Verify that transactions with valid categories are not re-categorized
    - Scenario: Transaction already has a valid category
    - Expected Result: Original category is preserved
    */
    it('should preserve existing valid category', function() {
      var transactions = [{ merchantName: 'Some Store', amount: 50.00, category: 'Shopping' }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Shopping');
    });

    /*
    Test Documentation:
    - Test Name: should re-categorize transaction with invalid category
    - Purpose: Verify that transactions with invalid categories are re-categorized
    - Scenario: Transaction has category not in predefined list
    - Expected Result: Transaction is re-categorized based on merchant name
    */
    it('should re-categorize transaction with invalid category', function() {
      var transactions = [{ merchantName: 'Shell Gas', amount: 40.00, category: 'InvalidCategory' }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Fuel');
    });

    /*
    Test Documentation:
    - Test Name: should handle transaction with missing merchantName
    - Purpose: Verify graceful handling of transactions without merchant names
    - Scenario: Transaction object has no merchantName property
    - Expected Result: Transaction categorized as Miscellaneous
    */
    it('should handle transaction with missing merchantName', function() {
      var transactions = [{ amount: 100.00 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Miscellaneous');
    });

    /*
    Test Documentation:
    - Test Name: should handle empty merchantName
    - Purpose: Verify handling of transactions with empty merchant names
    - Scenario: Transaction has merchantName as empty string
    - Expected Result: Transaction categorized as Miscellaneous
    */
    it('should handle empty merchantName', function() {
      var transactions = [{ merchantName: '', amount: 50.00 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Miscellaneous');
    });

    /*
    Test Documentation:
    - Test Name: should handle case-insensitive merchant names
    - Purpose: Verify categorization works regardless of case
    - Scenario: Transaction with uppercase merchantName
    - Expected Result: Correct categorization despite case differences
    */
    it('should handle case-insensitive merchant names', function() {
      var transactions = [{ merchantName: 'RESTAURANT CAPITAL GRILLE', amount: 80.00 }];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Food & Dining');
    });

    /*
    Test Documentation:
    - Test Name: should categorize multiple transactions correctly
    - Purpose: Verify batch categorization of multiple transactions
    - Scenario: Array with multiple transactions of different categories
    - Expected Result: All transactions correctly categorized
    */
    it('should categorize multiple transactions correctly', function() {
      var transactions = [
        { merchantName: 'Restaurant ABC', amount: 30.00 },
        { merchantName: 'Gas Station', amount: 40.00 },
        { merchantName: 'Shopping Store', amount: 100.00 },
        { merchantName: 'Unknown Vendor', amount: 20.00 }
      ];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Shopping');
      expect(result[3].category).toBe('Miscellaneous');
    });

    /*
    Test Documentation:
    - Test Name: should handle empty transaction array
    - Purpose: Verify handling of empty input
    - Scenario: Empty array passed to categorizeTransactions
    - Expected Result: Returns empty array without errors
    */
    it('should handle empty transaction array', function() {
      var transactions = [];
      var result = CategoryClassificationService.categorizeTransactions(transactions);
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });
  });
});

/*
Coverage Report:
- Functions tested: categorizeTransactions, getCategories
- Scenarios covered:
  * All 9 category classifications (Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous)
  * Valid category preservation
  * Invalid category re-categorization
  * Missing/empty merchant names
  * Case-insensitive matching
  * Multiple transaction batch processing
  * Empty array handling
- Uncovered scenarios: None - comprehensive coverage achieved
*/
})();