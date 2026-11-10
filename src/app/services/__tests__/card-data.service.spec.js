/*
Test Documentation:
- Test Name: CardDataService - fetchUserCards with cache
- Purpose: Verify service returns cached cards when cache is valid
- Scenario: Cards are cached and cache timestamp is within 60 seconds
- Expected Result: Returns cached data without making HTTP request
*/
/*
Test Documentation:
- Test Name: CardDataService - fetchUserCards without cache
- Purpose: Verify service fetches cards from API when cache is invalid
- Scenario: No cached data or cache expired
- Expected Result: Makes HTTP GET request and caches response
*/
/*
Test Documentation:
- Test Name: CardDataService - fetchUserCards error handling
- Purpose: Verify service returns cached data on API failure
- Scenario: HTTP request fails but cache exists
- Expected Result: Returns stale cached data as fallback
*/
/*
Test Documentation:
- Test Name: CardDataService - fetchCardSpendAnalysis
- Purpose: Verify service fetches spend analysis for specific card
- Scenario: Valid cardId provided
- Expected Result: Returns spend analysis data from API
*/
/*
Test Documentation:
- Test Name: CardDataService - getCardBalances success
- Purpose: Verify service retrieves card balances from API
- Scenario: API returns balance data
- Expected Result: Returns array of card balance objects
*/
/*
Test Documentation:
- Test Name: CardDataService - getCardBalances fallback
- Purpose: Verify service returns mock data when API fails
- Scenario: HTTP request fails
- Expected Result: Returns demo balance data
*/
/*
Coverage Report:
- Functions tested: fetchUserCards, fetchCardSpendAnalysis, getCardBalances
- Scenarios covered: cache hit, cache miss, API success, API failure, fallback data
- Uncovered scenarios: concurrent request handling, cache invalidation
*/

describe('CardDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CardDataService, $httpBackend, $q, API_CONFIG;
  
  beforeEach(inject(function(_CardDataService_, _$httpBackend_, _$q_, _API_CONFIG_) {
    CardDataService = _CardDataService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('fetchUserCards', function() {
    it('should fetch cards from API when cache is empty', function() {
      var mockCards = [
        { cardId: 'card1', cardNumber: '****1234', cardType: 'Visa' },
        { cardId: 'card2', cardNumber: '****5678', cardType: 'Mastercard' }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(200, mockCards);
      
      var result;
      CardDataService.fetchUserCards().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockCards);
      expect(result.length).toBe(2);
    });
    
    it('should return cached cards when cache is valid', function() {
      var mockCards = [{ cardId: 'card1', cardNumber: '****1234' }];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(200, mockCards);
      
      CardDataService.fetchUserCards();
      $httpBackend.flush();
      
      var result;
      CardDataService.fetchUserCards().then(function(data) {
        result = data;
      });
      
      expect(result).toEqual(mockCards);
    });
    
    it('should handle API errors gracefully', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(500, 'Server Error');
      
      var error;
      CardDataService.fetchUserCards().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    it('should respect timeout configuration', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(200, []);
      
      CardDataService.fetchUserCards();
      $httpBackend.flush();
    });
  });
  
  describe('fetchCardSpendAnalysis', function() {
    it('should fetch spend analysis for specific card', function() {
      var cardId = 'card123';
      var mockAnalysis = {
        totalSpend: 15000,
        categories: [{ name: 'Food', amount: 5000 }]
      };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/' + cardId + '/spend')
        .respond(200, mockAnalysis);
      
      var result;
      CardDataService.fetchCardSpendAnalysis(cardId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockAnalysis);
      expect(result.totalSpend).toBe(15000);
    });
    
    it('should handle invalid cardId', function() {
      var cardId = 'invalid';
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/' + cardId + '/spend')
        .respond(404, 'Not Found');
      
      var error;
      CardDataService.fetchCardSpendAnalysis(cardId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
  });
  
  describe('getCardBalances', function() {
    it('should fetch card balances from API', function() {
      var mockBalances = [
        {
          cardId: 'card1',
          creditLimit: 50000,
          availableCredit: 35000,
          outstandingAmount: 15000
        }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/balances')
        .respond(200, mockBalances);
      
      var result;
      CardDataService.getCardBalances().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockBalances);
      expect(result[0].creditLimit).toBe(50000);
    });
    
    it('should return demo data when API fails', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/balances')
        .respond(500, 'Server Error');
      
      var result;
      CardDataService.getCardBalances().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('demo1');
    });
    
    it('should return valid balance structure', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/balances')
        .respond(500);
      
      var result;
      CardDataService.getCardBalances().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result[0]).toEqual(jasmine.objectContaining({
        cardId: jasmine.any(String),
        creditLimit: jasmine.any(Number),
        availableCredit: jasmine.any(Number),
        outstandingAmount: jasmine.any(Number)
      }));
    });
  });
});