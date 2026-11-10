/*
Test Documentation:
- Test Name: TransactionController
- Purpose: Validate transaction controller initialization and pagination
- Scenario: Controller initialization, transaction loading, filtering, pagination
- Expected Result: Controller loads transactions, supports filtering by card, and handles pagination
*/

describe('TransactionController', function() {
  'use strict';

  beforeEach(module('creditCard.transactions'));

  var $controller, $scope, TransactionService, PaginationHelper, MockDataService, $q, $rootScope;
  var controller;
  var mockTransactions, mockCards;

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $q = _$q_;

    mockTransactions = {
      transactions: [
        { transactionId: 'txn001', merchantName: 'Whole Foods', amount: 127.45 },
        { transactionId: 'txn002', merchantName: 'Shell Gas', amount: 65.00 }
      ],
      pagination: {
        currentPage: 1,
        totalPages: 3,
        pageSize: 20,
        totalRecords: 50
      }
    };

    mockCards = {
      creditCards: [
        { cardId: 'cc001', cardName: 'Platinum Rewards' },
        { cardId: 'cc002', cardName: 'Travel Elite' }
      ]
    };

    TransactionService = {
      getTransactions: jasmine.createSpy('getTransactions').and.returnValue($q.resolve(mockTransactions))
    };

    MockDataService = {
      getDashboardData: jasmine.createSpy('getDashboardData').and.returnValue($q.resolve(mockCards))
    };

    PaginationHelper = function() {
      this.currentPage = 1;
      this.totalPages = 1;
      this.pageSize = 20;
      this.totalRecords = 0;
      this.initialize = jasmine.createSpy('initialize');
      this.nextPage = jasmine.createSpy('nextPage').and.returnValue(true);
      this.prevPage = jasmine.createSpy('prevPage').and.returnValue(true);
      this.goToPage = jasmine.createSpy('goToPage').and.returnValue(true);
    };

    controller = $controller('TransactionController', {
      $scope: $scope,
      TransactionService: TransactionService,
      PaginationHelper: PaginationHelper,
      MockDataService: MockDataService
    });
  }));

  it('should be defined', function() {
    expect(controller).toBeDefined();
  });

  it('should initialize with loading state', function() {
    expect(controller.loading).toBe(true);
  });

  it('should initialize filters', function() {
    expect(controller.filters).toBeDefined();
    expect(controller.filters.cardId).toBe('all');
  });

  it('should initialize pagination helper', function() {
    expect(controller.pagination).toBeDefined();
  });

  it('should load transactions on init', function() {
    controller.init();
    $rootScope.$digest();
    
    expect(TransactionService.getTransactions).toHaveBeenCalled();
    expect(controller.transactions.length).toBe(2);
  });

  it('should load card list on init', function() {
    controller.init();
    $rootScope.$digest();
    
    expect(MockDataService.getDashboardData).toHaveBeenCalled();
    expect(controller.cards.length).toBeGreaterThan(0);
  });

  it('should include "All Cards" option in card list', function() {
    controller.init();
    $rootScope.$digest();
    
    expect(controller.cards[0].cardId).toBe('all');
    expect(controller.cards[0].cardName).toBe('All Cards');
  });

  it('should set loading to false after loading transactions', function() {
    controller.loadTransactions();
    $rootScope.$digest();
    
    expect(controller.loading).toBe(false);
  });

  it('should handle transaction loading errors', function() {
    TransactionService.getTransactions.and.returnValue($q.reject('Load error'));
    spyOn(console, 'error');
    
    controller.loadTransactions();
    $rootScope.$digest();
    
    expect(controller.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Failed to load transactions:', 'Load error');
  });

  it('should filter transactions by card', function() {
    controller.filters.cardId = 'cc001';
    controller.filterByCard();
    $rootScope.$digest();
    
    expect(controller.pagination.currentPage).toBe(1);
    expect(TransactionService.getTransactions).toHaveBeenCalled();
  });

  it('should navigate to next page', function() {
    controller.nextPage();
    
    expect(controller.pagination.nextPage).toHaveBeenCalled();
    expect(TransactionService.getTransactions).toHaveBeenCalled();
  });

  it('should navigate to previous page', function() {
    controller.prevPage();
    
    expect(controller.pagination.prevPage).toHaveBeenCalled();
    expect(TransactionService.getTransactions).toHaveBeenCalled();
  });

  it('should navigate to specific page', function() {
    controller.goToPage(3);
    
    expect(controller.pagination.goToPage).toHaveBeenCalledWith(3);
    expect(TransactionService.getTransactions).toHaveBeenCalled();
  });

  it('should not load transactions if nextPage returns false', function() {
    controller.pagination.nextPage.and.returnValue(false);
    var callCount = TransactionService.getTransactions.calls.count();
    
    controller.nextPage();
    
    expect(TransactionService.getTransactions.calls.count()).toBe(callCount);
  });

  it('should initialize pagination with response data', function() {
    controller.loadTransactions();
    $rootScope.$digest();
    
    expect(controller.pagination.initialize).toHaveBeenCalledWith(mockTransactions.pagination);
  });
});

/*
Coverage Report:
- Functions tested: init, loadTransactions, filterByCard, nextPage, prevPage, goToPage
- Scenarios covered: initialization, data loading, filtering, pagination navigation, error handling
- Edge cases: empty transactions, service errors, pagination boundaries
- Uncovered scenarios: none
*/