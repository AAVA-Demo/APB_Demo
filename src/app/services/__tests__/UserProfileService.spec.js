/*
Test Documentation:
- Test Name: UserProfileService - getUserCards success
- Purpose: Validates retrieval of user's cards with ownership validation
- Scenario: Valid user ID with owned cards
- Expected Result: Returns array of cards after validation
*/
/*
Test Documentation:
- Test Name: UserProfileService - getUserCards integration
- Purpose: Validates integration with CardDataService and CardAuthService
- Scenario: Service chain from card retrieval to ownership validation
- Expected Result: Properly chains promises and validates ownership
*/
/*
Test Documentation:
- Test Name: UserProfileService - getUserCards error handling
- Purpose: Validates error propagation from dependencies
- Scenario: CardAuthService validation fails
- Expected Result: Rejects promise with error
*/
/*
Coverage Report:
- Functions tested: getUserCards
- Scenarios covered: successful retrieval, service integration, ownership validation, error handling
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('UserProfileService', function() {
    var UserProfileService, CardDataService, CardAuthService, $rootScope, $q, $timeout;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_UserProfileService_, _CardDataService_, _CardAuthService_, _$rootScope_, _$q_, _$timeout_) {
      UserProfileService = _UserProfileService_;
      CardDataService = _CardDataService_;
      CardAuthService = _CardAuthService_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      $timeout = _$timeout_;
    }));

    describe('getUserCards', function() {
      it('should retrieve and validate user cards', function() {
        var userId = 'user123';
        var result;

        UserProfileService.getUserCards(userId).then(function(cards) {
          result = cards;
        });

        $timeout.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(3);
        expect(result[0].userId).toBe('user123');
      });

      it('should call CardDataService.getAllCards with correct userId', function() {
        var userId = 'testUser';
        spyOn(CardDataService, 'getAllCards').and.callThrough();

        UserProfileService.getUserCards(userId);

        expect(CardDataService.getAllCards).toHaveBeenCalledWith(userId);
      });

      it('should call CardAuthService.validateCardOwnership with card IDs', function() {
        var userId = 'user123';
        spyOn(CardAuthService, 'validateCardOwnership').and.callThrough();

        UserProfileService.getUserCards(userId);

        $timeout.flush();

        expect(CardAuthService.validateCardOwnership).toHaveBeenCalled();
        var callArgs = CardAuthService.validateCardOwnership.calls.argsFor(0)[0];
        expect(Array.isArray(callArgs)).toBe(true);
        expect(callArgs).toEqual(['card1', 'card2', 'card3']);
      });

      it('should return cards after successful validation', function() {
        var userId = 'user123';
        var result;

        UserProfileService.getUserCards(userId).then(function(cards) {
          result = cards;
        });

        $timeout.flush();

        expect(result.length).toBe(3);
        expect(result[0].cardId).toBe('card1');
        expect(result[1].cardId).toBe('card2');
        expect(result[2].cardId).toBe('card3');
      });

      it('should handle CardDataService error', function() {
        var userId = 'user123';
        var error;

        spyOn(CardDataService, 'getAllCards').and.returnValue($q.reject('Card retrieval failed'));

        UserProfileService.getUserCards(userId).catch(function(err) {
          error = err;
        });

        $rootScope.$apply();

        expect(error).toBe('Card retrieval failed');
      });

      it('should handle CardAuthService validation error', function() {
        var userId = 'user123';
        var error;

        spyOn(CardAuthService, 'validateCardOwnership').and.returnValue($q.reject('Validation failed'));

        UserProfileService.getUserCards(userId).catch(function(err) {
          error = err;
        });

        $timeout.flush();

        expect(error).toBe('Validation failed');
      });

      it('should return promise', function() {
        var promise = UserProfileService.getUserCards('user123');
        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');
      });

      it('should chain promises correctly', function() {
        var userId = 'user123';
        var getAllCardsCalled = false;
        var validateCardOwnershipCalled = false;

        spyOn(CardDataService, 'getAllCards').and.callFake(function() {
          getAllCardsCalled = true;
          return $q.resolve([{ cardId: 'card1' }, { cardId: 'card2' }]);
        });

        spyOn(CardAuthService, 'validateCardOwnership').and.callFake(function() {
          validateCardOwnershipCalled = true;
          return $q.resolve({ valid: true });
        });

        UserProfileService.getUserCards(userId);

        $rootScope.$apply();

        expect(getAllCardsCalled).toBe(true);
        expect(validateCardOwnershipCalled).toBe(true);
      });

      it('should extract card IDs correctly from cards array', function() {
        var userId = 'user123';
        spyOn(CardAuthService, 'validateCardOwnership').and.callThrough();

        UserProfileService.getUserCards(userId);

        $timeout.flush();

        var cardIds = CardAuthService.validateCardOwnership.calls.argsFor(0)[0];
        expect(cardIds.length).toBe(3);
        expect(cardIds).toContain('card1');
        expect(cardIds).toContain('card2');
        expect(cardIds).toContain('card3');
      });
    });
  });
})();