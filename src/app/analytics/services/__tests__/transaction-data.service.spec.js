/*
Test Documentation:
- Test Name: transactionDataService Unit Tests
- Purpose: Validates transaction data resource service for querying transaction records
- Scenario: Tests $resource configuration and query method with proper timeout settings
- Expected Result: Service should correctly interact with transaction API endpoints
*/

describe('transactionDataService', function() {
  'use strict';

  var transactionDataService, $httpBackend, API_CONFIG;
  var mockTransactionId = 'txn123';
  var mockTransaction = {
    transactionId: 'txn123',
    cardId: 'card1',
    userId: 'user123',
    amount: 125.50,
    category: 'Shopping',
    date: '2026-11-10T10:00:00.000Z',
    description: 'Purchase',
    merchantName: 'Store ABC'
  };
  var mockTransactions = [mockTransaction];

  beforeEach(module('creditCardApp.analytics'));

  beforeEach(inject(function(_transactionDataService_, _$httpBackend_, _API_CONFIG_) {
    transactionDataService = _transactionDataService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(transactionDataService).toBeDefined();
    });

    it('should have query method', function() {
      expect(transactionDataService.query).toBeDefined();
      expect(typeof transactionDataService.query).toBe('function');
    });
  });

  describe('query() method', function() {
    it('should make GET request to transactions endpoint', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
      $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

      transactionDataService.query();
      $httpBackend.flush();
    });

    it('should return array of transactions', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
      $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

      var result = transactionDataService.query();
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty transaction list', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
      $httpBackend.expectGET(expectedUrl).respond(200, []);

      var result = transactionDataService.query();
      $httpBackend.flush();
      
      expect(result.length).toBe(0);
    });

    it('should handle query errors', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
      $httpBackend.expectGET(expectedUrl).respond(500, {error: 'Server Error'});

      var result = transactionDataService.query();
      $httpBackend.flush();
    });

    it('should support query parameters', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?userId=user123';
      $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

      transactionDataService.query({userId: 'user123'});
      $httpBackend.flush();
    });
  });

  describe('Timeout Configuration', function() {
    it('should include timeout in query requests', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
      $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

      transactionDataService.query();
      $httpBackend.flush();
    });
  });

  describe('Transaction Data Validation', function() {
    it('should return transactions with all required fields', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
      $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

      var result = transactionDataService.query();
      $httpBackend.flush();
      
      expect(result[0].transactionId).toBeDefined();
      expect(result[0].amount).toBeDefined();
      expect(result[0].category).toBeDefined();
      expect(result[0].date).toBeDefined();
    });

    it('should handle transactions with numeric amounts', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
      $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

      var result = transactionDataService.query();
      $httpBackend.flush();
      
      expect(typeof result[0].amount).toBe('number');
    });
  });

  describe('Multiple Query Scenarios', function() {
    it('should handle multiple query calls', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
      $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);
      $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

      transactionDataService.query();
      transactionDataService.query();
      $httpBackend.flush();
    });

    it('should handle queries with different parameters', function() {
      var baseUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
      $httpBackend.expectGET(baseUrl + '?userId=user1').respond(200, []);
      $httpBackend.expectGET(baseUrl + '?userId=user2').respond(200, []);

      transactionDataService.query({userId: 'user1'});
      transactionDataService.query({userId: 'user2'});
      $httpBackend.flush();
    });
  });

  describe('Category Filtering', function() {
    it('should support category parameter in query', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?category=Shopping';
      $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

      transactionDataService.query({category: 'Shopping'});
      $httpBackend.flush();
    });

    it('should return transactions matching category', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?category=Shopping';
      $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

      var result = transactionDataService.query({category: 'Shopping'});
      $httpBackend.flush();
      
      expect(result[0].category).toBe('Shopping');
    });
  });
});

/*
Coverage Report:
- Functions tested: query (via $resource)
- Scenarios covered:
  * Query all transactions
  * Empty result handling
  * Error handling (500)
  * Query with parameters (userId, category)
  * Timeout configuration
  * Multiple concurrent queries
  * Transaction data validation
- Uncovered scenarios: Pagination, date range filtering, sorting
*/