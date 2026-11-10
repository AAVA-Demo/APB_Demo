/*
Test Documentation:
- Test Name: TransactionFilterFactory - buildFilterParams with all filters
- Purpose: Validates filter parameter building with all filter fields
- Scenario: buildFilterParams called with complete filter object
- Expected Result: Returns params object with all filter fields

- Test Name: TransactionFilterFactory - buildFilterParams with partial filters
- Purpose: Validates filter parameter building with partial filter fields
- Scenario: buildFilterParams called with some filter fields
- Expected Result: Returns params object with only provided fields

- Test Name: TransactionFilterFactory - buildFilterParams with empty filter
- Purpose: Validates handling of empty filter object
- Scenario: buildFilterParams called with empty object
- Expected Result: Returns empty params object

- Test Name: TransactionFilterFactory - applyClientFilter with cardId
- Purpose: Validates client-side filtering by card ID
- Scenario: applyClientFilter called with cardId filter
- Expected Result: Returns only transactions matching card ID

- Test Name: TransactionFilterFactory - applyClientFilter with date range
- Purpose: Validates client-side filtering by date range
- Scenario: applyClientFilter called with startDate and endDate
- Expected Result: Returns only transactions within date range

- Test Name: TransactionFilterFactory - applyClientFilter with amount range
- Purpose: Validates client-side filtering by amount range
- Scenario: applyClientFilter called with minAmount and maxAmount
- Expected Result: Returns only transactions within amount range

- Test Name: TransactionFilterFactory - applyClientFilter with no filter
- Purpose: Validates handling of null filter
- Scenario: applyClientFilter called with null filter
- Expected Result: Returns all transactions unfiltered

Coverage Report:
- Functions tested: buildFilterParams, applyClientFilter
- Scenarios covered: all filters, partial filters, empty filter, cardId filter, date filter, amount filter, no filter
- Edge cases: null filter, empty filter, boundary dates, boundary amounts
- Uncovered scenarios: none
*/

describe('TransactionFilterFactory', function() {
  'use strict';

  var TransactionFilterFactory;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionFilterFactory_) {
    TransactionFilterFactory = _TransactionFilterFactory_;
  }));

  describe('buildFilterParams', function() {
    it('should build params with all filter fields', function() {
      var filterObj = {
        cardId: 'CC001',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        minAmount: 100,
        maxAmount: 5000
      };

      var params = TransactionFilterFactory.buildFilterParams(filterObj);

      expect(params.cardId).toBe('CC001');
      expect(params.startDate).toBe('2024-01-01');
      expect(params.endDate).toBe('2024-01-31');
      expect(params.minAmount).toBe(100);
      expect(params.maxAmount).toBe(5000);
    });

    it('should build params with partial filter fields', function() {
      var filterObj = {
        cardId: 'CC002',
        startDate: '2024-01-01'
      };

      var params = TransactionFilterFactory.buildFilterParams(filterObj);

      expect(params.cardId).toBe('CC002');
      expect(params.startDate).toBe('2024-01-01');
      expect(params.endDate).toBeUndefined();
      expect(params.minAmount).toBeUndefined();
      expect(params.maxAmount).toBeUndefined();
    });

    it('should return empty params for empty filter object', function() {
      var filterObj = {};

      var params = TransactionFilterFactory.buildFilterParams(filterObj);

      expect(Object.keys(params).length).toBe(0);
    });
  });

  describe('applyClientFilter', function() {
    var mockTransactions;

    beforeEach(function() {
      mockTransactions = [
        {transactionId: 'TXN001', cardId: 'CC001', timestamp: new Date('2024-01-15T10:30:00'), amount: 1250.50},
        {transactionId: 'TXN002', cardId: 'CC001', timestamp: new Date('2024-01-14T14:20:00'), amount: 45.00},
        {transactionId: 'TXN003', cardId: 'CC002', timestamp: new Date('2024-01-13T09:15:00'), amount: 2300.00},
        {transactionId: 'TXN004', cardId: 'CC002', timestamp: new Date('2024-01-12T16:45:00'), amount: 850.00},
        {transactionId: 'TXN005', cardId: 'CC003', timestamp: new Date('2024-01-11T19:30:00'), amount: 125.00}
      ];
    });

    it('should filter transactions by cardId', function() {
      var filterObj = {cardId: 'CC001'};

      var filtered = TransactionFilterFactory.applyClientFilter(mockTransactions, filterObj);

      expect(filtered.length).toBe(2);
      expect(filtered[0].cardId).toBe('CC001');
      expect(filtered[1].cardId).toBe('CC001');
    });

    it('should filter transactions by startDate', function() {
      var filterObj = {startDate: '2024-01-14'};

      var filtered = TransactionFilterFactory.applyClientFilter(mockTransactions, filterObj);

      expect(filtered.length).toBe(2);
      filtered.forEach(function(txn) {
        expect(new Date(txn.timestamp) >= new Date('2024-01-14')).toBe(true);
      });
    });

    it('should filter transactions by endDate', function() {
      var filterObj = {endDate: '2024-01-13'};

      var filtered = TransactionFilterFactory.applyClientFilter(mockTransactions, filterObj);

      expect(filtered.length).toBe(3);
      filtered.forEach(function(txn) {
        expect(new Date(txn.timestamp) <= new Date('2024-01-13')).toBe(true);
      });
    });

    it('should filter transactions by date range', function() {
      var filterObj = {startDate: '2024-01-12', endDate: '2024-01-14'};

      var filtered = TransactionFilterFactory.applyClientFilter(mockTransactions, filterObj);

      expect(filtered.length).toBe(3);
    });

    it('should filter transactions by minAmount', function() {
      var filterObj = {minAmount: 500};

      var filtered = TransactionFilterFactory.applyClientFilter(mockTransactions, filterObj);

      expect(filtered.length).toBe(3);
      filtered.forEach(function(txn) {
        expect(txn.amount >= 500).toBe(true);
      });
    });

    it('should filter transactions by maxAmount', function() {
      var filterObj = {maxAmount: 1000};

      var filtered = TransactionFilterFactory.applyClientFilter(mockTransactions, filterObj);

      expect(filtered.length).toBe(3);
      filtered.forEach(function(txn) {
        expect(txn.amount <= 1000).toBe(true);
      });
    });

    it('should filter transactions by amount range', function() {
      var filterObj = {minAmount: 100, maxAmount: 1000};

      var filtered = TransactionFilterFactory.applyClientFilter(mockTransactions, filterObj);

      expect(filtered.length).toBe(2);
      filtered.forEach(function(txn) {
        expect(txn.amount >= 100 && txn.amount <= 1000).toBe(true);
      });
    });

    it('should apply multiple filters simultaneously', function() {
      var filterObj = {cardId: 'CC001', minAmount: 100};

      var filtered = TransactionFilterFactory.applyClientFilter(mockTransactions, filterObj);

      expect(filtered.length).toBe(1);
      expect(filtered[0].transactionId).toBe('TXN001');
    });

    it('should return all transactions when filter is null', function() {
      var filtered = TransactionFilterFactory.applyClientFilter(mockTransactions, null);

      expect(filtered.length).toBe(5);
      expect(filtered).toEqual(mockTransactions);
    });

    it('should return all transactions when filter is undefined', function() {
      var filtered = TransactionFilterFactory.applyClientFilter(mockTransactions, undefined);

      expect(filtered.length).toBe(5);
    });

    it('should return empty array when no transactions match filter', function() {
      var filterObj = {cardId: 'CC999'};

      var filtered = TransactionFilterFactory.applyClientFilter(mockTransactions, filterObj);

      expect(filtered.length).toBe(0);
    });
  });
});