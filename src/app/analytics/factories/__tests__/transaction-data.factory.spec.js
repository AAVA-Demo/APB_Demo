/*
Test Documentation:
- Test Name: TransactionDataFactory Unit Tests
- Purpose: Validate transaction data caching functionality
- Scenario: Tests data storage, retrieval, and cache clearing
- Expected Result: Factory correctly manages cached transaction data
*/

(function() {
  'use strict';
  
  describe('TransactionDataFactory', function() {
    var TransactionDataFactory;
    
    beforeEach(module('analyticsModule'));
    
    beforeEach(inject(function(_TransactionDataFactory_) {
      TransactionDataFactory = _TransactionDataFactory_;
    }));
    
    it('should initially return null data', function() {
      var data = TransactionDataFactory.getData();
      expect(data).toBeNull();
    });
    
    it('should store and retrieve data', function() {
      var mockData = [{transactionId: 'txn1', amount: 1500}];
      TransactionDataFactory.setData(mockData);
      var retrieved = TransactionDataFactory.getData();
      expect(retrieved).toEqual(mockData);
    });
    
    it('should clear cached data', function() {
      var mockData = [{transactionId: 'txn1', amount: 1500}];
      TransactionDataFactory.setData(mockData);
      TransactionDataFactory.clearCache();
      var retrieved = TransactionDataFactory.getData();
      expect(retrieved).toBeNull();
    });
    
    it('should overwrite existing data', function() {
      var data1 = [{transactionId: 'txn1'}];
      var data2 = [{transactionId: 'txn2'}];
      TransactionDataFactory.setData(data1);
      TransactionDataFactory.setData(data2);
      var retrieved = TransactionDataFactory.getData();
      expect(retrieved).toEqual(data2);
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: setData, getData, clearCache
- Scenarios covered:
  * Initial null state
  * Data storage and retrieval
  * Cache clearing
  * Data overwriting
- Uncovered scenarios: Cache expiration, memory limits
*/