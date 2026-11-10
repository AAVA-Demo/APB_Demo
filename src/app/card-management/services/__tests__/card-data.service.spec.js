/*
Test Documentation:
- Test Name: CardDataService Unit Tests
- Purpose: Validate card data retrieval with caching, API integration, and mock fallback
- Scenario: Tests cover successful API calls, caching behavior, card lookup by ID, cache management, and error handling
- Expected Result: Card data is retrieved efficiently with proper caching and fallback mechanisms
*/

(function() {
  'use strict';

  describe('CardDataService', function() {
    var CardDataService, $httpBackend, $rootScope, $cacheFactory, AuthService;

    beforeEach(module('app.cardManagement'));

    beforeEach(function() {
      AuthService = {
        isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
        getToken: jasmine.createSpy('getToken').and.returnValue('test-token')
      };
      
      module(function($provide) {
        $provide.value('AuthService', AuthService);
      });
    });

    beforeEach(inject(function(_CardDataService_, _$httpBackend_, _$rootScope_, _$cacheFactory_) {
      CardDataService = _CardDataService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $cacheFactory = _$cacheFactory_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      CardDataService.clearCache();
    });

    describe('getUserCards', function() {
      it('should retrieve cards from API on first call', function() {
        var mockResponse = [
          { cardId: 'card-001', cardNumber: '**** 1234', cardType: 'Visa' },
          { cardId: 'card-002', cardNumber: '**** 5678', cardType: 'MasterCard' }
        ];
        
        $httpBackend.expectGET('/api/cards').respond(200, mockResponse);
        
        var result;
        CardDataService.getUserCards().then(function(cards) {
          result = cards;
        });
        
        $httpBackend.flush();
        
        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(2);
      });

      it('should return cached cards on subsequent calls', function() {
        var mockResponse = [
          { cardId: 'card-001', cardNumber: '**** 1234', cardType: 'Visa' }
        ];
        
        $httpBackend.expectGET('/api/cards').respond(200, mockResponse);
        
        CardDataService.getUserCards();
        $httpBackend.flush();
        
        var result;
        CardDataService.getUserCards().then(function(cards) {
          result = cards;
        });
        
        $rootScope.$digest();
        
        expect(result).toEqual(mockResponse);
      });

      it('should return mock cards when API returns empty data', function() {
        $httpBackend.expectGET('/api/cards').respond(200, null);
        
        var result;
        CardDataService.getUserCards().then(function(cards) {
          result = cards;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(result.length).toBe(3);
      });

      it('should fallback to mock cards on API error', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/cards').respond(500, 'Server Error');
        
        var result;
        CardDataService.getUserCards().then(function(cards) {
          result = cards;
        });
        
        $httpBackend.flush();
        
        expect(console.error).toHaveBeenCalledWith('Error fetching user cards:', jasmine.any(Object));
        expect(result).toBeDefined();
        expect(result.length).toBe(3);
      });

      it('should cache mock cards for subsequent calls', function() {
        $httpBackend.expectGET('/api/cards').respond(200, null);
        
        CardDataService.getUserCards();
        $httpBackend.flush();
        
        var result;
        CardDataService.getUserCards().then(function(cards) {
          result = cards;
        });
        
        $rootScope.$digest();
        
        expect(result.length).toBe(3);
      });
    });

    describe('getCardById', function() {
      it('should retrieve specific card by ID', function() {
        var mockCards = [
          { cardId: 'card-001', cardNumber: '**** 1234', cardType: 'Visa' },
          { cardId: 'card-002', cardNumber: '**** 5678', cardType: 'MasterCard' }
        ];
        
        $httpBackend.expectGET('/api/cards').respond(200, mockCards);
        
        var result;
        CardDataService.getCardById('card-002').then(function(card) {
          result = card;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(result.cardId).toBe('card-002');
        expect(result.cardType).toBe('MasterCard');
      });

      it('should return null when card ID not found', function() {
        var mockCards = [
          { cardId: 'card-001', cardNumber: '**** 1234', cardType: 'Visa' }
        ];
        
        $httpBackend.expectGET('/api/cards').respond(200, mockCards);
        
        var result;
        CardDataService.getCardById('card-999').then(function(card) {
          result = card;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeNull();
      });

      it('should use cached data for card lookup', function() {
        var mockCards = [
          { cardId: 'card-001', cardNumber: '**** 1234', cardType: 'Visa' }
        ];
        
        $httpBackend.expectGET('/api/cards').respond(200, mockCards);
        
        CardDataService.getUserCards();
        $httpBackend.flush();
        
        var result;
        CardDataService.getCardById('card-001').then(function(card) {
          result = card;
        });
        
        $rootScope.$digest();
        
        expect(result.cardId).toBe('card-001');
      });

      it('should return card with all required properties', function() {
        $httpBackend.expectGET('/api/cards').respond(200, null);
        
        var result;
        CardDataService.getCardById('card-001').then(function(card) {
          result = card;
        });
        
        $httpBackend.flush();
        
        expect(result.cardId).toBeDefined();
        expect(result.cardNumber).toBeDefined();
        expect(result.cardHolderName).toBeDefined();
        expect(result.cardType).toBeDefined();
        expect(result.creditLimit).toBeDefined();
        expect(result.expiryDate).toBeDefined();
        expect(result.status).toBeDefined();
      });
    });

    describe('clearCache', function() {
      it('should clear cached card data', function() {
        var mockCards = [
          { cardId: 'card-001', cardNumber: '**** 1234', cardType: 'Visa' }
        ];
        
        $httpBackend.expectGET('/api/cards').respond(200, mockCards);
        CardDataService.getUserCards();
        $httpBackend.flush();
        
        CardDataService.clearCache();
        
        $httpBackend.expectGET('/api/cards').respond(200, mockCards);
        CardDataService.getUserCards();
        $httpBackend.flush();
      });

      it('should allow fresh data retrieval after cache clear', function() {
        var mockCards1 = [{ cardId: 'card-001', cardNumber: '**** 1234' }];
        var mockCards2 = [{ cardId: 'card-002', cardNumber: '**** 5678' }];
        
        $httpBackend.expectGET('/api/cards').respond(200, mockCards1);
        CardDataService.getUserCards();
        $httpBackend.flush();
        
        CardDataService.clearCache();
        
        $httpBackend.expectGET('/api/cards').respond(200, mockCards2);
        var result;
        CardDataService.getUserCards().then(function(cards) {
          result = cards;
        });
        $httpBackend.flush();
        
        expect(result[0].cardId).toBe('card-002');
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getUserCards, getCardById, clearCache
- Scenarios covered:
  * API retrieval on first call
  * Cached data on subsequent calls
  * Empty API response with mock fallback
  * API error with mock fallback
  * Mock data caching
  * Card lookup by ID
  * Card not found scenario
  * Cached data usage for lookup
  * Required properties validation
  * Cache clearing
  * Fresh data retrieval after cache clear
- Uncovered scenarios: None - all data retrieval and caching paths tested
- Edge cases: Empty response, server errors, card not found, cache management
*/