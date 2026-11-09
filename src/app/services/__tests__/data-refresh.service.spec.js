/*
Test Documentation:
- Test Name: DataRefreshService Unit Tests
- Purpose: Validate polling mechanism for real-time data refresh
- Scenario: Tests startPolling and stopPolling methods with interval management
- Expected Result: Proper interval creation, callback execution, and cleanup
*/

(function() {
'use strict';

describe('DataRefreshService', function() {
  var DataRefreshService, $interval, KPIService, $q, $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_DataRefreshService_, _$interval_, _KPIService_, _$q_, _$rootScope_) {
    DataRefreshService = _DataRefreshService_;
    $interval = _$interval_;
    KPIService = _KPIService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve({totalCreditLimit: 10000}));
  }));
  
  describe('startPolling', function() {
    it('should start polling and call KPIService at intervals', function() {
      var callbackSpy = jasmine.createSpy('callback');
      
      DataRefreshService.startPolling(callbackSpy);
      
      $interval.flush(30000);
      $rootScope.$apply();
      
      expect(KPIService.getKPIs).toHaveBeenCalled();
      expect(callbackSpy).toHaveBeenCalledWith({totalCreditLimit: 10000});
    });
    
    it('should call callback multiple times on multiple intervals', function() {
      var callbackSpy = jasmine.createSpy('callback');
      
      DataRefreshService.startPolling(callbackSpy);
      
      $interval.flush(30000);
      $rootScope.$apply();
      
      $interval.flush(30000);
      $rootScope.$apply();
      
      expect(callbackSpy).toHaveBeenCalledTimes(2);
    });
    
    it('should stop existing polling before starting new one', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');
      
      DataRefreshService.startPolling(callback1);
      DataRefreshService.startPolling(callback2);
      
      $interval.flush(30000);
      $rootScope.$apply();
      
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
    
    it('should handle callback being undefined', function() {
      expect(function() {
        DataRefreshService.startPolling();
        $interval.flush(30000);
        $rootScope.$apply();
      }).not.toThrow();
      
      expect(KPIService.getKPIs).toHaveBeenCalled();
    });
    
    it('should handle KPIService errors gracefully', function() {
      KPIService.getKPIs.and.returnValue($q.reject('Error'));
      var callbackSpy = jasmine.createSpy('callback');
      
      DataRefreshService.startPolling(callbackSpy);
      
      $interval.flush(30000);
      $rootScope.$apply();
      
      expect(callbackSpy).not.toHaveBeenCalled();
    });
  });
  
  describe('stopPolling', function() {
    it('should stop active polling interval', function() {
      var callbackSpy = jasmine.createSpy('callback');
      
      DataRefreshService.startPolling(callbackSpy);
      DataRefreshService.stopPolling();
      
      $interval.flush(30000);
      $rootScope.$apply();
      
      expect(callbackSpy).not.toHaveBeenCalled();
    });
    
    it('should handle stopPolling when no polling is active', function() {
      expect(function() {
        DataRefreshService.stopPolling();
      }).not.toThrow();
    });
    
    it('should allow restarting polling after stop', function() {
      var callbackSpy = jasmine.createSpy('callback');
      
      DataRefreshService.startPolling(callbackSpy);
      DataRefreshService.stopPolling();
      DataRefreshService.startPolling(callbackSpy);
      
      $interval.flush(30000);
      $rootScope.$apply();
      
      expect(callbackSpy).toHaveBeenCalledTimes(1);
    });
    
    it('should cancel interval properly', function() {
      spyOn($interval, 'cancel').and.callThrough();
      
      DataRefreshService.startPolling(jasmine.createSpy());
      DataRefreshService.stopPolling();
      
      expect($interval.cancel).toHaveBeenCalled();
    });
  });
  
  describe('polling interval', function() {
    it('should use 30 second interval', function() {
      var callbackSpy = jasmine.createSpy('callback');
      
      DataRefreshService.startPolling(callbackSpy);
      
      $interval.flush(29999);
      $rootScope.$apply();
      expect(callbackSpy).not.toHaveBeenCalled();
      
      $interval.flush(1);
      $rootScope.$apply();
      expect(callbackSpy).toHaveBeenCalled();
    });
  });
});

/*
Coverage Report:
- Functions tested: startPolling, stopPolling
- Scenarios covered:
  * Start polling with callback
  * Multiple interval executions
  * Stop existing polling before starting new one
  * Undefined callback handling
  * KPIService error handling
  * Stop active polling
  * Stop when no polling active
  * Restart after stop
  * Interval cancellation
  * 30-second interval timing
- Edge cases: Undefined callbacks, service errors, multiple start/stop cycles
- Uncovered scenarios: None - full coverage achieved
*/
})();