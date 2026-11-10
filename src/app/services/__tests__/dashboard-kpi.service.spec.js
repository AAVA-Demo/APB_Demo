/*
Test Documentation:
- Test Name: DashboardKPIService Test Suite
- Purpose: Validate DashboardKPIService functionality for retrieving aggregated KPI metrics
- Scenario: Tests getAggregatedMetrics method including data retrieval and structure validation
- Expected Result: Service correctly returns mock aggregated metrics with totalSpend and avgMonthlySpend
*/

(function() {
'use strict';

describe('DashboardKPIService', function() {
  var DashboardKPIService;
  var $q;
  var $rootScope;

  beforeEach(module('creditCard.analytics'));

  beforeEach(inject(function(_DashboardKPIService_, _$q_, _$rootScope_) {
    DashboardKPIService = _DashboardKPIService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getAggregatedMetrics', function() {
    it('should return aggregated metrics successfully', function() {
      var result;
      DashboardKPIService.getAggregatedMetrics().then(function(metrics) {
        result = metrics;
      });
      $rootScope.$digest();

      expect(result).toBeDefined();
      expect(result.totalSpend).toBeDefined();
      expect(result.avgMonthlySpend).toBeDefined();
    });

    it('should return correct totalSpend value', function() {
      var result;
      DashboardKPIService.getAggregatedMetrics().then(function(metrics) {
        result = metrics;
      });
      $rootScope.$digest();

      expect(result.totalSpend).toBe(47650);
    });

    it('should return correct avgMonthlySpend value', function() {
      var result;
      DashboardKPIService.getAggregatedMetrics().then(function(metrics) {
        result = metrics;
      });
      $rootScope.$digest();

      expect(result.avgMonthlySpend).toBe(6335);
    });

    it('should return a promise', function() {
      var promise = DashboardKPIService.getAggregatedMetrics();
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });

    it('should return metrics with numeric values', function() {
      var result;
      DashboardKPIService.getAggregatedMetrics().then(function(metrics) {
        result = metrics;
      });
      $rootScope.$digest();

      expect(typeof result.totalSpend).toBe('number');
      expect(typeof result.avgMonthlySpend).toBe('number');
    });

    it('should return positive metric values', function() {
      var result;
      DashboardKPIService.getAggregatedMetrics().then(function(metrics) {
        result = metrics;
      });
      $rootScope.$digest();

      expect(result.totalSpend).toBeGreaterThan(0);
      expect(result.avgMonthlySpend).toBeGreaterThan(0);
    });

    it('should return consistent data on multiple calls', function() {
      var result1, result2;
      DashboardKPIService.getAggregatedMetrics().then(function(metrics) {
        result1 = metrics;
      });
      $rootScope.$digest();

      DashboardKPIService.getAggregatedMetrics().then(function(metrics) {
        result2 = metrics;
      });
      $rootScope.$digest();

      expect(result1.totalSpend).toBe(result2.totalSpend);
      expect(result1.avgMonthlySpend).toBe(result2.avgMonthlySpend);
    });

    it('should have avgMonthlySpend less than or equal to totalSpend', function() {
      var result;
      DashboardKPIService.getAggregatedMetrics().then(function(metrics) {
        result = metrics;
      });
      $rootScope.$digest();

      expect(result.avgMonthlySpend).toBeLessThanOrEqual(result.totalSpend);
    });

    it('should resolve promise immediately with mock data', function() {
      var resolved = false;
      DashboardKPIService.getAggregatedMetrics().then(function() {
        resolved = true;
      });

      expect(resolved).toBe(false);
      $rootScope.$digest();
      expect(resolved).toBe(true);
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: getAggregatedMetrics
- Scenarios covered:
  * Successful metrics retrieval
  * Correct totalSpend value
  * Correct avgMonthlySpend value
  * Promise return validation
  * Numeric value validation
  * Positive value validation
  * Consistent data on multiple calls
  * Logical relationship between metrics
  * Immediate promise resolution
- Uncovered scenarios: None - comprehensive coverage achieved
*/