/*
Test Documentation:
- Test Name: CardListController - Initialization
- Purpose: Verify controller initializes with correct default state
- Scenario: Controller is instantiated
- Expected Result: cards array is empty, loading is true
*/
/*
Test Documentation:
- Test Name: CardListController - Load Cards Success
- Purpose: Verify cards load successfully
- Scenario: cardManagementService returns cards
- Expected Result: vm.cards is populated and loading is false
*/
/*
Test Documentation:
- Test Name: CardListController - Load Cards Error
- Purpose: Verify error handling when cards fail to load
- Scenario: cardManagementService rejects promise
- Expected Result: vm.error is set and loading is false
*/
/*
Test Documentation:
- Test Name: CardListController - Select Card
- Purpose: Verify navigation to card details
- Scenario: User clicks on a card
- Expected Result: State changes to cardDetails with cardId
*/
/*
Coverage Report:
- Functions tested: initialization, card loading, selectCard
- Scenarios covered: success path, error handling, navigation
- Uncovered scenarios: none
*/

describe('CardListController', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.cards'));
  
  var $controller, $rootScope, $q, vm, mockCardManagementService, mockState;
  
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    
    mockCardManagementService = {
      getAllCards: jasmine.createSpy('getAllCards')
    };
    
    mockState = {
      go: jasmine.createSpy('go')
    };
  }));
  
  function createController() {
    var $scope = $rootScope.$new();
    vm = $controller('CardListController', {
      $scope: $scope,
      $state: mockState,
      cardManagementService: mockCardManagementService
    });
    return {vm: vm, $scope: $scope};
  }
  
  it('should initialize with correct default state', function() {
    mockCardManagementService.getAllCards.and.returnValue($q.resolve([]));
    var ctrl = createController();
    
    expect(ctrl.vm.cards).toEqual([]);
    expect(ctrl.vm.loading).toBe(true);
    expect(ctrl.vm.error).toBe(null);
  });
  
  it('should load cards successfully', function() {
    var mockCards = [
      {cardId: 'c1', cardNumber: '4111111111111234', cardType: 'Visa'},
      {cardId: 'c2', cardNumber: '5500000000005678', cardType: 'MasterCard'}
    ];
    mockCardManagementService.getAllCards.and.returnValue($q.resolve(mockCards));
    
    var ctrl = createController();
    $rootScope.$digest();
    
    expect(ctrl.vm.cards).toEqual(mockCards);
    expect(ctrl.vm.loading).toBe(false);
    expect(ctrl.vm.error).toBe(null);
  });
  
  it('should handle card load error', function() {
    mockCardManagementService.getAllCards.and.returnValue($q.reject('Error'));
    
    var ctrl = createController();
    $rootScope.$digest();
    
    expect(ctrl.vm.error).toBe('Failed to load cards');
    expect(ctrl.vm.loading).toBe(false);
  });
  
  it('should navigate to card details when card is selected', function() {
    mockCardManagementService.getAllCards.and.returnValue($q.resolve([]));
    var ctrl = createController();
    
    var card = {cardId: 'c1', cardNumber: '4111111111111234'};
    ctrl.vm.selectCard(card);
    
    expect(mockState.go).toHaveBeenCalledWith('cardDetails', {cardId: 'c1'});
  });
});