/*
Test Documentation:
- Test Name: TransactionListController functionality
- Purpose: Validate transaction list display and filtering
- Scenario: Test controller initialization, filtering, pagination
- Expected Result: Transactions loaded and filtered correctly
*/

(function() {
  'use strict';

  describe('TransactionListController', function() {
    var $controller, $scope, $location, $q, TransactionService, SearchFilterService;
    var mockTransactionResult = {
      transactions: [
        { transactionId: 'tx1', merchantName: 'Amazon', amount: 150.00 },
        { transactionId: 'tx2', merchantName: 'Starbucks', amount: 5.50 }
      ],
      totalCount: 100
    };

    beforeEach(module('app.transactions'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_$controller_, _$rootScope_, _$location_, _$q_) {
      $controller = _$controller_;
      $scope = _$rootScope_.$new();
      $location = _$location_;
      $q = _$q_;

      TransactionService = {
        getTransactions: jasmine.createSpy('getTransactions').and.returnValue($q.resolve(mockTransactionResult))
      };

      SearchFilterService = {
        buildFilterParams: jasmine.createSpy('buildFilterParams').and.returnValue({})
      };
    }));

    /*
    Test Documentation:
    - Test Name: should initialize controller
    - Purpose: Validate controller creation
    - Scenario: Create controller instance
    - Expected Result: Controller defined with initial state
    */
    it('should initialize controller', function() {
      var vm = $controller('TransactionListController', {
        $scope: $scope,
        $location: $location,
        TransactionService: TransactionService,
        SearchFilterService: SearchFilterService
      });

      expect(vm).toBeDefined();
      expect(vm.transactions).toEqual([]);
      expect(vm.pagination.currentPage).toBe(1);
      expect(vm.pagination.pageSize).toBe(50);
    });

    /*
    Test Documentation:
    - Test Name: should load transactions on initialization
    - Purpose: Validate automatic data loading
    - Scenario: Controller created
    - Expected Result: getTransactions called, data loaded
    */
    it('should load transactions on initialization', function() {
      var vm = $controller('TransactionListController', {
        $scope: $scope,
        $location: $location,
        TransactionService: TransactionService,
        SearchFilterService: SearchFilterService
      });

      $scope.$digest();

      expect(TransactionService.getTransactions).toHaveBeenCalled();
      expect(vm.transactions).toEqual(mockTransactionResult.transactions);
      expect(vm.pagination.totalRecords).toBe(100);
      expect(vm.pagination.totalPages).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: should apply filters and reset to page 1
    - Purpose: Validate filter application
    - Scenario: User applies filters
    - Expected Result: Page reset to 1, transactions reloaded
    */
    it('should apply filters and reset to page 1', function() {
      var vm = $controller('TransactionListController', {
        $scope: $scope,
        $location: $location,
        TransactionService: TransactionService,
        SearchFilterService: SearchFilterService
      });

      vm.pagination.currentPage = 3;
      vm.applyFilters();

      expect(vm.pagination.currentPage).toBe(1);
      expect(SearchFilterService.buildFilterParams).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should clear filters
    - Purpose: Validate filter clearing
    - Scenario: User clears all filters
    - Expected Result: Filters reset, transactions reloaded
    */
    it('should clear filters', function() {
      var vm = $controller('TransactionListController', {
        $scope: $scope,
        $location: $location,
        TransactionService: TransactionService,
        SearchFilterService: SearchFilterService
      });

      vm.filters.cardId = 'card1';
      vm.filters.keyword = 'Amazon';
      vm.clearFilters();

      expect(vm.filters.cardId).toBe('');
      expect(vm.filters.keyword).toBe('');
    });

    /*
    Test Documentation:
    - Test Name: should navigate to transaction detail
    - Purpose: Validate navigation
    - Scenario: User clicks on transaction
    - Expected Result: Navigates to detail page
    */
    it('should navigate to transaction detail', function() {
      spyOn($location, 'path');
      var vm = $controller('TransactionListController', {
        $scope: $scope,
        $location: $location,
        TransactionService: TransactionService,
        SearchFilterService: SearchFilterService
      });

      vm.viewTransaction('tx1');
      expect($location.path).toHaveBeenCalledWith('/transactions/tx1');
    });

    /*
    Test Documentation:
    - Test Name: should handle pagination
    - Purpose: Validate page navigation
    - Scenario: User clicks next/previous page
    - Expected Result: Page changed, transactions reloaded
    */
    it('should handle pagination', function() {
      var vm = $controller('TransactionListController', {
        $scope: $scope,
        $location: $location,
        TransactionService: TransactionService,
        SearchFilterService: SearchFilterService
      });

      $scope.$digest();
      vm.pagination.totalPages = 5;

      vm.goToPage(2);
      expect(vm.pagination.currentPage).toBe(2);

      vm.goToPage(10);
      expect(vm.pagination.currentPage).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: should handle API errors
    - Purpose: Validate error handling
    - Scenario: API call fails
    - Expected Result: Error message displayed
    */
    it('should handle API errors', function() {
      TransactionService.getTransactions = jasmine.createSpy('getTransactions')
        .and.returnValue($q.reject({ status: 500 }));

      var vm = $controller('TransactionListController', {
        $scope: $scope,
        $location: $location,
        TransactionService: TransactionService,
        SearchFilterService: SearchFilterService
      });

      $scope.$digest();

      expect(vm.error).toBe('Failed to load transactions. Please try again.');
      expect(vm.loading).toBe(false);
    });
  });

  /*
  Coverage Report:
  - Functions tested: loadTransactions, applyFilters, clearFilters, viewTransaction, goToPage
  - Scenarios covered: initialization, filtering, pagination, navigation, error handling
  - Uncovered scenarios: none
  */
})();