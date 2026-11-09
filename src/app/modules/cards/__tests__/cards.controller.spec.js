/*
Test Documentation:
- Test Name: CardsController - initialization
- Purpose: Validates controller initializes and loads cards
- Scenario: Controller instantiated
- Expected Result: loadCards called, loading true
*/
/*
Test Documentation:
- Test Name: CardsController - successful card load
- Purpose: Validates cards portfolio loaded successfully
- Scenario: cardsService returns valid portfolio
- Expected Result: vm.portfolio populated, loading false
*/
/*
Test Documentation:
- Test Name: CardsController - card load failure
- Purpose: Validates error handling when card load fails
- Scenario: cardsService rejects promise
- Expected Result: vm.error set, loading false
*/
/*
Test Documentation:
- Test Name: CardsController - card selection toggle
- Purpose: Validates card selection/deselection
- Scenario: User toggles card selection
- Expected Result: Card added/removed from selectedCards array
*/
/*
Test Documentation:
- Test Name: CardsController - comparison mode toggle
- Purpose: Validates comparison mode activation/deactivation
- Scenario: User toggles comparison mode
- Expected Result: comparisonMode flag toggled, selectedCards cleared on exit
*/
/*
Coverage Report:
- Functions tested: loadCards, toggleCardSelection, isCardSelected, toggleComparisonMode
- Scenarios covered: initialization, successful load, failed load, card selection, comparison mode
- Edge cases: service rejection, multiple card selection, comparison mode exit
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CardsController', function() {
    var controller, cardsService, authService, $scope, $q;
    var mockPortfolio = {
      userId: 'user123',
      cards: [
        { cardId: 'card1', cardType: 'Visa', cardNumber: '****1234', creditLimit: 5000, availableCredit: 3000, outstandingBalance: 2000, monthlySpend: 500 },
        { cardId: 'card2', cardType: 'MasterCard', cardNumber: '****5678', creditLimit: 10000, availableCredit: 7000, outstandingBalance: 3000, monthlySpend: 800 }
      ],
      totalCards: 2,
      totalCreditLimit: 15000,
      totalOutstanding: 5000
    };

    beforeEach(module('cardsModule'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function($controller, _$q_, $rootScope) {
      $q = _$q_;
      $scope = $rootScope.$new();

      cardsService = {
        getUserCards: jasmine.createSpy('getUserCards').and.returnValue($q.resolve(mockPortfolio))
      };

      authService = {
        getUserId: jasmine.createSpy('getUserId').and.returnValue('user123')
      };

      controller = $controller('CardsController', {
        cardsService: cardsService,
        authService: authService,
        $scope: $scope
      });
    }));

    describe('initialization', function() {
      it('should initialize with loading state true', function() {
        expect(controller.loading).toBe(true);
      });

      it('should initialize portfolio as null', function() {
        expect(controller.portfolio).toBeNull();
      });

      it('should initialize error as null', function() {
        expect(controller.error).toBeNull();
      });

      it('should initialize selectedCards as empty array', function() {
        expect(controller.selectedCards).toEqual([]);
      });

      it('should initialize comparisonMode as false', function() {
        expect(controller.comparisonMode).toBe(false);
      });

      it('should call loadCards on initialization', function() {
        expect(authService.getUserId).toHaveBeenCalled();
        expect(cardsService.getUserCards).toHaveBeenCalledWith('user123');
      });
    });

    describe('loadCards', function() {
      it('should load cards successfully', function() {
        controller.loadCards();
        $scope.$digest();

        expect(controller.portfolio).toEqual(mockPortfolio);
        expect(controller.loading).toBe(false);
        expect(controller.error).toBeNull();
      });

      it('should handle card load failure', function() {
        cardsService.getUserCards.and.returnValue($q.reject({ error: 'Server error' }));

        controller.loadCards();
        $scope.$digest();

        expect(controller.error).toBe('Failed to load credit cards');
        expect(controller.loading).toBe(false);
        expect(controller.portfolio).toBeNull();
      });

      it('should get userId from authService', function() {
        controller.loadCards();

        expect(authService.getUserId).toHaveBeenCalled();
        expect(cardsService.getUserCards).toHaveBeenCalledWith('user123');
      });

      it('should reset error on successful reload', function() {
        controller.error = 'Previous error';

        controller.loadCards();
        $scope.$digest();

        expect(controller.error).toBeNull();
      });
    });

    describe('toggleCardSelection', function() {
      var card1, card2;

      beforeEach(function() {
        controller.loadCards();
        $scope.$digest();
        card1 = mockPortfolio.cards[0];
        card2 = mockPortfolio.cards[1];
      });

      it('should add card to selectedCards when not selected', function() {
        controller.toggleCardSelection(card1);

        expect(controller.selectedCards).toContain(card1);
        expect(controller.selectedCards.length).toBe(1);
      });

      it('should remove card from selectedCards when already selected', function() {
        controller.selectedCards.push(card1);

        controller.toggleCardSelection(card1);

        expect(controller.selectedCards).not.toContain(card1);
        expect(controller.selectedCards.length).toBe(0);
      });

      it('should handle multiple card selections', function() {
        controller.toggleCardSelection(card1);
        controller.toggleCardSelection(card2);

        expect(controller.selectedCards).toContain(card1);
        expect(controller.selectedCards).toContain(card2);
        expect(controller.selectedCards.length).toBe(2);
      });

      it('should handle toggle of same card multiple times', function() {
        controller.toggleCardSelection(card1);
        expect(controller.selectedCards.length).toBe(1);

        controller.toggleCardSelection(card1);
        expect(controller.selectedCards.length).toBe(0);

        controller.toggleCardSelection(card1);
        expect(controller.selectedCards.length).toBe(1);
      });
    });

    describe('isCardSelected', function() {
      var card1, card2;

      beforeEach(function() {
        controller.loadCards();
        $scope.$digest();
        card1 = mockPortfolio.cards[0];
        card2 = mockPortfolio.cards[1];
      });

      it('should return true when card is selected', function() {
        controller.selectedCards.push(card1);

        expect(controller.isCardSelected(card1)).toBe(true);
      });

      it('should return false when card is not selected', function() {
        expect(controller.isCardSelected(card1)).toBe(false);
      });

      it('should correctly identify multiple selected cards', function() {
        controller.selectedCards.push(card1);
        controller.selectedCards.push(card2);

        expect(controller.isCardSelected(card1)).toBe(true);
        expect(controller.isCardSelected(card2)).toBe(true);
      });
    });

    describe('toggleComparisonMode', function() {
      it('should enable comparison mode when disabled', function() {
        controller.comparisonMode = false;

        controller.toggleComparisonMode();

        expect(controller.comparisonMode).toBe(true);
      });

      it('should disable comparison mode when enabled', function() {
        controller.comparisonMode = true;

        controller.toggleComparisonMode();

        expect(controller.comparisonMode).toBe(false);
      });

      it('should clear selectedCards when exiting comparison mode', function() {
        controller.loadCards();
        $scope.$digest();
        var card1 = mockPortfolio.cards[0];
        controller.selectedCards.push(card1);
        controller.comparisonMode = true;

        controller.toggleComparisonMode();

        expect(controller.comparisonMode).toBe(false);
        expect(controller.selectedCards.length).toBe(0);
      });

      it('should not clear selectedCards when entering comparison mode', function() {
        controller.loadCards();
        $scope.$digest();
        var card1 = mockPortfolio.cards[0];
        controller.selectedCards.push(card1);
        controller.comparisonMode = false;

        controller.toggleComparisonMode();

        expect(controller.comparisonMode).toBe(true);
        expect(controller.selectedCards.length).toBe(1);
      });
    });
  });
})();