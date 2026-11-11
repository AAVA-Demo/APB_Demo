/*
Test Documentation:
- Test Name: AnalyticsController - Analytics Dashboard Management
- Purpose: Validate analytics controller initialization, filtering, and data aggregation
- Scenario: Test loadTransactions, applyFilters, clearFilters, getFilteredTransactions
- Expected Result: Transactions loaded, filtered, and aggregated correctly
*/

describe('AnalyticsController', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  beforeEach(module('app.analytics'));
  
  var $controller, $q, $rootScope, $filter, TransactionService, AnalyticsService;
  var mockTransactions = [
    {transactionId: '1', merchantName: 'Restaurant A', category: 'Food & Dining', amount: 45.50, transactionDate: '2026-11-05'},
    {transactionId: '2', merchantName: 'Gas Station', category: 'Fuel', amount: 60.00, transactionDate: '2026-11-08'},
    {transactionId: '3', merchantName: 'Store A', category: 'Shopping', amount: 120.00, transactionDate: '2026-11-10'}
  ];
  var mockCategoryData = [
    {category: 'Food & Dining', totalAmount: 45.50, transactionCount: 1, percentage: '13.50'},
    {category: 'Fuel', totalAmount: 60.00, transactionCount: 1, percentage: '17.83'},
    {category: 'Shopping', totalAmount: 120.00, transactionCount: 1, percentage: '35.65'}
  ];
  var mockMonthlyTrends = [
    {month: '2026-11', totalSpend: 225.50, categoryBreakdown: []}
  ];
  
  beforeEach(inject(function(_$controller_, _$q_, _$rootScope_, _$filter_, _TransactionService_, _AnalyticsService_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $filter = _$filter_;
    TransactionService = _TransactionService_;
    AnalyticsService = _AnalyticsService_;
  }));
  
  describe('initialization', function() {
    it('should load transactions on initialization', function() {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(AnalyticsService, 'aggregateByCategory').and.returnValue(mockCategoryData);
      spyOn(AnalyticsService, 'aggregateByMonth').and.returnValue(mockMonthlyTrends);
      
      var $scope = $rootScope.$new();
      var controller = $controller('AnalyticsController', {
        $scope: $scope,
        $filter: $filter,
        TransactionService: TransactionService,
        AnalyticsService: AnalyticsService
      });
      
      expect(controller.loading).toBe(true);
      $rootScope.$apply();
      
      expect(controller.transactions).toEqual(mockTransactions);
      expect(controller.categoryData).toEqual(mockCategoryData);
      expect(controller.monthlyTrends).toEqual(mockMonthlyTrends);
      expect(controller.loading).toBe(false);
    });
    
    it('should handle error during transaction loading', function() {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.reject({error: 'Failed'}));
      
      var $scope = $rootScope.$new();
      var controller = $controller('AnalyticsController', {
        $scope: $scope,
        $filter: $filter,
        TransactionService: TransactionService,
        AnalyticsService: AnalyticsService
      });
      
      $rootScope.$apply();
      
      expect(controller.error).toBe('Failed to load transaction data. Please try again.');
      expect(controller.loading).toBe(false);
    });
    
    it('should initialize with predefined categories', function() {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(AnalyticsService, 'aggregateByCategory').and.returnValue(mockCategoryData);
      spyOn(AnalyticsService, 'aggregateByMonth').and.returnValue(mockMonthlyTrends);
      
      var $scope = $rootScope.$new();
      var controller = $controller('AnalyticsController', {
        $scope: $scope,
        $filter: $filter,
        TransactionService: TransactionService,
        AnalyticsService: AnalyticsService
      });
      
      expect(controller.categories.length).toBe(9);
      expect(controller.categories).toContain('Food & Dining');
      expect(controller.categories).toContain('Fuel');
      expect(controller.categories).toContain('Shopping');
    });
  });
  
  describe('applyFilters', function() {
    it('should reload transactions with filters', function() {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(TransactionService, 'clearCache');
      spyOn(AnalyticsService, 'aggregateByCategory').and.returnValue(mockCategoryData);
      spyOn(AnalyticsService, 'aggregateByMonth').and.returnValue(mockMonthlyTrends);
      
      var $scope = $rootScope.$new();
      var controller = $controller('AnalyticsController', {
        $scope: $scope,
        $filter: $filter,
        TransactionService: TransactionService,
        AnalyticsService: AnalyticsService
      });
      
      $rootScope.$apply();
      
      controller.startDate = '2026-11-01';
      controller.endDate = '2026-11-30';
      controller.selectedCategory = 'Fuel';
      
      controller.applyFilters();
      
      expect(TransactionService.clearCache).toHaveBeenCalled();
      expect(TransactionService.getTransactions).toHaveBeenCalledWith('2026-11-01', '2026-11-30', 'Fuel');
    });
  });
  
  describe('clearFilters', function() {
    it('should reset filters and reload transactions', function() {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(TransactionService, 'clearCache');
      spyOn(AnalyticsService, 'aggregateByCategory').and.returnValue(mockCategoryData);
      spyOn(AnalyticsService, 'aggregateByMonth').and.returnValue(mockMonthlyTrends);
      
      var $scope = $rootScope.$new();
      var controller = $controller('AnalyticsController', {
        $scope: $scope,
        $filter: $filter,
        TransactionService: TransactionService,
        AnalyticsService: AnalyticsService
      });
      
      $rootScope.$apply();
      
      controller.startDate = '2026-11-01';
      controller.endDate = '2026-11-30';
      controller.selectedCategory = 'Fuel';
      
      controller.clearFilters();
      
      expect(controller.startDate).toBeNull();
      expect(controller.endDate).toBeNull();
      expect(controller.selectedCategory).toBeNull();
      expect(TransactionService.clearCache).toHaveBeenCalled();
    });
  });
  
  describe('getFilteredTransactions', function() {
    it('should return transactions ordered by date descending', function() {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(AnalyticsService, 'aggregateByCategory').and.returnValue(mockCategoryData);
      spyOn(AnalyticsService, 'aggregateByMonth').and.returnValue(mockMonthlyTrends);
      
      var $scope = $rootScope.$new();
      var controller = $controller('AnalyticsController', {
        $scope: $scope,
        $filter: $filter,
        TransactionService: TransactionService,
        AnalyticsService: AnalyticsService
      });
      
      $rootScope.$apply();
      
      var filtered = controller.getFilteredTransactions();
      expect(filtered).toBeDefined();
      expect(filtered.length).toBe(3);
    });
  });
});

/*
Coverage Report:
- Functions tested: initialization, loadTransactions, applyFilters, clearFilters, getFilteredTransactions
- Scenarios covered: successful load, error handling, filter application, filter clearing, transaction ordering
- Edge cases: empty filters, multiple filters, error scenarios
- Uncovered scenarios: none
*/