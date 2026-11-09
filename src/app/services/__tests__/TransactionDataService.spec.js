/*
Test Documentation:
- Test Name: TransactionDataService - fetchTransactions, getTransactionById, getTransactions
- Purpose: Validate transaction data retrieval with pagination and filtering
- Scenario: Service fetches transaction history with various query parameters
- Expected Result: Returns paginated and filtered transaction data
*/

describe('TransactionDataService', function() {
  'use strict';
  
  var TransactionDataService;
  var $httpBackend;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_TransactionDataService_, _$httpBackend_) {
    TransactionDataService = _TransactionDataService_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('fetchTransactions', function() {
    it('should fetch transactions with default pagination', function() {
      var mockResponse = {
        transactions: [{transactionId: 'TX001', amount: 100}],
        totalPages: 5
      };
      
      $httpBackend.expectGET('/api/transactions?page=1&size=20').respond(200, mockResponse);
      
      TransactionDataService.fetchTransactions().then(function(result) {
        expect(result).toEqual(mockResponse);
      });
      
      $httpBackend.flush();
    });
    
    it('should fetch transactions with custom pagination', function() {
      var mockResponse = {
        transactions: [{transactionId: 'TX001', amount: 100}],
        totalPages: 10
      };
      
      $httpBackend.expectGET('/api/transactions?page=2&size=50').respond(200, mockResponse);
      
      TransactionDataService.fetchTransactions(2, 50).then(function(result) {
        expect(result).toEqual(mockResponse);
      });
      
      $httpBackend.flush();
    });
    
    it('should filter transactions by cardId', function() {
      var mockResponse = {
        transactions: [{transactionId: 'TX001', cardId: 'CC001', amount: 100}]
      };
      
      $httpBackend.expectGET('/api/transactions?page=1&size=20&cardId=CC001').respond(200, mockResponse);
      
      TransactionDataService.fetchTransactions(1, 20, 'CC001').then(function(result) {
        expect(result).toEqual(mockResponse);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle API errors', function() {
      $httpBackend.expectGET('/api/transactions?page=1&size=20').respond(500, 'Server Error');
      
      TransactionDataService.fetchTransactions().catch(function(error) {
        expect(error.status).toBe(500);
      });
      
      $httpBackend.flush();
    });
  });
  
  describe('getTransactionById', function() {
    it('should retrieve a specific transaction', function() {
      var txId = 'TX001';
      var mockTransaction = {
        transactionId: 'TX001',
        amount: 100,
        merchantName: 'Starbucks'
      };
      
      $httpBackend.expectGET('/api/transactions/' + txId).respond(200, mockTransaction);
      
      TransactionDataService.getTransactionById(txId).then(function(result) {
        expect(result).toEqual(mockTransaction);
        expect(result.transactionId).toBe('TX001');
      });
      
      $httpBackend.flush();
    });
    
    it('should handle transaction not found', function() {
      var txId = 'INVALID_TX';
      
      $httpBackend.expectGET('/api/transactions/' + txId).respond(404, 'Not Found');
      
      TransactionDataService.getTransactionById(txId).catch(function(error) {
        expect(error.status).toBe(404);
      });
      
      $httpBackend.flush();
    });
  });
  
  describe('getTransactions', function() {
    it('should fetch transactions for a user', function() {
      var userId = 'USER001';
      var mockResponse = [
        {transactionId: 'TX001', amount: 100},
        {transactionId: 'TX002', amount: 200}
      ];
      
      $httpBackend.expectGET('/api/transactions?userId=' + userId).respond(200, mockResponse);
      
      TransactionDataService.getTransactions(userId).then(function(result) {
        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(2);
      });
      
      $httpBackend.flush();
    });
    
    it('should fetch transactions with date range', function() {
      var userId = 'USER001';
      var dateRange = {startDate: '2023-01-01', endDate: '2023-12-31'};
      var mockResponse = [{transactionId: 'TX001', amount: 100}];
      
      $httpBackend.expectGET('/api/transactions?userId=' + userId + '&startDate=2023-01-01&endDate=2023-12-31').respond(200, mockResponse);
      
      TransactionDataService.getTransactions(userId, dateRange).then(function(result) {
        expect(result).toEqual(mockResponse);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle empty transaction list', function() {
      var userId = 'USER002';
      
      $httpBackend.expectGET('/api/transactions?userId=' + userId).respond(200, []);
      
      TransactionDataService.getTransactions(userId).then(function(result) {
        expect(result).toEqual([]);
      });
      
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: fetchTransactions, getTransactionById, getTransactions
- Scenarios covered:
  * Default pagination
  * Custom pagination
  * Card filtering
  * Transaction by ID retrieval
  * Date range filtering
  * Empty results
  * API error handling (500, 404)
- Uncovered scenarios: None
- Edge cases: API failures, empty responses, invalid IDs
*/