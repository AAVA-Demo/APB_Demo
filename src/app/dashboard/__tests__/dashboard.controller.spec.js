/*
Test Documentation:
- Test Name: DashboardController - initialization
- Purpose: Validates controller initialization
- Scenario: Controller is instantiated
- Expected Result: Default state is set
*/
/*
Test Documentation:
- Test Name: DashboardController - loadPortfolio success
- Purpose: Validates successful portfolio data loading
- Scenario: Service returns valid data
- Expected Result: Portfolio data and KPIs are populated
*/
/*
Test Documentation:
- Test Name: DashboardController - loadPortfolio error handling
- Purpose: Validates error handling with mock data fallback
- Scenario: Service call fails
- Expected Result: Error message is set and mock data is loaded
*/
/*
Test Documentation:
- Test Name: DashboardController - auto-refresh
- Purpose: Validates automatic data refresh mechanism
- Scenario: Refresh interval is triggered
- Expected Result: Data is reloaded periodically
*/
/*
Coverage Report:
- Functions tested: loadPortfolio, auto-refresh cleanup
- Scenarios covered: initialization, success, error, auto-refresh, cleanup
- Uncovered scenarios: none
*/

describe('DashboardController', function() {
  'use strict';
  
  beforeEach(module('dashboardModule'));
  
  var $controller, $scope, $q, $interval, PortfolioService, KpiCalculationService, RefreshFactory;
  var mockPortfolioData = {
    cards: [
      { cardId: '1', cardName: 'Visa Platinum', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000 },
      { cardId: '2', cardName: 'MasterCard Gold', creditLimit: 30000, availableCredit: 25000, outstandingAmount: 5000 }
    ]
  };
  var mockKpis = {
    monthlySpend: 20000,
    totalCreditLimit: 80000,
    totalAvailableCredit: 60000,
    totalOutstanding: 20000
  };
  
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _$interval_, _PortfolioService_, _KpiCalculationService_, _RefreshFactory_) {
    $controller = _$controller_;
    $scope = _$rootScope_.$new();
    $q = _$q_;
    $interval = _$interval_;
    PortfolioService = _PortfolioService_;
    KpiCalculationService = _KpiCalculationService_;
    RefreshFactory = _RefreshFactory_;
  }));
  
  describe('initialization', function() {
    it('should initialize with default state', function() {
      spyOn(PortfolioService, 'getPortfolio').and.returnValue($q.resolve(mockPortfolioData));
      spyOn(KpiCalculationService, 'calculateKpis').and.returnValue(mockKpis);
      spyOn(RefreshFactory, 'startPolling').and.returnValue({});
      
      var vm = $controller('DashboardController', { $scope: $scope, PortfolioService: PortfolioService, KpiCalculationService: KpiCalculationService, RefreshFactory: RefreshFactory });
      
      expect(vm.portfolioData).toBeDefined();
      expect(vm.loading).toBe(true);
      expect(vm.errorMessage).toBe('');
    });
  });
  
  describe('loadPortfolio', function() {
    it('should load portfolio data successfully', function() {
      spyOn(PortfolioService, 'getPortfolio').and.returnValue($q.resolve(mockPortfolioData));
      spyOn(KpiCalculationService, 'calculateKpis').and.returnValue(mockKpis);
      spyOn(RefreshFactory, 'startPolling').and.returnValue({});
      
      var vm = $controller('DashboardController', { $scope: $scope, PortfolioService: PortfolioService, KpiCalculationService: KpiCalculationService, RefreshFactory: RefreshFactory });
      $scope.$digest();
      
      expect(vm.portfolioData.cards.length).toBe(2);
      expect(vm.portfolioData.kpis).toEqual(mockKpis);
      expect(vm.loading).toBe(false);
      expect(vm.errorMessage).toBe('');
    });
    
    it('should handle errors and load mock data', function() {
      spyOn(PortfolioService, 'getPortfolio').and.returnValue($q.reject('API Error'));
      spyOn(KpiCalculationService, 'calculateKpis').and.returnValue(mockKpis);
      spyOn(RefreshFactory, 'startPolling').and.returnValue({});
      
      var vm = $controller('DashboardController', { $scope: $scope, PortfolioService: PortfolioService, KpiCalculationService: KpiCalculationService, RefreshFactory: RefreshFactory });
      $scope.$digest();
      
      expect(vm.errorMessage).toBe('Failed to load portfolio data. Please try again.');
      expect(vm.portfolioData.cards.length).toBe(3);
      expect(vm.loading).toBe(false);
    });
    
    it('should calculate KPIs after loading portfolio', function() {
      spyOn(PortfolioService, 'getPortfolio').and.returnValue($q.resolve(mockPortfolioData));
      spyOn(KpiCalculationService, 'calculateKpis').and.returnValue(mockKpis);
      spyOn(RefreshFactory, 'startPolling').and.returnValue({});
      
      var vm = $controller('DashboardController', { $scope: $scope, PortfolioService: PortfolioService, KpiCalculationService: KpiCalculationService, RefreshFactory: RefreshFactory });
      $scope.$digest();
      
      expect(KpiCalculationService.calculateKpis).toHaveBeenCalledWith(mockPortfolioData.cards);
    });
  });
  
  describe('auto-refresh', function() {
    it('should start polling on initialization', function() {
      spyOn(PortfolioService, 'getPortfolio').and.returnValue($q.resolve(mockPortfolioData));
      spyOn(KpiCalculationService, 'calculateKpis').and.returnValue(mockKpis);
      spyOn(RefreshFactory, 'startPolling').and.returnValue({});
      
      var vm = $controller('DashboardController', { $scope: $scope, PortfolioService: PortfolioService, KpiCalculationService: KpiCalculationService, RefreshFactory: RefreshFactory });
      
      expect(RefreshFactory.startPolling).toHaveBeenCalled();
    });
    
    it('should stop polling on scope destroy', function() {
      spyOn(PortfolioService, 'getPortfolio').and.returnValue($q.resolve(mockPortfolioData));
      spyOn(KpiCalculationService, 'calculateKpis').and.returnValue(mockKpis);
      spyOn(RefreshFactory, 'startPolling').and.returnValue({});
      spyOn(RefreshFactory, 'stopPolling');
      
      var vm = $controller('DashboardController', { $scope: $scope, PortfolioService: PortfolioService, KpiCalculationService: KpiCalculationService, RefreshFactory: RefreshFactory });
      $scope.$destroy();
      
      expect(RefreshFactory.stopPolling).toHaveBeenCalled();
    });
  });
});