/*
Test Documentation:
- Test Name: CardDataFactory - fetchCards success
- Purpose: Validates that fetchCards successfully retrieves card data from API
- Scenario: HTTP GET request to /api/cards returns card data
- Expected Result: Promise resolves with card data array
*/
/*
Test Documentation:
- Test Name: CardDataFactory - fetchCards error
- Purpose: Validates error handling when API request fails
- Scenario: HTTP GET request to /api/cards fails with error
- Expected Result: Promise rejects with error object
*/
/*
Coverage Report:
- Functions tested: fetchCards
- Scenarios covered: successful API call, failed API call with error handling
- Uncovered scenarios: none
*/

describe('CardDataFactory', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var CardDataFactory, $httpBackend;
  
  beforeEach(inject(function(_CardDataFactory_, _$httpBackend_) {
    CardDataFactory = _CardDataFactory_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('fetchCards', function() {
    it('should successfully fetch cards from API', function() {
      var mockCards = [
        { cardId: 1, cardName: 'Visa Gold', creditLimit: 5000, availableCredit: 3000, currentBalance: 2000 },
        { cardId: 2, cardName: 'MasterCard Platinum', creditLimit: 10000, availableCredit: 8000, currentBalance: 2000 }
      ];
      
      $httpBackend.expectGET('/api/cards').respond(200, mockCards);
      
      var result;
      CardDataFactory.fetchCards().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockCards);
      expect(result.length).toBe(2);
      expect(result[0].cardName).toBe('Visa Gold');
    });
    
    it('should handle API error and reject promise', function() {
      var errorResponse = { status: 500, statusText: 'Internal Server Error' };
      
      $httpBackend.expectGET('/api/cards').respond(500, errorResponse);
      
      var errorResult;
      CardDataFactory.fetchCards().catch(function(error) {
        errorResult = error;
      });
      
      $httpBackend.flush();
      
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(500);
    });
    
    it('should handle empty response from API', function() {
      $httpBackend.expectGET('/api/cards').respond(200, []);
      
      var result;
      CardDataFactory.fetchCards().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });
});