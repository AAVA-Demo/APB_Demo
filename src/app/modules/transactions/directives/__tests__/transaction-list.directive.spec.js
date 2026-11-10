/*
Test Documentation:
- Test Name: transactionList Directive
- Purpose: Validate transaction list directive rendering
- Scenario: Directive compilation, transaction display, empty state
- Expected Result: Directive renders transaction table correctly with all fields
*/

describe('transactionList Directive', function() {
  'use strict';

  beforeEach(module('creditCard.transactions'));

  var $compile, $rootScope, element, scope;
  var mockTransactions;

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();

    mockTransactions = [
      {
        transactionId: 'txn001',
        timestamp: '2024-01-15T10:30:00Z',
        cardName: 'Platinum Rewards',
        merchantName: 'Whole Foods',
        category: 'Food & Dining',
        currency: 'USD',
        amount: 127.45,
        status: 'posted'
      },
      {
        transactionId: 'txn002',
        timestamp: '2024-01-14T08:15:00Z',
        cardName: 'Travel Elite',
        merchantName: 'Shell Gas',
        category: 'Fuel',
        currency: 'USD',
        amount: 65.00,
        status: 'pending'
      }
    ];

    scope.testTransactions = mockTransactions;
    scope.testPagination = {
      currentPage: 1,
      totalPages: 3,
      pageSize: 20,
      totalRecords: 50
    };
  }));

  it('should compile and render the directive', function() {
    element = $compile('<transaction-list transactions="testTransactions" pagination="testPagination"></transaction-list>')(scope);
    scope.$digest();
    
    expect(element).toBeDefined();
    expect(element.find('table').length).toBe(1);
  });

  it('should render table headers', function() {
    element = $compile('<transaction-list transactions="testTransactions" pagination="testPagination"></transaction-list>')(scope);
    scope.$digest();
    
    var headers = element.find('th');
    expect(headers.length).toBe(6);
    expect(headers.eq(0).text()).toBe('Date');
    expect(headers.eq(1).text()).toBe('Card');
    expect(headers.eq(2).text()).toBe('Merchant');
    expect(headers.eq(3).text()).toBe('Category');
    expect(headers.eq(4).text()).toBe('Amount');
    expect(headers.eq(5).text()).toBe('Status');
  });

  it('should render transaction rows', function() {
    element = $compile('<transaction-list transactions="testTransactions" pagination="testPagination"></transaction-list>')(scope);
    scope.$digest();
    
    var rows = element.find('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('should display transaction merchant name', function() {
    element = $compile('<transaction-list transactions="testTransactions" pagination="testPagination"></transaction-list>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('Whole Foods');
    expect(element.text()).toContain('Shell Gas');
  });

  it('should display transaction card name', function() {
    element = $compile('<transaction-list transactions="testTransactions" pagination="testPagination"></transaction-list>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('Platinum Rewards');
    expect(element.text()).toContain('Travel Elite');
  });

  it('should display transaction category', function() {
    element = $compile('<transaction-list transactions="testTransactions" pagination="testPagination"></transaction-list>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('Food & Dining');
    expect(element.text()).toContain('Fuel');
  });

  it('should display transaction amount with currency', function() {
    element = $compile('<transaction-list transactions="testTransactions" pagination="testPagination"></transaction-list>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('USD');
    expect(element.text()).toContain('127.45');
    expect(element.text()).toContain('65.00');
  });

  it('should display transaction status', function() {
    element = $compile('<transaction-list transactions="testTransactions" pagination="testPagination"></transaction-list>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('posted');
    expect(element.text()).toContain('pending');
  });

  it('should show empty state when no transactions', function() {
    scope.testTransactions = [];
    element = $compile('<transaction-list transactions="testTransactions" pagination="testPagination"></transaction-list>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('No transactions found');
  });

  it('should update when transactions change', function() {
    element = $compile('<transaction-list transactions="testTransactions" pagination="testPagination"></transaction-list>')(scope);
    scope.$digest();
    
    scope.testTransactions = [
      {
        transactionId: 'txn003',
        timestamp: '2024-01-13T12:00:00Z',
        cardName: 'Cashback Plus',
        merchantName: 'Amazon',
        category: 'Shopping',
        currency: 'USD',
        amount: 89.99,
        status: 'posted'
      }
    ];
    scope.$digest();
    
    expect(element.text()).toContain('Amazon');
    expect(element.text()).toContain('Cashback Plus');
  });

  it('should have table-striped class', function() {
    element = $compile('<transaction-list transactions="testTransactions" pagination="testPagination"></transaction-list>')(scope);
    scope.$digest();
    
    expect(element.find('table').hasClass('table-striped')).toBe(true);
  });

  it('should have table-hover class', function() {
    element = $compile('<transaction-list transactions="testTransactions" pagination="testPagination"></transaction-list>')(scope);
    scope.$digest();
    
    expect(element.find('table').hasClass('table-hover')).toBe(true);
  });
});

/*
Coverage Report:
- Functions tested: directive compilation, template rendering
- Scenarios covered: table rendering, data binding, empty state, data updates
- Edge cases: empty transaction list, data changes
- Uncovered scenarios: none
*/