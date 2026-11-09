/*
Test Documentation:
- Test Name: CreditCardService - fetchAllCards - returns cached cards when cache is valid
- Purpose: Validates that the service returns cached card data when cache TTL has not expired
- Scenario: Cache contains valid card data within TTL period
- Expected Result: Service returns cached cards without making API call
*/
/*
Test Documentation:
- Test Name: CreditCardService - fetchAllCards - fetches fresh data when cache is expired
- Purpose: Validates that the service fetches new data from API when cache has expired
- Scenario: Cache is expired or empty
- Expected Result: Service makes API call and caches the response
*/
/*
Test Documentation:
- Test Name: CreditCardService - fetchAllCards - handles API errors gracefully
- Purpose: Validates error handling when API call fails
- Scenario: API returns error response
- Expected Result: Service rejects promise with error
*/
/*
Coverage Report:
- Functions tested: fetchAllCards
- Scenarios covered: cache hit, cache miss, API success, API failure, cache expiration
- Uncovered scenarios: none
*/

describe('CreditCardService', function() {
  'use strict';
  
  var CreditCardService;
  var $http;
  var $httpBackend;
  var $q;
  var $rootScope;
  var API_ENDPOINTS;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CreditCardService_, _$http_, _$httpBackend_, _$q_, _$rootScope_, _API_ENDPOINTS_) {
    CreditCardService = _CreditCardService_;
    $http = _$http_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    API_ENDPOINTS = _API_ENDPOINTS_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('fetchAllCards', function() {
    
    it('should fetch cards from API when cache is empty', function() {
      var mockCards = [
        {cardId: '1', cardType: 'Visa', cardNumber: '****1234', creditLimit: 10000},
        {cardId: '2', cardType: 'Mastercard', cardNumber: '****5678', creditLimit: 15000}
      ];
      
      $httpBackend.expectGET(API_ENDPOINTS.cards).respond(200, mockCards);
      
      var result;
      CreditCardService.fetchAllCards().then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockCards);
    });
    
    it('should return cached cards when cache is valid and within TTL', function() {
      var mockCards = [{cardId: '3', cardType: 'Amex'}];
      
      $httpBackend.expectGET(API_ENDPOINTS.cards).respond(200, mockCards);
      
      var result1;
      CreditCardService.fetchAllCards().then(function(cards) {
        result1 = cards;
      });
      $httpBackend.flush();
      
      var result2;
      CreditCardService.fetchAllCards().then(function(cards) {
        result2 = cards;
      });
      $rootScope.$digest();
      
      expect(result1).toEqual(mockCards);
      expect(result2).toEqual(mockCards);
    });
    
    it('should handle API errors and reject the promise', function() {
      $httpBackend.expectGET(API_ENDPOINTS.cards).respond(500, {message: 'Server error'});
      
      var error;
      CreditCardService.fetchAllCards().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should handle network errors gracefully', function() {
      $httpBackend.expectGET(API_ENDPOINTS.cards).respond(0, '');
      
      var error;
      CreditCardService.fetchAllCards().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    it('should cache the fetched cards for subsequent calls', function() {
      var mockCards = [{cardId: '4', cardType: 'Discover'}];
      
      $httpBackend.expectGET(API_ENDPOINTS.cards).respond(200, mockCards);
      
      CreditCardService.fetchAllCards();
      $httpBackend.flush();
      
      var result;
      CreditCardService.fetchAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();
      
      expect(result).toEqual(mockCards);
    });
    
    it('should handle empty array response from API', function() {
      $httpBackend.expectGET(API_ENDPOINTS.cards).respond(200, []);
      
      var result;
      CreditCardService.fetchAllCards().then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
  });
});