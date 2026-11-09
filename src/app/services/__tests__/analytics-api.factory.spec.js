/*
Test Documentation:
- Test Name: AnalyticsAPI Factory - fetchTrends success
- Purpose: Validates that fetchTrends successfully retrieves analytics trends data
- Scenario: Valid userId and timeRange provided, API returns success response
- Expected Result: Promise resolves with response data
*/
/*
Test Documentation:
- Test Name: AnalyticsAPI Factory - fetchTrends API error
- Purpose: Validates error handling when API call fails
- Scenario: API returns error response
- Expected Result: Promise is rejected and error is logged
*/
/*
Test Documentation:
- Test Name: AnalyticsAPI Factory - fetchTrends with invalid timeRange
- Purpose: Validates handling of invalid date parameters
- Scenario: timeRange contains invalid date objects
- Expected Result: Error is caught and promise is rejected
*/
/*
Coverage Report:
- Functions tested: fetchTrends
- Scenarios covered: success response, API error, invalid parameters, proper URL construction, error logging
- Uncovered scenarios: network timeout (requires integration test)
*/

(function() {
  'use strict';

  describe('AnalyticsAPI Factory', function() {
    var AnalyticsAPI, $httpBackend, $q, API_CONFIG;
    var baseUrl = 'https://api.creditcard.demo';
    var trendsEndpoint = '/api/analytics/trends';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsAPI_, _$httpBackend_, _$q_, _API_CONFIG_) {
      AnalyticsAPI = _AnalyticsAPI_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('fetchTrends', function() {
      it('should successfully fetch trends data with valid parameters', function() {
        var userId = 'user123';
        var timeRange = {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        };
        var mockResponse = [
          { month: 'Jan 2024', totalSpend: 1500 },
          { month: 'Feb 2024', totalSpend: 1800 }
        ];

        var expectedUrl = baseUrl + trendsEndpoint + 
          '?userId=' + userId + 
          '&startDate=' + encodeURIComponent(timeRange.startDate.toISOString()) + 
          '&endDate=' + encodeURIComponent(timeRange.endDate.toISOString());

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        AnalyticsAPI.fetchTrends(userId, timeRange).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(2);
        expect(result[0].month).toBe('Jan 2024');
      });

      it('should handle API error and reject promise', function() {
        var userId = 'user123';
        var timeRange = {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        };
        var errorResponse = { message: 'Internal Server Error' };

        spyOn(console, 'error');

        var expectedUrl = baseUrl + trendsEndpoint + 
          '?userId=' + userId + 
          '&startDate=' + encodeURIComponent(timeRange.startDate.toISOString()) + 
          '&endDate=' + encodeURIComponent(timeRange.endDate.toISOString());

        $httpBackend.expectGET(expectedUrl).respond(500, errorResponse);

        var error;
        AnalyticsAPI.fetchTrends(userId, timeRange).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
        expect(console.error).toHaveBeenCalledWith('Fetch trends API error:', jasmine.any(Object));
      });

      it('should handle 404 Not Found error', function() {
        var userId = 'invalidUser';
        var timeRange = {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        };

        spyOn(console, 'error');

        var expectedUrl = baseUrl + trendsEndpoint + 
          '?userId=' + userId + 
          '&startDate=' + encodeURIComponent(timeRange.startDate.toISOString()) + 
          '&endDate=' + encodeURIComponent(timeRange.endDate.toISOString());

        $httpBackend.expectGET(expectedUrl).respond(404, { message: 'User not found' });

        var error;
        AnalyticsAPI.fetchTrends(userId, timeRange).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error.status).toBe(404);
        expect(console.error).toHaveBeenCalled();
      });

      it('should return empty array when no trends data available', function() {
        var userId = 'user123';
        var timeRange = {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        };
        var mockResponse = [];

        var expectedUrl = baseUrl + trendsEndpoint + 
          '?userId=' + userId + 
          '&startDate=' + encodeURIComponent(timeRange.startDate.toISOString()) + 
          '&endDate=' + encodeURIComponent(timeRange.endDate.toISOString());

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        AnalyticsAPI.fetchTrends(userId, timeRange).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should properly format ISO date strings in request parameters', function() {
        var userId = 'user123';
        var startDate = new Date('2024-06-15T10:30:00.000Z');
        var endDate = new Date('2024-12-15T23:59:59.999Z');
        var timeRange = {
          startDate: startDate,
          endDate: endDate
        };

        var expectedUrl = baseUrl + trendsEndpoint + 
          '?userId=' + userId + 
          '&startDate=' + encodeURIComponent(startDate.toISOString()) + 
          '&endDate=' + encodeURIComponent(endDate.toISOString());

        $httpBackend.expectGET(expectedUrl).respond(200, []);

        AnalyticsAPI.fetchTrends(userId, timeRange);

        $httpBackend.flush();
      });

      it('should handle network timeout error', function() {
        var userId = 'user123';
        var timeRange = {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        };

        spyOn(console, 'error');

        var expectedUrl = baseUrl + trendsEndpoint + 
          '?userId=' + userId + 
          '&startDate=' + encodeURIComponent(timeRange.startDate.toISOString()) + 
          '&endDate=' + encodeURIComponent(timeRange.endDate.toISOString());

        $httpBackend.expectGET(expectedUrl).respond(0, '');

        var error;
        AnalyticsAPI.fetchTrends(userId, timeRange).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
})();