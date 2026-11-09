/*
Test Documentation:
- Test Name: DashboardDataService - getKPIs - returns cached KPI data when cache is valid
- Purpose: Validates that the service returns cached dashboard KPIs when cache TTL has not expired
- Scenario: Cache contains valid KPI data within TTL period
- Expected Result: Service returns cached KPIs without making API call
*/
/*
Test Documentation:
- Test Name: DashboardDataService - getKPIs - fetches fresh data when cache is expired
- Purpose: Validates that the service fetches new KPI data from API when cache has expired
- Scenario: Cache is expired or empty
- Expected Result: Service makes API call and caches the response
*/
/*
Test Documentation:
- Test Name: DashboardDataService - getKPIs - handles API errors gracefully
- Purpose: Validates error handling when API call fails
- Scenario: API returns error response
- Expected Result: Service rejects promise with error
*/
/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered: cache hit, cache miss, API success, API failure, data transformation, default values
- Uncovered scenarios: none
*/

describe('DashboardDataService', function() {
  'use strict';
  
  var DashboardDataService;
  var ApiFactory;
  var $q;
  var $rootScope;
  var $cacheFactory;
  var cache;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_DashboardDataService_, _ApiFactory_, _$q_, _$rootScope_, _$cacheFactory_) {
    DashboardDataService = _DashboardDataService_;
    ApiFactory = _ApiFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $cacheFactory = _$cacheFactory_;
    cache = $cacheFactory.get('dashboardCache');
  }));
  
  afterEach(function() {
    if (cache) {
      cache.removeAll();
    }
  });
  
  describe('getKPIs', function() {
    
    it('should return cached KPI data when cache is valid and within TTL', function() {
      var cachedKPIs = {
        totalCreditLimit: 50000,
        totalAvailableCredit: 30000,
        totalOutstanding: 20000,
        currentMonthSpend: 5000,
        cards: [{cardId: '1', cardType: 'Visa'}]
      };
      var cachedEntry = {
        data: cachedKPIs,
        timestamp: Date.now() - 15000
      };
      cache.put('kpis', cachedEntry);
      
      spyOn(ApiFactory, 'get');
      
      var result;
      DashboardDataService.getKPIs().then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      expect(result).toEqual(cachedKPIs);
      expect(ApiFactory.get).not.toHaveBeenCalled();
    });
    
    it('should fetch fresh KPI data from API when cache is empty', function() {
      var apiResponse = {
        totalCreditLimit: 75000,
        totalAvailableCredit: 45000,
        totalOutstanding: 30000,
        currentMonthSpend: 8000,
        cards: [
          {cardId: '2', cardType: 'Mastercard'},
          {cardId: '3', cardType: 'Amex'}
        ]
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      DashboardDataService.getKPIs().then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      expect(ApiFactory.get).toHaveBeenCalledWith('/dashboard/kpis');
      expect(result.totalCreditLimit).toBe(apiResponse.totalCreditLimit);
      expect(result.totalAvailableCredit).toBe(apiResponse.totalAvailableCredit);
      expect(result.totalOutstanding).toBe(apiResponse.totalOutstanding);
      expect(result.currentMonthSpend).toBe(apiResponse.currentMonthSpend);
      expect(result.cards).toEqual(apiResponse.cards);
    });
    
    it('should fetch fresh data when cache is expired beyond TTL', function() {
      var oldCachedKPIs = {
        totalCreditLimit: 10000,
        totalAvailableCredit: 5000,
        totalOutstanding: 5000,
        currentMonthSpend: 1000,
        cards: []
      };
      var oldCachedEntry = {
        data: oldCachedKPIs,
        timestamp: Date.now() - 40000
      };
      cache.put('kpis', oldCachedEntry);
      
      var apiResponse = {
        totalCreditLimit: 100000,
        totalAvailableCredit: 60000,
        totalOutstanding: 40000,
        currentMonthSpend: 12000,
        cards: [{cardId: '4', cardType: 'Discover'}]
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      DashboardDataService.getKPIs().then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      expect(ApiFactory.get).toHaveBeenCalledWith('/dashboard/kpis');
      expect(result.totalCreditLimit).toBe(apiResponse.totalCreditLimit);
    });
    
    it('should provide default values when API response fields are missing', function() {
      var apiResponse = {
        totalCreditLimit: 25000
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      DashboardDataService.getKPIs().then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      expect(result.totalCreditLimit).toBe(25000);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.currentMonthSpend).toBe(0);
      expect(result.cards).toEqual([]);
    });
    
    it('should cache the fetched KPI data with current timestamp', function() {
      var apiResponse = {
        totalCreditLimit: 60000,
        totalAvailableCredit: 35000,
        totalOutstanding: 25000,
        currentMonthSpend: 7000,
        cards: [{cardId: '5', cardType: 'Visa Platinum'}]
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var beforeTime = Date.now();
      DashboardDataService.getKPIs();
      $rootScope.$digest();
      var afterTime = Date.now();
      
      var cachedEntry = cache.get('kpis');
      expect(cachedEntry).toBeDefined();
      expect(cachedEntry.data.totalCreditLimit).toBe(apiResponse.totalCreditLimit);
      expect(cachedEntry.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(cachedEntry.timestamp).toBeLessThanOrEqual(afterTime);
    });
    
    it('should handle API errors and reject the promise', function() {
      var deferred = $q.defer();
      deferred.reject({message: 'Server error', status: 500});
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var error;
      DashboardDataService.getKPIs().catch(function(err) {
        error = err;
      });
      $rootScope.$digest();
      
      expect(error).toBeDefined();
      expect(error.message).toBe('Server error');
      expect(error.status).toBe(500);
    });
    
    it('should handle empty API response by providing all default values', function() {
      var apiResponse = {};
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      DashboardDataService.getKPIs().then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.currentMonthSpend).toBe(0);
      expect(result.cards).toEqual([]);
    });
    
    it('should handle partial API response with some missing fields', function() {
      var apiResponse = {
        totalCreditLimit: 40000,
        currentMonthSpend: 6000,
        cards: [{cardId: '6', cardType: 'Gold Card'}]
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      DashboardDataService.getKPIs().then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      
      expect(result.totalCreditLimit).toBe(40000);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.currentMonthSpend).toBe(6000);
      expect(result.cards).toEqual(apiResponse.cards);
    });
    
    it('should make API call with correct endpoint', function() {
      var deferred = $q.defer();
      deferred.resolve({});
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      DashboardDataService.getKPIs();
      $rootScope.$digest();
      
      expect(ApiFactory.get).toHaveBeenCalledWith('/dashboard/kpis');
      expect(ApiFactory.get).toHaveBeenCalledTimes(1);
    });
  });
});