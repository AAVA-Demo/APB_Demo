/*
Test Documentation:
- Test Name: creditCardTile Directive Unit Tests
- Purpose: Validate credit card tile directive rendering and interaction
- Scenario: Tests directive compilation, data binding, and click events
- Expected Result: Directive renders card information correctly with proper event handling
*/

(function() {
  'use strict';
  
  describe('creditCardTile directive', function() {
    var $compile, $rootScope, element, scope;
    
    beforeEach(module('cardManagementModule'));
    
    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
    }));
    
    it('should render card tile with card data', function() {
      scope.testCard = {
        cardType: 'Visa',
        cardNumber: '**** 1234',
        creditLimit: 50000,
        availableCredit: 37500,
        outstandingBalance: 12500,
        monthlySpend: 5800,
        status: 'active',
        expiryDate: '12/25'
      };
      scope.selectHandler = jasmine.createSpy('selectHandler');
      
      element = $compile('<credit-card-tile card="testCard" on-select="selectHandler(card)"></credit-card-tile>')(scope);
      scope.$digest();
      
      expect(element.html()).toContain('Visa');
      expect(element.html()).toContain('**** 1234');
      expect(element.html()).toContain('active');
    });
    
    it('should trigger onSelect when clicked', function() {
      scope.testCard = {cardType: 'MasterCard', status: 'active'};
      scope.selectHandler = jasmine.createSpy('selectHandler');
      
      element = $compile('<credit-card-tile card="testCard" on-select="selectHandler(card)"></credit-card-tile>')(scope);
      scope.$digest();
      
      element.find('.card-tile').triggerHandler('click');
      expect(scope.selectHandler).toHaveBeenCalled();
    });
    
    it('should apply correct status class', function() {
      scope.testCard = {status: 'inactive', cardType: 'Amex'};
      element = $compile('<credit-card-tile card="testCard" on-select="function() {}"></credit-card-tile>')(scope);
      scope.$digest();
      
      expect(element.html()).toContain('inactive');
    });
    
    it('should format numbers correctly', function() {
      scope.testCard = {
        cardType: 'Visa',
        creditLimit: 50000,
        availableCredit: 37500,
        outstandingBalance: 12500,
        monthlySpend: 5800,
        status: 'active'
      };
      element = $compile('<credit-card-tile card="testCard" on-select="function() {}"></credit-card-tile>')(scope);
      scope.$digest();
      
      expect(element.html()).toContain('50,000');
      expect(element.html()).toContain('37,500');
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: Directive compilation, template rendering, event handling
- Scenarios covered:
  * Card data rendering
  * Click event handling
  * Status class application
  * Number formatting
- Uncovered scenarios: Hover effects, blocked status styling
*/