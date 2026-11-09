/*
Test Documentation:
- Test Name: searchFilterService - applyFilter
- Purpose: Validates transaction filtering with multiple criteria
- Scenario: Tests date range, card, amount, merchant, category filters
- Expected Result: Returns filtered transactions matching all criteria
*/
/*
Coverage Report:
- Functions tested: applyFilter
- Scenarios covered: date filtering, card filtering, amount range, merchant search, category filter, combined filters, empty input
- Uncovered scenarios: none
*/

describe('searchFilterService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var searchFilterService;

  beforeEach(inject(function(_searchFilterService_) {
    searchFilterService = _searchFilterService_;
  }));

  describe('applyFilter', function() {
    var transactions;

    beforeEach(function() {
      transactions = [
        { transactionId: '1', transactionDate: '2023-01-15', amount: 100, cardId: 'card1', merchant: 'Restaurant', category: 'Food & Dining' },
        { transactionId: '2', transactionDate: '2023-02-10', amount: 50, cardId: 'card2', merchant: 'Gas Station', category: 'Fuel' },
        { transactionId: '3', transactionDate: '2023-03-05', amount: 200, cardId: 'card1', merchant: 'Mall', category: 'Shopping' }
      ];
    });

    it('should return all transactions when no filter', function() {
      var result = searchFilterService.applyFilter(transactions, {});

      expect(result.length).toBe(3);
    });

    it('should filter by dateFrom', function() {
      var filter = { dateFrom: '2023-02-01' };

      var result = searchFilterService.applyFilter(transactions, filter);

      expect(result.length).toBe(2);
    });

    it('should filter by dateTo', function() {
      var filter = { dateTo: '2023-02-28' };

      var result = searchFilterService.applyFilter(transactions, filter);

      expect(result.length).toBe(2);
    });

    it('should filter by cardId', function() {
      var filter = { cardId: 'card1' };

      var result = searchFilterService.applyFilter(transactions, filter);

      expect(result.length).toBe(2);
    });

    it('should filter by minAmount', function() {
      var filter = { minAmount: 100 };

      var result = searchFilterService.applyFilter(transactions, filter);

      expect(result.length).toBe(2);
    });

    it('should filter by maxAmount', function() {
      var filter = { maxAmount: 100 };

      var result = searchFilterService.applyFilter(transactions, filter);

      expect(result.length).toBe(2);
    });

    it('should filter by merchant', function() {
      var filter = { merchant: 'Restaurant' };

      var result = searchFilterService.applyFilter(transactions, filter);

      expect(result.length).toBe(1);
    });

    it('should filter by category', function() {
      var filter = { category: 'Fuel' };

      var result = searchFilterService.applyFilter(transactions, filter);

      expect(result.length).toBe(1);
    });

    it('should apply multiple filters', function() {
      var filter = { dateFrom: '2023-01-01', cardId: 'card1' };

      var result = searchFilterService.applyFilter(transactions, filter);

      expect(result.length).toBe(2);
    });

    it('should return empty for no match', function() {
      var filter = { cardId: 'card999' };

      var result = searchFilterService.applyFilter(transactions, filter);

      expect(result.length).toBe(0);
    });

    it('should handle empty transactions', function() {
      var result = searchFilterService.applyFilter([], {});

      expect(result.length).toBe(0);
    });
  });
});