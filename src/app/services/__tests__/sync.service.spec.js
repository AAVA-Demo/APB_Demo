/*
Test Documentation:
- Test Name: SyncService - startSync
- Purpose: Validates automatic transaction data synchronization
- Scenario: Transaction list view initiates sync for real-time updates
- Expected Result: Sync interval starts and calls callback with updated transactions
*/
/*
Test Documentation:
- Test Name: SyncService - stopSync
- Purpose: Validates sync cleanup when user leaves transaction view
- Scenario: User navigates away from transactions
- Expected Result: Sync interval is cancelled
*/
/*
Test Documentation:
- Test Name: SyncService - sync frequency
- Purpose: Validates sync occurs at correct 1-minute interval
- Scenario: Sync is active
- Expected Result: Transaction service called every 60000ms (1 minute)
*/
/*
Coverage Report:
- Functions tested: startSync, stopSync
- Scenarios covered: start sync, stop sync, callback execution, interval management
- Uncovered scenarios: error during sync, concurrent sync sessions
*/

describe('SyncService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var SyncService, $interval, TransactionService, $q, $rootScope;
  
  beforeEach(inject(function(_SyncService_, _$interval_, _TransactionService_, _$q_, _$rootScope_) {
    SyncService = _SyncService_;
    $interval = _$interval_;
    TransactionService = _TransactionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  afterEach(function() {
    SyncService.stopSync();
  });
  
  describe('startSync', function() {
    it('should start sync and call callback with transaction data', function() {
      var mockTransactionData = {
        transactions: [
          { id: 'txn1', merchant: 'Amazon', amount: 150 },
          { id: 'txn2', merchant: 'Starbucks', amount: 25 }
        ],
        total: 2
      };
      var callbackData = null;
      
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
      
      var callback = jasmine.createSpy('callback').and.callFake(function(data) {
        callbackData = data;
      });
      
      SyncService.startSync(callback);
      
      $interval.flush(60000); // Flush 1 minute
      $rootScope.$apply();
      
      expect(TransactionService.getTransactions).toHaveBeenCalledWith({});
      expect(callback).toHaveBeenCalledWith(mockTransactionData);
      expect(callbackData).toEqual(mockTransactionData);
    });
    
    it('should not start multiple sync intervals', function() {
      var mockTransactionData = { transactions: [], total: 0 };
      
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
      
      var callback = jasmine.createSpy('callback');
      
      SyncService.startSync(callback);
      SyncService.startSync(callback); // Try to start again
      
      $interval.flush(60000);
      $rootScope.$apply();
      
      expect(TransactionService.getTransactions).toHaveBeenCalledTimes(1);
    });
    
    it('should continue syncing after first interval', function() {
      var mockTransactionData = { transactions: [], total: 0 };
      
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
      
      var callback = jasmine.createSpy('callback');
      
      SyncService.startSync(callback);
      
      $interval.flush(60000); // First interval
      $rootScope.$apply();
      expect(TransactionService.getTransactions).toHaveBeenCalledTimes(1);
      
      $interval.flush(60000); // Second interval
      $rootScope.$apply();
      expect(TransactionService.getTransactions).toHaveBeenCalledTimes(2);
    });
    
    it('should work without callback', function() {
      var mockTransactionData = { transactions: [], total: 0 };
      
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
      
      SyncService.startSync();
      
      $interval.flush(60000);
      $rootScope.$apply();
      
      expect(TransactionService.getTransactions).toHaveBeenCalledWith({});
    });
    
    it('should handle empty transaction data', function() {
      var mockTransactionData = { transactions: [], total: 0 };
      
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
      
      var callback = jasmine.createSpy('callback');
      
      SyncService.startSync(callback);
      
      $interval.flush(60000);
      $rootScope.$apply();
      
      expect(callback).toHaveBeenCalledWith(mockTransactionData);
    });
  });
  
  describe('stopSync', function() {
    it('should cancel sync interval', function() {
      var mockTransactionData = { transactions: [], total: 0 };
      
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
      
      var callback = jasmine.createSpy('callback');
      
      SyncService.startSync(callback);
      SyncService.stopSync();
      
      $interval.flush(60000);
      $rootScope.$apply();
      
      expect(TransactionService.getTransactions).not.toHaveBeenCalled();
    });
    
    it('should handle stopSync when no sync is active', function() {
      expect(function() {
        SyncService.stopSync();
      }).not.toThrow();
    });
    
    it('should allow restarting sync after stop', function() {
      var mockTransactionData = { transactions: [], total: 0 };
      
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
      
      var callback = jasmine.createSpy('callback');
      
      SyncService.startSync(callback);
      SyncService.stopSync();
      SyncService.startSync(callback);
      
      $interval.flush(60000);
      $rootScope.$apply();
      
      expect(TransactionService.getTransactions).toHaveBeenCalledTimes(1);
    });
  });
});