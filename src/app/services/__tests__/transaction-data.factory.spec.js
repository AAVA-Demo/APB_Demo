/*
Test Documentation:
- Test Name: TransactionDataFactory - fetchTransactions
- Purpose: Verify transaction data retrieval
- Scenario: API returns transaction data successfully
- Expected Result: Returns array of transaction objects
*/
/*
Test Documentation:
- Test Name: TransactionDataFactory - fetchTransactions
- Purpose: Verify fallback to mock data generation
- Scenario: API returns no data
- Expected Result: Returns generated mock transaction array with 50 items
*/
/*
Test Documentation:
- Test Name: TransactionDataFactory - mock data generation
- Purpose: Verify mock transaction data structure
- Scenario: Mock data is generated
- Expected Result: Each transaction has required fields and valid categories
*/
/*
Coverage Report:
- Functions tested: fetchTransactions, response interceptor, mock data generator
- Scenarios covered: successful API response, fallback mock data, data structure validation, category validation
- Uncovered scenarios: network timeout (handled by $resource)
*/

(function(){
'use strict';

describe('TransactionDataFactory', function(){
  var TransactionDataFactory, $httpBackend, API_ENDPOINT;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionDataFactory_, _$httpBackend_, _API_ENDPOINT_){
    TransactionDataFactory = _TransactionDataFactory_;
    $httpBackend = _$httpBackend_;
    API_ENDPOINT = _API_ENDPOINT_;
  }));

  afterEach(function(){
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('fetchTransactions', function(){
    it('should fetch transactions successfully from API', function(){
      var mockResponse = [
        {transactionId: 'TXN001', cardId: 'CC001', amount: 1500, category: 'Food & Dining', date: '2023-10-15T10:30:00Z', merchant: 'Restaurant A'},
        {transactionId: 'TXN002', cardId: 'CC002', amount: 3000, category: 'Fuel', date: '2023-10-16T14:20:00Z', merchant: 'Gas Station B'}
      ];

      $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, mockResponse);

      var result = TransactionDataFactory.fetchTransactions();

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].transactionId).toBe('TXN001');
      expect(result[1].category).toBe('Fuel');
    });

    it('should return mock data when API response has no data', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, null);

      var result = TransactionDataFactory.fetchTransactions();

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(50);
    });

    it('should return mock data when API response is undefined', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, undefined);

      var result = TransactionDataFactory.fetchTransactions();

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(50);
    });

    it('should generate mock transactions with valid structure', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, null);

      var result = TransactionDataFactory.fetchTransactions();

      $httpBackend.flush();

      result.forEach(function(txn){
        expect(txn.transactionId).toBeDefined();
        expect(txn.cardId).toBeDefined();
        expect(txn.amount).toBeDefined();
        expect(txn.category).toBeDefined();
        expect(txn.date).toBeDefined();
        expect(txn.merchant).toBeDefined();
        expect(typeof txn.amount).toBe('number');
        expect(txn.amount).toBeGreaterThanOrEqual(100);
        expect(txn.amount).toBeLessThanOrEqual(5100);
      });
    });

    it('should generate transactions with valid categories', function(){
      var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];

      $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, null);

      var result = TransactionDataFactory.fetchTransactions();

      $httpBackend.flush();

      result.forEach(function(txn){
        expect(validCategories).toContain(txn.category);
      });
    });

    it('should generate transactions with valid cardIds', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, null);

      var result = TransactionDataFactory.fetchTransactions();

      $httpBackend.flush();

      result.forEach(function(txn){
        expect(txn.cardId).toMatch(/^CC00[1-3]$/);
      });
    });

    it('should generate transactions with valid merchants', function(){
      var validMerchants = ['Restaurant A', 'Gas Station B', 'Store C', 'Airline D', 'Cinema E', 'Electric Co', 'Hospital F', 'University G', 'Misc H'];

      $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, null);

      var result = TransactionDataFactory.fetchTransactions();

      $httpBackend.flush();

      result.forEach(function(txn){
        expect(validMerchants).toContain(txn.merchant);
      });
    });

    it('should generate transactions with dates within last 90 days', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, null);

      var result = TransactionDataFactory.fetchTransactions();

      $httpBackend.flush();

      var now = new Date();
      var ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      result.forEach(function(txn){
        var txnDate = new Date(txn.date);
        expect(txnDate).toBeLessThanOrEqual(now);
        expect(txnDate).toBeGreaterThanOrEqual(ninetyDaysAgo);
      });
    });

    it('should generate unique transaction IDs', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, null);

      var result = TransactionDataFactory.fetchTransactions();

      $httpBackend.flush();

      var ids = result.map(function(txn){ return txn.transactionId; });
      var uniqueIds = ids.filter(function(id, index, self){ return self.indexOf(id) === index; });

      expect(uniqueIds.length).toBe(50);
    });
  });

  describe('resource configuration', function(){
    it('should be defined as a factory', function(){
      expect(TransactionDataFactory).toBeDefined();
      expect(typeof TransactionDataFactory.fetchTransactions).toBe('function');
    });

    it('should construct correct API endpoint URL', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, []);
      TransactionDataFactory.fetchTransactions();
      $httpBackend.flush();
    });
  });

  describe('error scenarios', function(){
    it('should handle 401 unauthorized error', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(401, 'Unauthorized');

      var result = TransactionDataFactory.fetchTransactions();
      var errorOccurred = false;

      result.$promise.catch(function(error){
        errorOccurred = true;
        expect(error.status).toBe(401);
      });

      $httpBackend.flush();
      expect(errorOccurred).toBe(true);
    });

    it('should handle 500 server error', function(){
      $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(500, 'Internal Server Error');

      var result = TransactionDataFactory.fetchTransactions();
      var errorOccurred = false;

      result.$promise.catch(function(error){
        errorOccurred = true;
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
      expect(errorOccurred).toBe(true);
    });
  });
});

})();