/*
Test Documentation:
- Test Name: TransactionProcessingFactory - fetchTransactions
- Purpose: Verify paginated transaction retrieval
- Scenario: API returns paginated transaction data
- Expected Result: Returns transaction array with pagination metadata
*/
/*
Test Documentation:
- Test Name: TransactionProcessingFactory - fetchTrends
- Purpose: Verify monthly trend data retrieval
- Scenario: API returns monthly spending trends
- Expected Result: Returns array of 12 monthly trend objects
*/
/*
Test Documentation:
- Test Name: TransactionProcessingFactory - mock data generation
- Purpose: Verify mock transaction data generation for 365 days
- Scenario: Mock data is generated for pagination
- Expected Result: Returns 100 transactions with valid date range
*/
/*
Coverage Report:
- Functions tested: fetchTransactions, fetchTrends, response interceptors, mock data generators
- Scenarios covered: paginated transactions, monthly trends, fallback mock data, date range validation, pagination metadata
- Uncovered scenarios: concurrent requests (handled by $resource)
*/

(function(){
'use strict';

describe('TransactionProcessingFactory', function(){
  var TransactionProcessingFactory, $httpBackend, API_ENDPOINT;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionProcessingFactory_, _$httpBackend_, _API_ENDPOINT_){
    TransactionProcessingFactory = _TransactionProcessingFactory_;
    $httpBackend = _$httpBackend_;
    API_ENDPOINT = _API_ENDPOINT_;
  }));

  afterEach(function(){
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('fetchTransactions', function(){
    it('should fetch paginated transactions with page and size parameters', function(){
      var mockResponse = {
        data: [
          {transactionId: 'TXN001', cardId: 'CC001', amount: 2500, category: 'Shopping', date: '2023-09-20T10:00:00Z', merchant: 'Store C', description: 'Transaction 1'},
          {transactionId: 'TXN002', cardId: 'CC002', amount: 1200, category: 'Fuel', date: '2023-09-21T12:30:00Z', merchant: 'Gas Station B', description: 'Transaction 2'}
        ],
        totalRecords: 100
      };

      $httpBackend.expectGET(API_ENDPOINT + '/transactions?page=1&size=20').respond(200, mockResponse);

      var result = TransactionProcessingFactory.fetchTransactions({page: 1, size: 20});

      $httpBackend.flush();

      expect(result.data).toBeDefined();
      expect(result.data.length).toBe(2);
      expect(result.totalRecords).toBe(100);
      expect(result.data[0].transactionId).toBe('TXN001');
    });

    it('should return mock data with 100 transactions when API response is null', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions?page=1&size=20').respond(200, null);

      var result = TransactionProcessingFactory.fetchTransactions({page: 1, size: 20});

      $httpBackend.flush();

      expect(result.data).toBeDefined();
      expect(result.data.length).toBe(100);
      expect(result.totalRecords).toBe(100);
    });

    it('should generate mock transactions with valid structure and description', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions?page=1&size=50').respond(200, null);

      var result = TransactionProcessingFactory.fetchTransactions({page: 1, size: 50});

      $httpBackend.flush();

      result.data.forEach(function(txn){
        expect(txn.transactionId).toBeDefined();
        expect(txn.cardId).toBeDefined();
        expect(txn.amount).toBeDefined();
        expect(txn.category).toBeDefined();
        expect(txn.date).toBeDefined();
        expect(txn.merchant).toBeDefined();
        expect(txn.description).toBeDefined();
        expect(txn.description).toMatch(/^Transaction \d+$/);
      });
    });

    it('should generate transactions with dates within last 365 days', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions?page=1&size=100').respond(200, null);

      var result = TransactionProcessingFactory.fetchTransactions({page: 1, size: 100});

      $httpBackend.flush();

      var now = new Date();
      var oneYearAgo = new Date();
      oneYearAgo.setDate(oneYearAgo.getDate() - 365);

      result.data.forEach(function(txn){
        var txnDate = new Date(txn.date);
        expect(txnDate).toBeLessThanOrEqual(now);
        expect(txnDate).toBeGreaterThanOrEqual(oneYearAgo);
      });
    });

    it('should generate transactions with valid categories', function(){
      var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];

      $httpBackend.expectGET(API_ENDPOINT + '/transactions?page=1&size=100').respond(200, null);

      var result = TransactionProcessingFactory.fetchTransactions({page: 1, size: 100});

      $httpBackend.flush();

      result.data.forEach(function(txn){
        expect(validCategories).toContain(txn.category);
      });
    });

    it('should generate transactions with amounts in valid range', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions?page=1&size=100').respond(200, null);

      var result = TransactionProcessingFactory.fetchTransactions({page: 1, size: 100});

      $httpBackend.flush();

      result.data.forEach(function(txn){
        expect(txn.amount).toBeGreaterThanOrEqual(100);
        expect(txn.amount).toBeLessThanOrEqual(5100);
      });
    });
  });

  describe('fetchTrends', function(){
    it('should fetch monthly spending trends successfully', function(){
      var mockResponse = [
        {month: '2023-10', totalSpend: 25000, transactionCount: 45},
        {month: '2023-09', totalSpend: 22000, transactionCount: 38}
      ];

      $httpBackend.expectGET(API_ENDPOINT + '/transactions/trends').respond(200, mockResponse);

      var result = TransactionProcessingFactory.fetchTrends();

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].month).toBe('2023-10');
      expect(result[0].totalSpend).toBe(25000);
    });

    it('should return mock trends for 12 months when API response is null', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions/trends').respond(200, null);

      var result = TransactionProcessingFactory.fetchTrends();

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(12);
    });

    it('should generate mock trends with valid structure', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions/trends').respond(200, null);

      var result = TransactionProcessingFactory.fetchTrends();

      $httpBackend.flush();

      result.forEach(function(trend){
        expect(trend.month).toBeDefined();
        expect(trend.totalSpend).toBeDefined();
        expect(trend.transactionCount).toBeDefined();
        expect(trend.month).toMatch(/^\d{4}-\d{2}$/);
        expect(typeof trend.totalSpend).toBe('number');
        expect(typeof trend.transactionCount).toBe('number');
      });
    });

    it('should generate trends with totalSpend in valid range', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions/trends').respond(200, null);

      var result = TransactionProcessingFactory.fetchTrends();

      $httpBackend.flush();

      result.forEach(function(trend){
        expect(trend.totalSpend).toBeGreaterThanOrEqual(10000);
        expect(trend.totalSpend).toBeLessThanOrEqual(40000);
      });
    });

    it('should generate trends with transactionCount in valid range', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions/trends').respond(200, null);

      var result = TransactionProcessingFactory.fetchTrends();

      $httpBackend.flush();

      result.forEach(function(trend){
        expect(trend.transactionCount).toBeGreaterThanOrEqual(20);
        expect(trend.transactionCount).toBeLessThanOrEqual(70);
      });
    });

    it('should generate trends with months in descending order', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions/trends').respond(200, null);

      var result = TransactionProcessingFactory.fetchTrends();

      $httpBackend.flush();

      for(var i = 0; i < result.length - 1; i++){
        var currentMonth = new Date(result[i].month + '-01');
        var nextMonth = new Date(result[i + 1].month + '-01');
        expect(currentMonth).toBeGreaterThanOrEqual(nextMonth);
      }
    });
  });

  describe('resource configuration', function(){
    it('should be defined as a factory', function(){
      expect(TransactionProcessingFactory).toBeDefined();
      expect(typeof TransactionProcessingFactory.fetchTransactions).toBe('function');
      expect(typeof TransactionProcessingFactory.fetchTrends).toBe('function');
    });

    it('should construct correct URL for fetchTransactions with parameters', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions?page=2&size=30').respond(200, {data: [], totalRecords: 0});
      TransactionProcessingFactory.fetchTransactions({page: 2, size: 30});
      $httpBackend.flush();
    });

    it('should construct correct URL for fetchTrends', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions/trends').respond(200, []);
      TransactionProcessingFactory.fetchTrends();
      $httpBackend.flush();
    });
  });

  describe('error scenarios', function(){
    it('should handle 404 error for fetchTransactions', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions?page=1&size=20').respond(404, 'Not Found');

      var result = TransactionProcessingFactory.fetchTransactions({page: 1, size: 20});
      var errorOccurred = false;

      result.$promise.catch(function(error){
        errorOccurred = true;
        expect(error.status).toBe(404);
      });

      $httpBackend.flush();
      expect(errorOccurred).toBe(true);
    });

    it('should handle 500 error for fetchTrends', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions/trends').respond(500, 'Internal Server Error');

      var result = TransactionProcessingFactory.fetchTrends();
      var errorOccurred = false;

      result.$promise.catch(function(error){
        errorOccurred = true;
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
      expect(errorOccurred).toBe(true);
    });

    it('should handle network timeout for fetchTransactions', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions?page=1&size=20').respond(-1, '');

      var result = TransactionProcessingFactory.fetchTransactions({page: 1, size: 20});
      var errorOccurred = false;

      result.$promise.catch(function(error){
        errorOccurred = true;
        expect(error.status).toBe(-1);
      });

      $httpBackend.flush();
      expect(errorOccurred).toBe(true);
    });
  });

  describe('integration scenarios', function(){
    it('should handle multiple concurrent fetchTransactions calls', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions?page=1&size=20').respond(200, {data: [], totalRecords: 100});
      $httpBackend.expectGET(API_ENDPOINT + '/transactions?page=2&size=20').respond(200, {data: [], totalRecords: 100});

      var result1 = TransactionProcessingFactory.fetchTransactions({page: 1, size: 20});
      var result2 = TransactionProcessingFactory.fetchTransactions({page: 2, size: 20});

      $httpBackend.flush();

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
    });

    it('should handle fetchTransactions and fetchTrends together', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions?page=1&size=20').respond(200, {data: [], totalRecords: 100});
      $httpBackend.expectGET(API_ENDPOINT + '/transactions/trends').respond(200, []);

      var transactions = TransactionProcessingFactory.fetchTransactions({page: 1, size: 20});
      var trends = TransactionProcessingFactory.fetchTrends();

      $httpBackend.flush();

      expect(transactions).toBeDefined();
      expect(trends).toBeDefined();
    });
  });
});

})();