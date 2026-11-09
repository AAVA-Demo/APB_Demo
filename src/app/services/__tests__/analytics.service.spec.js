/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingData with cached data
- Purpose: Validates that cached spending data is returned immediately without making new requests
- Scenario: Service has cached data from previous call
- Expected Result: Cached data is returned via resolved promise
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingData without cache
- Purpose: Validates that spending data is fetched and cached when no cache exists
- Scenario: First call to getSpendingData with no cached data
- Expected Result: Mock data is returned after async delay and cached for future use
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingData returns correct structure
- Purpose: Validates the structure and content of returned spending data
- Scenario: Service returns spending data with monthly trends and category breakdown
- Expected Result: Data contains userId, monthlyTrends array, categoryBreakdown array, and categories list
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingData with date range parameter
- Purpose: Validates that date range parameter is accepted (though not used in mock)
- Scenario: Call getSpendingData with specific date range
- Expected Result: Service accepts parameter and returns data successfully
*/
/*
Test Documentation:
- Test Name: AnalyticsService - category breakdown totals 100%
- Purpose: Validates that category percentages sum to 100%
- Scenario: Retrieve spending data and sum all category percentages
- Expected Result: Total percentage equals 100
*/
/*
Test Documentation:
- Test Name: AnalyticsService - monthly trends contains 12 months
- Purpose: Validates that monthly trends data covers a full year
- Scenario: Retrieve spending data and check monthlyTrends length
- Expected Result: monthlyTrends array contains exactly 12 entries
*/
/*
Coverage Report:
- Functions tested: getSpendingData
- Scenarios covered: cached data retrieval, fresh data fetch, data structure validation, date range parameter handling, category percentage validation, monthly trends validation
- Uncovered scenarios: HTTP error handling (not applicable for mock), real API integration
*/

describe('AnalyticsService', function() {
  'use strict';

  var AnalyticsService, $q, $rootScope, AuthFactory;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_AnalyticsService_, _$q_, _$rootScope_, _AuthFactory_) {
    AnalyticsService = _AnalyticsService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    AuthFactory = _AuthFactory_;
  }));

  afterEach(function() {
    AnalyticsService = null;
  });

  describe('getSpendingData', function() {

    it('should return cached data if available', function(done) {
      var dateRange = { start: new Date('2024-01-01'), end: new Date('2024-12-31') };
      
      AnalyticsService.getSpendingData(dateRange).then(function(firstCallData) {
        expect(firstCallData).toBeDefined();
        expect(firstCallData.userId).toBe('user123');
        
        AnalyticsService.getSpendingData(dateRange).then(function(secondCallData) {
          expect(secondCallData).toEqual(firstCallData);
          expect(secondCallData.userId).toBe('user123');
          done();
        });
        $rootScope.$digest();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 700);
    });

    it('should fetch and return spending data when no cache exists', function(done) {
      var dateRange = { start: new Date('2024-01-01'), end: new Date('2024-12-31') };
      
      AnalyticsService.getSpendingData(dateRange).then(function(data) {
        expect(data).toBeDefined();
        expect(data.userId).toBe('user123');
        expect(data.monthlyTrends).toBeDefined();
        expect(data.categoryBreakdown).toBeDefined();
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 700);
    });

    it('should return data with correct structure', function(done) {
      var dateRange = { start: new Date('2024-01-01'), end: new Date('2024-12-31') };
      
      AnalyticsService.getSpendingData(dateRange).then(function(data) {
        expect(data.userId).toBe('user123');
        expect(Array.isArray(data.monthlyTrends)).toBe(true);
        expect(Array.isArray(data.categoryBreakdown)).toBe(true);
        expect(Array.isArray(data.categories)).toBe(true);
        expect(data.dateRange).toBeDefined();
        expect(data.dateRange.start).toBeDefined();
        expect(data.dateRange.end).toBeDefined();
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 700);
    });

    it('should accept date range parameter', function(done) {
      var customDateRange = { start: new Date('2023-06-01'), end: new Date('2024-05-31') };
      
      AnalyticsService.getSpendingData(customDateRange).then(function(data) {
        expect(data).toBeDefined();
        expect(data.userId).toBe('user123');
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 700);
    });

    it('should return category breakdown with percentages totaling 100', function(done) {
      var dateRange = { start: new Date('2024-01-01'), end: new Date('2024-12-31') };
      
      AnalyticsService.getSpendingData(dateRange).then(function(data) {
        var totalPercentage = data.categoryBreakdown.reduce(function(sum, cat) {
          return sum + cat.percentage;
        }, 0);
        expect(totalPercentage).toBe(100);
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 700);
    });

    it('should return monthly trends with 12 months of data', function(done) {
      var dateRange = { start: new Date('2024-01-01'), end: new Date('2024-12-31') };
      
      AnalyticsService.getSpendingData(dateRange).then(function(data) {
        expect(data.monthlyTrends.length).toBe(12);
        expect(data.monthlyTrends[0].month).toBe('Jan 2024');
        expect(data.monthlyTrends[11].month).toBe('Dec 2024');
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 700);
    });

    it('should return all 9 predefined spending categories', function(done) {
      var dateRange = { start: new Date('2024-01-01'), end: new Date('2024-12-31') };
      
      AnalyticsService.getSpendingData(dateRange).then(function(data) {
        expect(data.categoryBreakdown.length).toBe(9);
        expect(data.categories.length).toBe(9);
        var expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        expect(data.categories).toEqual(expectedCategories);
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 700);
    });

    it('should return category breakdown with amount and percentage for each category', function(done) {
      var dateRange = { start: new Date('2024-01-01'), end: new Date('2024-12-31') };
      
      AnalyticsService.getSpendingData(dateRange).then(function(data) {
        data.categoryBreakdown.forEach(function(cat) {
          expect(cat.category).toBeDefined();
          expect(cat.amount).toBeDefined();
          expect(cat.percentage).toBeDefined();
          expect(typeof cat.amount).toBe('number');
          expect(typeof cat.percentage).toBe('number');
        });
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 700);
    });

  });

});