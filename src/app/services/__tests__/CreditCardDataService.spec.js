/*
Test Documentation:
- Test Name: CreditCardDataService - getCardDetails and getCards
- Purpose: Validate credit card data retrieval from backend API
- Scenario: Service fetches card details for authenticated users
- Expected Result: Returns card information including limits, balances, and status
*/

describe('CreditCardDataService', function() {
  'use strict';
  
  var CreditCardDataService;
  var $httpBackend;
  var $q;
  var $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _$q_, _$rootScope_) {
    CreditCardDataService = _CreditCardDataService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCardDetails', function() {
    it('should retrieve card details for a user', function() {
      var userId = 'USER001';
      var mockResponse = [
        {cardId: 'CC001', cardNumber: '****1234', creditLimit: 10000, availableCredit: 7500},
        {cardId: 'CC002', cardNumber: '****5678', creditLimit: 15000, availableCredit: 12000}
      ];
      
      $httpBackend.expectGET('/api/cards/' + userId).respond(200, mockResponse);
      
      CreditCardDataService.getCardDetails(userId).then(function(result) {
        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('CC001');
      });
      
      $httpBackend.flush();
    });
    
    it('should handle API errors gracefully', function() {
      var userId = 'USER001';
      
      $httpBackend.expectGET('/api/cards/' + userId).respond(500, 'Internal Server Error');
      
      CreditCardDataService.getCardDetails(userId).catch(function(error) {
        expect(error.status).toBe(500);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle empty card list', function() {
      var userId = 'USER002';
      
      $httpBackend.expectGET('/api/cards/' + userId).respond(200, []);
      
      CreditCardDataService.getCardDetails(userId).then(function(result) {
        expect(result).toEqual([]);
      });
      
      $httpBackend.flush();
    });
  });
  
  describe('getCards', function() {
    it('should retrieve cards with query parameter', function() {
      var userId = 'USER001';
      var mockResponse = [
        {cardId: 'CC001', cardNumber: '****1234', creditLimit: 10000}
      ];
      
      $httpBackend.expectGET('/api/cards?userId=' + userId).respond(200, mockResponse);
      
      CreditCardDataService.getCards(userId).then(function(result) {
        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(1);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle 404 not found', function() {
      var userId = 'INVALID_USER';
      
      $httpBackend.expectGET('/api/cards?userId=' + userId).respond(404, 'Not Found');
      
      CreditCardDataService.getCards(userId).catch(function(error) {
        expect(error.status).toBe(404);
      });
      
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getCardDetails, getCards
- Scenarios covered:
  * Successful card retrieval
  * API error handling (500, 404)
  * Empty card list
  * Query parameter handling
- Uncovered scenarios: None
- Edge cases: API failures, empty responses
*/