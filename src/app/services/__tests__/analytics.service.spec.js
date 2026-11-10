/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpend with valid filter
- Purpose: Validates that getCategorySpend retrieves category spending data successfully
- Scenario: Service is called with valid filter parameters
- Expected Result: Returns category spending data with correct structure
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpend with cache hit
- Purpose: Validates that cached data is returned without making HTTP request
- Scenario: Service is called twice with same filter
- Expected Result: Second call returns cached data immediately
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getMonthlyTrends with valid filter
- Purpose: Validates that getMonthlyTrends retrieves monthly trend data successfully
- Scenario: Service is called with valid date range filter
- Expected Result: Returns monthly trend data with correct structure
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getCardComparison with valid filter
- Purpose: Validates that getCardComparison retrieves card comparison data successfully
- Scenario: Service is called with valid filter
- Expected Result: Returns card comparison data with correct structure
*/
/*
Test Documentation:
- Test Name: AnalyticsService - error handling for API failures
- Purpose: Validates that service returns mock data when API fails
- Scenario: HTTP request returns 404 or network error
- Expected Result: Service returns mock data instead of rejecting
*/
/*
Coverage Report:
- Functions tested: getCategorySpend, getMonthlyTrends, getCardComparison, buildParams, generateMockCategoryData, generateMockTrendData, generateMockCardData
- Scenarios covered: successful API calls, cache hits, error handling with mock data fallback, filter parameter building
- Uncovered scenarios: cache expiration edge cases, concurrent requests
*/

describe('AnalyticsService', function() {
  'use strict';
  
  beforeEach(module('app.analytics'));
  beforeEach(module('app.shared'));
  
  var AnalyticsService, $httpBackend, $q, AuthService, $cacheFactory;
  
  beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _$q_, _AuthService_, _$cacheFactory_) {
    AnalyticsService = _AnalyticsService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    AuthService = _AuthService_;
    $cacheFactory = _$cacheFactory_;
    spyOn(AuthService, 'getToken').and.returnValue('mock-token-12345');
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCategorySpend', function() {
    it('should retrieve category spending data successfully', function() {
      var filter = {dateFrom: new Date('2024-01-01'), dateTo: new Date('2024-06-30')};
      var mockResponse = [
        {category: 'Food & Dining', amount: 8500, percentage: 34, transactionCount: 45, color: '#FF6384'},
        {category: 'Fuel', amount: 3200, percentage: 13, transactionCount: 18, color: '#36A2EB'}
      ];
      
      $httpBackend.expectGET(/\/api\/analytics\/category\?dateFrom=.*&dateTo=.*/).respond(200, mockResponse);
      
      var result;
      AnalyticsService.getCategorySpend(filter).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[0].amount).toBe(8500);
    });
    
    it('should return cached data on subsequent calls', function() {
      var filter = {dateFrom: new Date('2024-01-01'), dateTo: new Date('2024-06-30')};
      var mockResponse = [{category: 'Food & Dining', amount: 8500}];
      
      $httpBackend.expectGET(/\/api\/analytics\/category\?dateFrom=.*&dateTo=.*/).respond(200, mockResponse);
      
      var result1, result2;
      AnalyticsService.getCategorySpend(filter).then(function(data) {
        result1 = data;
      });
      
      $httpBackend.flush();
      
      AnalyticsService.getCategorySpend(filter).then(function(data) {
        result2 = data;
      });
      
      expect(result1).toEqual(result2);
    });
    
    it('should return mock data when API returns 404', function() {
      var filter = {};
      
      $httpBackend.expectGET('/api/analytics/category').respond(404);
      
      var result;
      AnalyticsService.getCategorySpend(filter).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(9);
      expect(result[0].category).toBe('Food & Dining');
    });
  });
  
  describe('getMonthlyTrends', function() {
    it('should retrieve monthly trend data successfully', function() {
      var filter = {dateFrom: new Date('2024-01-01'), dateTo: new Date('2024-06-30')};
      var mockResponse = [
        {month: '2024-01', totalSpend: 25000, cardBreakdown: [{cardId: 'c1', amount: 10000}]},
        {month: '2024-02', totalSpend: 28000, cardBreakdown: [{cardId: 'c1', amount: 12000}]}
      ];
      
      $httpBackend.expectGET(/\/api\/analytics\/trends\?dateFrom=.*&dateTo=.*/).respond(200, mockResponse);
      
      var result;
      AnalyticsService.getMonthlyTrends(filter).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].month).toBe('2024-01');
      expect(result[0].totalSpend).toBe(25000);
    });
    
    it('should return mock data when API fails', function() {
      var filter = {};
      
      $httpBackend.expectGET('/api/analytics/trends').respond(-1);
      
      var result;
      AnalyticsService.getMonthlyTrends(filter).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(6);
      expect(result[0].totalSpend).toBeGreaterThan(0);
    });
  });
  
  describe('getCardComparison', function() {
    it('should retrieve card comparison data successfully', function() {
      var filter = {cardIds: ['c1', 'c2']};
      var mockResponse = [
        {cardId: 'c1', cardNumber: '**** 1234', totalSpend: 12000},
        {cardId: 'c2', cardNumber: '**** 5678', totalSpend: 8000}
      ];
      
      $httpBackend.expectGET('/api/analytics/cards?cardIds=c1%2Cc2').respond(200, mockResponse);
      
      var result;
      AnalyticsService.getCardComparison(filter).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('c1');
      expect(result[0].totalSpend).toBe(12000);
    });
    
    it('should return mock data when API returns 404', function() {
      var filter = {};
      
      $httpBackend.expectGET('/api/analytics/cards').respond(404);
      
      var result;
      AnalyticsService.getCardComparison(filter).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].cardId).toBe('c1');
    });
  });
});