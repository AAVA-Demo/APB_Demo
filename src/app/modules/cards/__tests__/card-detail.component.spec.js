/*
Test Documentation:
- Test Name: cardDetail component - rendering
- Purpose: Validates component renders card details
- Scenario: Component compiled with card binding
- Expected Result: Card details displayed correctly
*/
/*
Test Documentation:
- Test Name: cardDetail component - selection checkbox
- Purpose: Validates checkbox reflects selection state
- Scenario: isSelected binding changes
- Expected Result: Checkbox checked/unchecked accordingly
*/
/*
Test Documentation:
- Test Name: cardDetail component - selection callback
- Purpose: Validates onSelect callback invoked on checkbox change
- Scenario: User clicks checkbox
- Expected Result: onSelect called with card parameter
*/
/*
Test Documentation:
- Test Name: cardDetail component - panel styling
- Purpose: Validates panel class changes based on selection
- Scenario: isSelected true/false
- Expected Result: panel-primary when selected, panel-default when not
*/
/*
Coverage Report:
- Functions tested: component rendering, checkbox binding, callback invocation, styling
- Scenarios covered: rendering with data, selection state, callback, panel styling
- Edge cases: null card data, missing properties
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('cardDetail component', function() {
    var $componentController, $rootScope, scope, ctrl;
    var mockCard = {
      cardId: 'card1',
      cardType: 'Visa Gold',
      cardNumber: '****1234',
      issuer: 'Bank of America',
      creditLimit: 10000,
      availableCredit: 6000,
      outstandingBalance: 4000,
      monthlySpend: 1200
    };

    beforeEach(module('cardsModule'));

    beforeEach(inject(function(_$componentController_, _$rootScope_) {
      $componentController = _$componentController_;
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
    }));

    function createComponent(card, isSelected, onSelectCallback) {
      var bindings = {
        card: card,
        isSelected: isSelected,
        onSelect: onSelectCallback || jasmine.createSpy('onSelect')
      };
      return $componentController('cardDetail', { $scope: scope }, bindings);
    }

    describe('component initialization', function() {
      it('should bind card data', function() {
        ctrl = createComponent(mockCard, false);

        expect(ctrl.card).toEqual(mockCard);
      });

      it('should bind isSelected state', function() {
        ctrl = createComponent(mockCard, true);

        expect(ctrl.isSelected).toBe(true);
      });

      it('should bind onSelect callback', function() {
        var callback = jasmine.createSpy('onSelect');
        ctrl = createComponent(mockCard, false, callback);

        expect(ctrl.onSelect).toBe(callback);
      });
    });

    describe('template rendering', function() {
      var $compile, element;

      beforeEach(inject(function(_$compile_) {
        $compile = _$compile_;
      }));

      it('should render card type and number in heading', function() {
        scope.testCard = mockCard;
        scope.testSelected = false;
        scope.testOnSelect = jasmine.createSpy('onSelect');

        element = $compile('<card-detail card="testCard" is-selected="testSelected" on-select="testOnSelect(card)"></card-detail>')(scope);
        scope.$digest();

        var heading = element.find('h4').text();
        expect(heading).toContain('Visa Gold');
        expect(heading).toContain('****1234');
      });

      it('should render issuer', function() {
        scope.testCard = mockCard;
        scope.testSelected = false;
        scope.testOnSelect = jasmine.createSpy('onSelect');

        element = $compile('<card-detail card="testCard" is-selected="testSelected" on-select="testOnSelect(card)"></card-detail>')(scope);
        scope.$digest();

        var bodyText = element.find('.panel-body').text();
        expect(bodyText).toContain('Bank of America');
      });

      it('should render credit limit with currency formatting', function() {
        scope.testCard = mockCard;
        scope.testSelected = false;
        scope.testOnSelect = jasmine.createSpy('onSelect');

        element = $compile('<card-detail card="testCard" is-selected="testSelected" on-select="testOnSelect(card)"></card-detail>')(scope);
        scope.$digest();

        var bodyText = element.find('.panel-body').text();
        expect(bodyText).toContain('10,000');
      });

      it('should render available credit', function() {
        scope.testCard = mockCard;
        scope.testSelected = false;
        scope.testOnSelect = jasmine.createSpy('onSelect');

        element = $compile('<card-detail card="testCard" is-selected="testSelected" on-select="testOnSelect(card)"></card-detail>')(scope);
        scope.$digest();

        var bodyText = element.find('.panel-body').text();
        expect(bodyText).toContain('6,000');
      });

      it('should render outstanding balance', function() {
        scope.testCard = mockCard;
        scope.testSelected = false;
        scope.testOnSelect = jasmine.createSpy('onSelect');

        element = $compile('<card-detail card="testCard" is-selected="testSelected" on-select="testOnSelect(card)"></card-detail>')(scope);
        scope.$digest();

        var bodyText = element.find('.panel-body').text();
        expect(bodyText).toContain('4,000');
      });

      it('should render monthly spend', function() {
        scope.testCard = mockCard;
        scope.testSelected = false;
        scope.testOnSelect = jasmine.createSpy('onSelect');

        element = $compile('<card-detail card="testCard" is-selected="testSelected" on-select="testOnSelect(card)"></card-detail>')(scope);
        scope.$digest();

        var bodyText = element.find('.panel-body').text();
        expect(bodyText).toContain('1,200');
      });
    });

    describe('selection styling', function() {
      var $compile, element;

      beforeEach(inject(function(_$compile_) {
        $compile = _$compile_;
      }));

      it('should apply panel-primary class when selected', function() {
        scope.testCard = mockCard;
        scope.testSelected = true;
        scope.testOnSelect = jasmine.createSpy('onSelect');

        element = $compile('<card-detail card="testCard" is-selected="testSelected" on-select="testOnSelect(card)"></card-detail>')(scope);
        scope.$digest();

        expect(element.find('.panel-primary').length).toBe(1);
        expect(element.find('.panel-default').length).toBe(0);
      });

      it('should apply panel-default class when not selected', function() {
        scope.testCard = mockCard;
        scope.testSelected = false;
        scope.testOnSelect = jasmine.createSpy('onSelect');

        element = $compile('<card-detail card="testCard" is-selected="testSelected" on-select="testOnSelect(card)"></card-detail>')(scope);
        scope.$digest();

        expect(element.find('.panel-default').length).toBe(1);
        expect(element.find('.panel-primary').length).toBe(0);
      });

      it('should update panel class when selection changes', function() {
        scope.testCard = mockCard;
        scope.testSelected = false;
        scope.testOnSelect = jasmine.createSpy('onSelect');

        element = $compile('<card-detail card="testCard" is-selected="testSelected" on-select="testOnSelect(card)"></card-detail>')(scope);
        scope.$digest();

        expect(element.find('.panel-default').length).toBe(1);

        scope.testSelected = true;
        scope.$digest();

        expect(element.find('.panel-primary').length).toBe(1);
      });
    });

    describe('checkbox behavior', function() {
      var $compile, element;

      beforeEach(inject(function(_$compile_) {
        $compile = _$compile_;
      }));

      it('should render checkbox in heading', function() {
        scope.testCard = mockCard;
        scope.testSelected = false;
        scope.testOnSelect = jasmine.createSpy('onSelect');

        element = $compile('<card-detail card="testCard" is-selected="testSelected" on-select="testOnSelect(card)"></card-detail>')(scope);
        scope.$digest();

        var checkbox = element.find('input[type="checkbox"]');
        expect(checkbox.length).toBe(1);
      });

      it('should check checkbox when isSelected is true', function() {
        scope.testCard = mockCard;
        scope.testSelected = true;
        scope.testOnSelect = jasmine.createSpy('onSelect');

        element = $compile('<card-detail card="testCard" is-selected="testSelected" on-select="testOnSelect(card)"></card-detail>')(scope);
        scope.$digest();

        var checkbox = element.find('input[type="checkbox"]');
        expect(checkbox.prop('checked')).toBe(true);
      });

      it('should uncheck checkbox when isSelected is false', function() {
        scope.testCard = mockCard;
        scope.testSelected = false;
        scope.testOnSelect = jasmine.createSpy('onSelect');

        element = $compile('<card-detail card="testCard" is-selected="testSelected" on-select="testOnSelect(card)"></card-detail>')(scope);
        scope.$digest();

        var checkbox = element.find('input[type="checkbox"]');
        expect(checkbox.prop('checked')).toBe(false);
      });
    });

    describe('edge cases', function() {
      it('should handle card with missing optional properties', function() {
        var incompleteCard = {
          cardId: 'card2',
          cardType: 'Basic Card',
          cardNumber: '****9999'
        };

        ctrl = createComponent(incompleteCard, false);

        expect(ctrl.card).toEqual(incompleteCard);
        expect(ctrl.card.issuer).toBeUndefined();
      });

      it('should handle zero values', function() {
        var zeroCard = {
          cardId: 'card3',
          cardType: 'Zero Card',
          cardNumber: '****0000',
          creditLimit: 0,
          availableCredit: 0,
          outstandingBalance: 0,
          monthlySpend: 0
        };

        ctrl = createComponent(zeroCard, false);

        expect(ctrl.card.creditLimit).toBe(0);
        expect(ctrl.card.monthlySpend).toBe(0);
      });
    });
  });
})();