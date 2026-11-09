/*
Test Documentation:
- Test Name: TransactionService - fetchTransactions
- Purpose: Validates retrieval and filtering of transaction data
- Scenario: User requests transaction history for analytics and spending calculation
- Expected Result: Returns array of transactions with amount, category, date, and merchant details
*/
/*
Coverage Report:
- Functions tested: fetchTransactions, getMonthlyTransactions, getCardSpending, fetchMonthlyTransactions
- Scenarios covered: successful API response, API failure with mock data, date range filtering, current month filtering, card-specific filtering
- Uncovered scenarios: none
*/

describe('TransactionService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionService, $httpBackend, API_BASE_URL;
  
  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _API_BASE_URL_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    API_BASE_URL = _API_BASE_URL_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('fetchTransactions', function() {
    it('should fetch transactions from API with date range', function() {
      var mockResponse = [
        { transactionId: 'T001', cardId: 'C001', amount: 1000, category: 'Food & Dining', date: new Date('2023-01-15') }
      ];
      $httpBackend.expectGET(API_BASE_URL + '/api/transactions?from=2023-01-01&to=2023-01-31&userId=U001').respond(200, mockResponse);
      
      TransactionService.fetchTransactions('U001', { from: '2023-01-01', to: '2023-01-31' }).then(function(result) {
        expect(result.length).toBe(1);
        expect(result[0].transactionId).toBe('T001');
      });
      $httpBackend.flush();
    });
    
    it('should return mock transactions on API failure', function() {
      $httpBackend.expectGET(API_BASE_URL + '/api/transactions?userId=U001').respond(500, 'Server Error');
      
      TransactionService.fetchTransactions('U001', {}).then(function(result) {
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].transactionId).toBeDefined();
        expect(result[0].category).toBeDefined();
      });
      $httpBackend.flush();
    });
    
    it('should fetch transactions without date range', function() {
      $httpBackend.expectGET(API_BASE_URL + '/api/transactions?userId=U001').respond(500);
      
      TransactionService.fetchTransactions('U001', null).then(function(result) {
        expect(result).toBeDefined();
      });
      $httpBackend.flush();
    });
  });
  
  describe('getMonthlyTransactions', function() {
    it('should fetch current month transactions from API', function() {
      var mockResponse = [
        { transactionId: 'T001', amount: 1000, date: new Date() }
      ];
      $httpBackend.expectGET(API_BASE_URL + '/api/transactions/current-month?userId=U001').respond(200, mockResponse);
      
      TransactionService.getMonthlyTransactions('U001').then(function(result) {
        expect(result.length).toBe(1);
      });
      $httpBackend.flush();
    });
    
    it('should filter mock transactions to current month on API failure', function() {
      $httpBackend.expectGET(API_BASE_URL + '/api/transactions/current-month?userId=U001').respond(500);
      
      TransactionService.getMonthlyTransactions('U001').then(function(result) {
        expect(result).toBeDefined();
        result.forEach(function(t) {
          var d = new Date(t.date);
          var now = new Date();
          expect(d.getMonth()).toBe(now.getMonth());
          expect(d.getFullYear()).toBe(now.getFullYear());
        });
      });
      $httpBackend.flush();
    });
  });
  
  describe('getCardSpending', function() {
    it('should fetch transactions for specific card', function() {
      var mockResponse = [
        { transactionId: 'T001', cardId: 'C001', amount: 1500 }
      ];
      $httpBackend.expectGET(API_BASE_URL + '/api/transactions/card/C001').respond(200, mockResponse);
      
      TransactionService.getCardSpending('C001').then(function(result) {
        expect(result.length).toBe(1);
        expect(result[0].cardId).toBe('C001');
      });
      $httpBackend.flush();
    });
    
    it('should filter mock transactions by cardId on API failure', function() {
      $httpBackend.expectGET(API_BASE_URL + '/api/transactions/card/C001').respond(500);
      
      TransactionService.getCardSpending('C001').then(function(result) {
        expect(result).toBeDefined();
        result.forEach(function(t) {
          expect(t.cardId).toBe('C001');
        });
      });
      $httpBackend.flush();
    });
  });
  
  describe('fetchMonthlyTransactions', function() {
    it('should call getMonthlyTransactions', function() {
      $httpBackend.expectGET(API_BASE_URL + '/api/transactions/current-month?userId=U001').respond(500);
      
      TransactionService.fetchMonthlyTransactions('U001').then(function(result) {
        expect(result).toBeDefined();
      });
      $httpBackend.flush();
    });
  });
});