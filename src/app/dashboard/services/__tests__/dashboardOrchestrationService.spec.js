/*
Test Documentation:
- Test Name: dashboardOrchestrationService - Get KPIs from Cache
- Purpose: Verify service returns cached KPIs when available
- Scenario: Cache contains valid KPI data
- Expected Result: Returns cached data without calling downstream services
*/
/*
Test Documentation:
- Test Name: dashboardOrchestrationService - Get KPIs from Services
- Purpose: Verify service fetches and calculates KPIs when cache is empty
- Scenario: Cache is empty or expired
- Expected Result: Calls card and transaction services, calculates KPIs, caches result
*/
/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered: cache hit, cache miss, service orchestration
- Uncovered scenarios: error handling
*/

describe('dashboardOrchestrationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.dashboard'));
  
  var dashboardOrchestrationService, $rootScope, $q, mockCreditCardDataService, mockTransactionProcessingService, mockCacheService, mockKpiCalculationFactory;
  
  beforeEach(inject(function(_$q_, _$rootScope_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    mockCreditCardDataService = {
      getAllCards: jasmine.createSpy('getAllCards')
    };
    
    mockTransactionProcessingService = {
      getMonthlyTransactions: jasmine.createSpy('getMonthlyTransactions')
    };
    
    mockCacheService = {
      get: jasmine.createSpy('get'),
      put: jasmine.createSpy('put')
    };
    
    mockKpiCalculationFactory = {
      calculate: jasmine.createSpy('calculate')
    };
  }));
  
  beforeEach(inject(function($injector) {
    dashboardOrchestrationService = $injector.instantiate(function() {
      return $injector.get('dashboardOrchestrationService');
    }, {
      creditCardDataService: mockCreditCardDataService,
      transactionProcessingService: mockTransactionProcessingService,
      cacheService: mockCacheService,
      kpiCalculationFactory: mockKpiCalculationFactory
    });
  }));
  
  it('should return cached KPIs when available', function() {
    var cachedKPIs = {monthlySpend: 730, totalCreditLimit: 45000};
    mockCacheService.get.and.returnValue(cachedKPIs);
    
    var result;
    dashboardOrchestrationService.getKPIs().then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(result).toEqual(cachedKPIs);
    expect(mockCreditCardDataService.getAllCards).not.toHaveBeenCalled();
    expect(mockTransactionProcessingService.getMonthlyTransactions).not.toHaveBeenCalled();
  });
  
  it('should fetch and calculate KPIs when cache is empty', function() {
    mockCacheService.get.and.returnValue(null);
    
    var mockCards = [{cardId: 'c1', creditLimit: 10000, currentBalance: 2500}];
    var mockTransactions = [{transactionId: 't1', amount: 150}];
    var calculatedKPIs = {monthlySpend: 150, totalCreditLimit: 10000};
    
    mockCreditCardDataService.getAllCards.and.returnValue($q.resolve(mockCards));
    mockTransactionProcessingService.getMonthlyTransactions.and.returnValue($q.resolve(mockTransactions));
    mockKpiCalculationFactory.calculate.and.returnValue(calculatedKPIs);
    
    var result;
    dashboardOrchestrationService.getKPIs().then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(mockKpiCalculationFactory.calculate).toHaveBeenCalledWith(mockCards, mockTransactions);
    expect(mockCacheService.put).toHaveBeenCalledWith('kpiData', calculatedKPIs, 120);
    expect(result).toEqual(calculatedKPIs);
  });
});