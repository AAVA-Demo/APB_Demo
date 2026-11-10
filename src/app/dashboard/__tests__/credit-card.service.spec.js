/*
Test Documentation:
- Test Name: CreditCardService Unit Tests
- Purpose: Validate credit card data retrieval from API with fallback to mock data
- Scenario: Tests successful API calls and error handling with mock data
- Expected Result: Service returns card data from API or mock data on failure
*/

(function() {
  'use strict';
  
  describe('CreditCardService', function() {
    var CreditCardService, $httpBackend, $q;
    
    beforeEach(module('dashboardModule'));
    
    beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _$q_) {
      CreditCardService = _CreditCardService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
    }));
    
    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
    
    describe('getAllCards()', function() {
      it('should return cards from API on success', function() {
        var mockApiData = [
          {cardId: 'api1', creditLimit: 60000, outstandingBalance: 15000}
        ];
        $httpBackend.expectGET('/api/cards').respond(200, mockApiData);
        
        var result;
        CreditCardService.getAllCards().then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result).toEqual(mockApiData);
      });
      
      it('should return mock data when API fails', function() {
        $httpBackend.expectGET('/api/cards').respond(500, 'Server Error');
        
        var result;
        CreditCardService.getAllCards().then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result).toBeDefined();
        expect(result.length).toBe(3);
        expect(result[0].cardId).toBe('card1');
      });
      
      it('should return mock data with correct structure', function() {
        $httpBackend.expectGET('/api/cards').respond(404);
        
        var result;
        CreditCardService.getAllCards().then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result[0]).toEqual(jasmine.objectContaining({
          cardId: jasmine.any(String),
          creditLimit: jasmine.any(Number),
          outstandingBalance: jasmine.any(Number)
        }));
      });
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: getAllCards
- Scenarios covered:
  * Successful API response
  * API failure with 500 error
  * API failure with 404 error
  * Mock data structure validation
- Uncovered scenarios: Network timeout, partial data response
*/