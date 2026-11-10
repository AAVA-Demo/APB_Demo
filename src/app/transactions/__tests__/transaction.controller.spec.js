/*
Test Documentation:
- Test Name: TransactionController - initialization
- Purpose: Validates controller initialization
- Scenario: Controller is instantiated
- Expected Result: Default state is set
*/
/*
Test Documentation:
- Test Name: TransactionController - loadTransactions success
- Purpose: Validates successful transaction loading
- Scenario: Service returns valid data
- Expected Result: Transactions are populated
*/
/*
Test Documentation:
- Test Name: TransactionController - search functionality
- Purpose: Validates search with debounce
- Scenario: User types in search box
- Expected Result: Search is triggered after delay
*/
/*
Test Documentation:
- Test Name: TransactionController - filter functionality
- Purpose: Validates filter application
- Scenario: User changes filter
- Expected Result: Transactions are reloaded
*/
/*
Test Documentation:
- Test Name: TransactionController - pagination
- Purpose: Validates pagination functionality
- Scenario: User changes page
- Expected Result: New page data is loaded
*/
/*
Coverage Report:
- Functions tested: loadTransactions, onSearchChange, onFilterChange, changePage, openTransactionDetail
- Scenarios covered: initialization, success, error, search, filter, pagination, modal
- Uncovered scenarios: none
*/

describe('TransactionController', function() {
  'use strict';
  
  beforeEach(module('transactionModule'));
  
  var $controller, $scope, $q, $timeout, $uibModal, TransactionService, PaginationFactory;
  var mockTransactionData = {
    transactions: [
      { transactionId: '1', cardId: '1', merchant: 'Amazon', amount: 2500, category: 'Shopping' },
      { transactionId: '2', cardId: '1', merchant: 'Swiggy', amount: 450, category: 'Food & Dining' }
    ],
    totalCount: 10,
    page: 1,
    pageSize: 20
  };
  var mockPagination = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 20,
    totalCount: 10,
    hasNext: false,
    hasPrev: false
  };
  
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _$timeout_, _$uibModal_, _TransactionService_, _PaginationFactory_) {
    $controller = _$controller_;
    $scope = _$rootScope_.$new();
    $q = _$q_;
    $timeout = _$timeout_;
    $uibModal = _$uibModal_;
    TransactionService = _TransactionService_;
    PaginationFactory = _PaginationFactory_;
  }));
  
  describe('initialization', function() {
    it('should initialize with default state', function() {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
      spyOn(PaginationFactory, 'calculatePagination').and.returnValue(mockPagination);
      
      var vm = $controller('TransactionController', { $scope: $scope, $uibModal: $uibModal, $timeout: $timeout, TransactionService: TransactionService, PaginationFactory: PaginationFactory });
      
      expect(vm.transactions).toEqual([]);
      expect(vm.loading).toBe(true);
      expect(vm.errorMessage).toBe('');
      expect(vm.currentPage).toBe(1);
    });
  });
  
  describe('loadTransactions', function() {
    it('should load transactions successfully', function() {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
      spyOn(PaginationFactory, 'calculatePagination').and.returnValue(mockPagination);
      
      var vm = $controller('TransactionController', { $scope: $scope, $uibModal: $uibModal, $timeout: $timeout, TransactionService: TransactionService, PaginationFactory: PaginationFactory });
      $scope.$digest();
      
      expect(vm.transactions.length).toBe(2);
      expect(vm.pagination).toEqual(mockPagination);
      expect(vm.loading).toBe(false);
    });
    
    it('should handle errors and load mock data', function() {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.reject('API Error'));
      spyOn(TransactionService, 'getMockTransactions').and.returnValue($q.resolve(mockTransactionData));
      spyOn(PaginationFactory, 'calculatePagination').and.returnValue(mockPagination);
      
      var vm = $controller('TransactionController', { $scope: $scope, $uibModal: $uibModal, $timeout: $timeout, TransactionService: TransactionService, PaginationFactory: PaginationFactory });
      $scope.$digest();
      
      expect(vm.errorMessage).toBe('Failed to load transactions. Showing cached data.');
      expect(vm.transactions.length).toBe(2);
    });
  });
  
  describe('onSearchChange', function() {
    it('should debounce search and reload transactions', function() {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
      spyOn(PaginationFactory, 'calculatePagination').and.returnValue(mockPagination);
      
      var vm = $controller('TransactionController', { $scope: $scope, $uibModal: $uibModal, $timeout: $timeout, TransactionService: TransactionService, PaginationFactory: PaginationFactory });
      $scope.$digest();
      
      TransactionService.getTransactions.calls.reset();
      vm.filters.searchTerm = 'Amazon';
      vm.onSearchChange();
      
      $timeout.flush(300);
      
      expect(TransactionService.getTransactions).toHaveBeenCalled();
      expect(vm.currentPage).toBe(1);
    });
  });
  
  describe('onFilterChange', function() {
    it('should reload transactions when filter changes', function() {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
      spyOn(PaginationFactory, 'calculatePagination').and.returnValue(mockPagination);
      
      var vm = $controller('TransactionController', { $scope: $scope, $uibModal: $uibModal, $timeout: $timeout, TransactionService: TransactionService, PaginationFactory: PaginationFactory });
      $scope.$digest();
      
      TransactionService.getTransactions.calls.reset();
      vm.filters.cardId = '1';
      vm.onFilterChange();
      
      expect(TransactionService.getTransactions).toHaveBeenCalled();
      expect(vm.currentPage).toBe(1);
    });
  });
  
  describe('changePage', function() {
    it('should load transactions for new page', function() {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
      spyOn(PaginationFactory, 'calculatePagination').and.returnValue(mockPagination);
      
      var vm = $controller('TransactionController', { $scope: $scope, $uibModal: $uibModal, $timeout: $timeout, TransactionService: TransactionService, PaginationFactory: PaginationFactory });
      $scope.$digest();
      
      TransactionService.getTransactions.calls.reset();
      vm.changePage(2);
      
      expect(vm.currentPage).toBe(2);
      expect(TransactionService.getTransactions).toHaveBeenCalledWith(2, vm.filters);
    });
  });
  
  describe('openTransactionDetail', function() {
    it('should open modal with transaction details', function() {
      spyOn(TransactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
      spyOn(PaginationFactory, 'calculatePagination').and.returnValue(mockPagination);
      spyOn($uibModal, 'open');
      
      var vm = $controller('TransactionController', { $scope: $scope, $uibModal: $uibModal, $timeout: $timeout, TransactionService: TransactionService, PaginationFactory: PaginationFactory });
      $scope.$digest();
      
      var transaction = mockTransactionData.transactions[0];
      vm.openTransactionDetail(transaction);
      
      expect($uibModal.open).toHaveBeenCalled();
    });
  });
});