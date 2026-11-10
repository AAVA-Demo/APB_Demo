/*
Test Documentation:
- Test Name: TransactionSummaryService - getTransactionSummary success
- Purpose: Validates successful retrieval of transaction summary data
- Scenario: Normal scenario with successful API response
- Expected Result: Returns transaction summary data
*/
/*
Test Documentation:
- Test Name: TransactionSummaryService - getTransactionSummary error
- Purpose: Validates error handling when API call fails
- Scenario: Error scenario with API failure
- Expected Result: Error is logged and promise is rejected
*/
/*
Coverage Report:
- Functions tested: getTransactionSummary
- Scenarios covered: successful API call, API error, network error
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('TransactionSummaryService', function() {
    var TransactionSummaryService, $httpBackend;

    beforeEach(module('app.dashboard'));

    beforeEach(inject(function(_TransactionSummaryService_, _$httpBackend_) {
      TransactionSummaryService = _TransactionSummaryService_;
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getTransactionSummary', function() {
      it('should fetch transaction summary successfully', function() {
        var mockResponse = {
          currentMonthSpend: 1500,
          totalOutstanding: 1500
        };

        $httpBackend.expectGET('/api/transactions/summary').respond(200, mockResponse);

        var result;
        TransactionSummaryService.getTransactionSummary().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should handle API error', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/transactions/summary').respond(500, 'Server Error');

        var error;
        TransactionSummaryService.getTransactionSummary().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle network error', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/transactions/summary').respond(0, '');

        var error;
        TransactionSummaryService.getTransactionSummary().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should make GET request to correct endpoint', function() {
        $httpBackend.expectGET('/api/transactions/summary').respond(200, {});
        TransactionSummaryService.getTransactionSummary();
        $httpBackend.flush();
      });
    });
  });
})();