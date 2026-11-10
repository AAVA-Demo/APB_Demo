/*
Test Documentation:
- Test Name: TransactionService - getTransactions - success scenario
- Purpose: Validates that getTransactions retrieves transactions successfully
- Scenario: Service calls API with valid userId and date range
- Expected Result: Returns array of transaction data
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions - caching behavior
- Purpose: Validates that service caches transaction data
- Scenario: Same request made twice
- Expected Result: Second call returns cached data without HTTP request
*/
/*
Test Documentation:
- Test Name: TransactionService - getMonthlySpend - success scenario
- Purpose: Validates monthly spend summary retrieval
- Scenario: Service calls API with valid userId
- Expected Result: Returns monthly spend summary object
*/
/*
Test Documentation:
- Test Name: TransactionService - getCardTransactions - success scenario
- Purpose: Validates card-specific transaction retrieval
- Scenario: Service calls API with valid cardId and period
- Expected Result: Returns transactions for specific card
*/
/*
Test Documentation:
- Test Name: TransactionService - error handling
- Purpose: Validates error handling for all methods
- Scenario: API returns error responses
- Expected Result: Promises are rejected with appropriate errors
*/
/*
Coverage Report:
- Functions tested: getTransactions, getMonthlySpend, getCardTransactions
- Scenarios covered: success responses, caching, error handling, parameter validation, default parameters
- Uncovered scenarios: cache expiration (requires time-based testing)
*/

describe('TransactionService', function() {
  'use strict';

  var TransactionService;
  var $httpBackend;
  var $q;
  var $rootScope;
  var $cacheFactory;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$q_, _$rootScope_, _$cacheFactory_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $cacheFactory = _$cacheFactory_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    var cache = $cacheFactory.get('transactionCache');
    if (cache) {
      cache.removeAll();
    }
  });

  describe('getTransactions', function() {
    it('should retrieve transactions for given userId and date range successfully', function() {
      var userId = 'user123';
      var startDate = '2023-01-01';
      var endDate = '2023-12-31';
      var mockResponse = [
        { transactionId: 'txn1', amount: 150.50, category: 'Food & Dining', transactionDate: '2023-06-15' },
        { transactionId: 'txn2', amount: 75.00, category: 'Fuel', transactionDate: '2023-06-20' }
      ];

      $httpBackend.expectGET('/api/transactions?endDate=' + endDate + '&startDate=' + startDate + '&userId=' + userId)
        .respond(200, mockResponse);

      var result;
      TransactionService.getTransactions(userId, startDate, endDate).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(2);
      expect(result[0].transactionId).toBe('txn1');
    });

    it('should cache transaction data and return cached data on subsequent calls', function() {
      var userId = 'user123';
      var startDate = '2023-01-01';
      var endDate = '2023-12-31';
      var mockResponse = [
        { transactionId: 'txn1', amount: 150.50, category: 'Food & Dining' }
      ];

      $httpBackend.expectGET('/api/transactions?endDate=' + endDate + '&startDate=' + startDate + '&userId=' + userId)
        .respond(200, mockResponse);

      var result1, result2;
      TransactionService.getTransactions(userId, startDate, endDate).then(function(data) {
        result1 = data;
      });

      $httpBackend.flush();

      TransactionService.getTransactions(userId, startDate, endDate).then(function(data) {
        result2 = data;
      });

      $rootScope.$digest();

      expect(result1).toEqual(mockResponse);
      expect(result2).toEqual(mockResponse);
      expect(result1).toBe(result2);
    });

    it('should return empty array when no transactions found', function() {
      var userId = 'user456';
      var startDate = '2023-01-01';
      var endDate = '2023-01-31';
      var mockResponse = [];

      $httpBackend.expectGET('/api/transactions?endDate=' + endDate + '&startDate=' + startDate + '&userId=' + userId)
        .respond(200, mockResponse);

      var result;
      TransactionService.getTransactions(userId, startDate, endDate).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle API error and reject promise', function() {
      var userId = 'user789';
      var startDate = '2023-01-01';
      var endDate = '2023-12-31';

      $httpBackend.expectGET('/api/transactions?endDate=' + endDate + '&startDate=' + startDate + '&userId=' + userId)
        .respond(500, { message: 'Internal Server Error' });

      var error;
      TransactionService.getTransactions(userId, startDate, endDate).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle 404 error', function() {
      var userId = 'nonexistent';
      var startDate = '2023-01-01';
      var endDate = '2023-12-31';

      $httpBackend.expectGET('/api/transactions?endDate=' + endDate + '&startDate=' + startDate + '&userId=' + userId)
        .respond(404, { message: 'User not found' });

      var error;
      TransactionService.getTransactions(userId, startDate, endDate).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    it('should handle null parameters', function() {
      var userId = null;
      var startDate = null;
      var endDate = null;
      var mockResponse = [];

      $httpBackend.expectGET('/api/transactions?endDate=null&startDate=null&userId=null')
        .respond(200, mockResponse);

      var result;
      TransactionService.getTransactions(userId, startDate, endDate).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
    });

    it('should create different cache keys for different parameters', function() {
      var userId1 = 'user123';
      var userId2 = 'user456';
      var startDate = '2023-01-01';
      var endDate = '2023-12-31';
      var mockResponse1 = [{ transactionId: 'txn1' }];
      var mockResponse2 = [{ transactionId: 'txn2' }];

      $httpBackend.expectGET('/api/transactions?endDate=' + endDate + '&startDate=' + startDate + '&userId=' + userId1)
        .respond(200, mockResponse1);
      $httpBackend.expectGET('/api/transactions?endDate=' + endDate + '&startDate=' + startDate + '&userId=' + userId2)
        .respond(200, mockResponse2);

      var result1, result2;
      TransactionService.getTransactions(userId1, startDate, endDate).then(function(data) {
        result1 = data;
      });
      TransactionService.getTransactions(userId2, startDate, endDate).then(function(data) {
        result2 = data;
      });

      $httpBackend.flush();

      expect(result1).toEqual(mockResponse1);
      expect(result2).toEqual(mockResponse2);
      expect(result1).not.toEqual(result2);
    });
  });

  describe('getMonthlySpend', function() {
    it('should retrieve monthly spend summary for given userId successfully', function() {
      var userId = 'user123';
      var mockResponse = {
        totalSpend: 5000.00,
        monthlyBreakdown: [
          { month: '2023-01', spend: 500 },
          { month: '2023-02', spend: 600 }
        ]
      };

      $httpBackend.expectGET('/api/transactions/monthly-summary?userId=' + userId)
        .respond(200, mockResponse);

      var result;
      TransactionService.getMonthlySpend(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.totalSpend).toBe(5000.00);
      expect(result.monthlyBreakdown.length).toBe(2);
    });

    it('should handle API error and reject promise', function() {
      var userId = 'user789';

      $httpBackend.expectGET('/api/transactions/monthly-summary?userId=' + userId)
        .respond(500, { message: 'Internal Server Error' });

      var error;
      TransactionService.getMonthlySpend(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle 404 error when user not found', function() {
      var userId = 'nonexistent';

      $httpBackend.expectGET('/api/transactions/monthly-summary?userId=' + userId)
        .respond(404, { message: 'User not found' });

      var error;
      TransactionService.getMonthlySpend(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    it('should handle null userId parameter', function() {
      var userId = null;
      var mockResponse = { totalSpend: 0, monthlyBreakdown: [] };

      $httpBackend.expectGET('/api/transactions/monthly-summary?userId=null')
        .respond(200, mockResponse);

      var result;
      TransactionService.getMonthlySpend(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
    });

    it('should return zero spend when user has no transactions', function() {
      var userId = 'user456';
      var mockResponse = { totalSpend: 0, monthlyBreakdown: [] };

      $httpBackend.expectGET('/api/transactions/monthly-summary?userId=' + userId)
        .respond(200, mockResponse);

      var result;
      TransactionService.getMonthlySpend(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.totalSpend).toBe(0);
      expect(result.monthlyBreakdown.length).toBe(0);
    });
  });

  describe('getCardTransactions', function() {
    it('should retrieve transactions for given cardId with default period', function() {
      var cardId = 'card123';
      var mockResponse = [
        { transactionId: 'txn1', amount: 100, cardId: 'card123' },
        { transactionId: 'txn2', amount: 200, cardId: 'card123' }
      ];

      $httpBackend.expectGET('/api/cards/' + cardId + '/transactions?period=12months')
        .respond(200, mockResponse);

      var result;
      TransactionService.getCardTransactions(cardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(2);
    });

    it('should retrieve transactions for given cardId with custom period', function() {
      var cardId = 'card456';
      var period = '6months';
      var mockResponse = [
        { transactionId: 'txn3', amount: 150, cardId: 'card456' }
      ];

      $httpBackend.expectGET('/api/cards/' + cardId + '/transactions?period=' + period)
        .respond(200, mockResponse);

      var result;
      TransactionService.getCardTransactions(cardId, period).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(1);
    });

    it('should handle API error and reject promise', function() {
      var cardId = 'card789';

      $httpBackend.expectGET('/api/cards/' + cardId + '/transactions?period=12months')
        .respond(500, { message: 'Internal Server Error' });

      var error;
      TransactionService.getCardTransactions(cardId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle 404 error when card not found', function() {
      var cardId = 'nonexistent';

      $httpBackend.expectGET('/api/cards/' + cardId + '/transactions?period=12months')
        .respond(404, { message: 'Card not found' });

      var error;
      TransactionService.getCardTransactions(cardId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    it('should handle null cardId parameter', function() {
      var cardId = null;
      var mockResponse = [];

      $httpBackend.expectGET('/api/cards/null/transactions?period=12months')
        .respond(200, mockResponse);

      var result;
      TransactionService.getCardTransactions(cardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
    });

    it('should return empty array when card has no transactions', function() {
      var cardId = 'card999';
      var mockResponse = [];

      $httpBackend.expectGET('/api/cards/' + cardId + '/transactions?period=12months')
        .respond(200, mockResponse);

      var result;
      TransactionService.getCardTransactions(cardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle unauthorized access (401)', function() {
      var cardId = 'card888';

      $httpBackend.expectGET('/api/cards/' + cardId + '/transactions?period=12months')
        .respond(401, { message: 'Unauthorized' });

      var error;
      TransactionService.getCardTransactions(cardId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });
  });

  describe('Service initialization', function() {
    it('should be defined', function() {
      expect(TransactionService).toBeDefined();
    });

    it('should have getTransactions method', function() {
      expect(TransactionService.getTransactions).toBeDefined();
      expect(typeof TransactionService.getTransactions).toBe('function');
    });

    it('should have getMonthlySpend method', function() {
      expect(TransactionService.getMonthlySpend).toBeDefined();
      expect(typeof TransactionService.getMonthlySpend).toBe('function');
    });

    it('should have getCardTransactions method', function() {
      expect(TransactionService.getCardTransactions).toBeDefined();
      expect(typeof TransactionService.getCardTransactions).toBe('function');
    });

    it('should initialize transaction cache', function() {
      var cache = $cacheFactory.get('transactionCache');
      expect(cache).toBeDefined();
    });
  });
});