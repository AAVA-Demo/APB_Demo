/*
Test Documentation:
- Test Name: cardDetail directive - rendering with card data
- Purpose: Verify directive renders card details correctly
- Scenario: Directive compiled with card and detail data
- Expected Result: Card information displayed correctly
*/
/*
Test Documentation:
- Test Name: cardDetail directive - category breakdown display
- Purpose: Verify category breakdown table is rendered
- Scenario: Detail object contains categoryBreakdown
- Expected Result: Category table displayed with correct data
*/
/*
Test Documentation:
- Test Name: cardDetail directive - recent transactions display
- Purpose: Verify recent transactions table is rendered
- Scenario: Detail object contains recentTransactions
- Expected Result: Transactions table displayed with correct data
*/
/*
Test Documentation:
- Test Name: cardDetail directive - no detail data
- Purpose: Verify directive handles missing detail data
- Scenario: Detail is null or undefined
- Expected Result: Only card summary displayed, no tables
*/
/*
Coverage Report:
- Functions tested: directive rendering, conditional display
- Scenarios covered: full data, partial data, missing data
- Uncovered scenarios: none
*/

describe('cardDetail directive', function() {
  'use strict';

  var $compile, $rootScope, element, scope;

  beforeEach(module('app.portfolio'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));

  it('should render card details correctly', function() {
    scope.card = {
      cardName: 'Premium Card',
      cardNumber: '**** 1234',
      creditLimit: 10000,
      currentBalance: 3000,
      availableCredit: 7000,
      utilizationPercentage: '30.00'
    };
    scope.detail = null;

    element = $compile('<card-detail card="card" detail="detail"></card-detail>')(scope);
    scope.$digest();

    expect(element.text()).toContain('Premium Card');
    expect(element.text()).toContain('**** 1234');
    expect(element.text()).toContain('10,000');
    expect(element.text()).toContain('3,000');
    expect(element.text()).toContain('7,000');
    expect(element.text()).toContain('30.00%');
  });

  it('should render category breakdown when detail is provided', function() {
    scope.card = {
      cardName: 'Test Card',
      cardNumber: '**** 5678',
      creditLimit: 5000,
      currentBalance: 2000,
      availableCredit: 3000,
      utilizationPercentage: '40.00'
    };
    scope.detail = {
      categoryBreakdown: [
        { category: 'Food & Dining', amount: 500 },
        { category: 'Fuel', amount: 300 }
      ],
      recentTransactions: []
    };

    element = $compile('<card-detail card="card" detail="detail"></card-detail>')(scope);
    scope.$digest();

    expect(element.text()).toContain('Spending Breakdown');
    expect(element.text()).toContain('Food & Dining');
    expect(element.text()).toContain('500');
    expect(element.text()).toContain('Fuel');
    expect(element.text()).toContain('300');
  });

  it('should render recent transactions when detail is provided', function() {
    scope.card = {
      cardName: 'Test Card',
      cardNumber: '**** 5678',
      creditLimit: 5000,
      currentBalance: 2000,
      availableCredit: 3000,
      utilizationPercentage: '40.00'
    };
    scope.detail = {
      categoryBreakdown: [],
      recentTransactions: [
        { date: '2026-11-10T10:00:00Z', merchant: 'Store A', category: 'Shopping', amount: 150 },
        { date: '2026-11-09T14:30:00Z', merchant: 'Restaurant B', category: 'Food & Dining', amount: 75 }
      ]
    };

    element = $compile('<card-detail card="card" detail="detail"></card-detail>')(scope);
    scope.$digest();

    expect(element.text()).toContain('Recent Transactions');
    expect(element.text()).toContain('Store A');
    expect(element.text()).toContain('Shopping');
    expect(element.text()).toContain('150');
    expect(element.text()).toContain('Restaurant B');
    expect(element.text()).toContain('Food & Dining');
    expect(element.text()).toContain('75');
  });

  it('should not render detail sections when detail is null', function() {
    scope.card = {
      cardName: 'Test Card',
      cardNumber: '**** 5678',
      creditLimit: 5000,
      currentBalance: 2000,
      availableCredit: 3000,
      utilizationPercentage: '40.00'
    };
    scope.detail = null;

    element = $compile('<card-detail card="card" detail="detail"></card-detail>')(scope);
    scope.$digest();

    expect(element.text()).not.toContain('Spending Breakdown');
    expect(element.text()).not.toContain('Recent Transactions');
  });

  it('should not render when card is null', function() {
    scope.card = null;
    scope.detail = null;

    element = $compile('<card-detail card="card" detail="detail"></card-detail>')(scope);
    scope.$digest();

    expect(element.find('.card').length).toBe(0);
  });

  it('should update when card data changes', function() {
    scope.card = {
      cardName: 'Card 1',
      cardNumber: '**** 1111',
      creditLimit: 5000,
      currentBalance: 1000,
      availableCredit: 4000,
      utilizationPercentage: '20.00'
    };
    scope.detail = null;

    element = $compile('<card-detail card="card" detail="detail"></card-detail>')(scope);
    scope.$digest();

    expect(element.text()).toContain('Card 1');

    scope.card.cardName = 'Card 2';
    scope.$digest();

    expect(element.text()).toContain('Card 2');
  });
});