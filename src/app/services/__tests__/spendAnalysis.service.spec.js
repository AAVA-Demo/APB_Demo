/*
Test Documentation:
- Test Name: spendAnalysis.service - getCardSpendSummaries and getCardSpendSummary
- Purpose: Validate card-level spending analysis with category breakdown
- Scenario: Service calculates monthly, yearly, and category-wise spending per card
- Expected Result: Returns spend summaries with top categories for each card
*/

describe('SpendAnalysisService (spendAnalysis.service.js)', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var SpendAnalysisService;
  var TransactionService;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_SpendAnalysisService_, _TransactionService_, _$q_, _$rootScope_) {
    SpendAnalysisService = _SpendAnalysisService_;
    TransactionService = _TransactionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getCardSpendSummaries', function() {
    var mockTransactions;
    
    beforeEach(function() {
      var now = new Date();
      var thisMonth = now.getMonth();
      var thisYear = now.getFullYear();
      
      mockTransactions = [
        {transactionId: 'TX001', cardId: 'CC001', amount: 100, date: new Date(thisYear, thisMonth, 15), category: 'Food & Dining'},
        {transactionId: 'TX002', cardId: 'CC001', amount: 200, date: new Date(thisYear, thisMonth, 20), category: 'Fuel'},
        {transactionId: 'TX003', cardId: 'CC002', amount: 150, date: new Date(thisYear, thisMonth, 10), category: 'Shopping'},
        {transactionId: 'TX004', cardId: 'CC001', amount: 50, date: new Date(thisYear, thisMonth - 2, 5), category: 'Food & Dining'}
      ];
    });
    
    it('should calculate monthly spend for each card', function(done) {
      spyOn(TransactionService, 'getAllTransactions').and.returnValue($q.resolve(mockTransactions));
      
      var cardIds = ['CC001', 'CC002'];
      
      SpendAnalysisService.getCardSpendSummaries(cardIds).then(function(summaries) {
        expect(summaries.length).toBe(2);
        expect(summaries[0].cardId).toBe('CC001');
        expect(summaries[0].monthlySpend).toBe(300);
        expect(summaries[1].cardId).toBe('CC002');
        expect(summaries[1].monthlySpend).toBe(150);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should calculate yearly spend for each card', function(done) {
      spyOn(TransactionService, 'getAllTransactions').and.returnValue($q.resolve(mockTransactions));
      
      var cardIds = ['CC001', 'CC002'];
      
      SpendAnalysisService.getCardSpendSummaries(cardIds).then(function(summaries) {
        expect(summaries[0].yearlySpend).toBe(350);
        expect(summaries[1].yearlySpend).toBe(150);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should identify top spending categories', function(done) {
      spyOn(TransactionService, 'getAllTransactions').and.returnValue($q.resolve(mockTransactions));
      
      var cardIds = ['CC001'];
      
      SpendAnalysisService.getCardSpendSummaries(cardIds).then(function(summaries) {
        expect(summaries[0].topCategories).toBeDefined();
        expect(summaries[0].topCategories.length).toBeGreaterThan(0);
        expect(summaries[0].topCategories[0].category).toBe('Fuel');
        expect(summaries[0].topCategories[0].amount).toBe(200);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should limit top categories to 3', function(done) {
      var manyTransactions = [
        {cardId: 'CC001', amount: 100, date: new Date(), category: 'Cat1'},
        {cardId: 'CC001', amount: 200, date: new Date(), category: 'Cat2'},
        {cardId: 'CC001', amount: 150, date: new Date(), category: 'Cat3'},
        {cardId: 'CC001', amount: 50, date: new Date(), category: 'Cat4'},
        {cardId: 'CC001', amount: 25, date: new Date(), category: 'Cat5'}
      ];
      
      spyOn(TransactionService, 'getAllTransactions').and.returnValue($q.resolve(manyTransactions));
      
      var cardIds = ['CC001'];
      
      SpendAnalysisService.getCardSpendSummaries(cardIds).then(function(summaries) {
        expect(summaries[0].topCategories.length).toBe(3);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should include transaction count', function(done) {
      spyOn(TransactionService, 'getAllTransactions').and.returnValue($q.resolve(mockTransactions));
      
      var cardIds = ['CC001', 'CC002'];
      
      SpendAnalysisService.getCardSpendSummaries(cardIds).then(function(summaries) {
        expect(summaries[0].transactionCount).toBe(3);
        expect(summaries[1].transactionCount).toBe(1);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle empty transaction list', function(done) {
      spyOn(TransactionService, 'getAllTransactions').and.returnValue($q.resolve([]));
      
      var cardIds = ['CC001'];
      
      SpendAnalysisService.getCardSpendSummaries(cardIds).then(function(summaries) {
        expect(summaries[0].monthlySpend).toBe(0);
        expect(summaries[0].yearlySpend).toBe(0);
        expect(summaries[0].transactionCount).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle service errors', function(done) {
      spyOn(TransactionService, 'getAllTransactions').and.returnValue($q.reject('Service error'));
      
      var cardIds = ['CC001'];
      
      SpendAnalysisService.getCardSpendSummaries(cardIds).catch(function(error) {
        expect(error).toBe('Service error');
        done();
      });
      
      $rootScope.$apply();
    });
  });
  
  describe('getCardSpendSummary', function() {
    it('should return summary for a single card', function(done) {
      var mockSummaries = [
        {cardId: 'CC001', monthlySpend: 300, yearlySpend: 3600}
      ];
      
      spyOn(SpendAnalysisService, 'getCardSpendSummaries').and.returnValue($q.resolve(mockSummaries));
      
      SpendAnalysisService.getCardSpendSummary('CC001').then(function(summary) {
        expect(summary).toEqual(mockSummaries[0]);
        expect(summary.cardId).toBe('CC001');
        done();
      });
      
      $rootScope.$apply();
    });
  });
});

/*
Coverage Report:
- Functions tested: getCardSpendSummaries, getCardSpendSummary
- Scenarios covered:
  * Monthly spend calculation
  * Yearly spend calculation
  * Top categories identification
  * Top categories limit (3)
  * Transaction count
  * Empty transaction list
  * Service error handling
  * Single card summary retrieval
- Uncovered scenarios: None
- Edge cases: Empty data, service failures, category limits
*/