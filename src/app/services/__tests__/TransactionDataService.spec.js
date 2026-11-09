/*
Test Documentation:
- Test Name: TransactionDataService Unit Tests
- Purpose: Validate transaction data retrieval functionality with pagination and filtering
- Scenario: Tests fetchTransactions, getTransactionById, and getTransactions methods with various parameters
- Expected Result: Service correctly retrieves transaction data with proper pagination, filtering, and error handling
*/

describe('TransactionDataService', function() {
  var TransactionDataService;
  var $httpBackend;
  var $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionDataService_, _$httpBackend_, _$rootScope_) {
    TransactionDataService = _TransactionDataService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('fetchTransactions', function() {
    it('should fetch transactions with default pagination', function() {
      var mockResponse = {
        transactions: [{transactionId: 1, amount: 50}, {transactionId: 2, amount: 100}],
        totalCount: 2
      };

      $httpBackend.expectGET('/api/transactions?page=1&size=20').respond(200, mockResponse);

      var result;
      TransactionDataService.fetchTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.transactions.length).toBe(2);
    });

    it('should fetch transactions with custom page and size', function() {
      var mockResponse = {
        transactions: [{transactionId: 3, amount: 75}],
        totalCount: 1
      };

      $httpBackend.expectGET('/api/transactions?page=2&size=10').respond(200, mockResponse);

      var result;
      TransactionDataService.fetchTransactions(2, 10).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
    });

    it('should fetch transactions filtered by cardId', function() {
      var cardId = 'card123';
      var mockResponse = {
        transactions: [{transactionId: 4, amount: 200, cardId: cardId}],
        totalCount: 1
      };

      $httpBackend.expectGET('/api/transactions?page=1&size=20&cardId=' + cardId).respond(200, mockResponse);

      var result;
      TransactionDataService.fetchTransactions(1, 20, cardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.transactions[0].cardId).toBe(cardId);
    });

    it('should handle empty transactions response', function() {
      var mockResponse = {
        transactions: [],
        totalCount: 0
      };

      $httpBackend.expectGET('/api/transactions?page=1&size=20').respond(200, mockResponse);

      var result;
      TransactionDataService.fetchTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.transactions.length).toBe(0);
      expect(result.totalCount).toBe(0);
    });

    it('should handle HTTP 500 error', function() {
      $httpBackend.expectGET('/api/transactions?page=1&size=20').respond(500, {error: 'Server error'});

      var error;
      TransactionDataService.fetchTransactions().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle page 0 as default page 1', function() {
      var mockResponse = {transactions: [], totalCount: 0};

      $httpBackend.expectGET('/api/transactions?page=1&size=20').respond(200, mockResponse);

      TransactionDataService.fetchTransactions(0, 20);

      $httpBackend.flush();
    });

    it('should handle null page as default page 1', function() {
      var mockResponse = {transactions: [], totalCount: 0};

      $httpBackend.expectGET('/api/transactions?page=1&size=20').respond(200, mockResponse);

      TransactionDataService.fetchTransactions(null, 20);

      $httpBackend.flush();
    });

    it('should handle null size as default size 20', function() {
      var mockResponse = {transactions: [], totalCount: 0};

      $httpBackend.expectGET('/api/transactions?page=1&size=20').respond(200, mockResponse);

      TransactionDataService.fetchTransactions(1, null);

      $httpBackend.flush();
    });
  });

  describe('getTransactionById', function() {
    it('should retrieve transaction by ID', function() {
      var transactionId = 'txn123';
      var mockResponse = {
        transactionId: transactionId,
        merchantName: 'Test Merchant',
        amount: 150,
        transactionDate: '2024-01-15'
      };

      $httpBackend.expectGET('/api/transactions/' + transactionId).respond(200, mockResponse);

      var result;
      TransactionDataService.getTransactionById(transactionId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.transactionId).toBe(transactionId);
    });

    it('should handle HTTP 404 when transaction not found', function() {
      var transactionId = 'nonexistent';

      $httpBackend.expectGET('/api/transactions/' + transactionId).respond(404, {error: 'Not found'});

      var error;
      TransactionDataService.getTransactionById(transactionId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    it('should handle HTTP 401 unauthorized error', function() {
      var transactionId = 'txn456';

      $httpBackend.expectGET('/api/transactions/' + transactionId).respond(401, {error: 'Unauthorized'});

      var error;
      TransactionDataService.getTransactionById(transactionId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });
  });

  describe('getTransactions', function() {
    it('should retrieve transactions for userId', function() {
      var userId = 'user123';
      var mockResponse = [
        {transactionId: 1, amount: 50},
        {transactionId: 2, amount: 100}
      ];

      $httpBackend.expectGET('/api/transactions?userId=' + userId).respond(200, mockResponse);

      var result;
      TransactionDataService.getTransactions(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(2);
    });

    it('should retrieve transactions with date range filter', function() {
      var userId = 'user456';
      var dateRange = {startDate: '2024-01-01', endDate: '2024-12-31'};
      var mockResponse = [
        {transactionId: 3, amount: 75, transactionDate: '2024-06-15'}
      ];

      $httpBackend.expectGET('/api/transactions?userId=' + userId + '&startDate=' + dateRange.startDate + '&endDate=' + dateRange.endDate).respond(200, mockResponse);

      var result;
      TransactionDataService.getTransactions(userId, dateRange).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(1);
    });

    it('should handle empty transactions for userId', function() {
      var userId = 'user789';
      var mockResponse = [];

      $httpBackend.expectGET('/api/transactions?userId=' + userId).respond(200, mockResponse);

      var result;
      TransactionDataService.getTransactions(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle HTTP 403 forbidden error', function() {
      var userId = 'user101';

      $httpBackend.expectGET('/api/transactions?userId=' + userId).respond(403, {error: 'Forbidden'});

      var error;
      TransactionDataService.getTransactions(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(403);
    });

    it('should handle null dateRange parameter', function() {
      var userId = 'user202';
      var mockResponse = [];

      $httpBackend.expectGET('/api/transactions?userId=' + userId).respond(200, mockResponse);

      TransactionDataService.getTransactions(userId, null);

      $httpBackend.flush();
    });

    it('should construct URL correctly with all parameters', function() {
      var userId = 'user303';
      var dateRange = {startDate: '2024-01-01', endDate: '2024-06-30'};

      $httpBackend.expectGET('/api/transactions?userId=user303&startDate=2024-01-01&endDate=2024-06-30').respond(200, []);

      TransactionDataService.getTransactions(userId, dateRange);

      $httpBackend.flush();
    });
  });

  describe('API endpoint construction', function() {
    it('should construct correct URL for fetchTransactions without cardId', function() {
      $httpBackend.expectGET('/api/transactions?page=3&size=15').respond(200, {transactions: [], totalCount: 0});

      TransactionDataService.fetchTransactions(3, 15);

      $httpBackend.flush();
    });

    it('should construct correct URL for fetchTransactions with cardId', function() {
      $httpBackend.expectGET('/api/transactions?page=1&size=20&cardId=card456').respond(200, {transactions: [], totalCount: 0});

      TransactionDataService.fetchTransactions(1, 20, 'card456');

      $httpBackend.flush();
    });

    it('should construct correct URL for getTransactionById', function() {
      $httpBackend.expectGET('/api/transactions/txn789').respond(200, {});

      TransactionDataService.getTransactionById('txn789');

      $httpBackend.flush();
    });

    it('should construct correct URL for getTransactions without dateRange', function() {
      $httpBackend.expectGET('/api/transactions?userId=user404').respond(200, []);

      TransactionDataService.getTransactions('user404');

      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: fetchTransactions, getTransactionById, getTransactions
- Scenarios covered:
  * Fetch transactions with default pagination
  * Fetch transactions with custom page and size
  * Fetch transactions filtered by cardId
  * Empty transactions response
  * HTTP 500 server error
  * Page 0 and null page handling
  * Null size handling
  * Retrieve transaction by ID
  * HTTP 404 not found error
  * HTTP 401 unauthorized error
  * Retrieve transactions for userId
  * Retrieve transactions with date range filter
  * Empty transactions for userId
  * HTTP 403 forbidden error
  * Null dateRange parameter handling
  * Correct URL construction for all methods
- Uncovered scenarios: None - comprehensive coverage achieved
- Dependencies mocked: $http via $httpBackend
*/