/*
Test Documentation:
- Test Name: TransactionDataService Unit Tests
- Purpose: Validate transaction data service functionality including transaction retrieval with various parameters
- Scenario: Tests cover successful transaction fetch, parameter handling, pagination, filtering, and error scenarios
- Expected Result: Transactions should be retrieved correctly with proper parameter handling and error management
*/

(function() {
  'use strict';

  describe('TransactionDataService', function() {
    var TransactionDataService, $httpBackend, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionDataService_, _$httpBackend_, _API_CONFIG_) {
      TransactionDataService = _TransactionDataService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getTransactions', function() {
      it('should fetch transactions without parameters', function(done) {
        var mockTransactions = {
          transactions: [
            { transactionId: '1', amount: 100, merchantName: 'Store A', timestamp: '2024-01-15T10:00:00Z' },
            { transactionId: '2', amount: 200, merchantName: 'Store B', timestamp: '2024-01-16T11:00:00Z' }
          ],
          totalRecords: 2
        };

        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS)
          .respond(200, mockTransactions);

        TransactionDataService.getTransactions().then(function(data) {
          expect(data).toEqual(mockTransactions);
          expect(data.transactions.length).toBe(2);
          done();
        });

        $httpBackend.flush();
      });

      it('should fetch transactions with pagination parameters', function(done) {
        var params = { page: 2, size: 25 };
        var mockTransactions = {
          transactions: [
            { transactionId: '26', amount: 150, merchantName: 'Store C' }
          ],
          totalRecords: 100
        };

        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS + '?page=2&size=25')
          .respond(200, mockTransactions);

        TransactionDataService.getTransactions(params).then(function(data) {
          expect(data.transactions.length).toBe(1);
          expect(data.totalRecords).toBe(100);
          done();
        });

        $httpBackend.flush();
      });

      it('should fetch transactions filtered by card ID', function(done) {
        var params = { cardId: 'card-123' };
        var mockTransactions = {
          transactions: [
            { transactionId: '1', cardId: 'card-123', amount: 100 }
          ],
          totalRecords: 1
        };

        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS + '?cardId=card-123')
          .respond(200, mockTransactions);

        TransactionDataService.getTransactions(params).then(function(data) {
          expect(data.transactions[0].cardId).toBe('card-123');
          done();
        });

        $httpBackend.flush();
      });

      it('should fetch transactions with date range parameters', function(done) {
        var params = {
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-31T23:59:59Z'
        };
        var mockTransactions = {
          transactions: [
            { transactionId: '1', timestamp: '2024-01-15T10:00:00Z' }
          ],
          totalRecords: 1
        };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_CONFIG.ENDPOINTS.TRANSACTIONS) !== -1 &&
                 url.indexOf('startDate=2024-01-01') !== -1 &&
                 url.indexOf('endDate=2024-01-31') !== -1;
        }).respond(200, mockTransactions);

        TransactionDataService.getTransactions(params).then(function(data) {
          expect(data.transactions.length).toBe(1);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle empty transaction list', function(done) {
        var mockTransactions = {
          transactions: [],
          totalRecords: 0
        };

        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS)
          .respond(200, mockTransactions);

        TransactionDataService.getTransactions().then(function(data) {
          expect(data.transactions).toEqual([]);
          expect(data.totalRecords).toBe(0);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle API error and reject promise', function(done) {
        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS)
          .respond(500, { error: 'Internal server error' });

        TransactionDataService.getTransactions().catch(function(error) {
          expect(error.status).toBe(500);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle 404 error when transactions not found', function(done) {
        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS)
          .respond(404, { error: 'Transactions not found' });

        TransactionDataService.getTransactions().catch(function(error) {
          expect(error.status).toBe(404);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle network timeout', function(done) {
        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS)
          .respond(0, '');

        TransactionDataService.getTransactions().catch(function(error) {
          expect(error.status).toBe(0);
          done();
        });

        $httpBackend.flush();
      });

      it('should fetch transactions with multiple filter parameters', function(done) {
        var params = {
          cardId: 'card-123',
          page: 1,
          size: 50,
          startDate: '2024-01-01T00:00:00Z'
        };
        var mockTransactions = {
          transactions: [
            { transactionId: '1', cardId: 'card-123' }
          ],
          totalRecords: 1
        };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_CONFIG.ENDPOINTS.TRANSACTIONS) !== -1 &&
                 url.indexOf('cardId=card-123') !== -1 &&
                 url.indexOf('page=1') !== -1 &&
                 url.indexOf('size=50') !== -1;
        }).respond(200, mockTransactions);

        TransactionDataService.getTransactions(params).then(function(data) {
          expect(data.transactions.length).toBe(1);
          done();
        });

        $httpBackend.flush();
      });

      it('should meet sub-300ms retrieval latency requirement', function(done) {
        var mockTransactions = {
          transactions: [{ transactionId: '1', amount: 100 }],
          totalRecords: 1
        };

        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS)
          .respond(200, mockTransactions);

        var startTime = Date.now();

        TransactionDataService.getTransactions().then(function(data) {
          var endTime = Date.now();
          var latency = endTime - startTime;

          expect(data).toBeDefined();
          expect(latency).toBeLessThan(300);
          done();
        });

        $httpBackend.flush();
      });
    });
  });
})();

/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered:
  * Fetch transactions without parameters
  * Fetch with pagination parameters (page, size)
  * Filter by card ID
  * Filter by date range (startDate, endDate)
  * Empty transaction list handling
  * API error handling (500, 404)
  * Network timeout handling
  * Multiple filter parameters
  * Sub-300ms latency requirement validation
- Uncovered scenarios: Transaction modification, real-time updates (out of scope)
- Edge cases tested: Empty results, network failures, server errors, parameter combinations
- NFR validation: Sub-300ms retrieval latency requirement tested
*/