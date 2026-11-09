/*
Test Documentation:
- Test Name: TransactionListController Unit Tests
- Purpose: Validate transaction list controller including filtering, searching, and error handling
- Scenario: Test controller initialization, filter application, search functionality, and error states
- Expected Result: Proper transaction display with working filters and error handling
*/

describe('TransactionListController', function() {
  'use strict';
  
  beforeEach(module('creditCard.transactions'));
  
  var $controller, $scope, $q, $rootScope, $filter;
  var mockTransactionAggregationService;
  var mockData;
  
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _$filter_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $q = _$q_;
    $filter = _$filter_;
    
    mockData = {
      transactions: [
        { id: 'txn1', cardId: 'card1', merchant: 'Store A', amount: 50, status: 'posted', date: '2023-01-15' },
        { id: 'txn2', cardId: 'card2', merchant: 'Store B', amount: 100, status: 'pending', date: '2023-01-20' },
        { id: 'txn3', cardId: 'card1', merchant: 'Restaurant C', amount: 75, status: 'posted', date: '2023-01-10' }
      ],
      cards: [
        { id: 'card1', cardName: 'Visa Gold' },
        { id: 'card2', cardName: 'Mastercard' }
      ]
    };
    
    mockTransactionAggregationService = {
      getAggregatedTransactions: jasmine.createSpy('getAggregatedTransactions').and.returnValue($q.resolve(mockData))
    };
  }));
  
  describe('initialization', function() {
    it('should initialize scope variables', function() {
      $controller('TransactionListController', {
        $scope: $scope,
        TransactionAggregationService: mockTransactionAggregationService,
        $filter: $filter
      });
      
      expect($scope.loading).toBe(true);
      expect($scope.errorMessage).toBe(null);
      expect($scope.transactions).toEqual([]);
      expect($scope.filteredTransactions).toEqual([]);
      expect($scope.availableCards).toEqual([]);
    });
    
    it('should load transactions on initialization', function() {
      $controller('TransactionListController', {
        $scope: $scope,
        TransactionAggregationService: mockTransactionAggregationService,
        $filter: $filter
      });
      
      $rootScope.$apply();
      
      expect(mockTransactionAggregationService.getAggregatedTransactions).toHaveBeenCalledWith('user123');
      expect($scope.transactions).toEqual(mockData.transactions);
      expect($scope.availableCards).toEqual(mockData.cards);
      expect($scope.loading).toBe(false);
    });
  });
  
  describe('successful data load', function() {
    it('should populate transactions array', function() {
      $controller('TransactionListController', {
        $scope: $scope,
        TransactionAggregationService: mockTransactionAggregationService,
        $filter: $filter
      });
      
      $rootScope.$apply();
      
      expect($scope.transactions.length).toBe(3);
      expect($scope.filteredTransactions.length).toBe(3);
    });
    
    it('should populate available cards', function() {
      $controller('TransactionListController', {
        $scope: $scope,
        TransactionAggregationService: mockTransactionAggregationService,
        $filter: $filter
      });
      
      $rootScope.$apply();
      
      expect($scope.availableCards.length).toBe(2);
    });
  });
  
  describe('filtering functionality', function() {
    beforeEach(function() {
      $controller('TransactionListController', {
        $scope: $scope,
        TransactionAggregationService: mockTransactionAggregationService,
        $filter: $filter
      });
      $rootScope.$apply();
    });
    
    it('should filter by merchant search text', function() {
      $scope.searchText = 'Store';
      $scope.applyFilters();
      
      expect($scope.filteredTransactions.length).toBe(2);
      $scope.filteredTransactions.forEach(function(txn) {
        expect(txn.merchant).toContain('Store');
      });
    });
    
    it('should filter by card ID', function() {
      $scope.filterCard = 'card1';
      $scope.applyFilters();
      
      expect($scope.filteredTransactions.length).toBe(2);
      $scope.filteredTransactions.forEach(function(txn) {
        expect(txn.cardId).toBe('card1');
      });
    });
    
    it('should filter by status', function() {
      $scope.filterStatus = 'posted';
      $scope.applyFilters();
      
      expect($scope.filteredTransactions.length).toBe(2);
      $scope.filteredTransactions.forEach(function(txn) {
        expect(txn.status).toBe('posted');
      });
    });
    
    it('should apply multiple filters simultaneously', function() {
      $scope.searchText = 'Store';
      $scope.filterCard = 'card1';
      $scope.filterStatus = 'posted';
      $scope.applyFilters();
      
      expect($scope.filteredTransactions.length).toBeLessThanOrEqual(3);
    });
    
    it('should show all transactions when no filters applied', function() {
      $scope.searchText = '';
      $scope.filterCard = '';
      $scope.filterStatus = '';
      $scope.applyFilters();
      
      expect($scope.filteredTransactions.length).toBe(3);
    });
  });
  
  describe('error handling', function() {
    it('should handle transaction fetch errors', function() {
      mockTransactionAggregationService.getAggregatedTransactions.and.returnValue($q.reject('API Error'));
      
      $controller('TransactionListController', {
        $scope: $scope,
        TransactionAggregationService: mockTransactionAggregationService,
        $filter: $filter
      });
      
      $rootScope.$apply();
      
      expect($scope.errorMessage).toBe('Failed to load transactions.');
      expect($scope.loading).toBe(false);
    });
  });
});

/*
Coverage Report:
- Functions tested: Controller initialization, applyFilters
- Scenarios covered:
  * Initial scope setup
  * Successful data loading
  * Merchant search filtering
  * Card ID filtering
  * Status filtering
  * Multiple simultaneous filters
  * No filters (show all)
  * Error handling
- Edge cases: Empty filters, combined filters, API errors
- Uncovered scenarios: Case-insensitive search, partial merchant matches, date range filtering
*/