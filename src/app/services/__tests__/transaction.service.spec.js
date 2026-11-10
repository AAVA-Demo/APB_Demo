/*
Test Documentation:
- Test Name: TransactionService - getTransactions makes HTTP request
- Purpose: Validates HTTP request for transaction retrieval
- Scenario: Service is called with userId, page, pageSize, and filters
- Expected Result: HTTP GET request is made with correct parameters
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions error handling
- Purpose: Validates error handling when HTTP request fails
- Scenario: HTTP request returns error
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: TransactionService - mockGetTransactions returns paginated data
- Purpose: Validates mock transaction data with pagination
- Scenario: Mock method is called with page and pageSize
- Expected Result: Returns paginated transactions with correct pagination metadata
*/
/*
Test Documentation:
- Test Name: TransactionService - mockGetTransactions filters by cardId
- Purpose: Validates filtering transactions by credit card
- Scenario: Filter is applied for specific cardId
- Expected Result: Returns only transactions for specified card
*/
/*
Test Documentation:
- Test Name: TransactionService - mockGetTransactions filters by date range
- Purpose: Validates filtering transactions by date range
- Scenario: Start and end date filters are applied
- Expected Result: Returns only transactions within date range
*/
/*
Test Documentation:
- Test Name: TransactionService - mockGetTransactions searches by term
- Purpose: Validates search functionality for merchant and description
- Scenario: Search term is provided
- Expected Result: Returns transactions matching search term in merchant or description
*/
/*
Coverage Report:
- Functions tested: getTransactions, mockGetTransactions
- Scenarios covered: HTTP request, error handling, pagination, cardId filter, date range filter, search filter, combined filters
- Edge cases: empty results, single page, multiple pages, case-insensitive search
- Uncovered scenarios: concurrent requests (requires advanced testing)
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $httpBackend, $q, $rootScope;
    var API_BASE = '/api/transactions';
    var mockUserId = 'user123';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$q_, _$rootScope_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getTransactions', function() {
      it('should make HTTP GET request with correct parameters', function() {
        var mockResponse = {
          transactions: [],
          pagination: {currentPage: 1, pageSize: 20, totalRecords: 0, totalPages: 0}
        };

        $httpBackend.expectGET(API_BASE + '?page=1&pageSize=20&userId=' + mockUserId)
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(mockUserId, 1, 20).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
      });

      it('should include filters in request parameters', function() {
        var filters = {cardId: 'card001', startDate: '2024-01-01'};
        var mockResponse = {transactions: [], pagination: {}};

        $httpBackend.expectGET(API_BASE + '?cardId=card001&page=1&pageSize=20&startDate=2024-01-01&userId=' + mockUserId)
          .respond(200, mockResponse);

        TransactionService.getTransactions(mockUserId, 1, 20, filters);
        $httpBackend.flush();
      });

      it('should use default page and pageSize when not provided', function() {
        var mockResponse = {transactions: [], pagination: {}};

        $httpBackend.expectGET(API_BASE + '?page=1&pageSize=20&userId=' + mockUserId)
          .respond(200, mockResponse);

        TransactionService.getTransactions(mockUserId);
        $httpBackend.flush();
      });

      it('should reject promise on HTTP error', function() {
        $httpBackend.expectGET(API_BASE + '?page=1&pageSize=20&userId=' + mockUserId)
          .respond(500, 'Internal Server Error');

        var error;
        TransactionService.getTransactions(mockUserId, 1, 20).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle network errors', function() {
        $httpBackend.expectGET(API_BASE + '?page=1&pageSize=20&userId=' + mockUserId)
          .respond(0, '');

        var error;
        TransactionService.getTransactions(mockUserId, 1, 20).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error).toBeDefined();
      });
    });

    describe('mockGetTransactions', function() {
      it('should return paginated transaction data', function() {
        var result;
        TransactionService.mockGetTransactions(mockUserId, 1, 20).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.transactions).toBeDefined();
        expect(result.pagination).toBeDefined();
        expect(Array.isArray(result.transactions)).toBe(true);
      });

      it('should return correct pagination metadata', function() {
        var result;
        TransactionService.mockGetTransactions(mockUserId, 1, 20).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.pagination.currentPage).toBe(1);
        expect(result.pagination.pageSize).toBe(20);
        expect(result.pagination.totalRecords).toBe(20);
        expect(result.pagination.totalPages).toBe(1);
      });

      it('should return 20 transactions on first page', function() {
        var result;
        TransactionService.mockGetTransactions(mockUserId, 1, 20).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.transactions.length).toBe(20);
      });

      it('should return transactions with complete structure', function() {
        var result;
        TransactionService.mockGetTransactions(mockUserId, 1, 20).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.transactions.forEach(function(txn) {
          expect(txn.transactionId).toBeDefined();
          expect(txn.userId).toBe(mockUserId);
          expect(txn.cardId).toBeDefined();
          expect(txn.cardName).toBeDefined();
          expect(txn.date).toBeDefined();
          expect(txn.merchant).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(txn.category).toBeDefined();
          expect(txn.description).toBeDefined();
          expect(txn.status).toBeDefined();
        });
      });

      it('should filter transactions by cardId', function() {
        var filters = {cardId: 'card001'};
        var result;
        TransactionService.mockGetTransactions(mockUserId, 1, 20, filters).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.transactions.forEach(function(txn) {
          expect(txn.cardId).toBe('card001');
        });
      });

      it('should filter transactions by start date', function() {
        var filters = {startDate: '2024-11-10'};
        var result;
        TransactionService.mockGetTransactions(mockUserId, 1, 20, filters).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.transactions.forEach(function(txn) {
          expect(new Date(txn.date) >= new Date('2024-11-10')).toBe(true);
        });
      });

      it('should filter transactions by end date', function() {
        var filters = {endDate: '2024-11-10'};
        var result;
        TransactionService.mockGetTransactions(mockUserId, 1, 20, filters).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.transactions.forEach(function(txn) {
          expect(new Date(txn.date) <= new Date('2024-11-10')).toBe(true);
        });
      });

      it('should filter transactions by date range', function() {
        var filters = {startDate: '2024-11-05', endDate: '2024-11-10'};
        var result;
        TransactionService.mockGetTransactions(mockUserId, 1, 20, filters).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.transactions.forEach(function(txn) {
          var txnDate = new Date(txn.date);
          expect(txnDate >= new Date('2024-11-05')).toBe(true);
          expect(txnDate <= new Date('2024-11-10')).toBe(true);
        });
      });

      it('should search transactions by merchant name', function() {
        var filters = {searchTerm: 'starbucks'};
        var result;
        TransactionService.mockGetTransactions(mockUserId, 1, 20, filters).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.transactions.length).toBeGreaterThan(0);
        result.transactions.forEach(function(txn) {
          var matchesMerchant = txn.merchant.toLowerCase().indexOf('starbucks') > -1;
          var matchesDescription = txn.description.toLowerCase().indexOf('starbucks') > -1;
          expect(matchesMerchant || matchesDescription).toBe(true);
        });
      });

      it('should search transactions case-insensitively', function() {
        var filters = {searchTerm: 'STARBUCKS'};
        var result;
        TransactionService.mockGetTransactions(mockUserId, 1, 20, filters).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.transactions.length).toBeGreaterThan(0);
      });

      it('should search transactions by description', function() {
        var filters = {searchTerm: 'coffee'};
        var result;
        TransactionService.mockGetTransactions(mockUserId, 1, 20, filters).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.transactions.length).toBeGreaterThan(0);
        result.transactions.forEach(function(txn) {
          var matchesMerchant = txn.merchant.toLowerCase().indexOf('coffee') > -1;
          var matchesDescription = txn.description.toLowerCase().indexOf('coffee') > -1;
          expect(matchesMerchant || matchesDescription).toBe(true);
        });
      });

      it('should combine multiple filters', function() {
        var filters = {cardId: 'card001', startDate: '2024-11-01', searchTerm: 'fuel'};
        var result;
        TransactionService.mockGetTransactions(mockUserId, 1, 20, filters).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.transactions.forEach(function(txn) {
          expect(txn.cardId).toBe('card001');
          expect(new Date(txn.date) >= new Date('2024-11-01')).toBe(true);
          var matchesTerm = txn.merchant.toLowerCase().indexOf('fuel') > -1 || 
                           txn.description.toLowerCase().indexOf('fuel') > -1;
          expect(matchesTerm).toBe(true);
        });
      });

      it('should return empty array when no matches found', function() {
        var filters = {searchTerm: 'nonexistentmerchant123'};
        var result;
        TransactionService.mockGetTransactions(mockUserId, 1, 20, filters).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.transactions.length).toBe(0);
        expect(result.pagination.totalRecords).toBe(0);
      });

      it('should handle pagination beyond available data', function() {
        var result;
        TransactionService.mockGetTransactions(mockUserId, 5, 20).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.transactions.length).toBe(0);
      });

      it('should return correct page of results', function() {
        var result1, result2;
        TransactionService.mockGetTransactions(mockUserId, 1, 10).then(function(data) {
          result1 = data;
        });
        $rootScope.$digest();

        TransactionService.mockGetTransactions(mockUserId, 2, 10).then(function(data) {
          result2 = data;
        });
        $rootScope.$digest();

        expect(result1.transactions.length).toBe(10);
        expect(result2.transactions.length).toBe(10);
        expect(result1.transactions[0].transactionId).not.toBe(result2.transactions[0].transactionId);
      });

      it('should include all transaction categories', function() {
        var result;
        TransactionService.mockGetTransactions(mockUserId, 1, 20).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        var categories = result.transactions.map(function(txn) { return txn.category; });
        var uniqueCategories = categories.filter(function(value, index, self) {
          return self.indexOf(value) === index;
        });

        expect(uniqueCategories.length).toBeGreaterThan(1);
        expect(uniqueCategories).toContain('Food & Dining');
      });
    });
  });
})();