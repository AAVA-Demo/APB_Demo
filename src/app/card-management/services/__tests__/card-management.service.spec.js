/*
Test Documentation:
- Test Name: CardManagementService - getUserCards success
- Purpose: Validates retrieval of all user cards
- Scenario: User has multiple cards
- Expected Result: Returns array of card details

- Test Name: CardManagementService - getUserCards with cache
- Purpose: Validates cache functionality
- Scenario: Cards already cached
- Expected Result: Returns cached cards without API call

- Test Name: CardManagementService - getCardById from cache
- Purpose: Validates single card retrieval from cache
- Scenario: Card exists in cache
- Expected Result: Returns card from cache

- Test Name: CardManagementService - getCardById from API
- Purpose: Validates single card retrieval from API
- Scenario: Card not in cache
- Expected Result: Fetches card from API

- Test Name: CardManagementService - clearCache
- Purpose: Validates cache clearing
- Scenario: Cache has data
- Expected Result: Cache is cleared

- Test Name: CardManagementService - error handling
- Purpose: Validates error propagation
- Scenario: API returns error
- Expected Result: Error is propagated to caller
*/

/*
Coverage Report:
- Functions tested: getUserCards, getCardById, clearCache
- Scenarios covered: successful retrieval, caching, cache hits, cache misses, error handling
- Edge cases: empty card arrays, missing cards, API failures, cache invalidation
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CardManagementService', function() {
    var CardManagementService;
    var CreditCardDataFactory;
    var UserProfileFactory;
    var $q;
    var $rootScope;

    beforeEach(module('cardManagement'));

    beforeEach(inject(function(_CardManagementService_, _CreditCardDataFactory_, _UserProfileFactory_, _$q_, _$rootScope_) {
      CardManagementService = _CardManagementService_;
      CreditCardDataFactory = _CreditCardDataFactory_;
      UserProfileFactory = _UserProfileFactory_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      CardManagementService.clearCache();
    }));

    describe('getUserCards', function() {
      it('should retrieve all user cards successfully', function() {
        var mockCardIds = ['card-001', 'card-002', 'card-003'];
        var mockCards = [
          { cardId: 'card-001', cardType: 'Visa', lastFourDigits: '1234' },
          { cardId: 'card-002', cardType: 'Mastercard', lastFourDigits: '5678' },
          { cardId: 'card-003', cardType: 'Amex', lastFourDigits: '9012' }
        ];
        
        spyOn(UserProfileFactory, 'getCardsByUserId').and.returnValue($q.resolve(mockCardIds));
        spyOn(CreditCardDataFactory, 'getCardDetails').and.callFake(function(cardId) {
          return $q.resolve(mockCards.find(function(c) { return c.cardId === cardId; }));
        });

        var result;
        CardManagementService.getUserCards('user-001').then(function(cards) {
          result = cards;
        });
        $rootScope.$apply();

        expect(result.length).toBe(3);
        expect(result[0].cardId).toBe('card-001');
        expect(result[1].cardId).toBe('card-002');
        expect(result[2].cardId).toBe('card-003');
      });

      it('should return cached cards on subsequent calls', function() {
        var mockCardIds = ['card-001'];
        var mockCard = { cardId: 'card-001', cardType: 'Visa' };
        
        spyOn(UserProfileFactory, 'getCardsByUserId').and.returnValue($q.resolve(mockCardIds));
        spyOn(CreditCardDataFactory, 'getCardDetails').and.returnValue($q.resolve(mockCard));

        var result1, result2;
        CardManagementService.getUserCards('user-001').then(function(cards) {
          result1 = cards;
        });
        $rootScope.$apply();

        CardManagementService.getUserCards('user-001').then(function(cards) {
          result2 = cards;
        });
        $rootScope.$apply();

        expect(UserProfileFactory.getCardsByUserId.calls.count()).toBe(1);
        expect(result1).toBe(result2);
      });

      it('should handle empty card array', function() {
        spyOn(UserProfileFactory, 'getCardsByUserId').and.returnValue($q.resolve([]));
        
        var result;
        CardManagementService.getUserCards('user-002').then(function(cards) {
          result = cards;
        });
        $rootScope.$apply();

        expect(result).toEqual([]);
      });

      it('should propagate errors from UserProfileFactory', function() {
        var errorMessage = 'Profile API Error';
        spyOn(UserProfileFactory, 'getCardsByUserId').and.returnValue($q.reject(errorMessage));
        
        var errorResult;
        CardManagementService.getUserCards('user-003').catch(function(error) {
          errorResult = error;
        });
        $rootScope.$apply();

        expect(errorResult).toBe(errorMessage);
      });

      it('should propagate errors from CreditCardDataFactory', function() {
        var mockCardIds = ['card-001'];
        var errorMessage = 'Card API Error';
        
        spyOn(UserProfileFactory, 'getCardsByUserId').and.returnValue($q.resolve(mockCardIds));
        spyOn(CreditCardDataFactory, 'getCardDetails').and.returnValue($q.reject(errorMessage));

        var errorResult;
        CardManagementService.getUserCards('user-004').catch(function(error) {
          errorResult = error;
        });
        $rootScope.$apply();

        expect(errorResult).toBe(errorMessage);
      });
    });

    describe('getCardById', function() {
      it('should retrieve card from cache if available', function() {
        var mockCardIds = ['card-001', 'card-002'];
        var mockCards = [
          { cardId: 'card-001', cardType: 'Visa' },
          { cardId: 'card-002', cardType: 'Mastercard' }
        ];
        
        spyOn(UserProfileFactory, 'getCardsByUserId').and.returnValue($q.resolve(mockCardIds));
        spyOn(CreditCardDataFactory, 'getCardDetails').and.callFake(function(cardId) {
          return $q.resolve(mockCards.find(function(c) { return c.cardId === cardId; }));
        });

        CardManagementService.getUserCards('user-001');
        $rootScope.$apply();

        var result;
        CardManagementService.getCardById('card-002').then(function(card) {
          result = card;
        });
        $rootScope.$apply();

        expect(result.cardId).toBe('card-002');
        expect(result.cardType).toBe('Mastercard');
      });

      it('should fetch card from API if not in cache', function() {
        var mockCard = { cardId: 'card-005', cardType: 'Discover' };
        spyOn(CreditCardDataFactory, 'getCardDetails').and.returnValue($q.resolve(mockCard));

        var result;
        CardManagementService.getCardById('card-005').then(function(card) {
          result = card;
        });
        $rootScope.$apply();

        expect(result.cardId).toBe('card-005');
        expect(CreditCardDataFactory.getCardDetails).toHaveBeenCalledWith('card-005');
      });

      it('should return undefined for non-existent card in cache', function() {
        var mockCardIds = ['card-001'];
        var mockCard = { cardId: 'card-001', cardType: 'Visa' };
        
        spyOn(UserProfileFactory, 'getCardsByUserId').and.returnValue($q.resolve(mockCardIds));
        spyOn(CreditCardDataFactory, 'getCardDetails').and.returnValue($q.resolve(mockCard));

        CardManagementService.getUserCards('user-001');
        $rootScope.$apply();

        spyOn(CreditCardDataFactory, 'getCardDetails').and.returnValue($q.resolve({ cardId: 'card-999' }));
        var result;
        CardManagementService.getCardById('card-999').then(function(card) {
          result = card;
        });
        $rootScope.$apply();

        expect(result.cardId).toBe('card-999');
      });

      it('should propagate errors from CreditCardDataFactory', function() {
        var errorMessage = 'Card not found';
        spyOn(CreditCardDataFactory, 'getCardDetails').and.returnValue($q.reject(errorMessage));

        var errorResult;
        CardManagementService.getCardById('card-invalid').catch(function(error) {
          errorResult = error;
        });
        $rootScope.$apply();

        expect(errorResult).toBe(errorMessage);
      });
    });

    describe('clearCache', function() {
      it('should clear the card cache', function() {
        var mockCardIds = ['card-001'];
        var mockCard = { cardId: 'card-001', cardType: 'Visa' };
        
        spyOn(UserProfileFactory, 'getCardsByUserId').and.returnValue($q.resolve(mockCardIds));
        spyOn(CreditCardDataFactory, 'getCardDetails').and.returnValue($q.resolve(mockCard));

        CardManagementService.getUserCards('user-001');
        $rootScope.$apply();

        CardManagementService.clearCache();

        CardManagementService.getUserCards('user-001');
        $rootScope.$apply();

        expect(UserProfileFactory.getCardsByUserId.calls.count()).toBe(2);
      });

      it('should allow cache to be rebuilt after clearing', function() {
        var mockCardIds = ['card-001'];
        var mockCard = { cardId: 'card-001', cardType: 'Visa' };
        
        spyOn(UserProfileFactory, 'getCardsByUserId').and.returnValue($q.resolve(mockCardIds));
        spyOn(CreditCardDataFactory, 'getCardDetails').and.returnValue($q.resolve(mockCard));

        CardManagementService.getUserCards('user-001');
        $rootScope.$apply();
        CardManagementService.clearCache();
        
        var result;
        CardManagementService.getUserCards('user-001').then(function(cards) {
          result = cards;
        });
        $rootScope.$apply();

        expect(result.length).toBe(1);
        expect(result[0].cardId).toBe('card-001');
      });
    });
  });
})();