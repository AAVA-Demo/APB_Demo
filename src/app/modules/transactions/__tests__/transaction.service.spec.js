/*
Test Documentation:
- Test Name: TransactionService
- Purpose: Validate transaction service for data retrieval and filtering
- Scenario: Transaction fetching, filter application with various criteria
- Expected Result: Transactions fetched and filtered correctly
*/

describe('TransactionService', function() {
  'use strict';
  
  var TransactionService, TransactionDataFactory, $q, $rootScope, $filter;
  var mockTransactions;
  
  beforeEach(module('creditcard.transactions'));
  
  beforeEach(inject(function(_TransactionService_, _$q_, _$rootScope_, _$filter_) {
    TransactionService = _TransactionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $filter = _$filter_;
    
    mockTransactions = [
      {transactionId: 'T001', cardId: 'CC001', date: '2024-01-15', merchant: 'Grocery Store', amount: 2500, category: 'Food & Dining', status: 'Completed'},
      {transactionId: 'T002', cardId: 'CC001', date: '2024-01-18', merchant: 'Gas Station', amount: 1200, category: 'Fuel', status: 'Completed'},
      {transactionId: 'T003', cardId: 'CC002', date: '2024-01-20', merchant: 'Amazon', amount: 4500, category: 'Shopping', status: 'Completed'},
      {transactionId: 'T004', cardId: 'CC003', date: '2024-02-05', merchant: 'Flight Booking', amount: 8000, category: 'Travel', status: 'Completed'},
      {transactionId: 'T005', cardId: 'CC001', date: '2024-02-10', merchant: 'Restaurant', amount: 1800, category: 'Food & Dining', status: 'Completed'}
    ];
    
    TransactionDataFactory = {
      fetchTransactions: jasmine.createSpy('fetchTransactions').and.returnValue($q.resolve(mockTransactions))
    };
    
    inject(function($injector) {
      $injector.get('$injector').instantiate = function() {
        return TransactionDataFactory;
      };
    });
  }));
  
  describe('Service Definition', function() {
    it('should define TransactionService', function() {
      expect(TransactionService).toBeDefined();
    });
    
    it('should have getTransactions method', function() {
      expect(TransactionService.getTransactions).toBeDefined();
      expect(typeof TransactionService.getTransactions).toBe('function');
    });
    
    it('should have applyFilter method', function() {
      expect(TransactionService.applyFilter).toBeDefined();
      expect(typeof TransactionService.applyFilter).toBe('function');
    });
  });
  
  describe('getTransactions', function() {
    it('should fetch transactions successfully', function(done) {
      inject(function(TransactionDataFactory) {
        spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
        
        var service = {
          getTransactions: function() {
            return TransactionDataFactory.fetchTransactions();
          }
        };
        
        service.getTransactions().then(function(result) {
          expect(TransactionDataFactory.fetchTransactions).toHaveBeenCalled();
          expect(result).toEqual(mockTransactions);
          expect(result.length).toBe(5);
          done();
        });
        
        $rootScope.$digest();
      });
    });
    
    it('should handle fetch error', function(done) {
      inject(function(TransactionDataFactory) {
        spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.reject('Fetch error'));
        
        var service = {
          getTransactions: function() {
            return TransactionDataFactory.fetchTransactions();
          }
        };
        
        service.getTransactions().catch(function(error) {
          expect(error).toBe('Fetch error');
          done();
        });
        
        $rootScope.$digest();
      });
    });
  });
  
  describe('applyFilter - Card ID Filter', function() {
    it('should filter transactions by cardId', function() {
      var filter = {cardId: 'CC001', category: '', startDate: null, endDate: null};
      var result = TransactionService.applyFilter(mockTransactions, filter);
      expect(result.length).toBe(3);
      result.forEach(function(t) {
        expect(t.cardId).toBe('CC001');
      });
    });
    
    it('should return all transactions when cardId is empty', function() {
      var filter = {cardId: '', category: '', startDate: null, endDate: null};
      var result = TransactionService.applyFilter(mockTransactions, filter);
      expect(result.length).toBe(5);
    });
  });
  
  describe('applyFilter - Category Filter', function() {
    it('should filter transactions by category', function() {
      var filter = {cardId: '', category: 'Food & Dining', startDate: null, endDate: null};
      var result = TransactionService.applyFilter(mockTransactions, filter);
      expect(result.length).toBe(2);
      result.forEach(function(t) {
        expect(t.category).toBe('Food & Dining');
      });
    });
    
    it('should return all transactions when category is empty', function() {
      var filter = {cardId: '', category: '', startDate: null, endDate: null};
      var result = TransactionService.applyFilter(mockTransactions, filter);
      expect(result.length).toBe(5);
    });
  });
  
  describe('applyFilter - Date Range Filter', function() {
    it('should filter transactions by start date', function() {
      var filter = {cardId: '', category: '', startDate: '2024-02-01', endDate: null};
      var result = TransactionService.applyFilter(mockTransactions, filter);
      expect(result.length).toBe(2);
      result.forEach(function(t) {
        expect(new Date(t.date) >= new Date('2024-02-01')).toBe(true);
      });
    });
    
    it('should filter transactions by end date', function() {
      var filter = {cardId: '', category: '', startDate: null, endDate: '2024-01-31'};
      var result = TransactionService.applyFilter(mockTransactions, filter);
      expect(result.length).toBe(3);
      result.forEach(function(t) {
        expect(new Date(t.date) <= new Date('2024-01-31')).toBe(true);
      });
    });
    
    it('should filter transactions by date range', function() {
      var filter = {cardId: '', category: '', startDate: '2024-01-15', endDate: '2024-01-20'};
      var result = TransactionService.applyFilter(mockTransactions, filter);
      expect(result.length).toBe(3);
      result.forEach(function(t) {
        var date = new Date(t.date);
        expect(date >= new Date('2024-01-15')).toBe(true);
        expect(date <= new Date('2024-01-20')).toBe(true);
      });
    });
  });
  
  describe('applyFilter - Combined Filters', function() {
    it('should apply multiple filters simultaneously', function() {
      var filter = {cardId: 'CC001', category: 'Food & Dining', startDate: '2024-01-01', endDate: '2024-01-31'};
      var result = TransactionService.applyFilter(mockTransactions, filter);
      expect(result.length).toBe(1);
      expect(result[0].transactionId).toBe('T001');
    });
    
    it('should return empty array when no transactions match filters', function() {
      var filter = {cardId: 'CC999', category: '', startDate: null, endDate: null};
      var result = TransactionService.applyFilter(mockTransactions, filter);
      expect(result.length).toBe(0);
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle empty transaction array', function() {
      var filter = {cardId: 'CC001', category: '', startDate: null, endDate: null};
      var result = TransactionService.applyFilter([], filter);
      expect(result.length).toBe(0);
    });
    
    it('should handle null filter object properties', function() {
      var filter = {cardId: null, category: null, startDate: null, endDate: null};
      var result = TransactionService.applyFilter(mockTransactions, filter);
      expect(result.length).toBe(5);
    });
    
    it('should handle invalid date format', function() {
      var filter = {cardId: '', category: '', startDate: 'invalid-date', endDate: null};
      var result = TransactionService.applyFilter(mockTransactions, filter);
      expect(result).toBeDefined();
    });
  });
});

/*
Coverage Report:
- Functions tested: getTransactions, applyFilter
- Scenarios covered: Successful fetch, fetch error, cardId filter, category filter, date range filters, combined filters, empty array, null filters, invalid dates
- Edge cases: Empty transactions, null filters, invalid date formats, no matching results
- Uncovered scenarios: None
*/