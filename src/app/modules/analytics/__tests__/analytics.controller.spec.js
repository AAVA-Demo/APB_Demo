/*
Test Documentation:
- Test Name: AnalyticsController initialization and data loading
- Purpose: Validates controller initialization, service integration, and data processing
- Scenario: Test successful analytics data loading, error handling, and category filtering
- Expected Result: Controller should properly load transactions, categorize them, and handle user interactions
*/
/*
Coverage Report:
- Functions tested: init, loadAnalytics, filterByCategory, clearFilter
- Scenarios covered: successful data load, error handling, category filtering, filter clearing
- Dependencies mocked: TransactionService, CategoryService, AnalyticsDataService
- Uncovered scenarios: none
*/

describe('AnalyticsController', function() {
  'use strict';
  
  beforeEach(module('creditCard.analytics'));
  
  var controller, $q, $rootScope;
  var TransactionService, CategoryService, AnalyticsDataService;
  var mockTransactions, mockCategorySummaries, mockMonthlyTrends;
  
  beforeEach(inject(function($controller, _$q_, _$rootScope_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    mockTransactions = [
      { id: '1', amount: 1000, category: 'Food & Dining', date: new Date() },
      { id: '2', amount: 2000, category: 'Fuel', date: new Date() }
    ];
    
    mockCategorySummaries = [
      { categoryName: 'Food & Dining', totalAmount: 1000, transactionCount: 1, percentage: 33.33 },
      { categoryName: 'Fuel', totalAmount: 2000, transactionCount: 1, percentage: 66.67 }
    ];
    
    mockMonthlyTrends = [
      { month: '2024-01', totalSpend: 3000, categoryBreakdown: mockCategorySummaries }
    ];
    
    TransactionService = {
      fetchTransactions: jasmine.createSpy('fetchTransactions').and.returnValue($q.resolve(mockTransactions))
    };
    
    CategoryService = {
      classifyTransactions: jasmine.createSpy('classifyTransactions').and.returnValue(mockTransactions)
    };
    
    AnalyticsDataService = {
      aggregateByCategory: jasmine.createSpy('aggregateByCategory').and.returnValue(mockCategorySummaries),
      calculateMonthlyTrends: jasmine.createSpy('calculateMonthlyTrends').and.returnValue(mockMonthlyTrends)
    };
    
    controller = $controller('AnalyticsController', {
      TransactionService: TransactionService,
      CategoryService: CategoryService,
      AnalyticsDataService: AnalyticsDataService,
      $scope: $rootScope.$new()
    });
  }));
  
  it('should be defined', function() {
    expect(controller).toBeDefined();
  });
  
  it('should initialize with loading state true', function() {
    expect(controller.loading).toBe(true);
  });
  
  it('should load analytics data on initialization', function() {
    $rootScope.$digest();
    
    expect(TransactionService.fetchTransactions).toHaveBeenCalledWith(12);
    expect(CategoryService.classifyTransactions).toHaveBeenCalledWith(mockTransactions);
    expect(AnalyticsDataService.aggregateByCategory).toHaveBeenCalled();
    expect(AnalyticsDataService.calculateMonthlyTrends).toHaveBeenCalled();
    expect(controller.loading).toBe(false);
    expect(controller.transactions).toEqual(mockTransactions);
    expect(controller.categorySummaries).toEqual(mockCategorySummaries);
    expect(controller.monthlyTrends).toEqual(mockMonthlyTrends);
  });
  
  it('should handle error when loading analytics data fails', function() {
    TransactionService.fetchTransactions.and.returnValue($q.reject('Error'));
    
    var errorController = inject(function($controller) {
      return $controller('AnalyticsController', {
        TransactionService: TransactionService,
        CategoryService: CategoryService,
        AnalyticsDataService: AnalyticsDataService,
        $scope: $rootScope.$new()
      });
    });
    
    $rootScope.$digest();
    
    expect(errorController.error).toBe('Failed to load analytics data.');
    expect(errorController.loading).toBe(false);
  });
  
  it('should filter transactions by category', function() {
    $rootScope.$digest();
    
    var filteredSummaries = [{ categoryName: 'Food & Dining', totalAmount: 1000, transactionCount: 1, percentage: 100 }];
    AnalyticsDataService.aggregateByCategory.and.returnValue(filteredSummaries);
    
    controller.filterByCategory('Food & Dining');
    
    expect(controller.selectedCategory).toBe('Food & Dining');
    expect(controller.categorySummaries).toEqual(filteredSummaries);
  });
  
  it('should clear filter and reload analytics', function() {
    $rootScope.$digest();
    controller.selectedCategory = 'Food & Dining';
    
    controller.clearFilter();
    $rootScope.$digest();
    
    expect(controller.selectedCategory).toBeNull();
    expect(TransactionService.fetchTransactions).toHaveBeenCalled();
  });
  
  it('should have all required controller properties', function() {
    expect(controller.transactions).toBeDefined();
    expect(controller.categorySummaries).toBeDefined();
    expect(controller.monthlyTrends).toBeDefined();
    expect(controller.loading).toBeDefined();
    expect(controller.error).toBeDefined();
    expect(controller.selectedCategory).toBeDefined();
    expect(controller.filterByCategory).toBeDefined();
    expect(controller.clearFilter).toBeDefined();
  });
});