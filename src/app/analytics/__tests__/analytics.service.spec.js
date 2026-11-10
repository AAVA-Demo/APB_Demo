/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingData success
- Purpose: Validates successful retrieval of spending data
- Scenario: HTTP call succeeds
- Expected Result: Returns spending data and caches it
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingData with cache
- Purpose: Validates cache functionality
- Scenario: Data is cached and within TTL
- Expected Result: Returns cached data without HTTP call
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingData error handling
- Purpose: Validates error handling with cached fallback
- Scenario: HTTP call fails but cache exists
- Expected Result: Returns cached data
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getMockAnalytics
- Purpose: Validates mock data generation
- Scenario: Mock data is requested
- Expected Result: Returns complete mock analytics data
*/
/*
Coverage Report:
- Functions tested: getSpendingData, getMockAnalytics
- Scenarios covered: success, caching, error with cache, error without cache, mock data
- Uncovered scenarios: none
*/

describe('AnalyticsService', function() {
  'use strict';
  
  beforeEach(module('analyticsModule'));
  
  var AnalyticsService, $httpBackend, $q, CategoryService;
  var mockResponse = {
    categoryBreakdown: [{ category: 'Food & Dining', amount: 5000, percentage: 15 }],
    monthlyTrends: [{ month: 'Jan', totalSpend: 30000 }],
    cardWiseSpend: [{ cardId: '1', cardName: 'Visa Platinum', totalSpend: 15000 }]
  };
  
  beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _$q_, _CategoryService_) {
    AnalyticsService = _AnalyticsService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    CategoryService = _CategoryService_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getSpendingData', function() {
    it('should fetch spending data successfully', function() {
      var filters = { dateRange: '30', cardIds: ['1'], categories: ['Food & Dining'] };
      $httpBackend.expectGET('/api/analytics/spending?cardIds=1&categories=Food%20%26%20Dining&dateRange=30').respond(200, mockResponse);
      
      var result;
      AnalyticsService.getSpendingData(filters).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
      expect(result.categoryBreakdown.length).toBe(1);
    });
    
    it('should handle empty filters', function() {
      $httpBackend.expectGET('/api/analytics/spending').respond(200, mockResponse);
      
      var result;
      AnalyticsService.getSpendingData(null).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
    });
    
    it('should return cached data within TTL', function() {
      var filters = { dateRange: '30' };
      $httpBackend.expectGET('/api/analytics/spending?dateRange=30').respond(200, mockResponse);
      
      AnalyticsService.getSpendingData(filters);
      $httpBackend.flush();
      
      var cachedResult;
      AnalyticsService.getSpendingData(filters).then(function(data) {
        cachedResult = data;
      });
      
      expect(cachedResult).toEqual(mockResponse);
    });
    
    it('should handle HTTP errors and return cached data if available', function() {
      var filters = { dateRange: '30' };
      $httpBackend.expectGET('/api/analytics/spending?dateRange=30').respond(200, mockResponse);
      
      AnalyticsService.getSpendingData(filters);
      $httpBackend.flush();
      
      $httpBackend.expectGET('/api/analytics/spending?dateRange=30').respond(500, 'Server Error');
      
      var result;
      AnalyticsService.getSpendingData(filters).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
    });
    
    it('should reject promise when HTTP fails and no cache exists', function() {
      var filters = { dateRange: '30' };
      $httpBackend.expectGET('/api/analytics/spending?dateRange=30').respond(500, 'Server Error');
      
      var rejected = false;
      AnalyticsService.getSpendingData(filters).catch(function() {
        rejected = true;
      });
      
      $httpBackend.flush();
      
      expect(rejected).toBe(true);
    });
  });
  
  describe('getMockAnalytics', function() {
    it('should return mock analytics data', function() {
      var result;
      AnalyticsService.getMockAnalytics().then(function(data) {
        result = data;
      });
      
      expect(result).toBeDefined();
      expect(result.categoryBreakdown).toBeDefined();
      expect(result.categoryBreakdown.length).toBe(9);
      expect(result.monthlyTrends).toBeDefined();
      expect(result.monthlyTrends.length).toBe(6);
      expect(result.cardWiseSpend).toBeDefined();
      expect(result.cardWiseSpend.length).toBe(3);
    });
    
    it('should return all 9 spending categories', function() {
      var result;
      AnalyticsService.getMockAnalytics().then(function(data) {
        result = data;
      });
      
      var categories = result.categoryBreakdown.map(function(item) { return item.category; });
      expect(categories).toContain('Food & Dining');
      expect(categories).toContain('Fuel');
      expect(categories).toContain('Shopping');
      expect(categories).toContain('Travel');
      expect(categories).toContain('Entertainment');
      expect(categories).toContain('Utilities');
      expect(categories).toContain('Healthcare');
      expect(categories).toContain('Education');
      expect(categories).toContain('Miscellaneous');
    });
  });
});