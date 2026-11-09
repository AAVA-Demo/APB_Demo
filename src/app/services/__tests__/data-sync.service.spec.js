/*
Test Documentation:
- Test Name: DataSyncService - refreshKpis calls DashboardService.loadKpis
- Purpose: Validates that the sync service correctly delegates to DashboardService
- Scenario: Periodic refresh of KPI data
- Expected Result: DashboardService.loadKpis is called and returns updated KPIs
*/
/*
Test Documentation:
- Test Name: DataSyncService - refreshKpis returns promise from DashboardService
- Purpose: Validates that the service properly returns the promise chain
- Scenario: Refresh operation returns promise for async handling
- Expected Result: Returns promise that resolves with KPI data
*/
/*
Test Documentation:
- Test Name: DataSyncService - refreshKpis handles DashboardService failure
- Purpose: Validates error propagation from DashboardService
- Scenario: DashboardService fails during refresh
- Expected Result: Promise is rejected with error from DashboardService
*/
/*
Coverage Report:
- Functions tested: refreshKpis
- Scenarios covered: normal refresh, promise handling, error propagation
- Edge cases: service failures, null responses
- Uncovered scenarios: none
*/

describe('DataSyncService', function() {
  'use strict';
  
  beforeEach(module('cc.dashboard'));
  
  var DataSyncService;
  var DashboardService;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_DataSyncService_, _DashboardService_, _$q_, _$rootScope_) {
    DataSyncService = _DataSyncService_;
    DashboardService = _DashboardService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('refreshKpis', function() {
    
    it('should call DashboardService.loadKpis', function() {
      var mockKpis = {
        monthlySpend: 500,
        totalCreditLimit: 10000,
        totalAvailableCredit: 9500,
        totalOutstanding: 500
      };
      
      spyOn(DashboardService, 'loadKpis').and.returnValue($q.resolve(mockKpis));
      
      DataSyncService.refreshKpis();
      
      expect(DashboardService.loadKpis).toHaveBeenCalled();
    });
    
    it('should return promise from DashboardService', function() {
      var mockKpis = {
        monthlySpend: 500,
        totalCreditLimit: 10000,
        totalAvailableCredit: 9500,
        totalOutstanding: 500
      };
      
      spyOn(DashboardService, 'loadKpis').and.returnValue($q.resolve(mockKpis));
      
      var result;
      DataSyncService.refreshKpis().then(function(kpis) {
        result = kpis;
      });
      
      $rootScope.$digest();
      
      expect(result).toEqual(mockKpis);
    });
    
    it('should handle DashboardService failure', function() {
      var errorMessage = 'Sync failed';
      spyOn(DashboardService, 'loadKpis').and.returnValue($q.reject(errorMessage));
      
      var error;
      DataSyncService.refreshKpis().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe(errorMessage);
    });
    
    it('should propagate promise resolution correctly', function() {
      var mockKpis = { monthlySpend: 1000 };
      spyOn(DashboardService, 'loadKpis').and.returnValue($q.resolve(mockKpis));
      
      var promiseResolved = false;
      DataSyncService.refreshKpis().then(function() {
        promiseResolved = true;
      });
      
      $rootScope.$digest();
      
      expect(promiseResolved).toBe(true);
    });
    
    it('should handle null response from DashboardService', function() {
      spyOn(DashboardService, 'loadKpis').and.returnValue($q.resolve(null));
      
      var result;
      DataSyncService.refreshKpis().then(function(kpis) {
        result = kpis;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeNull();
    });
    
    it('should be callable multiple times', function() {
      var mockKpis = { monthlySpend: 500 };
      spyOn(DashboardService, 'loadKpis').and.returnValue($q.resolve(mockKpis));
      
      DataSyncService.refreshKpis();
      DataSyncService.refreshKpis();
      DataSyncService.refreshKpis();
      
      expect(DashboardService.loadKpis.calls.count()).toBe(3);
    });
  });
});