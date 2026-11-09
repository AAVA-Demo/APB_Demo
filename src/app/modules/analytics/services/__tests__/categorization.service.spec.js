/*
Test Documentation:
- Test Name: CategorizationService functionality
- Purpose: Validate category data management
- Scenario: Test getCategories and getCategoryByName
- Expected Result: Categories retrieved correctly
*/

(function() {
  'use strict';

  describe('CategorizationService', function() {
    var CategorizationService;

    beforeEach(module('app.analytics'));

    beforeEach(inject(function(_CategorizationService_) {
      CategorizationService = _CategorizationService_;
    }));

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Ensure service is injectable
    - Scenario: Inject CategorizationService
    - Expected Result: Service is defined
    */
    it('should be defined', function() {
      expect(CategorizationService).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: getCategories should return all 9 categories
    - Purpose: Validate category list retrieval
    - Scenario: Call getCategories
    - Expected Result: Returns array of 9 categories
    */
    it('getCategories should return all 9 categories', function() {
      var categories = CategorizationService.getCategories();

      expect(categories).toBeDefined();
      expect(categories.length).toBe(9);
    });

    /*
    Test Documentation:
    - Test Name: getCategories should include all required category names
    - Purpose: Validate category names
    - Scenario: Check category names
    - Expected Result: All 9 categories present
    */
    it('getCategories should include all required category names', function() {
      var categories = CategorizationService.getCategories();
      var categoryNames = categories.map(function(cat) { return cat.categoryName; });

      expect(categoryNames).toContain('Food & Dining');
      expect(categoryNames).toContain('Fuel');
      expect(categoryNames).toContain('Shopping');
      expect(categoryNames).toContain('Travel');
      expect(categoryNames).toContain('Entertainment');
      expect(categoryNames).toContain('Utilities');
      expect(categoryNames).toContain('Healthcare');
      expect(categoryNames).toContain('Education');
      expect(categoryNames).toContain('Miscellaneous');
    });

    /*
    Test Documentation:
    - Test Name: each category should have required properties
    - Purpose: Validate category structure
    - Scenario: Check category object properties
    - Expected Result: All categories have categoryId, categoryName, color, icon
    */
    it('each category should have required properties', function() {
      var categories = CategorizationService.getCategories();

      categories.forEach(function(category) {
        expect(category.categoryId).toBeDefined();
        expect(category.categoryName).toBeDefined();
        expect(category.color).toBeDefined();
        expect(category.icon).toBeDefined();
      });
    });

    /*
    Test Documentation:
    - Test Name: getCategoryByName should return correct category
    - Purpose: Validate category lookup
    - Scenario: Search for category by name
    - Expected Result: Returns matching category object
    */
    it('getCategoryByName should return correct category', function() {
      var category = CategorizationService.getCategoryByName('Food & Dining');

      expect(category).toBeDefined();
      expect(category.categoryName).toBe('Food & Dining');
      expect(category.categoryId).toBe('food');
    });

    /*
    Test Documentation:
    - Test Name: getCategoryByName should return undefined for non-existent category
    - Purpose: Validate error handling
    - Scenario: Search for invalid category
    - Expected Result: Returns undefined
    */
    it('getCategoryByName should return undefined for non-existent category', function() {
      var category = CategorizationService.getCategoryByName('Invalid Category');
      expect(category).toBeUndefined();
    });
  });

  /*
  Coverage Report:
  - Functions tested: getCategories, getCategoryByName
  - Scenarios covered: category retrieval, category structure validation, category lookup
  - Uncovered scenarios: none
  */
})();