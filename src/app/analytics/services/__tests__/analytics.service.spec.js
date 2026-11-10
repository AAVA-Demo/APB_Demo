/*
Test Documentation:
- Test Name: AnalyticsService Unit Tests
- Purpose: Validate analytics data aggregation including category-wise spending and monthly trends
- Scenario: Tests cover data aggregation, category filtering, spending calculations, and trend analysis
- Expected Result: Analytics data is accurately aggregated with proper category and time-based grouping
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, $q, $rootScope, DataWarehouseService, CategorizationService;

    beforeEach(module('app.analytics'));

    beforeEach(function() {
      DataWarehouseService = {
        getHistoricalTransactions: jasmine.createSpy('getHistoricalTransactions')
      };
      
      CategorizationService = {
        getCategoryMappings: jasmine.createSpy('getCategoryMappings')
      };
      
      module(function($provide) {
        $provide.value('DataWarehouseService', DataWarehouseService);
        $provide.value('CategorizationService', CategorizationService);
      });
    });

    beforeEach(inject(function(_AnalyticsService_, _$q_, _$rootScope_) {
      AnalyticsService = _AnalyticsService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getAnalyticsData', function() {
      it('should aggregate spending by category', function() {
        var mockTransactions = [
          { transactionId: 'txn-001', amount: 2500, category: 'Food & Dining', transactionType: 'Debit', transactionDate: new Date() },
          { transactionId: 'txn-002', amount: 1800, category: 'Food & Dining', transactionType: 'Debit', transactionDate: new Date() },
          { transactionId: 'txn-003', amount: 3000, category: 'Shopping', transactionType: 'Debit', transactionDate: new Date() }
        ];
        var mockCategories = ['Food & Dining', 'Shopping', 'Travel'];
        
        DataWarehouseService.getHistoricalTransactions.and.returnValue($q.resolve(mockTransactions));
        CategorizationService.getCategoryMappings.and.returnValue($q.resolve(mockCategories));
        
        var result;
        AnalyticsService.getAnalyticsData({}, null).then(function(data) {
          result = data;
        });
        
        $rootScope.$digest();
        
        expect(result.categorySpending).toBeDefined();
        expect(result.categorySpending.length).toBe(3);
        
        var foodDining = result.categorySpending.find(function(c) { return c.category === 'Food & Dining'; });
        expect(foodDining.totalSpend).toBe(4300);
        expect(foodDining.transactionCount).toBe(2);
      });

      it('should calculate percentage of total for each category', function() {
        var mockTransactions = [
          { transactionId: 'txn-001', amount: 5000, category: 'Food & Dining', transactionType: 'Debit', transactionDate: new Date() },
          { transactionId: 'txn-002', amount: 5000, category: 'Shopping', transactionType: 'Debit', transactionDate: new Date() }
        ];
        var mockCategories = ['Food & Dining', 'Shopping'];
        
        DataWarehouseService.getHistoricalTransactions.and.returnValue($q.resolve(mockTransactions));
        CategorizationService.getCategoryMappings.and.returnValue($q.resolve(mockCategories));
        
        var result;
        AnalyticsService.getAnalyticsData({}, null).then(function(data) {
          result = data;
        });
        
        $rootScope.$digest();
        
        result.categorySpending.forEach(function(cat) {
          if (cat.totalSpend > 0) {
            expect(cat.percentageOfTotal).toBe(50);
          }
        });
      });

      it('should filter transactions by category when categoryFilter is provided', function() {
        var mockTransactions = [
          { transactionId: 'txn-001', amount: 2500, category: 'Food & Dining', transactionType: 'Debit', transactionDate: new Date() },
          { transactionId: 'txn-002', amount: 3000, category: 'Shopping', transactionType: 'Debit', transactionDate: new Date() }
        ];
        var mockCategories = ['Food & Dining', 'Shopping'];
        
        DataWarehouseService.getHistoricalTransactions.and.returnValue($q.resolve(mockTransactions));
        CategorizationService.getCategoryMappings.and.returnValue($q.resolve(mockCategories));
        
        var result;
        AnalyticsService.getAnalyticsData({}, 'Food & Dining').then(function(data) {
          result = data;
        });
        
        $rootScope.$digest();
        
        expect(result.totalSpend).toBe(2500);
      });

      it('should aggregate spending by month', function() {
        var date1 = new Date(2024, 0, 15);
        var date2 = new Date(2024, 0, 20);
        var date3 = new Date(2024, 1, 10);
        
        var mockTransactions = [
          { transactionId: 'txn-001', amount: 2500, category: 'Food & Dining', transactionType: 'Debit', transactionDate: date1 },
          { transactionId: 'txn-002', amount: 1800, category: 'Shopping', transactionType: 'Debit', transactionDate: date2 },
          { transactionId: 'txn-003', amount: 3000, category: 'Travel', transactionType: 'Debit', transactionDate: date3 }
        ];
        var mockCategories = ['Food & Dining', 'Shopping', 'Travel'];
        
        DataWarehouseService.getHistoricalTransactions.and.returnValue($q.resolve(mockTransactions));
        CategorizationService.getCategoryMappings.and.returnValue($q.resolve(mockCategories));
        
        var result;
        AnalyticsService.getAnalyticsData({}, null).then(function(data) {
          result = data;
        });
        
        $rootScope.$digest();
        
        expect(result.monthlyTrends).toBeDefined();
        expect(result.monthlyTrends.length).toBe(2);
        expect(result.monthlyTrends[0].month).toBe('2024-01');
        expect(result.monthlyTrends[0].totalSpend).toBe(4300);
      });

      it('should only count Debit transactions', function() {
        var mockTransactions = [
          { transactionId: 'txn-001', amount: 2500, category: 'Food & Dining', transactionType: 'Debit', transactionDate: new Date() },
          { transactionId: 'txn-002', amount: 1000, category: 'Food & Dining', transactionType: 'Credit', transactionDate: new Date() },
          { transactionId: 'txn-003', amount: 1800, category: 'Shopping', transactionType: 'Debit', transactionDate: new Date() }
        ];
        var mockCategories = ['Food & Dining', 'Shopping'];
        
        DataWarehouseService.getHistoricalTransactions.and.returnValue($q.resolve(mockTransactions));
        CategorizationService.getCategoryMappings.and.returnValue($q.resolve(mockCategories));
        
        var result;
        AnalyticsService.getAnalyticsData({}, null).then(function(data) {
          result = data;
        });
        
        $rootScope.$digest();
        
        expect(result.totalSpend).toBe(4300);
      });

      it('should handle transactions with Miscellaneous category', function() {
        var mockTransactions = [
          { transactionId: 'txn-001', amount: 2500, category: null, transactionType: 'Debit', transactionDate: new Date() }
        ];
        var mockCategories = ['Food & Dining', 'Miscellaneous'];
        
        DataWarehouseService.getHistoricalTransactions.and.returnValue($q.resolve(mockTransactions));
        CategorizationService.getCategoryMappings.and.returnValue($q.resolve(mockCategories));
        
        var result;
        AnalyticsService.getAnalyticsData({}, null).then(function(data) {
          result = data;
        });
        
        $rootScope.$digest();
        
        var misc = result.categorySpending.find(function(c) { return c.category === 'Miscellaneous'; });
        expect(misc.totalSpend).toBe(2500);
      });

      it('should return dateRange in result', function() {
        var dateRange = { start: new Date(2024, 0, 1), end: new Date(2024, 11, 31) };
        var mockTransactions = [];
        var mockCategories = ['Food & Dining'];
        
        DataWarehouseService.getHistoricalTransactions.and.returnValue($q.resolve(mockTransactions));
        CategorizationService.getCategoryMappings.and.returnValue($q.resolve(mockCategories));
        
        var result;
        AnalyticsService.getAnalyticsData(dateRange, null).then(function(data) {
          result = data;
        });
        
        $rootScope.$digest();
        
        expect(result.dateRange).toEqual(dateRange);
      });

      it('should handle empty transactions array', function() {
        var mockTransactions = [];
        var mockCategories = ['Food & Dining', 'Shopping'];
        
        DataWarehouseService.getHistoricalTransactions.and.returnValue($q.resolve(mockTransactions));
        CategorizationService.getCategoryMappings.and.returnValue($q.resolve(mockCategories));
        
        var result;
        AnalyticsService.getAnalyticsData({}, null).then(function(data) {
          result = data;
        });
        
        $rootScope.$digest();
        
        expect(result.totalSpend).toBe(0);
        expect(result.categorySpending.length).toBe(2);
        result.categorySpending.forEach(function(cat) {
          expect(cat.totalSpend).toBe(0);
        });
      });

      it('should sort monthly trends chronologically', function() {
        var date1 = new Date(2024, 2, 15);
        var date2 = new Date(2024, 0, 15);
        var date3 = new Date(2024, 1, 15);
        
        var mockTransactions = [
          { transactionId: 'txn-001', amount: 1000, category: 'Food & Dining', transactionType: 'Debit', transactionDate: date1 },
          { transactionId: 'txn-002', amount: 1000, category: 'Shopping', transactionType: 'Debit', transactionDate: date2 },
          { transactionId: 'txn-003', amount: 1000, category: 'Travel', transactionType: 'Debit', transactionDate: date3 }
        ];
        var mockCategories = ['Food & Dining', 'Shopping', 'Travel'];
        
        DataWarehouseService.getHistoricalTransactions.and.returnValue($q.resolve(mockTransactions));
        CategorizationService.getCategoryMappings.and.returnValue($q.resolve(mockCategories));
        
        var result;
        AnalyticsService.getAnalyticsData({}, null).then(function(data) {
          result = data;
        });
        
        $rootScope.$digest();
        
        expect(result.monthlyTrends[0].month).toBe('2024-01');
        expect(result.monthlyTrends[1].month).toBe('2024-02');
        expect(result.monthlyTrends[2].month).toBe('2024-03');
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getAnalyticsData
- Scenarios covered:
  * Category-wise spending aggregation
  * Percentage calculation
  * Category filtering
  * Monthly trend aggregation
  * Debit vs Credit filtering
  * Miscellaneous category handling
  * Date range inclusion in result
  * Empty transactions handling
  * Chronological sorting of trends
- Uncovered scenarios: None - all analytics aggregation logic tested
- Edge cases: Empty arrays, null categories, mixed transaction types, multiple months
*/