/*
Test Documentation:
- Test Name: CreditCardDataService - getAllCards with cache
- Purpose: Validates caching mechanism for card data
- Scenario: First call fetches from factory, second call returns cached data
- Expected Result: Factory called once, cached data returned on subsequent calls
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - clearCache
- Purpose: Validates cache clearing functionality
- Scenario: Cache is populated then cleared
- Expected Result: Cache is empty after clearCache call
*/
/*
Coverage Report:
- Functions tested: getAllCards, clearCache
- Scenarios covered: cache hit, cache miss, cache clearing
- Uncovered scenarios: none
*/

describe('CreditCardDataService', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var CreditCardDataService, CardDataFactory, $q, $rootScope;
  
  beforeEach(inject(function(_CreditCardDataService_, _CardDataFactory_, _$q_, _$rootScope_) {
    CreditCardDataService = _CreditCardDataService_;
    CardDataFactory = _CardDataFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getAllCards', function() {
    it('should fetch cards from factory when cache is empty', function() {
      var mockCards = [
        { cardId: 1, cardName: 'Visa', creditLimit: 5000 },
        { cardId: 2, cardName: 'MasterCard', creditLimit: 10000 }
      ];
      
      spyOn(CardDataFactory, 'fetchCards').and.returnValue($q.resolve(mockCards));
      
      var result;
      CreditCardDataService.getAllCards().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(CardDataFactory.fetchCards).toHaveBeenCalled();
      expect(result).toEqual(mockCards);
      expect(result.length).toBe(2);
    });
    
    it('should return cached cards on subsequent calls', function() {
      var mockCards = [
        { cardId: 1, cardName: 'Visa', creditLimit: 5000 }
      ];
      
      spyOn(CardDataFactory, 'fetchCards').and.returnValue($q.resolve(mockCards));
      
      var result1, result2;
      CreditCardDataService.getAllCards().then(function(data) {
        result1 = data;
      });
      $rootScope.$digest();
      
      CreditCardDataService.getAllCards().then(function(data) {
        result2 = data;
      });
      $rootScope.$digest();
      
      expect(CardDataFactory.fetchCards.calls.count()).toBe(1);
      expect(result1).toEqual(mockCards);
      expect(result2).toEqual(mockCards);
    });
    
    it('should handle factory error', function() {
      spyOn(CardDataFactory, 'fetchCards').and.returnValue($q.reject('API Error'));
      
      var errorResult;
      CreditCardDataService.getAllCards().catch(function(error) {
        errorResult = error;
      });
      
      $rootScope.$digest();
      
      expect(errorResult).toBe('API Error');
    });
  });
  
  describe('clearCache', function() {
    it('should clear cached cards', function() {
      var mockCards = [{ cardId: 1, cardName: 'Visa', creditLimit: 5000 }];
      
      spyOn(CardDataFactory, 'fetchCards').and.returnValue($q.resolve(mockCards));
      
      CreditCardDataService.getAllCards();
      $rootScope.$digest();
      
      CreditCardDataService.clearCache();
      
      CreditCardDataService.getAllCards();
      $rootScope.$digest();
      
      expect(CardDataFactory.fetchCards.calls.count()).toBe(2);
    });
  });
});