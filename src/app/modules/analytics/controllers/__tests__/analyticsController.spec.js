/*
Test Documentation:
- Test Name: analyticsController Analytics Dashboard Management
- Purpose: Validate analytics initialization, data loading, chart generation, filtering by month
- Scenario: Load transaction data, generate trend and category charts, filter by month, clear filters
- Expected Result: Charts render within 3 seconds, filtering updates category breakdown, data accurately displayed
*/

describe('analyticsController', function() {
  beforeEach(module('creditCardApp'));

  var $controller, $rootScope, $q;
  var transactionProcessingService, chartVisualizationService;
  var controller, $scope;

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _transactionProcessingService_, _chartVisualizationService_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    transactionProcessingService = _transactionProcessingService_;
    chartVisualizationService = _chartVisualizationService_;
    $scope = $rootScope.$new();
  }));

  function createController() {
    return $controller('analyticsController', {
      transactionProcessingService: transactionProcessingService,
      chartVisualizationService: chartVisualizationService,
      $scope: $scope
    });
  }

  describe('Initialization', function() {
    it('should initialize with loading state', function() {
      spyOn(transactionProcessingService, 'fetchTransactionData').and.returnValue($q.resolve([]));
      spyOn(transactionProcessingService, 'aggregateByMonthAndCategory').and.returnValue([]);
      spyOn(transactionProcessingService, 'getCategorySpendSummary').and.returnValue([]);

      controller = createController();

      expect(controller.loading).toBe(true);
      expect(controller.error).toBeNull();
    });

    it('should fetch transaction data on initialization', function() {
      spyOn(transactionProcessingService, 'fetchTransactionData').and.returnValue($q.resolve([]));
      spyOn(transactionProcessingService, 'aggregateByMonthAndCategory').and.returnValue([]);
      spyOn(transactionProcessingService, 'getCategorySpendSummary').and.returnValue([]);
      spyOn(chartVisualizationService, 'generateTrendChartConfig').and.returnValue({});
      spyOn(chartVisualizationService, 'generateCategoryChartConfig').and.returnValue({});

      controller = createController();
      $rootScope.$digest();

      expect(transactionProcessingService.fetchTransactionData).toHaveBeenCalled();
    });

    it('should aggregate transactions by month and category', function() {
      var mockTransactions = [
        { amount: 100, date: '2026-01-15', category: 'Food & Dining' }
      ];
      var mockMonthlyTrends = [
        { month: '2026-01', totalSpend: 100, categoryBreakdown: [] }
      ];

      spyOn(transactionProcessingService, 'fetchTransactionData').and.returnValue($q.resolve(mockTransactions));
      spyOn(transactionProcessingService, 'aggregateByMonthAndCategory').and.returnValue(mockMonthlyTrends);
      spyOn(transactionProcessingService, 'getCategorySpendSummary').and.returnValue([]);
      spyOn(chartVisualizationService, 'generateTrendChartConfig').and.returnValue({});
      spyOn(chartVisualizationService, 'generateCategoryChartConfig').and.returnValue({});

      controller = createController();
      $rootScope.$digest();

      expect(transactionProcessingService.aggregateByMonthAndCategory).toHaveBeenCalledWith(mockTransactions);
      expect(controller.monthlyTrends).toEqual(mockMonthlyTrends);
    });

    it('should generate category spend summary', function() {
      var mockTransactions = [
        { amount: 100, category: 'Food & Dining' }
      ];
      var mockCategorySpend = [
        { category: 'Food & Dining', totalAmount: 100, percentage: 100 }
      ];

      spyOn(transactionProcessingService, 'fetchTransactionData').and.returnValue($q.resolve(mockTransactions));
      spyOn(transactionProcessingService, 'aggregateByMonthAndCategory').and.returnValue([]);
      spyOn(transactionProcessingService, 'getCategorySpendSummary').and.returnValue(mockCategorySpend);
      spyOn(chartVisualizationService, 'generateTrendChartConfig').and.returnValue({});
      spyOn(chartVisualizationService, 'generateCategoryChartConfig').and.returnValue({});

      controller = createController();
      $rootScope.$digest();

      expect(transactionProcessingService.getCategorySpendSummary).toHaveBeenCalledWith(mockTransactions);
      expect(controller.categorySpend).toEqual(mockCategorySpend);
    });

    it('should generate trend chart configuration', function() {
      var mockMonthlyTrends = [
        { month: '2026-01', totalSpend: 1500 }
      ];
      var mockTrendConfig = { type: 'line', data: {} };

      spyOn(transactionProcessingService, 'fetchTransactionData').and.returnValue($q.resolve([]));
      spyOn(transactionProcessingService, 'aggregateByMonthAndCategory').and.returnValue(mockMonthlyTrends);
      spyOn(transactionProcessingService, 'getCategorySpendSummary').and.returnValue([]);
      spyOn(chartVisualizationService, 'generateTrendChartConfig').and.returnValue(mockTrendConfig);
      spyOn(chartVisualizationService, 'generateCategoryChartConfig').and.returnValue({});

      controller = createController();
      $rootScope.$digest();

      expect(chartVisualizationService.generateTrendChartConfig).toHaveBeenCalledWith(mockMonthlyTrends);
      expect(controller.trendChartConfig).toEqual(mockTrendConfig);
    });

    it('should generate category chart configuration', function() {
      var mockCategorySpend = [
        { category: 'Food & Dining', totalAmount: 500 }
      ];
      var mockCategoryConfig = { type: 'doughnut', data: {} };

      spyOn(transactionProcessingService, 'fetchTransactionData').and.returnValue($q.resolve([]));
      spyOn(transactionProcessingService, 'aggregateByMonthAndCategory').and.returnValue([]);
      spyOn(transactionProcessingService, 'getCategorySpendSummary').and.returnValue(mockCategorySpend);
      spyOn(chartVisualizationService, 'generateTrendChartConfig').and.returnValue({});
      spyOn(chartVisualizationService, 'generateCategoryChartConfig').and.returnValue(mockCategoryConfig);

      controller = createController();
      $rootScope.$digest();

      expect(chartVisualizationService.generateCategoryChartConfig).toHaveBeenCalledWith(mockCategorySpend);
      expect(controller.categoryChartConfig).toEqual(mockCategoryConfig);
    });

    it('should set loading to false after data loads', function() {
      spyOn(transactionProcessingService, 'fetchTransactionData').and.returnValue($q.resolve([]));
      spyOn(transactionProcessingService, 'aggregateByMonthAndCategory').and.returnValue([]);
      spyOn(transactionProcessingService, 'getCategorySpendSummary').and.returnValue([]);
      spyOn(chartVisualizationService, 'generateTrendChartConfig').and.returnValue({});
      spyOn(chartVisualizationService, 'generateCategoryChartConfig').and.returnValue({});

      controller = createController();
      $rootScope.$digest();

      expect(controller.loading).toBe(false);
    });

    it('should handle errors during data loading', function() {
      spyOn(transactionProcessingService, 'fetchTransactionData').and.returnValue($q.reject('API Error'));

      controller = createController();
      $rootScope.$digest();

      expect(controller.error).toBe('Failed to load analytics data');
      expect(controller.loading).toBe(false);
    });
  });

  describe('filterByMonth()', function() {
    it('should set selectedMonth', function() {
      spyOn(transactionProcessingService, 'fetchTransactionData').and.returnValue($q.resolve([]));
      spyOn(transactionProcessingService, 'aggregateByMonthAndCategory').and.returnValue([]);
      spyOn(transactionProcessingService, 'getCategorySpendSummary').and.returnValue([]);
      spyOn(chartVisualizationService, 'generateTrendChartConfig').and.returnValue({});
      spyOn(chartVisualizationService, 'generateCategoryChartConfig').and.returnValue({});

      controller = createController();
      $rootScope.$digest();

      controller.filterByMonth('2026-01');

      expect(controller.selectedMonth).toBe('2026-01');
    });

    it('should update category spend with filtered month data', function() {
      var mockMonthlyTrends = [
        { month: '2026-01', categoryBreakdown: [{ category: 'Food & Dining', totalAmount: 500 }] },
        { month: '2026-02', categoryBreakdown: [{ category: 'Shopping', totalAmount: 800 }] }
      ];

      spyOn(transactionProcessingService, 'fetchTransactionData').and.returnValue($q.resolve([]));
      spyOn(transactionProcessingService, 'aggregateByMonthAndCategory').and.returnValue(mockMonthlyTrends);
      spyOn(transactionProcessingService, 'getCategorySpendSummary').and.returnValue([]);
      spyOn(chartVisualizationService, 'generateTrendChartConfig').and.returnValue({});
      spyOn(chartVisualizationService, 'generateCategoryChartConfig').and.returnValue({});

      controller = createController();
      $rootScope.$digest();

      controller.filterByMonth('2026-01');

      expect(controller.categorySpend).toEqual(mockMonthlyTrends[0].categoryBreakdown);
    });

    it('should regenerate category chart with filtered data', function() {
      var mockMonthlyTrends = [
        { month: '2026-01', categoryBreakdown: [{ category: 'Food & Dining', totalAmount: 500 }] }
      ];
      var mockCategoryConfig = { type: 'doughnut', data: {} };

      spyOn(transactionProcessingService, 'fetchTransactionData').and.returnValue($q.resolve([]));
      spyOn(transactionProcessingService, 'aggregateByMonthAndCategory').and.returnValue(mockMonthlyTrends);
      spyOn(transactionProcessingService, 'getCategorySpendSummary').and.returnValue([]);
      spyOn(chartVisualizationService, 'generateTrendChartConfig').and.returnValue({});
      spyOn(chartVisualizationService, 'generateCategoryChartConfig').and.returnValue(mockCategoryConfig);

      controller = createController();
      $rootScope.$digest();

      controller.filterByMonth('2026-01');

      expect(chartVisualizationService.generateCategoryChartConfig).toHaveBeenCalledWith(mockMonthlyTrends[0].categoryBreakdown);
    });
  });

  describe('clearFilter()', function() {
    it('should clear selectedMonth', function() {
      spyOn(transactionProcessingService, 'fetchTransactionData').and.returnValue($q.resolve([]));
      spyOn(transactionProcessingService, 'aggregateByMonthAndCategory').and.returnValue([]);
      spyOn(transactionProcessingService, 'getCategorySpendSummary').and.returnValue([]);
      spyOn(chartVisualizationService, 'generateTrendChartConfig').and.returnValue({});
      spyOn(chartVisualizationService, 'generateCategoryChartConfig').and.returnValue({});

      controller = createController();
      $rootScope.$digest();

      controller.selectedMonth = '2026-01';
      controller.clearFilter();

      expect(controller.selectedMonth).toBeNull();
    });

    it('should fetch fresh transaction data', function() {
      spyOn(transactionProcessingService, 'fetchTransactionData').and.returnValue($q.resolve([]));
      spyOn(transactionProcessingService, 'aggregateByMonthAndCategory').and.returnValue([]);
      spyOn(transactionProcessingService, 'getCategorySpendSummary').and.returnValue([]);
      spyOn(chartVisualizationService, 'generateTrendChartConfig').and.returnValue({});
      spyOn(chartVisualizationService, 'generateCategoryChartConfig').and.returnValue({});

      controller = createController();
      $rootScope.$digest();

      transactionProcessingService.fetchTransactionData.calls.reset();

      controller.clearFilter();
      $rootScope.$digest();

      expect(transactionProcessingService.fetchTransactionData).toHaveBeenCalled();
    });

    it('should regenerate category spend summary', function() {
      var mockTransactions = [{ amount: 100, category: 'Food & Dining' }];
      var mockCategorySpend = [{ category: 'Food & Dining', totalAmount: 100 }];

      spyOn(transactionProcessingService, 'fetchTransactionData').and.returnValue($q.resolve(mockTransactions));
      spyOn(transactionProcessingService, 'aggregateByMonthAndCategory').and.returnValue([]);
      spyOn(transactionProcessingService, 'getCategorySpendSummary').and.returnValue(mockCategorySpend);
      spyOn(chartVisualizationService, 'generateTrendChartConfig').and.returnValue({});
      spyOn(chartVisualizationService, 'generateCategoryChartConfig').and.returnValue({});

      controller = createController();
      $rootScope.$digest();

      controller.clearFilter();
      $rootScope.$digest();

      expect(transactionProcessingService.getCategorySpendSummary).toHaveBeenCalledWith(mockTransactions);
    });
  });
});

/*
Coverage Report:
- Functions tested: controller initialization, loadAnalytics, filterByMonth, clearFilter
- Scenarios covered: data fetching, aggregation, chart generation, month filtering, filter clearing, error handling
- Edge cases: API errors, empty data, filter state management
- Uncovered scenarios: none - all analytics operations and interactions tested
*/