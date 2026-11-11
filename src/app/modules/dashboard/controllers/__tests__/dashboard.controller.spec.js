/*
Test Documentation:
- Test Name: DashboardController - Dashboard Data Loading and Display
- Purpose: Validate dashboard controller initialization, data loading, and utility functions
- Scenario: Test loadDashboardData, getUtilizationClass, getAvailableCreditClass
- Expected Result: Dashboard loads KPIs and card summaries, utility functions return correct CSS classes
*/

describe('DashboardController', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  beforeEach(module('app.dashboard'));
  
  var $controller, $q, $rootScope, KPIService, CardSummaryService, RefreshService;
  var mockKPIData = {
    monthlySpend: 1500,
    totalCreditLimit: 10000,
    availableCredit: 7500,
    outstandingAmount: 2500
  };
  var mockCardSummaries = [
    {cardName: 'Visa', currentBalance: 1000, creditLimit: 5000, utilizationPercentage: 20}
  ];
  
  beforeEach(inject(function(_$controller_, _$q_, _$rootScope_, _KPIService_, _CardSummaryService_, _RefreshService_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    KPIService = _KPIService_;
    CardSummaryService = _CardSummaryService_;
    RefreshService = _RefreshService_;
  }));
  
  afterEach(function() {
    RefreshService.stopRefresh();
  });
  
  describe('initialization', function() {
    it('should load dashboard data on initialization', function() {
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(mockKPIData));
      spyOn(CardSummaryService, 'getCardSummaries').and.returnValue($q.resolve(mockCardSummaries));
      spyOn(RefreshService, 'startRefresh');
      
      var $scope = $rootScope.$new();
      var controller = $controller('DashboardController', {
        $scope: $scope,
        KPIService: KPIService,
        CardSummaryService: CardSummaryService,
        RefreshService: RefreshService
      });
      
      expect(controller.loading).toBe(true);
      $rootScope.$apply();
      
      expect(controller.kpis).toEqual(mockKPIData);
      expect(controller.cardSummaries).toEqual(mockCardSummaries);
      expect(controller.loading).toBe(false);
      expect(controller.lastUpdated).toBeDefined();
    });
    
    it('should handle error during data loading', function() {
      spyOn(KPIService, 'getKPIs').and.returnValue($q.reject({error: 'Failed'}));
      spyOn(CardSummaryService, 'getCardSummaries').and.returnValue($q.resolve(mockCardSummaries));
      
      var $scope = $rootScope.$new();
      var controller = $controller('DashboardController', {
        $scope: $scope,
        KPIService: KPIService,
        CardSummaryService: CardSummaryService,
        RefreshService: RefreshService
      });
      
      $rootScope.$apply();
      
      expect(controller.error).toBe('Failed to load dashboard data. Please try again.');
      expect(controller.loading).toBe(false);
    });
    
    it('should start auto-refresh on initialization', function() {
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(mockKPIData));
      spyOn(CardSummaryService, 'getCardSummaries').and.returnValue($q.resolve(mockCardSummaries));
      spyOn(RefreshService, 'startRefresh');
      
      var $scope = $rootScope.$new();
      var controller = $controller('DashboardController', {
        $scope: $scope,
        KPIService: KPIService,
        CardSummaryService: CardSummaryService,
        RefreshService: RefreshService
      });
      
      $rootScope.$apply();
      expect(RefreshService.startRefresh).toHaveBeenCalled();
    });
  });
  
  describe('getUtilizationClass', function() {
    it('should return danger for utilization >= 80%', function() {
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(mockKPIData));
      spyOn(CardSummaryService, 'getCardSummaries').and.returnValue($q.resolve(mockCardSummaries));
      
      var $scope = $rootScope.$new();
      var controller = $controller('DashboardController', {
        $scope: $scope,
        KPIService: KPIService,
        CardSummaryService: CardSummaryService,
        RefreshService: RefreshService
      });
      
      expect(controller.getUtilizationClass(85)).toBe('danger');
      expect(controller.getUtilizationClass(80)).toBe('danger');
    });
    
    it('should return warning for utilization >= 60% and < 80%', function() {
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(mockKPIData));
      spyOn(CardSummaryService, 'getCardSummaries').and.returnValue($q.resolve(mockCardSummaries));
      
      var $scope = $rootScope.$new();
      var controller = $controller('DashboardController', {
        $scope: $scope,
        KPIService: KPIService,
        CardSummaryService: CardSummaryService,
        RefreshService: RefreshService
      });
      
      expect(controller.getUtilizationClass(70)).toBe('warning');
      expect(controller.getUtilizationClass(60)).toBe('warning');
    });
    
    it('should return empty string for utilization < 60%', function() {
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(mockKPIData));
      spyOn(CardSummaryService, 'getCardSummaries').and.returnValue($q.resolve(mockCardSummaries));
      
      var $scope = $rootScope.$new();
      var controller = $controller('DashboardController', {
        $scope: $scope,
        KPIService: KPIService,
        CardSummaryService: CardSummaryService,
        RefreshService: RefreshService
      });
      
      expect(controller.getUtilizationClass(50)).toBe('');
      expect(controller.getUtilizationClass(0)).toBe('');
    });
  });
  
  describe('getAvailableCreditClass', function() {
    it('should return danger when utilization >= 80%', function() {
      var highUtilizationKPIs = {
        monthlySpend: 1500,
        totalCreditLimit: 10000,
        availableCredit: 1500,
        outstandingAmount: 8500
      };
      
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(highUtilizationKPIs));
      spyOn(CardSummaryService, 'getCardSummaries').and.returnValue($q.resolve(mockCardSummaries));
      
      var $scope = $rootScope.$new();
      var controller = $controller('DashboardController', {
        $scope: $scope,
        KPIService: KPIService,
        CardSummaryService: CardSummaryService,
        RefreshService: RefreshService
      });
      
      $rootScope.$apply();
      expect(controller.getAvailableCreditClass()).toBe('danger');
    });
    
    it('should return warning when utilization >= 60% and < 80%', function() {
      var mediumUtilizationKPIs = {
        monthlySpend: 1500,
        totalCreditLimit: 10000,
        availableCredit: 3500,
        outstandingAmount: 6500
      };
      
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(mediumUtilizationKPIs));
      spyOn(CardSummaryService, 'getCardSummaries').and.returnValue($q.resolve(mockCardSummaries));
      
      var $scope = $rootScope.$new();
      var controller = $controller('DashboardController', {
        $scope: $scope,
        KPIService: KPIService,
        CardSummaryService: CardSummaryService,
        RefreshService: RefreshService
      });
      
      $rootScope.$apply();
      expect(controller.getAvailableCreditClass()).toBe('warning');
    });
    
    it('should return empty string when utilization < 60%', function() {
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(mockKPIData));
      spyOn(CardSummaryService, 'getCardSummaries').and.returnValue($q.resolve(mockCardSummaries));
      
      var $scope = $rootScope.$new();
      var controller = $controller('DashboardController', {
        $scope: $scope,
        KPIService: KPIService,
        CardSummaryService: CardSummaryService,
        RefreshService: RefreshService
      });
      
      $rootScope.$apply();
      expect(controller.getAvailableCreditClass()).toBe('');
    });
    
    it('should return empty string when kpis is null', function() {
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(mockKPIData));
      spyOn(CardSummaryService, 'getCardSummaries').and.returnValue($q.resolve(mockCardSummaries));
      
      var $scope = $rootScope.$new();
      var controller = $controller('DashboardController', {
        $scope: $scope,
        KPIService: KPIService,
        CardSummaryService: CardSummaryService,
        RefreshService: RefreshService
      });
      
      controller.kpis = null;
      expect(controller.getAvailableCreditClass()).toBe('');
    });
  });
  
  describe('scope destruction', function() {
    it('should stop refresh on scope destroy', function() {
      spyOn(KPIService, 'getKPIs').and.returnValue($q.resolve(mockKPIData));
      spyOn(CardSummaryService, 'getCardSummaries').and.returnValue($q.resolve(mockCardSummaries));
      spyOn(RefreshService, 'stopRefresh');
      
      var $scope = $rootScope.$new();
      var controller = $controller('DashboardController', {
        $scope: $scope,
        KPIService: KPIService,
        CardSummaryService: CardSummaryService,
        RefreshService: RefreshService
      });
      
      $scope.$destroy();
      expect(RefreshService.stopRefresh).toHaveBeenCalled();
    });
  });
});

/*
Coverage Report:
- Functions tested: initialization, loadDashboardData, getUtilizationClass, getAvailableCreditClass, scope destruction
- Scenarios covered: successful data load, error handling, auto-refresh, utilization class calculation, scope cleanup
- Edge cases: null KPIs, high/medium/low utilization, API errors
- Uncovered scenarios: none
*/