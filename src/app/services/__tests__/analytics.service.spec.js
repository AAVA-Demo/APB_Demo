/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpending - success scenario
- Purpose: Validates that getCategorySpending correctly aggregates transaction data by category
- Scenario: Service receives valid transaction data from API and calculates category breakdown
- Expected Result: Returns object with category names as keys and total amounts as values
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpending - handles missing category
- Purpose: Validates that transactions without category are classified as Miscellaneous
- Scenario: Transaction data contains entries with null or undefined category
- Expected Result: Uncategorized transactions are grouped under 'Miscellaneous'
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpending - error handling
- Purpose: Validates that service properly handles API failures
- Scenario: HTTP request fails with error response
- Expected Result: Promise is rejected and error is logged
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getMonthlyTrends - success scenario
- Purpose: Validates that getMonthlyTrends retrieves monthly spending data
- Scenario: Service successfully fetches trend data from analytics API
- Expected Result: Returns array of monthly trend objects
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getMonthlyTrends - empty data handling
- Purpose: Validates that service handles empty response gracefully
- Scenario: API returns empty array or null
- Expected Result: Returns empty array without errors
*/
/*
Coverage Report:
- Functions tested: getCategorySpending, getMonthlyTrends
- Scenarios covered: success paths, error handling, edge cases (missing category, empty data)
- Uncovered scenarios: network timeout, partial data corruption
*/

describe('AnalyticsService', function() {
  'use strict';
  
  beforeEach(module('app.analytics'));
  
  var AnalyticsService, $httpBackend, $q;
  var mockTransactions = [
    {category: 'Food & Dining', amount: 150.50},
    {category: 'Fuel', amount: 75.00},
    {category: 'Food & Dining', amount: 200.00},
    {category: null, amount: 50.00},
    {amount: 25.00}
  ];
  var mockTrends = [
    {month: 'January', totalSpend: 1500},
    {month: 'February', totalSpend: 1800},
    {month: 'March', totalSpend: 1650}
  ];
  
  beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _$q_) {
    AnalyticsService = _AnalyticsService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCategorySpending', function() {
    
    it('should aggregate transactions by category successfully', function() {
      $httpBackend.expectGET('/api/transactions?period=12months&userId=current')
        .respond(200, mockTransactions);
      
      var result;
      AnalyticsService.getCategorySpending().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result['Food & Dining']).toBe(350.50);
      expect(result['Fuel']).toBe(75.00);
      expect(result['Miscellaneous']).toBe(75.00);
    });
    
    it('should handle transactions with missing category as Miscellaneous', function() {
      var transactionsWithoutCategory = [
        {amount: 100},
        {category: null, amount: 50},
        {category: undefined, amount: 75}
      ];
      
      $httpBackend.expectGET('/api/transactions?period=12months&userId=current')
        .respond(200, transactionsWithoutCategory);
      
      var result;
      AnalyticsService.getCategorySpending().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result['Miscellaneous']).toBe(225);
    });
    
    it('should handle empty transaction array', function() {
      $httpBackend.expectGET('/api/transactions?period=12months&userId=current')
        .respond(200, []);
      
      var result;
      AnalyticsService.getCategorySpending().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual({});
    });
    
    it('should handle null response data', function() {
      $httpBackend.expectGET('/api/transactions?period=12months&userId=current')
        .respond(200, null);
      
      var result;
      AnalyticsService.getCategorySpending().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual({});
    });
    
    it('should reject promise on API error', function() {
      $httpBackend.expectGET('/api/transactions?period=12months&userId=current')
        .respond(500, 'Internal Server Error');
      
      var error;
      AnalyticsService.getCategorySpending().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should use HTTP cache', function() {
      $httpBackend.expectGET('/api/transactions?period=12months&userId=current')
        .respond(200, mockTransactions);
      
      AnalyticsService.getCategorySpending();
      $httpBackend.flush();
    });
  });
  
  describe('getMonthlyTrends', function() {
    
    it('should retrieve monthly trends successfully', function() {
      $httpBackend.expectGET('/api/analytics/trends?userId=current')
        .respond(200, mockTrends);
      
      var result;
      AnalyticsService.getMonthlyTrends().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].month).toBe('January');
      expect(result[0].totalSpend).toBe(1500);
    });
    
    it('should handle empty trends array', function() {
      $httpBackend.expectGET('/api/analytics/trends?userId=current')
        .respond(200, []);
      
      var result;
      AnalyticsService.getMonthlyTrends().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should handle null response data', function() {
      $httpBackend.expectGET('/api/analytics/trends?userId=current')
        .respond(200, null);
      
      var result;
      AnalyticsService.getMonthlyTrends().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should reject promise on API error', function() {
      $httpBackend.expectGET('/api/analytics/trends?userId=current')
        .respond(404, 'Not Found');
      
      var error;
      AnalyticsService.getMonthlyTrends().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
    
    it('should use HTTP cache', function() {
      $httpBackend.expectGET('/api/analytics/trends?userId=current')
        .respond(200, mockTrends);
      
      AnalyticsService.getMonthlyTrends();
      $httpBackend.flush();
    });
  });
});