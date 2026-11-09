/*
Test Documentation:
- Test Name: AnalyticsService - getCategoryWiseSpending - success scenario
- Purpose: Validates category-wise spending aggregation and percentage calculation
- Scenario: Service receives transactions and aggregates by category
- Expected Result: Returns array of SpendingSummary objects with correct totals and percentages
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getCategoryWiseSpending - empty transactions
- Purpose: Validates handling of empty transaction list
- Scenario: No transactions available
- Expected Result: Returns empty array
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getMonthlyTrends - success scenario
- Purpose: Validates monthly spending trend aggregation
- Scenario: Service receives transactions spanning multiple months
- Expected Result: Returns sorted array of monthly spending data with category breakdowns
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getCardWiseSpending - success scenario
- Purpose: Validates card-wise spending aggregation
- Scenario: Service receives transactions for multiple cards
- Expected Result: Returns array of card spending summaries with category breakdowns
*/
/*
Coverage Report:
- Functions tested: getCategoryWiseSpending, getMonthlyTrends, getCardWiseSpending
- Scenarios covered: success paths, empty data handling, category validation integration, percentage calculation
- Uncovered scenarios: TransactionService failure handling (error propagates to controller)
*/

describe('AnalyticsService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AnalyticsService, TransactionService, CategorizationService, SpendingSummary, $q, $rootScope;
  
  beforeEach(inject(function(_AnalyticsService_, _TransactionService_, _CategorizationService_, _SpendingSummary_, _$q_, _$rootScope_) {
    AnalyticsService = _AnalyticsService_;
    TransactionService = _TransactionService_;
    CategorizationService = _CategorizationService_;
    SpendingSummary = _SpendingSummary_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getCategoryWiseSpending', function() {
    it('should aggregate transactions by category and calculate percentages', function(done) {
      var mockTransactions = [
        {id: 't1', amount: 100, category: 'Food & Dining', date: new Date('2024-01-15')},
        {id: 't2', amount: 50, category: 'Food & Dining', date: new Date('2024-01-16')},
        {id: 't3', amount: 200, category: 'Shopping', date: new Date('2024-01-17')},
        {id: 't4', amount: 150, category: 'Travel', date: new Date('2024-01-18')}
      ];
      
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationService, 'validateCategory').and.callFake(function(cat) { return cat; });
      
      AnalyticsService.getCategoryWiseSpending().then(function(result) {
        expect(result.length).toBe(3);
        expect(result[0].categoryName).toBe('Food & Dining');
        expect(result[0].totalAmount).toBe(150);
        expect(result[0].transactionCount).toBe(2);
        expect(result[0].percentage).toBe('30.00');
        
        var shoppingCategory = result.find(function(r) { return r.categoryName === 'Shopping'; });
        expect(shoppingCategory.totalAmount).toBe(200);
        expect(shoppingCategory.percentage).toBe('40.00');
        
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return empty array when no transactions exist', function(done) {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve([]));
      
      AnalyticsService.getCategoryWiseSpending().then(function(result) {
        expect(result.length).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should validate categories using CategorizationService', function(done) {
      var mockTransactions = [
        {id: 't1', amount: 100, category: 'InvalidCategory', date: new Date('2024-01-15')}
      ];
      
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationService, 'validateCategory').and.returnValue('Miscellaneous');
      
      AnalyticsService.getCategoryWiseSpending().then(function(result) {
        expect(CategorizationService.validateCategory).toHaveBeenCalledWith('InvalidCategory');
        expect(result[0].categoryName).toBe('Miscellaneous');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle zero total amount gracefully', function(done) {
      var mockTransactions = [
        {id: 't1', amount: 0, category: 'Food & Dining', date: new Date('2024-01-15')}
      ];
      
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationService, 'validateCategory').and.callFake(function(cat) { return cat; });
      
      AnalyticsService.getCategoryWiseSpending().then(function(result) {
        expect(result[0].percentage).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
  });
  
  describe('getMonthlyTrends', function() {
    it('should aggregate transactions by month with category breakdown', function(done) {
      var mockTransactions = [
        {id: 't1', amount: 100, category: 'Food & Dining', date: new Date('2024-01-15')},
        {id: 't2', amount: 50, category: 'Shopping', date: new Date('2024-01-20')},
        {id: 't3', amount: 200, category: 'Food & Dining', date: new Date('2024-02-10')},
        {id: 't4', amount: 75, category: 'Travel', date: new Date('2024-02-15')}
      ];
      
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationService, 'validateCategory').and.callFake(function(cat) { return cat; });
      
      AnalyticsService.getMonthlyTrends().then(function(result) {
        expect(result.length).toBe(2);
        expect(result[0].month).toBe('2024-01');
        expect(result[0].totalSpend).toBe(150);
        expect(result[0].categories.length).toBe(2);
        
        expect(result[1].month).toBe('2024-02');
        expect(result[1].totalSpend).toBe(275);
        expect(result[1].categories.length).toBe(2);
        
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return months in sorted order', function(done) {
      var mockTransactions = [
        {id: 't1', amount: 100, category: 'Food & Dining', date: new Date('2024-03-15')},
        {id: 't2', amount: 50, category: 'Shopping', date: new Date('2024-01-20')},
        {id: 't3', amount: 200, category: 'Travel', date: new Date('2024-02-10')}
      ];
      
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationService, 'validateCategory').and.callFake(function(cat) { return cat; });
      
      AnalyticsService.getMonthlyTrends().then(function(result) {
        expect(result[0].month).toBe('2024-01');
        expect(result[1].month).toBe('2024-02');
        expect(result[2].month).toBe('2024-03');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return empty array when no transactions exist', function(done) {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve([]));
      
      AnalyticsService.getMonthlyTrends().then(function(result) {
        expect(result.length).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
  });
  
  describe('getCardWiseSpending', function() {
    it('should aggregate transactions by card with category breakdown', function(done) {
      var mockTransactions = [
        {id: 't1', cardId: '1', amount: 100, category: 'Food & Dining', date: new Date('2024-01-15')},
        {id: 't2', cardId: '1', amount: 50, category: 'Shopping', date: new Date('2024-01-20')},
        {id: 't3', cardId: '2', amount: 200, category: 'Travel', date: new Date('2024-02-10')},
        {id: 't4', cardId: '2', amount: 75, category: 'Food & Dining', date: new Date('2024-02-15')}
      ];
      
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationService, 'validateCategory').and.callFake(function(cat) { return cat; });
      
      AnalyticsService.getCardWiseSpending().then(function(result) {
        expect(result.length).toBe(2);
        
        var card1 = result.find(function(r) { return r.cardId === '1'; });
        expect(card1.totalSpend).toBe(150);
        expect(card1.cardName).toBe('Card 1');
        expect(card1.categories.length).toBe(2);
        
        var card2 = result.find(function(r) { return r.cardId === '2'; });
        expect(card2.totalSpend).toBe(275);
        expect(card2.categories.length).toBe(2);
        
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return empty array when no transactions exist', function(done) {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve([]));
      
      AnalyticsService.getCardWiseSpending().then(function(result) {
        expect(result.length).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
  });
});