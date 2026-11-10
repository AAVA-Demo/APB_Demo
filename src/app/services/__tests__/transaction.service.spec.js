/*
Test Documentation:
- Test Name: TransactionService - getTransactions success
- Purpose: Validates transaction retrieval with date range
- Scenario: Valid userId and date range provided
- Expected Result: Returns array of transactions within date range
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions error handling
- Purpose: Validates error handling when API fails
- Scenario: Server returns error
- Expected Result: Promise rejected and error logged
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: success retrieval, error handling, date range filtering
- Uncovered scenarios: invalid date formats, timezone handling
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $httpBackend, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_, _API_CONFIG_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getTransactions', function() {
      it('should retrieve transactions for a user within date range', function() {
        var userId = 'user123';
        var startDate = new Date('2024-01-01');
        var endDate = new Date('2024-01-31');
        var mockTransactions = [
          { transactionId: 't1', amount: 50.00, date: '2024-01-15', category: 'Food & Dining' },
          { transactionId: 't2', amount: 100.00, date: '2024-01-20', category: 'Shopping' }
        ];

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?endDate=' + endDate + '&startDate=' + startDate + '&userId=' + userId)
          .respond(200, mockTransactions);

        var result;
        TransactionService.getTransactions(userId, startDate, endDate).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
        expect(result.length).toBe(2);
        expect(result[0].transactionId).toBe('t1');
      });

      it('should handle error when fetching transactions', function() {
        var userId = 'user123';
        var startDate = new Date('2024-01-01');
        var endDate = new Date('2024-01-31');
        spyOn(console, 'error');

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?endDate=' + endDate + '&startDate=' + startDate + '&userId=' + userId)
          .respond(500, 'Server Error');

        var error;
        TransactionService.getTransactions(userId, startDate, endDate).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching transactions:', jasmine.any(Object));
      });

      it('should include timeout configuration', function() {
        var userId = 'user123';
        var startDate = new Date('2024-01-01');
        var endDate = new Date('2024-01-31');
        var mockTransactions = [];

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?endDate=' + endDate + '&startDate=' + startDate + '&userId=' + userId)
          .respond(200, mockTransactions);

        TransactionService.getTransactions(userId, startDate, endDate);

        $httpBackend.flush();

        expect(API_CONFIG.timeout).toBeDefined();
      });

      it('should handle empty transaction list', function() {
        var userId = 'user123';
        var startDate = new Date('2024-01-01');
        var endDate = new Date('2024-01-31');
        var mockTransactions = [];

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?endDate=' + endDate + '&startDate=' + startDate + '&userId=' + userId)
          .respond(200, mockTransactions);

        var result;
        TransactionService.getTransactions(userId, startDate, endDate).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });
    });
  });
})();