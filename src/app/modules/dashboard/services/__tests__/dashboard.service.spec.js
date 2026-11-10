/*
Test Documentation:
- Test Name: DashboardService - getKPIs success
- Purpose: Verify service aggregates card and transaction data correctly
- Scenario: HTTP requests return valid data
- Expected Result: KPI object with calculated values is returned
*/
/*
Test Documentation:
- Test Name: DashboardService - getKPIs calculation accuracy
- Purpose: Verify mathematical calculations for credit utilization
- Scenario: Multiple cards with varying balances
- Expected Result: Totals and percentages calculated correctly
*/
/*
Test Documentation:
- Test Name: DashboardService - getKPIs error handling
- Purpose: Verify service handles HTTP errors gracefully
- Scenario: HTTP request fails
- Expected Result: Promise is rejected
*/
/*
Test Documentation:
- Test Name: DashboardService - zero credit limit edge case
- Purpose: Verify utilization calculation when credit limit is zero
- Scenario: Cards have zero credit limit
- Expected Result: Utilization is 0, no division by zero error
*/
/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered: success path, calculation accuracy, error handling, edge cases
- Uncovered scenarios: none
*/

describe('DashboardService', function() {
  'use strict';

  var DashboardService, $httpBackend, API_CONFIG;

  beforeEach(module('app.dashboard'));

  beforeEach(inject(function(_DashboardService_, _$httpBackend_, _API_CONFIG_) {
    DashboardService = _DashboardService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should aggregate KPIs correctly from multiple cards', function() {
    var userId = 'user123';
    var currentMonth = new Date().toISOString().slice(0, 7);
    var cardSummaryUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardsSummary + '?userId=' + userId;
    var monthlyTransUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionsMonthly + '?userId=' + userId + '&month=' + currentMonth;

    var mockCards = [
      { creditLimit: 10000, availableCredit: 7000, currentBalance: 3000 },
      { creditLimit: 20000, availableCredit: 15000, currentBalance: 5000 },
      { creditLimit: 15000, availableCredit: 10000, currentBalance: 5000 }
    ];

    var mockTransactions = { totalSpend: 2500 };

    $httpBackend.expectGET(cardSummaryUrl).respond(200, mockCards);
    $httpBackend.expectGET(monthlyTransUrl).respond(200, mockTransactions);

    var result;
    DashboardService.getKPIs(userId).then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    expect(result.userId).toBe(userId);
    expect(result.month).toBe(currentMonth);
    expect(result.monthlySpend).toBe(2500);
    expect(result.totalCreditLimit).toBe(45000);
    expect(result.availableCredit).toBe(32000);
    expect(result.outstandingAmount).toBe(13000);
    expect(result.overallUtilization).toBe('28.89');
    expect(result.cardCount).toBe(3);
    expect(result.lastUpdated).toBeDefined();
  });

  it('should handle zero credit limit without division error', function() {
    var userId = 'user123';
    var currentMonth = new Date().toISOString().slice(0, 7);
    var cardSummaryUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardsSummary + '?userId=' + userId;
    var monthlyTransUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionsMonthly + '?userId=' + userId + '&month=' + currentMonth;

    var mockCards = [
      { creditLimit: 0, availableCredit: 0, currentBalance: 0 }
    ];

    var mockTransactions = { totalSpend: 0 };

    $httpBackend.expectGET(cardSummaryUrl).respond(200, mockCards);
    $httpBackend.expectGET(monthlyTransUrl).respond(200, mockTransactions);

    var result;
    DashboardService.getKPIs(userId).then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    expect(result.overallUtilization).toBe('0');
    expect(result.totalCreditLimit).toBe(0);
  });

  it('should handle missing totalSpend in transactions', function() {
    var userId = 'user123';
    var currentMonth = new Date().toISOString().slice(0, 7);
    var cardSummaryUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardsSummary + '?userId=' + userId;
    var monthlyTransUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionsMonthly + '?userId=' + userId + '&month=' + currentMonth;

    var mockCards = [
      { creditLimit: 10000, availableCredit: 8000, currentBalance: 2000 }
    ];

    var mockTransactions = {};

    $httpBackend.expectGET(cardSummaryUrl).respond(200, mockCards);
    $httpBackend.expectGET(monthlyTransUrl).respond(200, mockTransactions);

    var result;
    DashboardService.getKPIs(userId).then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    expect(result.monthlySpend).toBe(0);
  });

  it('should handle HTTP error gracefully', function() {
    var userId = 'user123';
    var currentMonth = new Date().toISOString().slice(0, 7);
    var cardSummaryUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardsSummary + '?userId=' + userId;

    $httpBackend.expectGET(cardSummaryUrl).respond(500, 'Server error');

    var error;
    DashboardService.getKPIs(userId).catch(function(err) {
      error = err;
    });

    $httpBackend.flush();

    expect(error).toBeDefined();
  });

  it('should calculate utilization percentage correctly', function() {
    var userId = 'user123';
    var currentMonth = new Date().toISOString().slice(0, 7);
    var cardSummaryUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardsSummary + '?userId=' + userId;
    var monthlyTransUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionsMonthly + '?userId=' + userId + '&month=' + currentMonth;

    var mockCards = [
      { creditLimit: 10000, availableCredit: 5000, currentBalance: 5000 }
    ];

    var mockTransactions = { totalSpend: 1000 };

    $httpBackend.expectGET(cardSummaryUrl).respond(200, mockCards);
    $httpBackend.expectGET(monthlyTransUrl).respond(200, mockTransactions);

    var result;
    DashboardService.getKPIs(userId).then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    expect(result.overallUtilization).toBe('50.00');
  });
});