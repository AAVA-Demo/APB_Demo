/*
Test Documentation:
- Test Name: DashboardController initialization and KPI loading
- Purpose: Validates controller initialization, KPI data loading, and auto-refresh
- Scenario: Test successful KPI loading, error handling, manual refresh, and auto-refresh cleanup
- Expected Result: Controller should load KPIs, handle errors, and manage refresh intervals
*/
/*
Coverage Report:
- Functions tested: init, loadKPIs, refreshKPIs
- Scenarios covered: successful load, error handling, manual refresh, auto-refresh, cleanup
- Dependencies mocked: KPIService, DashboardRefreshFactory
- Uncovered scenarios: none
*/

describe('DashboardController', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var controller, $q, $rootScope, $scope;
  var KPIService, DashboardRefreshFactory;
  var mockKPIData;
  
  beforeEach(inject(function($controller, _$q_, _$rootScope_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    
    mockKPIData = {
      monthlySpend: 55000,
      totalCreditLimit: 150000,
      availableCredit: 95000,
      outstandingAmount: 55000,
      creditUtilization: 36.67
    };
    
    KPIService = {
      fetchKPIs: jasmine.createSpy('fetchKPIs').and.returnValue($q.resolve(mockKPIData))
    };
    
    DashboardRefreshFactory = {
      startAutoRefresh: jasmine.createSpy('startAutoRefresh').and.returnValue('intervalPromise'),
      stopAutoRefresh: jasmine.createSpy('stopAutoRefresh')
    };
    
    controller = $controller('DashboardController', {
      KPIService: KPIService,
      CreditCardDataService: {},
      TransactionService: {},
      DashboardRefreshFactory: DashboardRefreshFactory,
      $scope: $scope,
      $interval: {}
    });
  }));
  
  it('should be defined', function() {
    expect(controller).toBeDefined();
  });
  
  it('should initialize with loading state true', function() {
    expect(controller.loading).toBe(true);
  });
  
  it('should load KPI data on initialization', function() {
    $rootScope.$digest();
    
    expect(KPIService.fetchKPIs).toHaveBeenCalled();
    expect(controller.kpiData).toEqual(mockKPIData);
    expect(controller.loading).toBe(false);
    expect(controller.lastUpdated).toBeDefined();
  });
  
  it('should start auto-refresh on initialization', function() {
    $rootScope.$digest();
    
    expect(DashboardRefreshFactory.startAutoRefresh).toHaveBeenCalled();
  });
  
  it('should handle error when KPI loading fails', function() {
    KPIService.fetchKPIs.and.returnValue($q.reject('Error'));
    
    var errorController = inject(function($controller) {
      return $controller('DashboardController', {
        KPIService: KPIService,
        CreditCardDataService: {},
        TransactionService: {},
        DashboardRefreshFactory: DashboardRefreshFactory,
        $scope: $scope,
        $interval: {}
      });
    });
    
    $rootScope.$digest();
    
    expect(errorController.error).toBe('Failed to load dashboard data. Please try again.');
    expect(errorController.loading).toBe(false);
  });
  
  it('should refresh KPIs when refreshKPIs is called', function() {
    $rootScope.$digest();
    KPIService.fetchKPIs.calls.reset();
    
    controller.refreshKPIs();
    $rootScope.$digest();
    
    expect(KPIService.fetchKPIs).toHaveBeenCalled();
  });
  
  it('should stop auto-refresh on scope destroy', function() {
    $rootScope.$digest();
    
    $scope.$emit('$destroy');
    
    expect(DashboardRefreshFactory.stopAutoRefresh).toHaveBeenCalledWith('intervalPromise');
  });
  
  it('should have all required controller properties', function() {
    expect(controller.kpiData).toBeDefined();
    expect(controller.loading).toBeDefined();
    expect(controller.error).toBeDefined();
    expect(controller.lastUpdated).toBeDefined();
    expect(controller.refreshKPIs).toBeDefined();
  });
});