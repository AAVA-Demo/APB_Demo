/*
Test Documentation:
- Test Name: CardDetailController - initialization
- Purpose: Validates controller initializes with correct default state
- Scenario: Normal initialization with card ID from route params
- Expected Result: Loading is true, card is null, error is null
*/
/*
Test Documentation:
- Test Name: CardDetailController - loadCardDetails success
- Purpose: Validates successful loading of card details
- Scenario: Normal scenario with successful API response
- Expected Result: Card details are populated, loading is false
*/
/*
Test Documentation:
- Test Name: CardDetailController - loadCardDetails error
- Purpose: Validates error handling when card details loading fails
- Scenario: Error scenario with API failure
- Expected Result: Error message is set, loading is false
*/
/*
Coverage Report:
- Functions tested: loadCardDetails
- Scenarios covered: initialization, successful load, error handling, card selection update
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CardDetailController', function() {
    var $controller, $scope, $q, $routeParams, CardManagementService, CardSwitchService;
    var controller;

    beforeEach(module('app.cardManagement'));

    beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
      $controller = _$controller_;
      $scope = _$rootScope_.$new();
      $q = _$q_;

      $routeParams = { cardId: 'card-123' };

      CardManagementService = {
        getCardDetails: jasmine.createSpy('getCardDetails')
      };

      CardSwitchService = {
        setSelectedCard: jasmine.createSpy('setSelectedCard')
      };
    }));

    function createController() {
      return $controller('CardDetailController', {
        $scope: $scope,
        $routeParams: $routeParams,
        CardManagementService: CardManagementService,
        CardSwitchService: CardSwitchService
      });
    }

    describe('initialization', function() {
      it('should initialize with default state', function() {
        var deferred = $q.defer();
        CardManagementService.getCardDetails.and.returnValue(deferred.promise);

        controller = createController();

        expect(controller.loading).toBe(true);
        expect(controller.card).toBeNull();
        expect(controller.error).toBeNull();
      });

      it('should call loadCardDetails on initialization', function() {
        var deferred = $q.defer();
        CardManagementService.getCardDetails.and.returnValue(deferred.promise);

        controller = createController();

        expect(CardManagementService.getCardDetails).toHaveBeenCalledWith('card-123');
      });
    });

    describe('loadCardDetails', function() {
      it('should load card details successfully', function() {
        var mockCard = {
          cardId: 'card-123',
          cardNumber: '****1234',
          issuer: 'Visa',
          cardholderName: 'John Doe',
          creditLimit: 10000,
          availableCredit: 8500,
          outstandingAmount: 1500
        };
        var deferred = $q.defer();
        CardManagementService.getCardDetails.and.returnValue(deferred.promise);

        controller = createController();
        deferred.resolve(mockCard);
        $scope.$digest();

        expect(controller.card).toEqual(mockCard);
        expect(controller.loading).toBe(false);
        expect(controller.error).toBeNull();
        expect(CardSwitchService.setSelectedCard).toHaveBeenCalledWith('card-123');
      });

      it('should handle card details loading error', function() {
        spyOn(console, 'error');
        var deferred = $q.defer();
        CardManagementService.getCardDetails.and.returnValue(deferred.promise);

        controller = createController();
        deferred.reject('API Error');
        $scope.$digest();

        expect(controller.error).toBe('Failed to load card details. Please try again.');
        expect(controller.loading).toBe(false);
        expect(console.error).toHaveBeenCalledWith('Card detail load error:', 'API Error');
      });

      it('should set loading to true when loadCardDetails is called', function() {
        var deferred = $q.defer();
        CardManagementService.getCardDetails.and.returnValue(deferred.promise);

        controller = createController();
        controller.loading = false;
        controller.loadCardDetails();

        expect(controller.loading).toBe(true);
        expect(controller.error).toBeNull();
      });

      it('should update selected card in CardSwitchService', function() {
        var mockCard = { cardId: 'card-123' };
        var deferred = $q.defer();
        CardManagementService.getCardDetails.and.returnValue(deferred.promise);

        controller = createController();
        deferred.resolve(mockCard);
        $scope.$digest();

        expect(CardSwitchService.setSelectedCard).toHaveBeenCalledWith('card-123');
      });
    });
  });
})();