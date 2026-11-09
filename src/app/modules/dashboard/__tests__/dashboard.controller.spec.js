/*
Test Documentation:
- Test Name: DashboardController
- Purpose: Validate dashboard controller functionality for KPI display and credit card portfolio
- Scenario: Controller initialization, KPI loading, error handling, auto-refresh
- Expected Result: KPIs loaded correctly, errors handled, auto-refresh works
*/

describe('DashboardController', function() {
  'use strict';
  
  var controller, DashboardService, $q, $scope, $interval, $rootScope;
  var mockKPIData;
  
  beforeEach(module('creditcard.dashboard'));
  
  beforeEach(inject(function($controller, _$q_, _$rootScope_, _$interval_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $interval = _$interval_;
    
    mockKPIData = {
      totalCreditLimit: 325000,
      totalAvailableCredit: 235000,
      totalOutstandingAmount: 90000,
      totalMonthlySpend: 68000,
      cards: [
        {cardId: 'CC001', cardType: 'Visa Platinum', cardNumber: '**** 1234', creditLimit: 100000, availableCredit: 65000, outstandingAmount: 35000, monthlySpend: 28000},
        {cardId: 'CC002', cardType: 'MasterCard Gold', cardNumber: '**** 5678', creditLimit: 75000, availableCredit: 50000, outstandingAmount: 25000, monthlySpend: 18000},
        {cardId: 'CC003', cardType: 'Amex Blue', cardNumber: '**** 9012', creditLimit: 150000, availableCredit: 120000, outstandingAmount: 30000, monthlySpend: 22000}
      ]
    };
    
    DashboardService = {
      getKPIs: jasmine.createSpy('getKPIs').and.returnValue($q.resolve(mockKPIData))
    };
    
    controller = $controller('DashboardController', {
      DashboardService: DashboardService,
      $scope: $scope,
      $interval: $interval
    });
  }));
  
  describe('Controller Initialization', function() {
    it('should initialize controller with default values', function() {
      expect(controller.kpis).toEqual({});
      expect(controller.cards).toEqual([]);
      expect(controller.loading).toBe(true);
      expect(controller.error).toBe(null);
    });
    
    it('should define refreshKPIs function', function() {
      expect(controller.refreshKPIs).toBeDefined();
      expect(typeof controller.refreshKPIs).toBe('function');
    });
    
    it('should call refreshKPIs on activation', function() {
      expect(DashboardService.getKPIs).toHaveBeenCalled();
    });
  });
  
  describe('KPI Loading - Success Scenario', function() {
    it('should load KPIs successfully', function() {
      $rootScope.$digest();
      expect(controller.kpis).toEqual(mockKPIData);
      expect(controller.cards).toEqual(mockKPIData.cards);
      expect(controller.loading).toBe(false);
      expect(controller.error).toBe(null);
    });
    
    it('should set loading to true before fetching data', function() {
      controller.loading = false;
      controller.refreshKPIs();
      expect(controller.loading).toBe(true);
    });
    
    it('should clear previous error on refresh', function() {
      controller.error = 'Previous error';
      controller.refreshKPIs();
      expect(controller.error).toBe(null);
    });
  });
  
  describe('KPI Loading - Error Scenario', function() {
    beforeEach(function() {
      DashboardService.getKPIs.and.returnValue($q.reject('Service error'));
    });
    
    it('should handle error when KPI loading fails', function() {
      controller.refreshKPIs();
      $rootScope.$digest();
      expect(controller.error).toBe('Failed to load dashboard data. Please try again.');
      expect(controller.loading).toBe(false);
    });
    
    it('should not update KPIs on error', function() {
      var originalKPIs = angular.copy(controller.kpis);
      controller.refreshKPIs();
      $rootScope.$digest();
      expect(controller.kpis).toEqual(originalKPIs);
    });
  });
  
  describe('Auto-refresh Functionality', function() {
    it('should setup interval for auto-refresh', function() {
      spyOn($interval, 'cancel');
      var intervalSpy = spyOn($interval, 'call').and.callThrough();
      
      inject(function($controller) {
        controller = $controller('DashboardController', {
          DashboardService: DashboardService,
          $scope: $scope,
          $interval: $interval
        });
      });
      
      expect($interval).toHaveBeenCalled();
    });
    
    it('should refresh KPIs every 30 seconds', function() {
      DashboardService.getKPIs.calls.reset();
      $interval.flush(30000);
      expect(DashboardService.getKPIs).toHaveBeenCalled();
    });
    
    it('should refresh KPIs multiple times', function() {
      DashboardService.getKPIs.calls.reset();
      $interval.flush(30000);
      $interval.flush(30000);
      expect(DashboardService.getKPIs.calls.count()).toBe(2);
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle empty KPI data', function() {
      var emptyData = {
        totalCreditLimit: 0,
        totalAvailableCredit: 0,
        totalOutstandingAmount: 0,
        totalMonthlySpend: 0,
        cards: []
      };
      DashboardService.getKPIs.and.returnValue($q.resolve(emptyData));
      controller.refreshKPIs();
      $rootScope.$digest();
      expect(controller.kpis).toEqual(emptyData);
      expect(controller.cards).toEqual([]);
    });
    
    it('should handle null response', function() {
      DashboardService.getKPIs.and.returnValue($q.resolve(null));
      controller.refreshKPIs();
      $rootScope.$digest();
      expect(controller.kpis).toBe(null);
    });
    
    it('should handle single card data', function() {
      var singleCardData = {
        totalCreditLimit: 100000,
        totalAvailableCredit: 65000,
        totalOutstandingAmount: 35000,
        totalMonthlySpend: 28000,
        cards: [{cardId: 'CC001', cardType: 'Visa', creditLimit: 100000}]
      };
      DashboardService.getKPIs.and.returnValue($q.resolve(singleCardData));
      controller.refreshKPIs();
      $rootScope.$digest();
      expect(controller.cards.length).toBe(1);
    });
  });
});

/*
Coverage Report:
- Functions tested: activate, refreshKPIs
- Scenarios covered: Initialization, successful KPI loading, error handling, auto-refresh, empty data, null response, single card
- Edge cases: Empty data, null response, single card, multiple refresh cycles
- Uncovered scenarios: None
*/