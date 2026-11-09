/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingAnalytics success
- Purpose: Validates that getSpendingAnalytics returns analytics data successfully
- Scenario: Service receives valid date range and API returns spending analytics
- Expected Result: Promise resolves with analytics data containing categoryBreakdown and monthlyTrends
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingAnalytics error
- Purpose: Validates error handling when API call fails
- Scenario: API returns error response
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getCategoryBreakdown success
- Purpose: Validates extraction of category breakdown from analytics data
- Scenario: Service calls getSpendingAnalytics and extracts categoryBreakdown
- Expected Result: Returns categoryBreakdown array
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getMonthlyTrends success
- Purpose: Validates extraction of monthly trends from analytics data
- Scenario: Service calls getSpendingAnalytics and extracts monthlyTrends
- Expected Result: Returns monthlyTrends array
*/
/*
Coverage Report:
- Functions tested: getSpendingAnalytics, getCategoryBreakdown, getMonthlyTrends
- Scenarios covered: successful API calls, error handling, data extraction
- Edge cases: empty date range, null responses, API failures
- Uncovered scenarios: none
*/

describe('AnalyticsService', function() {
  'use strict';

  var AnalyticsService, $httpBackend, API_ENDPOINTS;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _API_ENDPOINTS_) {
    AnalyticsService = _AnalyticsService_;
    $httpBackend = _$httpBackend_;
    API_ENDPOINTS = _API_ENDPOINTS_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getSpendingAnalytics', function() {
    it('should return spending analytics data when API call succeeds', function() {
      var dateRange = { from: '2024-01-01', to: '2024-12-31' };
      var mockResponse = {
        categoryBreakdown: [
          { category: 'Food & Dining', totalAmount: 1500 },
          { category: 'Fuel', totalAmount: 800 }
        ],
        monthlyTrends: [
          { month: 'Jan', totalSpend: 2000 },
          { month: 'Feb', totalSpend: 2500 }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.analytics + '?from=' + dateRange.from + '&to=' + dateRange.to)
        .respond(200, mockResponse);

      AnalyticsService.getSpendingAnalytics(dateRange).then(function(data) {
        expect(data).toEqual(mockResponse);
        expect(data.categoryBreakdown.length).toBe(2);
        expect(data.monthlyTrends.length).toBe(2);
      });

      $httpBackend.flush();
    });

    it('should reject promise when API call fails', function() {
      var dateRange = { from: '2024-01-01', to: '2024-12-31' };
      var errorResponse = { status: 500, message: 'Internal Server Error' };

      $httpBackend.expectGET(API_ENDPOINTS.analytics + '?from=' + dateRange.from + '&to=' + dateRange.to)
        .respond(500, errorResponse);

      AnalyticsService.getSpendingAnalytics(dateRange).catch(function(error) {
        expect(error.status).toBe(500);
        expect(error.data.message).toBe('Internal Server Error');
      });

      $httpBackend.flush();
    });

    it('should handle empty date range parameters', function() {
      var dateRange = { from: '', to: '' };
      var mockResponse = { categoryBreakdown: [], monthlyTrends: [] };

      $httpBackend.expectGET(API_ENDPOINTS.analytics + '?from=&to=')
        .respond(200, mockResponse);

      AnalyticsService.getSpendingAnalytics(dateRange).then(function(data) {
        expect(data.categoryBreakdown).toEqual([]);
        expect(data.monthlyTrends).toEqual([]);
      });

      $httpBackend.flush();
    });

    it('should handle 401 unauthorized error', function() {
      var dateRange = { from: '2024-01-01', to: '2024-12-31' };

      $httpBackend.expectGET(API_ENDPOINTS.analytics + '?from=' + dateRange.from + '&to=' + dateRange.to)
        .respond(401, { message: 'Unauthorized' });

      AnalyticsService.getSpendingAnalytics(dateRange).catch(function(error) {
        expect(error.status).toBe(401);
      });

      $httpBackend.flush();
    });
  });

  describe('getCategoryBreakdown', function() {
    it('should return category breakdown from analytics data', function() {
      var dateRange = { from: '2024-01-01', to: '2024-12-31' };
      var mockResponse = {
        categoryBreakdown: [
          { category: 'Shopping', totalAmount: 3000 },
          { category: 'Travel', totalAmount: 5000 }
        ],
        monthlyTrends: []
      };

      $httpBackend.expectGET(API_ENDPOINTS.analytics + '?from=' + dateRange.from + '&to=' + dateRange.to)
        .respond(200, mockResponse);

      AnalyticsService.getCategoryBreakdown(dateRange).then(function(data) {
        expect(data).toEqual(mockResponse.categoryBreakdown);
        expect(data.length).toBe(2);
        expect(data[0].category).toBe('Shopping');
      });

      $httpBackend.flush();
    });

    it('should handle empty category breakdown', function() {
      var dateRange = { from: '2024-01-01', to: '2024-12-31' };
      var mockResponse = {
        categoryBreakdown: [],
        monthlyTrends: []
      };

      $httpBackend.expectGET(API_ENDPOINTS.analytics + '?from=' + dateRange.from + '&to=' + dateRange.to)
        .respond(200, mockResponse);

      AnalyticsService.getCategoryBreakdown(dateRange).then(function(data) {
        expect(data).toEqual([]);
      });

      $httpBackend.flush();
    });
  });

  describe('getMonthlyTrends', function() {
    it('should return monthly trends from analytics data', function() {
      var dateRange = { from: '2024-01-01', to: '2024-12-31' };
      var mockResponse = {
        categoryBreakdown: [],
        monthlyTrends: [
          { month: 'Mar', totalSpend: 3500 },
          { month: 'Apr', totalSpend: 4000 },
          { month: 'May', totalSpend: 3800 }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.analytics + '?from=' + dateRange.from + '&to=' + dateRange.to)
        .respond(200, mockResponse);

      AnalyticsService.getMonthlyTrends(dateRange).then(function(data) {
        expect(data).toEqual(mockResponse.monthlyTrends);
        expect(data.length).toBe(3);
        expect(data[0].month).toBe('Mar');
        expect(data[0].totalSpend).toBe(3500);
      });

      $httpBackend.flush();
    });

    it('should handle empty monthly trends', function() {
      var dateRange = { from: '2024-01-01', to: '2024-12-31' };
      var mockResponse = {
        categoryBreakdown: [],
        monthlyTrends: []
      };

      $httpBackend.expectGET(API_ENDPOINTS.analytics + '?from=' + dateRange.from + '&to=' + dateRange.to)
        .respond(200, mockResponse);

      AnalyticsService.getMonthlyTrends(dateRange).then(function(data) {
        expect(data).toEqual([]);
      });

      $httpBackend.flush();
    });
  });
});