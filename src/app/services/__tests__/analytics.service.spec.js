/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingTrends with valid filter
- Purpose: Validates that getSpendingTrends returns properly formatted spending trends
- Scenario: Service is called with valid filter parameters
- Expected Result: Returns promise resolving to array of trend objects with month, totalSpend, and categoryBreakdown

Test Documentation:
- Test Name: AnalyticsService - getSpendingTrends with default dates
- Purpose: Validates that default date range is applied when filter has no dates
- Scenario: Service is called with empty filter object
- Expected Result: Uses last 12 months as default date range

Test Documentation:
- Test Name: AnalyticsService - getSpendingTrends with category filter
- Purpose: Validates that selected categories are properly passed as query parameters
- Scenario: Service is called with selectedCategories array in filter
- Expected Result: Categories are joined with comma and sent as params.categories

Test Documentation:
- Test Name: AnalyticsService - getSpendingTrends with cardId filter
- Purpose: Validates that cardId is properly passed when provided
- Scenario: Service is called with cardId in filter
- Expected Result: cardId is included in request parameters

Test Documentation:
- Test Name: AnalyticsService - getSpendingTrends HTTP error handling
- Purpose: Validates that service properly handles HTTP errors
- Scenario: Backend returns error response
- Expected Result: Promise is rejected with error object

Coverage Report:
- Functions tested: getSpendingTrends, getDefaultStartDate, getDefaultEndDate
- Scenarios covered: valid filter, default dates, category filtering, cardId filtering, error handling
- Uncovered scenarios: none
*/

describe('AnalyticsService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AnalyticsService, $httpBackend, API_CONFIG;
  
  beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _API_CONFIG_) {
    AnalyticsService = _AnalyticsService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getSpendingTrends', function() {
    it('should return spending trends with valid filter', function() {
      var filter = {
        startDate: '2023-01',
        endDate: '2023-12'
      };
      var mockResponse = [
        { month: '2023-01', totalSpend: 1500.50, categoryBreakdown: [{category: 'Food', amount: 500}] },
        { month: '2023-02', totalSpend: 2000.75, categoryBreakdown: [{category: 'Travel', amount: 1000}] }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/spending-trends?endDate=2023-12&startDate=2023-01')
        .respond(200, mockResponse);
      
      var result;
      AnalyticsService.getSpendingTrends(filter).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].month).toBe('2023-01');
      expect(result[0].totalSpend).toBe(1500.50);
      expect(result[0].categoryBreakdown).toEqual([{category: 'Food', amount: 500}]);
    });
    
    it('should use default dates when filter has no dates', function() {
      var filter = {};
      var mockResponse = [];
      
      var currentDate = new Date();
      var startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 11);
      var expectedStartDate = startDate.toISOString().substring(0, 7);
      var expectedEndDate = currentDate.toISOString().substring(0, 7);
      
      $httpBackend.expectGET(function(url) {
        return url.indexOf('/spending-trends') > -1 && 
               url.indexOf('startDate=' + expectedStartDate) > -1 &&
               url.indexOf('endDate=' + expectedEndDate) > -1;
      }).respond(200, mockResponse);
      
      var result;
      AnalyticsService.getSpendingTrends(filter).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should include selected categories in request params', function() {
      var filter = {
        startDate: '2023-01',
        endDate: '2023-12',
        selectedCategories: ['Food & Dining', 'Travel', 'Shopping']
      };
      var mockResponse = [];
      
      $httpBackend.expectGET(function(url) {
        return url.indexOf('/spending-trends') > -1 && 
               url.indexOf('categories=Food+%26+Dining%2CTravel%2CShopping') > -1;
      }).respond(200, mockResponse);
      
      AnalyticsService.getSpendingTrends(filter);
      $httpBackend.flush();
    });
    
    it('should include cardId in request params when provided', function() {
      var filter = {
        startDate: '2023-01',
        endDate: '2023-12',
        cardId: 'card-123'
      };
      var mockResponse = [];
      
      $httpBackend.expectGET(function(url) {
        return url.indexOf('/spending-trends') > -1 && 
               url.indexOf('cardId=card-123') > -1;
      }).respond(200, mockResponse);
      
      AnalyticsService.getSpendingTrends(filter);
      $httpBackend.flush();
    });
    
    it('should handle HTTP errors gracefully', function() {
      var filter = { startDate: '2023-01', endDate: '2023-12' };
      var errorResponse = { message: 'Server error' };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/spending-trends?endDate=2023-12&startDate=2023-01')
        .respond(500, errorResponse);
      
      var error;
      AnalyticsService.getSpendingTrends(filter).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should handle empty categoryBreakdown in response', function() {
      var filter = { startDate: '2023-01', endDate: '2023-12' };
      var mockResponse = [
        { month: '2023-01', totalSpend: 1500.50 }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/spending-trends?endDate=2023-12&startDate=2023-01')
        .respond(200, mockResponse);
      
      var result;
      AnalyticsService.getSpendingTrends(filter).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result[0].categoryBreakdown).toEqual([]);
    });
    
    it('should not include categories param when selectedCategories is empty', function() {
      var filter = {
        startDate: '2023-01',
        endDate: '2023-12',
        selectedCategories: []
      };
      var mockResponse = [];
      
      $httpBackend.expectGET(function(url) {
        return url.indexOf('/spending-trends') > -1 && 
               url.indexOf('categories=') === -1;
      }).respond(200, mockResponse);
      
      AnalyticsService.getSpendingTrends(filter);
      $httpBackend.flush();
    });
  });
});