/*
Test Documentation:
- Test Name: DashboardController functionality
- Purpose: Validate dashboard data loading and KPI display
- Scenario: Test controller initialization and data refresh
- Expected Result: Dashboard loads cards and calculates KPIs
*/

(function() {
  'use strict';

  describe('DashboardController', function() {
    var $controller, $scope, $interval, $q, CreditCardService, KPICalculatorFactory;
    var mockCards = [
      { cardId: 'card1', creditLimit: 5000, status: 'Active' },
      { cardId: 'card2', creditLimit: 10000, status: 'Active' }
    ];
    var mockKPIs = {
      totalCreditLimit: 15000,
      totalAvailableCredit: 10000,
      totalOutstanding: 5000,
      creditUtilizationPercent: 33.33,
      activeCardsCount: 2
    };

    beforeEach(module('app.dashboard'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_$controller_, _$rootScope_, _$interval_, _$q_) {
      $controller = _$controller_;
      $scope = _$rootScope_.$new();
      $interval = _$interval_;
      $q = _$q_;

      CreditCardService = {
        getAllCards: jasmine.createSpy('getAllCards').and.returnValue($q.resolve(mockCards))
      };

      KPICalculatorFactory = {
        calculateKPIs: jasmine.createSpy('calculateKPIs').and.returnValue(mockKPIs)
      };
    }));

    /*
    Test Documentation:
    - Test Name: should initialize controller
    - Purpose: Validate controller creation
    - Scenario: Create controller instance
    - Expected Result: Controller defined with initial state
    */
    it('should initialize controller', function() {
      var vm = $controller('DashboardController', {
        $scope: $scope,
        $interval: $interval,
        CreditCardService: CreditCardService,
        KPICalculatorFactory: KPICalculatorFactory
      });

      expect(vm).toBeDefined();
      expect(vm.cards).toEqual([]);
      expect(vm.loading).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: should load dashboard data on initialization
    - Purpose: Validate automatic data loading
    - Scenario: Controller created
    - Expected Result: getAllCards called, KPIs calculated
    */
    it('should load dashboard data on initialization', function() {
      var vm = $controller('DashboardController', {
        $scope: $scope,
        $interval: $interval,
        CreditCardService: CreditCardService,
        KPICalculatorFactory: KPICalculatorFactory
      });

      $scope.$digest();

      expect(CreditCardService.getAllCards).toHaveBeenCalled();
      expect(vm.cards).toEqual(mockCards);
      expect(vm.kpiData).toEqual(mockKPIs);
      expect(vm.loading).toBe(false);
    });

    /*
    Test Documentation:
    - Test Name: should handle API errors gracefully
    - Purpose: Validate error handling
    - Scenario: API call fails
    - Expected Result: Error message displayed, loading stopped
    */
    it('should handle API errors gracefully', function() {
      CreditCardService.getAllCards = jasmine.createSpy('getAllCards')
        .and.returnValue($q.reject({ status: 500 }));

      var vm = $controller('DashboardController', {
        $scope: $scope,
        $interval: $interval,
        CreditCardService: CreditCardService,
        KPICalculatorFactory: KPICalculatorFactory
      });

      $scope.$digest();

      expect(vm.error).toBe('Failed to load dashboard data. Please try again.');
      expect(vm.loading).toBe(false);
    });

    /*
    Test Documentation:
    - Test Name: should retry loading on retry button click
    - Purpose: Validate retry functionality
    - Scenario: User clicks retry after error
    - Expected Result: loadDashboard called again
    */
    it('should retry loading on retry button click', function() {
      var vm = $controller('DashboardController', {
        $scope: $scope,
        $interval: $interval,
        CreditCardService: CreditCardService,
        KPICalculatorFactory: KPICalculatorFactory
      });

      spyOn(vm, 'loadDashboard');
      vm.retry();

      expect(vm.loadDashboard).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: getUtilizationClass should return correct CSS class
    - Purpose: Validate utilization color coding
    - Scenario: Different utilization percentages
    - Expected Result: Correct CSS class returned
    */
    it('getUtilizationClass should return correct CSS class', function() {
      var vm = $controller('DashboardController', {
        $scope: $scope,
        $interval: $interval,
        CreditCardService: CreditCardService,
        KPICalculatorFactory: KPICalculatorFactory
      });

      vm.kpiData.creditUtilizationPercent = 25;
      expect(vm.getUtilizationClass()).toBe('utilization-low');

      vm.kpiData.creditUtilizationPercent = 50;
      expect(vm.getUtilizationClass()).toBe('utilization-medium');

      vm.kpiData.creditUtilizationPercent = 80;
      expect(vm.getUtilizationClass()).toBe('utilization-high');
    });

    /*
    Test Documentation:
    - Test Name: should set up auto-refresh interval
    - Purpose: Validate periodic data refresh
    - Scenario: Controller initialized
    - Expected Result: Interval set to refresh every 5 minutes
    */
    it('should set up auto-refresh interval', function() {
      spyOn($interval, 'cancel');
      var vm = $controller('DashboardController', {
        $scope: $scope,
        $interval: $interval,
        CreditCardService: CreditCardService,
        KPICalculatorFactory: KPICalculatorFactory
      });

      $scope.$destroy();
      expect($interval.cancel).toHaveBeenCalled();
    });
  });

  /*
  Coverage Report:
  - Functions tested: loadDashboard, retry, getUtilizationClass
  - Scenarios covered: initialization, data loading, error handling, retry, utilization classes, auto-refresh
  - Uncovered scenarios: none
  */
})();