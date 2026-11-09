/*
Test Documentation:
- Test Name: TransactionService Unit Tests
- Purpose: Validate TransactionService functionality including transaction retrieval with filters, individual transaction lookup, monthly data aggregation, and mock data generation
- Scenario: Tests cover successful API calls, complex filtering scenarios, error handling, and data structure validation
- Expected Result: All service methods work correctly with proper promise resolution/rejection, filter application, and data integrity
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $httpBackend, $rootScope, API_CONFIG;
    var mockTransactions, mockSingleTransaction, mockMonthlyData;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$rootScope_, _API_CONFIG_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      API_CONFIG = _API_CONFIG_;

      mockTransactions = [
        {
          transactionId: 'TXN001',
          cardId: 'CC001',
          merchantName: 'Starbucks',
          transactionDate: new Date('2024-01-15'),
          amount: 45.50,
          currency: 'USD',
          category: 'Food & Dining',
          status: 'Completed',
          description: 'Coffee and breakfast'
        },
        {
          transactionId: 'TXN002',
          cardId: 'CC001',
          merchantName: 'Shell Gas Station',
          transactionDate: new Date('2024-01-14'),
          amount: 60.00,
          currency: 'USD',
          category: 'Fuel',
          status: 'Completed',
          description: 'Fuel refill'
        },
        {
          transactionId: 'TXN003',
          cardId: 'CC002',
          merchantName: 'Amazon',
          transactionDate: new Date('2024-01-13'),
          amount: 120.75,
          currency: 'USD',
          category: 'Shopping',
          status: 'Completed',
          description: 'Electronics purchase'
        }
      ];

      mockSingleTransaction = mockTransactions[0];

      mockMonthlyData = {
        monthlySpend: 12700,
        transactionCount: 156,
        period: { month: 'January', year: 2024 }
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: getTransactions - successful retrieval without filters
    - Purpose: Verify service retrieves all transactions without filters
    - Scenario: Call getTransactions with no filter parameters
    - Expected Result: Promise resolves with array of all transactions
    */
    it('should retrieve all transactions successfully without filters', function() {
      var result;
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions').respond(200, mockTransactions);

      TransactionService.getTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockTransactions);
      expect(result.length).toBe(3);
    });

    /*
    Test Documentation:
    - Test Name: getTransactions - filter by card ID
    - Purpose: Verify service filters transactions by specific card
    - Scenario: Call getTransactions with cardId filter
    - Expected Result: URL includes cardId parameter, promise resolves with filtered data
    */
    it('should filter transactions by card ID', function() {
      var result;
      var filters = { cardId: 'CC001' };
      var expectedUrl = API_CONFIG.baseUrl + '/transactions?cardId=CC001';

      $httpBackend.expectGET(expectedUrl).respond(200, [mockTransactions[0], mockTransactions[1]]);

      TransactionService.getTransactions(filters).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('CC001');
    });

    /*
    Test Documentation:
    - Test Name: getTransactions - filter by date range
    - Purpose: Verify service filters transactions by start and end date
    - Scenario: Call getTransactions with startDate and endDate filters
    - Expected Result: URL includes both date parameters
    */
    it('should filter transactions by date range', function() {
      var result;
      var filters = { startDate: '2024-01-01', endDate: '2024-01-31' };
      var expectedUrl = API_CONFIG.baseUrl + '/transactions?startDate=2024-01-01&endDate=2024-01-31';

      $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

      TransactionService.getTransactions(filters).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockTransactions);
    });

    /*
    Test Documentation:
    - Test Name: getTransactions - filter by search term
    - Purpose: Verify service filters transactions by merchant name or description
    - Scenario: Call getTransactions with searchTerm filter
    - Expected Result: URL includes encoded search parameter
    */
    it('should filter transactions by search term', function() {
      var result;
      var filters = { searchTerm: 'Starbucks' };
      var expectedUrl = API_CONFIG.baseUrl + '/transactions?search=Starbucks';

      $httpBackend.expectGET(expectedUrl).respond(200, [mockTransactions[0]]);

      TransactionService.getTransactions(filters).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result.length).toBe(1);
      expect(result[0].merchantName).toBe('Starbucks');
    });

    /*
    Test Documentation:
    - Test Name: getTransactions - filter by category
    - Purpose: Verify service filters transactions by spending category
    - Scenario: Call getTransactions with category filter
    - Expected Result: URL includes category parameter
    */
    it('should filter transactions by category', function() {
      var result;
      var filters = { category: 'Food & Dining' };
      var expectedUrl = API_CONFIG.baseUrl + '/transactions?category=Food & Dining';

      $httpBackend.expectGET(expectedUrl).respond(200, [mockTransactions[0]]);

      TransactionService.getTransactions(filters).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result.length).toBe(1);
      expect(result[0].category).toBe('Food & Dining');
    });

    /*
    Test Documentation:
    - Test Name: getTransactions - multiple filters combined
    - Purpose: Verify service handles multiple filters simultaneously
    - Scenario: Call getTransactions with cardId, startDate, endDate, searchTerm, and category
    - Expected Result: URL includes all filter parameters joined with &
    */
    it('should handle multiple filters simultaneously', function() {
      var result;
      var filters = {
        cardId: 'CC001',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        searchTerm: 'Coffee',
        category: 'Food & Dining'
      };
      var expectedUrl = API_CONFIG.baseUrl + '/transactions?cardId=CC001&startDate=2024-01-01&endDate=2024-01-31&search=Coffee&category=Food & Dining';

      $httpBackend.expectGET(expectedUrl).respond(200, [mockTransactions[0]]);

      TransactionService.getTransactions(filters).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result.length).toBe(1);
    });

    /*
    Test Documentation:
    - Test Name: getTransactions - encodes special characters in search term
    - Purpose: Verify service properly encodes search terms with special characters
    - Scenario: Call getTransactions with search term containing spaces and special chars
    - Expected Result: Search term is URL encoded using encodeURIComponent
    */
    it('should encode special characters in search term', function() {
      var result;
      var filters = { searchTerm: 'Coffee & Tea' };
      var expectedUrl = API_CONFIG.baseUrl + '/transactions?search=Coffee%20%26%20Tea';

      $httpBackend.expectGET(expectedUrl).respond(200, []);

      TransactionService.getTransactions(filters).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual([]);
    });

    /*
    Test Documentation:
    - Test Name: getTransactions - handles API error
    - Purpose: Verify service properly handles API errors
    - Scenario: API returns 500 error
    - Expected Result: Promise rejects with error object
    */
    it('should handle error when retrieving transactions fails', function() {
      var error;
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions').respond(500, 'Internal Server Error');

      TransactionService.getTransactions().then(function() {
        fail('Should not resolve');
      }, function(err) {
        error = err;
      });

      $httpBackend.flush();
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    /*
    Test Documentation:
    - Test Name: getTransactions - handles empty filter object
    - Purpose: Verify service handles empty filter object gracefully
    - Scenario: Call getTransactions with empty object {}
    - Expected Result: No query parameters added to URL
    */
    it('should handle empty filter object', function() {
      var result;
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions').respond(200, mockTransactions);

      TransactionService.getTransactions({}).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockTransactions);
    });

    /*
    Test Documentation:
    - Test Name: getTransactionById - successful retrieval
    - Purpose: Verify service retrieves specific transaction by ID
    - Scenario: Call getTransactionById with valid transaction ID
    - Expected Result: Promise resolves with single transaction object
    */
    it('should retrieve transaction by ID successfully', function() {
      var result;
      var transactionId = 'TXN001';
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/' + transactionId).respond(200, mockSingleTransaction);

      TransactionService.getTransactionById(transactionId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockSingleTransaction);
      expect(result.transactionId).toBe('TXN001');
      expect(result.merchantName).toBe('Starbucks');
    });

    /*
    Test Documentation:
    - Test Name: getTransactionById - handles not found error
    - Purpose: Verify service handles case when transaction ID does not exist
    - Scenario: API returns 404 error
    - Expected Result: Promise rejects with 404 error
    */
    it('should handle error when transaction ID is not found', function() {
      var error;
      var invalidId = 'INVALID_TXN';
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/' + invalidId).respond(404, 'Transaction Not Found');

      TransactionService.getTransactionById(invalidId).then(function() {
        fail('Should not resolve');
      }, function(err) {
        error = err;
      });

      $httpBackend.flush();
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    /*
    Test Documentation:
    - Test Name: getMonthlyData - successful retrieval
    - Purpose: Verify service retrieves monthly aggregated transaction data
    - Scenario: Call getMonthlyData without parameters
    - Expected Result: Promise resolves with monthly spend and transaction count
    */
    it('should retrieve monthly transaction data successfully', function() {
      var result;
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/monthly').respond(200, mockMonthlyData);

      TransactionService.getMonthlyData().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockMonthlyData);
      expect(result.monthlySpend).toBe(12700);
      expect(result.transactionCount).toBe(156);
    });

    /*
    Test Documentation:
    - Test Name: getMonthlyData - handles API error
    - Purpose: Verify service properly handles errors when fetching monthly data
    - Scenario: API returns 500 error
    - Expected Result: Promise rejects with error object
    */
    it('should handle error when retrieving monthly data fails', function() {
      var error;
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/monthly').respond(500, 'Internal Server Error');

      TransactionService.getMonthlyData().then(function() {
        fail('Should not resolve');
      }, function(err) {
        error = err;
      });

      $httpBackend.flush();
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    /*
    Test Documentation:
    - Test Name: getMockTransactions - returns valid mock data
    - Purpose: Verify mock transactions data structure and content
    - Scenario: Call getMockTransactions without parameters
    - Expected Result: Returns array of 3 transaction objects with all required fields
    */
    it('should return valid mock transactions data', function() {
      var mockData = TransactionService.getMockTransactions();

      expect(mockData).toBeDefined();
      expect(Array.isArray(mockData)).toBe(true);
      expect(mockData.length).toBe(3);
      expect(mockData[0].transactionId).toBe('TXN001');
      expect(mockData[1].transactionId).toBe('TXN002');
      expect(mockData[2].transactionId).toBe('TXN003');
    });

    /*
    Test Documentation:
    - Test Name: getMockTransactions - validates transaction data structure
    - Purpose: Verify each mock transaction has all required fields
    - Scenario: Call getMockTransactions and inspect transaction objects
    - Expected Result: Each transaction has transactionId, cardId, merchantName, transactionDate, amount, currency, category, status, description
    */
    it('should return mock transactions with complete data structure', function() {
      var mockData = TransactionService.getMockTransactions();
      var firstTransaction = mockData[0];

      expect(firstTransaction.transactionId).toBeDefined();
      expect(firstTransaction.cardId).toBeDefined();
      expect(firstTransaction.merchantName).toBeDefined();
      expect(firstTransaction.transactionDate).toBeDefined();
      expect(firstTransaction.amount).toBeDefined();
      expect(firstTransaction.currency).toBeDefined();
      expect(firstTransaction.category).toBeDefined();
      expect(firstTransaction.status).toBeDefined();
      expect(firstTransaction.description).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: getMockTransactions - validates date objects
    - Purpose: Verify transactionDate fields are Date objects
    - Scenario: Call getMockTransactions and check date field types
    - Expected Result: All transactionDate fields are Date instances
    */
    it('should return mock transactions with Date objects for transactionDate', function() {
      var mockData = TransactionService.getMockTransactions();

      mockData.forEach(function(transaction) {
        expect(transaction.transactionDate instanceof Date).toBe(true);
      });
    });

    /*
    Test Documentation:
    - Test Name: getMockTransactions - validates amount fields
    - Purpose: Verify transaction amounts are positive numbers
    - Scenario: Call getMockTransactions and check amount field types and values
    - Expected Result: All amounts are numbers greater than 0
    */
    it('should return mock transactions with valid amount values', function() {
      var mockData = TransactionService.getMockTransactions();

      mockData.forEach(function(transaction) {
        expect(typeof transaction.amount).toBe('number');
        expect(transaction.amount).toBeGreaterThan(0);
      });
    });

    /*
    Test Documentation:
    - Test Name: getMockTransactions - validates category values
    - Purpose: Verify transactions have valid category assignments
    - Scenario: Call getMockTransactions and check category fields
    - Expected Result: Categories are from predefined list (Food & Dining, Fuel, Shopping, etc.)
    */
    it('should return mock transactions with valid categories', function() {
      var mockData = TransactionService.getMockTransactions();
      var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];

      mockData.forEach(function(transaction) {
        expect(validCategories).toContain(transaction.category);
      });
    });

    /*
    Test Documentation:
    - Test Name: getMockTransactions - validates status values
    - Purpose: Verify transactions have valid status values
    - Scenario: Call getMockTransactions and check status fields
    - Expected Result: All transactions have 'Completed' status
    */
    it('should return mock transactions with valid status values', function() {
      var mockData = TransactionService.getMockTransactions();

      mockData.forEach(function(transaction) {
        expect(transaction.status).toBe('Completed');
      });
    });

    /*
    Test Documentation:
    - Test Name: API timeout configuration
    - Purpose: Verify service uses API_CONFIG timeout for requests
    - Scenario: Make API call and verify timeout configuration
    - Expected Result: API_CONFIG.timeout is defined and used
    */
    it('should use API_CONFIG timeout for HTTP requests', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions').respond(200, mockTransactions);

      TransactionService.getTransactions();
      $httpBackend.flush();

      expect(API_CONFIG.timeout).toBeDefined();
      expect(typeof API_CONFIG.timeout).toBe('number');
      expect(API_CONFIG.timeout).toBeGreaterThan(0);
    });

    /*
    Test Documentation:
    - Test Name: Service method existence
    - Purpose: Verify all required service methods are defined
    - Scenario: Check service object for method definitions
    - Expected Result: getTransactions, getTransactionById, getMonthlyData, and getMockTransactions methods exist
    */
    it('should have all required service methods defined', function() {
      expect(TransactionService.getTransactions).toBeDefined();
      expect(typeof TransactionService.getTransactions).toBe('function');
      expect(TransactionService.getTransactionById).toBeDefined();
      expect(typeof TransactionService.getTransactionById).toBe('function');
      expect(TransactionService.getMonthlyData).toBeDefined();
      expect(typeof TransactionService.getMonthlyData).toBe('function');
      expect(TransactionService.getMockTransactions).toBeDefined();
      expect(typeof TransactionService.getMockTransactions).toBe('function');
    });

    /*
    Test Documentation:
    - Test Name: Promise-based API
    - Purpose: Verify all service methods return promises
    - Scenario: Call service methods and check return type
    - Expected Result: All methods return objects with .then() method
    */
    it('should return promises from API methods', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions').respond(200, mockTransactions);
      var promise = TransactionService.getTransactions();

      expect(promise).toBeDefined();
      expect(typeof promise.then).toBe('function');

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: Filter parameter order independence
    - Purpose: Verify filter parameters can be applied in any order
    - Scenario: Apply filters in different orders
    - Expected Result: URL construction is consistent regardless of filter order
    */
    it('should construct URL correctly regardless of filter parameter order', function() {
      var result;
      var filters = {
        category: 'Fuel',
        cardId: 'CC001',
        startDate: '2024-01-01'
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?cardId=CC001&startDate=2024-01-01&category=Fuel').respond(200, [mockTransactions[1]]);

      TransactionService.getTransactions(filters).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: Empty response handling
    - Purpose: Verify service handles empty transaction list from API
    - Scenario: API returns empty array
    - Expected Result: Promise resolves with empty array
    */
    it('should handle empty transaction list from API', function() {
      var result;
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions').respond(200, []);

      TransactionService.getTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

})();

/*
Coverage Report:
- Functions tested: getTransactions (no filters, single filter, multiple filters, special characters, error handling), getTransactionById (success, not found), getMonthlyData (success, error), getMockTransactions (structure validation)
- Scenarios covered:
  * Successful API calls with proper data resolution
  * Error handling for failed API requests (500, 404)
  * Filter combinations (cardId, startDate, endDate, searchTerm, category)
  * Multiple simultaneous filters
  * Special character encoding in search terms
  * Empty filter object handling
  * Transaction ID lookup (success and not found)
  * Monthly data aggregation
  * Mock data structure validation (9 required fields per transaction)
  * Date object validation
  * Amount and numeric field validation
  * Category validation against predefined list
  * Status value validation
  * API timeout configuration
  * Promise-based API verification
  * Filter parameter order independence
  * Empty response handling
- Edge cases covered:
  * Empty filter object
  * Special characters in search term (spaces, ampersands)
  * Invalid transaction ID (404)
  * Empty transaction list
  * Null/undefined filters
  * Filter parameter order variations
- Uncovered scenarios: Concurrent API calls, transaction data caching, real-time transaction updates, network timeout simulation, pagination support, large dataset handling
*/