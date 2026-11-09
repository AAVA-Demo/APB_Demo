/*
Test Documentation:
- Test Name: TransactionFactory - getTransactions success with all parameters
- Purpose: Validates that getTransactions returns transaction data with pagination and filters
- Scenario: All parameters provided
- Expected Result: Promise resolves with transaction data
*/
/*
Test Documentation:
- Test Name: TransactionFactory - getTransactions with default parameters
- Purpose: Validates default pagination values
- Scenario: No parameters provided
- Expected Result: Uses page=1, size=20 defaults
*/
/*
Test Documentation:
- Test Name: TransactionFactory - getTransactions with filters
- Purpose: Validates filter parameters are passed correctly
- Scenario: Filter object provided
- Expected Result: Filter params included in request
*/
/*
Test Documentation:
- Test Name: TransactionFactory - getTransactions error handling
- Purpose: Validates error handling when API fails
- Scenario: API returns error
- Expected Result: Promise rejected with error
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: success with params, default params, filters, API error, empty results
- Uncovered scenarios: none
*/

describe('TransactionFactory', function() {
  var TransactionFactory, $httpBackend, API_CONFIG;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionFactory_, _$httpBackend_, _API_CONFIG_) {
    TransactionFactory = _TransactionFactory_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getTransactions', function() {
    it('should return transaction data with all parameters', function() {
      var page = 2;
      var pageSize = 10;
      var filter = {startDate: '2024-01-01', endDate: '2024-12-31', merchant: 'Amazon'};
      var mockResponse = {
        transactions: [
          {
            transactionId: 'txn1',
            cardId: 'card1',
            date: '2024-06-15',
            merchant: 'Amazon',
            category: 'Shopping',
            amount: 1500,
            status: 'posted'
          }
        ],
        totalRecords: 50
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?endDate=2024-12-31&merchant=Amazon&page=2&size=10&startDate=2024-01-01')
        .respond(200, mockResponse);

      var result;
      TransactionFactory.getTransactions(page, pageSize, filter).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.transactions.length).toBe(1);
      expect(result.totalRecords).toBe(50);
    });

    it('should use default pagination values when not provided', function() {
      var mockResponse = {transactions: [], totalRecords: 0};

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?page=1&size=20')
        .respond(200, mockResponse);

      var result;
      TransactionFactory.getTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
    });

    it('should handle filter parameters correctly', function() {
      var filter = {cardId: 'card1', category: 'Food & Dining'};
      var mockResponse = {transactions: [], totalRecords: 0};

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?cardId=card1&category=Food%20%26%20Dining&page=1&size=20')
        .respond(200, mockResponse);

      var result;
      TransactionFactory.getTransactions(null, null, filter).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
    });

    it('should handle empty transaction list', function() {
      var mockResponse = {transactions: [], totalRecords: 0};

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?page=1&size=20')
        .respond(200, mockResponse);

      var result;
      TransactionFactory.getTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.transactions).toEqual([]);
      expect(result.totalRecords).toBe(0);
    });

    it('should handle API error and reject promise', function() {
      var errorResponse = {status: 500, statusText: 'Internal Server Error'};

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?page=1&size=20')
        .respond(500, errorResponse);

      var error;
      TransactionFactory.getTransactions().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle large page numbers', function() {
      var mockResponse = {transactions: [], totalRecords: 1000};

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?page=50&size=20')
        .respond(200, mockResponse);

      var result;
      TransactionFactory.getTransactions(50, 20).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
    });

    it('should handle network error', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?page=1&size=20')
        .respond(-1, null);

      var error;
      TransactionFactory.getTransactions().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    it('should handle unauthorized access', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?page=1&size=20')
        .respond(401, {error: 'Unauthorized'});

      var error;
      TransactionFactory.getTransactions().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });
  });
});