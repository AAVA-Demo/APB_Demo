/*
Test Documentation:
- Test Name: DashboardAggregationService - loadDashboard success flow
- Purpose: Validates complete dashboard loading orchestration
- Scenario: Service orchestrates auth validation, data retrieval, and KPI calculation
- Expected Result: Returns promise resolving to calculated KPIs
*/
/*
Test Documentation:
- Test Name: DashboardAggregationService - loadDashboard auth failure
- Purpose: Validates error handling when authentication fails
- Scenario: AuthService.validateAuth rejects
- Expected Result: Promise is rejected with auth error
*/
/*
Test Documentation:
- Test Name: DashboardAggregationService - loadDashboard data retrieval failure
- Purpose: Validates error handling when card data retrieval fails
- Scenario: CreditCardDataFactory.fetchAllCards rejects
- Expected Result: Promise is rejected with data error
*/
/*
Coverage Report:
- Functions tested: loadDashboard
- Scenarios covered: successful orchestration, auth failure, data retrieval failure, service integration
- Uncovered scenarios: none
*/

(function(){
'use strict';

describe('DashboardAggregationService', function(){
  var DashboardAggregationService, AuthService, CreditCardDataFactory, KpiCalculationService, $q, $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_DashboardAggregationService_, _AuthService_, _CreditCardDataFactory_, _KpiCalculationService_, _$q_, _$rootScope_){
    DashboardAggregationService = _DashboardAggregationService_;
    AuthService = _AuthService_;
    CreditCardDataFactory = _CreditCardDataFactory_;
    KpiCalculationService = _KpiCalculationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('loadDashboard', function(){
    
    it('should orchestrate auth, data retrieval, and KPI calculation successfully', function(){
      var mockCards = [
        {cardId:'CC001', creditLimit:50000, availableCredit:35000, outstandingAmount:15000, monthlySpend:8500},
        {cardId:'CC002', creditLimit:30000, availableCredit:22000, outstandingAmount:8000, monthlySpend:4200}
      ];
      var mockKpis = {
        totalCreditLimit: 80000,
        totalAvailableCredit: 57000,
        totalOutstanding: 23000,
        totalMonthlySpend: 12700,
        numberOfCards: 2,
        cards: mockCards
      };
      
      spyOn(AuthService, 'validateAuth').and.returnValue($q.resolve({valid:true, token:'test-token'}));
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(KpiCalculationService, 'calculateKpis').and.returnValue(mockKpis);
      
      var result;
      DashboardAggregationService.loadDashboard().then(function(kpis){
        result = kpis;
      });
      
      $rootScope.$digest();
      
      expect(AuthService.validateAuth).toHaveBeenCalled();
      expect(CreditCardDataFactory.fetchAllCards).toHaveBeenCalled();
      expect(KpiCalculationService.calculateKpis).toHaveBeenCalledWith(mockCards);
      expect(result).toEqual(mockKpis);
      expect(result.totalCreditLimit).toBe(80000);
      expect(result.numberOfCards).toBe(2);
    });
    
    it('should reject when authentication fails', function(){
      var mockError = {message: 'Authentication failed'};
      spyOn(AuthService, 'validateAuth').and.returnValue($q.reject(mockError));
      
      var error;
      DashboardAggregationService.loadDashboard().catch(function(err){
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toEqual(mockError);
    });
    
    it('should reject when card data retrieval fails', function(){
      spyOn(AuthService, 'validateAuth').and.returnValue($q.resolve({valid:true}));
      var mockError = {message: 'Failed to fetch cards'};
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.reject(mockError));
      
      var error;
      DashboardAggregationService.loadDashboard().catch(function(err){
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toEqual(mockError);
    });
    
    it('should call services in correct order', function(){
      var callOrder = [];
      
      spyOn(AuthService, 'validateAuth').and.callFake(function(){
        callOrder.push('auth');
        return $q.resolve({valid:true});
      });
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.callFake(function(){
        callOrder.push('fetch');
        return $q.resolve([]);
      });
      spyOn(KpiCalculationService, 'calculateKpis').and.callFake(function(){
        callOrder.push('calculate');
        return {};
      });
      
      DashboardAggregationService.loadDashboard();
      $rootScope.$digest();
      
      expect(callOrder).toEqual(['auth', 'fetch', 'calculate']);
    });
    
  });
  
});

})();