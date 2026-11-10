/*
Test Documentation:
- Test Name: CardDetailsController - Initialization
- Purpose: Verify controller initializes with correct default state
- Scenario: Controller is instantiated
- Expected Result: card is null, loading is true
*/
/*
Test Documentation:
- Test Name: CardDetailsController - Load Card Details Success
- Purpose: Verify card details load successfully with spend analysis
- Scenario: cardManagementService returns card details
- Expected Result: vm.card is populated, spendAnalysis calculated
*/
/*
Test Documentation:
- Test Name: CardDetailsController - Load Card Details Error
- Purpose: Verify error handling when card details fail to load
- Scenario: cardManagementService rejects promise
- Expected Result: vm.error is set and loading is false
*/
/*
Coverage Report:
- Functions tested: initialization, card details loading, spend analysis calculation
- Scenarios covered: success path, error handling
- Uncovered scenarios: none
*/

describe('CardDetailsController', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.cards'));
  
  var $controller, $rootScope, $q, vm, mockCardManagementService, mockStateParams;
  
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    
    mockCardManagementService = {
      getCardDetails: jasmine.createSpy('getCardDetails')
    };
    
    mockStateParams = {
      cardId: 'c1'
    };
  }));
  
  function createController() {
    var $scope = $rootScope.$new();
    vm = $controller('CardDetailsController', {
      $scope: $scope,
      $stateParams: mockStateParams,
      cardManagementService: mockCardManagementService
    });
    return {vm: vm, $scope: $scope};
  }
  
  it('should initialize with correct default state', function() {
    mockCardManagementService.getCardDetails.and.returnValue($q.resolve({}));
    var ctrl = createController();
    
    expect(ctrl.vm.card).toBe(null);
    expect(ctrl.vm.loading).toBe(true);
    expect(ctrl.vm.error).toBe(null);
    expect(ctrl.vm.spendAnalysis).toEqual({});
  });
  
  it('should load card details and calculate spend analysis', function() {
    var mockCard = {
      cardId: 'c1',
      cardNumber: '4111111111111234',
      cardType: 'Visa',
      creditLimit: 10000,
      currentBalance: 2500,
      availableCredit: 7500
    };
    mockCardManagementService.getCardDetails.and.returnValue($q.resolve(mockCard));
    
    var ctrl = createController();
    $rootScope.$digest();
    
    expect(ctrl.vm.card).toEqual(mockCard);
    expect(ctrl.vm.spendAnalysis.monthlySpend).toBe(750);
    expect(ctrl.vm.spendAnalysis.utilizationRate).toBe('25.00');
    expect(ctrl.vm.loading).toBe(false);
  });
  
  it('should handle card details load error', function() {
    mockCardManagementService.getCardDetails.and.returnValue($q.reject('Error'));
    
    var ctrl = createController();
    $rootScope.$digest();
    
    expect(ctrl.vm.error).toBe('Failed to load card details');
    expect(ctrl.vm.loading).toBe(false);
  });
});