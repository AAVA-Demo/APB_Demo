/*
Test Documentation:
- Test Name: CardListController
- Purpose: Verify card list display and portfolio management
- Scenario: Load cards, display portfolio summary, and handle sorting
- Expected Result: Controller should display cards with comparison data
*/

describe('CardListController', function() {
  'use strict';

  var $controller;
  var $scope;
  var $q;
  var CardService;
  var AuthService;
  var controller;

  beforeEach(module('cardManagementModule'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $scope = _$rootScope_.$new();
    $q = _$q_;

    CardService = {
      getAllCards: jasmine.createSpy('getAllCards').and.returnValue($q.resolve([])),
      getCardComparison: jasmine.createSpy('getCardComparison').and.returnValue({})
    };

    AuthService = {
      validateSession: jasmine.createSpy('validateSession').and.returnValue($q.resolve(true))
    };

    controller = $controller('CardListController', {
      $scope: $scope,
      $filter: {},
      CardService: CardService,
      AuthService: AuthService
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
  - Expected Result: cards empty, loading true, error null
  */
  it('should initialize with default values', function() {
    expect(controller.cards).toEqual([]);
    expect(controller.loading).toBe(true);
    expect(controller.error).toBeNull();
    expect(controller.sortBy).toBe('cardType');
    expect(controller.sortReverse).toBe(false);
  });

  /*
  Test Documentation:
  - Test Name: should validate session on init
  - Purpose: Verify authentication check
  - Scenario: Controller initialization
  - Expected Result: AuthService.validateSession should be called
  */
  it('should validate session on init', function() {
    expect(AuthService.validateSession).toHaveBeenCalled();
  });

  /*
  Test Documentation:
  - Test Name: should load cards after successful session validation
  - Purpose: Verify card loading after auth
  - Scenario: Session validation succeeds
  - Expected Result: CardService.getAllCards should be called
  */
  it('should load cards after successful session validation', function() {
    $scope.$digest();
    expect(CardService.getAllCards).toHaveBeenCalled();
  });

  /*
  Test Documentation:
  - Test Name: should handle session validation failure
  - Purpose: Verify error handling for invalid session
  - Scenario: Session validation fails
  - Expected Result: Error message should be set
  */
  it('should handle session validation failure', function() {
    AuthService.validateSession.and.returnValue($q.reject(false));
    
    var ctrl = $controller('CardListController', {
      $scope: $scope,
      $filter: {},
      CardService: CardService,
      AuthService: AuthService
    });
    
    $scope.$digest();
    
    expect(ctrl.error).toBe('Session expired. Please login again.');
    expect(ctrl.loading).toBe(false);
  });

  /*
  Test Documentation:
  - Test Name: should load cards successfully
  - Purpose: Verify successful card loading
  - Scenario: CardService returns cards
  - Expected Result: cards populated, comparison calculated
  */
  it('should load cards successfully', function() {
    var mockCards = [
      { cardId: 'card1', cardType: 'Visa' },
      { cardId: 'card2', cardType: 'Mastercard' }
    ];
    var mockComparison = { totalCreditLimit: 25000 };

    CardService.getAllCards.and.returnValue($q.resolve(mockCards));
    CardService.getCardComparison.and.returnValue(mockComparison);

    controller.loadCards();
    $scope.$digest();

    expect(controller.cards).toEqual(mockCards);
    expect(controller.comparison).toEqual(mockComparison);
    expect(controller.loading).toBe(false);
  });

  /*
  Test Documentation:
  - Test Name: should handle card loading error
  - Purpose: Verify error handling
  - Scenario: CardService returns error
  - Expected Result: Error message should be set
  */
  it('should handle card loading error', function() {
    CardService.getAllCards.and.returnValue($q.reject('API Error'));

    controller.loadCards();
    $scope.$digest();

    expect(controller.error).toBe('Failed to load cards. Please try again.');
    expect(controller.loading).toBe(false);
  });

  /*
  Test Documentation:
  - Test Name: should toggle sort order for same field
  - Purpose: Verify sort toggle behavior
  - Scenario: Click same sort field twice
  - Expected Result: sortReverse should toggle
  */
  it('should toggle sort order for same field', function() {
    controller.sortBy = 'cardType';
    controller.sortReverse = false;

    controller.setSortBy('cardType');

    expect(controller.sortReverse).toBe(true);
  });

  /*
  Test Documentation:
  - Test Name: should change sort field
  - Purpose: Verify sort field change
  - Scenario: Click different sort field
  - Expected Result: sortBy should change, sortReverse reset to false
  */
  it('should change sort field', function() {
    controller.sortBy = 'cardType';
    controller.sortReverse = true;

    controller.setSortBy('creditLimit');

    expect(controller.sortBy).toBe('creditLimit');
    expect(controller.sortReverse).toBe(false);
  });
});

/*
Coverage Report:
- Functions tested: init, loadCards, setSortBy
- Scenarios covered: initialization, session validation, card loading, error handling, sorting
- Uncovered scenarios: none
*/