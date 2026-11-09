/*
Test Documentation:
- Test Name: CategoryConstants Unit Tests
- Purpose: Validate category constants definition
- Scenario: Test that all 9 predefined categories are present
- Expected Result: Constants should contain exactly 9 spending categories
*/

(function(){
'use strict';

describe('CategoryConstants', function() {
  var CategoryConstants;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CategoryConstants_) {
    CategoryConstants = _CategoryConstants_;
  }));

  describe('Category Definitions', function() {
    it('should define exactly 9 categories', function() {
      expect(CategoryConstants.length).toBe(9);
    });

    it('should include Food & Dining category', function() {
      expect(CategoryConstants).toContain('Food & Dining');
    });

    it('should include Fuel category', function() {
      expect(CategoryConstants).toContain('Fuel');
    });

    it('should include Shopping category', function() {
      expect(CategoryConstants).toContain('Shopping');
    });

    it('should include Travel category', function() {
      expect(CategoryConstants).toContain('Travel');
    });

    it('should include Entertainment category', function() {
      expect(CategoryConstants).toContain('Entertainment');
    });

    it('should include Utilities category', function() {
      expect(CategoryConstants).toContain('Utilities');
    });

    it('should include Healthcare category', function() {
      expect(CategoryConstants).toContain('Healthcare');
    });

    it('should include Education category', function() {
      expect(CategoryConstants).toContain('Education');
    });

    it('should include Miscellaneous category', function() {
      expect(CategoryConstants).toContain('Miscellaneous');
    });

    it('should be an array', function() {
      expect(Array.isArray(CategoryConstants)).toBe(true);
    });

    it('should not contain duplicate categories', function() {
      var uniqueCategories = CategoryConstants.filter(function(value, index, self) {
        return self.indexOf(value) === index;
      });
      expect(uniqueCategories.length).toBe(CategoryConstants.length);
    });
  });
});

})();

/*
Coverage Report:
- Constants tested: CategoryConstants
- Scenarios covered: Array length, all 9 categories present, no duplicates, array type
- Edge cases: Duplicate detection
- Uncovered scenarios: None - all constant validations covered
*/