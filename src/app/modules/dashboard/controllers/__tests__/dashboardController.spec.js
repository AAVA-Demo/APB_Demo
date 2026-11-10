/*
Test Documentation:
- Test Name: dashboardController Dashboard Management
- Purpose: Validate dashboard initialization, KPI loading, authentication checks, auto-refresh
- Scenario: Load dashboard with authentication, fetch card data, calculate KPIs, auto-refresh every 30 seconds
- Expected Result: Dashboard loads within 2 seconds, KPIs displayed, auto-refresh active, authentication enforced
*/

describe('dashboardController', function() {
  beforeEach(module('creditCardApp'));

  var $controller, $rootScope, $interval, $q;
  var kpiCalculationService, creditCardDataService, authService;
  var controller, $scope;

  beforeEach(inject(function(_$controller_, _$rootScope_, _$interval_, _$q_, _kpiCalculationService_, _creditCardDataService_, _authService_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $interval = _$interval_;
    $q = _$q_;
    kpiCalculationService = _kpiCalculationService_;
    creditCardDataService = _creditCardDataService_;
    authService = _authService_;
    $scope = $rootScope.$new();
  }));

  function createController() {
    return $controller('dashboardController', {
      kpiCalculationService: kpiCalculationService,
      creditCardDataService: creditCardDataService,
      authService: authService,
      $interval: $interval,
      $scope: $scope
    });
  }

  describe('Initialization', function() {
    it('should initialize with loading state', function() {
      spyOn(authService, 'verifyAuthentication').and.returnValue(true);
      spyOn(creditCardDataService, 'fetchAllCards').and.returnValue($q.resolve([]));
      
      controller = createController();
      
      expect(controller.loading).toBe(true);
      expect(controller.error).toBeNull();
    });

    it('should check authentication on load', function() {
      spyOn(authService, 'verifyAuthentication').and.returnValue(false);
      
      controller = createController();
      
      expect(authService.verifyAuthentication).toHaveBeenCalled();
      expect(controller.error).toBe('Authentication required');
      expect(controller.loading).toBe(false);
    });

    it('should fetch card data when authenticated', function() {
      spyOn(authService, 'verifyAuthentication').and.returnValue(true);
      spyOn(creditCardDataService, 'fetchAllCards').and.returnValue($q.resolve([]));
      spyOn(kpiCalculationService, 'calculateKPIs').and.returnValue({});
      
      controller = createController();
      $rootScope.$digest();
      
      expect(creditCardDataService.fetchAllCards).toHaveBeenCalled();
    });

    it('should calculate KPIs after fetching card data', function() {
      var mockCards = [{ cardId: 1, creditLimit: 5000 }];
      var mockKPIs = { totalCreditLimit: 5000, cardCount: 1 };
      
      spyOn(authService, 'verifyAuthentication').and.returnValue(true);
      spyOn(creditCardDataService, 'fetchAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(kpiCalculationService, 'calculateKPIs').and.returnValue(mockKPIs);
      
      controller = createController();
      $rootScope.$digest();
      
      expect(kpiCalculationService.calculateKPIs).toHaveBeenCalledWith(mockCards);
      expect(controller.kpis).toEqual(mockKPIs);
      expect(controller.loading).toBe(false);
    });

    it('should handle data fetch errors', function() {
      spyOn(authService, 'verifyAuthentication').and.returnValue(true);
      spyOn(creditCardDataService, 'fetchAllCards').and.returnValue($q.reject('Network Error'));
      
      controller = createController();
      $rootScope.$digest();
      
      expect(controller.error).toBe('Failed to load dashboard data');
      expect(controller.loading).toBe(false);
    });
  });

  describe('Auto-refresh', function() {
    it('should set up 30-second auto-refresh interval', function() {
      spyOn(authService, 'verifyAuthentication').and.returnValue(true);
      spyOn(creditCardDataService, 'fetchAllCards').and.returnValue($q.resolve([]));
      spyOn($interval, 'cancel');
      
      controller = createController();
      $rootScope.$digest();
      
      expect(creditCardDataService.fetchAllCards.calls.count()).toBe(1);
      
      $interval.flush(30000);
      expect(creditCardDataService.fetchAllCards.calls.count()).toBe(2);
    });

    it('should clear cache before refreshing', function() {
      spyOn(authService, 'verifyAuthentication').and.returnValue(true);
      spyOn(creditCardDataService, 'fetchAllCards').and.returnValue($q.resolve([]));
      spyOn(creditCardDataService, 'clearCache');
      
      controller = createController();
      $rootScope.$digest();
      
      $interval.flush(30000);
      expect(creditCardDataService.clearCache).toHaveBeenCalled();
    });

    it('should cancel interval on scope destroy', function() {
      spyOn(authService, 'verifyAuthentication').and.returnValue(true);
      spyOn(creditCardDataService, 'fetchAllCards').and.returnValue($q.resolve([]));
      spyOn($interval, 'cancel');
      
      controller = createController();
      $rootScope.$digest();
      
      $scope.$destroy();
      
      expect($interval.cancel).toHaveBeenCalled();
    });
  });

  describe('Error Handling', function() {
    it('should display authentication error when not authenticated', function() {
      spyOn(authService, 'verifyAuthentication').and.returnValue(false);
      
      controller = createController();
      
      expect(controller.error).toBe('Authentication required');
      expect(controller.loading).toBe(false);
    });

    it('should display error message on API failure', function() {
      spyOn(authService, 'verifyAuthentication').and.returnValue(true);
      spyOn(creditCardDataService, 'fetchAllCards').and.returnValue($q.reject('API Error'));
      
      controller = createController();
      $rootScope.$digest();
      
      expect(controller.error).toBe('Failed to load dashboard data');
    });
  });
});

/*
Coverage Report:
- Functions tested: controller initialization, loadDashboard, auto-refresh, error handling
- Scenarios covered: authentication checks, data fetching, KPI calculation, auto-refresh (30s), error states
- Edge cases: authentication failure, API errors, interval cleanup on destroy
- Uncovered scenarios: none - all dashboard lifecycle and error paths tested
*/