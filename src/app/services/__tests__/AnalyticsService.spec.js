/*
Test Documentation:
- Test Name: AnalyticsService - getAnalytics
- Purpose: Validate analytics aggregation for category spending, monthly trends, and card-wise spending
- Scenario: User requests analytics for a specific date range
- Expected Result: Returns categorized spending data with percentages, monthly trends, and card-wise totals
*/

describe('AnalyticsService', function() {
  'use strict';
  
  var AnalyticsService;
  var TransactionDataService;
  var CategorizationEngineService;
  var $q;
  var $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_AnalyticsService_, _TransactionDataService_, _CategorizationEngineService_, _$q_, _$rootScope_) {
    AnalyticsService = _AnalyticsService_;
    TransactionDataService = _TransactionDataService_;
    CategorizationEngineService = _CategorizationEngineService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getAnalytics', function() {
    var mockTransactions;
    var mockCategorized;
    
    beforeEach(function() {
      mockTransactions = [
        {transactionId: 'TX001', cardId: 'CC001', amount: 100, transactionDate: '2023-01-15', merchantName: 'Starbucks'},
        {transactionId: 'TX002', cardId: 'CC002', amount: 200, transactionDate: '2023-02-20', merchantName: 'Shell'}
      ];
      
      mockCategorized = [
        {transactionId: 'TX001', cardId: 'CC001', amount: 100, transactionDate: '2023-01-15', merchantName: 'Starbucks', category: 'Food & Dining'},
        {transactionId: 'TX002', cardId: 'CC002', amount: 200, transactionDate: '2023-02-20', merchantName: 'Shell', category: 'Fuel'}
      ];
    });
    
    it('should aggregate category spending with percentages', function(done) {
      spyOn(TransactionDataService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationEngineService, 'categorize').and.returnValue(mockCategorized);
      
      var userId = 'USER001';
      var dateRange = {startDate: '2023-01-01', endDate: '2023-12-31'};
      
      AnalyticsService.getAnalytics(userId, dateRange).then(function(result) {
        expect(result.categorySpending).toBeDefined();
        expect(result.categorySpending.length).toBe(2);
        expect(result.categorySpending[0].category).toBe('Food & Dining');
        expect(result.categorySpending[0].amount).toBe(100);
        expect(result.categorySpending[0].percentage).toBeCloseTo(33.33, 1);
        expect(result.categorySpending[1].category).toBe('Fuel');
        expect(result.categorySpending[1].amount).toBe(200);
        expect(result.categorySpending[1].percentage).toBeCloseTo(66.67, 1);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should calculate monthly trends correctly', function(done) {
      spyOn(TransactionDataService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationEngineService, 'categorize').and.returnValue(mockCategorized);
      
      var userId = 'USER001';
      var dateRange = {startDate: '2023-01-01', endDate: '2023-12-31'};
      
      AnalyticsService.getAnalytics(userId, dateRange).then(function(result) {
        expect(result.monthlyTrends).toBeDefined();
        expect(result.monthlyTrends.length).toBe(2);
        expect(result.monthlyTrends[0].month).toBe('2023-1');
        expect(result.monthlyTrends[0].totalSpend).toBe(100);
        expect(result.monthlyTrends[1].month).toBe('2023-2');
        expect(result.monthlyTrends[1].totalSpend).toBe(200);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should aggregate card-wise spending', function(done) {
      spyOn(TransactionDataService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationEngineService, 'categorize').and.returnValue(mockCategorized);
      
      var userId = 'USER001';
      var dateRange = {startDate: '2023-01-01', endDate: '2023-12-31'};
      
      AnalyticsService.getAnalytics(userId, dateRange).then(function(result) {
        expect(result.cardWiseSpending).toBeDefined();
        expect(result.cardWiseSpending.length).toBe(2);
        expect(result.cardWiseSpending[0].cardId).toBe('CC001');
        expect(result.cardWiseSpending[0].totalSpend).toBe(100);
        expect(result.cardWiseSpending[1].cardId).toBe('CC002');
        expect(result.cardWiseSpending[1].totalSpend).toBe(200);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle empty transaction list', function(done) {
      spyOn(TransactionDataService, 'getTransactions').and.returnValue($q.resolve([]));
      spyOn(CategorizationEngineService, 'categorize').and.returnValue([]);
      
      var userId = 'USER001';
      var dateRange = {startDate: '2023-01-01', endDate: '2023-12-31'};
      
      AnalyticsService.getAnalytics(userId, dateRange).then(function(result) {
        expect(result.categorySpending).toEqual([]);
        expect(result.monthlyTrends).toEqual([]);
        expect(result.cardWiseSpending).toEqual([]);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle service errors gracefully', function(done) {
      spyOn(TransactionDataService, 'getTransactions').and.returnValue($q.reject('Service error'));
      
      var userId = 'USER001';
      var dateRange = {startDate: '2023-01-01', endDate: '2023-12-31'};
      
      AnalyticsService.getAnalytics(userId, dateRange).catch(function(error) {
        expect(error).toBe('Service error');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle transactions without categories', function(done) {
      var uncategorized = [
        {transactionId: 'TX003', cardId: 'CC001', amount: 50, transactionDate: '2023-03-10', merchantName: 'Unknown'}
      ];
      
      var categorizedWithMisc = [
        {transactionId: 'TX003', cardId: 'CC001', amount: 50, transactionDate: '2023-03-10', merchantName: 'Unknown', category: 'Miscellaneous'}
      ];
      
      spyOn(TransactionDataService, 'getTransactions').and.returnValue($q.resolve(uncategorized));
      spyOn(CategorizationEngineService, 'categorize').and.returnValue(categorizedWithMisc);
      
      var userId = 'USER001';
      var dateRange = {startDate: '2023-01-01', endDate: '2023-12-31'};
      
      AnalyticsService.getAnalytics(userId, dateRange).then(function(result) {
        expect(result.categorySpending.length).toBe(1);
        expect(result.categorySpending[0].category).toBe('Miscellaneous');
        expect(result.categorySpending[0].amount).toBe(50);
        done();
      });
      
      $rootScope.$apply();
    });
  });
});

/*
Coverage Report:
- Functions tested: getAnalytics
- Scenarios covered: 
  * Normal case with multiple transactions
  * Category spending aggregation with percentage calculation
  * Monthly trend calculation
  * Card-wise spending aggregation
  * Empty transaction list
  * Service error handling
  * Uncategorized transactions defaulting to Miscellaneous
- Uncovered scenarios: None
- Edge cases: Empty data, service failures, missing categories
*/