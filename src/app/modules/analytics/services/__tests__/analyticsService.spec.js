/*
Test Documentation:
- Test Name: AnalyticsService Unit Tests
- Purpose: Validate analytics data retrieval and category validation
- Scenario: Test getSpendingAnalytics with successful response, category validation, and error handling
- Expected Result: Correct analytics data with validated categories
*/

describe('AnalyticsService', function() {
  'use strict';
  
  beforeEach(module('creditCard.analytics'));
  
  var AnalyticsService, CategorizationService, $httpBackend;
  var mockAnalyticsData;
  
  beforeEach(inject(function(_AnalyticsService_, _CategorizationService_, _$httpBackend_) {
    AnalyticsService = _AnalyticsService_;
    CategorizationService = _CategorizationService_;
    $httpBackend = _$httpBackend_;
    
    mockAnalyticsData = {
      monthlyTrends: [
        { month: 'Jan 2023', amount: 1500 },
        { month: 'Feb 2023', amount: 1800 }
      ],
      cardWiseSpend: [
        { cardName: 'Visa Gold', amount: 2000 },
        { cardName: 'Mastercard', amount: 1300 }
      ],
      categoryWiseSpend: [
        { category: 'Food & Dining', amount: 800 },
        { category: 'Fuel', amount: 500 },
        { category: 'Shopping', amount: 1000 }
      ]
    };
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getSpendingAnalytics', function() {
    it('should fetch spending analytics for a user', function() {
      $httpBackend.expectGET('/api/analytics/spending?userId=user123').respond(200, mockAnalyticsData);
      
      AnalyticsService.getSpendingAnalytics('user123').then(function(data) {
        expect(data.monthlyTrends).toEqual(mockAnalyticsData.monthlyTrends);
        expect(data.cardWiseSpend).toEqual(mockAnalyticsData.cardWiseSpend);
        expect(data.categoryWiseSpend).toBeDefined();
      });
      
      $httpBackend.flush();
    });
    
    it('should validate categories using CategorizationService', function() {
      spyOn(CategorizationService, 'validateCategories').and.callThrough();
      
      $httpBackend.expectGET('/api/analytics/spending?userId=user123').respond(200, mockAnalyticsData);
      
      AnalyticsService.getSpendingAnalytics('user123').then(function() {
        expect(CategorizationService.validateCategories).toHaveBeenCalledWith(mockAnalyticsData.categoryWiseSpend);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle API errors', function() {
      $httpBackend.expectGET('/api/analytics/spending?userId=user123').respond(500, 'Server Error');
      
      AnalyticsService.getSpendingAnalytics('user123').catch(function(error) {
        expect(error.status).toBe(500);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle network errors', function() {
      $httpBackend.expectGET('/api/analytics/spending?userId=user123').respond(0, '');
      
      AnalyticsService.getSpendingAnalytics('user123').catch(function(error) {
        expect(error.status).toBe(0);
      });
      
      $httpBackend.flush();
    });
    
    it('should pass userId as query parameter', function() {
      $httpBackend.expectGET('/api/analytics/spending?userId=testUser').respond(200, mockAnalyticsData);
      
      AnalyticsService.getSpendingAnalytics('testUser');
      
      $httpBackend.flush();
    });
    
    it('should handle empty analytics data', function() {
      var emptyData = {
        monthlyTrends: [],
        cardWiseSpend: [],
        categoryWiseSpend: []
      };
      
      $httpBackend.expectGET('/api/analytics/spending?userId=user123').respond(200, emptyData);
      
      AnalyticsService.getSpendingAnalytics('user123').then(function(data) {
        expect(data.monthlyTrends.length).toBe(0);
        expect(data.cardWiseSpend.length).toBe(0);
        expect(data.categoryWiseSpend.length).toBe(0);
      });
      
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getSpendingAnalytics
- Scenarios covered:
  * Successful analytics data fetch
  * Category validation integration
  * Server error handling
  * Network error handling
  * Correct parameter passing
  * Empty data handling
- Edge cases: Empty arrays, network failures, server errors
- Uncovered scenarios: Partial data, invalid date formats, very large datasets
*/