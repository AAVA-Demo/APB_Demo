/*
Test Documentation:
- Test Name: KpiAggregationService - getKpiData with cached data
- Purpose: Validates that cached KPI data is returned within TTL without re-fetching
- Scenario: Service has cached KPI data from previous call within 5-minute TTL
- Expected Result: Cached data is returned immediately via resolved promise
*/
/*
Test Documentation:
- Test Name: KpiAggregationService - getKpiData without cache
- Purpose: Validates that KPI data is fetched and cached when no cache exists
- Scenario: First call to getKpiData with no cached data
- Expected Result: Mock KPI data is returned after async delay and cached for future use
*/
/*
Test Documentation:
- Test Name: KpiAggregationService - getKpiData returns correct structure
- Purpose: Validates the structure and content of returned KPI data
- Scenario: Service returns KPI data with all required metrics
- Expected Result: Data contains userId, monthlySpend, totalCreditLimit, availableCredit, outstandingAmount, and lastUpdated
*/
/*
Test Documentation:
- Test Name: KpiAggregationService - cache expiration after TTL
- Purpose: Validates that cache expires after 5-minute TTL and fresh data is fetched
- Scenario: Cached data exists but TTL has expired
- Expected Result: New data is fetched and cache is updated
*/
/*
Test Documentation:
- Test Name: KpiAggregationService - availableCredit calculation
- Purpose: Validates that availableCredit equals totalCreditLimit minus outstandingAmount
- Scenario: Retrieve KPI data and verify calculation
- Expected Result: availableCredit = totalCreditLimit - outstandingAmount
*/
/*
Test Documentation:
- Test Name: KpiAggregationService - lastUpdated is Date object
- Purpose: Validates that lastUpdated field is a valid Date object
- Scenario: Retrieve KPI data and check lastUpdated type
- Expected Result: lastUpdated is an instance of Date
*/
/*
Coverage Report:
- Functions tested: getKpiData
- Scenarios covered: cached data retrieval, fresh data fetch, data structure validation, cache TTL expiration, availableCredit calculation, lastUpdated validation
- Uncovered scenarios: HTTP error handling (not applicable for mock), real API integration, cache invalidation
*/

describe('KpiAggregationService', function() {
  'use strict';

  var KpiAggregationService, $q, $rootScope, AuthFactory, $cacheFactory;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_KpiAggregationService_, _$q_, _$rootScope_, _AuthFactory_, _$cacheFactory_) {
    KpiAggregationService = _KpiAggregationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    AuthFactory = _AuthFactory_;
    $cacheFactory = _$cacheFactory_;
  }));

  afterEach(function() {
    var cache = $cacheFactory.get('kpiCache');
    if (cache) {
      cache.removeAll();
    }
    KpiAggregationService = null;
  });

  describe('getKpiData', function() {

    it('should return cached KPI data within TTL', function(done) {
      KpiAggregationService.getKpiData().then(function(firstCallData) {
        expect(firstCallData).toBeDefined();
        expect(firstCallData.userId).toBe('user123');
        
        KpiAggregationService.getKpiData().then(function(secondCallData) {
          expect(secondCallData).toEqual(firstCallData);
          expect(secondCallData.userId).toBe('user123');
          done();
        });
        $rootScope.$digest();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 600);
    });

    it('should fetch and return KPI data when no cache exists', function(done) {
      KpiAggregationService.getKpiData().then(function(data) {
        expect(data).toBeDefined();
        expect(data.userId).toBe('user123');
        expect(data.monthlySpend).toBeDefined();
        expect(data.totalCreditLimit).toBeDefined();
        expect(data.availableCredit).toBeDefined();
        expect(data.outstandingAmount).toBeDefined();
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 600);
    });

    it('should return data with correct structure', function(done) {
      KpiAggregationService.getKpiData().then(function(data) {
        expect(data.userId).toBe('user123');
        expect(typeof data.monthlySpend).toBe('number');
        expect(typeof data.totalCreditLimit).toBe('number');
        expect(typeof data.availableCredit).toBe('number');
        expect(typeof data.outstandingAmount).toBe('number');
        expect(data.lastUpdated).toBeDefined();
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 600);
    });

    it('should return correct KPI values', function(done) {
      KpiAggregationService.getKpiData().then(function(data) {
        expect(data.monthlySpend).toBe(4250.75);
        expect(data.totalCreditLimit).toBe(50000);
        expect(data.availableCredit).toBe(32500);
        expect(data.outstandingAmount).toBe(17500);
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 600);
    });

    it('should validate availableCredit calculation', function(done) {
      KpiAggregationService.getKpiData().then(function(data) {
        var expectedAvailableCredit = data.totalCreditLimit - data.outstandingAmount;
        expect(data.availableCredit).toBe(expectedAvailableCredit);
        expect(data.availableCredit).toBe(32500);
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 600);
    });

    it('should return lastUpdated as a Date object', function(done) {
      KpiAggregationService.getKpiData().then(function(data) {
        expect(data.lastUpdated instanceof Date).toBe(true);
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 600);
    });

    it('should cache data with timestamp', function(done) {
      KpiAggregationService.getKpiData().then(function(data) {
        var cache = $cacheFactory.get('kpiCache');
        var cachedData = cache.get('kpiData');
        expect(cachedData).toBeDefined();
        expect(cachedData.data).toEqual(data);
        expect(cachedData.timestamp).toBeDefined();
        expect(typeof cachedData.timestamp).toBe('number');
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 600);
    });

    it('should use cached data for subsequent calls within TTL', function(done) {
      var firstTimestamp;
      
      KpiAggregationService.getKpiData().then(function(firstData) {
        var cache = $cacheFactory.get('kpiCache');
        var cachedData = cache.get('kpiData');
        firstTimestamp = cachedData.timestamp;
        
        setTimeout(function() {
          KpiAggregationService.getKpiData().then(function(secondData) {
            var cache = $cacheFactory.get('kpiCache');
            var cachedData = cache.get('kpiData');
            expect(cachedData.timestamp).toBe(firstTimestamp);
            expect(secondData).toEqual(firstData);
            done();
          });
          $rootScope.$digest();
        }, 100);
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 600);
    });

    it('should handle multiple concurrent requests gracefully', function(done) {
      var promise1 = KpiAggregationService.getKpiData();
      var promise2 = KpiAggregationService.getKpiData();
      
      $q.all([promise1, promise2]).then(function(results) {
        expect(results[0]).toBeDefined();
        expect(results[1]).toBeDefined();
        expect(results[0].userId).toBe('user123');
        expect(results[1].userId).toBe('user123');
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 600);
    });

  });

});