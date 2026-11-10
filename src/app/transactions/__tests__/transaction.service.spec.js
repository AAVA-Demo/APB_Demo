/*
Test Documentation:
- Test Name: TransactionService - getTransactions success
- Purpose: Validates successful transaction retrieval
- Scenario: Service fetches transactions with pagination
- Expected Result: Returns transactions array and total count
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions with filters
- Purpose: Validates filter parameter handling
- Scenario: Service called with date, amount, and card filters
- Expected Result: API called with correct filter parameters
*/
/*
Test Documentation:
- Test Name: TransactionService - caching mechanism
- Purpose: Validates transaction caching for performance
- Scenario: Same request made twice
- Expected Result: Second call returns cached data without API call
*/
/*
Test Documentation:
- Test Name: TransactionService - clearCache
- Purpose: Validates cache clearing functionality
- Scenario: clearCache is called
- Expected Result: Subsequent requests fetch fresh data
*/
/*
Test Documentation:
- Test Name: TransactionService - error handling
- Purpose: Validates error propagation
- Scenario: API request fails
- Expected Result: Promise rejects with error
*/
/*
Coverage Report:
- Functions tested: getTransactions(), clearCache()
- Scenarios covered: success, filters, caching, cache clearing, error handling
- Uncovered scenarios: concurrent requests, cache expiration
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, ApiService, $q, $rootScope;

    beforeEach(module('app.transactions'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _ApiService_, _$q_, _$rootScope_) {
      TransactionService = _TransactionService_;
      ApiService = _ApiService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getTransactions()', function() {
      it('should fetch transactions successfully with default pagination', function() {
        var mockResponse = {
          transactions: [
            { id: 1, merchant: 'Store A', amount: 100 },
            { id: 2, merchant: 'Store B', amount: 200 }
          ],
          total: 2
        };

        spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));

        var result;
        TransactionService.getTransactions().then(function(data) {
          result = data;
        });

        $rootScope.$apply();

        expect(ApiService.get).toHaveBeenCalledWith('/transactions', { page: 1, size: 20 });
        expect(result).toEqual(mockResponse);
      });

      it('should include filter parameters in API call', function() {
        var filters = {
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          cardIds: ['card1', 'card2'],
          minAmount: 50,
          maxAmount: 500,
          searchTerm: 'coffee',
          sortBy: 'amount',
          sortOrder: 'desc'
        };

        spyOn(ApiService, 'get').and.returnValue($q.resolve({ transactions: [], total: 0 }));

        TransactionService.getTransactions(1, 20, filters);
        $rootScope.$apply();

        expect(ApiService.get).toHaveBeenCalledWith('/transactions', {
          page: 1,
          size: 20,
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          cardIds: 'card1,card2',
          minAmount: 50,
          maxAmount: 500,
          search: 'coffee',
          sortBy: 'amount',
          sortOrder: 'desc'
        });
      });

      it('should cache transaction results', function() {
        var mockResponse = { transactions: [{ id: 1 }], total: 1 };
        spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));

        TransactionService.getTransactions(1, 20, null);
        $rootScope.$apply();
        expect(ApiService.get.calls.count()).toBe(1);

        TransactionService.getTransactions(1, 20, null);
        $rootScope.$apply();
        expect(ApiService.get.calls.count()).toBe(1);
      });

      it('should handle empty filters object', function() {
        spyOn(ApiService, 'get').and.returnValue($q.resolve({ transactions: [], total: 0 }));

        TransactionService.getTransactions(1, 20, {});
        $rootScope.$apply();

        expect(ApiService.get).toHaveBeenCalledWith('/transactions', { page: 1, size: 20 });
      });

      it('should propagate errors from ApiService', function() {
        var mockError = { status: 500, message: 'Server Error' };
        spyOn(ApiService, 'get').and.returnValue($q.reject(mockError));

        var error;
        TransactionService.getTransactions().catch(function(err) {
          error = err;
        });

        $rootScope.$apply();
        expect(error).toEqual(mockError);
      });
    });

    describe('clearCache()', function() {
      it('should clear cache and fetch fresh data on next request', function() {
        var mockResponse = { transactions: [{ id: 1 }], total: 1 };
        spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));

        TransactionService.getTransactions(1, 20, null);
        $rootScope.$apply();
        expect(ApiService.get.calls.count()).toBe(1);

        TransactionService.clearCache();

        TransactionService.getTransactions(1, 20, null);
        $rootScope.$apply();
        expect(ApiService.get.calls.count()).toBe(2);
      });
    });
  });
})();