/*
Test Documentation:
- Test Name: creditCardDataService Data Fetching and Caching
- Purpose: Validate credit card data retrieval with caching mechanism
- Scenario: Fetch data from API, cache results, return cached data on subsequent calls, cache clearing
- Expected Result: API called only when cache empty, cached data returned when available, cache cleared on demand
*/

describe('creditCardDataService', function() {
  beforeEach(module('creditCardApp'));

  var creditCardDataService, apiService, $q, $rootScope, $cacheFactory;

  beforeEach(inject(function(_creditCardDataService_, _apiService_, _$q_, _$rootScope_, _$cacheFactory_) {
    creditCardDataService = _creditCardDataService_;
    apiService = _apiService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $cacheFactory = _$cacheFactory_;
  }));

  afterEach(function() {
    creditCardDataService.clearCache();
  });

  describe('fetchAllCards()', function() {
    it('should call apiService.get when cache is empty', function() {
      var mockCards = [{ cardId: 1, cardName: 'Card 1' }];
      spyOn(apiService, 'get').and.returnValue($q.resolve(mockCards));

      creditCardDataService.fetchAllCards();

      expect(apiService.get).toHaveBeenCalledWith('/user/creditcards');
    });

    it('should cache API response', function() {
      var mockCards = [{ cardId: 1, cardName: 'Card 1' }];
      spyOn(apiService, 'get').and.returnValue($q.resolve(mockCards));

      var result;
      creditCardDataService.fetchAllCards().then(function(data) {
        result = data;
      });

      $rootScope.$digest();
      expect(result).toEqual(mockCards);

      // Second call should use cache
      creditCardDataService.fetchAllCards().then(function(data) {
        result = data;
      });

      $rootScope.$digest();
      expect(apiService.get.calls.count()).toBe(1);
    });

    it('should return cached data on subsequent calls', function() {
      var mockCards = [{ cardId: 1, cardName: 'Card 1' }];
      spyOn(apiService, 'get').and.returnValue($q.resolve(mockCards));

      var firstResult, secondResult;
      creditCardDataService.fetchAllCards().then(function(data) {
        firstResult = data;
      });
      $rootScope.$digest();

      creditCardDataService.fetchAllCards().then(function(data) {
        secondResult = data;
      });
      $rootScope.$digest();

      expect(firstResult).toEqual(secondResult);
      expect(apiService.get.calls.count()).toBe(1);
    });

    it('should handle API errors', function() {
      spyOn(apiService, 'get').and.returnValue($q.reject('API Error'));

      var errorCaught = false;
      creditCardDataService.fetchAllCards().catch(function() {
        errorCaught = true;
      });

      $rootScope.$digest();
      expect(errorCaught).toBe(true);
    });

    it('should fetch fresh data after cache is cleared', function() {
      var mockCards = [{ cardId: 1, cardName: 'Card 1' }];
      spyOn(apiService, 'get').and.returnValue($q.resolve(mockCards));

      creditCardDataService.fetchAllCards();
      $rootScope.$digest();

      creditCardDataService.clearCache();

      creditCardDataService.fetchAllCards();
      $rootScope.$digest();

      expect(apiService.get.calls.count()).toBe(2);
    });
  });

  describe('clearCache()', function() {
    it('should clear all cached data', function() {
      var mockCards = [{ cardId: 1, cardName: 'Card 1' }];
      spyOn(apiService, 'get').and.returnValue($q.resolve(mockCards));

      creditCardDataService.fetchAllCards();
      $rootScope.$digest();

      creditCardDataService.clearCache();

      var cache = $cacheFactory.get('creditCardCache');
      expect(cache.get('allCards')).toBeUndefined();
    });

    it('should not throw error when called on empty cache', function() {
      expect(function() {
        creditCardDataService.clearCache();
      }).not.toThrow();
    });
  });
});

/*
Coverage Report:
- Functions tested: fetchAllCards, clearCache
- Scenarios covered: API calls, caching behavior, cache retrieval, cache clearing, error handling
- Edge cases: empty cache, API errors, multiple calls, cache invalidation
- Uncovered scenarios: none - all caching and data retrieval patterns tested
*/