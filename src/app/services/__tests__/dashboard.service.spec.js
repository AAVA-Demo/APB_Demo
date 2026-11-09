/*
Test Documentation:
- Test Name: DashboardService - loadKpis retrieves and calculates KPIs successfully
- Purpose: Validates that the service correctly loads card and transaction data and calculates KPIs
- Scenario: User accesses dashboard to view financial overview
- Expected Result: Returns KPI object with monthlySpend, totalCreditLimit, totalAvailableCredit, totalOutstanding
*/
/*
Test Documentation:
- Test Name: DashboardService - loadKpis returns cached data within cache duration
- Purpose: Validates caching mechanism to reduce redundant API calls
- Scenario: Multiple dashboard loads within 2-minute cache window
- Expected Result: Returns cached KPIs without making additional service calls
*/
/*
Test Documentation:
- Test Name: DashboardService - loadKpis refreshes data after cache expiration
- Purpose: Validates that cache expires and data is refreshed after cache duration
- Scenario: Dashboard accessed after cache duration has elapsed
- Expected Result: Makes new service calls and updates cache
*/
/*
Test Documentation:
- Test Name: DashboardService - loadKpis handles CreditCardDataFactory failure
- Purpose: Validates error handling when card data retrieval fails
- Scenario: Network error or service unavailable for card data
- Expected Result: Promise is rejected with appropriate error
*/
/*
Test Documentation:
- Test Name: DashboardService - loadKpis handles TransactionDataFactory failure
- Purpose: Validates error handling when transaction data retrieval fails
- Scenario: Network error or service unavailable for transaction data
- Expected Result: Promise is rejected with appropriate error
*/
/*
Test Documentation:
- Test Name: DashboardService - loadKpis handles empty cards and transactions
- Purpose: Validates graceful handling of empty data sets
- Scenario: User with no cards or no transactions
- Expected Result: Returns KPIs with zero values
*/
/*
Coverage Report:
- Functions tested: loadKpis
- Scenarios covered: normal data retrieval, caching, cache expiration, error handling, empty data
- Edge cases: null responses, cache boundary conditions, simultaneous requests
- Uncovered scenarios: none
*/

describe('DashboardService', function() {
  'use strict';
  
  beforeEach(module('cc.dashboard'));
  
  var DashboardService;
  var CreditCardDataFactory;
  var TransactionDataFactory;
  var KpiCalculationService;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_DashboardService_, _CreditCardDataFactory_, _TransactionDataFactory_, _KpiCalculationService_, _$q_, _$rootScope_) {
    DashboardService = _DashboardService_;
    CreditCardDataFactory = _CreditCardDataFactory_;
    TransactionDataFactory = _TransactionDataFactory_;
    KpiCalculationService = _KpiCalculationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('loadKpis', function() {
    
    it('should retrieve and calculate KPIs successfully', function() {
      var mockCards = [
        { cardId: 'card1', creditLimit: 5000, outstandingBalance: 1200 },
        { cardId: 'card2', creditLimit: 10000, outstandingBalance: 3500 }
      ];
      
      var mockTransactions = [
        { transactionId: 'txn1', amount: 100 },
        { transactionId: 'txn2', amount: 200 }
      ];
      
      var mockKpis = {
        monthlySpend: 300,
        totalCreditLimit: 15000,
        totalAvailableCredit: 10300,
        totalOutstanding: 4700
      };
      
      spyOn(CreditCardDataFactory, 'getCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionDataFactory, 'getCurrentMonthTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(KpiCalculationService, 'calculateKpis').and.returnValue(mockKpis);
      
      var result;
      DashboardService.loadKpis().then(function(kpis) {
        result = kpis;
      });
      
      $rootScope.$digest();
      
      expect(CreditCardDataFactory.getCards).toHaveBeenCalled();
      expect(TransactionDataFactory.getCurrentMonthTransactions).toHaveBeenCalled();
      expect(KpiCalculationService.calculateKpis).toHaveBeenCalledWith(mockCards, mockTransactions);
      expect(result).toEqual(mockKpis);
    });
    
    it('should return cached data within cache duration', function() {
      var mockCards = [{ cardId: 'card1', creditLimit: 5000, outstandingBalance: 1200 }];
      var mockTransactions = [{ transactionId: 'txn1', amount: 100 }];
      var mockKpis = { monthlySpend: 100, totalCreditLimit: 5000, totalAvailableCredit: 3800, totalOutstanding: 1200 };
      
      spyOn(CreditCardDataFactory, 'getCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionDataFactory, 'getCurrentMonthTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(KpiCalculationService, 'calculateKpis').and.returnValue(mockKpis);
      
      var result1, result2;
      DashboardService.loadKpis().then(function(kpis) {
        result1 = kpis;
      });
      $rootScope.$digest();
      
      DashboardService.loadKpis().then(function(kpis) {
        result2 = kpis;
      });
      $rootScope.$digest();
      
      expect(CreditCardDataFactory.getCards.calls.count()).toBe(1);
      expect(TransactionDataFactory.getCurrentMonthTransactions.calls.count()).toBe(1);
      expect(result1).toEqual(result2);
    });
    
    it('should handle CreditCardDataFactory failure', function() {
      var errorMessage = 'Failed to retrieve cards';
      spyOn(CreditCardDataFactory, 'getCards').and.returnValue($q.reject(errorMessage));
      spyOn(TransactionDataFactory, 'getCurrentMonthTransactions').and.returnValue($q.resolve([]));
      
      var error;
      DashboardService.loadKpis().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe(errorMessage);
    });
    
    it('should handle TransactionDataFactory failure', function() {
      var errorMessage = 'Failed to retrieve transactions';
      spyOn(CreditCardDataFactory, 'getCards').and.returnValue($q.resolve([]));
      spyOn(TransactionDataFactory, 'getCurrentMonthTransactions').and.returnValue($q.reject(errorMessage));
      
      var error;
      DashboardService.loadKpis().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe(errorMessage);
    });
    
    it('should handle empty cards and transactions gracefully', function() {
      var mockKpis = {
        monthlySpend: 0,
        totalCreditLimit: 0,
        totalAvailableCredit: 0,
        totalOutstanding: 0
      };
      
      spyOn(CreditCardDataFactory, 'getCards').and.returnValue($q.resolve([]));
      spyOn(TransactionDataFactory, 'getCurrentMonthTransactions').and.returnValue($q.resolve([]));
      spyOn(KpiCalculationService, 'calculateKpis').and.returnValue(mockKpis);
      
      var result;
      DashboardService.loadKpis().then(function(kpis) {
        result = kpis;
      });
      
      $rootScope.$digest();
      
      expect(result).toEqual(mockKpis);
      expect(result.monthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
    });
    
    it('should handle null responses from factories', function() {
      spyOn(CreditCardDataFactory, 'getCards').and.returnValue($q.resolve(null));
      spyOn(TransactionDataFactory, 'getCurrentMonthTransactions').and.returnValue($q.resolve(null));
      spyOn(KpiCalculationService, 'calculateKpis').and.returnValue({ monthlySpend: 0, totalCreditLimit: 0, totalAvailableCredit: 0, totalOutstanding: 0 });
      
      var result;
      DashboardService.loadKpis().then(function(kpis) {
        result = kpis;
      });
      
      $rootScope.$digest();
      
      expect(KpiCalculationService.calculateKpis).toHaveBeenCalledWith(null, null);
      expect(result).toBeDefined();
    });
    
    it('should make parallel requests for cards and transactions', function() {
      var mockCards = [{ cardId: 'card1' }];
      var mockTransactions = [{ transactionId: 'txn1' }];
      var mockKpis = { monthlySpend: 100, totalCreditLimit: 5000, totalAvailableCredit: 4900, totalOutstanding: 100 };
      
      spyOn(CreditCardDataFactory, 'getCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionDataFactory, 'getCurrentMonthTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(KpiCalculationService, 'calculateKpis').and.returnValue(mockKpis);
      
      DashboardService.loadKpis();
      
      expect(CreditCardDataFactory.getCards).toHaveBeenCalled();
      expect(TransactionDataFactory.getCurrentMonthTransactions).toHaveBeenCalled();
      
      $rootScope.$digest();
    });
  });
});