/*
Test Documentation:
- Test Name: TransactionHistoryService Unit Tests
- Purpose: Validate transaction history retrieval with caching
- Scenario: Test getTransactionHistory with cache behavior
- Expected Result: Service should cache data and respect cache duration
*/

(function(){
'use strict';

describe('TransactionHistoryService', function() {
  var TransactionHistoryService, ApiService, $q, $rootScope;

  beforeEach(module('spendTrendsModule'));

  beforeEach(inject(function(_TransactionHistoryService_, _$q_, _$rootScope_) {
    TransactionHistoryService = _TransactionHistoryService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(inject(function($injector) {
    ApiService = $injector.get('ApiService');
    spyOn(ApiService, 'getTransactions').and.callThrough();
  }));

  describe('getTransactionHistory', function() {
    it('should fetch transaction history with period parameter', function() {
      var mockTransactions = [{id: 1, amount: 100}];
      ApiService.getTransactions.and.returnValue($q.resolve(mockTransactions));

      TransactionHistoryService.getTransactionHistory(12);

      expect(ApiService.getTransactions).toHaveBeenCalledWith({period: '12m'});
    });

    it('should return cached data within cache duration', function() {
      var mockTransactions = [{id: 1, amount: 100}];
      ApiService.getTransactions.and.returnValue($q.resolve(mockTransactions));

      var result1, result2;
      TransactionHistoryService.getTransactionHistory(12).then(function(data) {
        result1 = data;
      });
      $rootScope.$digest();

      TransactionHistoryService.getTransactionHistory(12).then(function(data) {
        result2 = data;
      });
      $rootScope.$digest();

      expect(ApiService.getTransactions.calls.count()).toBe(1);
      expect(result1).toEqual(mockTransactions);
      expect(result2).toEqual(mockTransactions);
    });

    it('should fetch new data after cache expires', function() {
      jasmine.clock().install();
      var mockTransactions = [{id: 1, amount: 100}];
      ApiService.getTransactions.and.returnValue($q.resolve(mockTransactions));

      TransactionHistoryService.getTransactionHistory(12);
      $rootScope.$digest();

      jasmine.clock().tick(301000);

      TransactionHistoryService.getTransactionHistory(12);
      $rootScope.$digest();

      expect(ApiService.getTransactions.calls.count()).toBe(2);
      jasmine.clock().uninstall();
    });

    it('should handle API error', function() {
      ApiService.getTransactions.and.returnValue($q.reject('API Error'));

      var error;
      TransactionHistoryService.getTransactionHistory(12).catch(function(err) {
        error = err;
      });

      $rootScope.$digest();

      expect(error).toBe('API Error');
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: getTransactionHistory
- Scenarios covered: Initial fetch, cache hit, cache expiration, API errors
- Edge cases: Cache timing, multiple calls, error conditions
- Uncovered scenarios: None - all caching logic covered
*/