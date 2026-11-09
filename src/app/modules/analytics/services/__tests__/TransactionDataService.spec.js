/*
Test Documentation:
- Test Name: TransactionDataService Unit Tests
- Purpose: Validate transaction data retrieval for analytics
- Scenario: Test getCategoryTransactions method
- Expected Result: Service should fetch tagged transactions from API
*/

(function(){
'use strict';

describe('TransactionDataService', function() {
  var TransactionDataService, ApiService, $q, $rootScope;

  beforeEach(module('spendingAnalyticsModule'));

  beforeEach(inject(function(_TransactionDataService_, _$q_, _$rootScope_) {
    TransactionDataService = _TransactionDataService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(inject(function($injector) {
    ApiService = $injector.get('ApiService');
    spyOn(ApiService, 'getTransactions').and.callThrough();
  }));

  describe('getCategoryTransactions', function() {
    it('should call ApiService.getTransactions with tagged parameter', function() {
      var mockTransactions = [{id: 1, category: 'Food & Dining', amount: 100}];
      ApiService.getTransactions.and.returnValue($q.resolve(mockTransactions));

      TransactionDataService.getCategoryTransactions();

      expect(ApiService.getTransactions).toHaveBeenCalledWith({tagged: true});
    });

    it('should return tagged transactions', function() {
      var mockTransactions = [
        {id: 1, category: 'Food & Dining', amount: 100},
        {id: 2, category: 'Fuel', amount: 50}
      ];
      ApiService.getTransactions.and.returnValue($q.resolve(mockTransactions));

      var result;
      TransactionDataService.getCategoryTransactions().then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(result).toEqual(mockTransactions);
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: getCategoryTransactions
- Scenarios covered: API call with correct parameters, data retrieval
- Edge cases: None applicable for simple pass-through service
- Uncovered scenarios: None - service is a simple wrapper
*/