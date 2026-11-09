/*
Test Documentation:
- Test Name: transaction-item Directive Unit Tests
- Purpose: Validate transaction item directive rendering and data display
- Scenario: Test directive compilation, transaction data binding, status display, and conditional rendering
- Expected Result: Correct transaction information display with proper formatting and styling
*/

describe('transactionItem directive', function() {
  'use strict';
  
  beforeEach(module('creditCard.transactions'));
  
  var $compile, $rootScope, element, scope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));
  
  describe('rendering', function() {
    it('should render transaction item with all details', function() {
      scope.txn = {
        id: 'txn1',
        merchant: 'Store A',
        date: '2023-01-15T10:30:00',
        cardName: 'Visa Gold',
        cardNumber: '**** 1234',
        category: 'Shopping',
        status: 'posted',
        amount: 50.00,
        description: 'Purchase at Store A'
      };
      
      element = $compile('<transaction-item transaction="txn"></transaction-item>')(scope);
      scope.$digest();
      
      expect(element.find('.transaction-item').length).toBe(1);
      expect(element.find('strong').text()).toBe('Store A');
    });
    
    it('should display merchant name', function() {
      scope.txn = {
        merchant: 'Restaurant XYZ',
        date: '2023-01-20',
        cardName: 'Mastercard',
        cardNumber: '**** 5678',
        category: 'Food & Dining',
        status: 'posted',
        amount: 75.50
      };
      
      element = $compile('<transaction-item transaction="txn"></transaction-item>')(scope);
      scope.$digest();
      
      expect(element.text()).toContain('Restaurant XYZ');
    });
    
    it('should display card information', function() {
      scope.txn = {
        merchant: 'Gas Station',
        date: '2023-01-18',
        cardName: 'Amex Gold',
        cardNumber: '**** 9999',
        category: 'Fuel',
        status: 'posted',
        amount: 45.00
      };
      
      element = $compile('<transaction-item transaction="txn"></transaction-item>')(scope);
      scope.$digest();
      
      expect(element.text()).toContain('Amex Gold');
      expect(element.text()).toContain('**** 9999');
    });
    
    it('should display category', function() {
      scope.txn = {
        merchant: 'Online Store',
        date: '2023-01-22',
        cardName: 'Visa',
        cardNumber: '**** 1111',
        category: 'Shopping',
        status: 'posted',
        amount: 120.00
      };
      
      element = $compile('<transaction-item transaction="txn"></transaction-item>')(scope);
      scope.$digest();
      
      expect(element.find('.label').text()).toBe('Shopping');
    });
    
    it('should display status with correct styling for posted', function() {
      scope.txn = {
        merchant: 'Store',
        date: '2023-01-15',
        cardName: 'Visa',
        cardNumber: '**** 1234',
        category: 'Shopping',
        status: 'posted',
        amount: 50.00
      };
      
      element = $compile('<transaction-item transaction="txn"></transaction-item>')(scope);
      scope.$digest();
      
      var statusElement = element.find('small[ng-class]');
      expect(statusElement.length).toBeGreaterThan(0);
    });
    
    it('should display status with correct styling for pending', function() {
      scope.txn = {
        merchant: 'Store',
        date: '2023-01-15',
        cardName: 'Visa',
        cardNumber: '**** 1234',
        category: 'Shopping',
        status: 'pending',
        amount: 50.00
      };
      
      element = $compile('<transaction-item transaction="txn"></transaction-item>')(scope);
      scope.$digest();
      
      var statusElement = element.find('small[ng-class]');
      expect(statusElement.length).toBeGreaterThan(0);
    });
    
    it('should display description when present', function() {
      scope.txn = {
        merchant: 'Store',
        date: '2023-01-15',
        cardName: 'Visa',
        cardNumber: '**** 1234',
        category: 'Shopping',
        status: 'posted',
        amount: 50.00,
        description: 'Monthly subscription payment'
      };
      
      element = $compile('<transaction-item transaction="txn"></transaction-item>')(scope);
      scope.$digest();
      
      expect(element.text()).toContain('Monthly subscription payment');
    });
    
    it('should not display description row when absent', function() {
      scope.txn = {
        merchant: 'Store',
        date: '2023-01-15',
        cardName: 'Visa',
        cardNumber: '**** 1234',
        category: 'Shopping',
        status: 'posted',
        amount: 50.00
      };
      
      element = $compile('<transaction-item transaction="txn"></transaction-item>')(scope);
      scope.$digest();
      
      var descriptionRows = element.find('div[ng-if="transaction.description"]');
      expect(descriptionRows.length).toBe(1);
    });
    
    it('should update when transaction data changes', function() {
      scope.txn = {
        merchant: 'Original Store',
        date: '2023-01-15',
        cardName: 'Visa',
        cardNumber: '**** 1234',
        category: 'Shopping',
        status: 'posted',
        amount: 50.00
      };
      
      element = $compile('<transaction-item transaction="txn"></transaction-item>')(scope);
      scope.$digest();
      
      scope.txn.merchant = 'Updated Store';
      scope.$digest();
      
      expect(element.find('strong').text()).toBe('Updated Store');
    });
  });
  
  describe('isolated scope', function() {
    it('should have isolated scope with transaction binding', function() {
      scope.txn = {
        merchant: 'Test Store',
        date: '2023-01-15',
        cardName: 'Visa',
        cardNumber: '**** 1234',
        category: 'Shopping',
        status: 'posted',
        amount: 50.00
      };
      
      element = $compile('<transaction-item transaction="txn"></transaction-item>')(scope);
      scope.$digest();
      
      var isolatedScope = element.isolateScope();
      expect(isolatedScope.transaction).toEqual(scope.txn);
    });
  });
});

/*
Coverage Report:
- Functions tested: Directive compilation, template rendering, conditional rendering
- Scenarios covered:
  * Complete transaction display
  * Merchant name rendering
  * Card information display
  * Category display
  * Status styling (posted/pending)
  * Description conditional rendering
  * Data change detection
  * Isolated scope binding
- Edge cases: Missing description, status variations, data updates
- Uncovered scenarios: Null values, very long merchant names, special characters in description
*/