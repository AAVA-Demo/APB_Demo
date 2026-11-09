/*
Test Documentation:
- Test Name: TransactionDetailController functionality
- Purpose: Validate transaction detail display
- Scenario: Test controller initialization and navigation
- Expected Result: Transaction details loaded correctly
*/

(function() {
  'use strict';

  describe('TransactionDetailController', function() {
    var $controller, $scope, $routeParams, $location, $q, TransactionService;
    var mockTransaction = {
      transactionId: 'tx1',
      merchantName: 'Amazon',
      amount: 150.00,
      category: 'Shopping',
      status: 'Completed'
    };

    beforeEach(module('app.transactions'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_$controller_, _$rootScope_, _$location_, _$q_) {
      $controller = _$controller_;
      $scope = _$rootScope_.$new();
      $location = _$location_;
      $q = _$q_;

      $routeParams = { transactionId: 'tx1' };

      TransactionService = {
        getTransactionById: jasmine.createSpy('getTransactionById').and.returnValue($q.resolve(mockTransaction))
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
      var vm = $controller('TransactionDetailController', {
        $scope: $scope,
        $routeParams: $routeParams,
        $location: $location,
        TransactionService: TransactionService
      });

      expect(vm).toBeDefined();
      expect(vm.transaction).toBeNull();
      expect(vm.loading).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: should load transaction details on initialization
    - Purpose: Validate automatic data loading
    - Scenario: Controller created with transactionId
    - Expected Result: getTransactionById called, data loaded
    */
    it('should load transaction details on initialization', function() {
      var vm = $controller('TransactionDetailController', {
        $scope: $scope,
        $routeParams: $routeParams,
        $location: $location,
        TransactionService: TransactionService
      });

      $scope.$digest();

      expect(TransactionService.getTransactionById).toHaveBeenCalledWith('tx1');
      expect(vm.transaction).toEqual(mockTransaction);
      expect(vm.loading).toBe(false);
    });

    /*
    Test Documentation:
    - Test Name: should handle API errors
    - Purpose: Validate error handling
    - Scenario: API call fails
    - Expected Result: Error message displayed
    */
    it('should handle API errors', function() {
      TransactionService.getTransactionById = jasmine.createSpy('getTransactionById')
        .and.returnValue($q.reject({ status: 404 }));

      var vm = $controller('TransactionDetailController', {
        $scope: $scope,
        $routeParams: $routeParams,
        $location: $location,
        TransactionService: TransactionService
      });

      $scope.$digest();

      expect(vm.error).toBe('Failed to load transaction details. Please try again.');
      expect(vm.loading).toBe(false);
    });

    /*
    Test Documentation:
    - Test Name: should navigate back to transaction list
    - Purpose: Validate back navigation
    - Scenario: User clicks back button
    - Expected Result: Navigates to /transactions
    */
    it('should navigate back to transaction list', function() {
      spyOn($location, 'path');
      var vm = $controller('TransactionDetailController', {
        $scope: $scope,
        $routeParams: $routeParams,
        $location: $location,
        TransactionService: TransactionService
      });

      vm.goBack();
      expect($location.path).toHaveBeenCalledWith('/transactions');
    });
  });

  /*
  Coverage Report:
  - Functions tested: loadTransaction, goBack
  - Scenarios covered: initialization, data loading, error handling, navigation
  - Uncovered scenarios: none
  */
})();