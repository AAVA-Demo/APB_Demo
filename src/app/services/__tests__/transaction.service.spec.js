/*
Test Documentation:
- Test Name: TransactionService - getTransactions - fetches transactions with pagination parameters
- Purpose: Validates that the service correctly fetches transactions with proper pagination
- Scenario: User requests transaction history with specific page and page size
- Expected Result: Service calls API with correct query parameters and returns paginated results
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions - uses default pagination values when not provided
- Purpose: Validates that the service applies default pagination values when parameters are missing
- Scenario: User requests transactions without specifying page or page size
- Expected Result: Service uses default page 1 and page size 50
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions - handles API errors gracefully
- Purpose: Validates error handling when transaction API call fails
- Scenario: API returns error response
- Expected Result: Service rejects promise with error
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: pagination with custom values, default pagination, query string construction, API success, API failure, response transformation
- Uncovered scenarios: none
*/

describe('TransactionService', function() {
  'use strict';
  
  var TransactionService;
  var ApiFactory;
  var $httpParamSerializer;
  var $q;
  var $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_TransactionService_, _ApiFactory_, _$httpParamSerializer_, _$q_, _$rootScope_) {
    TransactionService = _TransactionService_;
    ApiFactory = _ApiFactory_;
    $httpParamSerializer = _$httpParamSerializer_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getTransactions', function() {
    
    it('should fetch transactions with specified pagination parameters', function() {
      var cardId = 'card123';
      var page = 2;
      var pageSize = 25;
      var apiResponse = {
        transactions: [
          {transactionId: 'txn1', amount: 100, merchantName: 'Store A'},
          {transactionId: 'txn2', amount: 200, merchantName: 'Store B'}
        ],
        currentPage: 2,
        totalPages: 5,
        pageSize: 25,
        totalCount: 125
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      TransactionService.getTransactions(cardId, page, pageSize).then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      var expectedQueryString = $httpParamSerializer({cardId: cardId, page: page, size: pageSize});
      expect(ApiFactory.get).toHaveBeenCalledWith('/transactions?' + expectedQueryString);
      expect(result.transactions).toEqual(apiResponse.transactions);
      expect(result.currentPage).toBe(2);
      expect(result.totalPages).toBe(5);
      expect(result.pageSize).toBe(25);
      expect(result.totalCount).toBe(125);
    });
    
    it('should use default page 1 when page parameter is not provided', function() {
      var cardId = 'card456';
      var pageSize = 50;
      var apiResponse = {
        transactions: [],
        currentPage: 1,
        totalPages: 1,
        pageSize: 50,
        totalCount: 0
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      TransactionService.getTransactions(cardId, null, pageSize).then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      var expectedQueryString = $httpParamSerializer({cardId: cardId, page: 1, size: pageSize});
      expect(ApiFactory.get).toHaveBeenCalledWith('/transactions?' + expectedQueryString);
      expect(result.currentPage).toBe(1);
    });
    
    it('should use default page size 50 when pageSize parameter is not provided', function() {
      var cardId = 'card789';
      var page = 1;
      var apiResponse = {
        transactions: [{transactionId: 'txn3', amount: 300}],
        currentPage: 1,
        totalPages: 1,
        pageSize: 50,
        totalCount: 1
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      TransactionService.getTransactions(cardId, page, null).then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      var expectedQueryString = $httpParamSerializer({cardId: cardId, page: page, size: 50});
      expect(ApiFactory.get).toHaveBeenCalledWith('/transactions?' + expectedQueryString);
      expect(result.pageSize).toBe(50);
    });
    
    it('should use default values for both page and pageSize when not provided', function() {
      var cardId = 'card999';
      var apiResponse = {
        transactions: [],
        currentPage: 1,
        totalPages: 1,
        pageSize: 50,
        totalCount: 0
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      TransactionService.getTransactions(cardId).then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      var expectedQueryString = $httpParamSerializer({cardId: cardId, page: 1, size: 50});
      expect(ApiFactory.get).toHaveBeenCalledWith('/transactions?' + expectedQueryString);
      expect(result.currentPage).toBe(1);
      expect(result.pageSize).toBe(50);
    });
    
    it('should handle API response with missing transactions field by providing empty array', function() {
      var cardId = 'card111';
      var apiResponse = {
        currentPage: 1,
        totalPages: 0,
        pageSize: 50,
        totalCount: 0
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      TransactionService.getTransactions(cardId, 1, 50).then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      expect(result.transactions).toEqual([]);
    });
    
    it('should provide default pagination values when API response fields are missing', function() {
      var cardId = 'card222';
      var apiResponse = {
        transactions: [{transactionId: 'txn4', amount: 400}]
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      TransactionService.getTransactions(cardId, 1, 50).then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      expect(result.transactions).toEqual(apiResponse.transactions);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.pageSize).toBe(50);
      expect(result.totalCount).toBe(0);
    });
    
    it('should handle API errors and reject the promise', function() {
      var cardId = 'card333';
      var deferred = $q.defer();
      deferred.reject({message: 'Failed to fetch transactions', status: 500});
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var error;
      TransactionService.getTransactions(cardId, 1, 50).catch(function(err) {
        error = err;
      });
      $rootScope.$digest();
      
      expect(error).toBeDefined();
      expect(error.message).toBe('Failed to fetch transactions');
      expect(error.status).toBe(500);
    });
    
    it('should construct query string correctly with cardId parameter', function() {
      var cardId = 'card444';
      var page = 3;
      var pageSize = 100;
      var deferred = $q.defer();
      deferred.resolve({transactions: [], currentPage: 3, totalPages: 10, pageSize: 100, totalCount: 1000});
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      TransactionService.getTransactions(cardId, page, pageSize);
      $rootScope.$digest();
      
      var expectedParams = {cardId: cardId, page: page, size: pageSize};
      var expectedQueryString = $httpParamSerializer(expectedParams);
      expect(ApiFactory.get).toHaveBeenCalledWith('/transactions?' + expectedQueryString);
    });
    
    it('should handle large page numbers correctly', function() {
      var cardId = 'card555';
      var page = 100;
      var pageSize = 50;
      var apiResponse = {
        transactions: [],
        currentPage: 100,
        totalPages: 100,
        pageSize: 50,
        totalCount: 5000
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      TransactionService.getTransactions(cardId, page, pageSize).then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      expect(result.currentPage).toBe(100);
      expect(result.totalPages).toBe(100);
    });
    
    it('should handle custom page sizes correctly', function() {
      var cardId = 'card666';
      var page = 1;
      var pageSize = 10;
      var apiResponse = {
        transactions: [
          {transactionId: 'txn5', amount: 500},
          {transactionId: 'txn6', amount: 600}
        ],
        currentPage: 1,
        totalPages: 10,
        pageSize: 10,
        totalCount: 100
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      TransactionService.getTransactions(cardId, page, pageSize).then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      expect(result.pageSize).toBe(10);
      expect(result.transactions.length).toBe(2);
    });
  });
});