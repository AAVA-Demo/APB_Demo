/*
Test Documentation:
- Test Name: credit-card-item Directive Unit Tests
- Purpose: Validate credit card item directive rendering and data display
- Scenario: Test directive compilation, card data binding, and responsive layout
- Expected Result: Correct card information display with all financial details
*/

describe('creditCardItem directive', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var $compile, $rootScope, element, scope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));
  
  describe('rendering', function() {
    it('should render credit card item with all details', function() {
      scope.cardData = {
        id: 'card1',
        cardName: 'Visa Gold',
        cardNumber: '**** **** **** 1234',
        cardType: 'Credit',
        creditLimit: 10000,
        availableCredit: 9500,
        outstandingBalance: 500,
        currentMonthSpend: 300
      };
      
      element = $compile('<credit-card-item card="cardData"></credit-card-item>')(scope);
      scope.$digest();
      
      expect(element.find('.card-item').length).toBe(1);
      expect(element.find('h4').text()).toBe('Visa Gold');
    });
    
    it('should display card number', function() {
      scope.cardData = {
        cardName: 'Mastercard',
        cardNumber: '**** **** **** 5678',
        cardType: 'Credit',
        creditLimit: 5000,
        availableCredit: 4500,
        outstandingBalance: 500,
        currentMonthSpend: 200
      };
      
      element = $compile('<credit-card-item card="cardData"></credit-card-item>')(scope);
      scope.$digest();
      
      expect(element.find('.card-number').text()).toBe('**** **** **** 5678');
    });
    
    it('should display card type', function() {
      scope.cardData = {
        cardName: 'Amex',
        cardNumber: '**** ****** *1234',
        cardType: 'Charge Card',
        creditLimit: 15000,
        availableCredit: 14000,
        outstandingBalance: 1000,
        currentMonthSpend: 800
      };
      
      element = $compile('<credit-card-item card="cardData"></credit-card-item>')(scope);
      scope.$digest();
      
      var smallTags = element.find('small');
      expect(smallTags.length).toBeGreaterThan(0);
    });
    
    it('should display all financial details', function() {
      scope.cardData = {
        cardName: 'Test Card',
        cardNumber: '**** 1234',
        cardType: 'Credit',
        creditLimit: 8000,
        availableCredit: 7200,
        outstandingBalance: 800,
        currentMonthSpend: 400
      };
      
      element = $compile('<credit-card-item card="cardData"></credit-card-item>')(scope);
      scope.$digest();
      
      var strongTags = element.find('strong');
      expect(strongTags.length).toBe(4);
    });
    
    it('should update when card data changes', function() {
      scope.cardData = {
        cardName: 'Original Card',
        cardNumber: '**** 1111',
        cardType: 'Credit',
        creditLimit: 5000,
        availableCredit: 4000,
        outstandingBalance: 1000,
        currentMonthSpend: 500
      };
      
      element = $compile('<credit-card-item card="cardData"></credit-card-item>')(scope);
      scope.$digest();
      
      scope.cardData.cardName = 'Updated Card';
      scope.$digest();
      
      expect(element.find('h4').text()).toBe('Updated Card');
    });
  });
  
  describe('isolated scope', function() {
    it('should have isolated scope with card binding', function() {
      scope.cardData = {
        cardName: 'Test',
        cardNumber: '**** 1234',
        cardType: 'Credit',
        creditLimit: 5000,
        availableCredit: 4500,
        outstandingBalance: 500,
        currentMonthSpend: 200
      };
      
      element = $compile('<credit-card-item card="cardData"></credit-card-item>')(scope);
      scope.$digest();
      
      var isolatedScope = element.isolateScope();
      expect(isolatedScope.card).toEqual(scope.cardData);
    });
  });
});

/*
Coverage Report:
- Functions tested: Directive compilation, template rendering, data binding
- Scenarios covered:
  * Complete card information display
  * Card number rendering
  * Card type display
  * Financial details (limit, available, outstanding, monthly spend)
  * Data change detection
  * Isolated scope binding
- Edge cases: Data updates, various card types
- Uncovered scenarios: Missing fields, null values, very long card names
*/