/*
Test Documentation:
- Test Name: DataRefreshService - startRefresh
- Purpose: Validates that refresh interval is started and callback is invoked
- Scenario: Start refresh with callback function
- Expected Result: Interval is created and callback receives KPI data
*/
/*
Test Documentation:
- Test Name: DataRefreshService - stopRefresh
- Purpose: Validates that refresh interval is stopped
- Scenario: Stop active refresh interval
- Expected Result: Interval is cancelled
*/
/*
Test Documentation:
- Test Name: DataRefreshService - startRefresh cancels existing
- Purpose: Validates that starting new refresh cancels existing interval
- Scenario: Start refresh twice
- Expected Result: Only one interval is active
*/
/*
Coverage Report:
- Functions tested: startRefresh, stopRefresh
- Scenarios covered: start refresh, stop refresh, cancel existing interval, callback invocation
- Uncovered scenarios: none
*/

describe('DataRefreshService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var DataRefreshService;
  var $interval;
  var $rootScope;
  var KPICalculationService;
  var $q;
  
  beforeEach(inject(function(_DataRefreshService_, _$interval_, _$rootScope_, _KPICalculationService_, _$q_) {
    DataRefreshService = _DataRefreshService_;
    $interval = _$interval_;
    $rootScope = _$rootScope_;
    KPICalculationService = _KPICalculationService_;
    $q = _$q_;
  }));
  
  describe('startRefresh', function() {
    it('should start refresh interval and invoke callback', function() {
      var mockKPIs = {monthlySpend: 1000, totalCreditLimit: 50000};
      spyOn(KPICalculationService, 'calculateKPIs').and.returnValue($q.resolve(mockKPIs));
      
      var callbackData;
      var callback = jasmine.createSpy('callback').and.callFake(function(data) {
        callbackData = data;
      });
      
      var interval = DataRefreshService.startRefresh(callback);
      
      expect(interval).toBeDefined();
      
      $interval.flush(30000);
      $rootScope.$digest();
      
      expect(KPICalculationService.calculateKPIs).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(mockKPIs);
      expect(callbackData).toEqual(mockKPIs);
    });
    
    it('should cancel existing interval when starting new one', function() {
      spyOn(KPICalculationService, 'calculateKPIs').and.returnValue($q.resolve({}));
      spyOn($interval, 'cancel').and.callThrough();
      
      var firstInterval = DataRefreshService.startRefresh(function() {});
      var secondInterval = DataRefreshService.startRefresh(function() {});
      
      expect($interval.cancel).toHaveBeenCalledWith(firstInterval);
    });
    
    it('should handle callback being undefined', function() {
      var mockKPIs = {monthlySpend: 1000};
      spyOn(KPICalculationService, 'calculateKPIs').and.returnValue($q.resolve(mockKPIs));
      
      expect(function() {
        DataRefreshService.startRefresh();
        $interval.flush(30000);
        $rootScope.$digest();
      }).not.toThrow();
    });
  });
  
  describe('stopRefresh', function() {
    it('should stop active refresh interval', function() {
      spyOn(KPICalculationService, 'calculateKPIs').and.returnValue($q.resolve({}));
      spyOn($interval, 'cancel').and.callThrough();
      
      var interval = DataRefreshService.startRefresh(function() {});
      DataRefreshService.stopRefresh();
      
      expect($interval.cancel).toHaveBeenCalledWith(interval);
    });
    
    it('should handle stopping when no interval is active', function() {
      expect(function() {
        DataRefreshService.stopRefresh();
      }).not.toThrow();
    });
  });
});