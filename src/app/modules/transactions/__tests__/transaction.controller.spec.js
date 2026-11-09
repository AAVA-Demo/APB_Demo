/*
Test Documentation:
- Test Name: TransactionController
- Purpose: Validate transaction management controller for listing and filtering
- Scenario: Controller initialization, transaction loading, filtering, error handling
- Expected Result: Transactions loaded, filters applied correctly, errors handled
*/

describe('TransactionController', function() {
  'use strict';
  
  var controller, TransactionService, $q, $scope, $rootScope, $filter;
  var mockTransactions;
  
  beforeEach(module('creditcard.transactions'));
  
  beforeEach(inject(function($controller, _$q_, _$rootScope_, _$filter_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $filter = _$filter_;
    
    mockTransactions = [
      {transactionId: 'T001', cardId: 'CC001', date: '2024-01-15', merchant: 'Grocery Store', amount: 2500, category: 'Food & Dining', description: 'Weekly groceries', status: 'Completed'},
      {transactionId: 'T002', cardId: 'CC001', date: '2024-01-18', merchant: 'Gas Station', amount: 1200, category: 'Fuel', description: 'Fuel refill', status: 'Completed'},
      {transactionId: 'T003', cardId: 'CC002', date: '2024-01-20', merchant: 'Amazon', amount: 4500, category: 'Shopping', description: 'Electronics', status: 'Completed'},
      {transactionId: 'T004', cardId: 'CC003', date: '2024-01-22', merchant: 'Flight Booking', amount: 8000, category: 'Travel', description: 'Flight tickets', status: 'Completed'}
    ];
    
    TransactionService = {
      getTransactions: jasmine.createSpy('getTransactions').and.returnValue($q.resolve(mockTransactions)),
      applyFilter: jasmine.createSpy('applyFilter').and.callFake(function(transactions, filter) {
        return transactions;
      })
    };
    
    controller = $controller('TransactionController', {
      TransactionService: TransactionService,
      $scope: $scope,
      $filter: $filter
    });
  }));
  
  describe('Controller Initialization', function() {
    it('should initialize controller with default values', function() {
      expect(controller.transactions).toEqual([]);
      expect(controller.filteredTransactions).toEqual([]);
      expect(controller.cards).toEqual([]);
      expect(controller.loading).toBe(true);
      expect(controller.error).toBe(null);
    });
    
    it('should initialize filter object with empty values', function() {
      expect(controller.filter).toEqual({
        cardId: '',
        startDate: null,
        endDate: null,
        category: ''
      });
    });
    
    it('should define applyFilter and clearFilter functions', function() {
      expect(controller.applyFilter).toBeDefined();
      expect(controller.clearFilter).toBeDefined();
      expect(typeof controller.applyFilter).toBe('function');
      expect(typeof controller.clearFilter).toBe('function');
    });
    
    it('should load transactions on activation', function() {
      expect(TransactionService.getTransactions).toHaveBeenCalled();
    });
  });
  
  describe('Transaction Loading - Success Scenario', function() {
    it('should load transactions successfully', function() {
      $rootScope.$digest();
      expect(controller.transactions).toEqual(mockTransactions);
      expect(controller.filteredTransactions).toEqual(mockTransactions);
      expect(controller.loading).toBe(false);
      expect(controller.error).toBe(null);
    });
    
    it('should extract unique card IDs from transactions', function() {
      $rootScope.$digest();
      expect(controller.cards.length).toBe(3);
      expect(controller.cards).toContain('CC001');
      expect(controller.cards).toContain('CC002');
      expect(controller.cards).toContain('CC003');
    });
    
    it('should set loading to true before fetching', function() {
      controller.loading = false;
      TransactionService.getTransactions.and.returnValue($q.resolve(mockTransactions));
      inject(function($controller) {
        controller = $controller('TransactionController', {
          TransactionService: TransactionService,
          $scope: $scope,
          $filter: $filter
        });
      });
      expect(controller.loading).toBe(true);
    });
  });
  
  describe('Transaction Loading - Error Scenario', function() {
    beforeEach(function() {
      TransactionService.getTransactions.and.returnValue($q.reject('Service error'));
      inject(function($controller) {
        controller = $controller('TransactionController', {
          TransactionService: TransactionService,
          $scope: $scope,
          $filter: $filter
        });
      });
    });
    
    it('should handle error when loading fails', function() {
      $rootScope.$digest();
      expect(controller.error).toBe('Failed to load transactions. Please try again.');
      expect(controller.loading).toBe(false);
    });
    
    it('should not update transactions on error', function() {
      $rootScope.$digest();
      expect(controller.transactions).toEqual([]);
      expect(controller.filteredTransactions).toEqual([]);
    });
  });
  
  describe('Filter Functionality', function() {
    beforeEach(function() {
      $rootScope.$digest();
    });
    
    it('should apply filter when applyFilter is called', function() {
      controller.filter.cardId = 'CC001';
      controller.applyFilter();
      expect(TransactionService.applyFilter).toHaveBeenCalledWith(mockTransactions, controller.filter);
    });
    
    it('should update filteredTransactions after applying filter', function() {
      var filteredResult = [mockTransactions[0], mockTransactions[1]];
      TransactionService.applyFilter.and.returnValue(filteredResult);
      controller.filter.cardId = 'CC001';
      controller.applyFilter();
      expect(controller.filteredTransactions).toEqual(filteredResult);
    });
    
    it('should clear filter when clearFilter is called', function() {
      controller.filter = {cardId: 'CC001', startDate: '2024-01-01', endDate: '2024-01-31', category: 'Fuel'};
      controller.clearFilter();
      expect(controller.filter).toEqual({
        cardId: '',
        startDate: null,
        endDate: null,
        category: ''
      });
    });
    
    it('should reset filteredTransactions to all transactions when filter is cleared', function() {
      controller.filteredTransactions = [mockTransactions[0]];
      controller.clearFilter();
      expect(controller.filteredTransactions).toEqual(mockTransactions);
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle empty transaction list', function() {
      TransactionService.getTransactions.and.returnValue($q.resolve([]));
      inject(function($controller) {
        controller = $controller('TransactionController', {
          TransactionService: TransactionService,
          $scope: $scope,
          $filter: $filter
        });
      });
      $rootScope.$digest();
      expect(controller.transactions).toEqual([]);
      expect(controller.cards).toEqual([]);
    });
    
    it('should handle transactions from single card', function() {
      var singleCardTransactions = [mockTransactions[0], mockTransactions[1]];
      TransactionService.getTransactions.and.returnValue($q.resolve(singleCardTransactions));
      inject(function($controller) {
        controller = $controller('TransactionController', {
          TransactionService: TransactionService,
          $scope: $scope,
          $filter: $filter
        });
      });
      $rootScope.$digest();
      expect(controller.cards.length).toBe(1);
      expect(controller.cards).toContain('CC001');
    });
    
    it('should handle duplicate card IDs in transactions', function() {
      var duplicateCardTransactions = [
        {transactionId: 'T001', cardId: 'CC001', date: '2024-01-15', merchant: 'Store1', amount: 100},
        {transactionId: 'T002', cardId: 'CC001', date: '2024-01-16', merchant: 'Store2', amount: 200},
        {transactionId: 'T003', cardId: 'CC001', date: '2024-01-17', merchant: 'Store3', amount: 300}
      ];
      TransactionService.getTransactions.and.returnValue($q.resolve(duplicateCardTransactions));
      inject(function($controller) {
        controller = $controller('TransactionController', {
          TransactionService: TransactionService,
          $scope: $scope,
          $filter: $filter
        });
      });
      $rootScope.$digest();
      expect(controller.cards.length).toBe(1);
    });
  });
});

/*
Coverage Report:
- Functions tested: activate, loadTransactions, extractCards, applyFilter, clearFilter
- Scenarios covered: Initialization, successful loading, error handling, filter application, filter clearing, empty data, single card, duplicate cards
- Edge cases: Empty transactions, single card, duplicate card IDs
- Uncovered scenarios: None
*/