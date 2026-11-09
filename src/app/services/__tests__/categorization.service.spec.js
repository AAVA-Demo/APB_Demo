/*
Test Documentation:
- Test Name: CategorizationService - categorizeTransactions
- Purpose: Validates that transactions are correctly categorized based on merchant keywords
- Scenario: Transactions with various merchant names
- Expected Result: Each transaction is assigned the correct category
*/
/*
Test Documentation:
- Test Name: CategorizationService - default category
- Purpose: Validates that transactions without matching keywords are categorized as Miscellaneous
- Scenario: Transaction with unknown merchant
- Expected Result: Transaction is categorized as Miscellaneous
*/
/*
Coverage Report:
- Functions tested: categorizeTransactions
- Scenarios covered: food & dining, fuel, shopping, travel, entertainment, utilities, healthcare, education, miscellaneous, null merchant, case insensitivity
- Uncovered scenarios: none
*/

describe('CategorizationService', function() {
  'use strict';

  beforeEach(module('app.analytics'));

  var CategorizationService;

  beforeEach(inject(function(_CategorizationService_) {
    CategorizationService = _CategorizationService_;
  }));

  describe('categorizeTransactions', function() {
    it('should categorize food-related transactions correctly', function() {
      var transactions = [
        { transactionId: '1', amount: 50, merchant: 'Local Restaurant' },
        { transactionId: '2', amount: 30, merchant: 'Fine Dining Place' },
        { transactionId: '3', amount: 20, merchant: 'Food Court' }
      ];

      var result = CategorizationService.categorizeTransactions(transactions);

      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Food & Dining');
      expect(result[2].category).toBe('Food & Dining');
    });

    it('should categorize fuel-related transactions correctly', function() {
      var transactions = [
        { transactionId: '1', amount: 60, merchant: 'Shell Gas Station' },
        { transactionId: '2', amount: 70, merchant: 'BP Fuel' },
        { transactionId: '3', amount: 80, merchant: 'Petrol Pump' }
      ];

      var result = CategorizationService.categorizeTransactions(transactions);

      expect(result[0].category).toBe('Fuel');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Fuel');
    });

    it('should categorize shopping-related transactions correctly', function() {
      var transactions = [
        { transactionId: '1', amount: 100, merchant: 'Amazon Shopping' },
        { transactionId: '2', amount: 150, merchant: 'Walmart Store' },
        { transactionId: '3', amount: 200, merchant: 'City Mall' }
      ];

      var result = CategorizationService.categorizeTransactions(transactions);

      expect(result[0].category).toBe('Shopping');
      expect(result[1].category).toBe('Shopping');
      expect(result[2].category).toBe('Shopping');
    });

    it('should categorize travel-related transactions correctly', function() {
      var transactions = [
        { transactionId: '1', amount: 500, merchant: 'Delta Flight' },
        { transactionId: '2', amount: 300, merchant: 'Marriott Hotel' },
        { transactionId: '3', amount: 250, merchant: 'Travel Agency' }
      ];

      var result = CategorizationService.categorizeTransactions(transactions);

      expect(result[0].category).toBe('Travel');
      expect(result[1].category).toBe('Travel');
      expect(result[2].category).toBe('Travel');
    });

    it('should categorize entertainment-related transactions correctly', function() {
      var transactions = [
        { transactionId: '1', amount: 25, merchant: 'AMC Movie Theater' },
        { transactionId: '2', amount: 30, merchant: 'Cinema Complex' },
        { transactionId: '3', amount: 50, merchant: 'Entertainment Center' }
      ];

      var result = CategorizationService.categorizeTransactions(transactions);

      expect(result[0].category).toBe('Entertainment');
      expect(result[1].category).toBe('Entertainment');
      expect(result[2].category).toBe('Entertainment');
    });

    it('should categorize utilities-related transactions correctly', function() {
      var transactions = [
        { transactionId: '1', amount: 80, merchant: 'Electric Company' },
        { transactionId: '2', amount: 50, merchant: 'Water Utility' },
        { transactionId: '3', amount: 60, merchant: 'Utility Services' }
      ];

      var result = CategorizationService.categorizeTransactions(transactions);

      expect(result[0].category).toBe('Utilities');
      expect(result[1].category).toBe('Utilities');
      expect(result[2].category).toBe('Utilities');
    });

    it('should categorize healthcare-related transactions correctly', function() {
      var transactions = [
        { transactionId: '1', amount: 150, merchant: 'City Hospital' },
        { transactionId: '2', amount: 100, merchant: 'Medical Center' },
        { transactionId: '3', amount: 75, merchant: 'Healthcare Clinic' }
      ];

      var result = CategorizationService.categorizeTransactions(transactions);

      expect(result[0].category).toBe('Healthcare');
      expect(result[1].category).toBe('Healthcare');
      expect(result[2].category).toBe('Healthcare');
    });

    it('should categorize education-related transactions correctly', function() {
      var transactions = [
        { transactionId: '1', amount: 500, merchant: 'University Tuition' },
        { transactionId: '2', amount: 200, merchant: 'School Supplies' },
        { transactionId: '3', amount: 300, merchant: 'Education Center' }
      ];

      var result = CategorizationService.categorizeTransactions(transactions);

      expect(result[0].category).toBe('Education');
      expect(result[1].category).toBe('Education');
      expect(result[2].category).toBe('Education');
    });

    it('should categorize unknown merchants as Miscellaneous', function() {
      var transactions = [
        { transactionId: '1', amount: 50, merchant: 'Unknown Vendor' },
        { transactionId: '2', amount: 75, merchant: 'Random Store' }
      ];

      var result = CategorizationService.categorizeTransactions(transactions);

      expect(result[0].category).toBe('Miscellaneous');
      expect(result[1].category).toBe('Miscellaneous');
    });

    it('should handle transactions without merchant', function() {
      var transactions = [
        { transactionId: '1', amount: 50 },
        { transactionId: '2', amount: 75, merchant: null }
      ];

      var result = CategorizationService.categorizeTransactions(transactions);

      expect(result[0].category).toBe('Miscellaneous');
      expect(result[1].category).toBe('Miscellaneous');
    });

    it('should be case-insensitive when matching keywords', function() {
      var transactions = [
        { transactionId: '1', amount: 50, merchant: 'RESTAURANT ABC' },
        { transactionId: '2', amount: 60, merchant: 'Gas STATION' },
        { transactionId: '3', amount: 100, merchant: 'Shopping MALL' }
      ];

      var result = CategorizationService.categorizeTransactions(transactions);

      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Shopping');
    });

    it('should not modify original transaction objects', function() {
      var transactions = [
        { transactionId: '1', amount: 50, merchant: 'Restaurant' }
      ];

      var result = CategorizationService.categorizeTransactions(transactions);

      expect(transactions[0].category).toBeUndefined();
      expect(result[0].category).toBe('Food & Dining');
    });

    it('should handle empty transactions array', function() {
      var result = CategorizationService.categorizeTransactions([]);

      expect(result).toEqual([]);
    });

    it('should match first keyword when multiple keywords present', function() {
      var transactions = [
        { transactionId: '1', amount: 50, merchant: 'Food Shop Store' }
      ];

      var result = CategorizationService.categorizeTransactions(transactions);

      expect(result[0].category).toBe('Food & Dining');
    });
  });
});