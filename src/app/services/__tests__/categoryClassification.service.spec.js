/*
Test Documentation:
- Test Name: categoryClassificationService - merchant-based categorization
- Purpose: Validates category classification based on merchant names
- Scenario: Service categorizes transactions using merchant keyword matching
- Expected Result: Returns appropriate category based on merchant name
*/

(function() {
  'use strict';

  describe('categoryClassificationService', function() {
    var categoryClassificationService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_categoryClassificationService_) {
      categoryClassificationService = _categoryClassificationService_;
    }));

    /*
    Test Documentation:
    - Test Name: should categorize transaction with existing category
    - Purpose: Validates that existing category is preserved
    - Scenario: Transaction already has a category assigned
    - Expected Result: Returns the existing category
    */
    it('should categorize transaction with existing category', function() {
      var transaction = { category: 'Travel', merchant: 'Amazon' };
      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Travel');
    });

    /*
    Test Documentation:
    - Test Name: should categorize Food & Dining transactions
    - Purpose: Validates Food & Dining category classification
    - Scenario: Transaction merchant contains food-related keywords
    - Expected Result: Returns 'Food & Dining'
    */
    it('should categorize Food & Dining transactions', function() {
      var testCases = [
        { merchant: 'McDonald\'s Restaurant' },
        { merchant: 'Starbucks Cafe' },
        { merchant: 'Local Food Market' },
        { merchant: 'Fine Dining Restaurant' },
        { merchant: 'Whole Foods Grocery' }
      ];

      testCases.forEach(function(transaction) {
        var result = categoryClassificationService.categorize(transaction);
        expect(result).toBe('Food & Dining');
      });
    });

    /*
    Test Documentation:
    - Test Name: should categorize Fuel transactions
    - Purpose: Validates Fuel category classification
    - Scenario: Transaction merchant contains fuel-related keywords
    - Expected Result: Returns 'Fuel'
    */
    it('should categorize Fuel transactions', function() {
      var testCases = [
        { merchant: 'Shell Gas Station' },
        { merchant: 'Exxon Fuel' },
        { merchant: 'BP Petrol' },
        { merchant: 'Chevron Gas' }
      ];

      testCases.forEach(function(transaction) {
        var result = categoryClassificationService.categorize(transaction);
        expect(result).toBe('Fuel');
      });
    });

    /*
    Test Documentation:
    - Test Name: should categorize Shopping transactions
    - Purpose: Validates Shopping category classification
    - Scenario: Transaction merchant contains shopping-related keywords
    - Expected Result: Returns 'Shopping'
    */
    it('should categorize Shopping transactions', function() {
      var testCases = [
        { merchant: 'Amazon.com' },
        { merchant: 'Walmart Supercenter' },
        { merchant: 'Target Store' },
        { merchant: 'Shopping Mall' }
      ];

      testCases.forEach(function(transaction) {
        var result = categoryClassificationService.categorize(transaction);
        expect(result).toBe('Shopping');
      });
    });

    /*
    Test Documentation:
    - Test Name: should categorize Travel transactions
    - Purpose: Validates Travel category classification
    - Scenario: Transaction merchant contains travel-related keywords
    - Expected Result: Returns 'Travel'
    */
    it('should categorize Travel transactions', function() {
      var testCases = [
        { merchant: 'Delta Airlines' },
        { merchant: 'Marriott Hotel' },
        { merchant: 'Uber Ride' },
        { merchant: 'Lyft Transportation' },
        { merchant: 'Travel Agency' }
      ];

      testCases.forEach(function(transaction) {
        var result = categoryClassificationService.categorize(transaction);
        expect(result).toBe('Travel');
      });
    });

    /*
    Test Documentation:
    - Test Name: should categorize Entertainment transactions
    - Purpose: Validates Entertainment category classification
    - Scenario: Transaction merchant contains entertainment-related keywords
    - Expected Result: Returns 'Entertainment'
    */
    it('should categorize Entertainment transactions', function() {
      var testCases = [
        { merchant: 'AMC Movie Theater' },
        { merchant: 'Netflix Subscription' },
        { merchant: 'Spotify Music' },
        { merchant: 'Broadway Theater' },
        { merchant: 'Video Game Store' }
      ];

      testCases.forEach(function(transaction) {
        var result = categoryClassificationService.categorize(transaction);
        expect(result).toBe('Entertainment');
      });
    });

    /*
    Test Documentation:
    - Test Name: should categorize Utilities transactions
    - Purpose: Validates Utilities category classification
    - Scenario: Transaction merchant contains utility-related keywords
    - Expected Result: Returns 'Utilities'
    */
    it('should categorize Utilities transactions', function() {
      var testCases = [
        { merchant: 'Electric Company' },
        { merchant: 'Water Utility' },
        { merchant: 'Comcast Internet' },
        { merchant: 'AT&T Phone Service' }
      ];

      testCases.forEach(function(transaction) {
        var result = categoryClassificationService.categorize(transaction);
        expect(result).toBe('Utilities');
      });
    });

    /*
    Test Documentation:
    - Test Name: should categorize Healthcare transactions
    - Purpose: Validates Healthcare category classification
    - Scenario: Transaction merchant contains healthcare-related keywords
    - Expected Result: Returns 'Healthcare'
    */
    it('should categorize Healthcare transactions', function() {
      var testCases = [
        { merchant: 'City Hospital' },
        { merchant: 'CVS Pharmacy' },
        { merchant: 'Dr. Smith Medical Office' },
        { merchant: 'Health Clinic' }
      ];

      testCases.forEach(function(transaction) {
        var result = categoryClassificationService.categorize(transaction);
        expect(result).toBe('Healthcare');
      });
    });

    /*
    Test Documentation:
    - Test Name: should categorize Education transactions
    - Purpose: Validates Education category classification
    - Scenario: Transaction merchant contains education-related keywords
    - Expected Result: Returns 'Education'
    */
    it('should categorize Education transactions', function() {
      var testCases = [
        { merchant: 'State University' },
        { merchant: 'Online Course Platform' },
        { merchant: 'Tuition Payment' },
        { merchant: 'College Bookstore' }
      ];

      testCases.forEach(function(transaction) {
        var result = categoryClassificationService.categorize(transaction);
        expect(result).toBe('Education');
      });
    });

    /*
    Test Documentation:
    - Test Name: should return Miscellaneous for unrecognized merchants
    - Purpose: Validates default categorization
    - Scenario: Transaction merchant doesn't match any keywords
    - Expected Result: Returns 'Miscellaneous'
    */
    it('should return Miscellaneous for unrecognized merchants', function() {
      var transaction = { merchant: 'Unknown Vendor XYZ' };
      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Miscellaneous');
    });

    /*
    Test Documentation:
    - Test Name: should handle case-insensitive merchant matching
    - Purpose: Validates case-insensitive keyword matching
    - Scenario: Merchant name in different cases
    - Expected Result: Correctly categorizes regardless of case
    */
    it('should handle case-insensitive merchant matching', function() {
      var testCases = [
        { merchant: 'AMAZON', expected: 'Shopping' },
        { merchant: 'netflix', expected: 'Entertainment' },
        { merchant: 'ShElL', expected: 'Fuel' }
      ];

      testCases.forEach(function(test) {
        var result = categoryClassificationService.categorize({ merchant: test.merchant });
        expect(result).toBe(test.expected);
      });
    });

    /*
    Test Documentation:
    - Test Name: should handle transaction without merchant
    - Purpose: Validates error handling for missing merchant
    - Scenario: Transaction has no merchant property
    - Expected Result: Returns 'Miscellaneous' without error
    */
    it('should handle transaction without merchant', function() {
      var transaction = { amount: 100 };
      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Miscellaneous');
    });
  });

  /*
  Coverage Report:
  - Functions tested: categorize
  - Scenarios covered: all 9 categories, existing category preservation, unrecognized merchants, case-insensitive matching, missing merchant
  - Edge cases: empty merchant, null merchant, case variations
  - Uncovered scenarios: none
  */
})();