/*
Test Documentation:
- Test Name: TransactionController - initialization
- Purpose: Validates controller initializes with default state
- Scenario: Controller is instantiated
- Expected Result: Default values set and loadTransactions called
*/
/*
Test Documentation:
- Test Name: TransactionController - loadTransactions success
- Purpose: Validates successful transaction loading
- Scenario: TransactionService returns transactions
- Expected Result: vm.transactions populated, pagination updated
*/
/*
Test Documentation:
- Test Name: TransactionController - applyFilters
- Purpose: Validates filter application resets pagination and reloads data
- Scenario: User applies new filters
- Expected Result: Filters saved, cache cleared, data reloaded from page 1
*/
/*
Test Documentation:
- Test Name: TransactionController - resetFilters
- Purpose: Validates filter reset functionality
- Scenario: User resets filters
- Expected Result: Filters reset to defaults, data reloaded
*/
/*
Test Documentation:
- Test Name: TransactionController - loadMore
- Purpose: Validates infinite scroll/load more functionality
- Scenario: User scrolls to bottom and triggers loadMore
- Expected Result: Next page loaded and appended to existing transactions
*/
/*
Test Documentation:
- Test Name: TransactionController - error handling
- Purpose: Validates error handling during data load
- Scenario: TransactionService rejects with error
- Expected Result: vm.error set, loading false
*/
/*
Coverage Report:
- Functions tested: initialization, loadTransactions, applyFilters, resetFilters, loadMore
- Scenarios covered: success, error, pagination, filtering, infinite scroll
- Uncovered scenarios: concurrent load requests, race conditions
*/

(function() {
  'use strict';

  describe('TransactionController', function() {
    var $controller, $scope, $q, TransactionService, FilterService, controller;

    beforeEach(module('app.transactions'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _TransactionService_, _FilterService_) {
      $controller = _$controller_;
      $scope = _$rootScope_.$new();
      $q = _$q_;
      TransactionService = _TransactionService_;
      FilterService = _FilterService_;
    }));

    function createController() {
      return $controller('TransactionController', {
        $scope: $scope,
        TransactionService: TransactionService,
        FilterService: FilterService
      });
    }

    describe('initialization', function() {
      it('should initialize with default values', function() {
        spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve({ transactions: [], total: 0 }));
        spyOn(FilterService, 'getFilters').and.returnValue({
          startDate: null,
          endDate: null,
          cardIds: [],
          minAmount: null,
          maxAmount: null,
          searchTerm: '',
          sortBy: 'date',
          sortOrder: 'desc'
        });

        controller = createController();

        expect(controller.transactions).toEqual([]);
        expect(controller.pagination.currentPage).toBe(1);
        expect(controller.pagination.pageSize).toBe(20);
        expect(controller.loading).toBe(false);
        expect(controller.error).toBe(null);
      });

      it('should load transactions on initialization', function() {
        spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve({ transactions: [], total: 0 }));
        spyOn(FilterService, 'getFilters').and.returnValue({});

        controller = createController();
        $scope.$apply();

        expect(TransactionService.getTransactions).toHaveBeenCalled();
      });
    });

    describe('loadTransactions', function() {
      it('should load transactions successfully', function() {
        var mockResponse = {
          transactions: [
            { id: 1, merchant: 'Store A', amount: 100 },
            { id: 2, merchant: 'Store B', amount: 200 }
          ],
          total: 2
        };

        spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockResponse));
        spyOn(FilterService, 'getFilters').and.returnValue({});

        controller = createController();
        $scope.$apply();

        expect(controller.transactions.length).toBe(2);
        expect(controller.pagination.totalRecords).toBe(2);
        expect(controller.pagination.hasMore).toBe(false);
        expect(controller.loading).toBe(false);
      });

      it('should handle errors when loading transactions', function() {
        spyOn(console, 'error');
        spyOn(TransactionService, 'getTransactions').and.returnValue($q.reject({ message: 'Network error' }));
        spyOn(FilterService, 'getFilters').and.returnValue({});

        controller = createController();
        $scope.$apply();

        expect(controller.error).toBe('Failed to load transactions');
        expect(controller.loading).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });

      it('should set hasMore to true when more transactions available', function() {
        var mockResponse = {
          transactions: new Array(20).fill({ id: 1, merchant: 'Test', amount: 100 }),
          total: 50
        };

        spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockResponse));
        spyOn(FilterService, 'getFilters').and.returnValue({});

        controller = createController();
        $scope.$apply();

        expect(controller.pagination.hasMore).toBe(true);
      });
    });

    describe('applyFilters', function() {
      it('should apply filters and reload transactions', function() {
        spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve({ transactions: [], total: 0 }));
        spyOn(TransactionService, 'clearCache');
        spyOn(FilterService, 'getFilters').and.returnValue({});
        spyOn(FilterService, 'setFilters');

        controller = createController();
        $scope.$apply();

        controller.filters = { searchTerm: 'coffee' };
        controller.applyFilters();
        $scope.$apply();

        expect(FilterService.setFilters).toHaveBeenCalledWith({ searchTerm: 'coffee' });
        expect(TransactionService.clearCache).toHaveBeenCalled();
        expect(controller.pagination.currentPage).toBe(1);
        expect(controller.transactions).toEqual([]);
      });
    });

    describe('resetFilters', function() {
      it('should reset filters and reload transactions', function() {
        spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve({ transactions: [], total: 0 }));
        spyOn(TransactionService, 'clearCache');
        spyOn(FilterService, 'getFilters').and.returnValue({});
        spyOn(FilterService, 'resetFilters');

        controller = createController();
        $scope.$apply();

        controller.resetFilters();
        $scope.$apply();

        expect(FilterService.resetFilters).toHaveBeenCalled();
        expect(TransactionService.clearCache).toHaveBeenCalled();
        expect(controller.pagination.currentPage).toBe(1);
      });
    });

    describe('loadMore', function() {
      it('should load next page and append transactions', function() {
        var page1Response = {
          transactions: [{ id: 1, merchant: 'Store A', amount: 100 }],
          total: 2
        };
        var page2Response = {
          transactions: [{ id: 2, merchant: 'Store B', amount: 200 }],
          total: 2
        };

        spyOn(FilterService, 'getFilters').and.returnValue({});
        spyOn(TransactionService, 'getTransactions').and.returnValues(
          $q.resolve(page1Response),
          $q.resolve(page2Response)
        );

        controller = createController();
        $scope.$apply();

        expect(controller.transactions.length).toBe(1);

        controller.loadMore();
        $scope.$apply();

        expect(controller.pagination.currentPage).toBe(2);
        expect(controller.transactions.length).toBe(2);
      });

      it('should not load more when already loading', function() {
        spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve({ transactions: [], total: 0 }));
        spyOn(FilterService, 'getFilters').and.returnValue({});

        controller = createController();
        controller.loading = true;
        controller.loadMore();

        expect(TransactionService.getTransactions.calls.count()).toBe(1);
      });

      it('should not load more when hasMore is false', function() {
        spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve({ transactions: [], total: 0 }));
        spyOn(FilterService, 'getFilters').and.returnValue({});

        controller = createController();
        $scope.$apply();

        controller.pagination.hasMore = false;
        controller.loadMore();

        expect(TransactionService.getTransactions.calls.count()).toBe(1);
      });
    });
  });
})();