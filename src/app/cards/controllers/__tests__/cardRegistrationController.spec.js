/*
Test Documentation:
- Test Name: CardRegistrationController - Initialization
- Purpose: Verify controller initializes with correct default state
- Scenario: Controller is instantiated
- Expected Result: newCard is empty object, submitting is false
*/
/*
Test Documentation:
- Test Name: CardRegistrationController - Submit Card Success
- Purpose: Verify card registration succeeds and navigates to cards list
- Scenario: User submits valid card data
- Expected Result: Card is registered and state changes to cards
*/
/*
Test Documentation:
- Test Name: CardRegistrationController - Submit Card Error
- Purpose: Verify error handling when card registration fails
- Scenario: cardManagementService rejects promise
- Expected Result: vm.error is set and submitting is false
*/
/*
Coverage Report:
- Functions tested: initialization, submitCard
- Scenarios covered: success path, error handling
- Uncovered scenarios: form validation
*/

describe('CardRegistrationController', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.cards'));
  
  var $controller, $rootScope, $q, vm, mockCardManagementService, mockAuthService, mockState;
  
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    
    mockCardManagementService = {
      registerCard: jasmine.createSpy('registerCard')
    };
    
    mockAuthService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser')
    };
    
    mockState = {
      go: jasmine.createSpy('go')
    };
  }));
  
  function createController() {
    var $scope = $rootScope.$new();
    vm = $controller('CardRegistrationController', {
      $scope: $scope,
      $state: mockState,
      cardManagementService: mockCardManagementService,
      authService: mockAuthService
    });
    return {vm: vm, $scope: $scope};
  }
  
  it('should initialize with correct default state', function() {
    var ctrl = createController();
    
    expect(ctrl.vm.newCard).toEqual({});
    expect(ctrl.vm.submitting).toBe(false);
    expect(ctrl.vm.error).toBe(null);
  });
  
  it('should register card successfully and navigate to cards list', function() {
    var mockUser = {userId: 'user123', name: 'John Doe'};
    mockAuthService.getCurrentUser.and.returnValue($q.resolve(mockUser));
    mockCardManagementService.registerCard.and.returnValue($q.resolve({}));
    
    var ctrl = createController();
    ctrl.vm.newCard = {
      cardNumber: '4111111111111234',
      cardHolderName: 'John Doe',
      expiryDate: '12/25',
      cardType: 'Visa',
      creditLimit: 10000
    };
    
    ctrl.vm.submitCard();
    expect(ctrl.vm.submitting).toBe(true);
    
    $rootScope.$digest();
    
    expect(ctrl.vm.newCard.userId).toBe('user123');
    expect(mockCardManagementService.registerCard).toHaveBeenCalledWith(ctrl.vm.newCard);
    expect(mockState.go).toHaveBeenCalledWith('cards');
  });
  
  it('should handle card registration error', function() {
    var mockUser = {userId: 'user123', name: 'John Doe'};
    mockAuthService.getCurrentUser.and.returnValue($q.resolve(mockUser));
    mockCardManagementService.registerCard.and.returnValue($q.reject('Error'));
    
    var ctrl = createController();
    ctrl.vm.newCard = {cardNumber: '4111111111111234'};
    
    ctrl.vm.submitCard();
    $rootScope.$digest();
    
    expect(ctrl.vm.error).toBe('Failed to register card');
    expect(ctrl.vm.submitting).toBe(false);
  });
});