/*
Test Documentation:
- Test Name: transactionFilter - filter by search term
- Purpose: Validates filtering transactions by search term
- Scenario: Filter applied with search term matching merchant, description, or category
- Expected Result: Returns only matching transactions
*/
/*
Test Documentation:
- Test Name: transactionFilter - filter by cardId
- Purpose: Validates filtering transactions by card ID
- Scenario: Filter applied with specific card ID
- Expected Result: Returns only transactions for that card
*/
/*
Test Documentation:
- Test Name: transactionFilter - combined filters
- Purpose: Validates applying multiple filters simultaneously
- Scenario: Both search term and cardId filters applied
- Expected Result: Returns transactions matching both criteria
*/
/*
Test Documentation:
- Test Name: transactionFilter - case insensitive search
- Purpose: Validates case-insensitive search functionality
- Scenario: Search term with mixed case
- Expected Result: Matches regardless of case
*/
/*
Test Documentation:
- Test Name: transactionFilter - empty input handling
- Purpose: Validates handling of empty or null input
- Scenario: Filter called with null or empty array
- Expected Result: Returns empty array
*/
/*
Coverage Report:
- Functions tested: transactionFilter
- Scenarios covered: search term, cardId, combined filters, case sensitivity, empty input
- Uncovered scenarios: special characters, regex patterns
*/

(function() {
  'use strict';

  describe('transactionFilter', function() {
    var transactionFilter;

    beforeEach(module('app.transactions'));

    beforeEach(inject(function($filter) {
      transactionFilter = $filter('transactionFilter');
    }));

    var mockTransactions = [
      { id: 1, merchant: 'Starbucks Coffee', description: 'Morning coffee', category: 'Food & Dining', cardId: 'card1', amount: 5.50 },
      { id: 2, merchant: 'Shell Gas Station', description: 'Fuel purchase', category: 'Fuel', cardId: 'card2', amount: 45.00 },
      { id: 3, merchant: 'Amazon', description: 'Online shopping', category: 'Shopping', cardId: 'card1', amount: 120.00 },
      { id: 4, merchant: 'Whole Foods', description: 'Groceries', category: 'Food & Dining', cardId: 'card3', amount: 85.00 }
    ];

    describe('search term filtering', function() {
      it('should filter by merchant name', function() {
        var result = transactionFilter(mockTransactions, 'starbucks', null);
        expect(result.length).toBe(1);
        expect(result[0].merchant).toBe('Starbucks Coffee');
      });

      it('should filter by description', function() {
        var result = transactionFilter(mockTransactions, 'groceries', null);
        expect(result.length).toBe(1);
        expect(result[0].merchant).toBe('Whole Foods');
      });

      it('should filter by category', function() {
        var result = transactionFilter(mockTransactions, 'fuel', null);
        expect(result.length).toBe(1);
        expect(result[0].category).toBe('Fuel');
      });

      it('should be case insensitive', function() {
        var result = transactionFilter(mockTransactions, 'AMAZON', null);
        expect(result.length).toBe(1);
        expect(result[0].merchant).toBe('Amazon');
      });

      it('should return all transactions when search term is empty', function() {
        var result = transactionFilter(mockTransactions, '', null);
        expect(result.length).toBe(4);
      });

      it('should return empty array when no matches found', function() {
        var result = transactionFilter(mockTransactions, 'nonexistent', null);
        expect(result.length).toBe(0);
      });
    });

    describe('cardId filtering', function() {
      it('should filter by cardId', function() {
        var result = transactionFilter(mockTransactions, null, 'card1');
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('card1');
        expect(result[1].cardId).toBe('card1');
      });

      it('should return all transactions when cardId is null', function() {
        var result = transactionFilter(mockTransactions, null, null);
        expect(result.length).toBe(4);
      });
    });

    describe('combined filtering', function() {
      it('should apply both search term and cardId filters', function() {
        var result = transactionFilter(mockTransactions, 'coffee', 'card1');
        expect(result.length).toBe(1);
        expect(result[0].merchant).toBe('Starbucks Coffee');
        expect(result[0].cardId).toBe('card1');
      });

      it('should return empty array when combined filters match nothing', function() {
        var result = transactionFilter(mockTransactions, 'amazon', 'card2');
        expect(result.length).toBe(0);
      });
    });

    describe('edge cases', function() {
      it('should return empty array for null transactions', function() {
        var result = transactionFilter(null, 'test', null);
        expect(result).toEqual([]);
      });

      it('should return empty array for undefined transactions', function() {
        var result = transactionFilter(undefined, 'test', null);
        expect(result).toEqual([]);
      });

      it('should handle transactions with missing fields', function() {
        var incompleteTransactions = [
          { id: 1, merchant: 'Test' },
          { id: 2, description: 'Test' },
          { id: 3, category: 'Test' }
        ];
        var result = transactionFilter(incompleteTransactions, 'test', null);
        expect(result.length).toBe(3);
      });
    });
  });
})();