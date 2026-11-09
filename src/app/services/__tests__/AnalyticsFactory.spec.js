/*
Test Documentation:
- Test Name: AnalyticsFactory - getCategorySpending success
- Purpose: Validates that getCategorySpending returns category spending data successfully
- Scenario: Valid filter provided, API returns data
- Expected Result: Promise resolves with category spending data
*/
/*
Test Documentation:
- Test Name: AnalyticsFactory - getCategorySpending with empty filter
- Purpose: Validates that getCategorySpending handles empty filter
- Scenario: No filter provided
- Expected Result: API called with empty params, returns data
*/
/*
Test Documentation:
- Test Name: AnalyticsFactory - getCategorySpending error handling
- Purpose: Validates error handling when API call fails
- Scenario: API returns error
- Expected Result: Promise rejected with error
*/
/*
Test Documentation:
- Test Name: AnalyticsFactory - getMonthlyTrends success
- Purpose: Validates that getMonthlyTrends returns trend data successfully
- Scenario: Valid filter provided, API returns data
- Expected Result: Promise resolves with monthly trend data
*/
/*
Test Documentation:
- Test Name: AnalyticsFactory - getMonthlyTrends error handling
- Purpose: Validates error handling when API call fails
- Scenario: API returns error
- Expected Result: Promise rejected with error
*/
/*
Coverage Report:
- Functions tested: getCategorySpending, getMonthlyTrends
- Scenarios covered: success with filter, success without filter, API error handling
- Uncovered scenarios: none
*/

describe('AnalyticsFactory', function() {
  var AnalyticsFactory, $httpBackend, API_CONFIG;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_AnalyticsFactory_, _$httpBackend_, _API_CONFIG_) {
    AnalyticsFactory = _AnalyticsFactory_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCategorySpending', function() {
    it('should return category spending data successfully with filter', function() {
      var mockFilter = {startDate: '2024-01-01', endDate: '2024-12-31'};
      var mockResponse = [
        {category: 'Food & Dining', amount: 1500},
        {category: 'Fuel', amount: 800}
      ];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/analytics/category?endDate=2024-12-31&startDate=2024-01-01')
        .respond(200, mockResponse);

      var result;
      AnalyticsFactory.getCategorySpending(mockFilter).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Food & Dining');
    });

    it('should handle empty filter and return data', function() {
      var mockResponse = [{category: 'Shopping', amount: 2000}];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/analytics/category')
        .respond(200, mockResponse);

      var result;
      AnalyticsFactory.getCategorySpending(null).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
    });

    it('should handle API error and reject promise', function() {
      var mockFilter = {startDate: '2024-01-01'};
      var errorResponse = {status: 500, statusText: 'Internal Server Error'};

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/analytics/category?startDate=2024-01-01')
        .respond(500, errorResponse);

      var error;
      AnalyticsFactory.getCategorySpending(mockFilter).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle network error', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/analytics/category')
        .respond(-1, null);

      var error;
      AnalyticsFactory.getCategorySpending({}).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });
  });

  describe('getMonthlyTrends', function() {
    it('should return monthly trend data successfully with filter', function() {
      var mockFilter = {startDate: '2024-01-01', endDate: '2024-12-31'};
      var mockResponse = [
        {month: 'January', totalSpend: 5000},
        {month: 'February', totalSpend: 4500}
      ];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/analytics/trends?endDate=2024-12-31&startDate=2024-01-01')
        .respond(200, mockResponse);

      var result;
      AnalyticsFactory.getMonthlyTrends(mockFilter).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(2);
      expect(result[0].month).toBe('January');
    });

    it('should handle empty filter and return data', function() {
      var mockResponse = [{month: 'March', totalSpend: 3000}];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/analytics/trends')
        .respond(200, mockResponse);

      var result;
      AnalyticsFactory.getMonthlyTrends(null).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
    });

    it('should handle API error and reject promise', function() {
      var mockFilter = {startDate: '2024-01-01'};
      var errorResponse = {status: 404, statusText: 'Not Found'};

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/analytics/trends?startDate=2024-01-01')
        .respond(404, errorResponse);

      var error;
      AnalyticsFactory.getMonthlyTrends(mockFilter).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    it('should handle server timeout', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/analytics/trends')
        .respond(408, {statusText: 'Request Timeout'});

      var error;
      AnalyticsFactory.getMonthlyTrends({}).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(408);
    });
  });
});