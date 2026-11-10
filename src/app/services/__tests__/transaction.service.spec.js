/*
Test Documentation:
- Test Name: TransactionService - getTransactions with successful HTTP response
- Purpose: Validates that getTransactions returns transaction data from API
- Scenario: HTTP request succeeds with valid response
- Expected Result: Returns transaction data with pagination info

- Test Name: TransactionService - getTransactions with pagination params
- Purpose: Validates pagination parameter handling
- Scenario: getTransactions called with page and pageSize params
- Expected Result: Returns paginated transaction data

- Test Name: TransactionService - getTransactions with filter params
- Purpose: Validates filter parameter handling
- Scenario: getTransactions called with cardId, startDate, endDate params
- Expected Result: Returns filtered transaction data

- Test Name: TransactionService - getTransactions with HTTP error
- Purpose: Validates fallback to mock data when HTTP request fails
- Scenario: HTTP request returns error
- Expected Result: Returns mock transaction data

- Test Name: TransactionService - _getMockTransactions
- Purpose: Validates mock transaction data generation
- Scenario: Mock data generator called
- Expected Result: Returns paginated mock transaction data

- Test Name: TransactionService - _getMockTransactions with cardId filter
- Purpose: Validates mock data filtering by card ID
- Scenario: Mock data generator called with cardId param
- Expected Result: Returns only transactions for specified card

Coverage Report:
- Functions tested: getTransactions, _getMockTransactions
- Scenarios covered: successful HTTP request, pagination, filtering, HTTP error, mock data generation, mock data filtering
- Edge cases: HTTP failure, empty params, cardId filtering
- Uncovered scenarios: none
*/

describe('TransactionService', function() {
  'use strict';

  var TransactionService, $httpBackend, $q;
  var API_BASE = '/api/transactions';

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$q_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getTransactions', function() {
    it('should return transaction data from API on successful request', function() {
      var mockResponse = {
        transactions: [
          {transactionId: 'TXN001', cardId: 'CC001', amount: 1250.50, merchantName: 'Whole Foods'},
          {transactionId: 'TXN002', cardId: 'CC001', amount: 45.00, merchantName: 'Shell Gas'}
        ],
        total: 2,
        page: 1,
        pageSize: 20
      };

      $httpBackend.expectGET(API_BASE + '?page=1&pageSize=20').respond(200, mockResponse);

      var result;
      TransactionService.getTransactions({}).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.transactions.length).toBe(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
    });

    it('should handle pagination parameters', function() {
      var mockResponse = {
        transactions: [],
        total: 50,
        page: 2,
        pageSize: 10
      };

      $httpBackend.expectGET(API_BASE + '?page=2&pageSize=10').respond(200, mockResponse);

      var result;
      TransactionService.getTransactions({page: 2, pageSize: 10}).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.page).toBe(2);
      expect(result.pageSize).toBe(10);
    });

    it('should handle filter parameters', function() {
      var params = {
        page: 1,
        pageSize: 20,
        cardId: 'CC001',
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      };

      var mockResponse = {
        transactions: [{transactionId: 'TXN001', cardId: 'CC001', amount: 1250.50}],
        total: 1,
        page: 1,
        pageSize: 20
      };

      $httpBackend.expectGET(API_BASE + '?page=1&pageSize=20&cardId=CC001&startDate=2024-01-01&endDate=2024-01-31').respond(200, mockResponse);

      var result;
      TransactionService.getTransactions(params).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.transactions.length).toBe(1);
      expect(result.transactions[0].cardId).toBe('CC001');
    });

    it('should return mock data when HTTP request fails', function() {
      $httpBackend.expectGET(API_BASE + '?page=1&pageSize=20').respond(500, 'Server Error');

      var result;
      TransactionService.getTransactions({}).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
      expect(result.transactions.length).toBeGreaterThan(0);
      expect(result.total).toBeDefined();
    });

    it('should use default pagination when params not provided', function() {
      $httpBackend.expectGET(API_BASE + '?page=1&pageSize=20').respond(500, 'Error');

      var result;
      TransactionService.getTransactions(null).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
    });
  });

  describe('_getMockTransactions', function() {
    it('should return mock transaction data with pagination', function() {
      var params = {page: 1, pageSize: 5};

      var result = TransactionService._getMockTransactions(params);

      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
      expect(result.transactions.length).toBe(5);
      expect(result.total).toBe(10);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(5);
    });

    it('should filter mock transactions by cardId', function() {
      var params = {cardId: 'CC001', page: 1, pageSize: 20};

      var result = TransactionService._getMockTransactions(params);

      expect(result.transactions).toBeDefined();
      result.transactions.forEach(function(txn) {
        expect(txn.cardId).toBe('CC001');
      });
    });

    it('should handle pagination beyond available data', function() {
      var params = {page: 5, pageSize: 20};

      var result = TransactionService._getMockTransactions(params);

      expect(result.transactions.length).toBe(0);
      expect(result.total).toBe(10);
    });

    it('should return all mock transactions when no cardId filter', function() {
      var params = {page: 1, pageSize: 20};

      var result = TransactionService._getMockTransactions(params);

      expect(result.transactions.length).toBe(10);
      expect(result.total).toBe(10);
    });

    it('should return transactions with all required fields', function() {
      var params = {page: 1, pageSize: 1};

      var result = TransactionService._getMockTransactions(params);
      var txn = result.transactions[0];

      expect(txn.transactionId).toBeDefined();
      expect(txn.cardId).toBeDefined();
      expect(txn.cardNumber).toBeDefined();
      expect(txn.timestamp).toBeDefined();
      expect(txn.amount).toBeDefined();
      expect(txn.merchantName).toBeDefined();
      expect(txn.merchantCategory).toBeDefined();
      expect(txn.transactionType).toBeDefined();
      expect(txn.status).toBeDefined();
    });
  });
});