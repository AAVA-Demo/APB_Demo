/*
Test Documentation:
- Test Name: KpiAggregationService - fetchKpis success
- Purpose: Validates KPI calculation and aggregation across all user cards
- Scenario: Authenticated user requests KPI data
- Expected Result: Returns aggregated KPIs including monthly spend, total credit limit, available credit, and outstanding amount
*/
/*
Test Documentation:
- Test Name: KpiAggregationService - fetchKpis authentication error
- Purpose: Validates error handling when user is not authenticated
- Scenario: User is not authenticated
- Expected Result: Promise is rejected with authentication error
*/
/*
Coverage Report:
- Functions tested: fetchKpis
- Scenarios covered: successful KPI aggregation, authentication validation, card data integration, calculator factory usage, error handling
- Uncovered scenarios: none
*/

describe('KpiAggregationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var KpiAggregationService;
  var CreditCardApiService;
  var KpiCalculatorFactory;
  var AuthService;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_KpiAggregationService_, _CreditCardApiService_, _KpiCalculatorFactory_, _AuthService_, _$q_, _$rootScope_) {
    KpiAggregationService = _KpiAggregationService_;
    CreditCardApiService = _CreditCardApiService_;
    KpiCalculatorFactory = _KpiCalculatorFactory_;
    AuthService = _AuthService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('fetchKpis', function() {
    it('should fetch and aggregate KPIs for authenticated user', function() {
      var mockUser = {userId: 'user123', name: 'John Doe'};
      var mockCards = [
        {cardId: 'card1', creditLimit: 100000, outstandingAmount: 25000, monthlySpend: 15000},
        {cardId: 'card2', creditLimit: 75000, outstandingAmount: 30000, monthlySpend: 12000}
      ];
      var mockKpiData = {
        monthlySpend: 27000.00,
        totalCreditLimit: 175000.00,
        availableCredit: 120000.00,
        outstandingAmount: 55000.00
      };
      
      spyOn(AuthService, 'getUser').and.returnValue(mockUser);
      spyOn(CreditCardApiService, 'getCards').and.returnValue($q.resolve(mockCards));
      spyOn(KpiCalculatorFactory, 'calculateKpis').and.returnValue(mockKpiData);
      
      var result;
      KpiAggregationService.fetchKpis().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(AuthService.getUser).toHaveBeenCalled();
      expect(CreditCardApiService.getCards).toHaveBeenCalledWith('user123');
      expect(KpiCalculatorFactory.calculateKpis).toHaveBeenCalledWith(mockCards);
      expect(result).toBeDefined();
      expect(result.monthlySpend).toBe(27000.00);
      expect(result.totalCreditLimit).toBe(175000.00);
      expect(result.availableCredit).toBe(120000.00);
      expect(result.outstandingAmount).toBe(55000.00);
    });
    
    it('should reject when user is not authenticated', function() {
      spyOn(AuthService, 'getUser').and.returnValue(null);
      
      var error;
      KpiAggregationService.fetchKpis().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('User not authenticated');
    });
    
    it('should handle API error when fetching cards', function() {
      var mockUser = {userId: 'user123'};
      spyOn(AuthService, 'getUser').and.returnValue(mockUser);
      spyOn(CreditCardApiService, 'getCards').and.returnValue($q.reject('API Error'));
      
      var error;
      KpiAggregationService.fetchKpis().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('API Error');
    });
    
    it('should call KpiCalculatorFactory with correct card data', function() {
      var mockUser = {userId: 'user123'};
      var mockCards = [{cardId: 'card1'}, {cardId: 'card2'}];
      var mockKpiData = {monthlySpend: 10000};
      
      spyOn(AuthService, 'getUser').and.returnValue(mockUser);
      spyOn(CreditCardApiService, 'getCards').and.returnValue($q.resolve(mockCards));
      spyOn(KpiCalculatorFactory, 'calculateKpis').and.returnValue(mockKpiData);
      
      KpiAggregationService.fetchKpis();
      $rootScope.$digest();
      
      expect(KpiCalculatorFactory.calculateKpis).toHaveBeenCalledWith(mockCards);
    });
  });
});