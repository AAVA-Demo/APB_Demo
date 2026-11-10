/*
Test Documentation:
- Test Name: MonthlyAggregationService Test Suite
- Purpose: Validate monthly spending aggregation and category breakdown functionality
- Scenario: Tests monthly spending data retrieval via API with fallback to mock categorized data
- Expected Result: Service should retrieve monthly spending data or return mock category breakdown on failure
*/

(function() {
  'use strict';

  describe('MonthlyAggregationService', function() {
    var MonthlyAggregationService, ApiGatewayService, $rootScope, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_MonthlyAggregationService_, _ApiGatewayService_, _$rootScope_, _$q_) {
      MonthlyAggregationService = _MonthlyAggregationService_;
      ApiGatewayService = _ApiGatewayService_;
      $rootScope = _$rootScope_;
      $q = _$q_;
    }));

    describe('getMonthlySpending', function() {
      it('should call ApiGatewayService.get with correct endpoint', function() {
        var userId = 'user-123';
        var month = '2026-01';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        MonthlyAggregationService.getMonthlySpending(userId, month);

        expect(ApiGatewayService.get).toHaveBeenCalledWith('/analytics/monthly-spending?userId=' + userId + '&month=' + month);
      });

      it('should return API data when request succeeds', function() {
        var userId = 'user-456';
        var month = '2026-02';
        var apiResponse = {
          month: month,
          year: 2026,
          categoryBreakdown: [
            { category: 'Food & Dining', totalAmount: 1500, transactionCount: 25, percentage: '30.00' }
          ],
          totalSpend: 5000
        };

        spyOn(ApiGatewayService, 'get').and.returnValue($q.resolve(apiResponse));

        var result;
        MonthlyAggregationService.getMonthlySpending(userId, month).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toEqual(apiResponse);
      });

      it('should return mock data when API request fails', function() {
        var userId = 'user-789';
        var month = '2026-03';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject({ status: 404 }));

        var result;
        MonthlyAggregationService.getMonthlySpending(userId, month).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.month).toBe(month);
        expect(result.categoryBreakdown).toBeDefined();
        expect(Array.isArray(result.categoryBreakdown)).toBe(true);
      });

      it('should generate all 9 categories in mock data', function() {
        var userId = 'user-categories';
        var month = '2026-04';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        MonthlyAggregationService.getMonthlySpending(userId, month).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        var expectedCategories = [
          'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
          'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
        ];

        expect(result.categoryBreakdown.length).toBe(9);
        result.categoryBreakdown.forEach(function(cat, index) {
          expect(cat.category).toBe(expectedCategories[index]);
        });
      });

      it('should include all required fields for each category', function() {
        var userId = 'user-fields';
        var month = '2026-05';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        MonthlyAggregationService.getMonthlySpending(userId, month).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.categoryBreakdown.forEach(function(cat) {
          expect(cat.category).toBeDefined();
          expect(cat.totalAmount).toBeDefined();
          expect(cat.transactionCount).toBeDefined();
          expect(cat.percentage).toBeDefined();
        });
      });

      it('should calculate percentages that sum to 100', function() {
        var userId = 'user-percentage';
        var month = '2026-06';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        MonthlyAggregationService.getMonthlySpending(userId, month).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        var totalPercentage = result.categoryBreakdown.reduce(function(sum, cat) {
          return sum + parseFloat(cat.percentage);
        }, 0);

        expect(totalPercentage).toBeCloseTo(100, 1);
      });

      it('should set totalSpend equal to sum of category amounts', function() {
        var userId = 'user-total';
        var month = '2026-07';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        MonthlyAggregationService.getMonthlySpending(userId, month).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        var calculatedTotal = result.categoryBreakdown.reduce(function(sum, cat) {
          return sum + cat.totalAmount;
        }, 0);

        expect(result.totalSpend).toBe(calculatedTotal);
      });

      it('should use current month when month parameter is not provided', function() {
        var userId = 'user-current';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        MonthlyAggregationService.getMonthlySpending(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        var currentMonth = new Date().toISOString().substring(0, 7);
        expect(result.month).toBe(currentMonth);
      });

      it('should set year to current year in mock data', function() {
        var userId = 'user-year';
        var month = '2026-08';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        MonthlyAggregationService.getMonthlySpending(userId, month).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.year).toBe(new Date().getFullYear());
      });

      it('should generate random amounts within valid range', function() {
        var userId = 'user-amounts';
        var month = '2026-09';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        MonthlyAggregationService.getMonthlySpending(userId, month).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.categoryBreakdown.forEach(function(cat) {
          expect(cat.totalAmount).toBeGreaterThanOrEqual(500);
          expect(cat.totalAmount).toBeLessThanOrEqual(2500);
        });
      });

      it('should generate transaction counts within valid range', function() {
        var userId = 'user-transactions';
        var month = '2026-10';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        MonthlyAggregationService.getMonthlySpending(userId, month).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.categoryBreakdown.forEach(function(cat) {
          expect(cat.transactionCount).toBeGreaterThanOrEqual(5);
          expect(cat.transactionCount).toBeLessThanOrEqual(25);
        });
      });

      it('should return promise', function() {
        var userId = 'user-promise';
        var month = '2026-11';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var promise = MonthlyAggregationService.getMonthlySpending(userId, month);
        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');
      });

      it('should handle network errors gracefully', function() {
        var userId = 'user-network-error';
        var month = '2026-12';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject({ status: 500 }));

        var result;
        MonthlyAggregationService.getMonthlySpending(userId, month).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.categoryBreakdown).toBeDefined();
      });
    });

    describe('data validation', function() {
      it('should have numeric totalAmount for each category', function() {
        var userId = 'user-numeric';
        var month = '2026-01';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        MonthlyAggregationService.getMonthlySpending(userId, month).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.categoryBreakdown.forEach(function(cat) {
          expect(typeof cat.totalAmount).toBe('number');
        });
      });

      it('should have string percentage with 2 decimal places', function() {
        var userId = 'user-decimal';
        var month = '2026-02';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        MonthlyAggregationService.getMonthlySpending(userId, month).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.categoryBreakdown.forEach(function(cat) {
          expect(typeof cat.percentage).toBe('string');
          var decimalPart = cat.percentage.split('.')[1];
          if (decimalPart) {
            expect(decimalPart.length).toBe(2);
          }
        });
      });
    });

    describe('integration scenarios', function() {
      it('should work with different months', function() {
        var userId = 'user-multi-month';
        var months = ['2026-01', '2026-02', '2026-03'];
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        months.forEach(function(month) {
          var result;
          MonthlyAggregationService.getMonthlySpending(userId, month).then(function(data) {
            result = data;
          });
          $rootScope.$digest();

          expect(result.month).toBe(month);
        });
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getMonthlySpending()
- Scenarios covered:
  * API Gateway service invocation
  * Successful API response handling
  * API failure with mock data fallback
  * All 9 categories generation
  * All required fields for each category
  * Percentage calculation summing to 100
  * Total spend calculation
  * Current month default
  * Current year setting
  * Random amount generation within range
  * Transaction count generation within range
  * Promise return validation
  * Network error handling
  * Numeric validation for amounts
  * String percentage with 2 decimals
  * Multiple months handling
- Uncovered scenarios: Historical trend analysis, year-over-year comparison, budget vs actual comparison
*/