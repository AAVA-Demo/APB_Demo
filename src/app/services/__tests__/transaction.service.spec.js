/*
Test Documentation:
- Test Name: transactionService - transaction data operations
- Purpose: Validates transaction service HTTP requests with caching
- Scenario: Service fetches transactions and transaction details
- Expected Result: Returns transaction data and handles errors
*/

(function() {
  'use strict';

  describe('transactionService', function() {
    var transactionService;
    var $httpBackend;
    var mockTransactions;
    var mockTransaction;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_transactionService_, _$httpBackend_) {
      transactionService = _transactionService_;
      $httpBackend = _$httpBackend_;

      mockTransactions = [
        { transactionId: 1, amount: 100, merchant: 'Amazon' },
        { transactionId: 2, amount: 200, merchant: 'Walmart' }
      ];

      mockTransaction = { transactionId: 1, amount: 100, merchant: 'Amazon', description: 'Purchase' };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: should fetch all transactions
    - Purpose: Validates getTransactions method
    - Scenario: Request all transactions
    - Expected Result: Makes GET request to /api/transactions and returns data
    */
    it('should fetch all transactions', function() {
      $httpBackend.expectGET('/api/transactions').respond(200, mockTransactions);

      var result;
      transactionService.getTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockTransactions);
    });

    /*
    Test Documentation:
    - Test Name: should cache transactions
    - Purpose: Validates caching mechanism
    - Scenario: Multiple calls to getTransactions
    - Expected Result: HTTP request cached, subsequent calls use cache
    */
    it('should cache transactions', function() {
      $httpBackend.expectGET('/api/transactions').respond(200, mockTransactions);

      transactionService.getTransactions();
      $httpBackend.flush();

      // Second call should use cache (no new HTTP request expected)
      var result;
      transactionService.getTransactions().then(function(data) {
        result = data;
      });

      expect(result).toEqual(mockTransactions);
    });

    /*
    Test Documentation:
    - Test Name: should fetch transaction by ID
    - Purpose: Validates getTransactionById method
    - Scenario: Request specific transaction
    - Expected Result: Makes GET request to /api/transactions/:id and returns data
    */
    it('should fetch transaction by ID', function() {
      var transactionId = 1;
      $httpBackend.expectGET('/api/transactions/' + transactionId).respond(200, mockTransaction);

      var result;
      transactionService.getTransactionById(transactionId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockTransaction);
    });

    /*
    Test Documentation:
    - Test Name: should handle getTransactions error
    - Purpose: Validates error handling for failed API call
    - Scenario: API returns error response
    - Expected Result: Promise rejected with error
    */
    it('should handle getTransactions error', function() {
      $httpBackend.expectGET('/api/transactions').respond(500, 'Server Error');

      var error;
      transactionService.getTransactions().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should handle getTransactionById error
    - Purpose: Validates error handling for transaction fetch by ID
    - Scenario: API returns 404 for non-existent transaction
    - Expected Result: Promise rejected with error
    */
    it('should handle getTransactionById error', function() {
      $httpBackend.expectGET('/api/transactions/999').respond(404, 'Not Found');

      var error;
      transactionService.getTransactionById(999).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should handle empty transactions array
    - Purpose: Validates handling of empty response
    - Scenario: API returns empty array
    - Expected Result: Returns empty array without error
    */
    it('should handle empty transactions array', function() {
      $httpBackend.expectGET('/api/transactions').respond(200, []);

      var result;
      transactionService.getTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
    });

    /*
    Test Documentation:
    - Test Name: should fetch different transaction IDs
    - Purpose: Validates fetching multiple different transactions
    - Scenario: Request different transactions by ID
    - Expected Result: Each request returns correct transaction
    */
    it('should fetch different transaction IDs', function() {
      $httpBackend.expectGET('/api/transactions/1').respond(200, mockTransactions[0]);
      $httpBackend.expectGET('/api/transactions/2').respond(200, mockTransactions[1]);

      var result1, result2;
      transactionService.getTransactionById(1).then(function(data) {
        result1 = data;
      });
      transactionService.getTransactionById(2).then(function(data) {
        result2 = data;
      });

      $httpBackend.flush();

      expect(result1.transactionId).toBe(1);
      expect(result2.transactionId).toBe(2);
    });
  });

  /*
  Coverage Report:
  - Functions tested: getTransactions, getTransactionById
  - Scenarios covered: successful fetches, caching, error handling, empty array, multiple IDs
  - Edge cases: server errors, 404 responses, empty array, cache behavior
  - Uncovered scenarios: none
  */
})();