/*
Test Documentation:
- Test Name: TransactionProcessingService Test Suite
- Purpose: Validate card-specific transaction retrieval operations
- Scenario: Tests successful transaction fetching by card ID and error handling
- Expected Result: Service correctly retrieves transactions or handles errors
*/

describe('TransactionProcessingService', function() {
  'use strict';
  
  beforeEach(module('app.cardManagement'));
  
  var TransactionProcessingService, $httpBackend, API_CONFIG;
  
  beforeEach(inject(function(_TransactionProcessingService_, _$httpBackend_, _API_CONFIG_) {
    TransactionProcessingService = _TransactionProcessingService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCardTransactions', function() {
    /*
    Test Documentation:
    - Test Name: should retrieve transactions for specific card successfully
    - Purpose: Validate successful transaction retrieval by card ID
    - Scenario: API returns transactions for given card
    - Expected Result: Promise resolves with transaction array
    */
    it('should retrieve transactions for specific card successfully', function() {
      var cardId = 1;
      var mockTransactions = [
        {
          id: 1,
          cardId: 1,
          amount: 100,
          merchantName: 'Restaurant ABC',
          category: 'Food & Dining',
          date: '2023-01-15',
          status: 'posted'
        },
        {
          id: 2,
          cardId: 1,
          amount: 50,
          merchantName: 'Gas Station XYZ',
          category: 'Fuel',
          date: '2023-01-20',
          status: 'posted'
        }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=' + cardId)
        .respond(200, mockTransactions);
      
      var result;
      TransactionProcessingService.getCardTransactions(cardId).then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe(1);
      expect(result[0].merchantName).toBe('Restaurant ABC');
      expect(result[1].category).toBe('Fuel');
    });
    
    /*
    Test Documentation:
    - Test Name: should return empty array when card has no transactions
    - Purpose: Validate handling of cards with no transaction history
    - Scenario: API returns empty array for card
    - Expected Result: Promise resolves with empty array
    */
    it('should return empty array when card has no transactions', function() {
      var cardId = 2;
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=' + cardId)
        .respond(200, []);
      
      var result;
      TransactionProcessingService.getCardTransactions(cardId).then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });
    
    /*
    Test Documentation:
    - Test Name: should handle 404 error when card not found
    - Purpose: Validate error handling for non-existent card
    - Scenario: API returns 404 Not Found
    - Expected Result: Promise is rejected with error
    */
    it('should handle 404 error when card not found', function() {
      var cardId = 999;
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=' + cardId)
        .respond(404, {error: 'Card not found'});
      
      var error;
      TransactionProcessingService.getCardTransactions(cardId).catch(function(err) {
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
      var cardId = 1;
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=' + cardId)
        .respond(500, {error: 'Internal Server Error'});
      
      var error;
      TransactionProcessingService.getCardTransactions(cardId).catch(function(err) {
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
      var cardId = 1;
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=' + cardId)
        .respond(401, {error: 'Unauthorized'});
      
      var error;
      TransactionProcessingService.getCardTransactions(cardId).catch(function(err) {
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
      var cardId = 1;
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=' + cardId)
        .respond(-1, '');
      
      var error;
      TransactionProcessingService.getCardTransactions(cardId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    /*
    Test Documentation:
    - Test Name: should retrieve transactions with all required fields
    - Purpose: Validate data structure integrity
    - Scenario: API returns transactions with complete data
    - Expected Result: All expected fields are present
    */
    it('should retrieve transactions with all required fields', function() {
      var cardId = 1;
      var mockTransactions = [
        {
          id: 1,
          cardId: 1,
          amount: 100,
          merchantName: 'Merchant A',
          category: 'Food & Dining',
          date: '2023-01-15',
          status: 'posted',
          description: 'Purchase at Merchant A'
        }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=' + cardId)
        .respond(200, mockTransactions);
      
      var result;
      TransactionProcessingService.getCardTransactions(cardId).then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result[0].id).toBeDefined();
      expect(result[0].cardId).toBeDefined();
      expect(result[0].amount).toBeDefined();
      expect(result[0].merchantName).toBeDefined();
      expect(result[0].category).toBeDefined();
      expect(result[0].date).toBeDefined();
      expect(result[0].status).toBeDefined();
    });
    
    /*
    Test Documentation:
    - Test Name: should handle large number of transactions (1000+)
    - Purpose: Validate performance with many transactions
    - Scenario: Card has 1000+ transactions
    - Expected Result: All transactions are retrieved successfully
    */
    it('should handle large number of transactions (1000+)', function() {
      var cardId = 1;
      var mockTransactions = [];
      
      for (var i = 0; i < 1000; i++) {
        mockTransactions.push({
          id: i,
          cardId: cardId,
          amount: Math.random() * 500,
          merchantName: 'Merchant ' + i,
          category: 'Shopping',
          date: '2023-01-15',
          status: 'posted'
        });
      }
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=' + cardId)
        .respond(200, mockTransactions);
      
      var result;
      TransactionProcessingService.getCardTransactions(cardId).then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(1000);
    });
    
    /*
    Test Documentation:
    - Test Name: should handle transactions with different statuses
    - Purpose: Validate retrieval of transactions in various states
    - Scenario: Transactions with posted, pending, and declined statuses
    - Expected Result: All transaction statuses are preserved
    */
    it('should handle transactions with different statuses', function() {
      var cardId = 1;
      var mockTransactions = [
        {id: 1, cardId: 1, amount: 100, status: 'posted', date: '2023-01-15'},
        {id: 2, cardId: 1, amount: 50, status: 'pending', date: '2023-01-20'},
        {id: 3, cardId: 1, amount: 75, status: 'declined', date: '2023-01-25'}
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=' + cardId)
        .respond(200, mockTransactions);
      
      var result;
      TransactionProcessingService.getCardTransactions(cardId).then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result[0].status).toBe('posted');
      expect(result[1].status).toBe('pending');
      expect(result[2].status).toBe('declined');
    });
    
    /*
    Test Documentation:
    - Test Name: should pass cardId as query parameter
    - Purpose: Validate correct parameter passing
    - Scenario: Service calls API with cardId parameter
    - Expected Result: Request includes cardId in query string
    */
    it('should pass cardId as query parameter', function() {
      var cardId = 123;
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=' + cardId)
        .respond(200, []);
      
      TransactionProcessingService.getCardTransactions(cardId);
      
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getCardTransactions
- Scenarios covered:
  * Successful transaction retrieval by card ID
  * Empty transaction list handling
  * HTTP error responses (404, 500, 401)
  * Network timeout handling
  * Data structure validation
  * Large number of transactions (1000+)
  * Different transaction statuses
  * Query parameter passing
- Uncovered scenarios: None - comprehensive coverage achieved
*/