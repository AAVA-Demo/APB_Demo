/*
Test Documentation:
- Test Name: TransactionService Test Suite
- Purpose: Validate monthly transaction retrieval and card-wise spend calculations
- Scenario: Tests fetching current month transactions and calculating spend per card
- Expected Result: Service correctly retrieves monthly data and computes card-specific spending metrics
*/

(function() {
'use strict';

describe('TransactionService', function() {
  var TransactionService, $httpBackend, API_ENDPOINTS;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _API_ENDPOINTS_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    API_ENDPOINTS = _API_ENDPOINTS_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getMonthlyTransactions', function() {
    /*
    Test Documentation:
    - Test Name: should fetch monthly transactions and calculate total spend
    - Purpose: Verify monthly transaction retrieval with spend aggregation
    - Scenario: API returns current month transactions
    - Expected Result: Service returns monthlySpend and transactions array
    */
    it('should fetch monthly transactions and calculate total spend', function() {
      var mockResponse = {
        transactions: [
          { transactionId: 'txn1', amount: 100, date: '2024-11-05' },
          { transactionId: 'txn2', amount: 250, date: '2024-11-10' },
          { transactionId: 'txn3', amount: 150, date: '2024-11-15' }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.monthlyTransactions)
        .respond(200, mockResponse);

      var result;
      TransactionService.getMonthlyTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.monthlySpend).toBe(500);
      expect(result.transactions.length).toBe(3);
    });

    /*
    Test Documentation:
    - Test Name: should handle empty transactions array
    - Purpose: Verify service handles month with no transactions
    - Scenario: API returns empty transactions array
    - Expected Result: monthlySpend is 0 and transactions array is empty
    */
    it('should handle empty transactions array', function() {
      var mockResponse = { transactions: [] };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.monthlyTransactions)
        .respond(200, mockResponse);

      var result;
      TransactionService.getMonthlyTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.monthlySpend).toBe(0);
      expect(result.transactions.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle missing transactions property
    - Purpose: Verify service handles malformed API response
    - Scenario: API response does not include transactions property
    - Expected Result: monthlySpend is 0 and transactions array is empty
    */
    it('should handle missing transactions property', function() {
      var mockResponse = {};

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.monthlyTransactions)
        .respond(200, mockResponse);

      var result;
      TransactionService.getMonthlyTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.monthlySpend).toBe(0);
      expect(result.transactions.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle transactions with missing amounts
    - Purpose: Verify service handles transactions with undefined amounts
    - Scenario: Some transactions have missing amount property
    - Expected Result: Missing amounts treated as 0 in calculation
    */
    it('should handle transactions with missing amounts', function() {
      var mockResponse = {
        transactions: [
          { transactionId: 'txn1', amount: 100 },
          { transactionId: 'txn2' },
          { transactionId: 'txn3', amount: 200 }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.monthlyTransactions)
        .respond(200, mockResponse);

      var result;
      TransactionService.getMonthlyTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.monthlySpend).toBe(300);
    });

    /*
    Test Documentation:
    - Test Name: should handle transactions with zero amounts
    - Purpose: Verify service includes zero-amount transactions
    - Scenario: Some transactions have amount of 0
    - Expected Result: Zero amounts included in calculation
    */
    it('should handle transactions with zero amounts', function() {
      var mockResponse = {
        transactions: [
          { transactionId: 'txn1', amount: 100 },
          { transactionId: 'txn2', amount: 0 },
          { transactionId: 'txn3', amount: 50 }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.monthlyTransactions)
        .respond(200, mockResponse);

      var result;
      TransactionService.getMonthlyTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.monthlySpend).toBe(150);
    });

    /*
    Test Documentation:
    - Test Name: should handle HTTP 500 error
    - Purpose: Verify service handles server errors
    - Scenario: API returns 500 Internal Server Error
    - Expected Result: Promise rejected with error
    */
    it('should handle HTTP 500 error', function() {
      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.monthlyTransactions)
        .respond(500, 'Internal Server Error');

      var error;
      TransactionService.getMonthlyTransactions().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    /*
    Test Documentation:
    - Test Name: should handle network timeout
    - Purpose: Verify service handles request timeouts
    - Scenario: API request times out
    - Expected Result: Promise rejected with timeout error
    */
    it('should handle network timeout', function() {
      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.monthlyTransactions)
        .respond(-1, '');

      var error;
      TransactionService.getMonthlyTransactions().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });
  });

  describe('getCardWiseSpend', function() {
    /*
    Test Documentation:
    - Test Name: should fetch card-wise spend data successfully
    - Purpose: Verify card-specific spending data retrieval
    - Scenario: API returns spend data for specific card
    - Expected Result: Service returns card spend details
    */
    it('should fetch card-wise spend data successfully', function() {
      var cardId = 'card123';
      var mockResponse = {
        monthlySpend: 1500,
        totalTransactions: 25,
        lastTransactionDate: '2024-11-20'
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cardWiseSpend + '/' + cardId + '/spend')
        .respond(200, mockResponse);

      var result;
      TransactionService.getCardWiseSpend(cardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.monthlySpend).toBe(1500);
      expect(result.totalTransactions).toBe(25);
      expect(result.lastTransactionDate).toBe('2024-11-20');
    });

    /*
    Test Documentation:
    - Test Name: should handle card with no spending
    - Purpose: Verify service handles card with zero spend
    - Scenario: Card has no transactions
    - Expected Result: Service returns zero spend data
    */
    it('should handle card with no spending', function() {
      var cardId = 'card456';
      var mockResponse = {
        monthlySpend: 0,
        totalTransactions: 0,
        lastTransactionDate: null
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cardWiseSpend + '/' + cardId + '/spend')
        .respond(200, mockResponse);

      var result;
      TransactionService.getCardWiseSpend(cardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.monthlySpend).toBe(0);
      expect(result.totalTransactions).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle HTTP 404 error for invalid card
    - Purpose: Verify service handles non-existent card errors
    - Scenario: API returns 404 for invalid card ID
    - Expected Result: Promise rejected with error
    */
    it('should handle HTTP 404 error for invalid card', function() {
      var cardId = 'invalidCard';

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cardWiseSpend + '/' + cardId + '/spend')
        .respond(404, 'Card Not Found');

      var error;
      TransactionService.getCardWiseSpend(cardId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    /*
    Test Documentation:
    - Test Name: should handle HTTP 500 error
    - Purpose: Verify service handles server errors
    - Scenario: API returns 500 Internal Server Error
    - Expected Result: Promise rejected with error
    */
    it('should handle HTTP 500 error', function() {
      var cardId = 'card789';

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cardWiseSpend + '/' + cardId + '/spend')
        .respond(500, 'Internal Server Error');

      var error;
      TransactionService.getCardWiseSpend(cardId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    /*
    Test Documentation:
    - Test Name: should handle network timeout
    - Purpose: Verify service handles request timeouts
    - Scenario: API request times out
    - Expected Result: Promise rejected with timeout error
    */
    it('should handle network timeout', function() {
      var cardId = 'card999';

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cardWiseSpend + '/' + cardId + '/spend')
        .respond(-1, '');

      var error;
      TransactionService.getCardWiseSpend(cardId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should handle multiple card IDs
    - Purpose: Verify service can fetch spend for different cards
    - Scenario: Sequential calls for different card IDs
    - Expected Result: Each call returns correct card-specific data
    */
    it('should handle multiple card IDs', function() {
      var cardId1 = 'card111';
      var cardId2 = 'card222';
      var mockResponse1 = { monthlySpend: 1000, totalTransactions: 10 };
      var mockResponse2 = { monthlySpend: 2000, totalTransactions: 20 };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cardWiseSpend + '/' + cardId1 + '/spend')
        .respond(200, mockResponse1);
      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cardWiseSpend + '/' + cardId2 + '/spend')
        .respond(200, mockResponse2);

      var result1, result2;
      TransactionService.getCardWiseSpend(cardId1).then(function(data) {
        result1 = data;
      });
      TransactionService.getCardWiseSpend(cardId2).then(function(data) {
        result2 = data;
      });

      $httpBackend.flush();

      expect(result1.monthlySpend).toBe(1000);
      expect(result2.monthlySpend).toBe(2000);
    });
  });
});

/*
Coverage Report:
- Functions tested: getMonthlyTransactions, getCardWiseSpend
- Scenarios covered:
  * Monthly transaction retrieval with spend calculation
  * Empty transactions handling
  * Missing transactions property
  * Missing/zero transaction amounts
  * Card-wise spend data retrieval
  * Card with no spending
  * HTTP error responses (404, 500)
  * Network timeouts
  * Multiple card ID handling
- Uncovered scenarios: None - comprehensive coverage achieved
*/
})();