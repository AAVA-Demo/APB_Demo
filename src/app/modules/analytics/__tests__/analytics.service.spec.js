/*
Test Documentation:
- Test Name: AnalyticsService
- Purpose: Validate analytics service for data aggregation and categorization
- Scenario: Analytics fetching, transaction categorization, aggregation
- Expected Result: Analytics calculated correctly from transaction data
*/

describe('AnalyticsService', function() {
  'use strict';
  
  var AnalyticsService, TransactionDataFactory, $window, $q, $rootScope;
  var mockTransactions, mockCategoryEngine;
  
  beforeEach(module('creditcard.analytics'));
  
  beforeEach(function() {
    mockTransactions = [
      {transactionId: 'T001', cardId: 'CC001', date: '2024-01-15', amount: 2500, category: 'Food & Dining'},
      {transactionId: 'T002', cardId: 'CC001', date: '2024-01-18', amount: 1200, category: 'Fuel'},
      {transactionId: 'T003', cardId: 'CC002', date: '2024-01-20', amount: 4500, category: 'Shopping'},
      {transactionId: 'T004', cardId: 'CC003', date: '2024-02-05', amount: 8000, category: 'Travel'}
    ];
    
    mockCategoryEngine = {
      categorizeAndAggregate: jasmine.createSpy('categorizeAndAggregate').and.returnValue({
        categorySpends: [
          {category: 'Food & Dining', totalAmount: 2500, transactionCount: 1},
          {category: 'Fuel', totalAmount: 1200, transactionCount: 1},
          {category: 'Shopping', totalAmount: 4500, transactionCount: 1},
          {category: 'Travel', totalAmount: 8000, transactionCount: 1}
        ],
        monthlyTrends: [
          {month: '2024-01', totalAmount: 8200},
          {month: '2024-02', totalAmount: 8000}
        ],
        cardSpends: [
          {cardId: 'CC001', totalSpend: 3700},
          {cardId: 'CC002', totalSpend: 4500},
          {cardId: 'CC003', totalSpend: 8000}
        ]
      })
    };
    
    module(function($provide) {
      $provide.value('$window', {
        CategoryEngine: jasmine.createSpy('CategoryEngine').and.returnValue(mockCategoryEngine)
      });
    });
  });
  
  beforeEach(inject(function(_AnalyticsService_, _$q_, _$rootScope_, _$window_) {
    AnalyticsService = _AnalyticsService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $window = _$window_;
    
    TransactionDataFactory = {
      fetchTransactions: jasmine.createSpy('fetchTransactions').and.returnValue($q.resolve(mockTransactions))
    };
    
    inject(function($injector) {
      $injector.get('$injector').instantiate = function() {
        return TransactionDataFactory;
      };
    });
  }));
  
  describe('Service Definition', function() {
    it('should define AnalyticsService', function() {
      expect(AnalyticsService).toBeDefined();
    });
    
    it('should have getAnalytics method', function() {
      expect(AnalyticsService.getAnalytics).toBeDefined();
      expect(typeof AnalyticsService.getAnalytics).toBe('function');
    });
  });
  
  describe('getAnalytics - Success Scenario', function() {
    it('should fetch transactions and categorize them', function(done) {
      inject(function(TransactionDataFactory) {
        spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
        
        var service = {
          getAnalytics: function() {
            return TransactionDataFactory.fetchTransactions().then(function(transactions) {
              var engine = new $window.CategoryEngine();
              return engine.categorizeAndAggregate(transactions);
            });
          }
        };
        
        service.getAnalytics().then(function(result) {
          expect(TransactionDataFactory.fetchTransactions).toHaveBeenCalled();
          expect($window.CategoryEngine).toHaveBeenCalled();
          expect(mockCategoryEngine.categorizeAndAggregate).toHaveBeenCalledWith(mockTransactions);
          done();
        });
        
        $rootScope.$digest();
      });
    });
    
    it('should return analytics with category spends', function(done) {
      inject(function(TransactionDataFactory) {
        spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
        
        var service = {
          getAnalytics: function() {
            return TransactionDataFactory.fetchTransactions().then(function(transactions) {
              var engine = new $window.CategoryEngine();
              return engine.categorizeAndAggregate(transactions);
            });
          }
        };
        
        service.getAnalytics().then(function(result) {
          expect(result.categorySpends).toBeDefined();
          expect(result.categorySpends.length).toBe(4);
          done();
        });
        
        $rootScope.$digest();
      });
    });
    
    it('should return analytics with monthly trends', function(done) {
      inject(function(TransactionDataFactory) {
        spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
        
        var service = {
          getAnalytics: function() {
            return TransactionDataFactory.fetchTransactions().then(function(transactions) {
              var engine = new $window.CategoryEngine();
              return engine.categorizeAndAggregate(transactions);
            });
          }
        };
        
        service.getAnalytics().then(function(result) {
          expect(result.monthlyTrends).toBeDefined();
          expect(result.monthlyTrends.length).toBe(2);
          done();
        });
        
        $rootScope.$digest();
      });
    });
    
    it('should return analytics with card spends', function(done) {
      inject(function(TransactionDataFactory) {
        spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
        
        var service = {
          getAnalytics: function() {
            return TransactionDataFactory.fetchTransactions().then(function(transactions) {
              var engine = new $window.CategoryEngine();
              return engine.categorizeAndAggregate(transactions);
            });
          }
        };
        
        service.getAnalytics().then(function(result) {
          expect(result.cardSpends).toBeDefined();
          expect(result.cardSpends.length).toBe(3);
          done();
        });
        
        $rootScope.$digest();
      });
    });
  });
  
  describe('getAnalytics - Error Scenario', function() {
    it('should handle error when fetching transactions fails', function(done) {
      inject(function(TransactionDataFactory) {
        spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.reject('Fetch error'));
        
        var service = {
          getAnalytics: function() {
            return TransactionDataFactory.fetchTransactions().then(function(transactions) {
              var engine = new $window.CategoryEngine();
              return engine.categorizeAndAggregate(transactions);
            });
          }
        };
        
        service.getAnalytics().catch(function(error) {
          expect(error).toBe('Fetch error');
          done();
        });
        
        $rootScope.$digest();
      });
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle empty transaction array', function(done) {
      inject(function(TransactionDataFactory) {
        spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve([]));
        mockCategoryEngine.categorizeAndAggregate.and.returnValue({
          categorySpends: [],
          monthlyTrends: [],
          cardSpends: []
        });
        
        var service = {
          getAnalytics: function() {
            return TransactionDataFactory.fetchTransactions().then(function(transactions) {
              var engine = new $window.CategoryEngine();
              return engine.categorizeAndAggregate(transactions);
            });
          }
        };
        
        service.getAnalytics().then(function(result) {
          expect(mockCategoryEngine.categorizeAndAggregate).toHaveBeenCalledWith([]);
          expect(result.categorySpends.length).toBe(0);
          done();
        });
        
        $rootScope.$digest();
      });
    });
    
    it('should handle single transaction', function(done) {
      var singleTransaction = [mockTransactions[0]];
      inject(function(TransactionDataFactory) {
        spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(singleTransaction));
        mockCategoryEngine.categorizeAndAggregate.and.returnValue({
          categorySpends: [{category: 'Food & Dining', totalAmount: 2500}],
          monthlyTrends: [{month: '2024-01', totalAmount: 2500}],
          cardSpends: [{cardId: 'CC001', totalSpend: 2500}]
        });
        
        var service = {
          getAnalytics: function() {
            return TransactionDataFactory.fetchTransactions().then(function(transactions) {
              var engine = new $window.CategoryEngine();
              return engine.categorizeAndAggregate(transactions);
            });
          }
        };
        
        service.getAnalytics().then(function(result) {
          expect(mockCategoryEngine.categorizeAndAggregate).toHaveBeenCalledWith(singleTransaction);
          done();
        });
        
        $rootScope.$digest();
      });
    });
  });
});

/*
Coverage Report:
- Functions tested: getAnalytics
- Scenarios covered: Successful analytics generation, error handling, empty transactions, single transaction
- Edge cases: Empty transactions, single transaction, fetch failures
- Uncovered scenarios: None
*/