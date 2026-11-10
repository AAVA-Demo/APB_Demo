/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingAnalytics with cache hit
- Purpose: Validates that cached analytics data is returned when available
- Scenario: Service has cached data for the user
- Expected Result: Cached data is returned without HTTP call
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingAnalytics with cache miss
- Purpose: Validates HTTP request is made when cache is empty
- Scenario: No cached data exists for the user
- Expected Result: HTTP GET request is made and data is cached
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingAnalytics error handling
- Purpose: Validates error handling when HTTP request fails
- Scenario: HTTP request returns error
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: AnalyticsService - mockGetSpendingAnalytics returns complete data
- Purpose: Validates mock data structure and completeness
- Scenario: Mock method is called with userId
- Expected Result: Complete analytics data with all categories returned
*/
/*
Coverage Report:
- Functions tested: getSpendingAnalytics, mockGetSpendingAnalytics
- Scenarios covered: cache hit, cache miss, HTTP error, mock data structure, category completeness
- Edge cases: empty cache, HTTP failure, date range validation
- Uncovered scenarios: cache expiration timing (requires time-based testing)
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, $httpBackend, $q, $cacheFactory, cache;
    var API_BASE = '/api/analytics';
    var mockUserId = 'user123';
    var mockDateRange = {
      startDate: new Date('2023-11-01'),
      endDate: new Date('2024-11-01')
    };
    var mockAnalyticsData = {
      userId: mockUserId,
      dateRange: mockDateRange,
      monthlyTrends: [
        {month: 'Nov 2023', amount: 8500},
        {month: 'Dec 2023', amount: 12000}
      ],
      cardWiseSpending: [
        {cardId: 'card001', cardName: 'Visa Platinum', amount: 6250}
      ],
      categoryWiseSpending: [
        {category: 'Food & Dining', amount: 2850.50, percentage: 22.9}
      ],
      categories: ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous']
    };

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _$q_, _$cacheFactory_) {
      AnalyticsService = _AnalyticsService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      $cacheFactory = _$cacheFactory_;
      cache = $cacheFactory.get('analyticsCache');
      if (cache) {
        cache.removeAll();
      }
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      if (cache) {
        cache.removeAll();
      }
    });

    describe('getSpendingAnalytics', function() {
      it('should return cached data when available', function() {
        var cacheKey = 'analytics_' + mockUserId;
        cache.put(cacheKey, mockAnalyticsData);

        var result;
        AnalyticsService.getSpendingAnalytics(mockUserId, mockDateRange).then(function(data) {
          result = data;
        });

        expect(result).toEqual(mockAnalyticsData);
      });

      it('should make HTTP request when cache is empty', function() {
        $httpBackend.expectGET(API_BASE + '/spending?endDate=' + mockDateRange.endDate.toISOString() + '&startDate=' + mockDateRange.startDate.toISOString() + '&userId=' + mockUserId)
          .respond(200, mockAnalyticsData);

        var result;
        AnalyticsService.getSpendingAnalytics(mockUserId, mockDateRange).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockAnalyticsData);
        expect(cache.get('analytics_' + mockUserId)).toEqual(mockAnalyticsData);
      });

      it('should cache data after successful HTTP request', function() {
        $httpBackend.expectGET(API_BASE + '/spending?endDate=' + mockDateRange.endDate.toISOString() + '&startDate=' + mockDateRange.startDate.toISOString() + '&userId=' + mockUserId)
          .respond(200, mockAnalyticsData);

        AnalyticsService.getSpendingAnalytics(mockUserId, mockDateRange);
        $httpBackend.flush();

        var cachedData = cache.get('analytics_' + mockUserId);
        expect(cachedData).toEqual(mockAnalyticsData);
      });

      it('should reject promise when HTTP request fails', function() {
        $httpBackend.expectGET(API_BASE + '/spending?endDate=' + mockDateRange.endDate.toISOString() + '&startDate=' + mockDateRange.startDate.toISOString() + '&userId=' + mockUserId)
          .respond(500, 'Internal Server Error');

        var error;
        AnalyticsService.getSpendingAnalytics(mockUserId, mockDateRange).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle network errors gracefully', function() {
        $httpBackend.expectGET(API_BASE + '/spending?endDate=' + mockDateRange.endDate.toISOString() + '&startDate=' + mockDateRange.startDate.toISOString() + '&userId=' + mockUserId)
          .respond(0, '');

        var error;
        AnalyticsService.getSpendingAnalytics(mockUserId, mockDateRange).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
      });
    });

    describe('mockGetSpendingAnalytics', function() {
      it('should return complete mock data structure', function() {
        var result;
        AnalyticsService.mockGetSpendingAnalytics(mockUserId).then(function(data) {
          result = data;
        });

        expect(result).toBeDefined();
        expect(result.userId).toBe(mockUserId);
        expect(result.dateRange).toBeDefined();
        expect(result.monthlyTrends).toBeDefined();
        expect(result.cardWiseSpending).toBeDefined();
        expect(result.categoryWiseSpending).toBeDefined();
        expect(result.categories).toBeDefined();
      });

      it('should return 13 months of monthly trends data', function() {
        var result;
        AnalyticsService.mockGetSpendingAnalytics(mockUserId).then(function(data) {
          result = data;
        });

        expect(result.monthlyTrends.length).toBe(13);
        expect(result.monthlyTrends[0].month).toBe('Nov 2023');
        expect(result.monthlyTrends[12].month).toBe('Nov 2024');
      });

      it('should return all 9 spending categories', function() {
        var result;
        AnalyticsService.mockGetSpendingAnalytics(mockUserId).then(function(data) {
          result = data;
        });

        expect(result.categories.length).toBe(9);
        expect(result.categories).toContain('Food & Dining');
        expect(result.categories).toContain('Fuel');
        expect(result.categories).toContain('Shopping');
        expect(result.categories).toContain('Travel');
        expect(result.categories).toContain('Entertainment');
        expect(result.categories).toContain('Utilities');
        expect(result.categories).toContain('Healthcare');
        expect(result.categories).toContain('Education');
        expect(result.categories).toContain('Miscellaneous');
      });

      it('should return category-wise spending with percentages', function() {
        var result;
        AnalyticsService.mockGetSpendingAnalytics(mockUserId).then(function(data) {
          result = data;
        });

        expect(result.categoryWiseSpending.length).toBe(9);
        result.categoryWiseSpending.forEach(function(category) {
          expect(category.category).toBeDefined();
          expect(category.amount).toBeDefined();
          expect(category.percentage).toBeDefined();
          expect(typeof category.amount).toBe('number');
          expect(typeof category.percentage).toBe('number');
        });
      });

      it('should return card-wise spending data', function() {
        var result;
        AnalyticsService.mockGetSpendingAnalytics(mockUserId).then(function(data) {
          result = data;
        });

        expect(result.cardWiseSpending.length).toBe(3);
        result.cardWiseSpending.forEach(function(card) {
          expect(card.cardId).toBeDefined();
          expect(card.cardName).toBeDefined();
          expect(card.amount).toBeDefined();
          expect(typeof card.amount).toBe('number');
        });
      });

      it('should return valid date range', function() {
        var result;
        AnalyticsService.mockGetSpendingAnalytics(mockUserId).then(function(data) {
          result = data;
        });

        expect(result.dateRange.startDate).toBeDefined();
        expect(result.dateRange.endDate).toBeDefined();
        expect(result.dateRange.startDate instanceof Date).toBe(true);
        expect(result.dateRange.endDate instanceof Date).toBe(true);
        expect(result.dateRange.startDate < result.dateRange.endDate).toBe(true);
      });
    });
  });
})();