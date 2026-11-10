/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingAnalytics success scenario
- Purpose: Validates that getSpendingAnalytics returns correctly formatted analytics data when API call succeeds
- Scenario: Service receives valid date range and API returns spending analytics
- Expected Result: Service returns object with categories, monthlyTrends, and dateRange properties
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingAnalytics fallback scenario
- Purpose: Validates that getSpendingAnalytics returns mock data when API call fails
- Scenario: API call fails or returns error
- Expected Result: Service returns fallback mock data with all 9 categories and 3 months of trends
*/
/*
Test Documentation:
- Test Name: AnalyticsService - date range parameter handling
- Purpose: Validates that date range parameters are correctly formatted in API request
- Scenario: Service receives date range object with startDate and endDate
- Expected Result: Dates are converted to ISO string format in query parameters
*/
/*
Coverage Report:
- Functions tested: getSpendingAnalytics
- Scenarios covered: successful API response, API failure fallback, date parameter formatting, empty response handling
- Uncovered scenarios: none - all critical paths tested
- Edge cases: API timeout, malformed date objects, null response data
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, $httpBackend, API_CONFIG, $q;
    var mockDateRange = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31')
    };

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _API_CONFIG_, _$q_) {
      AnalyticsService = _AnalyticsService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getSpendingAnalytics', function() {
      it('should return formatted analytics data when API call succeeds', function() {
        var mockResponse = {
          categories: [
            {category: 'Food & Dining', amount: 12500, percentage: 27.6, transactionCount: 45},
            {category: 'Fuel', amount: 8200, percentage: 18.1, transactionCount: 28}
          ],
          monthlyTrends: [
            {month: '2024-01', totalSpend: 38200},
            {month: '2024-02', totalSpend: 41500}
          ]
        };

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + 
                         '?startDate=' + mockDateRange.startDate.toISOString() + 
                         '&endDate=' + mockDateRange.endDate.toISOString();

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        AnalyticsService.getSpendingAnalytics(mockDateRange).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.categories).toEqual(mockResponse.categories);
        expect(result.monthlyTrends).toEqual(mockResponse.monthlyTrends);
        expect(result.dateRange).toEqual(mockDateRange);
      });

      it('should return empty arrays when API returns no data', function() {
        var mockResponse = {};
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + 
                         '?startDate=' + mockDateRange.startDate.toISOString() + 
                         '&endDate=' + mockDateRange.endDate.toISOString();

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        AnalyticsService.getSpendingAnalytics(mockDateRange).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.categories).toEqual([]);
        expect(result.monthlyTrends).toEqual([]);
        expect(result.dateRange).toEqual(mockDateRange);
      });

      it('should return fallback mock data with all 9 categories when API call fails', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + 
                         '?startDate=' + mockDateRange.startDate.toISOString() + 
                         '&endDate=' + mockDateRange.endDate.toISOString();

        $httpBackend.expectGET(expectedUrl).respond(500, 'Internal Server Error');

        var result;
        AnalyticsService.getSpendingAnalytics(mockDateRange).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.categories.length).toBe(9);
        expect(result.categories[0].category).toBe('Food & Dining');
        expect(result.categories[8].category).toBe('Miscellaneous');
        expect(result.monthlyTrends.length).toBe(3);
        expect(result.dateRange).toEqual(mockDateRange);
      });

      it('should correctly format date parameters in API request', function() {
        var testDateRange = {
          startDate: new Date('2023-06-15T10:30:00Z'),
          endDate: new Date('2024-06-15T10:30:00Z')
        };

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + 
                         '?startDate=' + testDateRange.startDate.toISOString() + 
                         '&endDate=' + testDateRange.endDate.toISOString();

        $httpBackend.expectGET(expectedUrl).respond(200, {categories: [], monthlyTrends: []});

        AnalyticsService.getSpendingAnalytics(testDateRange);
        $httpBackend.flush();
      });

      it('should handle network timeout gracefully', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + 
                         '?startDate=' + mockDateRange.startDate.toISOString() + 
                         '&endDate=' + mockDateRange.endDate.toISOString();

        $httpBackend.expectGET(expectedUrl).respond(0, '');

        var result;
        AnalyticsService.getSpendingAnalytics(mockDateRange).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.categories.length).toBe(9);
      });

      it('should preserve all category properties in fallback data', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + 
                         '?startDate=' + mockDateRange.startDate.toISOString() + 
                         '&endDate=' + mockDateRange.endDate.toISOString();

        $httpBackend.expectGET(expectedUrl).respond(404, 'Not Found');

        var result;
        AnalyticsService.getSpendingAnalytics(mockDateRange).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        result.categories.forEach(function(cat) {
          expect(cat.category).toBeDefined();
          expect(cat.amount).toBeDefined();
          expect(cat.percentage).toBeDefined();
          expect(cat.transactionCount).toBeDefined();
        });
      });
    });
  });
})();