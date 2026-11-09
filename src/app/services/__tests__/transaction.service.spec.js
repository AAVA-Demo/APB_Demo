/*
Test Documentation:
- Test Name: TransactionService - getTransactions - success with API response
- Purpose: Validates successful transaction retrieval from API
- Scenario: API returns valid transaction data
- Expected Result: Returns array of Transaction model instances
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions - filter by cardId
- Purpose: Validates card-specific transaction filtering
- Scenario: Service receives cardId parameter
- Expected Result: API called with cardId query parameter
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions - fallback to mock data on API failure
- Purpose: Validates resilience when API fails
- Scenario: API request fails with error
- Expected Result: Returns mock transaction data as fallback
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions - mock data filtered by cardId
- Purpose: Validates mock data filtering when API fails
- Scenario: API fails and cardId filter is provided
- Expected Result: Returns only transactions matching the cardId
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: API success, API failure with mock fallback, cardId filtering (API and mock), date parsing
- Uncovered scenarios: None - all critical paths covered
*/

describe('TransactionService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionService, $httpBackend, Transaction;
  
  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _Transaction_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    Transaction = _Transaction_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getTransactions', function() {
    it('should retrieve all transactions from API', function() {
      var mockApiResponse = [
        {id: 't1', cardId: '1', date: '2024-01-15', merchant: 'Starbucks', amount: 5.50, category: 'Food & Dining', status: 'Posted', description: 'Coffee'},
        {id: 't2', cardId: '2', date: '2024-01-16', merchant: 'Shell', amount: 45.00, category: 'Fuel', status: 'Posted', description: 'Gas'}
      ];
      
      $httpBackend.expectGET('/api/transactions').respond(200, mockApiResponse);
      
      TransactionService.getTransactions().then(function(transactions) {
        expect(transactions.length).toBe(2);
        expect(transactions[0] instanceof Transaction).toBe(true);
        expect(transactions[0].id).toBe('t1');
        expect(transactions[0].merchant).toBe('Starbucks');
        expect(transactions[0].amount).toBe(5.50);
        expect(transactions[0].date instanceof Date).toBe(true);
        
        expect(transactions[1].id).toBe('t2');
        expect(transactions[1].cardId).toBe('2');
      });
      
      $httpBackend.flush();
    });
    
    it('should filter transactions by cardId when provided', function() {
      var mockApiResponse = [
        {id: 't1', cardId: '1', date: '2024-01-15', merchant: 'Starbucks', amount: 5.50, category: 'Food & Dining', status: 'Posted', description: 'Coffee'}
      ];
      
      $httpBackend.expectGET('/api/transactions?cardId=1').respond(200, mockApiResponse);
      
      TransactionService.getTransactions('1').then(function(transactions) {
        expect(transactions.length).toBe(1);
        expect(transactions[0].cardId).toBe('1');
      });
      
      $httpBackend.flush();
    });
    
    it('should return mock data when API call fails', function() {
      $httpBackend.expectGET('/api/transactions').respond(500, 'Server Error');
      
      TransactionService.getTransactions().then(function(transactions) {
        expect(transactions.length).toBe(19);
        expect(transactions[0] instanceof Transaction).toBe(true);
        expect(transactions[0].merchant).toBe('Starbucks');
        expect(transactions[0].category).toBe('Food & Dining');
      });
      
      $httpBackend.flush();
    });
    
    it('should filter mock data by cardId when API fails', function() {
      $httpBackend.expectGET('/api/transactions?cardId=1').respond(500, 'Server Error');
      
      TransactionService.getTransactions('1').then(function(transactions) {
        expect(transactions.length).toBeGreaterThan(0);
        transactions.forEach(function(txn) {
          expect(txn.cardId).toBe('1');
        });
      });
      
      $httpBackend.flush();
    });
    
    it('should parse transaction dates correctly', function() {
      var mockApiResponse = [
        {id: 't1', cardId: '1', date: '2024-01-15', merchant: 'Test', amount: 100, category: 'Shopping', status: 'Posted', description: 'Test purchase'}
      ];
      
      $httpBackend.expectGET('/api/transactions').respond(200, mockApiResponse);
      
      TransactionService.getTransactions().then(function(transactions) {
        expect(transactions[0].date instanceof Date).toBe(true);
        expect(transactions[0].date.getFullYear()).toBe(2024);
        expect(transactions[0].date.getMonth()).toBe(0);
        expect(transactions[0].date.getDate()).toBe(15);
      });
      
      $httpBackend.flush();
    });
    
    it('should return all mock transactions when no cardId filter and API fails', function() {
      $httpBackend.expectGET('/api/transactions').respond(404, 'Not Found');
      
      TransactionService.getTransactions().then(function(transactions) {
        expect(transactions.length).toBe(19);
        var uniqueCards = {};
        transactions.forEach(function(txn) {
          uniqueCards[txn.cardId] = true;
        });
        expect(Object.keys(uniqueCards).length).toBeGreaterThan(1);
      });
      
      $httpBackend.flush();
    });
  });
});