/*
Test Documentation:
- Test Name: CardListController - initialization
- Purpose: Validates controller initializes with correct default state
- Scenario: Normal initialization
- Expected Result: Loading is true, cards array is empty, error is null
*/
/*
Test Documentation:
- Test Name: CardListController - loadCards success
- Purpose: Validates successful loading of credit cards
- Scenario: Normal scenario with successful API response
- Expected Result: Cards are populated, loading is false
*/
/*
Test Documentation:
- Test Name: CardListController - selectCard
- Purpose: Validates card selection and navigation
- Scenario: Normal scenario selecting a card
- Expected Result: Card is selected and navigation occurs
*/
/*
Coverage Report:
- Functions tested: loadCards, selectCard
- Scenarios covered: initialization, successful load, error handling, card selection
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CardListController', function() {
    var $controller, $scope, $q, $location, CardManagementService, CardSwitchService;
    var controller;

    beforeEach(module('app.cardManagement'));

    beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _$location_) {
      $controller = _$controller_;
      $scope = _$rootScope_.$new();
      $q = _$q_;
      $location = _$location_;

      CardManagementService = {
        getAllCards: jasmine.createSpy('getAllCards')
      };

      CardSwitchService = {
        getSelectedCard: jasmine.createSpy('getSelectedCard').and.returnValue(null),
        setSelectedCard: jasmine.createSpy('setSelectedCard')
      };
    }));

    function createController() {
      return $controller('CardListController', {
        $scope: $scope,
        $location: $location,
        CardManagementService: CardManagementService,
        CardSwitchService: CardSwitchService
      });
    }

    describe('initialization', function() {
      it('should initialize with default state', function() {
        var deferred = $q.defer();
        CardManagementService.getAllCards.and.returnValue(deferred.promise);

        controller = createController();

        expect(controller.loading).toBe(true);
        expect(controller.cards).toEqual([]);
        expect(controller.error).toBeNull();
      });

      it('should call loadCards on initialization', function() {
        var deferred = $q.defer();
        CardManagementService.getAllCards.and.returnValue(deferred.promise);

        controller = createController();

        expect(CardManagementService.getAllCards).toHaveBeenCalled();
      });

      it('should get selected card from CardSwitchService', function() {
        var deferred = $q.defer();
        CardManagementService.getAllCards.and.returnValue(deferred.promise);
        CardSwitchService.getSelectedCard.and.returnValue('card-123');

        controller = createController();

        expect(controller.selectedCardId).toBe('card-123');
      });
    });

    describe('loadCards', function() {
      it('should load cards successfully', function() {
        var mockCards = {
          cards: [
            { cardId: '1', cardNumber: '****1234', issuer: 'Visa' },
            { cardId: '2', cardNumber: '****5678', issuer: 'MasterCard' }
          ]
        };
        var deferred = $q.defer();
        CardManagementService.getAllCards.and.returnValue(deferred.promise);

        controller = createController();
        deferred.resolve(mockCards);
        $scope.$digest();

        expect(controller.cards).toEqual(mockCards.cards);
        expect(controller.loading).toBe(false);
        expect(controller.error).toBeNull();
      });

      it('should handle empty card list', function() {
        var mockCards = { cards: [] };
        var deferred = $q.defer();
        CardManagementService.getAllCards.and.returnValue(deferred.promise);

        controller = createController();
        deferred.resolve(mockCards);
        $scope.$digest();

        expect(controller.cards).toEqual([]);
        expect(controller.loading).toBe(false);
      });

      it('should handle card loading error', function() {
        spyOn(console, 'error');
        var deferred = $q.defer();
        CardManagementService.getAllCards.and.returnValue(deferred.promise);

        controller = createController();
        deferred.reject('API Error');
        $scope.$digest();

        expect(controller.error).toBe('Failed to load credit cards. Please try again.');
        expect(controller.loading).toBe(false);
        expect(console.error).toHaveBeenCalledWith('Card load error:', 'API Error');
      });
    });

    describe('selectCard', function() {
      it('should select card and navigate to detail page', function() {
        var deferred = $q.defer();
        CardManagementService.getAllCards.and.returnValue(deferred.promise);
        spyOn($location, 'path');

        controller = createController();
        deferred.resolve({ cards: [] });
        $scope.$digest();

        controller.selectCard('card-123');

        expect(CardSwitchService.setSelectedCard).toHaveBeenCalledWith('card-123');
        expect(controller.selectedCardId).toBe('card-123');
        expect($location.path).toHaveBeenCalledWith('/cards/card-123');
      });

      it('should handle null card ID', function() {
        var deferred = $q.defer();
        CardManagementService.getAllCards.and.returnValue(deferred.promise);
        spyOn($location, 'path');

        controller = createController();
        deferred.resolve({ cards: [] });
        $scope.$digest();

        controller.selectCard(null);

        expect(CardSwitchService.setSelectedCard).toHaveBeenCalledWith(null);
        expect($location.path).toHaveBeenCalledWith('/cards/null');
      });
    });
  });
})();