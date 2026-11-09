/*
Test Documentation:
- Test Name: CategoryFilterService - getCategories returns predefined list
- Purpose: Validates that getCategories returns all 9 predefined categories
- Scenario: getCategories called
- Expected Result: Array of 9 categories returned
*/
/*
Test Documentation:
- Test Name: CategoryFilterService - setActiveCategories stores selection
- Purpose: Validates that setActiveCategories stores selected categories
- Scenario: setActiveCategories called with array
- Expected Result: Categories stored in active filters
*/
/*
Test Documentation:
- Test Name: CategoryFilterService - getActiveCategories returns stored selection
- Purpose: Validates that getActiveCategories returns previously set categories
- Scenario: getActiveCategories called after setActiveCategories
- Expected Result: Previously set categories returned
*/
/*
Coverage Report:
- Functions tested: getCategories, setActiveCategories, getActiveCategories
- Scenarios covered: get all categories, set active filters, get active filters, empty selection
- Uncovered scenarios: none
*/

describe('CategoryFilterService', function() {
  var CategoryFilterService;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CategoryFilterService_) {
    CategoryFilterService = _CategoryFilterService_;
  }));

  describe('getCategories', function() {
    it('should return all 9 predefined categories', function() {
      var categories = CategoryFilterService.getCategories();

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

    it('should return same array reference on multiple calls', function() {
      var categories1 = CategoryFilterService.getCategories();
      var categories2 = CategoryFilterService.getCategories();

      expect(categories1).toBe(categories2);
    });
  });

  describe('setActiveCategories', function() {
    it('should store selected categories', function() {
      var selectedCategories = ['Food & Dining', 'Fuel'];

      CategoryFilterService.setActiveCategories(selectedCategories);

      var activeCategories = CategoryFilterService.getActiveCategories();
      expect(activeCategories).toEqual(selectedCategories);
    });

    it('should handle empty array', function() {
      CategoryFilterService.setActiveCategories([]);

      var activeCategories = CategoryFilterService.getActiveCategories();
      expect(activeCategories).toEqual([]);
    });

    it('should overwrite previous selection', function() {
      CategoryFilterService.setActiveCategories(['Food & Dining']);
      CategoryFilterService.setActiveCategories(['Travel', 'Entertainment']);

      var activeCategories = CategoryFilterService.getActiveCategories();
      expect(activeCategories).toEqual(['Travel', 'Entertainment']);
      expect(activeCategories.length).toBe(2);
    });
  });

  describe('getActiveCategories', function() {
    it('should return empty array initially', function() {
      var activeCategories = CategoryFilterService.getActiveCategories();

      expect(activeCategories).toEqual([]);
    });

    it('should return previously set categories', function() {
      var selectedCategories = ['Shopping', 'Healthcare'];
      CategoryFilterService.setActiveCategories(selectedCategories);

      var activeCategories = CategoryFilterService.getActiveCategories();

      expect(activeCategories).toEqual(selectedCategories);
    });

    it('should handle all categories selected', function() {
      var allCategories = CategoryFilterService.getCategories();
      CategoryFilterService.setActiveCategories(allCategories);

      var activeCategories = CategoryFilterService.getActiveCategories();

      expect(activeCategories.length).toBe(9);
      expect(activeCategories).toEqual(allCategories);
    });
  });
});