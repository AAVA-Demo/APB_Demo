/*
Test Documentation:
- Test Name: CreditCardDataService - getAllCards
- Purpose: Validates retrieval and caching of credit card data with proper masking
- Scenario: User requests all credit cards for their account
- Expected Result: Returns array of cards with masked numbers, balances, limits, and utilization rates
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardBalances, fetchCardSummaries, fetchAllCards, maskCardNumber, calculateUtilization
- Scenarios covered: successful API response, API failure with mock data, caching, card number masking, utilization calculation
- Uncovered scenarios: none
*/

describe('CreditCardDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CreditCardDataService, $httpBackend, $cacheFactory, API_BASE_URL;
  
  beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _$cacheFactory_, _API_BASE_URL_) {
    CreditCardDataService = _CreditCardDataService_;
    $httpBackend = _$httpBackend_;
    $cacheFactory = _$cacheFactory_;
    API_BASE_URL = _API_BASE_URL_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    var cache = $cacheFactory.get('cardCache');
    if (cache) cache.removeAll();
  });
  
  describe('getAllCards', function() {
    it('should return cards from API with masked numbers', function() {
      var mockResponse = [
        { cardId: 'C001', userId: 'U001', cardNumber: '4532123456789012', cardType: 'Visa', creditLimit: 50000, availableCredit: 35000, currentBalance: 15000, outstandingAmount: 15000, monthlySpend: 12000 }
      ];
      $httpBackend.expectGET(API_BASE_URL + '/api/cards?userId=U001').respond(200, mockResponse);
      
      CreditCardDataService.getAllCards('U001').then(function(result) {
        expect(result.length).toBe(1);
        expect(result[0].maskedNumber).toBe('**** **** **** 9012');
        expect(result[0].creditLimit).toBe(50000);
        expect(result[0].utilizationRate).toBe('30.00');
      });
      $httpBackend.flush();
    });
    
    it('should cache cards and return from cache on subsequent calls', function() {
      var mockResponse = [
        { cardId: 'C001', userId: 'U001', cardNumber: '4532123456789012', cardType: 'Visa', creditLimit: 50000, availableCredit: 35000, currentBalance: 15000, outstandingAmount: 15000 }
      ];
      $httpBackend.expectGET(API_BASE_URL + '/api/cards?userId=U001').respond(200, mockResponse);
      
      CreditCardDataService.getAllCards('U001').then(function() {
        CreditCardDataService.getAllCards('U001').then(function(result) {
          expect(result.length).toBe(1);
        });
      });
      $httpBackend.flush();
    });
    
    it('should return mock cards on API failure', function() {
      $httpBackend.expectGET(API_BASE_URL + '/api/cards?userId=U001').respond(500, 'Server Error');
      
      CreditCardDataService.getAllCards('U001').then(function(result) {
        expect(result.length).toBe(3);
        expect(result[0].cardId).toBe('C001');
        expect(result[0].maskedNumber).toBeDefined();
        expect(result[0].utilizationRate).toBeDefined();
      });
      $httpBackend.flush();
    });
    
    it('should calculate utilization rate correctly', function() {
      var mockResponse = [
        { cardId: 'C001', userId: 'U001', cardNumber: '4532123456789012', cardType: 'Visa', creditLimit: 100000, availableCredit: 60000, currentBalance: 40000, outstandingAmount: 40000 }
      ];
      $httpBackend.expectGET(API_BASE_URL + '/api/cards?userId=U001').respond(200, mockResponse);
      
      CreditCardDataService.getAllCards('U001').then(function(result) {
        expect(result[0].utilizationRate).toBe('40.00');
      });
      $httpBackend.flush();
    });
  });
  
  describe('getCardBalances', function() {
    it('should return card balances from API', function() {
      var mockResponse = [
        { cardId: 'C001', creditLimit: 50000, currentBalance: 15000, availableCredit: 35000 }
      ];
      $httpBackend.expectGET(API_BASE_URL + '/api/cards/balances?userId=U001').respond(200, mockResponse);
      
      CreditCardDataService.getCardBalances('U001').then(function(result) {
        expect(result.length).toBe(1);
        expect(result[0].creditLimit).toBe(50000);
      });
      $httpBackend.flush();
    });
    
    it('should return mock balances on API failure', function() {
      $httpBackend.expectGET(API_BASE_URL + '/api/cards/balances?userId=U001').respond(500);
      
      CreditCardDataService.getCardBalances('U001').then(function(result) {
        expect(result.length).toBe(3);
        expect(result[0].cardId).toBeDefined();
      });
      $httpBackend.flush();
    });
  });
  
  describe('fetchCardSummaries', function() {
    it('should return card summaries from API', function() {
      var mockResponse = [
        { cardId: 'C001', maskedNumber: '**** 9012', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000 }
      ];
      $httpBackend.expectGET(API_BASE_URL + '/api/cards/summary?userId=U001').respond(200, mockResponse);
      
      CreditCardDataService.fetchCardSummaries('U001').then(function(result) {
        expect(result.length).toBe(1);
        expect(result[0].cardId).toBe('C001');
      });
      $httpBackend.flush();
    });
  });
  
  describe('fetchAllCards', function() {
    it('should call getAllCards', function() {
      $httpBackend.expectGET(API_BASE_URL + '/api/cards?userId=U001').respond(500);
      
      CreditCardDataService.fetchAllCards('U001').then(function(result) {
        expect(result.length).toBeGreaterThan(0);
      });
      $httpBackend.flush();
    });
  });
});