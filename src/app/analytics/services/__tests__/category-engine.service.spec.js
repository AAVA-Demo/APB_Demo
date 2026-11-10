/*
Test Documentation:
- Test Name: CategoryEngineService - categorizeTransactions
- Purpose: Validates transaction categorization
- Scenario: Transactions with and without categories
- Expected Result: All transactions have valid categories

- Test Name: CategoryEngineService - detectCategory Food & Dining
- Purpose: Validates food category detection
- Scenario: Merchant/description contains food keywords
- Expected Result: Returns 'Food & Dining'

- Test Name: CategoryEngineService - detectCategory Fuel
- Purpose: Validates fuel category detection
- Scenario: Merchant/description contains fuel keywords
- Expected Result: Returns 'Fuel'

- Test Name: CategoryEngineService - detectCategory Shopping
- Purpose: Validates shopping category detection
- Scenario: Merchant/description contains shopping keywords
- Expected Result: Returns 'Shopping'

- Test Name: CategoryEngineService - detectCategory Travel
- Purpose: Validates travel category detection
- Scenario: Merchant/description contains travel keywords
- Expected Result: Returns 'Travel'

- Test Name: CategoryEngineService - detectCategory Entertainment
- Purpose: Validates entertainment category detection
- Scenario: Merchant/description contains entertainment keywords
- Expected Result: Returns 'Entertainment'

- Test Name: CategoryEngineService - detectCategory Utilities
- Purpose: Validates utilities category detection
- Scenario: Merchant/description contains utility keywords
- Expected Result: Returns 'Utilities'

- Test Name: CategoryEngineService - detectCategory Healthcare
- Purpose: Validates healthcare category detection
- Scenario: Merchant/description contains healthcare keywords
- Expected Result: Returns 'Healthcare'

- Test Name: CategoryEngineService - detectCategory Education
- Purpose: Validates education category detection
- Scenario: Merchant/description contains education keywords
- Expected Result: Returns 'Education'

- Test Name: CategoryEngineService - detectCategory Miscellaneous
- Purpose: Validates miscellaneous fallback
- Scenario: No matching keywords
- Expected Result: Returns 'Miscellaneous'
*/

/*
Coverage Report:
- Functions tested: categorizeTransactions, detectCategory
- Scenarios covered: all 9 categories, keyword matching, case insensitivity, fallback to Miscellaneous
- Edge cases: empty strings, multiple keywords, uncategorized transactions
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CategoryEngineService', function() {
    var CategoryEngineService;

    beforeEach(module('analytics'));

    beforeEach(inject(function(_CategoryEngineService_) {
      CategoryEngineService = _CategoryEngineService_;
    }));

    describe('categorizeTransactions', function() {
      it('should categorize uncategorized transactions', function() {
        var transactions = [
          { transactionId: 'txn-001', merchant: 'Pizza Hut', description: 'Dinner', category: 'Uncategorized' },
          { transactionId: 'txn-002', merchant: 'Shell Gas', description: 'Fuel', category: null },
          { transactionId: 'txn-003', merchant: 'Amazon', description: 'Shopping' }
        ];

        var result = CategoryEngineService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Food & Dining');
        expect(result[1].category).toBe('Fuel');
        expect(result[2].category).toBe('Shopping');
      });

      it('should not recategorize already categorized transactions', function() {
        var transactions = [
          { transactionId: 'txn-001', merchant: 'Restaurant', description: 'Lunch', category: 'Food & Dining' }
        ];

        var result = CategoryEngineService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Food & Dining');
      });

      it('should handle empty transactions array', function() {
        var result = CategoryEngineService.categorizeTransactions([]);
        expect(result.length).toBe(0);
      });
    });

    describe('detectCategory', function() {
      describe('Food & Dining', function() {
        it('should detect restaurant keyword', function() {
          var category = CategoryEngineService.detectCategory('Local Restaurant', 'Dinner');
          expect(category).toBe('Food & Dining');
        });

        it('should detect cafe keyword', function() {
          var category = CategoryEngineService.detectCategory('Starbucks Cafe', 'Coffee');
          expect(category).toBe('Food & Dining');
        });

        it('should detect food keyword', function() {
          var category = CategoryEngineService.detectCategory('Food Mart', 'Groceries');
          expect(category).toBe('Food & Dining');
        });

        it('should detect pizza keyword', function() {
          var category = CategoryEngineService.detectCategory('Pizza Place', 'Order');
          expect(category).toBe('Food & Dining');
        });

        it('should be case insensitive', function() {
          var category = CategoryEngineService.detectCategory('RESTAURANT', 'DINING');
          expect(category).toBe('Food & Dining');
        });
      });

      describe('Fuel', function() {
        it('should detect gas keyword', function() {
          var category = CategoryEngineService.detectCategory('Gas Station', 'Fuel purchase');
          expect(category).toBe('Fuel');
        });

        it('should detect fuel keyword', function() {
          var category = CategoryEngineService.detectCategory('Fuel Stop', 'Refuel');
          expect(category).toBe('Fuel');
        });

        it('should detect shell keyword', function() {
          var category = CategoryEngineService.detectCategory('Shell', 'Gas');
          expect(category).toBe('Fuel');
        });

        it('should detect petrol keyword', function() {
          var category = CategoryEngineService.detectCategory('Petrol Pump', 'Fill up');
          expect(category).toBe('Fuel');
        });
      });

      describe('Shopping', function() {
        it('should detect amazon keyword', function() {
          var category = CategoryEngineService.detectCategory('Amazon', 'Online purchase');
          expect(category).toBe('Shopping');
        });

        it('should detect walmart keyword', function() {
          var category = CategoryEngineService.detectCategory('Walmart', 'Groceries');
          expect(category).toBe('Shopping');
        });

        it('should detect mall keyword', function() {
          var category = CategoryEngineService.detectCategory('City Mall', 'Shopping');
          expect(category).toBe('Shopping');
        });

        it('should detect store keyword', function() {
          var category = CategoryEngineService.detectCategory('Department Store', 'Purchase');
          expect(category).toBe('Shopping');
        });
      });

      describe('Travel', function() {
        it('should detect airline keyword', function() {
          var category = CategoryEngineService.detectCategory('United Airlines', 'Flight ticket');
          expect(category).toBe('Travel');
        });

        it('should detect hotel keyword', function() {
          var category = CategoryEngineService.detectCategory('Marriott Hotel', 'Accommodation');
          expect(category).toBe('Travel');
        });

        it('should detect uber keyword', function() {
          var category = CategoryEngineService.detectCategory('Uber', 'Ride');
          expect(category).toBe('Travel');
        });

        it('should detect travel keyword', function() {
          var category = CategoryEngineService.detectCategory('Travel Agency', 'Booking');
          expect(category).toBe('Travel');
        });
      });

      describe('Entertainment', function() {
        it('should detect movie keyword', function() {
          var category = CategoryEngineService.detectCategory('Movie Theater', 'Tickets');
          expect(category).toBe('Entertainment');
        });

        it('should detect netflix keyword', function() {
          var category = CategoryEngineService.detectCategory('Netflix', 'Subscription');
          expect(category).toBe('Entertainment');
        });

        it('should detect spotify keyword', function() {
          var category = CategoryEngineService.detectCategory('Spotify', 'Music streaming');
          expect(category).toBe('Entertainment');
        });

        it('should detect concert keyword', function() {
          var category = CategoryEngineService.detectCategory('Concert Hall', 'Event');
          expect(category).toBe('Entertainment');
        });
      });

      describe('Utilities', function() {
        it('should detect electric keyword', function() {
          var category = CategoryEngineService.detectCategory('Electric Company', 'Bill');
          expect(category).toBe('Utilities');
        });

        it('should detect water keyword', function() {
          var category = CategoryEngineService.detectCategory('Water Department', 'Monthly bill');
          expect(category).toBe('Utilities');
        });

        it('should detect internet keyword', function() {
          var category = CategoryEngineService.detectCategory('Internet Provider', 'Service');
          expect(category).toBe('Utilities');
        });

        it('should detect phone keyword', function() {
          var category = CategoryEngineService.detectCategory('Phone Company', 'Mobile bill');
          expect(category).toBe('Utilities');
        });
      });

      describe('Healthcare', function() {
        it('should detect hospital keyword', function() {
          var category = CategoryEngineService.detectCategory('City Hospital', 'Medical');
          expect(category).toBe('Healthcare');
        });

        it('should detect pharmacy keyword', function() {
          var category = CategoryEngineService.detectCategory('CVS Pharmacy', 'Prescription');
          expect(category).toBe('Healthcare');
        });

        it('should detect doctor keyword', function() {
          var category = CategoryEngineService.detectCategory('Doctor Office', 'Checkup');
          expect(category).toBe('Healthcare');
        });

        it('should detect medical keyword', function() {
          var category = CategoryEngineService.detectCategory('Medical Center', 'Treatment');
          expect(category).toBe('Healthcare');
        });
      });

      describe('Education', function() {
        it('should detect school keyword', function() {
          var category = CategoryEngineService.detectCategory('High School', 'Fees');
          expect(category).toBe('Education');
        });

        it('should detect university keyword', function() {
          var category = CategoryEngineService.detectCategory('State University', 'Tuition');
          expect(category).toBe('Education');
        });

        it('should detect course keyword', function() {
          var category = CategoryEngineService.detectCategory('Online Course', 'Learning');
          expect(category).toBe('Education');
        });

        it('should detect books keyword', function() {
          var category = CategoryEngineService.detectCategory('Bookstore', 'Textbooks');
          expect(category).toBe('Education');
        });
      });

      describe('Miscellaneous', function() {
        it('should return Miscellaneous for unmatched keywords', function() {
          var category = CategoryEngineService.detectCategory('Unknown Merchant', 'Random purchase');
          expect(category).toBe('Miscellaneous');
        });

        it('should return Miscellaneous for empty strings', function() {
          var category = CategoryEngineService.detectCategory('', '');
          expect(category).toBe('Miscellaneous');
        });

        it('should return Miscellaneous for special characters', function() {
          var category = CategoryEngineService.detectCategory('###', '***');
          expect(category).toBe('Miscellaneous');
        });
      });

      it('should prioritize first matching category', function() {
        var category = CategoryEngineService.detectCategory('Restaurant in Hotel', 'Food and Travel');
        expect(category).toBe('Food & Dining');
      });
    });
  });
})();