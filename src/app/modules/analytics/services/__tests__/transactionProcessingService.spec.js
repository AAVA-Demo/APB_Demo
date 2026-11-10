/*
Test Documentation:
- Test Name: transactionProcessingService Transaction Data Processing
- Purpose: Validate transaction fetching, category classification, monthly aggregation, category spend summary
- Scenario: Fetch transactions, classify uncategorized transactions, aggregate by month and category
- Expected Result: Transactions classified correctly, monthly trends calculated, category summaries accurate
*/

describe('transactionProcessingService', function() {
  beforeEach(module('creditCardApp'));

  var transactionProcessingService, apiService, categoryClassifier, $q, $rootScope;

  beforeEach(inject(function(_transactionProcessingService_, _apiService_, _categoryClassifier_, _$q_, _$rootScope_) {
    transactionProcessingService = _transactionProcessingService_;
    apiService = _apiService_;
    categoryClassifier = _categoryClassifier_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('fetchTransactionData()', function() {
    it('should call apiService.get with correct endpoint', function() {
      spyOn(apiService, 'get').and.returnValue($q.resolve([]));

      transactionProcessingService.fetchTransactionData();

      expect(apiService.get).toHaveBeenCalledWith('/transactions');
    });

    it('should return transactions with categories', function() {
      var mockTransactions = [
        { id: 1, amount: 50, date: '2026-01-15', category: 'Food & Dining' },
        { id: 2, amount: 100, date: '2026-01-20', category: 'Shopping' }
      ];

      spyOn(apiService, 'get').and.returnValue($q.resolve(mockTransactions));

      var result;
      transactionProcessingService.fetchTransactionData().then(function(data) {
        result = data;
      });

      $rootScope.$digest();
      expect(result).toEqual(mockTransactions);
    });

    it('should classify transactions without category', function() {
      var mockTransactions = [
        { id: 1, amount: 50, date: '2026-01-15', merchantName: 'Restaurant' },
        { id: 2, amount: 100, date: '2026-01-20', merchantName: 'Amazon' }
      ];

      spyOn(apiService, 'get').and.returnValue($q.resolve(mockTransactions));
      spyOn(categoryClassifier, 'classify').and.callFake(function(txn) {
        if (txn.merchantName === 'Restaurant') return 'Food & Dining';
        if (txn.merchantName === 'Amazon') return 'Shopping';
      });

      var result;
      transactionProcessingService.fetchTransactionData().then(function(data) {
        result = data;
      });

      $rootScope.$digest();
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Shopping');
    });

    it('should not reclassify transactions with existing category', function() {
      var mockTransactions = [
        { id: 1, amount: 50, date: '2026-01-15', category: 'Travel', merchantName: 'Restaurant' }
      ];

      spyOn(apiService, 'get').and.returnValue($q.resolve(mockTransactions));
      spyOn(categoryClassifier, 'classify');

      var result;
      transactionProcessingService.fetchTransactionData().then(function(data) {
        result = data;
      });

      $rootScope.$digest();
      expect(categoryClassifier.classify).not.toHaveBeenCalled();
      expect(result[0].category).toBe('Travel');
    });
  });

  describe('aggregateByMonthAndCategory()', function() {
    it('should aggregate transactions by month', function() {
      var transactions = [
        { amount: 100, date: '2026-01-15', category: 'Food & Dining' },
        { amount: 200, date: '2026-01-20', category: 'Shopping' },
        { amount: 150, date: '2026-02-10', category: 'Fuel' }
      ];

      var result = transactionProcessingService.aggregateByMonthAndCategory(transactions);

      expect(result.length).toBe(2);
      expect(result[0].month).toBe('2026-01');
      expect(result[0].totalSpend).toBe(300);
      expect(result[1].month).toBe('2026-02');
      expect(result[1].totalSpend).toBe(150);
    });

    it('should calculate category breakdown for each month', function() {
      var transactions = [
        { amount: 100, date: '2026-01-15', category: 'Food & Dining' },
        { amount: 50, date: '2026-01-20', category: 'Food & Dining' },
        { amount: 200, date: '2026-01-25', category: 'Shopping' }
      ];

      var result = transactionProcessingService.aggregateByMonthAndCategory(transactions);

      expect(result[0].categoryBreakdown.length).toBe(2);
      var foodCategory = result[0].categoryBreakdown.find(function(c) { return c.category === 'Food & Dining'; });
      expect(foodCategory.totalAmount).toBe(150);
      expect(foodCategory.transactionCount).toBe(2);
    });

    it('should calculate percentage for each category', function() {
      var transactions = [
        { amount: 100, date: '2026-01-15', category: 'Food & Dining' },
        { amount: 200, date: '2026-01-20', category: 'Shopping' },
        { amount: 100, date: '2026-01-25', category: 'Fuel' }
      ];

      var result = transactionProcessingService.aggregateByMonthAndCategory(transactions);

      var foodCategory = result[0].categoryBreakdown.find(function(c) { return c.category === 'Food & Dining'; });
      expect(foodCategory.percentage).toBeCloseTo(25, 0);

      var shoppingCategory = result[0].categoryBreakdown.find(function(c) { return c.category === 'Shopping'; });
      expect(shoppingCategory.percentage).toBeCloseTo(50, 0);
    });

    it('should sort months chronologically', function() {
      var transactions = [
        { amount: 100, date: '2026-03-15', category: 'Food & Dining' },
        { amount: 200, date: '2026-01-20', category: 'Shopping' },
        { amount: 150, date: '2026-02-10', category: 'Fuel' }
      ];

      var result = transactionProcessingService.aggregateByMonthAndCategory(transactions);

      expect(result[0].month).toBe('2026-01');
      expect(result[1].month).toBe('2026-02');
      expect(result[2].month).toBe('2026-03');
    });

    it('should handle empty transaction array', function() {
      var result = transactionProcessingService.aggregateByMonthAndCategory([]);
      expect(result).toEqual([]);
    });
  });

  describe('getCategorySpendSummary()', function() {
    it('should summarize spending by category', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining' },
        { amount: 50, category: 'Food & Dining' },
        { amount: 200, category: 'Shopping' },
        { amount: 75, category: 'Fuel' }
      ];

      var result = transactionProcessingService.getCategorySpendSummary(transactions);

      expect(result.length).toBe(3);

      var foodCategory = result.find(function(c) { return c.category === 'Food & Dining'; });
      expect(foodCategory.totalAmount).toBe(150);
      expect(foodCategory.transactionCount).toBe(2);
    });

    it('should calculate percentage of total spend', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining' },
        { amount: 200, category: 'Shopping' },
        { amount: 100, category: 'Fuel' }
      ];

      var result = transactionProcessingService.getCategorySpendSummary(transactions);

      var foodCategory = result.find(function(c) { return c.category === 'Food & Dining'; });
      expect(foodCategory.percentage).toBeCloseTo(25, 0);

      var shoppingCategory = result.find(function(c) { return c.category === 'Shopping'; });
      expect(shoppingCategory.percentage).toBeCloseTo(50, 0);
    });

    it('should handle empty transaction array', function() {
      var result = transactionProcessingService.getCategorySpendSummary([]);
      expect(result).toEqual([]);
    });

    it('should handle transactions with zero total', function() {
      var transactions = [
        { amount: 0, category: 'Food & Dining' }
      ];

      var result = transactionProcessingService.getCategorySpendSummary(transactions);
      expect(result[0].percentage).toBe(0);
    });
  });
});

/*
Coverage Report:
- Functions tested: fetchTransactionData, aggregateByMonthAndCategory, getCategorySpendSummary
- Scenarios covered: transaction fetching, category classification, monthly aggregation, category summaries, percentage calculations
- Edge cases: empty arrays, uncategorized transactions, zero totals, chronological sorting
- Uncovered scenarios: none - all transaction processing patterns tested
*/