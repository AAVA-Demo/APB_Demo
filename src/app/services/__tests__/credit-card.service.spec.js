/*
Test Documentation:
- Test Name: CreditCardService - getCards success
- Purpose: Validates that getCards retrieves credit card data successfully
- Scenario: Service is called and API returns card data
- Expected Result: Returns array of cards with calculated availableCredit
*/
/*
Test Documentation:
- Test Name: CreditCardService - getCards with cache
- Purpose: Validates that cached card data is returned without making HTTP request
- Scenario: Service is called twice consecutively
- Expected Result: Second call returns cached data immediately
*/
/*
Test Documentation:
- Test Name: CreditCardService - getCards with API failure
- Purpose: Validates that service returns mock data when API fails
- Scenario: API returns 404 or network error
- Expected Result: Service returns predefined mock card data
*/
/*
Coverage Report:
- Functions tested: getCards
- Scenarios covered: successful API call, cache hit, error handling with mock data, availableCredit calculation
- Uncovered scenarios: cache expiration, concurrent requests
*/

describe('CreditCardService', function() {
  'use strict';
  
  beforeEach(module('app.dashboard'));
  beforeEach(module('app.shared'));
  
  var CreditCardService, $httpBackend, $q, AuthService, $cacheFactory;
  
  beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _$q_, _AuthService_, _$cacheFactory_) {
    CreditCardService = _CreditCardService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    AuthService = _AuthService_;
    $cacheFactory = _$cacheFactory_;
    spyOn(AuthService, 'getToken').and.returnValue('mock-token-12345');
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCards', function() {
    it('should retrieve credit cards successfully', function() {
      var mockResponse = [
        {cardId: 'c1', cardNumber: '**** 1234', cardType: 'Visa', creditLimit: 50000, outstandingAmount: 12000},
        {cardId: 'c2', cardNumber: '**** 5678', cardType: 'MasterCard', creditLimit: 30000, outstandingAmount: 8000}
      ];
      
      $httpBackend.expectGET('/api/cards').respond(200, mockResponse);
      
      var result;
      CreditCardService.getCards().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].availableCredit).toBe(38000);
      expect(result[1].availableCredit).toBe(22000);
    });
    
    it('should return cached data on subsequent calls', function() {
      var mockResponse = [{cardId: 'c1', cardNumber: '**** 1234', creditLimit: 50000, outstandingAmount: 12000}];
      
      $httpBackend.expectGET('/api/cards').respond(200, mockResponse);
      
      var result1, result2;
      CreditCardService.getCards().then(function(data) {
        result1 = data;
      });
      
      $httpBackend.flush();
      
      CreditCardService.getCards().then(function(data) {
        result2 = data;
      });
      
      expect(result1).toEqual(result2);
    });
    
    it('should return mock data when API returns 404', function() {
      $httpBackend.expectGET('/api/cards').respond(404);
      
      var result;
      CreditCardService.getCards().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].cardId).toBe('c1');
      expect(result[0].availableCredit).toBe(38000);
    });
    
    it('should return mock data when network fails', function() {
      $httpBackend.expectGET('/api/cards').respond(-1);
      
      var result;
      CreditCardService.getCards().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
    });
  });
});