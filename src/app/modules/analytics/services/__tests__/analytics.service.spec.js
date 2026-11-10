/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingInsights success
- Purpose: Verify service retrieves and aggregates transaction data
- Scenario: HTTP request returns transaction data
- Expected Result: Aggregated spending insights with category and monthly breakdown
*/
/*
Test Documentation:
- Test Name: AnalyticsService - aggregateTransactions accuracy
- Purpose: Verify transaction aggregation calculations
- Scenario: Multiple transactions across categories and months
- Expected Result: Correct totals, percentages, and counts
*/
/*
Test Documentation:
- Test Name: AnalyticsService - category percentage calculation
- Purpose: Verify percentage calculation for each category
- Scenario: Transactions with varying amounts
- Expected Result: Percentages sum to 100%, accurate to 2 decimals
*/
/*
Test Documentation:
- Test Name: AnalyticsService - monthly trend aggregation
- Purpose: Verify monthly spending trends are calculated correctly
- Scenario: Transactions span multiple months
- Expected Result: Monthly totals and category breakdowns accurate
*/
/*
Test Documentation:
- Test Name: AnalyticsService - empty transaction handling
- Purpose: Verify service handles empty transaction list
- Scenario: No transactions in date range
- Expected Result: Empty arrays, no errors
*/
/*
Coverage Report:
- Functions tested: getSpendingInsights, aggregateTransactions
- Scenarios covered: success path, calculations, edge cases, error handling
- Uncovered scenarios: none
*/

describe('AnalyticsService', function() {
  'use strict';

  var AnalyticsService, $httpBackend, API_CONFIG;

  beforeEach(module('app.analytics'));

  beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _API_CONFIG_) {
    AnalyticsService = _AnalyticsService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should retrieve and aggregate spending insights', function() {
    var userId = 'user123';
    var dateRange = { startMonth: '2026-01', endMonth: '2026-11' };
    var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?userId=' + userId + '&startMonth=' + dateRange.startMonth + '&endMonth=' + dateRange.endMonth;

    var mockTransactions = [
      { transactionDate: '2026-01-15', category: 'Food & Dining', amount: 500 },
      { transactionDate: '2026-01-20', category: 'Fuel', amount: 300 },
      { transactionDate: '2026-02-10', category: 'Food & Dining', amount: 600 },
      { transactionDate: '2026-02-15', category: 'Shopping', amount: 1000 }
    ];

    $httpBackend.expectGET(url).respond(200, mockTransactions);

    var result;
    AnalyticsService.getSpendingInsights(userId, dateRange).then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    expect(result.userId).toBe(userId);
    expect(result.dateRange).toEqual(dateRange);
    expect(result.categorySpending.length).toBe(3);
    expect(result.monthlyTrends.length).toBe(2);
  });

  it('should calculate category spending totals correctly', function() {
    var userId = 'user123';
    var dateRange = { startMonth: '2026-01', endMonth: '2026-11' };
    var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?userId=' + userId + '&startMonth=' + dateRange.startMonth + '&endMonth=' + dateRange.endMonth;

    var mockTransactions = [
      { transactionDate: '2026-01-15', category: 'Food & Dining', amount: 500 },
      { transactionDate: '2026-01-20', category: 'Food & Dining', amount: 300 },
      { transactionDate: '2026-02-10', category: 'Fuel', amount: 200 }
    ];

    $httpBackend.expectGET(url).respond(200, mockTransactions);

    var result;
    AnalyticsService.getSpendingInsights(userId, dateRange).then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    var foodCategory = result.categorySpending.find(function(cat) { return cat.category === 'Food & Dining'; });
    var fuelCategory = result.categorySpending.find(function(cat) { return cat.category === 'Fuel'; });

    expect(foodCategory.totalAmount).toBe(800);
    expect(foodCategory.transactionCount).toBe(2);
    expect(fuelCategory.totalAmount).toBe(200);
    expect(fuelCategory.transactionCount).toBe(1);
  });

  it('should calculate category percentages correctly', function() {
    var userId = 'user123';
    var dateRange = { startMonth: '2026-01', endMonth: '2026-11' };
    var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?userId=' + userId + '&startMonth=' + dateRange.startMonth + '&endMonth=' + dateRange.endMonth;

    var mockTransactions = [
      { transactionDate: '2026-01-15', category: 'Food & Dining', amount: 500 },
      { transactionDate: '2026-01-20', category: 'Fuel', amount: 500 }
    ];

    $httpBackend.expectGET(url).respond(200, mockTransactions);

    var result;
    AnalyticsService.getSpendingInsights(userId, dateRange).then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    var foodCategory = result.categorySpending.find(function(cat) { return cat.category === 'Food & Dining'; });
    var fuelCategory = result.categorySpending.find(function(cat) { return cat.category === 'Fuel'; });

    expect(foodCategory.percentage).toBe('50.00');
    expect(fuelCategory.percentage).toBe('50.00');
  });

  it('should aggregate monthly trends correctly', function() {
    var userId = 'user123';
    var dateRange = { startMonth: '2026-01', endMonth: '2026-11' };
    var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?userId=' + userId + '&startMonth=' + dateRange.startMonth + '&endMonth=' + dateRange.endMonth;

    var mockTransactions = [
      { transactionDate: '2026-01-15', category: 'Food & Dining', amount: 500 },
      { transactionDate: '2026-01-20', category: 'Fuel', amount: 300 },
      { transactionDate: '2026-02-10', category: 'Food & Dining', amount: 600 },
      { transactionDate: '2026-02-15', category: 'Shopping', amount: 400 }
    ];

    $httpBackend.expectGET(url).respond(200, mockTransactions);

    var result;
    AnalyticsService.getSpendingInsights(userId, dateRange).then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    expect(result.monthlyTrends.length).toBe(2);
    expect(result.monthlyTrends[0].month).toBe('2026-01');
    expect(result.monthlyTrends[0].totalSpend).toBe(800);
    expect(result.monthlyTrends[0].categoryBreakdown['Food & Dining']).toBe(500);
    expect(result.monthlyTrends[0].categoryBreakdown['Fuel']).toBe(300);
    expect(result.monthlyTrends[1].month).toBe('2026-02');
    expect(result.monthlyTrends[1].totalSpend).toBe(1000);
  });

  it('should handle empty transaction list', function() {
    var userId = 'user123';
    var dateRange = { startMonth: '2026-01', endMonth: '2026-11' };
    var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?userId=' + userId + '&startMonth=' + dateRange.startMonth + '&endMonth=' + dateRange.endMonth;

    $httpBackend.expectGET(url).respond(200, []);

    var result;
    AnalyticsService.getSpendingInsights(userId, dateRange).then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    expect(result.categorySpending.length).toBe(0);
    expect(result.monthlyTrends.length).toBe(0);
  });

  it('should handle HTTP error gracefully', function() {
    var userId = 'user123';
    var dateRange = { startMonth: '2026-01', endMonth: '2026-11' };
    var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?userId=' + userId + '&startMonth=' + dateRange.startMonth + '&endMonth=' + dateRange.endMonth;

    $httpBackend.expectGET(url).respond(500, 'Server error');

    var error;
    AnalyticsService.getSpendingInsights(userId, dateRange).catch(function(err) {
      error = err;
    });

    $httpBackend.flush();

    expect(error).toBeDefined();
  });

  it('should sort monthly trends chronologically', function() {
    var userId = 'user123';
    var dateRange = { startMonth: '2026-01', endMonth: '2026-11' };
    var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?userId=' + userId + '&startMonth=' + dateRange.startMonth + '&endMonth=' + dateRange.endMonth;

    var mockTransactions = [
      { transactionDate: '2026-03-15', category: 'Food & Dining', amount: 300 },
      { transactionDate: '2026-01-20', category: 'Fuel', amount: 100 },
      { transactionDate: '2026-02-10', category: 'Shopping', amount: 200 }
    ];

    $httpBackend.expectGET(url).respond(200, mockTransactions);

    var result;
    AnalyticsService.getSpendingInsights(userId, dateRange).then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    expect(result.monthlyTrends[0].month).toBe('2026-01');
    expect(result.monthlyTrends[1].month).toBe('2026-02');
    expect(result.monthlyTrends[2].month).toBe('2026-03');
  });
});