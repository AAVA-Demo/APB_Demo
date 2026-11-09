/*
Test Documentation:
- Test Name: AnalyticsService functionality
- Purpose: Validate spending analytics data retrieval
- Scenario: Test getSpendingAnalytics with date range
- Expected Result: Analytics data retrieved correctly
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, $httpBackend, API_CONFIG;
    var mockAnalyticsData = {
      monthlyTrends: [
        { month: 'Jan 2023', amount: 1500 },
        { month: 'Feb 2023', amount: 2000 }
      ],
      cardWiseSpending: [
        { cardName: 'Visa Gold', amount: 3000 },
        { cardName: 'Mastercard Platinum', amount: 4500 }
      ],
      categoryWiseSpending: [
        { category: 'Food & Dining', amount: 1200, percentage: 35 },
        { category: 'Shopping', amount: 800, percentage: 25 }
      ]
    };

    beforeEach(module('app.analytics'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _API_CONFIG_) {
      AnalyticsService = _AnalyticsService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Ensure service is injectable
    - Scenario: Inject AnalyticsService
    - Expected Result: Service is defined
    */
    it('should be defined', function() {
      expect(AnalyticsService).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: getSpendingAnalytics should retrieve analytics data
    - Purpose: Validate analytics retrieval
    - Scenario: HTTP GET with date range params
    - Expected Result: Returns complete analytics object
    */
    it('getSpendingAnalytics should retrieve analytics data', function() {
      var dateRange = {
        from: new Date('2023-01-01'),
        to: new Date('2023-12-31')
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '?from=2023-01-01&to=2023-12-31')
        .respond(200, mockAnalyticsData);

      var result;
      AnalyticsService.getSpendingAnalytics(dateRange).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockAnalyticsData);
      expect(result.monthlyTrends.length).toBe(2);
      expect(result.cardWiseSpending.length).toBe(2);
      expect(result.categoryWiseSpending.length).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: getSpendingAnalytics should format dates correctly
    - Purpose: Validate date formatting
    - Scenario: Date objects provided
    - Expected Result: Dates formatted as YYYY-MM-DD in request
    */
    it('getSpendingAnalytics should format dates correctly', function() {
      var dateRange = {
        from: new Date('2023-06-01'),
        to: new Date('2023-06-30')
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '?from=2023-06-01&to=2023-06-30')
        .respond(200, mockAnalyticsData);

      AnalyticsService.getSpendingAnalytics(dateRange);
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: getSpendingAnalytics should handle API errors
    - Purpose: Validate error handling
    - Scenario: API returns 500 error
    - Expected Result: Promise rejected
    */
    it('getSpendingAnalytics should handle API errors', function() {
      var dateRange = {
        from: new Date('2023-01-01'),
        to: new Date('2023-12-31')
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '?from=2023-01-01&to=2023-12-31')
        .respond(500, 'Server error');

      var error;
      AnalyticsService.getSpendingAnalytics(dateRange).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });

  /*
  Coverage Report:
  - Functions tested: getSpendingAnalytics
  - Scenarios covered: successful retrieval, date formatting, error handling
  - Uncovered scenarios: timeout scenarios
  */
})();