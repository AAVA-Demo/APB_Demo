/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingInsights - returns cached data when cache is valid
- Purpose: Validates that the service returns cached analytics data when cache TTL has not expired
- Scenario: Cache contains valid data within TTL period
- Expected Result: Service returns cached data without making API call
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingInsights - fetches fresh data when cache is expired
- Purpose: Validates that the service fetches new data from API when cache has expired
- Scenario: Cache is expired or empty
- Expected Result: Service makes API call and caches the response
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingInsights - handles API errors gracefully
- Purpose: Validates error handling when API call fails
- Scenario: API returns error response
- Expected Result: Service rejects promise with error
*/
/*
Coverage Report:
- Functions tested: getSpendingInsights
- Scenarios covered: cache hit, cache miss, API success, API failure, data transformation
- Uncovered scenarios: none
*/

describe('AnalyticsService', function() {
  'use strict';
  
  var AnalyticsService;
  var ApiFactory;
  var CategoryService;
  var $cacheFactory;
  var $q;
  var $rootScope;
  var cache;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_AnalyticsService_, _ApiFactory_, _CategoryService_, _$cacheFactory_, _$q_, _$rootScope_) {
    AnalyticsService = _AnalyticsService_;
    ApiFactory = _ApiFactory_;
    CategoryService = _CategoryService_;
    $cacheFactory = _$cacheFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    cache = $cacheFactory.get('analyticsCache');
  }));
  
  afterEach(function() {
    if (cache) {
      cache.removeAll();
    }
  });
  
  describe('getSpendingInsights', function() {
    
    it('should return cached data when cache is valid and within TTL', function() {
      var cachedData = {
        monthlyTrends: [{month: 'Jan', amount: 1000}],
        cardWiseSpend: [{cardName: 'Card1', amount: 500}],
        categoryWiseSpend: [{category: 'Food & Dining', amount: 300}]
      };
      var cachedEntry = {
        data: cachedData,
        timestamp: Date.now() - 30000
      };
      cache.put('insights', cachedEntry);
      
      spyOn(ApiFactory, 'get');
      
      var result;
      AnalyticsService.getSpendingInsights().then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      expect(result).toEqual(cachedData);
      expect(ApiFactory.get).not.toHaveBeenCalled();
    });
    
    it('should fetch fresh data from API when cache is empty', function() {
      var apiResponse = {
        monthlyTrends: [{month: 'Feb', amount: 2000}],
        cardWiseSpend: [{cardName: 'Card2', amount: 800}],
        categoryWiseSpend: [{category: 'Shopping', amount: 600}]
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      AnalyticsService.getSpendingInsights().then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      expect(ApiFactory.get).toHaveBeenCalledWith('/analytics/spending');
      expect(result.monthlyTrends).toEqual(apiResponse.monthlyTrends);
      expect(result.cardWiseSpend).toEqual(apiResponse.cardWiseSpend);
      expect(result.categoryWiseSpend).toEqual(apiResponse.categoryWiseSpend);
    });
    
    it('should fetch fresh data when cache is expired beyond TTL', function() {
      var oldCachedData = {
        monthlyTrends: [],
        cardWiseSpend: [],
        categoryWiseSpend: []
      };
      var oldCachedEntry = {
        data: oldCachedData,
        timestamp: Date.now() - 70000
      };
      cache.put('insights', oldCachedEntry);
      
      var apiResponse = {
        monthlyTrends: [{month: 'Mar', amount: 3000}],
        cardWiseSpend: [{cardName: 'Card3', amount: 1200}],
        categoryWiseSpend: [{category: 'Travel', amount: 900}]
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      AnalyticsService.getSpendingInsights().then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      expect(ApiFactory.get).toHaveBeenCalledWith('/analytics/spending');
      expect(result.monthlyTrends).toEqual(apiResponse.monthlyTrends);
    });
    
    it('should handle API response with missing fields by providing default empty arrays', function() {
      var apiResponse = {
        monthlyTrends: [{month: 'Apr', amount: 1500}]
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      AnalyticsService.getSpendingInsights().then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      expect(result.monthlyTrends).toEqual(apiResponse.monthlyTrends);
      expect(result.cardWiseSpend).toEqual([]);
      expect(result.categoryWiseSpend).toEqual([]);
    });
    
    it('should cache the fetched data with current timestamp', function() {
      var apiResponse = {
        monthlyTrends: [{month: 'May', amount: 2500}],
        cardWiseSpend: [{cardName: 'Card4', amount: 1000}],
        categoryWiseSpend: [{category: 'Entertainment', amount: 400}]
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var beforeTime = Date.now();
      AnalyticsService.getSpendingInsights();
      $rootScope.$digest();
      var afterTime = Date.now();
      
      var cachedEntry = cache.get('insights');
      expect(cachedEntry).toBeDefined();
      expect(cachedEntry.data.monthlyTrends).toEqual(apiResponse.monthlyTrends);
      expect(cachedEntry.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(cachedEntry.timestamp).toBeLessThanOrEqual(afterTime);
    });
    
    it('should handle API errors and reject the promise', function() {
      var deferred = $q.defer();
      deferred.reject({message: 'Network error'});
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var error;
      AnalyticsService.getSpendingInsights().catch(function(err) {
        error = err;
      });
      $rootScope.$digest();
      
      expect(error).toBeDefined();
      expect(error.message).toBe('Network error');
    });
    
    it('should handle empty API response gracefully', function() {
      var apiResponse = {};
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      AnalyticsService.getSpendingInsights().then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      expect(result.monthlyTrends).toEqual([]);
      expect(result.cardWiseSpend).toEqual([]);
      expect(result.categoryWiseSpend).toEqual([]);
    });
  });
});