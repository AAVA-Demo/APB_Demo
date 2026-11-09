/*
Test Documentation:
- Test Name: CardDetailController
- Purpose: Verify individual card detail display
- Scenario: Load and display detailed card information
- Expected Result: Controller should display single card details
*/

describe('CardDetailController', function() {
  'use strict';

  var $controller;
  var $q;
  var $rootScope;
  var CardService;
  var controller;
  var mockRouteParams;

  beforeEach(module('cardManagementModule'));

  beforeEach(inject(function(_$controller_, _$q_, _$rootScope_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;

    mockRouteParams = { cardId: 'card123' };

    CardService = {
      getCardDetails: jasmine.createSpy('getCardDetails').and.returnValue($q.resolve({}))
    };

    controller = $controller('CardDetailController', {
      $routeParams: mockRouteParams,
      CardService: CardService
    });
  }));

  /*
  Test Documentation:
  - Test Name: should be defined
  - Purpose: Verify controller exists
  - Scenario: Create controller instance
  - Expected Result: Controller should be defined
  */
  it('should be defined', function() {
    expect(controller).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should initialize with default values
  - Purpose: Verify initial state
  - Scenario: Check controller properties after creation
  - Expected Result: card null, loading true, error null
  */
  it('should initialize with default values', function() {
    expect(controller.card).toBeNull();
    expect(controller.loading).toBe(true);
    expect(controller.error).toBeNull();
  });

  /*
  Test Documentation:
  - Test Name: should extract cardId from route params
  - Purpose: Verify cardId is captured
  - Scenario: Controller creation with route params
  - Expected Result: cardId should match route param
  */
  it('should extract cardId from route params', function() {
    expect(controller.cardId).toBe('card123');
  });

  /*
  Test Documentation:
  - Test Name: should call loadCardDetails on init
  - Purpose: Verify auto-load on initialization
  - Scenario: Controller initialization
  - Expected Result: CardService.getCardDetails should be called
  */
  it('should call loadCardDetails on init', function() {
    expect(CardService.getCardDetails).toHaveBeenCalledWith('card123');
  });

  /*
  Test Documentation:
  - Test Name: should load card details successfully
  - Purpose: Verify successful detail loading
  - Scenario: CardService returns card data
  - Expected Result: card populated, loading false
  */
  it('should load card details successfully', function() {
    var mockCard = {
      cardId: 'card123',
      cardType: 'Visa',
      creditLimit: 10000
    };

    CardService.getCardDetails.and.returnValue($q.resolve(mockCard));

    controller.loadCardDetails();
    $rootScope.$digest();

    expect(controller.card).toEqual(mockCard);
    expect(controller.loading).toBe(false);
    expect(controller.error).toBeNull();
  });

  /*
  Test Documentation:
  - Test Name: should handle card loading error
  - Purpose: Verify error handling
  - Scenario: CardService returns error
  - Expected Result: Error message should be set
  */
  it('should handle card loading error', function() {
    CardService.getCardDetails.and.returnValue($q.reject('API Error'));

    controller.loadCardDetails();
    $rootScope.$digest();

    expect(controller.error).toBe('Failed to load card details. Please try again.');
    expect(controller.loading).toBe(false);
  });

  /*
  Test Documentation:
  - Test Name: should set loading to true when loading details
  - Purpose: Verify loading state management
  - Scenario: Call loadCardDetails
  - Expected Result: loading should be true before promise resolves
  */
  it('should set loading to true when loading details', function() {
    controller.loading = false;
    controller.loadCardDetails();
    expect(controller.loading).toBe(true);
  });
});

/*
Coverage Report:
- Functions tested: init, loadCardDetails
- Scenarios covered: initialization, route params extraction, successful load, error handling
- Uncovered scenarios: none
*/