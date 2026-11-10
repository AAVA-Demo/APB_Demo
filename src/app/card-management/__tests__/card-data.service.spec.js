/*
Test Documentation:
- Test Name: CardDataService Unit Tests
- Purpose: Validate individual card details retrieval
- Scenario: Tests API calls for specific card details with mock fallback
- Expected Result: Service returns complete card details or mock data
*/

(function() {
  'use strict';
  
  describe('CardDataService', function() {
    var CardDataService, $httpBackend;
    
    beforeEach(module('cardManagementModule'));
    
    beforeEach(inject(function(_CardDataService_, _$httpBackend_) {
      CardDataService = _CardDataService_;
      $httpBackend = _$httpBackend_;
    }));
    
    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
    
    describe('getCardDetails()', function() {
      it('should return card details from API on success', function() {
        var mockCard = {cardId: 'card1', cardNumber: '**** 1234', creditLimit: 50000};
        $httpBackend.expectGET('/api/cards/card1').respond(200, mockCard);
        
        var result;
        CardDataService.getCardDetails('card1').then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result).toEqual(mockCard);
      });
      
      it('should return mock data for card1 on API failure', function() {
        $httpBackend.expectGET('/api/cards/card1').respond(500);
        
        var result;
        CardDataService.getCardDetails('card1').then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result.cardId).toBe('card1');
        expect(result.cardType).toBe('Visa');
        expect(result.creditLimit).toBe(50000);
      });
      
      it('should return empty object for unknown card ID', function() {
        $httpBackend.expectGET('/api/cards/unknown').respond(404);
        
        var result;
        CardDataService.getCardDetails('unknown').then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result).toEqual({});
      });
      
      it('should return card with all required fields', function() {
        $httpBackend.expectGET('/api/cards/card2').respond(500);
        
        var result;
        CardDataService.getCardDetails('card2').then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result).toEqual(jasmine.objectContaining({
          cardId: jasmine.any(String),
          cardNumber: jasmine.any(String),
          cardType: jasmine.any(String),
          creditLimit: jasmine.any(Number),
          outstandingBalance: jasmine.any(Number),
          availableCredit: jasmine.any(Number),
          status: jasmine.any(String),
          expiryDate: jasmine.any(String)
        }));
      });
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: getCardDetails
- Scenarios covered:
  * Successful API response
  * API failure with mock fallback
  * Unknown card ID handling
  * Data structure validation
- Uncovered scenarios: Expired card handling, blocked card status
*/