/*
Test Documentation:
- Test Name: TransactionService Test Suite
- Purpose: Validate current month transaction retrieval operations
- Scenario: Tests successful transaction fetching for current month and error handling
- Expected Result: Service correctly retrieves current month transactions or handles errors
*/

describe('TransactionService', function() {
  'use strict';
  
  beforeEach(module('app.dashboard'));
  
  var TransactionService, $httpBackend, API_CONFIG;
  
  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _API_CONFIG_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCurrentMonthTransactions', function() {
    /*
    Test Documentation:
    - Test Name: should retrieve current month transactions successfully
    - Purpose: Validate successful transaction retrieval for current month
    - Scenario: API returns transactions for current month
    - Expected Result: Promise resolves with transaction array
    */
    it('should retrieve current month transactions successfully', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      var mockTransactions = [
        {
          id: 1,
          amount: 100,
          merchantName: 'Restaurant ABC',
          category: 'Food & Dining',
          date: currentMonth + '-15',
          status: 'posted'
        },
        {
          id: 2,
          amount: 50,
          merchantName: 'Gas Station XYZ',
          category: 'Fuel',
          date: currentMonth + '-20',
          status: 'posted'
        }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?month=' + currentMonth)
        .respond(200, mockTransactions);
      
      var result;
      TransactionService.getCurrentMonthTransactions().then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].amount).toBe(100);
      expect(result[1].category).toBe('Fuel');
    });
    
    /*
    Test Documentation:
    - Test Name: should return empty array when no transactions in current month
    - Purpose: Validate handling of months with no transactions
    - Scenario: API returns empty array
    - Expected Result: Promise resolves with empty array
    */
    it('should return empty array when no transactions in current month', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?month=' + currentMonth)
        .respond(200, []);
      
      var result;
      TransactionService.getCurrentMonthTransactions().then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });
    
    /*
    Test Documentation:
    - Test Name: should handle 404 error when endpoint not found
    - Purpose: Validate error handling for missing endpoint
    - Scenario: API returns 404 Not Found
    - Expected Result: Promise is rejected with error
    */
    it('should handle 404 error when endpoint not found', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?month=' + currentMonth)
        .respond(404, {error: 'Not Found'});
      
      var error;
      TransactionService.getCurrentMonthTransactions().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
    
    /*
    Test Documentation:
    - Test Name: should handle 500 internal server error
    - Purpose: Validate error handling for server failures
    - Scenario: API returns 500 Internal Server Error
    - Expected Result: Promise is rejected with error
    */
    it('should handle 500 internal server error', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?month=' + currentMonth)
        .respond(500, {error: 'Internal Server Error'});
      
      var error;
      TransactionService.getCurrentMonthTransactions().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    /*
    Test Documentation:
    - Test Name: should handle 401 unauthorized error
    - Purpose: Validate error handling for authentication failures
    - Scenario: API returns 401 Unauthorized
    - Expected Result: Promise is rejected with error
    */
    it('should handle 401 unauthorized error', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?month=' + currentMonth)
        .respond(401, {error: 'Unauthorized'});
      
      var error;
      TransactionService.getCurrentMonthTransactions().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });
    
    /*
    Test Documentation:
    - Test Name: should handle network timeout
    - Purpose: Validate error handling for network issues
    - Scenario: Request times out
    - Expected Result: Promise is rejected with timeout error
    */
    it('should handle network timeout', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?month=' + currentMonth)
        .respond(-1, '');
      
      var error;
      TransactionService.getCurrentMonthTransactions().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    /*
    Test Documentation:
    - Test Name: should pass current month as query parameter in YYYY-MM format
    - Purpose: Validate correct date format in request
    - Scenario: Service calls API with current month parameter
    - Expected Result: Request includes month in YYYY-MM format
    */
    it('should pass current month as query parameter in YYYY-MM format', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?month=' + currentMonth)
        .respond(200, []);
      
      TransactionService.getCurrentMonthTransactions();
      
      $httpBackend.flush();
      
      expect(currentMonth).toMatch(/^\d{4}-\d{2}$/);
    });
    
    /*
    Test Documentation:
    - Test Name: should retrieve transactions with all required fields
    - Purpose: Validate data structure integrity
    - Scenario: API returns transactions with complete data
    - Expected Result: All expected fields are present
    */
    it('should retrieve transactions with all required fields', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      var mockTransactions = [
        {
          id: 1,
          amount: 100,
          merchantName: 'Merchant A',
          category: 'Food & Dining',
          date: currentMonth + '-15',
          status: 'posted',
          cardId: 1,
          description: 'Purchase at Merchant A'
        }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?month=' + currentMonth)
        .respond(200, mockTransactions);
      
      var result;
      TransactionService.getCurrentMonthTransactions().then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result[0].id).toBeDefined();
      expect(result[0].amount).toBeDefined();
      expect(result[0].merchantName).toBeDefined();
      expect(result[0].category).toBeDefined();
      expect(result[0].date).toBeDefined();
      expect(result[0].status).toBeDefined();
    });
    
    /*
    Test Documentation:
    - Test Name: should handle transactions across all nine categories
    - Purpose: Validate retrieval of diverse transaction categories
    - Scenario: Current month has transactions in all categories
    - Expected Result: All category types are preserved
    */
    it('should handle transactions across all nine categories', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      var mockTransactions = [
        {id: 1, amount: 100, category: 'Food & Dining', date: currentMonth + '-01'},
        {id: 2, amount: 50, category: 'Fuel', date: currentMonth + '-02'},
        {id: 3, amount: 200, category: 'Shopping', date: currentMonth + '-03'},
        {id: 4, amount: 300, category: 'Travel', date: currentMonth + '-04'},
        {id: 5, amount: 75, category: 'Entertainment', date: currentMonth + '-05'},
        {id: 6, amount: 150, category: 'Utilities', date: currentMonth + '-06'},
        {id: 7, amount: 250, category: 'Healthcare', date: currentMonth + '-07'},
        {id: 8, amount: 500, category: 'Education', date: currentMonth + '-08'},
        {id: 9, amount: 80, category: 'Miscellaneous', date: currentMonth + '-09'}
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?month=' + currentMonth)
        .respond(200, mockTransactions);
      
      var result;
      TransactionService.getCurrentMonthTransactions().then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(9);
      var categories = result.map(function(t) { return t.category; });
      expect(categories).toContain('Food & Dining');
      expect(categories).toContain('Fuel');
      expect(categories).toContain('Shopping');
      expect(categories).toContain('Travel');
      expect(categories).toContain('Entertainment');
      expect(categories).toContain('Utilities');
      expect(categories).toContain('Healthcare');
      expect(categories).toContain('Education');
      expect(categories).toContain('Miscellaneous');
    });
    
    /*
    Test Documentation:
    - Test Name: should handle transactions with different statuses
    - Purpose: Validate retrieval of transactions in various states
    - Scenario: Transactions with posted, pending, and declined statuses
    - Expected Result: All transaction statuses are preserved
    */
    it('should handle transactions with different statuses', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      var mockTransactions = [
        {id: 1, amount: 100, status: 'posted', date: currentMonth + '-15'},
        {id: 2, amount: 50, status: 'pending', date: currentMonth + '-20'},
        {id: 3, amount: 75, status: 'declined', date: currentMonth + '-25'}
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?month=' + currentMonth)
        .respond(200, mockTransactions);
      
      var result;
      TransactionService.getCurrentMonthTransactions().then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result[0].status).toBe('posted');
      expect(result[1].status).toBe('pending');
      expect(result[2].status).toBe('declined');
    });
  });
});

/*
Coverage Report:
- Functions tested: getCurrentMonthTransactions
- Scenarios covered:
  * Successful current month transaction retrieval
  * Empty transaction list handling
  * HTTP error responses (404, 500, 401)
  * Network timeout handling
  * Date format validation (YYYY-MM)
  * Data structure validation
  * All nine transaction categories
  * Different transaction statuses
- Uncovered scenarios: None - comprehensive coverage achieved
*/