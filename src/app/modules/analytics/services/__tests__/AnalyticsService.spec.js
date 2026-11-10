/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpending
- Purpose: Validates aggregation of spending by category
- Scenario: Transactions are categorized and aggregated
- Expected Result: Returns array of category spending with totals and percentages
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpending with caching
- Purpose: Validates caching mechanism for analytics data
- Scenario: First call fetches data, second call returns cached data
- Expected Result: Factory called once, cached data returned on subsequent calls
*/
/*
Coverage Report:
- Functions tested: getCategorySpending
- Scenarios covered: category aggregation, percentage calculation, caching, multiple categories
- Uncovered scenarios: none
*/

describe('AnalyticsService', function() {
  'use strict';
  
  beforeEach(module('creditCard.analytics'));
  
  var AnalyticsService, TransactionDataFactory, TransactionCategorizationService, $q, $rootScope;
  
  beforeEach(inject(function(_AnalyticsService_, _TransactionDataFactory_, _TransactionCategorizationService_, _$q_, _$rootScope_) {
    AnalyticsService = _AnalyticsService_;
    TransactionDataFactory = _TransactionDataFactory_;
    TransactionCategorizationService = _TransactionCategorizationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getCategorySpending', function() {
    it('should aggregate spending by category', function(done) {
      var mockTransactions = [
        { transactionId: 1, amount: 100, merchantCode: '5812' },
        { transactionId: 2, amount: 200, merchantCode: '5812' },
        { transactionId: 3, amount: 150, merchantCode: '5541' }
      ];
      
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(TransactionCategorizationService, 'categorize').and.callFake(function(t) {
        if (t.merchantCode === '5812') return 'Food & Dining';
        if (t.merchantCode === '5541') return 'Fuel';
        return 'Miscellaneous';
      });
      
      AnalyticsService.getCategorySpending().then(function(result) {
        expect(result.length).toBe(2);
        
        var foodDining = result.find(function(c) { return c.category === 'Food & Dining'; });
        expect(foodDining.totalAmount).toBe(300);
        expect(foodDining.transactionCount).toBe(2);
        expect(parseFloat(foodDining.percentage)).toBeCloseTo(66.67, 1);
        
        var fuel = result.find(function(c) { return c.category === 'Fuel'; });
        expect(fuel.totalAmount).toBe(150);
        expect(fuel.transactionCount).toBe(1);
        expect(parseFloat(fuel.percentage)).toBeCloseTo(33.33, 1);
        
        done();
      });
      
      $rootScope.$digest();
    });
    
    it('should return cached data on subsequent calls', function(done) {
      var mockTransactions = [
        { transactionId: 1, amount: 100, merchantCode: '5812' }
      ];
      
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(TransactionCategorizationService, 'categorize').and.returnValue('Food & Dining');
      
      AnalyticsService.getCategorySpending().then(function(result1) {
        AnalyticsService.getCategorySpending().then(function(result2) {
          expect(TransactionDataFactory.fetchTransactions.calls.count()).toBe(1);
          expect(result1).toEqual(result2);
          done();
        });
      });
      
      $rootScope.$digest();
    });
    
    it('should handle empty transaction list', function(done) {
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve([]));
      
      AnalyticsService.getCategorySpending().then(function(result) {
        expect(result.length).toBe(0);
        done();
      });
      
      $rootScope.$digest();
    });
  });
});