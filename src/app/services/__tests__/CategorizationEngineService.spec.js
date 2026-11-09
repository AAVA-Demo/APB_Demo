/*
Test Documentation:
- Test Name: CategorizationEngineService Unit Tests
- Purpose: Validate transaction categorization logic based on merchant names
- Scenario: Tests categorize method with various merchant names matching different category rules
- Expected Result: Transactions are correctly categorized into predefined categories or Miscellaneous
*/

describe('CategorizationEngineService', function() {
  var CategorizationEngineService;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CategorizationEngineService_) {
    CategorizationEngineService = _CategorizationEngineService_;
  }));

  describe('categorize', function() {
    it('should categorize restaurant transaction as Food & Dining', function() {
      var transactions = [
        {transactionId: 1, merchantName: 'Restaurant ABC', amount: 50}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result.length).toBe(1);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[0].merchantName).toBe('Restaurant ABC');
    });

    it('should categorize cafe transaction as Food & Dining', function() {
      var transactions = [
        {transactionId: 2, merchantName: 'Starbucks Cafe', amount: 15}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Food & Dining');
    });

    it('should categorize gas station transaction as Fuel', function() {
      var transactions = [
        {transactionId: 3, merchantName: 'Shell Gas Station', amount: 40}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Fuel');
    });

    it('should categorize petrol transaction as Fuel', function() {
      var transactions = [
        {transactionId: 4, merchantName: 'BP Petrol', amount: 35}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Fuel');
    });

    it('should categorize Amazon transaction as Shopping', function() {
      var transactions = [
        {transactionId: 5, merchantName: 'Amazon.com', amount: 100}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Shopping');
    });

    it('should categorize Walmart transaction as Shopping', function() {
      var transactions = [
        {transactionId: 6, merchantName: 'Walmart Store', amount: 75}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Shopping');
    });

    it('should categorize airline transaction as Travel', function() {
      var transactions = [
        {transactionId: 7, merchantName: 'Delta Airlines', amount: 500}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Travel');
    });

    it('should categorize hotel transaction as Travel', function() {
      var transactions = [
        {transactionId: 8, merchantName: 'Marriott Hotel', amount: 200}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Travel');
    });

    it('should categorize Uber transaction as Travel', function() {
      var transactions = [
        {transactionId: 9, merchantName: 'Uber Trip', amount: 25}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Travel');
    });

    it('should categorize Netflix transaction as Entertainment', function() {
      var transactions = [
        {transactionId: 10, merchantName: 'Netflix Subscription', amount: 15}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Entertainment');
    });

    it('should categorize movie transaction as Entertainment', function() {
      var transactions = [
        {transactionId: 11, merchantName: 'AMC Movie Theater', amount: 30}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Entertainment');
    });

    it('should categorize electric utility transaction as Utilities', function() {
      var transactions = [
        {transactionId: 12, merchantName: 'Electric Company', amount: 120}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Utilities');
    });

    it('should categorize internet transaction as Utilities', function() {
      var transactions = [
        {transactionId: 13, merchantName: 'Comcast Internet', amount: 80}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Utilities');
    });

    it('should categorize hospital transaction as Healthcare', function() {
      var transactions = [
        {transactionId: 14, merchantName: 'City Hospital', amount: 300}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Healthcare');
    });

    it('should categorize pharmacy transaction as Healthcare', function() {
      var transactions = [
        {transactionId: 15, merchantName: 'CVS Pharmacy', amount: 45}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Healthcare');
    });

    it('should categorize university transaction as Education', function() {
      var transactions = [
        {transactionId: 16, merchantName: 'State University', amount: 5000}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Education');
    });

    it('should categorize school transaction as Education', function() {
      var transactions = [
        {transactionId: 17, merchantName: 'Private School', amount: 2000}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Education');
    });

    it('should categorize unknown merchant as Miscellaneous', function() {
      var transactions = [
        {transactionId: 18, merchantName: 'Unknown Merchant', amount: 50}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Miscellaneous');
    });

    it('should handle transactions with missing merchantName', function() {
      var transactions = [
        {transactionId: 19, amount: 50}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Miscellaneous');
    });

    it('should handle transactions with null merchantName', function() {
      var transactions = [
        {transactionId: 20, merchantName: null, amount: 50}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Miscellaneous');
    });

    it('should handle case-insensitive merchant names', function() {
      var transactions = [
        {transactionId: 21, merchantName: 'RESTAURANT ABC', amount: 50},
        {transactionId: 22, merchantName: 'restaurant xyz', amount: 30}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Food & Dining');
    });

    it('should categorize multiple transactions correctly', function() {
      var transactions = [
        {transactionId: 1, merchantName: 'Restaurant ABC', amount: 50},
        {transactionId: 2, merchantName: 'Shell Gas', amount: 40},
        {transactionId: 3, merchantName: 'Amazon', amount: 100},
        {transactionId: 4, merchantName: 'Unknown Store', amount: 25}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result.length).toBe(4);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Shopping');
      expect(result[3].category).toBe('Miscellaneous');
    });

    it('should preserve original transaction properties', function() {
      var transactions = [
        {transactionId: 1, merchantName: 'Restaurant ABC', amount: 50, date: '2024-01-15', cardId: 'card123'}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].transactionId).toBe(1);
      expect(result[0].merchantName).toBe('Restaurant ABC');
      expect(result[0].amount).toBe(50);
      expect(result[0].date).toBe('2024-01-15');
      expect(result[0].cardId).toBe('card123');
      expect(result[0].category).toBe('Food & Dining');
    });

    it('should handle empty transactions array', function() {
      var transactions = [];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result.length).toBe(0);
    });

    it('should match partial keywords in merchant names', function() {
      var transactions = [
        {transactionId: 1, merchantName: 'Best Pizza Place', amount: 25},
        {transactionId: 2, merchantName: 'Burger King', amount: 15}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Food & Dining');
    });

    it('should prioritize first matching category', function() {
      var transactions = [
        {transactionId: 1, merchantName: 'Restaurant and Hotel', amount: 100}
      ];

      var result = CategorizationEngineService.categorize(transactions);

      expect(result[0].category).toBe('Food & Dining');
    });
  });
});

/*
Coverage Report:
- Functions tested: categorize
- Scenarios covered:
  * All 9 predefined categories (Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous)
  * Case-insensitive matching
  * Missing or null merchant names
  * Empty transactions array
  * Multiple transactions with different categories
  * Preservation of original transaction properties
  * Partial keyword matching
  * Priority of first matching category
- Uncovered scenarios: None - comprehensive coverage achieved
- Dependencies mocked: None (pure function)
*/