/*
Test Documentation:
- Test Name: DashboardApiService Unit Tests
- Purpose: Validate dashboard data aggregation from multiple services
- Scenario: Tests orchestration of card and transaction services with KPI computation
- Expected Result: Service correctly aggregates data and computes KPIs
*/

(function() {
  'use strict';
  
  describe('DashboardApiService', function() {
    var DashboardApiService, CreditCardService, TransactionService, KpiCalculationService, $q, $rootScope;
    
    beforeEach(module('dashboardModule'));
    
    beforeEach(inject(function(_DashboardApiService_, _CreditCardService_, _TransactionService_, _KpiCalculationService_, _$q_, _$rootScope_) {
      DashboardApiService = _DashboardApiService_;
      CreditCardService = _CreditCardService_;
      TransactionService = _TransactionService_;
      KpiCalculationService = _KpiCalculationService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));
    
    describe('fetchDashboardData()', function() {
      it('should fetch cards and transactions then compute KPIs', function() {
        var mockCards = [{cardId: 'card1', creditLimit: 50000, outstandingBalance: 10000}];
        var mockTransactions = [{amount: 1500}];
        var mockKpis = {monthlySpend: 1500, totalCreditLimit: 50000};
        
        spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionService, 'getCurrentMonthTransactions').and.returnValue($q.resolve(mockTransactions));
        spyOn(KpiCalculationService, 'computeKPIs').and.returnValue(mockKpis);
        
        var result;
        DashboardApiService.fetchDashboardData().then(function(data) {
          result = data;
        });
        
        $rootScope.$digest();
        expect(CreditCardService.getAllCards).toHaveBeenCalled();
        expect(TransactionService.getCurrentMonthTransactions).toHaveBeenCalled();
        expect(KpiCalculationService.computeKPIs).toHaveBeenCalledWith(mockCards, mockTransactions);
        expect(result).toEqual(mockKpis);
      });
      
      it('should handle service failures', function() {
        spyOn(CreditCardService, 'getAllCards').and.returnValue($q.reject('Error'));
        spyOn(TransactionService, 'getCurrentMonthTransactions').and.returnValue($q.resolve([]));
        
        var errorCaught = false;
        DashboardApiService.fetchDashboardData().catch(function() {
          errorCaught = true;
        });
        
        $rootScope.$digest();
        expect(errorCaught).toBe(true);
      });
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: fetchDashboardData
- Scenarios covered:
  * Successful data aggregation
  * Service orchestration
  * KPI computation integration
  * Error handling
- Uncovered scenarios: Partial service failures, timeout handling
*/