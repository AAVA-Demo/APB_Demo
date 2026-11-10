/*
Test Documentation:
- Test Name: RefreshService - startPolling
- Purpose: Validates automatic KPI data refresh polling
- Scenario: User dashboard initiates polling for real-time updates
- Expected Result: Polling interval starts and calls callback with updated data
*/
/*
Test Documentation:
- Test Name: RefreshService - stopPolling
- Purpose: Validates polling cleanup when user leaves dashboard
- Scenario: User navigates away from dashboard
- Expected Result: Polling interval is cancelled
*/
/*
Test Documentation:
- Test Name: RefreshService - polling frequency
- Purpose: Validates polling occurs at correct 5-minute interval
- Scenario: Polling is active
- Expected Result: KPI service called every 300000ms (5 minutes)
*/
/*
Coverage Report:
- Functions tested: startPolling, stopPolling
- Scenarios covered: start polling, stop polling, callback execution, interval management
- Uncovered scenarios: error during polling, concurrent polling sessions
*/

describe('RefreshService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var RefreshService, $interval, KPIService, AuthService, $q, $rootScope;
  
  beforeEach(inject(function(_RefreshService_, _$interval_, _KPIService_, _AuthService_, _$q_, _$rootScope_) {
    RefreshService = _RefreshService_;
    $interval = _$interval_;
    KPIService = _KPIService_;
    AuthService = _AuthService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  afterEach(function() {
    RefreshService.stopPolling();
  });
  
  describe('startPolling', function() {
    it('should start polling and call callback with KPI data', function() {
      var userId = 'user123';
      var mockKPIData = {
        monthlySpend: 2500,
        totalCreditLimit: 25000,
        availableCredit: 18000,
        outstandingAmount: 7000
      };
      var callbackData = null;
      
      spyOn(AuthService, 'getUserId').and.returnValue(userId);
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(mockKPIData));
      
      var callback = jasmine.createSpy('callback').and.callFake(function(data) {
        callbackData = data;
      });
      
      RefreshService.startPolling(callback);
      
      $interval.flush(300000); // Flush 5 minutes
      $rootScope.$apply();
      
      expect(AuthService.getUserId).toHaveBeenCalled();
      expect(KPIService.getKPIs).toHaveBeenCalledWith(userId);
      expect(callback).toHaveBeenCalledWith(mockKPIData);
      expect(callbackData).toEqual(mockKPIData);
    });
    
    it('should not start multiple polling intervals', function() {
      var userId = 'user123';
      var mockKPIData = { monthlySpend: 2500 };
      
      spyOn(AuthService, 'getUserId').and.returnValue(userId);
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(mockKPIData));
      
      var callback = jasmine.createSpy('callback');
      
      RefreshService.startPolling(callback);
      RefreshService.startPolling(callback); // Try to start again
      
      $interval.flush(300000);
      $rootScope.$apply();
      
      expect(KPIService.getKPIs).toHaveBeenCalledTimes(1);
    });
    
    it('should not call KPIService when userId is not available', function() {
      spyOn(AuthService, 'getUserId').and.returnValue(null);
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve({}));
      
      var callback = jasmine.createSpy('callback');
      
      RefreshService.startPolling(callback);
      
      $interval.flush(300000);
      $rootScope.$apply();
      
      expect(KPIService.getKPIs).not.toHaveBeenCalled();
      expect(callback).not.toHaveBeenCalled();
    });
    
    it('should continue polling after first interval', function() {
      var userId = 'user123';
      var mockKPIData = { monthlySpend: 2500 };
      
      spyOn(AuthService, 'getUserId').and.returnValue(userId);
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(mockKPIData));
      
      var callback = jasmine.createSpy('callback');
      
      RefreshService.startPolling(callback);
      
      $interval.flush(300000); // First interval
      $rootScope.$apply();
      expect(KPIService.getKPIs).toHaveBeenCalledTimes(1);
      
      $interval.flush(300000); // Second interval
      $rootScope.$apply();
      expect(KPIService.getKPIs).toHaveBeenCalledTimes(2);
    });
    
    it('should work without callback', function() {
      var userId = 'user123';
      var mockKPIData = { monthlySpend: 2500 };
      
      spyOn(AuthService, 'getUserId').and.returnValue(userId);
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(mockKPIData));
      
      RefreshService.startPolling();
      
      $interval.flush(300000);
      $rootScope.$apply();
      
      expect(KPIService.getKPIs).toHaveBeenCalledWith(userId);
    });
  });
  
  describe('stopPolling', function() {
    it('should cancel polling interval', function() {
      var userId = 'user123';
      var mockKPIData = { monthlySpend: 2500 };
      
      spyOn(AuthService, 'getUserId').and.returnValue(userId);
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(mockKPIData));
      
      var callback = jasmine.createSpy('callback');
      
      RefreshService.startPolling(callback);
      RefreshService.stopPolling();
      
      $interval.flush(300000);
      $rootScope.$apply();
      
      expect(KPIService.getKPIs).not.toHaveBeenCalled();
    });
    
    it('should handle stopPolling when no polling is active', function() {
      expect(function() {
        RefreshService.stopPolling();
      }).not.toThrow();
    });
    
    it('should allow restarting polling after stop', function() {
      var userId = 'user123';
      var mockKPIData = { monthlySpend: 2500 };
      
      spyOn(AuthService, 'getUserId').and.returnValue(userId);
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(mockKPIData));
      
      var callback = jasmine.createSpy('callback');
      
      RefreshService.startPolling(callback);
      RefreshService.stopPolling();
      RefreshService.startPolling(callback);
      
      $interval.flush(300000);
      $rootScope.$apply();
      
      expect(KPIService.getKPIs).toHaveBeenCalledTimes(1);
    });
  });
});