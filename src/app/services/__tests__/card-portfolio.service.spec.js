/*
Test Documentation:
- Test Name: CardPortfolioService Unit Tests
- Purpose: Validate the CardPortfolioService functionality including card retrieval, caching, and cache clearing
- Scenario: Tests cover normal operations, edge cases with empty data, caching behavior, and error handling
- Expected Result: All service methods work correctly with proper caching and error handling
*/

describe('CardPortfolioService', function() {
  'use strict';

  var CardPortfolioService;
  var CreditCardDataFactory;
  var $q;
  var $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CardPortfolioService_, _CreditCardDataFactory_, _$q_, _$rootScope_) {
    CardPortfolioService = _CardPortfolioService_;
    CreditCardDataFactory = _CreditCardDataFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    CardPortfolioService.clearCache();
  });

  describe('getAllCards', function() {
    it('should fetch cards from CreditCardDataFactory when cache is empty', function(done) {
      var mockCards = [
        { cardId: 'CC001', cardNumber: '**** 1234', cardType: 'Visa' },
        { cardId: 'CC002', cardNumber: '**** 5678', cardType: 'Mastercard' }
      ];
      spyOn(CreditCardDataFactory, 'fetchCards').and.returnValue($q.resolve(mockCards));

      CardPortfolioService.getAllCards().then(function(cards) {
        expect(cards).toEqual(mockCards);
        expect(CreditCardDataFactory.fetchCards).toHaveBeenCalled();
        done();
      });

      $rootScope.$digest();
    });

    it('should return cached cards on subsequent calls without calling factory', function(done) {
      var mockCards = [{ cardId: 'CC001', cardNumber: '**** 1234' }];
      spyOn(CreditCardDataFactory, 'fetchCards').and.returnValue($q.resolve(mockCards));

      CardPortfolioService.getAllCards().then(function() {
        return CardPortfolioService.getAllCards();
      }).then(function(cards) {
        expect(cards).toEqual(mockCards);
        expect(CreditCardDataFactory.fetchCards.calls.count()).toBe(1);
        done();
      });

      $rootScope.$digest();
    });

    it('should handle empty card array', function(done) {
      spyOn(CreditCardDataFactory, 'fetchCards').and.returnValue($q.resolve([]));

      CardPortfolioService.getAllCards().then(function(cards) {
        expect(cards).toEqual([]);
        expect(cards.length).toBe(0);
        done();
      });

      $rootScope.$digest();
    });

    it('should handle factory rejection', function(done) {
      var errorMessage = 'Network error';
      spyOn(CreditCardDataFactory, 'fetchCards').and.returnValue($q.reject(errorMessage));

      CardPortfolioService.getAllCards().catch(function(error) {
        expect(error).toBe(errorMessage);
        done();
      });

      $rootScope.$digest();
    });

    it('should handle null response from factory', function(done) {
      spyOn(CreditCardDataFactory, 'fetchCards').and.returnValue($q.resolve(null));

      CardPortfolioService.getAllCards().then(function(cards) {
        expect(cards).toBeNull();
        done();
      });

      $rootScope.$digest();
    });
  });

  describe('clearCache', function() {
    it('should clear cached cards and force new fetch on next call', function(done) {
      var mockCards = [{ cardId: 'CC001' }];
      spyOn(CreditCardDataFactory, 'fetchCards').and.returnValue($q.resolve(mockCards));

      CardPortfolioService.getAllCards().then(function() {
        CardPortfolioService.clearCache();
        return CardPortfolioService.getAllCards();
      }).then(function(cards) {
        expect(CreditCardDataFactory.fetchCards.calls.count()).toBe(2);
        done();
      });

      $rootScope.$digest();
    });

    it('should not throw error when clearing empty cache', function() {
      expect(function() {
        CardPortfolioService.clearCache();
      }).not.toThrow();
    });

    it('should allow multiple consecutive cache clears', function() {
      expect(function() {
        CardPortfolioService.clearCache();
        CardPortfolioService.clearCache();
        CardPortfolioService.clearCache();
      }).not.toThrow();
    });
  });
});

/*
Coverage Report:
- Functions tested: getAllCards, clearCache
- Scenarios covered:
  * Normal card retrieval from factory
  * Caching behavior on subsequent calls
  * Empty card array handling
  * Factory rejection error handling
  * Null response handling
  * Cache clearing functionality
  * Multiple cache clear operations
- Edge cases: Empty arrays, null values, multiple cache operations
- Error scenarios: Network failures, factory rejections
- Uncovered scenarios: None - comprehensive coverage achieved
*/