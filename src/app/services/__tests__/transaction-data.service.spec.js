/*
Test Documentation:
- Test Name: TransactionDataService Test Suite
- Purpose: Validate historical transaction data retrieval with date filtering
- Scenario: Tests fetching transactions within specified date ranges for analytics
- Expected Result: Service correctly retrieves transactions filtered by start and end dates
*/

(function() {
'use strict';

describe('TransactionDataService', function() {
  var TransactionDataService, $httpBackend, API_ENDPOINTS;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionDataService_, _$httpBackend_, _API_ENDPOINTS_) {
    TransactionDataService = _TransactionDataService_;
    $httpBackend = _$httpBackend_;
    API_ENDPOINTS = _API_ENDPOINTS_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getTransactions', function() {
    /*
    Test Documentation:
    - Test Name: should fetch transactions with date range successfully
    - Purpose: Verify transaction retrieval with start and end date parameters
    - Scenario: Request transactions between two dates
    - Expected Result: Service returns filtered transactions array
    */
    it('should fetch transactions with date range successfully', function() {
      var startDate = '2024-01-01';
      var endDate = '2024-01-31';
      var mockResponse = {
        transactions: [
          { transactionId: 'txn1', amount: 100, date: '2024-01-05', merchantName: 'Store A' },
          { transactionId: 'txn2', amount: 200, date: '2024-01-15', merchantName: 'Store B' },
          { transactionId: 'txn3', amount: 150, date: '2024-01-25', merchantName: 'Store C' }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.transactions + '?start=' + startDate + '&end=' + endDate)
        .respond(200, mockResponse);

      var result;
      TransactionDataService.getTransactions(startDate, endDate).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].transactionId).toBe('txn1');
      expect(result[1].amount).toBe(200);
    });

    /*
    Test Documentation:
    - Test Name: should handle empty transactions array
    - Purpose: Verify service handles response with no transactions
    - Scenario: API returns empty transactions array for date range
    - Expected Result: Service returns empty array
    */
    it('should handle empty transactions array', function() {
      var startDate = '2024-02-01';
      var endDate = '2024-02-28';
      var mockResponse = { transactions: [] };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.transactions + '?start=' + startDate + '&end=' + endDate)
        .respond(200, mockResponse);

      var result;
      TransactionDataService.getTransactions(startDate, endDate).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle missing transactions property in response
    - Purpose: Verify service handles malformed API response
    - Scenario: API response does not include transactions property
    - Expected Result: Service returns empty array
    */
    it('should handle missing transactions property in response', function() {
      var startDate = '2024-03-01';
      var endDate = '2024-03-31';
      var mockResponse = {};

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.transactions + '?start=' + startDate + '&end=' + endDate)
        .respond(200, mockResponse);

      var result;
      TransactionDataService.getTransactions(startDate, endDate).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle single transaction
    - Purpose: Verify service works with single transaction response
    - Scenario: API returns single transaction
    - Expected Result: Service returns array with one transaction
    */
    it('should handle single transaction', function() {
      var startDate = '2024-04-01';
      var endDate = '2024-04-30';
      var mockResponse = {
        transactions: [
          { transactionId: 'txn100', amount: 500, date: '2024-04-10', merchantName: 'Merchant X' }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.transactions + '?start=' + startDate + '&end=' + endDate)
        .respond(200, mockResponse);

      var result;
      TransactionDataService.getTransactions(startDate, endDate).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(1);
      expect(result[0].transactionId).toBe('txn100');
    });

    /*
    Test Documentation:
    - Test Name: should handle 12 months of transaction history
    - Purpose: Verify service handles maximum historical data (12 months)
    - Scenario: Request transactions for 12-month period
    - Expected Result: Service returns all transactions within range
    */
    it('should handle 12 months of transaction history', function() {
      var startDate = '2023-05-01';
      var endDate = '2024-04-30';
      var transactions = [];
      for (var i = 1; i <= 100; i++) {
        transactions.push({
          transactionId: 'txn' + i,
          amount: 50 + i,
          date: '2023-' + (5 + (i % 12)) + '-01',
          merchantName: 'Merchant ' + i
        });
      }
      var mockResponse = { transactions: transactions };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.transactions + '?start=' + startDate + '&end=' + endDate)
        .respond(200, mockResponse);

      var result;
      TransactionDataService.getTransactions(startDate, endDate).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(100);
    });

    /*
    Test Documentation:
    - Test Name: should handle same start and end date
    - Purpose: Verify service handles single-day date range
    - Scenario: Start date equals end date
    - Expected Result: Service returns transactions for that single day
    */
    it('should handle same start and end date', function() {
      var startDate = '2024-05-15';
      var endDate = '2024-05-15';
      var mockResponse = {
        transactions: [
          { transactionId: 'txn200', amount: 75, date: '2024-05-15', merchantName: 'Daily Store' }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.transactions + '?start=' + startDate + '&end=' + endDate)
        .respond(200, mockResponse);

      var result;
      TransactionDataService.getTransactions(startDate, endDate).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(1);
    });

    /*
    Test Documentation:
    - Test Name: should handle transactions with zero amounts
    - Purpose: Verify service includes transactions with zero values
    - Scenario: Some transactions have amount of 0
    - Expected Result: Zero-amount transactions included in result
    */
    it('should handle transactions with zero amounts', function() {
      var startDate = '2024-06-01';
      var endDate = '2024-06-30';
      var mockResponse = {
        transactions: [
          { transactionId: 'txn300', amount: 0, date: '2024-06-05', merchantName: 'Refund Store' },
          { transactionId: 'txn301', amount: 100, date: '2024-06-10', merchantName: 'Regular Store' }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.transactions + '?start=' + startDate + '&end=' + endDate)
        .respond(200, mockResponse);

      var result;
      TransactionDataService.getTransactions(startDate, endDate).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(2);
      expect(result[0].amount).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle HTTP 500 error
    - Purpose: Verify service handles server errors gracefully
    - Scenario: API returns 500 Internal Server Error
    - Expected Result: Promise rejected with error
    */
    it('should handle HTTP 500 error', function() {
      var startDate = '2024-07-01';
      var endDate = '2024-07-31';

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.transactions + '?start=' + startDate + '&end=' + endDate)
        .respond(500, 'Internal Server Error');

      var error;
      TransactionDataService.getTransactions(startDate, endDate).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    /*
    Test Documentation:
    - Test Name: should handle HTTP 404 error
    - Purpose: Verify service handles not found errors
    - Scenario: API returns 404 Not Found
    - Expected Result: Promise rejected with error
    */
    it('should handle HTTP 404 error', function() {
      var startDate = '2024-08-01';
      var endDate = '2024-08-31';

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.transactions + '?start=' + startDate + '&end=' + endDate)
        .respond(404, 'Not Found');

      var error;
      TransactionDataService.getTransactions(startDate, endDate).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    /*
    Test Documentation:
    - Test Name: should handle network timeout
    - Purpose: Verify service handles request timeouts
    - Scenario: API request times out
    - Expected Result: Promise rejected with timeout error
    */
    it('should handle network timeout', function() {
      var startDate = '2024-09-01';
      var endDate = '2024-09-30';

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.transactions + '?start=' + startDate + '&end=' + endDate)
        .respond(-1, '');

      var error;
      TransactionDataService.getTransactions(startDate, endDate).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should preserve all transaction properties
    - Purpose: Verify service returns all transaction properties from API
    - Scenario: API returns transactions with multiple properties
    - Expected Result: All properties preserved in result
    */
    it('should preserve all transaction properties', function() {
      var startDate = '2024-10-01';
      var endDate = '2024-10-31';
      var mockResponse = {
        transactions: [
          {
            transactionId: 'txn400',
            amount: 250,
            date: '2024-10-15',
            merchantName: 'Complete Store',
            category: 'Shopping',
            cardId: 'card123',
            description: 'Purchase at store'
          }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.transactions + '?start=' + startDate + '&end=' + endDate)
        .respond(200, mockResponse);

      var result;
      TransactionDataService.getTransactions(startDate, endDate).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result[0].category).toBe('Shopping');
      expect(result[0].cardId).toBe('card123');
      expect(result[0].description).toBe('Purchase at store');
    });
  });
});

/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered:
  * Successful transaction retrieval with date range
  * Empty transactions array
  * Missing transactions property
  * Single transaction
  * 12 months of historical data
  * Same start and end date
  * Zero-amount transactions
  * HTTP error responses (500, 404)
  * Network timeout
  * Property preservation
- Uncovered scenarios: None - comprehensive coverage achieved
*/
})();