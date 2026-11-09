/*
Test Documentation:
- Test Name: TransactionCategorizerFactory Unit Tests
- Purpose: Validate automated transaction categorization across 9 predefined categories
- Scenario: Tests keyword-based categorization, category retrieval, and edge cases
- Expected Result: Factory correctly categorizes transactions into Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, and Miscellaneous
*/

(function() {
  'use strict';

  describe('TransactionCategorizerFactory', function() {
    var TransactionCategorizerFactory;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionCategorizerFactory_) {
      TransactionCategorizerFactory = _TransactionCategorizerFactory_;
    }));

    describe('getCategories', function() {
      it('should return all 9 predefined categories', function() {
        var categories = TransactionCategorizerFactory.getCategories();

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

      it('should return categories in consistent order', function() {
        var categories1 = TransactionCategorizerFactory.getCategories();
        var categories2 = TransactionCategorizerFactory.getCategories();

        expect(categories1).toEqual(categories2);
      });
    });

    describe('categorize - Food & Dining', function() {
      it('should categorize restaurant transactions', function() {
        var transaction = { merchant: 'Local Restaurant' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Food & Dining');
      });

      it('should categorize cafe transactions', function() {
        var transaction = { merchant: 'Downtown Cafe' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Food & Dining');
      });

      it('should categorize Starbucks transactions', function() {
        var transaction = { merchant: 'Starbucks Coffee' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Food & Dining');
      });

      it('should categorize McDonald\'s transactions', function() {
        var transaction = { merchant: 'McDonald\'s' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Food & Dining');
      });

      it('should categorize pizza transactions', function() {
        var transaction = { merchant: 'Pizza Hut' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Food & Dining');
      });

      it('should handle case-insensitive matching for food', function() {
        var transaction = { merchant: 'FOOD MART' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Food & Dining');
      });
    });

    describe('categorize - Fuel', function() {
      it('should categorize gas station transactions', function() {
        var transaction = { merchant: 'Gas Station' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Fuel');
      });

      it('should categorize Shell transactions', function() {
        var transaction = { merchant: 'Shell' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Fuel');
      });

      it('should categorize BP transactions', function() {
        var transaction = { merchant: 'BP Gas' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Fuel');
      });

      it('should categorize Exxon transactions', function() {
        var transaction = { merchant: 'Exxon Mobil' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Fuel');
      });

      it('should categorize Chevron transactions', function() {
        var transaction = { merchant: 'Chevron' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Fuel');
      });

      it('should categorize petrol transactions', function() {
        var transaction = { merchant: 'Petrol Pump' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Fuel');
      });
    });

    describe('categorize - Shopping', function() {
      it('should categorize Amazon transactions', function() {
        var transaction = { merchant: 'Amazon.com' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Shopping');
      });

      it('should categorize Walmart transactions', function() {
        var transaction = { merchant: 'Walmart' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Shopping');
      });

      it('should categorize Target transactions', function() {
        var transaction = { merchant: 'Target Store' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Shopping');
      });

      it('should categorize mall transactions', function() {
        var transaction = { merchant: 'Shopping Mall' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Shopping');
      });

      it('should categorize retail store transactions', function() {
        var transaction = { merchant: 'Retail Store' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Shopping');
      });
    });

    describe('categorize - Travel', function() {
      it('should categorize airline transactions', function() {
        var transaction = { merchant: 'United Airlines' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Travel');
      });

      it('should categorize hotel transactions', function() {
        var transaction = { merchant: 'Marriott Hotel' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Travel');
      });

      it('should categorize Uber transactions', function() {
        var transaction = { merchant: 'Uber' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Travel');
      });

      it('should categorize Lyft transactions', function() {
        var transaction = { merchant: 'Lyft' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Travel');
      });

      it('should categorize taxi transactions', function() {
        var transaction = { merchant: 'Yellow Taxi' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Travel');
      });

      it('should categorize flight booking transactions', function() {
        var transaction = { merchant: 'Flight Booking' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Travel');
      });
    });

    describe('categorize - Entertainment', function() {
      it('should categorize movie transactions', function() {
        var transaction = { merchant: 'Movie Theater' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Entertainment');
      });

      it('should categorize cinema transactions', function() {
        var transaction = { merchant: 'Cinema Hall' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Entertainment');
      });

      it('should categorize Netflix transactions', function() {
        var transaction = { merchant: 'Netflix' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Entertainment');
      });

      it('should categorize Spotify transactions', function() {
        var transaction = { merchant: 'Spotify' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Entertainment');
      });

      it('should categorize game transactions', function() {
        var transaction = { merchant: 'Game Store' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Entertainment');
      });

      it('should categorize theatre transactions', function() {
        var transaction = { merchant: 'Theatre' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Entertainment');
      });
    });

    describe('categorize - Utilities', function() {
      it('should categorize electric bill transactions', function() {
        var transaction = { merchant: 'Electric Company' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Utilities');
      });

      it('should categorize water bill transactions', function() {
        var transaction = { merchant: 'Water Department' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Utilities');
      });

      it('should categorize internet bill transactions', function() {
        var transaction = { merchant: 'Internet Service' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Utilities');
      });

      it('should categorize phone bill transactions', function() {
        var transaction = { merchant: 'Phone Company' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Utilities');
      });

      it('should categorize utility bill transactions', function() {
        var transaction = { merchant: 'Utility Bill' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Utilities');
      });
    });

    describe('categorize - Healthcare', function() {
      it('should categorize hospital transactions', function() {
        var transaction = { merchant: 'City Hospital' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Healthcare');
      });

      it('should categorize pharmacy transactions', function() {
        var transaction = { merchant: 'CVS Pharmacy' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Healthcare');
      });

      it('should categorize doctor transactions', function() {
        var transaction = { merchant: 'Dr. Smith' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Healthcare');
      });

      it('should categorize medical transactions', function() {
        var transaction = { merchant: 'Medical Center' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Healthcare');
      });

      it('should categorize health clinic transactions', function() {
        var transaction = { merchant: 'Health Clinic' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Healthcare');
      });
    });

    describe('categorize - Education', function() {
      it('should categorize school transactions', function() {
        var transaction = { merchant: 'School Fees' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Education');
      });

      it('should categorize university transactions', function() {
        var transaction = { merchant: 'University' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Education');
      });

      it('should categorize college transactions', function() {
        var transaction = { merchant: 'College' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Education');
      });

      it('should categorize tuition transactions', function() {
        var transaction = { merchant: 'Tuition Payment' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Education');
      });

      it('should categorize book store transactions', function() {
        var transaction = { merchant: 'Book Store' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Education');
      });
    });

    describe('categorize - Miscellaneous', function() {
      it('should categorize unknown merchants as Miscellaneous', function() {
        var transaction = { merchant: 'Unknown Merchant' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Miscellaneous');
      });

      it('should categorize empty merchant as Miscellaneous', function() {
        var transaction = { merchant: '' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Miscellaneous');
      });

      it('should handle transaction with no merchant property', function() {
        var transaction = {};
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Miscellaneous');
      });

      it('should categorize random string as Miscellaneous', function() {
        var transaction = { merchant: 'XYZABC123' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Miscellaneous');
      });
    });

    describe('categorize - Pre-categorized transactions', function() {
      it('should return existing category if already categorized', function() {
        var transaction = { merchant: 'Amazon', category: 'Travel' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Travel');
      });

      it('should not override valid existing category', function() {
        var transaction = { merchant: 'restaurant', category: 'Entertainment' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Entertainment');
      });

      it('should recategorize if category is Uncategorized', function() {
        var transaction = { merchant: 'Starbucks', category: 'Uncategorized' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Food & Dining');
      });
    });

    describe('categorize - Edge cases', function() {
      it('should handle null transaction', function() {
        expect(function() {
          TransactionCategorizerFactory.categorize(null);
        }).toThrow();
      });

      it('should handle undefined transaction', function() {
        expect(function() {
          TransactionCategorizerFactory.categorize(undefined);
        }).toThrow();
      });

      it('should handle merchant with special characters', function() {
        var transaction = { merchant: 'Café-Restaurant@2024' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Food & Dining');
      });

      it('should handle merchant with numbers', function() {
        var transaction = { merchant: 'Shell 123' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Fuel');
      });

      it('should handle very long merchant names', function() {
        var longMerchant = 'This is a very long merchant name that contains the word restaurant somewhere in the middle';
        var transaction = { merchant: longMerchant };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Food & Dining');
      });

      it('should handle merchant with multiple matching keywords', function() {
        var transaction = { merchant: 'Hospital Pharmacy' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Healthcare');
      });

      it('should handle case sensitivity correctly', function() {
        var transaction = { merchant: 'AMAZON' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Shopping');
      });

      it('should handle merchant with whitespace', function() {
        var transaction = { merchant: '  Netflix  ' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Entertainment');
      });

      it('should handle partial keyword matches', function() {
        var transaction = { merchant: 'Restaurants Inc' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Food & Dining');
      });

      it('should prioritize first matching category', function() {
        var transaction = { merchant: 'food shop' };
        var category = TransactionCategorizerFactory.categorize(transaction);
        expect(category).toBe('Food & Dining');
      });
    });

    describe('performance', function() {
      it('should categorize large batch of transactions efficiently', function() {
        var transactions = [];
        for (var i = 0; i < 1000; i++) {
          transactions.push({ merchant: 'Amazon' });
        }

        var startTime = Date.now();
        transactions.forEach(function(txn) {
          TransactionCategorizerFactory.categorize(txn);
        });
        var endTime = Date.now();

        expect(endTime - startTime).toBeLessThan(1000);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: categorize, getCategories
- Scenarios covered:
  * All 9 predefined categories: Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous
  * Keyword-based matching for each category
  * Case-insensitive matching
  * Pre-categorized transactions
  * Uncategorized transaction recategorization
  * Empty and missing merchant handling
  * Special characters and numbers in merchant names
  * Long merchant names
  * Multiple matching keywords
  * Whitespace handling
  * Partial keyword matches
  * Category priority
  * Performance with 1000+ transactions
  * Null and undefined inputs
- Uncovered scenarios: None - comprehensive coverage achieved
- NFR Validation: Supports 1000+ transactions per card, handles all 9 predefined categories
*/