/*
Test Documentation:
- Test Name: CreditCardDataService - fetchAllCards with cache
- Purpose: Validates that fetchAllCards returns cached data when available
- Scenario: User requests cards and cache contains data
- Expected Result: Returns cached cards without HTTP call
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - fetchAllCards without cache
- Purpose: Validates that fetchAllCards makes HTTP call when cache is empty
- Scenario: User requests cards and cache is empty
- Expected Result: Makes HTTP GET request and caches result
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - getCardBalances
- Purpose: Validates that getCardBalances fetches balances from API or returns mock data
- Scenario: User requests card balances
- Expected Result: Returns array of card balances with creditLimit, currentBalance, availableCredit
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - fetchCardSummaries
- Purpose: Validates that fetchCardSummaries retrieves card summaries
- Scenario: User requests card summaries
- Expected Result: Returns array of card summaries with maskedNumber, creditLimit, availableCredit, outstandingAmount
*/
/*
Coverage Report:
- Functions tested: fetchAllCards, getCardBalances, fetchCardSummaries, getAllCards
- Scenarios covered: cache hit, cache miss, HTTP success, HTTP error with fallback, mock data
- Uncovered scenarios: none
*/

describe('CreditCardDataService', function() {
  'use strict';

  var CreditCardDataService, $httpBackend, $cacheFactory;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _$cacheFactory_) {
    CreditCardDataService = _CreditCardDataService_;
    $httpBackend = _$httpBackend_;
    $cacheFactory = _$cacheFactory_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('fetchAllCards', function() {
    it('should return cached cards when cache is available', function() {
      var cache = $cacheFactory.get('cardCache');
      var mockCards = [{cardId: 'card1', cardType: 'Visa'}];
      cache.put('cards_user123', mockCards);

      var result;
      CreditCardDataService.fetchAllCards('user123').then(function(data) {
        result = data;
      });

      expect(result).toEqual(mockCards);
    });

    it('should make HTTP call when cache is empty and cache the result', function() {
      var mockCards = [{cardId: 'card1', cardType: 'Visa'}];
      $httpBackend.expectGET('/api/cards?userId=user123').respond(200, mockCards);

      var result;
      CreditCardDataService.fetchAllCards('user123').then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result).toEqual(mockCards);
      var cache = $cacheFactory.get('cardCache');
      expect(cache.get('cards_user123')).toEqual(mockCards);
    });

    it('should return mock cards when HTTP call fails', function() {
      $httpBackend.expectGET('/api/cards?userId=user123').respond(500, 'Server Error');

      var result;
      CreditCardDataService.fetchAllCards('user123').then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result.length).toBe(3);
      expect(result[0].cardId).toBe('card1');
      expect(result[0].cardType).toBe('Visa');
    });
  });

  describe('getCardBalances', function() {
    it('should fetch card balances from API', function() {
      var mockBalances = [
        {cardId: 'card1', creditLimit: 50000, currentBalance: 15000, availableCredit: 35000}
      ];
      $httpBackend.expectGET('/api/cards/balances?userId=user123').respond(200, mockBalances);

      var result;
      CreditCardDataService.getCardBalances('user123').then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result).toEqual(mockBalances);
    });

    it('should return mock balances when API call fails', function() {
      $httpBackend.expectGET('/api/cards/balances?userId=user123').respond(404, 'Not Found');

      var result;
      CreditCardDataService.getCardBalances('user123').then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result.length).toBe(3);
      expect(result[0].cardId).toBe('card1');
      expect(result[0].creditLimit).toBe(50000);
    });
  });

  describe('fetchCardSummaries', function() {
    it('should fetch card summaries from API', function() {
      var mockSummaries = [
        {cardId: 'card1', maskedNumber: '**** 1234', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000}
      ];
      $httpBackend.expectGET('/api/cards/summary?userId=user123').respond(200, mockSummaries);

      var result;
      CreditCardDataService.fetchCardSummaries('user123').then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result).toEqual(mockSummaries);
    });

    it('should return mock summaries when API call fails', function() {
      $httpBackend.expectGET('/api/cards/summary?userId=user123').respond(500, 'Error');

      var result;
      CreditCardDataService.fetchCardSummaries('user123').then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result.length).toBe(3);
      expect(result[0].maskedNumber).toBe('**** 1234');
    });
  });

  describe('getAllCards', function() {
    it('should delegate to fetchAllCards', function() {
      spyOn(CreditCardDataService, 'fetchAllCards').and.callThrough();
      $httpBackend.expectGET('/api/cards?userId=user456').respond(200, []);

      CreditCardDataService.getAllCards('user456');
      $httpBackend.flush();

      expect(CreditCardDataService.fetchAllCards).toHaveBeenCalledWith('user456');
    });
  });
});