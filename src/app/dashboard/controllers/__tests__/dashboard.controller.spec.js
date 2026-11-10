/*
Test Documentation:
- Test Name: dashboardController - initialization
- Purpose: Validates that dashboardController initializes correctly and loads dashboard data
- Scenario: When controller is instantiated, it should load KPIs and set loading state
- Expected Result: Controller loads card data, calculates KPIs, and sets loading to false
*/
/*
Test Documentation:
- Test Name: dashboardController - loadDashboard
- Purpose: Validates that loadDashboard retrieves card data and calculates KPIs
- Scenario: When loadDashboard is called, it should fetch cards and compute KPIs
- Expected Result: KPIs are populated with correct values from card data
*/
/*
Test Documentation:
- Test Name: dashboardController - auto-refresh
- Purpose: Validates that auto-refresh is started and stopped correctly
- Scenario: When controller initializes, auto-refresh should start; on destroy, it should stop
- Expected Result: Refresh interval is created on init and cancelled on scope destroy
*/
/*
Coverage Report:
- Controller tested: dashboardController
- Scenarios covered: initialization, data loading, KPI calculation, auto-refresh lifecycle, error handling
- Edge cases: loading state, error handling, scope destruction, interval management
- Uncovered scenarios: none
*/

describe('dashboardController', function() {
  'use strict';
  
  beforeEach(module('dashboardModule'));
  beforeEach(module('creditCardApp'));
  
  var $controller;
  var $rootScope;
  var $scope;
  var $q;
  var dashboardService;
  var kpiCalculationService;
  var refreshFactory;
  var controller;
  
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _dashboardService_, _kpiCalculationService_, _refreshFactory_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $q = _$q_;
    dashboardService = _dashboardService_;
    kpiCalculationService = _kpiCalculationService_;
    refreshFactory = _refreshFactory_;
  }));
  
  describe('controller initialization', function() {
    it('should be defined', function() {
      controller = $controller('dashboardController', {
        $scope: $scope,
        dashboardService: dashboardService,
        kpiCalculationService: kpiCalculationService,
        refreshFactory: refreshFactory
      });
      expect(controller).toBeDefined();
    });
    
    it('should initialize with empty kpis object', function() {
      controller = $controller('dashboardController', {
        $scope: $scope,
        dashboardService: dashboardService,
        kpiCalculationService: kpiCalculationService,
        refreshFactory: refreshFactory
      });
      expect(controller.kpis).toBeDefined();
      expect(typeof controller.kpis).toBe('object');
    });
    
    it('should set loading to true initially', function() {
      controller = $controller('dashboardController', {
        $scope: $scope,
        dashboardService: dashboardService,
        kpiCalculationService: kpiCalculationService,
        refreshFactory: refreshFactory
      });
      expect(controller.loading).toBe(true);
    });
    
    it('should call loadDashboard on initialization', function() {
      spyOn(dashboardService, 'getCardData').and.returnValue($q.resolve([]));
      controller = $controller('dashboardController', {
        $scope: $scope,
        dashboardService: dashboardService,
        kpiCalculationService: kpiCalculationService,
        refreshFactory: refreshFactory
      });
      $rootScope.$digest();
      expect(dashboardService.getCardData).toHaveBeenCalled();
    });
  });
  
  describe('loadDashboard function', function() {
    beforeEach(function() {
      controller = $controller('dashboardController', {
        $scope: $scope,
        dashboardService: dashboardService,
        kpiCalculationService: kpiCalculationService,
        refreshFactory: refreshFactory
      });
    });
    
    it('should be defined', function() {
      expect(controller.loadDashboard).toBeDefined();
      expect(typeof controller.loadDashboard).toBe('function');
    });
    
    it('should call dashboardService.getCardData', function() {
      spyOn(dashboardService, 'getCardData').and.returnValue($q.resolve([]));
      controller.loadDashboard();
      expect(dashboardService.getCardData).toHaveBeenCalled();
    });
    
    it('should call kpiCalculationService.calculateKPIs with card data', function() {
      var mockCards = [
        {totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000, monthlySpend: 8500}
      ];
      spyOn(dashboardService, 'getCardData').and.returnValue($q.resolve(mockCards));
      spyOn(kpiCalculationService, 'calculateKPIs').and.callThrough();
      
      controller.loadDashboard();
      $rootScope.$digest();
      
      expect(kpiCalculationService.calculateKPIs).toHaveBeenCalledWith(mockCards);
    });
    
    it('should set kpis with calculated values', function() {
      var mockCards = [
        {totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000, monthlySpend: 8500}
      ];
      var mockKpis = {
        totalCreditLimit: 50000,
        totalOutstanding: 15000,
        totalAvailableCredit: 35000,
        totalMonthlySpend: 8500,
        cardCount: 1
      };
      spyOn(dashboardService, 'getCardData').and.returnValue($q.resolve(mockCards));
      spyOn(kpiCalculationService, 'calculateKPIs').and.returnValue(mockKpis);
      
      controller.loadDashboard();
      $rootScope.$digest();
      
      expect(controller.kpis).toEqual(mockKpis);
    });
    
    it('should set loading to false after successful load', function() {
      spyOn(dashboardService, 'getCardData').and.returnValue($q.resolve([]));
      controller.loadDashboard();
      $rootScope.$digest();
      expect(controller.loading).toBe(false);
    });
    
    it('should handle errors gracefully', function() {
      spyOn(dashboardService, 'getCardData').and.returnValue($q.reject('Error'));
      spyOn(console, 'error');
      
      controller.loadDashboard();
      $rootScope.$digest();
      
      expect(console.error).toHaveBeenCalledWith('Error loading dashboard:', 'Error');
      expect(controller.loading).toBe(false);
    });
    
    it('should set loading to true when called', function() {
      spyOn(dashboardService, 'getCardData').and.returnValue($q.resolve([]));
      controller.loading = false;
      controller.loadDashboard();
      expect(controller.loading).toBe(true);
    });
  });
  
  describe('auto-refresh functionality', function() {
    it('should start auto-refresh on initialization', function() {
      spyOn(refreshFactory, 'startAutoRefresh').and.returnValue('mock-promise');
      controller = $controller('dashboardController', {
        $scope: $scope,
        dashboardService: dashboardService,
        kpiCalculationService: kpiCalculationService,
        refreshFactory: refreshFactory
      });
      $rootScope.$digest();
      expect(refreshFactory.startAutoRefresh).toHaveBeenCalled();
    });
    
    it('should call startAutoRefresh with loadDashboard and 300000ms interval', function() {
      spyOn(refreshFactory, 'startAutoRefresh').and.returnValue('mock-promise');
      controller = $controller('dashboardController', {
        $scope: $scope,
        dashboardService: dashboardService,
        kpiCalculationService: kpiCalculationService,
        refreshFactory: refreshFactory
      });
      $rootScope.$digest();
      expect(refreshFactory.startAutoRefresh).toHaveBeenCalledWith(jasmine.any(Function), 300000);
    });
    
    it('should stop auto-refresh on scope destroy', function() {
      spyOn(refreshFactory, 'startAutoRefresh').and.returnValue('mock-promise');
      spyOn(refreshFactory, 'stopAutoRefresh');
      
      controller = $controller('dashboardController', {
        $scope: $scope,
        dashboardService: dashboardService,
        kpiCalculationService: kpiCalculationService,
        refreshFactory: refreshFactory
      });
      $rootScope.$digest();
      
      $scope.$destroy();
      
      expect(refreshFactory.stopAutoRefresh).toHaveBeenCalledWith('mock-promise');
    });
  });
  
  describe('integration', function() {
    it('should load and display KPIs on initialization', function() {
      var mockCards = [
        {totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000, monthlySpend: 8500},
        {totalLimit: 30000, outstandingBalance: 8000, availableCredit: 22000, monthlySpend: 4200}
      ];
      spyOn(dashboardService, 'getCardData').and.returnValue($q.resolve(mockCards));
      
      controller = $controller('dashboardController', {
        $scope: $scope,
        dashboardService: dashboardService,
        kpiCalculationService: kpiCalculationService,
        refreshFactory: refreshFactory
      });
      $rootScope.$digest();
      
      expect(controller.kpis.totalCreditLimit).toBe(80000);
      expect(controller.kpis.totalOutstanding).toBe(23000);
      expect(controller.kpis.totalAvailableCredit).toBe(57000);
      expect(controller.kpis.totalMonthlySpend).toBe(12700);
      expect(controller.kpis.cardCount).toBe(2);
      expect(controller.loading).toBe(false);
    });
  });
});