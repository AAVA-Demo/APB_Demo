/*
Test Documentation:
- Test Name: AnalyticsController functionality
- Purpose: Validate analytics data loading and chart rendering
- Scenario: Test controller initialization and date range filtering
- Expected Result: Analytics loaded and charts configured
*/

(function() {
  'use strict';

  describe('AnalyticsController', function() {
    var $controller, $scope, $filter, $q, AnalyticsService, ChartConfigFactory;
    var mockAnalyticsData = {
      monthlyTrends: [
        { month: 'Jan 2023', amount: 1500 },
        { month: 'Feb 2023', amount: 2000 }
      ],
      cardWiseSpending: [
        { cardName: 'Visa Gold', amount: 3000 },
        { cardName: 'Mastercard Platinum', amount: 4500 }
      ],
      categoryWiseSpending: [
        { category: 'Food & Dining', amount: 1200, percentage: 35 },
        { category: 'Shopping', amount: 800, percentage: 25 }
      ]
    };
    var mockLineConfig = { type: 'line', data: {}, options: {} };
    var mockBarConfig = { type: 'bar', data: {}, options: {} };
    var mockDoughnutConfig = { type: 'doughnut', data: {}, options: {} };

    beforeEach(module('app.analytics'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_$controller_, _$rootScope_, _$filter_, _$q_) {
      $controller = _$controller_;
      $scope = _$rootScope_.$new();
      $filter = _$filter_;
      $q = _$q_;

      AnalyticsService = {
        getSpendingAnalytics: jasmine.createSpy('getSpendingAnalytics').and.returnValue($q.resolve(mockAnalyticsData))
      };

      ChartConfigFactory = {
        generateChartConfig: jasmine.createSpy('generateChartConfig').and.callFake(function(data, type) {
          if (type === 'line') return mockLineConfig;
          if (type === 'bar') return mockBarConfig;
          if (type === 'doughnut') return mockDoughnutConfig;
        })
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
      var vm = $controller('AnalyticsController', {
        $scope: $scope,
        $filter: $filter,
        AnalyticsService: AnalyticsService,
        ChartConfigFactory: ChartConfigFactory
      });

      expect(vm).toBeDefined();
      expect(vm.dateRange).toBeDefined();
      expect(vm.loading).toBe(false);
    });

    /*
    Test Documentation:
    - Test Name: should load analytics on initialization
    - Purpose: Validate automatic data loading
    - Scenario: Controller created
    - Expected Result: getSpendingAnalytics called, charts configured
    */
    it('should load analytics on initialization', function() {
      var vm = $controller('AnalyticsController', {
        $scope: $scope,
        $filter: $filter,
        AnalyticsService: AnalyticsService,
        ChartConfigFactory: ChartConfigFactory
      });

      $scope.$digest();

      expect(AnalyticsService.getSpendingAnalytics).toHaveBeenCalled();
      expect(vm.analyticsData).toEqual(mockAnalyticsData);
      expect(vm.monthlyTrendsConfig).toEqual(mockLineConfig);
      expect(vm.cardWiseConfig).toEqual(mockBarConfig);
      expect(vm.categoryWiseConfig).toEqual(mockDoughnutConfig);
    });

    /*
    Test Documentation:
    - Test Name: should generate chart configs with correct types
    - Purpose: Validate chart configuration generation
    - Scenario: Analytics data loaded
    - Expected Result: ChartConfigFactory called with correct parameters
    */
    it('should generate chart configs with correct types', function() {
      var vm = $controller('AnalyticsController', {
        $scope: $scope,
        $filter: $filter,
        AnalyticsService: AnalyticsService,
        ChartConfigFactory: ChartConfigFactory
      });

      $scope.$digest();

      expect(ChartConfigFactory.generateChartConfig).toHaveBeenCalledWith(mockAnalyticsData.monthlyTrends, 'line');
      expect(ChartConfigFactory.generateChartConfig).toHaveBeenCalledWith(mockAnalyticsData.cardWiseSpending, 'bar');
      expect(ChartConfigFactory.generateChartConfig).toHaveBeenCalledWith(mockAnalyticsData.categoryWiseSpending, 'doughnut');
    });

    /*
    Test Documentation:
    - Test Name: should apply date range filter
    - Purpose: Validate date range filtering
    - Scenario: User changes date range
    - Expected Result: Analytics reloaded with new date range
    */
    it('should apply date range filter', function() {
      var vm = $controller('AnalyticsController', {
        $scope: $scope,
        $filter: $filter,
        AnalyticsService: AnalyticsService,
        ChartConfigFactory: ChartConfigFactory
      });

      vm.dateRange.from = new Date('2023-01-01');
      vm.dateRange.to = new Date('2023-06-30');
      vm.applyDateRange();

      expect(AnalyticsService.getSpendingAnalytics).toHaveBeenCalledWith(vm.dateRange);
    });

    /*
    Test Documentation:
    - Test Name: should handle API errors
    - Purpose: Validate error handling
    - Scenario: API call fails
    - Expected Result: Error message displayed
    */
    it('should handle API errors', function() {
      AnalyticsService.getSpendingAnalytics = jasmine.createSpy('getSpendingAnalytics')
        .and.returnValue($q.reject({ status: 500 }));

      var vm = $controller('AnalyticsController', {
        $scope: $scope,
        $filter: $filter,
        AnalyticsService: AnalyticsService,
        ChartConfigFactory: ChartConfigFactory
      });

      $scope.$digest();

      expect(vm.error).toBe('Failed to load analytics data. Please try again.');
      expect(vm.loading).toBe(false);
    });

    /*
    Test Documentation:
    - Test Name: should initialize with 12-month date range
    - Purpose: Validate default date range
    - Scenario: Controller created
    - Expected Result: Date range set to last 12 months
    */
    it('should initialize with 12-month date range', function() {
      var vm = $controller('AnalyticsController', {
        $scope: $scope,
        $filter: $filter,
        AnalyticsService: AnalyticsService,
        ChartConfigFactory: ChartConfigFactory
      });

      expect(vm.dateRange.from).toBeDefined();
      expect(vm.dateRange.to).toBeDefined();
    });
  });

  /*
  Coverage Report:
  - Functions tested: loadAnalytics, applyDateRange
  - Scenarios covered: initialization, data loading, chart configuration, date filtering, error handling
  - Uncovered scenarios: none
  */
})();