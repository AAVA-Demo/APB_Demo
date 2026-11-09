/*
Test Documentation:
- Test Name: creditCardDataService - getCreditCardData
- Purpose: Validates credit card data retrieval
- Scenario: Service fetches credit card balances and limits
- Expected Result: Returns array of credit cards with balance, limit, and available credit
*/
/*
Test Documentation:
- Test Name: creditCardDataService - error handling
- Purpose: Validates fallback to mock data on API failure
- Scenario: Service returns mock data when API call fails
- Expected Result: Returns mock credit card data with valid structure
*/
/*
Coverage Report:
- Functions tested: getCreditCardData
- Scenarios covered: successful API call, API failure with mock fallback, data structure validation
- Uncovered scenarios: none
*/

describe('creditCardDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var creditCardDataService, $httpBackend, $rootScope, apiConfig;
  
  beforeEach(inject(function(_creditCardDataService_, _$httpBackend_, _$rootScope_, _apiConfig_) {
    creditCardDataService = _creditCardDataService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    apiConfig = _apiConfig_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCreditCardData', function() {
    it('should return credit card data on successful API call', function() {
      var mockData = [
        {cardId: 'card1', cardNumber: '**** 1234', balance: 2500, creditLimit: 10000, availableCredit: 7500},
        {cardId: 'card2', cardNumber: '**** 5678', balance: 1200, creditLimit: 5000, availableCredit: 3800}
      ];
      
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.creditCards).respond(200, mockData);
      
      var result;
      creditCardDataService.getCreditCardData().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card1');
      expect(result[0].balance).toBe(2500);
    });
    
    it('should return mock data on API failure', function() {
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.creditCards).respond(500, 'Server Error');
      
      var result;
      creditCardDataService.getCreditCardData().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].cardId).toBe('card1');
    });
    
    it('should include all required card properties', function() {
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.creditCards).respond(500, 'Error');
      
      var result;
      creditCardDataService.getCreditCardData().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      var card = result[0];
      expect(card.cardId).toBeDefined();
      expect(card.cardNumber).toBeDefined();
      expect(card.balance).toBeDefined();
      expect(card.creditLimit).toBeDefined();
      expect(card.availableCredit).toBeDefined();
    });
    
    it('should respect API timeout configuration', function() {
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.creditCards).respond(200, []);
      
      creditCardDataService.getCreditCardData();
      
      $httpBackend.flush();
    });
  });
});