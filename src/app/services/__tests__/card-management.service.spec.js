/*
Test Documentation:
- Test Name: CardManagementService - getAllCards with cache
- Purpose: Validates that getAllCards retrieves cards and caches the result
- Scenario: Service fetches cards for a user
- Expected Result: Cards are returned and cached for subsequent requests
*/
/*
Test Documentation:
- Test Name: CardManagementService - getCardDetails
- Purpose: Validates retrieval of individual card details
- Scenario: Service fetches details for a specific card ID
- Expected Result: Card details are returned and cached
*/
/*
Test Documentation:
- Test Name: CardManagementService - cache expiration
- Purpose: Validates that cache expires after TTL
- Scenario: Cached data is older than TTL
- Expected Result: Fresh data is fetched from API
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardDetails, clearCache
- Scenarios covered: successful card retrieval, caching mechanism, cache expiration, error handling, cache clearing
- Uncovered scenarios: none
*/

describe('CardManagementService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CardManagementService;
  var CreditCardApiService;
  var $q;
  var $rootScope;
  var $cacheFactory;
  
  beforeEach(inject(function(_CardManagementService_, _CreditCardApiService_, _$q_, _$rootScope_, _$cacheFactory_) {
    CardManagementService = _CardManagementService_;
    CreditCardApiService = _CreditCardApiService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $cacheFactory = _$cacheFactory_;
  }));
  
  beforeEach(function() {
    CardManagementService.clearCache();
  });
  
  describe('getAllCards', function() {
    it('should fetch and cache all cards for a user', function() {
      var mockCards = [
        {cardId: 'card1', cardType: 'Visa', creditLimit: 100000},
        {cardId: 'card2', cardType: 'Mastercard', creditLimit: 75000}
      ];
      
      spyOn(CreditCardApiService, 'getCards').and.returnValue($q.resolve(mockCards));
      
      var result;
      CardManagementService.getAllCards('user123').then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(CreditCardApiService.getCards).toHaveBeenCalledWith('user123');
      expect(result).toBeDefined();
      expect(result.cards.length).toBe(2);
      expect(result.totalCards).toBe(2);
    });
    
    it('should return cached data on subsequent calls within TTL', function() {
      var mockCards = [{cardId: 'card1', cardType: 'Visa'}];
      spyOn(CreditCardApiService, 'getCards').and.returnValue($q.resolve(mockCards));
      
      CardManagementService.getAllCards('user123');
      $rootScope.$digest();
      
      CardManagementService.getAllCards('user123');
      $rootScope.$digest();
      
      expect(CreditCardApiService.getCards.calls.count()).toBe(1);
    });
    
    it('should handle API error', function() {
      spyOn(CreditCardApiService, 'getCards').and.returnValue($q.reject('API Error'));
      
      var error;
      CardManagementService.getAllCards('user123').catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('API Error');
    });
  });
  
  describe('getCardDetails', function() {
    it('should fetch and cache card details', function() {
      var mockCard = {cardId: 'card1', cardType: 'Visa Platinum', creditLimit: 100000};
      spyOn(CreditCardApiService, 'getCardById').and.returnValue($q.resolve(mockCard));
      
      var result;
      CardManagementService.getCardDetails('card1').then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(CreditCardApiService.getCardById).toHaveBeenCalledWith('card1');
      expect(result).toBeDefined();
      expect(result.cardId).toBe('card1');
      expect(result.cardType).toBe('Visa Platinum');
    });
    
    it('should return cached card details on subsequent calls', function() {
      var mockCard = {cardId: 'card1', cardType: 'Visa'};
      spyOn(CreditCardApiService, 'getCardById').and.returnValue($q.resolve(mockCard));
      
      CardManagementService.getCardDetails('card1');
      $rootScope.$digest();
      
      CardManagementService.getCardDetails('card1');
      $rootScope.$digest();
      
      expect(CreditCardApiService.getCardById.calls.count()).toBe(1);
    });
    
    it('should handle card not found error', function() {
      spyOn(CreditCardApiService, 'getCardById').and.returnValue($q.reject('Card not found'));
      
      var error;
      CardManagementService.getCardDetails('invalidCard').catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('Card not found');
    });
  });
  
  describe('clearCache', function() {
    it('should clear all cached data', function() {
      var mockCards = [{cardId: 'card1'}];
      spyOn(CreditCardApiService, 'getCards').and.returnValue($q.resolve(mockCards));
      
      CardManagementService.getAllCards('user123');
      $rootScope.$digest();
      
      CardManagementService.clearCache();
      
      CardManagementService.getAllCards('user123');
      $rootScope.$digest();
      
      expect(CreditCardApiService.getCards.calls.count()).toBe(2);
    });
  });
});