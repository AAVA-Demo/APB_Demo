/*
Test Documentation:
- Test Name: CardDetailsController card detail loading
- Purpose: Validates controller initialization and card detail retrieval
- Scenario: Test successful card detail loading, error handling, and navigation
- Expected Result: Controller should load card details based on route parameter
*/
/*
Coverage Report:
- Functions tested: init, goBack
- Scenarios covered: successful card load, error handling, navigation
- Dependencies mocked: CardService, $routeParams, $location
- Uncovered scenarios: none
*/

describe('CardDetailsController', function() {
  'use strict';
  
  beforeEach(module('creditCard.management'));
  
  var controller, $q, $rootScope, $location;
  var CardService, $routeParams;
  var mockCard;
  
  beforeEach(inject(function($controller, _$q_, _$rootScope_, _$location_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    $location = _$location_;
    
    mockCard = {
      id: 'card1',
      bankName: 'HDFC Bank',
      cardNumber: '1234',
      creditLimit: 50000,
      availableCredit: 32000
    };
    
    $routeParams = { cardId: 'card1' };
    
    CardService = {
      getCardById: jasmine.createSpy('getCardById').and.returnValue($q.resolve(mockCard))
    };
    
    spyOn($location, 'path');
    
    controller = $controller('CardDetailsController', {
      CardService: CardService,
      $routeParams: $routeParams,
      $scope: $rootScope.$new(),
      $location: $location
    });
  }));
  
  it('should be defined', function() {
    expect(controller).toBeDefined();
  });
  
  it('should initialize with loading state true', function() {
    expect(controller.loading).toBe(true);
  });
  
  it('should load card details on initialization', function() {
    $rootScope.$digest();
    
    expect(CardService.getCardById).toHaveBeenCalledWith('card1');
    expect(controller.card).toEqual(mockCard);
    expect(controller.loading).toBe(false);
  });
  
  it('should handle error when card loading fails', function() {
    CardService.getCardById.and.returnValue($q.reject('Card not found'));
    
    var errorController = inject(function($controller) {
      return $controller('CardDetailsController', {
        CardService: CardService,
        $routeParams: $routeParams,
        $scope: $rootScope.$new(),
        $location: $location
      });
    });
    
    $rootScope.$digest();
    
    expect(errorController.error).toBe('Failed to load card details.');
    expect(errorController.loading).toBe(false);
  });
  
  it('should navigate back to cards list when goBack is called', function() {
    controller.goBack();
    
    expect($location.path).toHaveBeenCalledWith('/cards');
  });
  
  it('should have all required controller properties', function() {
    expect(controller.card).toBeDefined();
    expect(controller.loading).toBeDefined();
    expect(controller.error).toBeDefined();
    expect(controller.goBack).toBeDefined();
  });
});