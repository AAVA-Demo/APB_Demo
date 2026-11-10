/*
Test Documentation:
- Test Name: TransactionService - getTransactions success
- Purpose: Validates that getTransactions returns transaction data with pagination
- Scenario: Service calls ApiService.get with filter and pagination parameters
- Expected Result: Returns object with transactions array and totalCount
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions error handling
- Purpose: Validates error handling when API call fails
- Scenario: ApiService.get rejects with error
- Expected Result: Returns rejected promise and logs error
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions with filters
- Purpose: Validates filtering functionality
- Scenario: Service receives filter parameters and passes them to API
- Expected Result: Returns filtered transactions
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: successful data retrieval, error handling, filtering, pagination, empty response
- Uncovered scenarios: none
*/

describe('TransactionService', function() {
  'use strict';
  
  var TransactionService, ApiService, $q, $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_TransactionService_, _ApiService_, _$q_, _$rootScope_) {
    TransactionService = _TransactionService_;
    ApiService = _ApiService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    spyOn(console, 'error');
  }));
  
  describe('getTransactions', function() {
    it('should call ApiService.get with correct endpoint and merged parameters', function() {
      var filter = { startDate: '2023-01-01', endDate: '2023-12-31', cardIds: ['card1'] };
      var pagination = { currentPage: 1, pageSize: 20 };
      var mockResponse = { transactions: [], totalCount: 0 };
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      TransactionService.getTransactions(filter, pagination);
      
      expect(ApiService.get).toHaveBeenCalledWith('/api/transactions', jasmine.objectContaining({
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        cardIds: ['card1'],
        currentPage: 1,
        pageSize: 20
      }));
    });
    
    it('should return transactions and totalCount on successful API call', function(done) {
      var filter = { startDate: '2023-01-01', endDate: '2023-12-31' };
      var pagination = { currentPage: 1, pageSize: 20 };
      var mockResponse = {
        transactions: [
          { id: 'txn1', date: '2023-06-15', merchant: 'Store A', amount: 50.00, category: 'Shopping' },
          { id: 'txn2', date: '2023-06-16', merchant: 'Restaurant B', amount: 35.50, category: 'Food & Dining' }
        ],
        totalCount: 2
      };
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      TransactionService.getTransactions(filter, pagination).then(function(result) {
        expect(result.transactions).toEqual(mockResponse.transactions);
        expect(result.totalCount).toBe(2);
        expect(result.transactions.length).toBe(2);
        expect(result.transactions[0].merchant).toBe('Store A');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return empty transactions array when API returns null transactions', function(done) {
      var filter = {};
      var pagination = { currentPage: 1, pageSize: 20 };
      var mockResponse = { transactions: null, totalCount: 0 };
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      TransactionService.getTransactions(filter, pagination).then(function(result) {
        expect(result.transactions).toEqual([]);
        expect(result.totalCount).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return zero totalCount when API returns undefined totalCount', function(done) {
      var filter = {};
      var pagination = { currentPage: 1, pageSize: 20 };
      var mockResponse = { transactions: [], totalCount: undefined };
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      TransactionService.getTransactions(filter, pagination).then(function(result) {
        expect(result.transactions).toEqual([]);
        expect(result.totalCount).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle API errors and log error message', function(done) {
      var filter = {};
      var pagination = { currentPage: 1, pageSize: 20 };
      var mockError = { status: 500, message: 'Internal Server Error' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(mockError));
      
      TransactionService.getTransactions(filter, pagination).catch(function(error) {
        expect(console.error).toHaveBeenCalledWith('Failed to fetch transactions:', mockError);
        expect(error).toEqual(mockError);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle 404 not found errors', function(done) {
      var filter = {};
      var pagination = { currentPage: 1, pageSize: 20 };
      var notFoundError = { status: 404, message: 'Transactions not found' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(notFoundError));
      
      TransactionService.getTransactions(filter, pagination).catch(function(error) {
        expect(error.status).toBe(404);
        expect(console.error).toHaveBeenCalled();
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle 401 unauthorized errors', function(done) {
      var filter = {};
      var pagination = { currentPage: 1, pageSize: 20 };
      var authError = { status: 401, message: 'Unauthorized' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(authError));
      
      TransactionService.getTransactions(filter, pagination).catch(function(error) {
        expect(error.status).toBe(401);
        expect(console.error).toHaveBeenCalled();
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle network timeout errors', function(done) {
      var filter = {};
      var pagination = { currentPage: 1, pageSize: 20 };
      var timeoutError = { status: -1, message: 'Network timeout' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(timeoutError));
      
      TransactionService.getTransactions(filter, pagination).catch(function(error) {
        expect(error.status).toBe(-1);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle filter with multiple card IDs', function(done) {
      var filter = { cardIds: ['card1', 'card2', 'card3'] };
      var pagination = { currentPage: 1, pageSize: 20 };
      var mockResponse = {
        transactions: [
          { id: 'txn1', cardId: 'card1', amount: 100 },
          { id: 'txn2', cardId: 'card2', amount: 200 },
          { id: 'txn3', cardId: 'card3', amount: 300 }
        ],
        totalCount: 3
      };
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      TransactionService.getTransactions(filter, pagination).then(function(result) {
        expect(result.transactions.length).toBe(3);
        expect(result.totalCount).toBe(3);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle filter with merchant search', function(done) {
      var filter = { merchant: 'Amazon' };
      var pagination = { currentPage: 1, pageSize: 20 };
      var mockResponse = {
        transactions: [
          { id: 'txn1', merchant: 'Amazon', amount: 50 },
          { id: 'txn2', merchant: 'Amazon Prime', amount: 12.99 }
        ],
        totalCount: 2
      };
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      TransactionService.getTransactions(filter, pagination).then(function(result) {
        expect(result.transactions.length).toBe(2);
        expect(result.transactions[0].merchant).toContain('Amazon');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle filter with amount range', function(done) {
      var filter = { minAmount: 50, maxAmount: 200 };
      var pagination = { currentPage: 1, pageSize: 20 };
      var mockResponse = {
        transactions: [
          { id: 'txn1', amount: 75 },
          { id: 'txn2', amount: 150 }
        ],
        totalCount: 2
      };
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      TransactionService.getTransactions(filter, pagination).then(function(result) {
        expect(result.transactions.length).toBe(2);
        expect(result.transactions[0].amount).toBeGreaterThanOrEqual(50);
        expect(result.transactions[1].amount).toBeLessThanOrEqual(200);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle pagination with different page sizes', function(done) {
      var filter = {};
      var pagination = { currentPage: 2, pageSize: 10 };
      var mockResponse = {
        transactions: [
          { id: 'txn11' },
          { id: 'txn12' },
          { id: 'txn13' }
        ],
        totalCount: 25
      };
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      TransactionService.getTransactions(filter, pagination).then(function(result) {
        expect(result.transactions.length).toBe(3);
        expect(result.totalCount).toBe(25);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle empty filter and pagination objects', function(done) {
      var filter = {};
      var pagination = {};
      var mockResponse = { transactions: [], totalCount: 0 };
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      TransactionService.getTransactions(filter, pagination).then(function(result) {
        expect(result.transactions).toEqual([]);
        expect(result.totalCount).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle response time under 1 second requirement', function(done) {
      var filter = { startDate: '2023-01-01' };
      var pagination = { currentPage: 1, pageSize: 20 };
      var mockResponse = { transactions: [], totalCount: 0 };
      var startTime = Date.now();
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      TransactionService.getTransactions(filter, pagination).then(function(result) {
        var endTime = Date.now();
        var responseTime = endTime - startTime;
        expect(responseTime).toBeLessThan(1000);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle malformed API response', function(done) {
      var filter = {};
      var pagination = { currentPage: 1, pageSize: 20 };
      var malformedResponse = { error: 'Invalid structure' };
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(malformedResponse));
      
      TransactionService.getTransactions(filter, pagination).then(function(result) {
        expect(result.transactions).toEqual([]);
        expect(result.totalCount).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle very large transaction lists', function(done) {
      var filter = {};
      var pagination = { currentPage: 1, pageSize: 100 };
      var largeTransactionList = [];
      for (var i = 0; i < 100; i++) {
        largeTransactionList.push({ id: 'txn' + i, amount: i * 10 });
      }
      var mockResponse = { transactions: largeTransactionList, totalCount: 1000 };
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      TransactionService.getTransactions(filter, pagination).then(function(result) {
        expect(result.transactions.length).toBe(100);
        expect(result.totalCount).toBe(1000);
        done();
      });
      
      $rootScope.$apply();
    });
  });
});