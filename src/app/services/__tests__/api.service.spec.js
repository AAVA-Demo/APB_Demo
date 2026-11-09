/*
Test Documentation:
- Test Name: ApiService - Mock Mode KPI Dashboard Data Retrieval
- Purpose: Validates that ApiService correctly returns KPI dashboard data in mock mode
- Scenario: When get() is called with '/kpi/dashboard' endpoint in mock mode
- Expected Result: Promise resolves with mockData.kpi containing userId, monthlySpend, totalCreditLimit, availableCredit, outstandingAmount, and lastUpdated
*/

/*
Test Documentation:
- Test Name: ApiService - Mock Mode Card Portfolio Retrieval
- Purpose: Validates that ApiService correctly returns card portfolio data in mock mode
- Scenario: When get() is called with '/cards/portfolio' endpoint in mock mode
- Expected Result: Promise resolves with portfolio object containing userId, cards array, totalCreditLimit, and totalUtilization
*/

/*
Test Documentation:
- Test Name: ApiService - Mock Mode Card Details Retrieval
- Purpose: Validates that ApiService correctly returns individual card details in mock mode
- Scenario: When get() is called with '/cards/c1/details' endpoint in mock mode
- Expected Result: Promise resolves with card object matching cardId 'c1' from mockData.cards
*/

/*
Test Documentation:
- Test Name: ApiService - Mock Mode Analytics Spending Data Retrieval
- Purpose: Validates that ApiService correctly returns spending analytics data in mock mode
- Scenario: When get() is called with '/analytics/spending' endpoint in mock mode
- Expected Result: Promise resolves with spending object containing userId, timeRange, categories, and monthlyTrends
*/

/*
Test Documentation:
- Test Name: ApiService - Mock Mode 404 Error Handling
- Purpose: Validates that ApiService correctly handles unknown endpoints in mock mode
- Scenario: When get() is called with an unrecognized endpoint in mock mode
- Expected Result: Promise rejects with status 404 and statusText 'Not Found'
*/

/*
Test Documentation:
- Test Name: ApiService - Mock Mode Card Details Not Found
- Purpose: Validates that ApiService returns empty object when card ID does not exist
- Scenario: When get() is called with '/cards/invalid-id/details' endpoint in mock mode
- Expected Result: Promise resolves with empty object {}
*/

/*
Test Documentation:
- Test Name: ApiService - Mock Mode Timeout Simulation
- Purpose: Validates that ApiService simulates network delay with setTimeout in mock mode
- Scenario: When get() is called with any valid endpoint in mock mode
- Expected Result: Promise resolves after 300ms delay
*/

/*
Coverage Report:
- Functions tested: get (ApiService factory method)
- Scenarios covered:
  * KPI dashboard data retrieval (success)
  * Card portfolio retrieval (success)
  * Individual card details retrieval (success)
  * Card details not found (edge case)
  * Analytics spending data retrieval (success)
  * Unknown endpoint error handling (error case)
  * Network delay simulation (timing validation)
- Uncovered scenarios:
  * Real HTTP mode ($http.get) - requires integration testing
  * HTTP error handling in non-mock mode
  * baseUrl configuration changes
*/

describe('ApiService', function() {
  'use strict';

  var ApiService, $q, $rootScope, $timeout;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_ApiService_, _$q_, _$rootScope_, _$timeout_) {
    ApiService = _ApiService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  describe('get() method in mock mode', function() {

    it('should return KPI dashboard data when endpoint is /kpi/dashboard', function(done) {
      var result;
      ApiService.get('/kpi/dashboard').then(function(response) {
        result = response.data;
        expect(result).toBeDefined();
        expect(result.userId).toBe('user123');
        expect(result.monthlySpend).toBe(4250.75);
        expect(result.totalCreditLimit).toBe(50000);
        expect(result.availableCredit).toBe(38500);
        expect(result.outstandingAmount).toBe(11500);
        expect(result.lastUpdated).toBeDefined();
        expect(result.lastUpdated instanceof Date).toBe(true);
        done();
      });
      $timeout.flush();
    });

    it('should return card portfolio data when endpoint is /cards/portfolio', function(done) {
      var result;
      ApiService.get('/cards/portfolio').then(function(response) {
        result = response.data;
        expect(result).toBeDefined();
        expect(result.userId).toBe('user123');
        expect(result.cards).toBeDefined();
        expect(Array.isArray(result.cards)).toBe(true);
        expect(result.cards.length).toBe(3);
        expect(result.totalCreditLimit).toBe(50000);
        expect(result.totalUtilization).toBe(23);
        done();
      });
      $timeout.flush();
    });

    it('should return individual card details when endpoint is /cards/:cardId/details', function(done) {
      var result;
      ApiService.get('/cards/c1/details').then(function(response) {
        result = response.data;
        expect(result).toBeDefined();
        expect(result.cardId).toBe('c1');
        expect(result.userId).toBe('user123');
        expect(result.cardNumber).toBe('**** 1234');
        expect(result.cardType).toBe('Visa');
        expect(result.creditLimit).toBe(20000);
        expect(result.currentBalance).toBe(5000);
        expect(result.availableCredit).toBe(15000);
        expect(result.utilizationPercentage).toBe(25);
        expect(result.monthlySpend).toBe(1800);
        expect(result.issuer).toBe('Chase');
        done();
      });
      $timeout.flush();
    });

    it('should return empty object when card ID does not exist', function(done) {
      var result;
      ApiService.get('/cards/invalid-id/details').then(function(response) {
        result = response.data;
        expect(result).toBeDefined();
        expect(Object.keys(result).length).toBe(0);
        done();
      });
      $timeout.flush();
    });

    it('should return analytics spending data when endpoint is /analytics/spending', function(done) {
      var result;
      ApiService.get('/analytics/spending').then(function(response) {
        result = response.data;
        expect(result).toBeDefined();
        expect(result.userId).toBe('user123');
        expect(result.timeRange).toBeDefined();
        expect(result.timeRange.startDate).toBeDefined();
        expect(result.timeRange.endDate).toBeDefined();
        expect(result.categories).toBeDefined();
        expect(Array.isArray(result.categories)).toBe(true);
        expect(result.categories.length).toBe(9);
        expect(result.categories[0].name).toBe('Food & Dining');
        expect(result.categories[0].amount).toBe(1250.50);
        expect(result.categories[0].percentage).toBe(29.4);
        expect(result.categories[0].transactionCount).toBe(45);
        expect(result.monthlyTrends).toBeDefined();
        expect(Array.isArray(result.monthlyTrends)).toBe(true);
        expect(result.monthlyTrends.length).toBe(4);
        done();
      });
      $timeout.flush();
    });

    it('should reject promise with 404 error for unknown endpoints', function(done) {
      ApiService.get('/unknown/endpoint').catch(function(error) {
        expect(error).toBeDefined();
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        done();
      });
      $timeout.flush();
    });

    it('should simulate network delay with 300ms timeout', function() {
      var resolved = false;
      ApiService.get('/kpi/dashboard').then(function() {
        resolved = true;
      });
      expect(resolved).toBe(false);
      $timeout.flush(299);
      expect(resolved).toBe(false);
      $timeout.flush(1);
      expect(resolved).toBe(true);
    });

    it('should return correct card details for cardId c2', function(done) {
      var result;
      ApiService.get('/cards/c2/details').then(function(response) {
        result = response.data;
        expect(result.cardId).toBe('c2');
        expect(result.cardType).toBe('Mastercard');
        expect(result.issuer).toBe('Citi');
        done();
      });
      $timeout.flush();
    });

    it('should return correct card details for cardId c3', function(done) {
      var result;
      ApiService.get('/cards/c3/details').then(function(response) {
        result = response.data;
        expect(result.cardId).toBe('c3');
        expect(result.cardType).toBe('Amex');
        expect(result.issuer).toBe('American Express');
        done();
      });
      $timeout.flush();
    });

    it('should handle endpoint with query parameters for analytics', function(done) {
      ApiService.get('/analytics/spending?start=2025-01-01&end=2025-04-30').then(function(response) {
        expect(response.data).toBeDefined();
        expect(response.data.userId).toBe('user123');
        done();
      });
      $timeout.flush();
    });

  });

  describe('edge cases and error scenarios', function() {

    it('should handle multiple concurrent requests independently', function() {
      var result1, result2, result3;
      ApiService.get('/kpi/dashboard').then(function(response) {
        result1 = response.data.userId;
      });
      ApiService.get('/cards/portfolio').then(function(response) {
        result2 = response.data.userId;
      });
      ApiService.get('/analytics/spending').then(function(response) {
        result3 = response.data.userId;
      });
      $timeout.flush();
      expect(result1).toBe('user123');
      expect(result2).toBe('user123');
      expect(result3).toBe('user123');
    });

    it('should return consistent data structure for KPI endpoint', function(done) {
      ApiService.get('/kpi/dashboard').then(function(response) {
        var keys = Object.keys(response.data);
        expect(keys).toContain('userId');
        expect(keys).toContain('monthlySpend');
        expect(keys).toContain('totalCreditLimit');
        expect(keys).toContain('availableCredit');
        expect(keys).toContain('outstandingAmount');
        expect(keys).toContain('lastUpdated');
        done();
      });
      $timeout.flush();
    });

    it('should return array of cards with correct structure', function(done) {
      ApiService.get('/cards/portfolio').then(function(response) {
        var firstCard = response.data.cards[0];
        expect(firstCard.cardId).toBeDefined();
        expect(firstCard.userId).toBeDefined();
        expect(firstCard.cardNumber).toBeDefined();
        expect(firstCard.cardType).toBeDefined();
        expect(firstCard.creditLimit).toBeDefined();
        expect(firstCard.currentBalance).toBeDefined();
        expect(firstCard.availableCredit).toBeDefined();
        expect(firstCard.utilizationPercentage).toBeDefined();
        expect(firstCard.monthlySpend).toBeDefined();
        expect(firstCard.issuer).toBeDefined();
        done();
      });
      $timeout.flush();
    });

    it('should return all 9 spending categories with correct names', function(done) {
      ApiService.get('/analytics/spending').then(function(response) {
        var categoryNames = response.data.categories.map(function(cat) { return cat.name; });
        expect(categoryNames).toContain('Food & Dining');
        expect(categoryNames).toContain('Fuel');
        expect(categoryNames).toContain('Shopping');
        expect(categoryNames).toContain('Travel');
        expect(categoryNames).toContain('Entertainment');
        expect(categoryNames).toContain('Utilities');
        expect(categoryNames).toContain('Healthcare');
        expect(categoryNames).toContain('Education');
        expect(categoryNames).toContain('Miscellaneous');
        done();
      });
      $timeout.flush();
    });

  });

});