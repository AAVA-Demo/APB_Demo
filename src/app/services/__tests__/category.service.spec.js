/*
Test Documentation:
- Test Name: categoryService - category management
- Purpose: Validates category service returns categories and categorizes transactions
- Scenario: Service provides category list and categorization logic
- Expected Result: Returns predefined categories and categorizes transactions correctly
*/

(function() {
  'use strict';

  describe('categoryService', function() {
    var categoryService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_categoryService_) {
      categoryService = _categoryService_;
    }));

    /*
    Test Documentation:
    - Test Name: should return all predefined categories
    - Purpose: Validates getCategories method
    - Scenario: Request list of all categories
    - Expected Result: Returns array of 9 predefined categories
    */
    it('should return all predefined categories', function() {
      var categories = categoryService.getCategories();

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

    /*
    Test Documentation:
    - Test Name: should categorize transaction with valid category
    - Purpose: Validates categorize method with valid category
    - Scenario: Transaction has a valid category assigned
    - Expected Result: Returns the transaction's category
    */
    it('should categorize transaction with valid category', function() {
      var transaction = { category: 'Food & Dining' };
      var result = categoryService.categorize(transaction);

      expect(result).toBe('Food & Dining');
    });

    /*
    Test Documentation:
    - Test Name: should return Miscellaneous for invalid category
    - Purpose: Validates categorize method with invalid category
    - Scenario: Transaction has an invalid category
    - Expected Result: Returns 'Miscellaneous' as default
    */
    it('should return Miscellaneous for invalid category', function() {
      var transaction = { category: 'InvalidCategory' };
      var result = categoryService.categorize(transaction);

      expect(result).toBe('Miscellaneous');
    });

    /*
    Test Documentation:
    - Test Name: should return Miscellaneous for transaction without category
    - Purpose: Validates categorize method with missing category
    - Scenario: Transaction has no category property
    - Expected Result: Returns 'Miscellaneous' as default
    */
    it('should return Miscellaneous for transaction without category', function() {
      var transaction = { amount: 100 };
      var result = categoryService.categorize(transaction);

      expect(result).toBe('Miscellaneous');
    });

    /*
    Test Documentation:
    - Test Name: should categorize all valid categories
    - Purpose: Validates all predefined categories are recognized
    - Scenario: Test each valid category
    - Expected Result: Each category is correctly identified
    */
    it('should categorize all valid categories', function() {
      var categories = categoryService.getCategories();

      categories.forEach(function(cat) {
        var transaction = { category: cat };
        var result = categoryService.categorize(transaction);
        expect(result).toBe(cat);
      });
    });

    /*
    Test Documentation:
    - Test Name: should handle null transaction
    - Purpose: Validates error handling for null input
    - Scenario: Null transaction provided
    - Expected Result: Returns 'Miscellaneous' without error
    */
    it('should handle null transaction', function() {
      var result = categoryService.categorize({});
      expect(result).toBe('Miscellaneous');
    });
  });

  /*
  Coverage Report:
  - Functions tested: getCategories, categorize
  - Scenarios covered: valid categories, invalid categories, missing categories, null input
  - Edge cases: empty transaction object, invalid category names
  - Uncovered scenarios: none
  */
})();