/*
Test Documentation:
- Test Name: transactionList directive - rendering
- Purpose: Validates directive renders transaction list
- Scenario: Directive compiled with transactions array
- Expected Result: All transactions rendered with correct structure
*/
/*
Test Documentation:
- Test Name: transactionList directive - scroll event
- Purpose: Validates infinite scroll triggers onLoadMore callback
- Scenario: User scrolls to bottom of list
- Expected Result: onLoadMore callback is invoked
*/
/*
Test Documentation:
- Test Name: transactionList directive - empty transactions
- Purpose: Validates handling of empty transaction list
- Scenario: Directive receives empty array
- Expected Result: No transaction items rendered
*/
/*
Test Documentation:
- Test Name: transactionList directive - cleanup
- Purpose: Validates event listener cleanup on destroy
- Scenario: Directive scope is destroyed
- Expected Result: Scroll event listener removed
*/
/*
Coverage Report:
- Functions tested: link function, scroll handler, cleanup
- Scenarios covered: rendering, scroll events, empty data, cleanup
- Uncovered scenarios: rapid scroll events, touch events
*/

(function() {
  'use strict';

  describe('transactionList directive', function() {
    var $compile, $rootScope, $timeout, element, scope;

    beforeEach(module('app.transactions'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
      scope = $rootScope.$new();
    }));

    function compileDirective(transactions) {
      scope.transactions = transactions;
      scope.loadMoreCallback = jasmine.createSpy('loadMoreCallback');

      var html = '<transaction-list transactions="transactions" on-load-more="loadMoreCallback()"></transaction-list>';
      element = $compile(html)(scope);
      scope.$digest();
      return element;
    }

    describe('rendering', function() {
      it('should render transaction list with all transactions', function() {
        var transactions = [
          { id: 1, date: '2024-01-15', merchant: 'Store A', category: 'Shopping', amount: 100, cardName: 'Card 1', status: 'completed' },
          { id: 2, date: '2024-01-16', merchant: 'Store B', category: 'Food', amount: 50, cardName: 'Card 2', status: 'pending' }
        ];

        element = compileDirective(transactions);

        var transactionItems = element.find('.transaction-item');
        expect(transactionItems.length).toBe(2);
      });

      it('should display transaction details correctly', function() {
        var transactions = [
          { id: 1, date: '2024-01-15', merchant: 'Test Store', category: 'Shopping', amount: 123.45, cardName: 'Test Card', status: 'completed' }
        ];

        element = compileDirective(transactions);

        var merchantElement = element.find('.txn-merchant');
        expect(merchantElement.text()).toContain('Test Store');
      });

      it('should render empty list when no transactions provided', function() {
        element = compileDirective([]);
        var transactionItems = element.find('.transaction-item');
        expect(transactionItems.length).toBe(0);
      });
    });

    describe('scroll behavior', function() {
      it('should call onLoadMore when scrolled to bottom', function() {
        var transactions = new Array(20).fill({
          id: 1,
          date: '2024-01-15',
          merchant: 'Store',
          category: 'Shopping',
          amount: 100,
          cardName: 'Card',
          status: 'completed'
        });

        element = compileDirective(transactions);
        var scrollContainer = element[0];

        Object.defineProperty(scrollContainer, 'scrollTop', { value: 500, writable: true });
        Object.defineProperty(scrollContainer, 'clientHeight', { value: 300, writable: true });
        Object.defineProperty(scrollContainer, 'scrollHeight', { value: 850, writable: true });

        element.triggerHandler('scroll');
        scope.$apply();

        expect(scope.loadMoreCallback).toHaveBeenCalled();
      });

      it('should not call onLoadMore when not near bottom', function() {
        var transactions = [{ id: 1, date: '2024-01-15', merchant: 'Store', category: 'Shopping', amount: 100, cardName: 'Card', status: 'completed' }];

        element = compileDirective(transactions);
        var scrollContainer = element[0];

        Object.defineProperty(scrollContainer, 'scrollTop', { value: 100, writable: true });
        Object.defineProperty(scrollContainer, 'clientHeight', { value: 300, writable: true });
        Object.defineProperty(scrollContainer, 'scrollHeight', { value: 1000, writable: true });

        element.triggerHandler('scroll');
        scope.$apply();

        expect(scope.loadMoreCallback).not.toHaveBeenCalled();
      });
    });

    describe('cleanup', function() {
      it('should remove scroll event listener on destroy', function() {
        var transactions = [{ id: 1, date: '2024-01-15', merchant: 'Store', category: 'Shopping', amount: 100, cardName: 'Card', status: 'completed' }];
        element = compileDirective(transactions);

        spyOn(element, 'off');
        scope.$destroy();

        expect(element.off).toHaveBeenCalledWith('scroll');
      });
    });
  });
})();