/*
Test Documentation:
- Test Name: CategorizationFactory - categorizeTransactions with keywords
- Purpose: Validates transaction categorization based on merchant keywords
- Scenario: Transactions with merchants matching category keywords
- Expected Result: Transactions assigned correct categories
*/
/*
Test Documentation:
- Test Name: CategorizationFactory - Food & Dining category
- Purpose: Validates Food & Dining categorization
- Scenario: Transaction with food-related merchant
- Expected Result: Category set to 'Food & Dining'
*/
/*
Test Documentation:
- Test Name: CategorizationFactory - Fuel category
- Purpose: Validates Fuel categorization
- Scenario: Transaction with fuel-related merchant
- Expected Result: Category set to 'Fuel'
*/
/*
Test Documentation:
- Test Name: CategorizationFactory - Miscellaneous category
- Purpose: Validates default Miscellaneous categorization
- Scenario: Transaction with no matching keywords
- Expected Result: Category set to 'Miscellaneous'
*/
/*
Test Documentation:
- Test Name: CategorizationFactory - existing category preservation
- Purpose: Validates preservation of existing categories
- Scenario: Transaction already has category
- Expected Result: Existing category not overwritten
*/
/*
Test Documentation:
- Test Name: CategorizationFactory - case insensitive matching
- Purpose: Validates case-insensitive keyword matching
- Scenario: Merchant name with mixed case
- Expected Result: Category matched regardless of case
*/
/*
Coverage Report:
- Functions tested: categorizeTransactions()
- Scenarios covered: all 9 categories, miscellaneous, existing categories, case sensitivity
- Uncovered scenarios: multi-word merchants, special characters
*/

(function() {
  'use strict';

  describe('CategorizationFactory', function() {
    var CategorizationFactory;

    beforeEach(module('app.analytics'));

    beforeEach(inject(function(_CategorizationFactory_) {
      CategorizationFactory = _CategorizationFactory_;
    }));

    describe('categorizeTransactions()', function() {
      it('should categorize Food & Dining transactions', function() {
        var transactions = [
          { id: 1, merchant: 'Starbucks Coffee', amount: 5.50 },
          { id: 2, merchant: 'Pizza Hut', amount: 25.00 },
          { id: 3, merchant: 'Local Restaurant', amount: 45.00 }
        ];

        var result = CategorizationFactory.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Food & Dining');
        expect(result[1].category).toBe('Food & Dining');
        expect(result[2].category).toBe('Food & Dining');
      });

      it('should categorize Fuel transactions', function() {
        var transactions = [
          { id: 1, merchant: 'Shell Gas Station', amount: 45.00 },
          { id: 2, merchant: 'Exxon', amount: 50.00 },
          { id: 3, merchant: 'Chevron Fuel', amount: 40.00 }
        ];

        var result = CategorizationFactory.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Fuel');
        expect(result[1].category).toBe('Fuel');
        expect(result[2].category).toBe('Fuel');
      });

      it('should categorize Shopping transactions', function() {
        var transactions = [
          { id: 1, merchant: 'Amazon', amount: 120.00 },
          { id: 2, merchant: 'Walmart Store', amount: 85.00 },
          { id: 3, merchant: 'Target Retail', amount: 60.00 }
        ];

        var result = CategorizationFactory.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Shopping');
        expect(result[1].category).toBe('Shopping');
        expect(result[2].category).toBe('Shopping');
      });

      it('should categorize Travel transactions', function() {
        var transactions = [
          { id: 1, merchant: 'Delta Airlines', amount: 350.00 },
          { id: 2, merchant: 'Marriott Hotel', amount: 200.00 },
          { id: 3, merchant: 'Uber', amount: 25.00 }
        ];

        var result = CategorizationFactory.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Travel');
        expect(result[1].category).toBe('Travel');
        expect(result[2].category).toBe('Travel');
      });

      it('should categorize Entertainment transactions', function() {
        var transactions = [
          { id: 1, merchant: 'Netflix', amount: 15.99 },
          { id: 2, merchant: 'AMC Movie Theatre', amount: 30.00 },
          { id: 3, merchant: 'Spotify', amount: 9.99 }
        ];

        var result = CategorizationFactory.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Entertainment');
        expect(result[1].category).toBe('Entertainment');
        expect(result[2].category).toBe('Entertainment');
      });

      it('should categorize Utilities transactions', function() {
        var transactions = [
          { id: 1, merchant: 'Electric Company', amount: 120.00 },
          { id: 2, merchant: 'Water Utility', amount: 45.00 },
          { id: 3, merchant: 'Internet Provider', amount: 60.00 }
        ];

        var result = CategorizationFactory.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Utilities');
        expect(result[1].category).toBe('Utilities');
        expect(result[2].category).toBe('Utilities');
      });

      it('should categorize Healthcare transactions', function() {
        var transactions = [
          { id: 1, merchant: 'CVS Pharmacy', amount: 35.00 },
          { id: 2, merchant: 'City Hospital', amount: 500.00 },
          { id: 3, merchant: 'Doctor Office', amount: 150.00 }
        ];

        var result = CategorizationFactory.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Healthcare');
        expect(result[1].category).toBe('Healthcare');
        expect(result[2].category).toBe('Healthcare');
      });

      it('should categorize Education transactions', function() {
        var transactions = [
          { id: 1, merchant: 'University Tuition', amount: 5000.00 },
          { id: 2, merchant: 'Textbooks Store', amount: 200.00 },
          { id: 3, merchant: 'Online School', amount: 150.00 }
        ];

        var result = CategorizationFactory.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Education');
        expect(result[1].category).toBe('Education');
        expect(result[2].category).toBe('Education');
      });

      it('should categorize as Miscellaneous when no keywords match', function() {
        var transactions = [
          { id: 1, merchant: 'Unknown Merchant', amount: 100.00 },
          { id: 2, merchant: 'Random Store', amount: 50.00 }
        ];

        var result = CategorizationFactory.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Miscellaneous');
        expect(result[1].category).toBe('Miscellaneous');
      });

      it('should preserve existing category if already set', function() {
        var transactions = [
          { id: 1, merchant: 'Starbucks', amount: 5.50, category: 'Custom Category' }
        ];

        var result = CategorizationFactory.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Custom Category');
      });

      it('should be case insensitive when matching keywords', function() {
        var transactions = [
          { id: 1, merchant: 'STARBUCKS COFFEE', amount: 5.50 },
          { id: 2, merchant: 'shell GAS', amount: 45.00 }
        ];

        var result = CategorizationFactory.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Food & Dining');
        expect(result[1].category).toBe('Fuel');
      });

      it('should match keywords in description if merchant does not match', function() {
        var transactions = [
          { id: 1, merchant: 'Unknown', description: 'coffee purchase', amount: 5.50 }
        ];

        var result = CategorizationFactory.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Food & Dining');
      });

      it('should handle transactions with missing merchant and description', function() {
        var transactions = [
          { id: 1, amount: 100.00 }
        ];

        var result = CategorizationFactory.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Miscellaneous');
      });
    });
  });
})();