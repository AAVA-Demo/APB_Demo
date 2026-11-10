/*
Test Documentation:
- Test Name: TransactionDataService - getTransactions success
- Purpose: Validates successful retrieval of transaction data
- Scenario: Normal scenario with successful API response
- Expected Result: Returns transaction data for specified months
*/
/*
Test Documentation:
- Test Name: TransactionDataService - getTransactions with default months
- Purpose: Validates default parameter handling
- Scenario: Normal scenario without specifying months parameter
- Expected Result: Uses default 12 months
*/
/*
Test Documentation:
- Test Name: TransactionDataService - getTransactions error
- Purpose: Validates error handling when API call fails
- Scenario: Error scenario with API failure
- Expected Result: Error is logged and promise is rejected
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: successful API call, default parameter, API error, custom months parameter
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('TransactionDataService', function() {
    var TransactionDataService, $httpBackend;

    beforeEach(module('app.analytics'));

    beforeEach(inject(function(_TransactionDataService_, _$httpBackend_) {
      TransactionDataService = _TransactionDataService_;
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getTransactions', function() {
      it('should fetch transactions successfully', function() {
        var mockResponse = [
          { date: '2024-01-15', amount: 100, category: 'Food & Dining' },
          { date: '2024-01-20', amount: 50, category: 'Fuel' }
        ];

        $httpBackend.expectGET('/api/transactions?months=12').respond(200, mockResponse);

        var result;
        TransactionDataService.getTransactions(12).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should use default months parameter when not specified', function() {
        $httpBackend.expectGET('/api/transactions?months=12').respond(200, []);

        TransactionDataService.getTransactions();

        $httpBackend.flush();
      });

      it('should use custom months parameter', function() {
        $httpBackend.expectGET('/api/transactions?months=6').respond(200, []);

        TransactionDataService.getTransactions(6);

        $httpBackend.flush();
      });

      it('should handle API error', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/transactions?months=12').respond(500, 'Server Error');

        var error;
        TransactionDataService.getTransactions(12).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle network error', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/transactions?months=12').respond(0, '');

        var error;
        TransactionDataService.getTransactions(12).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
})();