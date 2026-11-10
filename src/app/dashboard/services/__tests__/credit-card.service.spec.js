/*
Test Documentation:
- Test Name: CreditCardService Unit Tests
- Purpose: Validate credit card data retrieval with API integration and mock fallback
- Scenario: Tests cover successful API calls, error handling, and mock data fallback
- Expected Result: Credit card data is retrieved correctly from API or mock source
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService, $httpBackend, $rootScope, AuthService;

    beforeEach(module('app.dashboard'));

    beforeEach(function() {
      AuthService = {
        isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
        getToken: jasmine.createSpy('getToken').and.returnValue('test-token')
      };
      
      module(function($provide) {
        $provide.value('AuthService', AuthService);
      });
    });

    beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _$rootScope_) {
      CreditCardService = _CreditCardService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getAllCards', function() {
      it('should retrieve cards from API successfully', function() {
        var mockResponse = [
          { cardId: 'card-001', cardNumber: '**** 1234', cardType: 'Visa', creditLimit: 50000 },
          { cardId: 'card-002', cardNumber: '**** 5678', cardType: 'MasterCard', creditLimit: 30000 }
        ];
        
        $httpBackend.expectGET('/api/cards').respond(200, mockResponse);
        
        var result;
        CreditCardService.getAllCards().then(function(cards) {
          result = cards;
        });
        
        $httpBackend.flush();
        
        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(2);
      });

      it('should return mock cards when API returns empty data', function() {
        $httpBackend.expectGET('/api/cards').respond(200, null);
        
        var result;
        CreditCardService.getAllCards().then(function(cards) {
          result = cards;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(result.length).toBe(3);
        expect(result[0].cardId).toBe('card-001');
      });

      it('should fallback to mock cards on API error', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/cards').respond(500, 'Server Error');
        
        var result;
        CreditCardService.getAllCards().then(function(cards) {
          result = cards;
        });
        
        $httpBackend.flush();
        
        expect(console.error).toHaveBeenCalledWith('Error fetching cards:', jasmine.any(Object));
        expect(result).toBeDefined();
        expect(result.length).toBe(3);
      });

      it('should return cards with all required properties', function() {
        $httpBackend.expectGET('/api/cards').respond(200, null);
        
        var result;
        CreditCardService.getAllCards().then(function(cards) {
          result = cards;
        });
        
        $httpBackend.flush();
        
        result.forEach(function(card) {
          expect(card.cardId).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.cardType).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.currentBalance).toBeDefined();
          expect(card.outstandingAmount).toBeDefined();
          expect(card.availableCredit).toBeDefined();
        });
      });

      it('should handle network timeout', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/cards').respond(-1, '');
        
        var result;
        CreditCardService.getAllCards().then(function(cards) {
          result = cards;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getAllCards
- Scenarios covered:
  * Successful API retrieval
  * Empty API response with mock fallback
  * API error with mock fallback
  * Required properties validation
  * Network timeout handling
- Uncovered scenarios: None - all data retrieval paths tested
- Edge cases: Empty response, server errors, network failures, null data
*/