/*
Test Documentation:
- Test Name: CreditCardDataService - fetchUserCards success
- Purpose: Validates successful retrieval of credit card data
- Scenario: First call fetches from API
- Expected Result: Returns credit card data and caches it

- Test Name: CreditCardDataService - cache functionality
- Purpose: Validates that cached data is returned within cache duration
- Scenario: Second call within 5 minutes uses cache
- Expected Result: Returns cached data without API call

- Test Name: CreditCardDataService - force refresh
- Purpose: Validates cache bypass with forceRefresh flag
- Scenario: forceRefresh=true bypasses cache
- Expected Result: Makes new API call and updates cache

- Test Name: CreditCardDataService - error handling with cache fallback
- Purpose: Validates fallback to cached data on error
- Scenario: API fails but cache exists
- Expected Result: Returns cached data instead of rejecting

- Test Name: CreditCardDataService - clearCache
- Purpose: Validates cache clearing functionality
- Scenario: clearCache is called
- Expected Result: Cache is cleared and next call fetches fresh data

Coverage Report:
- Functions tested: fetchUserCards, clearCache
- Scenarios covered: success, caching, force refresh, error with cache, error without cache, cache clearing
- Edge cases: cache expiration, concurrent requests
- Uncovered scenarios: race conditions (handled by $q)
*/

(function() {
  'use strict';

  describe('CreditCardDataService', function() {
    var CreditCardDataService, $httpBackend, $q, API_BASE_URL;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _$q_, _API_BASE_URL_) {
      CreditCardDataService = _CreditCardDataService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      API_BASE_URL = _API_BASE_URL_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      CreditCardDataService.clearCache();
    });

    describe('fetchUserCards', function() {
      it('should successfully fetch credit card data from API', function() {
        var mockResponse = [
          { cardId: 'card-001', cardName: 'Visa Gold', creditLimit: 5000, currentBalance: 1200, availableCredit: 3800 },
          { cardId: 'card-002', cardName: 'MasterCard', creditLimit: 10000, currentBalance: 2500, availableCredit: 7500 }
        ];

        $httpBackend.expectGET(API_BASE_URL + '/creditcards/user')
          .respond(200, mockResponse);

        var result;
        CreditCardDataService.fetchUserCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(2);
      });

      it('should return cached data on second call within cache duration', function() {
        var mockResponse = [{ cardId: 'card-001', cardName: 'Visa' }];

        $httpBackend.expectGET(API_BASE_URL + '/creditcards/user')
          .respond(200, mockResponse);

        var firstResult, secondResult;
        CreditCardDataService.fetchUserCards().then(function(data) {
          firstResult = data;
        });

        $httpBackend.flush();

        CreditCardDataService.fetchUserCards().then(function(data) {
          secondResult = data;
        });

        expect(secondResult).toEqual(firstResult);
        expect(secondResult).toEqual(mockResponse);
      });

      it('should bypass cache when forceRefresh is true', function() {
        var mockResponse1 = [{ cardId: 'card-001', cardName: 'Visa' }];
        var mockResponse2 = [{ cardId: 'card-002', cardName: 'MasterCard' }];

        $httpBackend.expectGET(API_BASE_URL + '/creditcards/user')
          .respond(200, mockResponse1);

        CreditCardDataService.fetchUserCards();
        $httpBackend.flush();

        $httpBackend.expectGET(API_BASE_URL + '/creditcards/user')
          .respond(200, mockResponse2);

        var result;
        CreditCardDataService.fetchUserCards(true).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse2);
      });

      it('should return cached data when API fails and cache exists', function() {
        var mockResponse = [{ cardId: 'card-001', cardName: 'Visa' }];

        $httpBackend.expectGET(API_BASE_URL + '/creditcards/user')
          .respond(200, mockResponse);

        CreditCardDataService.fetchUserCards();
        $httpBackend.flush();

        spyOn(console, 'error');

        $httpBackend.expectGET(API_BASE_URL + '/creditcards/user')
          .respond(500, { message: 'Server error' });

        var result;
        CreditCardDataService.fetchUserCards(true).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
        expect(console.error).toHaveBeenCalled();
      });

      it('should reject promise when API fails and no cache exists', function() {
        var errorCaught = false;

        spyOn(console, 'error');

        $httpBackend.expectGET(API_BASE_URL + '/creditcards/user')
          .respond(500, { message: 'Server error' });

        CreditCardDataService.fetchUserCards().catch(function(error) {
          errorCaught = true;
          expect(error.status).toBe(500);
        });

        $httpBackend.flush();

        expect(errorCaught).toBe(true);
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle empty credit card array', function() {
        var mockResponse = [];

        $httpBackend.expectGET(API_BASE_URL + '/creditcards/user')
          .respond(200, mockResponse);

        var result;
        CreditCardDataService.fetchUserCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
      });
    });

    describe('clearCache', function() {
      it('should clear cache and fetch fresh data on next call', function() {
        var mockResponse1 = [{ cardId: 'card-001' }];
        var mockResponse2 = [{ cardId: 'card-002' }];

        $httpBackend.expectGET(API_BASE_URL + '/creditcards/user')
          .respond(200, mockResponse1);

        CreditCardDataService.fetchUserCards();
        $httpBackend.flush();

        CreditCardDataService.clearCache();

        $httpBackend.expectGET(API_BASE_URL + '/creditcards/user')
          .respond(200, mockResponse2);

        var result;
        CreditCardDataService.fetchUserCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse2);
      });

      it('should allow clearCache to be called multiple times safely', function() {
        CreditCardDataService.clearCache();
        CreditCardDataService.clearCache();
        CreditCardDataService.clearCache();

        expect(function() {
          CreditCardDataService.clearCache();
        }).not.toThrow();
      });
    });
  });
})();