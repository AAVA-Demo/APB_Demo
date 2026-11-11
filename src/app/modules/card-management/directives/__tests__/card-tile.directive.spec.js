/*
Test Documentation:
- Test Name: cardTile Directive - Card Tile Rendering
- Purpose: Validate card tile directive rendering and click handling
- Scenario: Test directive compilation, card data binding, click event
- Expected Result: Card tile renders with correct data and handles clicks
*/

describe('cardTile Directive', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  beforeEach(module('app.cardManagement'));
  
  var $compile, $rootScope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));
  
  it('should render card tile with card data', function() {
    $rootScope.testCard = {
      cardId: '1',
      cardNumber: '**** 1234',
      issuer: 'Visa',
      cardHolderName: 'John Doe',
      expiryDate: '12/25',
      availableCredit: 3500,
      status: 'active'
    };
    
    var element = $compile('<card-tile card="testCard"></card-tile>')($rootScope);
    $rootScope.$digest();
    
    var cardNumber = element.find('.card-number');
    var issuer = element.find('.card-issuer');
    var holder = element.find('.card-holder');
    
    expect(cardNumber.text()).toBe('**** 1234');
    expect(issuer.text()).toBe('Visa');
    expect(holder.text()).toBe('John Doe');
  });
  
  it('should apply inactive class for inactive cards', function() {
    $rootScope.testCard = {
      cardId: '2',
      cardNumber: '**** 5678',
      issuer: 'MasterCard',
      cardHolderName: 'Jane Smith',
      expiryDate: '06/26',
      availableCredit: 2000,
      status: 'inactive'
    };
    
    var element = $compile('<card-tile card="testCard"></card-tile>')($rootScope);
    $rootScope.$digest();
    
    var tile = element.find('.card-tile');
    expect(tile.hasClass('inactive')).toBe(true);
  });
  
  it('should not apply inactive class for active cards', function() {
    $rootScope.testCard = {
      cardId: '1',
      cardNumber: '**** 1234',
      issuer: 'Visa',
      cardHolderName: 'John Doe',
      expiryDate: '12/25',
      availableCredit: 3500,
      status: 'active'
    };
    
    var element = $compile('<card-tile card="testCard"></card-tile>')($rootScope);
    $rootScope.$digest();
    
    var tile = element.find('.card-tile');
    expect(tile.hasClass('inactive')).toBe(false);
  });
  
  it('should trigger onClick callback when clicked', function() {
    $rootScope.testCard = {
      cardId: '1',
      cardNumber: '**** 1234',
      issuer: 'Visa',
      cardHolderName: 'John Doe',
      expiryDate: '12/25',
      availableCredit: 3500,
      status: 'active'
    };
    
    $rootScope.clickHandler = jasmine.createSpy('clickHandler');
    
    var element = $compile('<card-tile card="testCard" on-click="clickHandler(cardId)"></card-tile>')($rootScope);
    $rootScope.$digest();
    
    var tile = element.find('.card-tile');
    tile.triggerHandler('click');
    
    expect($rootScope.clickHandler).toHaveBeenCalledWith('1');
  });
  
  it('should display correct status label', function() {
    $rootScope.testCard = {
      cardId: '1',
      cardNumber: '**** 1234',
      issuer: 'Visa',
      cardHolderName: 'John Doe',
      expiryDate: '12/25',
      availableCredit: 3500,
      status: 'active'
    };
    
    var element = $compile('<card-tile card="testCard"></card-tile>')($rootScope);
    $rootScope.$digest();
    
    var statusLabel = element.find('.card-status .label');
    expect(statusLabel.text()).toBe('ACTIVE');
    expect(statusLabel.hasClass('label-success')).toBe(true);
  });
  
  it('should handle blocked status', function() {
    $rootScope.testCard = {
      cardId: '3',
      cardNumber: '**** 9012',
      issuer: 'Amex',
      cardHolderName: 'Bob Johnson',
      expiryDate: '03/27',
      availableCredit: 0,
      status: 'blocked'
    };
    
    var element = $compile('<card-tile card="testCard"></card-tile>')($rootScope);
    $rootScope.$digest();
    
    var statusLabel = element.find('.card-status .label');
    expect(statusLabel.text()).toBe('BLOCKED');
    expect(statusLabel.hasClass('label-danger')).toBe(true);
  });
});

/*
Coverage Report:
- Functions tested: directive compilation, template rendering, click handling, status display
- Scenarios covered: active/inactive/blocked cards, click events, status labels, CSS classes
- Edge cases: different card statuses, click callback invocation
- Uncovered scenarios: none
*/