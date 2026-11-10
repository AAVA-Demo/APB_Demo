/*
Test Documentation:
- Test Name: categoryClassifier Transaction Categorization
- Purpose: Validate rule-based transaction categorization across 9 predefined categories
- Scenario: Classify transactions based on merchant name and category keywords
- Expected Result: Transactions correctly classified into Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, or Miscellaneous
*/

describe('categoryClassifier', function() {
  beforeEach(module('creditCardApp'));

  var categoryClassifier;

  beforeEach(inject(function(_categoryClassifier_) {
    categoryClassifier = _categoryClassifier_;
  }));

  describe('classify()', function() {
    it('should classify restaurant transactions as Food & Dining', function() {
      var transaction = { merchantName: 'Pizza Restaurant', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Food & Dining');
    });

    it('should classify cafe transactions as Food & Dining', function() {
      var transaction = { merchantName: 'Starbucks Cafe', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Food & Dining');
    });

    it('should classify gas station transactions as Fuel', function() {
      var transaction = { merchantName: 'Shell Gas Station', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Fuel');
    });

    it('should classify petrol transactions as Fuel', function() {
      var transaction = { merchantName: 'Chevron Petrol', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Fuel');
    });

    it('should classify Amazon transactions as Shopping', function() {
      var transaction = { merchantName: 'Amazon.com', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Shopping');
    });

    it('should classify Walmart transactions as Shopping', function() {
      var transaction = { merchantName: 'Walmart Store', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Shopping');
    });

    it('should classify airline transactions as Travel', function() {
      var transaction = { merchantName: 'Delta Airlines', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Travel');
    });

    it('should classify hotel transactions as Travel', function() {
      var transaction = { merchantName: 'Marriott Hotel', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Travel');
    });

    it('should classify Uber transactions as Travel', function() {
      var transaction = { merchantName: 'Uber', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Travel');
    });

    it('should classify Netflix transactions as Entertainment', function() {
      var transaction = { merchantName: 'Netflix', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Entertainment');
    });

    it('should classify movie theater transactions as Entertainment', function() {
      var transaction = { merchantName: 'AMC Movie Theater', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Entertainment');
    });

    it('should classify utility transactions as Utilities', function() {
      var transaction = { merchantName: 'Electric Utility Company', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Utilities');
    });

    it('should classify phone bill transactions as Utilities', function() {
      var transaction = { merchantName: 'AT&T Phone Bill', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Utilities');
    });

    it('should classify hospital transactions as Healthcare', function() {
      var transaction = { merchantName: 'City Hospital', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Healthcare');
    });

    it('should classify pharmacy transactions as Healthcare', function() {
      var transaction = { merchantName: 'CVS Pharmacy', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Healthcare');
    });

    it('should classify university transactions as Education', function() {
      var transaction = { merchantName: 'State University', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Education');
    });

    it('should classify tuition transactions as Education', function() {
      var transaction = { merchantName: 'College Tuition Payment', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Education');
    });

    it('should classify based on merchantCategory when merchantName is empty', function() {
      var transaction = { merchantName: '', merchantCategory: 'restaurant dining' };
      expect(categoryClassifier.classify(transaction)).toBe('Food & Dining');
    });

    it('should return Miscellaneous for unrecognized transactions', function() {
      var transaction = { merchantName: 'Unknown Merchant', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Miscellaneous');
    });

    it('should handle case-insensitive matching', function() {
      var transaction = { merchantName: 'PIZZA RESTAURANT', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Food & Dining');
    });

    it('should handle missing merchantName gracefully', function() {
      var transaction = { merchantCategory: 'fuel' };
      expect(categoryClassifier.classify(transaction)).toBe('Fuel');
    });

    it('should handle missing merchantCategory gracefully', function() {
      var transaction = { merchantName: 'gas station' };
      expect(categoryClassifier.classify(transaction)).toBe('Fuel');
    });

    it('should return Miscellaneous on error', function() {
      var transaction = null;
      expect(categoryClassifier.classify(transaction)).toBe('Miscellaneous');
    });

    it('should classify partial keyword matches', function() {
      var transaction = { merchantName: 'Local Burger Restaurant', merchantCategory: '' };
      expect(categoryClassifier.classify(transaction)).toBe('Food & Dining');
    });
  });
});

/*
Coverage Report:
- Functions tested: classify
- Scenarios covered: all 9 categories (Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous), case-insensitive matching, partial matches, missing properties, error handling
- Edge cases: null input, missing merchantName/merchantCategory, unrecognized merchants, case variations
- Uncovered scenarios: none - all classification rules and edge cases tested
*/