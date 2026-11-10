/*
Test Documentation:
- Test Name: CategoryAnalyticsService - getCategoryAnalytics success
- Purpose: Validates successful retrieval and categorization of transaction analytics
- Scenario: Service orchestrates transaction retrieval and categorization
- Expected Result: Returns promise resolving to category analytics data
*/
/*
Test Documentation:
- Test Name: CategoryAnalyticsService - getCategoryAnalytics error handling
- Purpose: Validates error handling when transaction retrieval fails
- Scenario: TransactionRepositoryFactory.fetchTransactions rejects
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getCategoryAnalytics
- Scenarios covered: successful analytics retrieval, error handling, service orchestration
- Uncovered scenarios: none
*/

(function(){
'use strict';

describe('CategoryAnalyticsService', function(){
  var CategoryAnalyticsService, TransactionRepositoryFactory, CategorizationService, $q, $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CategoryAnalyticsService_, _TransactionRepositoryFactory_, _CategorizationService_, _$q_, _$rootScope_){
    CategoryAnalyticsService = _CategoryAnalyticsService_;
    TransactionRepositoryFactory = _TransactionRepositoryFactory_;
    CategorizationService = _CategorizationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getCategoryAnalytics', function(){
    
    it('should retrieve transactions and return category analytics', function(){
      var mockTransactions = [
        {transactionId:'T001', amount:1000, category:'Food & Dining'},
        {transactionId:'T002', amount:2000, category:'Shopping'}
      ];
      var mockCategoryData = {
        categories: [
          {name:'Food & Dining', amount:1000, percentage:33.33, transactionCount:1},
          {name:'Shopping', amount:2000, percentage:66.67, transactionCount:1}
        ],
        totalSpend: 3000,
        transactions: mockTransactions
      };
      
      spyOn(TransactionRepositoryFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationService, 'categorizeAndAggregate').and.returnValue(mockCategoryData);
      
      var result;
      CategoryAnalyticsService.getCategoryAnalytics().then(function(data){
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(TransactionRepositoryFactory.fetchTransactions).toHaveBeenCalled();
      expect(CategorizationService.categorizeAndAggregate).toHaveBeenCalledWith(mockTransactions);
      expect(result).toEqual(mockCategoryData);
      expect(result.totalSpend).toBe(3000);
      expect(result.categories.length).toBe(2);
    });
    
    it('should handle errors when transaction retrieval fails', function(){
      var mockError = {message: 'Database connection failed'};
      spyOn(TransactionRepositoryFactory, 'fetchTransactions').and.returnValue($q.reject(mockError));
      
      var error;
      CategoryAnalyticsService.getCategoryAnalytics().catch(function(err){
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toEqual(mockError);
    });
    
    it('should handle empty transactions', function(){
      var mockTransactions = [];
      var mockCategoryData = {
        categories: [],
        totalSpend: 0,
        transactions: []
      };
      
      spyOn(TransactionRepositoryFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationService, 'categorizeAndAggregate').and.returnValue(mockCategoryData);
      
      var result;
      CategoryAnalyticsService.getCategoryAnalytics().then(function(data){
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.totalSpend).toBe(0);
      expect(result.categories.length).toBe(0);
    });
    
  });
  
});

})();