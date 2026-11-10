/*
Test Documentation:
- Test Name: userProfileService User Data and Preferences
- Purpose: Validate user card list retrieval with caching and user preferences management
- Scenario: Fetch user's card list, cache results, return user sorting preferences
- Expected Result: Card list cached and retrieved efficiently, preferences returned with defaults
*/

describe('userProfileService', function() {
  beforeEach(module('creditCardApp'));

  var userProfileService, apiService, $q, $rootScope, $cacheFactory;

  beforeEach(inject(function(_userProfileService_, _apiService_, _$q_, _$rootScope_, _$cacheFactory_) {
    userProfileService = _userProfileService_;
    apiService = _apiService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $cacheFactory = _$cacheFactory_;
  }));

  afterEach(function() {
    var cache = $cacheFactory.get('userProfileCache');
    if (cache) {
      cache.removeAll();
    }
  });

  describe('getUserCardList()', function() {
    it('should call apiService.get with correct endpoint', function() {
      spyOn(apiService, 'get').and.returnValue($q.resolve({ cardIds: [] }));

      userProfileService.getUserCardList();

      expect(apiService.get).toHaveBeenCalledWith('/user/cards');
    });

    it('should return user card list', function() {
      var mockCardList = { cardIds: ['card-1', 'card-2', 'card-3'] };
      spyOn(apiService, 'get').and.returnValue($q.resolve(mockCardList));

      var result;
      userProfileService.getUserCardList().then(function(data) {
        result = data;
      });

      $rootScope.$digest();
      expect(result).toEqual(mockCardList);
    });

    it('should cache API response', function() {
      var mockCardList = { cardIds: ['card-1', 'card-2'] };
      spyOn(apiService, 'get').and.returnValue($q.resolve(mockCardList));

      userProfileService.getUserCardList();
      $rootScope.$digest();

      userProfileService.getUserCardList();
      $rootScope.$digest();

      expect(apiService.get.calls.count()).toBe(1);
    });

    it('should return cached data on subsequent calls', function() {
      var mockCardList = { cardIds: ['card-1'] };
      spyOn(apiService, 'get').and.returnValue($q.resolve(mockCardList));

      var firstResult, secondResult;
      userProfileService.getUserCardList().then(function(data) {
        firstResult = data;
      });
      $rootScope.$digest();

      userProfileService.getUserCardList().then(function(data) {
        secondResult = data;
      });
      $rootScope.$digest();

      expect(firstResult).toEqual(secondResult);
      expect(apiService.get.calls.count()).toBe(1);
    });

    it('should handle API errors', function() {
      spyOn(apiService, 'get').and.returnValue($q.reject('API Error'));

      var errorCaught = false;
      userProfileService.getUserCardList().catch(function() {
        errorCaught = true;
      });

      $rootScope.$digest();
      expect(errorCaught).toBe(true);
    });
  });

  describe('getUserPreferences()', function() {
    it('should return default preferences', function() {
      var preferences = userProfileService.getUserPreferences();

      expect(preferences).toBeDefined();
      expect(preferences.sortBy).toBe('spend');
      expect(preferences.sortOrder).toBe('desc');
      expect(preferences.favoriteCards).toEqual([]);
    });

    it('should return preferences object with expected structure', function() {
      var preferences = userProfileService.getUserPreferences();

      expect(preferences.hasOwnProperty('sortBy')).toBe(true);
      expect(preferences.hasOwnProperty('sortOrder')).toBe(true);
      expect(preferences.hasOwnProperty('favoriteCards')).toBe(true);
    });

    it('should return consistent preferences on multiple calls', function() {
      var prefs1 = userProfileService.getUserPreferences();
      var prefs2 = userProfileService.getUserPreferences();

      expect(prefs1.sortBy).toBe(prefs2.sortBy);
      expect(prefs1.sortOrder).toBe(prefs2.sortOrder);
    });
  });
});

/*
Coverage Report:
- Functions tested: getUserCardList, getUserPreferences
- Scenarios covered: API calls, caching behavior, preferences retrieval, error handling
- Edge cases: API errors, cache hits, default preferences
- Uncovered scenarios: none - all user profile operations tested
*/