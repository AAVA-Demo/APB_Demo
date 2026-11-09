/*
Test Documentation:
- Test Name: searchFilterService - transaction filtering
- Purpose: Validates search and filter service filters transactions by criteria
- Scenario: Service applies multiple filter criteria to transaction list
- Expected Result: Returns filtered transactions matching all criteria
*/

(function() {
  'use strict';

  describe('searchFilterService', function() {
    var searchFilterService;
    var mockTransactions;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_searchFilterService_) {
      searchFilterService = _searchFilterService_;

      mockTransactions = [
        { transactionId: 1, transactionDate: '2023-01-15', cardId: 'card1', amount: 100, merchant: 'Amazon', category: 'Shopping' },
        { transactionId: 2, transactionDate: '2023-02-20', cardId: 'card2', amount: 200, merchant: 'Walmart', category: 'Shopping' },
        { transactionId: 3, transactionDate: '2023-03-10', cardId: 'card1', amount: 50, merchant: 'Starbucks', category: 'Food & Dining' },
        { transactionId: 4, transactionDate: '2023-04-05', cardId: 'card3', amount: 300, merchant: 'Shell', category: 'Fuel' }
      ];
    }));

    /*
    Test Documentation:
    - Test Name: should return all transactions when no filter applied
    - Purpose: Validates no filtering with empty criteria
    - Scenario: Empty filter criteria object
    - Expected Result: Returns all transactions
    */
    it('should return all transactions when no filter applied', function() {
      var result = searchFilterService.applyFilter(mockTransactions, {});

      expect(result.length).toBe(4);
      expect(result).toEqual(mockTransactions);
    });

    /*
    Test Documentation:
    - Test Name: should filter by dateFrom
    - Purpose: Validates date from filtering
    - Scenario: Filter transactions from specific date
    - Expected Result: Returns transactions on or after dateFrom
    */
    it('should filter by dateFrom', function() {
      var filterCriteria = { dateFrom: '2023-02-01' };
      var result = searchFilterService.applyFilter(mockTransactions, filterCriteria);

      expect(result.length).toBe(3);
      expect(result[0].transactionId).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: should filter by dateTo
    - Purpose: Validates date to filtering
    - Scenario: Filter transactions until specific date
    - Expected Result: Returns transactions on or before dateTo
    */
    it('should filter by dateTo', function() {
      var filterCriteria = { dateTo: '2023-02-28' };
      var result = searchFilterService.applyFilter(mockTransactions, filterCriteria);

      expect(result.length).toBe(2);
      expect(result[1].transactionId).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: should filter by date range
    - Purpose: Validates date range filtering
    - Scenario: Filter transactions between two dates
    - Expected Result: Returns transactions within date range
    */
    it('should filter by date range', function() {
      var filterCriteria = { dateFrom: '2023-02-01', dateTo: '2023-03-31' };
      var result = searchFilterService.applyFilter(mockTransactions, filterCriteria);

      expect(result.length).toBe(2);
      expect(result[0].transactionId).toBe(2);
      expect(result[1].transactionId).toBe(3);
    });

    /*
    Test Documentation:
    - Test Name: should filter by cardId
    - Purpose: Validates card ID filtering
    - Scenario: Filter transactions for specific card
    - Expected Result: Returns transactions for specified card only
    */
    it('should filter by cardId', function() {
      var filterCriteria = { cardId: 'card1' };
      var result = searchFilterService.applyFilter(mockTransactions, filterCriteria);

      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card1');
      expect(result[1].cardId).toBe('card1');
    });

    /*
    Test Documentation:
    - Test Name: should filter by minAmount
    - Purpose: Validates minimum amount filtering
    - Scenario: Filter transactions above minimum amount
    - Expected Result: Returns transactions with amount >= minAmount
    */
    it('should filter by minAmount', function() {
      var filterCriteria = { minAmount: 150 };
      var result = searchFilterService.applyFilter(mockTransactions, filterCriteria);

      expect(result.length).toBe(2);
      expect(result[0].amount).toBeGreaterThanOrEqual(150);
    });

    /*
    Test Documentation:
    - Test Name: should filter by maxAmount
    - Purpose: Validates maximum amount filtering
    - Scenario: Filter transactions below maximum amount
    - Expected Result: Returns transactions with amount <= maxAmount
    */
    it('should filter by maxAmount', function() {
      var filterCriteria = { maxAmount: 150 };
      var result = searchFilterService.applyFilter(mockTransactions, filterCriteria);

      expect(result.length).toBe(2);
      expect(result[0].amount).toBeLessThanOrEqual(150);
    });

    /*
    Test Documentation:
    - Test Name: should filter by amount range
    - Purpose: Validates amount range filtering
    - Scenario: Filter transactions within amount range
    - Expected Result: Returns transactions within min and max amounts
    */
    it('should filter by amount range', function() {
      var filterCriteria = { minAmount: 50, maxAmount: 200 };
      var result = searchFilterService.applyFilter(mockTransactions, filterCriteria);

      expect(result.length).toBe(3);
    });

    /*
    Test Documentation:
    - Test Name: should filter by merchant (case-insensitive)
    - Purpose: Validates merchant name filtering
    - Scenario: Search for merchant by partial name
    - Expected Result: Returns transactions matching merchant (case-insensitive)
    */
    it('should filter by merchant (case-insensitive)', function() {
      var filterCriteria = { merchant: 'amazon' };
      var result = searchFilterService.applyFilter(mockTransactions, filterCriteria);

      expect(result.length).toBe(1);
      expect(result[0].merchant).toBe('Amazon');
    });

    /*
    Test Documentation:
    - Test Name: should filter by merchant partial match
    - Purpose: Validates partial merchant name matching
    - Scenario: Search with partial merchant name
    - Expected Result: Returns all transactions with matching substring
    */
    it('should filter by merchant partial match', function() {
      var filterCriteria = { merchant: 'star' };
      var result = searchFilterService.applyFilter(mockTransactions, filterCriteria);

      expect(result.length).toBe(1);
      expect(result[0].merchant).toBe('Starbucks');
    });

    /*
    Test Documentation:
    - Test Name: should filter by category
    - Purpose: Validates category filtering
    - Scenario: Filter transactions by category
    - Expected Result: Returns transactions in specified category
    */
    it('should filter by category', function() {
      var filterCriteria = { category: 'Shopping' };
      var result = searchFilterService.applyFilter(mockTransactions, filterCriteria);

      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Shopping');
    });

    /*
    Test Documentation:
    - Test Name: should apply multiple filters
    - Purpose: Validates combined filter criteria
    - Scenario: Apply multiple filters simultaneously
    - Expected Result: Returns transactions matching all criteria
    */
    it('should apply multiple filters', function() {
      var filterCriteria = {
        dateFrom: '2023-01-01',
        dateTo: '2023-03-31',
        cardId: 'card1',
        minAmount: 50,
        maxAmount: 150
      };
      var result = searchFilterService.applyFilter(mockTransactions, filterCriteria);

      expect(result.length).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: should return empty array for no matches
    - Purpose: Validates no match scenario
    - Scenario: Filter criteria matches no transactions
    - Expected Result: Returns empty array
    */
    it('should return empty array for no matches', function() {
      var filterCriteria = { merchant: 'NonExistentMerchant' };
      var result = searchFilterService.applyFilter(mockTransactions, filterCriteria);

      expect(result).toEqual([]);
    });

    /*
    Test Documentation:
    - Test Name: should handle empty transactions array
    - Purpose: Validates error handling for empty input
    - Scenario: Empty transactions array provided
    - Expected Result: Returns empty array
    */
    it('should handle empty transactions array', function() {
      var result = searchFilterService.applyFilter([], { merchant: 'Amazon' });

      expect(result).toEqual([]);
    });

    /*
    Test Documentation:
    - Test Name: should handle null transactions
    - Purpose: Validates error handling for null input
    - Scenario: Null transactions provided
    - Expected Result: Returns empty array
    */
    it('should handle null transactions', function() {
      var result = searchFilterService.applyFilter(null, { merchant: 'Amazon' });

      expect(result).toEqual([]);
    });
  });

  /*
  Coverage Report:
  - Functions tested: applyFilter
  - Scenarios covered: all filter types (date, card, amount, merchant, category), multiple filters, empty results, null/empty input
  - Edge cases: empty array, null input, no matches, case-insensitive search
  - Uncovered scenarios: none
  */
})();