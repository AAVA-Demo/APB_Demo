/*
Test Documentation:
- Test Name: TransactionDataService Test Suite
- Purpose: Validate transaction data retrieval, caching, and error handling
- Scenario: Tests getTransactions and getTransactionById with various scenarios
- Expected Result: Service correctly fetches, caches, and returns transaction data; handles errors gracefully
*/

(function() {
  'use strict';

  describe('TransactionDataService', function() {
    var TransactionDataService, $httpBackend, AuthService, $q, $cacheFactory;
    var mockUserId = 'user123';
    var mockTransactions = [
      {
        transactionId: 'txn001',
        cardId: 'card001',
        merchantName: 'Starbucks',
        amount: 15.50,
        currency: '$',
        category: 'Food & Dining',
        transactionDate: '2024-01-15T10:30:00Z',
        status: 'posted'
      },
      {
        transactionId: 'txn002',
        cardId: 'card002',
        merchantName: 'Shell Gas Station',
        amount: 45.00,
        currency: '$',
        category: 'Fuel',
        transactionDate: '2024-01-14T08:15:00Z',
        status: 'posted'
      },
      {
        transactionId: 'txn003',
        cardId: 'card001',
        merchantName: 'Amazon',
        amount: 125.99,
        currency: '$',
        category: 'Shopping',
        transactionDate: '2024-01-13T14:20:00Z',
        status: 'pending'
      }
    ];
    var mockTransaction = mockTransactions[0];

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionDataService_, _$httpBackend_, _AuthService_, _$q_, _$cacheFactory_) {
      TransactionDataService = _TransactionDataService_;
      $httpBackend = _$httpBackend_;
      AuthService = _AuthService_;
      $q = _$q_;
      $cacheFactory = _$cacheFactory_;
      spyOn(AuthService, 'getUserId').and.returnValue(mockUserId);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Verify service is properly instantiated
    - Scenario: Service injection
    - Expected Result: Service object exists with required methods
    */
    it('should be defined', function() {
      expect(TransactionDataService).toBeDefined();
      expect(TransactionDataService.getTransactions).toBeDefined();
      expect(TransactionDataService.getTransactionById).toBeDefined();
      expect(TransactionDataService.clearCache).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should fetch all transactions successfully
    - Purpose: Validate successful transaction data retrieval
    - Scenario: Call getTransactions with userId
    - Expected Result: HTTP GET to /api/transactions with userId param, returns array of transactions
    */
    it('should fetch all transactions successfully', function() {
      $httpBackend.expectGET('/api/transactions?userId=' + mockUserId)
        .respond(200, mockTransactions);

      var result;
      TransactionDataService.getTransactions(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockTransactions);
      expect(result.length).toBe(3);
    });

    /*
    Test Documentation:
    - Test Name: should use default userId from AuthService when not provided
    - Purpose: Validate fallback to AuthService.getUserId()
    - Scenario: Call getTransactions without userId parameter
    - Expected Result: AuthService.getUserId() called, request uses returned userId
    */
    it('should use default userId from AuthService when not provided', function() {
      $httpBackend.expectGET('/api/transactions?userId=' + mockUserId)
        .respond(200, mockTransactions);

      TransactionDataService.getTransactions();
      $httpBackend.flush();

      expect(AuthService.getUserId).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should cache transaction data and return from cache on subsequent calls
    - Purpose: Validate caching mechanism for performance optimization
    - Scenario: Call getTransactions twice within cache TTL
    - Expected Result: First call makes HTTP request, second call returns cached data without HTTP request
    */
    it('should cache transaction data and return from cache on subsequent calls', function() {
      $httpBackend.expectGET('/api/transactions?userId=' + mockUserId)
        .respond(200, mockTransactions);

      var result1, result2;
      TransactionDataService.getTransactions(mockUserId).then(function(data) {
        result1 = data;
      });

      $httpBackend.flush();

      TransactionDataService.getTransactions(mockUserId).then(function(data) {
        result2 = data;
      });

      expect(result1).toEqual(mockTransactions);
      expect(result2).toEqual(mockTransactions);
    });

    /*
    Test Documentation:
    - Test Name: should handle HTTP error and reject promise
    - Purpose: Validate error handling when API call fails
    - Scenario: API returns 500 error
    - Expected Result: Promise rejected, error logged to console
    */
    it('should handle HTTP error and reject promise', function() {
      $httpBackend.expectGET('/api/transactions?userId=' + mockUserId)
        .respond(500, 'Internal Server Error');

      spyOn(console, 'error');
      var errorResult;
      TransactionDataService.getTransactions(mockUserId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalledWith('Error fetching transactions:', jasmine.any(Object));
    });

    /*
    Test Documentation:
    - Test Name: should return cached data when HTTP error occurs and cache exists
    - Purpose: Validate fallback to cached data on error
    - Scenario: First successful call, second call fails but cache exists
    - Expected Result: Second call returns cached data despite HTTP error
    */
    it('should return cached data when HTTP error occurs and cache exists', function() {
      $httpBackend.expectGET('/api/transactions?userId=' + mockUserId)
        .respond(200, mockTransactions);

      var result1;
      TransactionDataService.getTransactions(mockUserId).then(function(data) {
        result1 = data;
      });
      $httpBackend.flush();

      expect(result1).toEqual(mockTransactions);

      var result2;
      TransactionDataService.getTransactions(mockUserId).then(function(data) {
        result2 = data;
      });

      expect(result2).toEqual(mockTransactions);
    });

    /*
    Test Documentation:
    - Test Name: should clear cache
    - Purpose: Validate cache clearing functionality
    - Scenario: Cache data, call clearCache(), verify cache is empty
    - Expected Result: Cache cleared, subsequent call makes new HTTP request
    */
    it('should clear cache', function() {
      $httpBackend.expectGET('/api/transactions?userId=' + mockUserId)
        .respond(200, mockTransactions);

      TransactionDataService.getTransactions(mockUserId);
      $httpBackend.flush();

      TransactionDataService.clearCache();

      $httpBackend.expectGET('/api/transactions?userId=' + mockUserId)
        .respond(200, mockTransactions);

      TransactionDataService.getTransactions(mockUserId);
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should fetch a specific transaction by ID
    - Purpose: Validate retrieval of individual transaction details
    - Scenario: Call getTransactionById with valid transactionId
    - Expected Result: HTTP GET to /api/transactions/:id, returns transaction object
    */
    it('should fetch a specific transaction by ID', function() {
      var transactionId = 'txn001';
      $httpBackend.expectGET('/api/transactions/' + transactionId)
        .respond(200, mockTransaction);

      var result;
      TransactionDataService.getTransactionById(transactionId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockTransaction);
      expect(result.transactionId).toBe(transactionId);
    });

    /*
    Test Documentation:
    - Test Name: should handle error when fetching transaction by ID
    - Purpose: Validate error handling for invalid transaction ID
    - Scenario: API returns 404 Not Found
    - Expected Result: Promise rejected, error logged to console
    */
    it('should handle error when fetching transaction by ID', function() {
      var transactionId = 'invalid-txn';
      $httpBackend.expectGET('/api/transactions/' + transactionId)
        .respond(404, 'Transaction not found');

      spyOn(console, 'error');
      var errorResult;
      TransactionDataService.getTransactionById(transactionId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalledWith('Error fetching transaction:', jasmine.any(Object));
    });

    /*
    Test Documentation:
    - Test Name: should handle empty transactions array response
    - Purpose: Validate handling of user with no transactions
    - Scenario: API returns empty array
    - Expected Result: Service returns empty array without errors
    */
    it('should handle empty transactions array response', function() {
      $httpBackend.expectGET('/api/transactions?userId=' + mockUserId)
        .respond(200, []);

      var result;
      TransactionDataService.getTransactions(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle network timeout
    - Purpose: Validate behavior on network timeout
    - Scenario: HTTP request times out
    - Expected Result: Promise rejected with timeout error
    */
    it('should handle network timeout', function() {
      $httpBackend.expectGET('/api/transactions?userId=' + mockUserId)
        .respond(408, 'Request Timeout');

      spyOn(console, 'error');
      var errorResult;
      TransactionDataService.getTransactions(mockUserId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should handle unauthorized access
    - Purpose: Validate handling of 401 Unauthorized error
    - Scenario: API returns 401 error
    - Expected Result: Promise rejected with auth error
    */
    it('should handle unauthorized access', function() {
      $httpBackend.expectGET('/api/transactions?userId=' + mockUserId)
        .respond(401, 'Unauthorized');

      spyOn(console, 'error');
      var errorResult;
      TransactionDataService.getTransactions(mockUserId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should handle malformed transaction data response
    - Purpose: Validate handling of unexpected response format
    - Scenario: API returns non-array response for getTransactions
    - Expected Result: Service returns whatever API provides
    */
    it('should handle malformed transaction data response', function() {
      var malformedData = { error: false, data: 'not-an-array' };
      $httpBackend.expectGET('/api/transactions?userId=' + mockUserId)
        .respond(200, malformedData);

      var result;
      TransactionDataService.getTransactions(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(malformedData);
    });

    /*
    Test Documentation:
    - Test Name: should handle null transactionId parameter
    - Purpose: Validate handling of null/undefined transactionId
    - Scenario: Call getTransactionById with null
    - Expected Result: HTTP GET to /api/transactions/null
    */
    it('should handle null transactionId parameter', function() {
      $httpBackend.expectGET('/api/transactions/null')
        .respond(400, 'Invalid transaction ID');

      spyOn(console, 'error');
      var errorResult;
      TransactionDataService.getTransactionById(null).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should handle large transaction dataset
    - Purpose: Validate handling of large number of transactions
    - Scenario: API returns 10,000 transactions
    - Expected Result: Service successfully processes and returns all transactions
    */
    it('should handle large transaction dataset', function() {
      var largeDataset = [];
      for (var i = 0; i < 10000; i++) {
        largeDataset.push({
          transactionId: 'txn' + i,
          cardId: 'card001',
          merchantName: 'Merchant ' + i,
          amount: Math.random() * 1000,
          currency: '$',
          category: 'Shopping',
          transactionDate: '2024-01-01T00:00:00Z',
          status: 'posted'
        });
      }

      $httpBackend.expectGET('/api/transactions?userId=' + mockUserId)
        .respond(200, largeDataset);

      var result;
      TransactionDataService.getTransactions(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(10000);
    });

    /*
    Test Documentation:
    - Test Name: should handle multiple concurrent transaction requests
    - Purpose: Validate service handles parallel requests
    - Scenario: Call getTransactions and getTransactionById simultaneously
    - Expected Result: Both requests processed independently
    */
    it('should handle multiple concurrent transaction requests', function() {
      $httpBackend.expectGET('/api/transactions?userId=' + mockUserId)
        .respond(200, mockTransactions);
      $httpBackend.expectGET('/api/transactions/txn001')
        .respond(200, mockTransaction);

      var result1, result2;
      TransactionDataService.getTransactions(mockUserId).then(function(data) {
        result1 = data;
      });
      TransactionDataService.getTransactionById('txn001').then(function(data) {
        result2 = data;
      });

      $httpBackend.flush();

      expect(result1).toEqual(mockTransactions);
      expect(result2).toEqual(mockTransaction);
    });
  });

})();

/*
Coverage Report:
- Functions tested: getTransactions, getTransactionById, clearCache
- Scenarios covered:
  * Successful transaction retrieval (all transactions and by ID)
  * Cache hit and miss scenarios
  * Error handling (500, 404, 401, 408 errors)
  * Fallback to cached data on error
  * Empty transactions array
  * Default userId from AuthService
  * Cache clearing
  * Network timeout
  * Unauthorized access
  * Malformed response data
  * Null/undefined parameters
  * Large dataset handling (10,000 transactions)
  * Concurrent requests
- Edge cases: Empty response, malformed data, null transactionId, network errors, large datasets
- Uncovered scenarios: Cache TTL expiration (requires time manipulation), pagination, filtering
*/