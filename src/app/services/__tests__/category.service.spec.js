/*
Test Documentation:
- Test Name: CategoryService - getCategories
- Purpose: Validates retrieval of predefined category list
- Scenario: Service returns all 9 categories
- Expected Result: Returns array with 9 category names
*/
/*
Test Documentation:
- Test Name: CategoryService - categorize (valid categories)
- Purpose: Validates transaction categorization with valid categories
- Scenario: Transactions with valid categories
- Expected Result: Returns transactions unchanged
*/
/*
Test Documentation:
- Test Name: CategoryService - categorize (invalid categories)
- Purpose: Validates transaction categorization with invalid categories
- Scenario: Transactions with invalid/missing categories
- Expected Result: Sets category to 'Miscellaneous'
*/
/*
Test Documentation:
- Test Name: CategoryService - categorize (mixed categories)
- Purpose: Validates transaction categorization with mixed valid/invalid
- Scenario: Mix of valid and invalid categories
- Expected Result: Valid categories unchanged, invalid set to Miscellaneous
*/
/*
Coverage Report:
- Functions tested: getCategories, categorize
- Scenarios covered: category retrieval, valid categorization, invalid categorization, null/undefined categories, empty array
- Edge cases: null category, undefined category, invalid category name, empty transactions array
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CategoryService', function() {
    var CategoryService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategoryService_) {
      CategoryService = _CategoryService_;
    }));

    describe('getCategories', function() {
      it('should return array of 9 predefined categories', function() {
        // Act
        var categories = CategoryService.getCategories();

        // Assert
        expect(categories).toBeDefined();
        expect(Array.isArray(categories)).toBe(true);
        expect(categories.length).toBe(9);
      });

      it('should return categories in correct order', function() {
        // Act
        var categories = CategoryService.getCategories();

        // Assert
        expect(categories[0]).toBe('Food & Dining');
        expect(categories[1]).toBe('Fuel');
        expect(categories[2]).toBe('Shopping');
        expect(categories[3]).toBe('Travel');
        expect(categories[4]).toBe('Entertainment');
        expect(categories[5]).toBe('Utilities');
        expect(categories[6]).toBe('Healthcare');
        expect(categories[7]).toBe('Education');
        expect(categories[8]).toBe('Miscellaneous');
      });

      it('should return all expected category names', function() {
        // Act
        var categories = CategoryService.getCategories();

        // Assert
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

      it('should return same reference on multiple calls', function() {
        // Act
        var categories1 = CategoryService.getCategories();
        var categories2 = CategoryService.getCategories();

        // Assert
        expect(categories1).toBe(categories2);
      });
    });

    describe('categorize', function() {
      it('should return transactions unchanged when all have valid categories', function() {
        // Arrange
        var transactions = [
          { transactionId: 'T1', amount: 100, category: 'Food & Dining' },
          { transactionId: 'T2', amount: 200, category: 'Fuel' },
          { transactionId: 'T3', amount: 300, category: 'Shopping' }
        ];

        // Act
        var result = CategoryService.categorize(transactions);

        // Assert
        expect(result.length).toBe(3);
        expect(result[0].category).toBe('Food & Dining');
        expect(result[1].category).toBe('Fuel');
        expect(result[2].category).toBe('Shopping');
      });

      it('should set category to Miscellaneous when category is null', function() {
        // Arrange
        var transactions = [
          { transactionId: 'T1', amount: 100, category: null }
        ];

        // Act
        var result = CategoryService.categorize(transactions);

        // Assert
        expect(result[0].category).toBe('Miscellaneous');
      });

      it('should set category to Miscellaneous when category is undefined', function() {
        // Arrange
        var transactions = [
          { transactionId: 'T1', amount: 100 }
        ];

        // Act
        var result = CategoryService.categorize(transactions);

        // Assert
        expect(result[0].category).toBe('Miscellaneous');
      });

      it('should set category to Miscellaneous when category is invalid', function() {
        // Arrange
        var transactions = [
          { transactionId: 'T1', amount: 100, category: 'InvalidCategory' },
          { transactionId: 'T2', amount: 200, category: 'AnotherInvalid' }
        ];

        // Act
        var result = CategoryService.categorize(transactions);

        // Assert
        expect(result[0].category).toBe('Miscellaneous');
        expect(result[1].category).toBe('Miscellaneous');
      });

      it('should handle mix of valid and invalid categories', function() {
        // Arrange
        var transactions = [
          { transactionId: 'T1', amount: 100, category: 'Travel' },
          { transactionId: 'T2', amount: 200, category: 'InvalidCat' },
          { transactionId: 'T3', amount: 300, category: 'Entertainment' },
          { transactionId: 'T4', amount: 400, category: null },
          { transactionId: 'T5', amount: 500, category: 'Healthcare' }
        ];

        // Act
        var result = CategoryService.categorize(transactions);

        // Assert
        expect(result[0].category).toBe('Travel');
        expect(result[1].category).toBe('Miscellaneous');
        expect(result[2].category).toBe('Entertainment');
        expect(result[3].category).toBe('Miscellaneous');
        expect(result[4].category).toBe('Healthcare');
      });

      it('should handle empty transactions array', function() {
        // Arrange
        var transactions = [];

        // Act
        var result = CategoryService.categorize(transactions);

        // Assert
        expect(result).toBeDefined();
        expect(result.length).toBe(0);
      });

      it('should handle empty string category', function() {
        // Arrange
        var transactions = [
          { transactionId: 'T1', amount: 100, category: '' }
        ];

        // Act
        var result = CategoryService.categorize(transactions);

        // Assert
        expect(result[0].category).toBe('Miscellaneous');
      });

      it('should preserve all transaction properties', function() {
        // Arrange
        var transactions = [
          {
            transactionId: 'T1',
            amount: 100,
            merchant: 'Test Merchant',
            date: new Date(),
            category: 'Utilities'
          }
        ];

        // Act
        var result = CategoryService.categorize(transactions);

        // Assert
        expect(result[0].transactionId).toBe('T1');
        expect(result[0].amount).toBe(100);
        expect(result[0].merchant).toBe('Test Merchant');
        expect(result[0].date).toBeDefined();
        expect(result[0].category).toBe('Utilities');
      });

      it('should handle case-sensitive category names', function() {
        // Arrange
        var transactions = [
          { transactionId: 'T1', amount: 100, category: 'fuel' },
          { transactionId: 'T2', amount: 200, category: 'FUEL' },
          { transactionId: 'T3', amount: 300, category: 'Fuel' }
        ];

        // Act
        var result = CategoryService.categorize(transactions);

        // Assert
        expect(result[0].category).toBe('Miscellaneous'); // lowercase not valid
        expect(result[1].category).toBe('Miscellaneous'); // uppercase not valid
        expect(result[2].category).toBe('Fuel'); // exact match valid
      });

      it('should handle all valid categories', function() {
        // Arrange
        var transactions = [
          { transactionId: 'T1', category: 'Food & Dining' },
          { transactionId: 'T2', category: 'Fuel' },
          { transactionId: 'T3', category: 'Shopping' },
          { transactionId: 'T4', category: 'Travel' },
          { transactionId: 'T5', category: 'Entertainment' },
          { transactionId: 'T6', category: 'Utilities' },
          { transactionId: 'T7', category: 'Healthcare' },
          { transactionId: 'T8', category: 'Education' },
          { transactionId: 'T9', category: 'Miscellaneous' }
        ];

        // Act
        var result = CategoryService.categorize(transactions);

        // Assert
        expect(result[0].category).toBe('Food & Dining');
        expect(result[1].category).toBe('Fuel');
        expect(result[2].category).toBe('Shopping');
        expect(result[3].category).toBe('Travel');
        expect(result[4].category).toBe('Entertainment');
        expect(result[5].category).toBe('Utilities');
        expect(result[6].category).toBe('Healthcare');
        expect(result[7].category).toBe('Education');
        expect(result[8].category).toBe('Miscellaneous');
      });
    });

    describe('Edge cases', function() {
      it('should handle transaction with special characters in category', function() {
        // Arrange
        var transactions = [
          { transactionId: 'T1', amount: 100, category: 'Food & Dining!' }
        ];

        // Act
        var result = CategoryService.categorize(transactions);

        // Assert
        expect(result[0].category).toBe('Miscellaneous');
      });

      it('should handle transaction with whitespace in category', function() {
        // Arrange
        var transactions = [
          { transactionId: 'T1', amount: 100, category: ' Fuel ' }
        ];

        // Act
        var result = CategoryService.categorize(transactions);

        // Assert
        expect(result[0].category).toBe('Miscellaneous');
      });

      it('should handle large array of transactions', function() {
        // Arrange
        var transactions = [];
        for (var i = 0; i < 1000; i++) {
          transactions.push({
            transactionId: 'T' + i,
            amount: i * 10,
            category: i % 2 === 0 ? 'Shopping' : 'InvalidCat'
          });
        }

        // Act
        var result = CategoryService.categorize(transactions);

        // Assert
        expect(result.length).toBe(1000);
        expect(result[0].category).toBe('Shopping');
        expect(result[1].category).toBe('Miscellaneous');
      });
    });
  });
})();