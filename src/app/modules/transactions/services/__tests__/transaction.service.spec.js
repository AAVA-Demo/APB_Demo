/*
Test Documentation:
- Test Name: TransactionService functionality
- Purpose: Validate transaction data retrieval and caching
- Scenario: Test getTransactions and getTransactionById
- Expected Result: Transactions retrieved and cached properly
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $httpBackend, API_CONFIG, $cacheFactory;
    var mockTransactions = {
      transactions: [
        { transactionId: 'tx1', merchantName: 'Amazon', amount: 150.00, status: 'Completed' },
        { transactionId: 'tx2', merchantName: 'Starbucks', amount: 5.50, status: 'Completed' }
      ],
      totalCount: 2
    };

    beforeEach(module('app.transactions'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_, _API_CONFIG_, _$cacheFactory_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
      $cacheFactory = _$cacheFactory_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Ensure service is injectable
    - Scenario: Inject TransactionService
    - Expected Result: Service is defined
    */
    it('should be defined', function() {
      expect(TransactionService).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: getTransactions should retrieve paginated transactions
    - Purpose: Validate transaction list retrieval
    - Scenario: HTTP GET with pagination params
    - Expected Result: Returns transactions array and total count
    */
    it('getTransactions should retrieve paginated transactions', function() {
      var filterParams = { cardId: 'card1' };
      var page = 1;
      var pageSize = 50;

      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=card1&page=1&size=50')
        .respond(200, mockTransactions);

      var result;
      TransactionService.getTransactions(filterParams, page, pageSize).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result.transactions).toEqual(mockTransactions.transactions);
      expect(result.totalCount).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: getTransactions should handle empty results
    - Purpose: Validate empty response handling
    - Scenario: API returns no transactions
    - Expected Result: Returns empty array
    */
    it('getTransactions should handle empty results', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?page=1&size=50')
        .respond(200, {});

      var result;
      TransactionService.getTransactions({}, 1, 50).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result.transactions).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: getTransactions should handle API errors
    - Purpose: Validate error handling
    - Scenario: API returns 500 error
    - Expected Result: Promise rejected
    */
    it('getTransactions should handle API errors', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?page=1&size=50')
        .respond(500, 'Server error');

      var error;
      TransactionService.getTransactions({}, 1, 50).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    /*
    Test Documentation:
    - Test Name: getTransactionById should retrieve specific transaction
    - Purpose: Validate single transaction retrieval
    - Scenario: HTTP GET to /transactions/:id
    - Expected Result: Returns transaction object
    */
    it('getTransactionById should retrieve specific transaction', function() {
      var transactionId = 'tx1';
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/' + transactionId)
        .respond(200, mockTransactions.transactions[0]);

      var result;
      TransactionService.getTransactionById(transactionId).then(function(tx) {
        result = tx;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockTransactions.transactions[0]);
      expect(result.transactionId).toBe('tx1');
    });

    /*
    Test Documentation:
    - Test Name: getTransactionById should use cache on subsequent calls
    - Purpose: Validate caching mechanism
    - Scenario: Call getTransactionById twice
    - Expected Result: Second call uses cache
    */
    it('getTransactionById should use cache on subsequent calls', function() {
      var transactionId = 'tx1';
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/' + transactionId)
        .respond(200, mockTransactions.transactions[0]);

      TransactionService.getTransactionById(transactionId);
      $httpBackend.flush();

      var result;
      TransactionService.getTransactionById(transactionId).then(function(tx) {
        result = tx;
      });

      expect(result).toEqual(mockTransactions.transactions[0]);
    });
  });

  /*
  Coverage Report:
  - Functions tested: getTransactions, getTransactionById
  - Scenarios covered: successful retrieval, empty results, error handling, caching
  - Uncovered scenarios: timeout scenarios
  */
})();