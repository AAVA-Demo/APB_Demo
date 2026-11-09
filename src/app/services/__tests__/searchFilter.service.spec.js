/*
Test Documentation:
- Test Name: searchFilterService - applyFilter
- Purpose: Validates transaction filtering by multiple criteria
- Scenario: Tests date range, card ID, amount range, merchant, category filters
- Expected Result: Returns correctly filtered transactions based on criteria
*/
/*
Coverage Report:
- Functions tested: applyFilter
- Scenarios covered: date filtering, card filtering, amount filtering, merchant filtering, category filtering, empty input
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
        { transactionId: '1', transactionDate: '2023-01-15', amount: 100, cardId: 'card1', merchant: 'Restaurant A', category: 'Food & Dining' },
        { transactionId: '2', transactionDate: '2023-02-10', amount: 50, cardId: 'card2', merchant: 'Gas Station', category: 'Fuel' },
        { transactionId: '3', transactionDate: '2023-03-05', amount: 200, cardId: 'card1', merchant: 'Shopping Mall', category: 'Shopping' }
      ];
    });

    it('should return all transactions when no filter applied', function() {
      var result = searchFilterService.applyFilter(transactions, {});

      expect(result.length).toBe(3);
    });

    it('should filter by dateFrom', function() {
      var filter = { dateFrom: '2023-02-01' };

      var result = searchFilterService.applyFilter(transactions, filter);

      expect(result.length).toBe(2);
      expect(result[0].transactionId).toBe('2');
    });

    it('should filter by dateTo', function() {
      var filter = { dateTo: '2023-02-28' };

      var result = searchFilterService.applyFilter(transactions, filter);

      expect(result.length).toBe(2);
      expect(result[1].transactionId).toBe('2');
    });

    it('should filter by cardId', function() {
      var filter = { cardId: 'card1' };

      var result = searchFilterService.applyFilter(transactions, filter);

      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card1');
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
      var filter = { merchant: 'restaurant' };

      var result = searchFilterService.applyFilter(transactions, filter);

      expect(result.length).toBe(1);
      expect(result[0].merchant).toBe('Restaurant A');
    });

    it('should filter by category', function() {
      var filter = { category: 'Fuel' };

      var result = searchFilterService.applyFilter(transactions, filter);

      expect(result.length).toBe(1);
      expect(result[0].category).toBe('Fuel');
    });

    it('should apply multiple filters', function() {
      var filter = {
        dateFrom: '2023-01-01',
        dateTo: '2023-02-28',
        cardId: 'card1'
      };

      var result = searchFilterService.applyFilter(transactions, filter);

      expect(result.length).toBe(1);
      expect(result[0].transactionId).toBe('1');
    });

    it('should return empty array for empty transactions', function() {
      var result = searchFilterService.applyFilter([], {});

      expect(result.length).toBe(0);
    });

    it('should return empty array for null transactions', function() {
      var result = searchFilterService.applyFilter(null, {});

      expect(result.length).toBe(0);
    });
  });
});