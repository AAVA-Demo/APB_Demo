/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpend success
- Purpose: Validates that getCategorySpend returns category spending data
- Scenario: User requests category spending for 12 months
- Expected Result: Promise resolves with array of category spend data
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpend error
- Purpose: Validates error handling when API fails
- Scenario: HTTP request fails with 500 error
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getMonthlyTrend success
- Purpose: Validates monthly trend data retrieval
- Scenario: User requests 12 months of trend data
- Expected Result: Promise resolves with monthly trend array
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getMonthlyTrend with default months
- Purpose: Validates default parameter handling
- Scenario: User calls getMonthlyTrend without months parameter
- Expected Result: API called with default 12 months
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getCardSpend success
- Purpose: Validates card-wise spending data retrieval
- Scenario: User requests spending breakdown by card
- Expected Result: Promise resolves with card spend array
*/
/*
Coverage Report:
- Functions tested: getCategorySpend, getMonthlyTrend, getCardSpend
- Scenarios covered: success responses, error handling, default parameters, empty data arrays
- Uncovered scenarios: network timeout, partial data responses
*/

describe('AnalyticsService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AnalyticsService, $httpBackend, $q;
  
  beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _$q_) {
    AnalyticsService = _AnalyticsService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCategorySpend', function() {
    it('should return category spending data when API call succeeds', function() {
      var userId = 'user123';
      var dateRange = 12;
      var mockResponse = {
        categorySpend: [
          { category: 'Food & Dining', amount: 500 },
          { category: 'Fuel', amount: 200 }
        ]
      };
      
      $httpBackend.expectGET('/api/analytics/category?userId=' + userId + '&months=' + dateRange)
        .respond(200, mockResponse);
      
      var result;
      AnalyticsService.getCategorySpend(userId, dateRange).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse.categorySpend);
      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Food & Dining');
    });
    
    it('should return empty array when categorySpend is not in response', function() {
      var userId = 'user123';
      var mockResponse = {};
      
      $httpBackend.expectGET('/api/analytics/category?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      AnalyticsService.getCategorySpend(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should reject promise when API call fails', function() {
      var userId = 'user123';
      var errorResponse = { message: 'Internal Server Error' };
      
      $httpBackend.expectGET('/api/analytics/category?userId=' + userId)
        .respond(500, errorResponse);
      
      var error;
      AnalyticsService.getCategorySpend(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should not include months parameter when dateRange is not provided', function() {
      var userId = 'user123';
      var mockResponse = { categorySpend: [] };
      
      $httpBackend.expectGET('/api/analytics/category?userId=' + userId)
        .respond(200, mockResponse);
      
      AnalyticsService.getCategorySpend(userId);
      $httpBackend.flush();
    });
  });
  
  describe('getMonthlyTrend', function() {
    it('should return monthly trend data when API call succeeds', function() {
      var userId = 'user123';
      var months = 12;
      var mockResponse = {
        monthlyTrend: [
          { month: 'Jan 2023', totalSpend: 1500 },
          { month: 'Feb 2023', totalSpend: 1800 }
        ]
      };
      
      $httpBackend.expectGET('/api/analytics/trend?userId=' + userId + '&months=' + months)
        .respond(200, mockResponse);
      
      var result;
      AnalyticsService.getMonthlyTrend(userId, months).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse.monthlyTrend);
      expect(result.length).toBe(2);
    });
    
    it('should use default 12 months when months parameter is not provided', function() {
      var userId = 'user123';
      var mockResponse = { monthlyTrend: [] };
      
      $httpBackend.expectGET('/api/analytics/trend?userId=' + userId + '&months=12')
        .respond(200, mockResponse);
      
      AnalyticsService.getMonthlyTrend(userId);
      $httpBackend.flush();
    });
    
    it('should return empty array when monthlyTrend is not in response', function() {
      var userId = 'user123';
      var mockResponse = {};
      
      $httpBackend.expectGET('/api/analytics/trend?userId=' + userId + '&months=12')
        .respond(200, mockResponse);
      
      var result;
      AnalyticsService.getMonthlyTrend(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should reject promise when API call fails', function() {
      var userId = 'user123';
      
      $httpBackend.expectGET('/api/analytics/trend?userId=' + userId + '&months=6')
        .respond(404, { message: 'Not Found' });
      
      var error;
      AnalyticsService.getMonthlyTrend(userId, 6).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
  });
  
  describe('getCardSpend', function() {
    it('should return card spending data when API call succeeds', function() {
      var userId = 'user123';
      var mockResponse = {
        cardSpend: [
          { cardId: 'card1', cardName: 'Visa Platinum', totalSpend: 2500 },
          { cardId: 'card2', cardName: 'Mastercard Gold', totalSpend: 1800 }
        ]
      };
      
      $httpBackend.expectGET('/api/analytics/card?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      AnalyticsService.getCardSpend(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse.cardSpend);
      expect(result.length).toBe(2);
      expect(result[0].cardName).toBe('Visa Platinum');
    });
    
    it('should return empty array when cardSpend is not in response', function() {
      var userId = 'user123';
      var mockResponse = {};
      
      $httpBackend.expectGET('/api/analytics/card?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      AnalyticsService.getCardSpend(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should reject promise when API call fails', function() {
      var userId = 'user123';
      
      $httpBackend.expectGET('/api/analytics/card?userId=' + userId)
        .respond(500, { message: 'Server Error' });
      
      var error;
      AnalyticsService.getCardSpend(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });
});