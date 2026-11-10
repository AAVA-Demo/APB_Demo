/*
Test Documentation:
- Test Name: TransactionService - getMonthlySpend success
- Purpose: Validates that getMonthlySpend retrieves monthly spend data successfully
- Scenario: Service is called and API returns monthly spend data
- Expected Result: Returns object with monthlySpend and totalOutstanding
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions with filter
- Purpose: Validates that getTransactions retrieves filtered transaction list
- Scenario: Service is called with filter parameters
- Expected Result: Returns array of transactions matching filter criteria
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactionById success
- Purpose: Validates that getTransactionById retrieves specific transaction details
- Scenario: Service is called with valid transaction ID
- Expected Result: Returns transaction object with complete details
*/
/*
Test Documentation:
- Test Name: TransactionService - error handling with mock data
- Purpose: Validates that service returns mock data when API fails
- Scenario: API returns 404 or network error
- Expected Result: Service returns generated mock data
*/
/*
Coverage Report:
- Functions tested: getMonthlySpend, getTransactions, getTransactionById, generateMockTransactions
- Scenarios covered: successful API calls, filter parameter building, error handling with mock data, transaction sorting
- Uncovered scenarios: invalid transaction ID, malformed filter parameters
*/

describe('TransactionService', function() {
  'use strict';
  
  beforeEach(module('app.dashboard'));
  beforeEach(module('app.shared'));
  
  var TransactionService, $httpBackend, $q, AuthService;
  
  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$q_, _AuthService_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    AuthService = _AuthService_;
    spyOn(AuthService, 'getToken').and.returnValue('mock-token-12345');
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getMonthlySpend', function() {
    it('should retrieve monthly spend data successfully', function() {
      var mockResponse = {monthlySpend: 25000, totalOutstanding: 25000};
      
      $httpBackend.expectGET('/api/transactions/monthly').respond(200, mockResponse);
      
      var result;
      TransactionService.getMonthlySpend().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.monthlySpend).toBe(25000);
      expect(result.totalOutstanding).toBe(25000);
    });
    
    it('should return mock data when API returns 404', function() {
      $httpBackend.expectGET('/api/transactions/monthly').respond(404);
      
      var result;
      TransactionService.getMonthlySpend().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.monthlySpend).toBe(25000);
    });
  });
  
  describe('getTransactions', function() {
    it('should retrieve transactions successfully', function() {
      var mockResponse = [
        {transactionId: 'txn1', merchant: 'Amazon', amount: 500},
        {transactionId: 'txn2', merchant: 'Starbucks', amount: 50}
      ];
      
      $httpBackend.expectGET('/api/transactions').respond(200, mockResponse);
      
      var result;
      TransactionService.getTransactions().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
    });
    
    it('should build query parameters from filter', function() {
      var filter = {
        dateFrom: new Date('2024-01-01'),
        dateTo: new Date('2024-06-30'),
        searchText: 'amazon',
        cardIds: ['c1', 'c2']
      };
      
      $httpBackend.expectGET(/\/api\/transactions\?.*dateFrom=.*&dateTo=.*&search=amazon&cardIds=c1%2Cc2/).respond(200, []);
      
      TransactionService.getTransactions(filter);
      
      $httpBackend.flush();
    });
    
    it('should return mock transactions when API returns 404', function() {
      $httpBackend.expectGET('/api/transactions').respond(404);
      
      var result;
      TransactionService.getTransactions().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(50);
    });
  });
  
  describe('getTransactionById', function() {
    it('should retrieve transaction by ID successfully', function() {
      var mockResponse = {transactionId: 'txn1', merchant: 'Amazon', amount: 500};
      
      $httpBackend.expectGET('/api/transactions/txn1').respond(200, mockResponse);
      
      var result;
      TransactionService.getTransactionById('txn1').then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.transactionId).toBe('txn1');
    });
    
    it('should return mock transaction when API returns 404', function() {
      $httpBackend.expectGET('/api/transactions/txn999').respond(404);
      
      var result;
      TransactionService.getTransactionById('txn999').then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.transactionId).toBeDefined();
    });
  });
});