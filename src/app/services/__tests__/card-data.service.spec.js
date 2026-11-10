/*
Test Documentation:
- Test Name: CardDataService - getAllCards with cached data
- Purpose: Verify that cached card data is returned when available
- Scenario: User requests card data that exists in cache
- Expected Result: Service returns cached data without making HTTP call
*/
/*
Test Documentation:
- Test Name: CardDataService - getAllCards with successful HTTP response
- Purpose: Verify that service fetches and caches card data from API
- Scenario: User requests card data with no cache, API returns success
- Expected Result: Service makes HTTP call, caches response, and returns data
*/
/*
Test Documentation:
- Test Name: CardDataService - getAllCards with HTTP error fallback
- Purpose: Verify that service returns mock data when API fails
- Scenario: User requests card data, API returns error
- Expected Result: Service returns mock data and caches it
*/
/*
Test Documentation:
- Test Name: CardDataService - invalidateCache
- Purpose: Verify that cache is cleared when invalidateCache is called
- Scenario: User invalidates cache after data update
- Expected Result: Cache is completely cleared
*/
/*
Coverage Report:
- Functions tested: getAllCards (cached), getAllCards (HTTP success), getAllCards (HTTP error), invalidateCache
- Scenarios covered: cache hit, cache miss with success, API failure with fallback, cache invalidation
- Uncovered scenarios: none
*/

describe('CardDataService', function() {
  'use strict';

  var CardDataService, $httpBackend, $q, $cacheFactory, cache;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CardDataService_, _$httpBackend_, _$q_, _$cacheFactory_) {
    CardDataService = _CardDataService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $cacheFactory = _$cacheFactory_;
    cache = $cacheFactory.get('cardDataCache');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    if (cache) {
      cache.removeAll();
    }
  });

  it('should return cached card data when cache exists', function() {
    var userId = 'user123';
    var cachedCards = [
      {cardId: 'card1', cardNumber: '**** 1234', creditLimit: 5000}
    ];
    cache.put('cards_' + userId, cachedCards);

    var result;
    CardDataService.getAllCards(userId).then(function(data) {
      result = data;
    });

    expect(result).toEqual(cachedCards);
  });

  it('should fetch cards from API and cache when no cache exists', function() {
    var userId = 'user456';
    var apiResponse = [
      {cardId: 'card2', cardNumber: '**** 5678', creditLimit: 10000}
    ];

    $httpBackend.expectGET('/api/cards?userId=' + userId).respond(200, apiResponse);

    var result;
    CardDataService.getAllCards(userId).then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    expect(result).toEqual(apiResponse);
    expect(cache.get('cards_' + userId)).toEqual(apiResponse);
  });

  it('should return mock data when API call fails', function() {
    var userId = 'user789';

    $httpBackend.expectGET('/api/cards?userId=' + userId).respond(500, 'Server Error');

    var result;
    CardDataService.getAllCards(userId).then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    expect(result).toBeDefined();
    expect(result.length).toBe(3);
    expect(result[0].cardId).toBe('card1');
    expect(result[0].cardNumber).toBe('**** **** **** 1234');
    expect(result[0].creditLimit).toBe(10000);
    expect(cache.get('cards_' + userId)).toEqual(result);
  });

  it('should invalidate cache when invalidateCache is called', function() {
    cache.put('cards_user123', [{cardId: 'card1'}]);
    cache.put('cards_user456', [{cardId: 'card2'}]);

    expect(cache.get('cards_user123')).toBeDefined();
    expect(cache.get('cards_user456')).toBeDefined();

    CardDataService.invalidateCache();

    expect(cache.get('cards_user123')).toBeUndefined();
    expect(cache.get('cards_user456')).toBeUndefined();
  });

  it('should handle empty userId gracefully', function() {
    var userId = '';
    var mockData = [
      {cardId: 'card1', cardNumber: '**** **** **** 1234', creditLimit: 10000}
    ];

    $httpBackend.expectGET('/api/cards?userId=').respond(500, 'Bad Request');

    var result;
    CardDataService.getAllCards(userId).then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    expect(result).toBeDefined();
    expect(result.length).toBe(3);
  });

  it('should handle null userId gracefully', function() {
    var userId = null;

    $httpBackend.expectGET('/api/cards?userId=null').respond(400, 'Bad Request');

    var result;
    CardDataService.getAllCards(userId).then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    expect(result).toBeDefined();
    expect(result.length).toBe(3);
  });

  it('should return different cached data for different users', function() {
    var user1 = 'user111';
    var user2 = 'user222';
    var cards1 = [{cardId: 'card1', creditLimit: 5000}];
    var cards2 = [{cardId: 'card2', creditLimit: 8000}];

    cache.put('cards_' + user1, cards1);
    cache.put('cards_' + user2, cards2);

    var result1, result2;
    CardDataService.getAllCards(user1).then(function(data) {
      result1 = data;
    });
    CardDataService.getAllCards(user2).then(function(data) {
      result2 = data;
    });

    expect(result1).toEqual(cards1);
    expect(result2).toEqual(cards2);
    expect(result1).not.toEqual(result2);
  });
});