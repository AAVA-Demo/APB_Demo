/*
Test Documentation:
- Test Name: transactionDataService - transaction data retrieval
- Purpose: Validates transaction data service HTTP operations
- Scenario: Service fetches transaction data from API
- Expected Result: Returns transaction data and handles errors
*/

(function() {
  'use strict';

  describe('transactionDataService', function() {
    var transactionDataService;
    var $httpBackend;
    var mockTransactions;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_transactionDataService_, _$httpBackend_) {
      transactionDataService = _transactionDataService_;
      $httpBackend = _$httpBackend_;

      mockTransactions = [
        { transactionId: 1, amount: 100, transactionDate: '2023-01-15', category: 'Shopping' },
        { transactionId: 2, amount: 200, transactionDate: '2023-02-20', category: 'Food & Dining' },
        { transactionId: 3, amount: 150, transactionDate: '2023-03-10', category: 'Travel' }
      ];
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
      transactionDataService.getTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockTransactions);
      expect(result.length).toBe(3);
    });

    /*
    Test Documentation:
    - Test Name: should handle successful response with data
    - Purpose: Validates successful data retrieval
    - Scenario: API returns transaction data
    - Expected Result: Promise resolved with transaction array
    */
    it('should handle successful response with data', function() {
      $httpBackend.expectGET('/api/transactions').respond(200, mockTransactions);

      var success = false;
      transactionDataService.getTransactions().then(function(data) {
        success = true;
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
      });

      $httpBackend.flush();
      expect(success).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: should handle API error
    - Purpose: Validates error handling for failed API call
    - Scenario: API returns error response
    - Expected Result: Promise rejected with error
    */
    it('should handle API error', function() {
      $httpBackend.expectGET('/api/transactions').respond(500, 'Internal Server Error');

      var error;
      transactionDataService.getTransactions().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should handle 404 not found
    - Purpose: Validates handling of 404 response
    - Scenario: API endpoint not found
    - Expected Result: Promise rejected with 404 error
    */
    it('should handle 404 not found', function() {
      $httpBackend.expectGET('/api/transactions').respond(404, 'Not Found');

      var error;
      transactionDataService.getTransactions().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
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
      transactionDataService.getTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should return promise
    - Purpose: Validates method returns promise
    - Scenario: Call getTransactions
    - Expected Result: Returns promise object
    */
    it('should return promise', function() {
      $httpBackend.expectGET('/api/transactions').respond(200, mockTransactions);

      var result = transactionDataService.getTransactions();

      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle network timeout
    - Purpose: Validates handling of network timeout
    - Scenario: Request times out
    - Expected Result: Promise rejected with timeout error
    */
    it('should handle network timeout', function() {
      $httpBackend.expectGET('/api/transactions').respond(-1, '');

      var error;
      transactionDataService.getTransactions().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should handle large transaction dataset
    - Purpose: Validates handling of large data response
    - Scenario: API returns large number of transactions
    - Expected Result: Returns all transactions without error
    */
    it('should handle large transaction dataset', function() {
      var largeDataset = [];
      for (var i = 0; i < 10000; i++) {
        largeDataset.push({ transactionId: i, amount: 100, category: 'Shopping' });
      }

      $httpBackend.expectGET('/api/transactions').respond(200, largeDataset);

      var result;
      transactionDataService.getTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(10000);
    });
  });

  /*
  Coverage Report:
  - Functions tested: getTransactions
  - Scenarios covered: successful fetch, error handling, empty array, 404, timeout, large dataset
  - Edge cases: empty response, server errors, network issues, large data
  - Uncovered scenarios: none
  */
})();