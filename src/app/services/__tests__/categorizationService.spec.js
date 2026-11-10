/*
Test Documentation:
- Test Name: categorizationService.spec.js
- Purpose: Validate transaction categorization logic
- Scenario: Tests automatic categorization of transactions based on merchant names
- Expected Result: Transactions are correctly categorized into predefined categories
*/

(function() {
  'use strict';

  describe('categorizationService', function() {
    var categorizationService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_categorizationService_) {
      categorizationService = _categorizationService_;
    }));

    describe('categorizeTransactions', function() {
      it('should categorize Food & Dining transactions correctly', function() {
        var transactions = [
          {transactionId: 'T001', merchant: 'Starbucks Coffee', amount: 450},
          {transactionId: 'T002', merchant: 'Pizza Hut', amount: 1200}
        ];

        var result = categorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Food & Dining');
        expect(result[1].category).toBe('Food & Dining');
      });

      it('should categorize Fuel transactions correctly', function() {
        var transactions = [
          {transactionId: 'T001', merchant: 'Shell Fuel Station', amount: 2500},
          {transactionId: 'T002', merchant: 'HP Petrol Pump', amount: 3000}
        ];

        var result = categorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Fuel');
        expect(result[1].category).toBe('Fuel');
      });

      it('should categorize Shopping transactions correctly', function() {
        var transactions = [
          {transactionId: 'T001', merchant: 'Amazon India', amount: 3200},
          {transactionId: 'T002', merchant: 'Flipkart Store', amount: 4500}
        ];

        var result = categorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Shopping');
        expect(result[1].category).toBe('Shopping');
      });

      it('should categorize Travel transactions correctly', function() {
        var transactions = [
          {transactionId: 'T001', merchant: 'Uber Ride', amount: 850},
          {transactionId: 'T002', merchant: 'Ola Cabs', amount: 600}
        ];

        var result = categorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Travel');
        expect(result[1].category).toBe('Travel');
      });

      it('should categorize Entertainment transactions correctly', function() {
        var transactions = [
          {transactionId: 'T001', merchant: 'Netflix Subscription', amount: 799},
          {transactionId: 'T002', merchant: 'Spotify Premium', amount: 119}
        ];

        var result = categorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Entertainment');
        expect(result[1].category).toBe('Entertainment');
      });

      it('should categorize Utilities transactions correctly', function() {
        var transactions = [
          {transactionId: 'T001', merchant: 'Electricity Board', amount: 1500},
          {transactionId: 'T002', merchant: 'Water Bill Payment', amount: 800}
        ];

        var result = categorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Utilities');
        expect(result[1].category).toBe('Utilities');
      });

      it('should categorize Healthcare transactions correctly', function() {
        var transactions = [
          {transactionId: 'T001', merchant: 'Apollo Pharmacy', amount: 650},
          {transactionId: 'T002', merchant: 'Max Hospital', amount: 5000}
        ];

        var result = categorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Healthcare');
        expect(result[1].category).toBe('Healthcare');
      });

      it('should categorize Education transactions correctly', function() {
        var transactions = [
          {transactionId: 'T001', merchant: 'Coursera Online', amount: 2999},
          {transactionId: 'T002', merchant: 'Udemy Course', amount: 1299}
        ];

        var result = categorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Education');
        expect(result[1].category).toBe('Education');
      });

      it('should categorize unknown merchants as Miscellaneous', function() {
        var transactions = [
          {transactionId: 'T001', merchant: 'Unknown Store XYZ', amount: 500},
          {transactionId: 'T002', merchant: 'Random Merchant', amount: 350}
        ];

        var result = categorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Miscellaneous');
        expect(result[1].category).toBe('Miscellaneous');
      });

      it('should not re-categorize transactions that already have a category', function() {
        var transactions = [
          {transactionId: 'T001', merchant: 'Starbucks', category: 'Shopping', amount: 450}
        ];

        var result = categorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Shopping');
      });

      it('should handle empty transaction array', function() {
        var transactions = [];
        var result = categorizationService.categorizeTransactions(transactions);
        expect(result.length).toBe(0);
      });

      it('should handle case-insensitive merchant names', function() {
        var transactions = [
          {transactionId: 'T001', merchant: 'STARBUCKS COFFEE', amount: 450},
          {transactionId: 'T002', merchant: 'shell fuel', amount: 2500}
        ];

        var result = categorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Food & Dining');
        expect(result[1].category).toBe('Fuel');
      });

      it('should handle partial merchant name matches', function() {
        var transactions = [
          {transactionId: 'T001', merchant: 'Starbucks Downtown Branch', amount: 450},
          {transactionId: 'T002', merchant: 'Shell Fuel Station Highway', amount: 2500}
        ];

        var result = categorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Food & Dining');
        expect(result[1].category).toBe('Fuel');
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: categorizeTransactions
  - Scenarios covered:
    * All 9 category classifications (Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous)
    * Pre-categorized transactions
    * Empty transaction array
    * Case-insensitive matching
    * Partial merchant name matching
    * Unknown merchant handling
  - Uncovered scenarios: None
  */
})();