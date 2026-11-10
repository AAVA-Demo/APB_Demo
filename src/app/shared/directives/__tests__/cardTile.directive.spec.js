/*
Test Documentation:
- Test Name: cardTile directive - Compile and Render
- Purpose: Verify directive compiles and displays card data
- Scenario: Directive with card object
- Expected Result: Renders card tile with all card information
*/
/*
Test Documentation:
- Test Name: cardTile directive - Display Card Details
- Purpose: Verify directive displays all card properties
- Scenario: Provide complete card object
- Expected Result: All card details are rendered correctly
*/
/*
Test Documentation:
- Test Name: cardTile directive - Mask Card Number
- Purpose: Verify card number is masked using cardMask filter
- Scenario: Card with full card number
- Expected Result: Only last 4 digits are visible
*/
/*
Coverage Report:
- Functions tested: directive compilation, template rendering, filter integration
- Scenarios covered: basic rendering, data binding, card masking
- Uncovered scenarios: click event
*/

describe('cardTile directive', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var $compile, $rootScope, element, scope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));
  
  it('should compile and render card tile', function() {
    scope.testCard = {
      cardId: 'c1',
      cardNumber: '4111111111111234',
      cardType: 'Visa',
      cardHolderName: 'John Doe',
      creditLimit: 10000,
      availableCredit: 7500,
      currentBalance: 2500,
      issuerName: 'Chase'
    };
    
    element = $compile('<card-tile card="testCard"></card-tile>')(scope);
    scope.$digest();
    
    expect(element.find('.card-tile').length).toBe(1);
    expect(element.find('.card-header').length).toBe(1);
    expect(element.find('.card-details').length).toBe(1);
  });
  
  it('should display all card details correctly', function() {
    scope.testCard = {
      cardType: 'Visa',
      issuerName: 'Chase',
      cardNumber: '4111111111111234',
      cardHolderName: 'John Doe',
      creditLimit: 10000,
      availableCredit: 7500,
      currentBalance: 2500
    };
    
    element = $compile('<card-tile card="testCard"></card-tile>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('Visa');
    expect(element.text()).toContain('Chase');
    expect(element.text()).toContain('John Doe');
  });
  
  it('should mask card number showing only last 4 digits', function() {
    scope.testCard = {
      cardNumber: '4111111111111234',
      cardType: 'Visa',
      cardHolderName: 'John Doe',
      creditLimit: 10000,
      availableCredit: 7500,
      currentBalance: 2500,
      issuerName: 'Chase'
    };
    
    element = $compile('<card-tile card="testCard"></card-tile>')(scope);
    scope.$digest();
    
    var cardNumber = element.find('.card-number').text().trim();
    expect(cardNumber).toContain('1234');
    expect(cardNumber).toContain('****');
  });
});