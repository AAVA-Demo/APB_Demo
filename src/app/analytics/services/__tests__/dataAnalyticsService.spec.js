/*
Test Documentation:
- Test Name: dataAnalyticsService - Get Spending Analytics Success
- Purpose: Verify service aggregates transaction data correctly
- Scenario: Valid date range with transactions
- Expected Result: Returns categorized spending with monthly trends
*/
/*
Test Documentation:
- Test Name: dataAnalyticsService - Category Aggregation
- Purpose: Verify category-wise spending calculation
- Scenario: Multiple transactions across different categories
- Expected Result: Correct totals and percentages per category
*/
/*
Test Documentation:
- Test Name: dataAnalyticsService - Monthly Trend Calculation
- Purpose: Verify monthly spend trends are calculated correctly
- Scenario: Transactions spanning multiple months
- Expected Result: Monthly aggregation with category breakdown
*/
/*
Coverage Report:
- Functions tested: getSpendingAnalytics
- Scenarios covered: success path, category aggregation, monthly trends
- Uncovered scenarios: empty transaction list
*/

describe('dataAnalyticsService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.analytics'));
  
  var dataAnalyticsService, $rootScope, $q, mockTransactionDataService, mockCategoryClassificationFactory;
  
  beforeEach(inject(function(_dataAnalyticsService_, _$rootScope_, _$q_) {
    dataAnalyticsService = _dataAnalyticsService_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    
    mockTransactionDataService = {
      getTransactions: jasmine.createSpy('getTransactions')
    };
    
    mockCategoryClassificationFactory = {
      categorize: jasmine.createSpy('categorize').and.callFake(function(txns) {
        return txns;
      })
    };
    
    dataAnalyticsService = inject(function($injector) {
      return $injector.instantiate(dataAnalyticsService.constructor, {
        transactionDataService: mockTransactionDataService,
        categoryClassificationFactory: mockCategoryClassificationFactory
      });
    });
  }));
  
  it('should aggregate spending analytics correctly', function() {
    var mockTransactions = [
      {transactionId: 't1', category: 'Food & Dining', amount: 150, date: new Date(2024, 0, 15)},
      {transactionId: 't2', category: 'Fuel', amount: 80, date: new Date(2024, 0, 20)},
      {transactionId: 't3', category: 'Food & Dining', amount: 200, date: new Date(2024, 1, 10)}
    ];
    mockTransactionDataService.getTransactions.and.returnValue($q.resolve(mockTransactions));
    
    var dateRange = {start: new Date(2024, 0, 1), end: new Date(2024, 1, 28)};
    var result;
    
    dataAnalyticsService.getSpendingAnalytics(dateRange).then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(result.totalSpend).toBe(430);
    expect(result.categories.length).toBe(2);
    expect(result.categories[0].categoryName).toBe('Food & Dining');
    expect(result.categories[0].totalSpend).toBe(350);
    expect(result.categories[0].transactionCount).toBe(2);
  });
  
  it('should calculate category percentages correctly', function() {
    var mockTransactions = [
      {transactionId: 't1', category: 'Food & Dining', amount: 500, date: new Date(2024, 0, 15)},
      {transactionId: 't2', category: 'Fuel', amount: 500, date: new Date(2024, 0, 20)}
    ];
    mockTransactionDataService.getTransactions.and.returnValue($q.resolve(mockTransactions));
    
    var dateRange = {start: new Date(2024, 0, 1), end: new Date(2024, 0, 31)};
    var result;
    
    dataAnalyticsService.getSpendingAnalytics(dateRange).then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(result.categories[0].percentageOfTotal).toBe('50.00');
    expect(result.categories[1].percentageOfTotal).toBe('50.00');
  });
  
  it('should generate monthly trends correctly', function() {
    var mockTransactions = [
      {transactionId: 't1', category: 'Food & Dining', amount: 150, date: new Date(2024, 0, 15)},
      {transactionId: 't2', category: 'Fuel', amount: 80, date: new Date(2024, 1, 10)}
    ];
    mockTransactionDataService.getTransactions.and.returnValue($q.resolve(mockTransactions));
    
    var dateRange = {start: new Date(2024, 0, 1), end: new Date(2024, 1, 28)};
    var result;
    
    dataAnalyticsService.getSpendingAnalytics(dateRange).then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(result.monthlyTrends.length).toBe(2);
    expect(result.monthlyTrends[0].month).toBe('2024-01');
    expect(result.monthlyTrends[0].totalSpend).toBe(150);
  });
});