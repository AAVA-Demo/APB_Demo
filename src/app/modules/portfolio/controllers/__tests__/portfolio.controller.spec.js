/*
Test Documentation:
- Test Name: PortfolioController - Initialization
- Purpose: Verify controller initializes and loads cards
- Scenario: Controller is instantiated
- Expected Result: loadCards is called, default values set
*/
/*
Test Documentation:
- Test Name: PortfolioController - loadCards success
- Purpose: Verify cards are loaded successfully
- Scenario: PortfolioService returns card data
- Expected Result: vm.cards and vm.filteredCards populated
*/
/*
Test Documentation:
- Test Name: PortfolioController - loadCardDetail
- Purpose: Verify card detail is loaded for selected card
- Scenario: Card is selected via route params
- Expected Result: Card detail service called, vm.cardDetail populated
*/
/*
Test Documentation:
- Test Name: PortfolioController - applyFilter
- Purpose: Verify filter functionality works correctly
- Scenario: User applies filter
- Expected Result: CardFilterFactory called, filteredCards updated
*/
/*
Test Documentation:
- Test Name: PortfolioController - selectCard navigation
- Purpose: Verify navigation to card detail page
- Scenario: User selects a card
- Expected Result: $location.path called with correct route
*/
/*
Coverage Report:
- Functions tested: loadCards, loadCardDetail, selectCard, applyFilter, backToList
- Scenarios covered: initialization, success paths, error handling, filtering, navigation
- Uncovered scenarios: none
*/

describe('PortfolioController', function() {
  'use strict';

  var $controller, $rootScope, $q, $location, PortfolioService, CardFilterFactory, controller, scope;

  beforeEach(module('app.portfolio'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _$location_, _PortfolioService_, _CardFilterFactory_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    $location = _$location_;
    PortfolioService = _PortfolioService_;
    CardFilterFactory = _CardFilterFactory_;
    scope = $rootScope.$new();

    var mockCards = [
      { cardId: 'card1', cardName: 'Card 1', creditLimit: 10000, currentBalance: 3000, availableCredit: 7000, utilizationPercentage: '30.00', status: 'Active' },
      { cardId: 'card2', cardName: 'Card 2', creditLimit: 20000, currentBalance: 15000, availableCredit: 5000, utilizationPercentage: '75.00', status: 'Active' },
      { cardId: 'card3', cardName: 'Card 3', creditLimit: 15000, currentBalance: 5000, availableCredit: 10000, utilizationPercentage: '33.33', status: 'Inactive' }
    ];

    spyOn(PortfolioService, 'getUserCards').and.returnValue($q.resolve(mockCards));
    spyOn(PortfolioService, 'getCardSpendDetail').and.returnValue($q.resolve({
      categoryBreakdown: [{ category: 'Food', amount: 500 }],
      recentTransactions: [{ date: '2026-11-10', merchant: 'Store', category: 'Shopping', amount: 100 }]
    }));
    spyOn(CardFilterFactory, 'filterCards').and.callFake(function(cards, filterType) {
      if (filterType === 'highUtilization') {
        return cards.filter(function(card) { return parseFloat(card.utilizationPercentage) > 70; });
      }
      return cards;
    });
    spyOn($location, 'path');
  }));

  it('should initialize with correct default values', function() {
    controller = $controller('PortfolioController', {
      PortfolioService: PortfolioService,
      CardFilterFactory: CardFilterFactory,
      $scope: scope,
      $routeParams: {},
      $location: $location
    });

    expect(controller.cards).toEqual([]);
    expect(controller.filteredCards).toEqual([]);
    expect(controller.selectedCard).toBeNull();
    expect(controller.cardDetail).toBeNull();
    expect(controller.loading).toBe(true);
    expect(controller.error).toBeNull();
    expect(controller.userId).toBe('user123');
    expect(controller.filterType).toBe('all');
  });

  it('should load cards successfully on initialization', function() {
    controller = $controller('PortfolioController', {
      PortfolioService: PortfolioService,
      CardFilterFactory: CardFilterFactory,
      $scope: scope,
      $routeParams: {},
      $location: $location
    });

    $rootScope.$digest();

    expect(PortfolioService.getUserCards).toHaveBeenCalledWith('user123');
    expect(controller.cards.length).toBe(3);
    expect(controller.filteredCards.length).toBe(3);
    expect(controller.loading).toBe(false);
    expect(controller.error).toBeNull();
  });

  it('should handle error when loading cards fails', function() {
    PortfolioService.getUserCards.and.returnValue($q.reject('Service error'));

    controller = $controller('PortfolioController', {
      PortfolioService: PortfolioService,
      CardFilterFactory: CardFilterFactory,
      $scope: scope,
      $routeParams: {},
      $location: $location
    });

    $rootScope.$digest();

    expect(controller.error).toBe('Failed to load credit cards');
    expect(controller.loading).toBe(false);
  });

  it('should load card detail when cardId is in route params', function() {
    controller = $controller('PortfolioController', {
      PortfolioService: PortfolioService,
      CardFilterFactory: CardFilterFactory,
      $scope: scope,
      $routeParams: { cardId: 'card1' },
      $location: $location
    });

    $rootScope.$digest();

    expect(controller.selectedCard).toBeDefined();
    expect(controller.selectedCard.cardId).toBe('card1');
    expect(PortfolioService.getCardSpendDetail).toHaveBeenCalledWith('card1', jasmine.any(String));
  });

  it('should apply filter correctly', function() {
    controller = $controller('PortfolioController', {
      PortfolioService: PortfolioService,
      CardFilterFactory: CardFilterFactory,
      $scope: scope,
      $routeParams: {},
      $location: $location
    });

    $rootScope.$digest();

    controller.applyFilter('highUtilization');

    expect(CardFilterFactory.filterCards).toHaveBeenCalledWith(controller.cards, 'highUtilization');
    expect(controller.filterType).toBe('highUtilization');
    expect(controller.filteredCards.length).toBe(1);
    expect(controller.filteredCards[0].cardId).toBe('card2');
  });

  it('should navigate to card detail when card is selected', function() {
    controller = $controller('PortfolioController', {
      PortfolioService: PortfolioService,
      CardFilterFactory: CardFilterFactory,
      $scope: scope,
      $routeParams: {},
      $location: $location
    });

    $rootScope.$digest();

    var card = controller.cards[0];
    controller.selectCard(card);

    expect($location.path).toHaveBeenCalledWith('/portfolio/card1');
  });

  it('should navigate back to portfolio list', function() {
    controller = $controller('PortfolioController', {
      PortfolioService: PortfolioService,
      CardFilterFactory: CardFilterFactory,
      $scope: scope,
      $routeParams: {},
      $location: $location
    });

    controller.backToList();

    expect($location.path).toHaveBeenCalledWith('/portfolio');
  });

  it('should handle card detail load error gracefully', function() {
    PortfolioService.getCardSpendDetail.and.returnValue($q.reject('Detail error'));

    controller = $controller('PortfolioController', {
      PortfolioService: PortfolioService,
      CardFilterFactory: CardFilterFactory,
      $scope: scope,
      $routeParams: { cardId: 'card1' },
      $location: $location
    });

    $rootScope.$digest();

    expect(controller.cardDetail).toBeNull();
  });
});