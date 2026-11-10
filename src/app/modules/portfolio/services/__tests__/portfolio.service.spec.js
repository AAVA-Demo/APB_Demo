/*
Test Documentation:
- Test Name: PortfolioService - getUserCards success
- Purpose: Verify service retrieves and processes user cards
- Scenario: HTTP request returns card data
- Expected Result: Cards with calculated utilization percentage
*/
/*
Test Documentation:
- Test Name: PortfolioService - getUserCards caching
- Purpose: Verify service caches card data
- Scenario: getUserCards called multiple times
- Expected Result: HTTP request made only once, cached data returned
*/
/*
Test Documentation:
- Test Name: PortfolioService - getCardSpendDetail
- Purpose: Verify service retrieves card spending details
- Scenario: HTTP request for specific card and month
- Expected Result: Card spend detail data returned
*/
/*
Test Documentation:
- Test Name: PortfolioService - clearCache
- Purpose: Verify cache clearing functionality
- Scenario: clearCache called after caching
- Expected Result: Next getUserCards makes new HTTP request
*/
/*
Test Documentation:
- Test Name: PortfolioService - utilization calculation
- Purpose: Verify utilization percentage calculation
- Scenario: Cards with various balance/limit ratios
- Expected Result: Correct percentage calculated for each card
*/
/*
Coverage Report:
- Functions tested: getUserCards, getCardSpendDetail, clearCache
- Scenarios covered: success paths, caching, calculation, error handling
- Uncovered scenarios: none
*/

describe('PortfolioService', function() {
  'use strict';

  var PortfolioService, $httpBackend, API_CONFIG;

  beforeEach(module('app.portfolio'));

  beforeEach(inject(function(_PortfolioService_, _$httpBackend_, _API_CONFIG_) {
    PortfolioService = _PortfolioService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    PortfolioService.clearCache();
  });

  it('should retrieve user cards and calculate utilization', function() {
    var userId = 'user123';
    var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.portfolioCards + '?userId=' + userId;

    var mockCards = [
      { cardId: 'card1', cardName: 'Card 1', creditLimit: 10000, currentBalance: 3000, availableCredit: 7000 },
      { cardId: 'card2', cardName: 'Card 2', creditLimit: 5000, currentBalance: 2500, availableCredit: 2500 }
    ];

    $httpBackend.expectGET(url).respond(200, mockCards);

    var result;
    PortfolioService.getUserCards(userId).then(function(cards) {
      result = cards;
    });

    $httpBackend.flush();

    expect(result.length).toBe(2);
    expect(result[0].utilizationPercentage).toBe('30.00');
    expect(result[1].utilizationPercentage).toBe('50.00');
  });

  it('should cache card data after first request', function() {
    var userId = 'user123';
    var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.portfolioCards + '?userId=' + userId;

    var mockCards = [
      { cardId: 'card1', creditLimit: 10000, currentBalance: 3000, availableCredit: 7000 }
    ];

    $httpBackend.expectGET(url).respond(200, mockCards);

    PortfolioService.getUserCards(userId);
    $httpBackend.flush();

    PortfolioService.getUserCards(userId);

    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should clear cache and make new request', function() {
    var userId = 'user123';
    var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.portfolioCards + '?userId=' + userId;

    var mockCards = [
      { cardId: 'card1', creditLimit: 10000, currentBalance: 3000, availableCredit: 7000 }
    ];

    $httpBackend.expectGET(url).respond(200, mockCards);
    PortfolioService.getUserCards(userId);
    $httpBackend.flush();

    PortfolioService.clearCache();

    $httpBackend.expectGET(url).respond(200, mockCards);
    PortfolioService.getUserCards(userId);
    $httpBackend.flush();
  });

  it('should retrieve card spend detail', function() {
    var cardId = 'card1';
    var month = '2026-11';
    var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardSpending.replace(':cardId', cardId) + '?month=' + month;

    var mockDetail = {
      categoryBreakdown: [{ category: 'Food', amount: 500 }],
      recentTransactions: [{ date: '2026-11-10', merchant: 'Store', amount: 100 }]
    };

    $httpBackend.expectGET(url).respond(200, mockDetail);

    var result;
    PortfolioService.getCardSpendDetail(cardId, month).then(function(detail) {
      result = detail;
    });

    $httpBackend.flush();

    expect(result.categoryBreakdown.length).toBe(1);
    expect(result.recentTransactions.length).toBe(1);
  });

  it('should handle zero credit limit in utilization calculation', function() {
    var userId = 'user123';
    var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.portfolioCards + '?userId=' + userId;

    var mockCards = [
      { cardId: 'card1', creditLimit: 0, currentBalance: 0, availableCredit: 0 }
    ];

    $httpBackend.expectGET(url).respond(200, mockCards);

    var result;
    PortfolioService.getUserCards(userId).then(function(cards) {
      result = cards;
    });

    $httpBackend.flush();

    expect(result[0].utilizationPercentage).toBe(0);
  });

  it('should handle HTTP error when retrieving cards', function() {
    var userId = 'user123';
    var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.portfolioCards + '?userId=' + userId;

    $httpBackend.expectGET(url).respond(500, 'Server error');

    var error;
    PortfolioService.getUserCards(userId).catch(function(err) {
      error = err;
    });

    $httpBackend.flush();

    expect(error).toBeDefined();
  });
});