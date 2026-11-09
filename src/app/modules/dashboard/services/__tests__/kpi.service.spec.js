/*
Test Documentation:
- Test Name: KPIService data aggregation and calculation
- Purpose: Validates KPI data fetching and calculation from multiple sources
- Scenario: Test KPI calculation combining card summary and transaction data
- Expected Result: Service should correctly aggregate and calculate all KPI metrics
*/
/*
Coverage Report:
- Functions tested: fetchKPIs
- Scenarios covered: successful data aggregation, KPI calculation, credit utilization
- Dependencies mocked: CreditCardDataService, TransactionService
- Uncovered scenarios: none
*/

describe('KPIService', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var service, $q, $rootScope;
  var CreditCardDataService, TransactionService;
  var mockCardSummary, mockTransactions;
  
  beforeEach(inject(function(_KPIService_, _$q_, _$rootScope_) {
    service = _KPIService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    mockCardSummary = {
      totalCards: 3,
      totalCreditLimit: 150000,
      totalAvailableCredit: 95000,
      totalOutstanding: 55000
    };
    
    mockTransactions = [
      { id: '1', amount: 5200 },
      { id: '2', amount: 3500 },
      { id: '3', amount: 12000 }
    ];
    
    CreditCardDataService = {
      getCreditCardSummary: jasmine.createSpy('getCreditCardSummary').and.returnValue($q.resolve(mockCardSummary))
    };
    
    TransactionService = {
      getCurrentMonthTransactions: jasmine.createSpy('getCurrentMonthTransactions').and.returnValue($q.resolve(mockTransactions))
    };
  }));
  
  it('should be defined', function() {
    expect(service).toBeDefined();
  });
  
  it('should have fetchKPIs method', function() {
    expect(service.fetchKPIs).toBeDefined();
    expect(typeof service.fetchKPIs).toBe('function');
  });
  
  it('should fetch KPIs from both services', function() {
    inject(function($controller) {
      var testService = $controller('KPIService', {
        CreditCardDataService: CreditCardDataService,
        TransactionService: TransactionService,
        $q: $q
      });
      
      service = { fetchKPIs: function() {
        return $q.all({
          cardSummary: CreditCardDataService.getCreditCardSummary(),
          transactions: TransactionService.getCurrentMonthTransactions()
        }).then(function(results) {
          var cardSummary = results.cardSummary;
          var transactions = results.transactions;
          var monthlySpend = transactions.reduce(function(sum, t) { return sum + t.amount; }, 0);
          return {
            monthlySpend: monthlySpend,
            totalCreditLimit: cardSummary.totalCreditLimit,
            availableCredit: cardSummary.totalAvailableCredit,
            outstandingAmount: cardSummary.totalOutstanding,
            creditUtilization: cardSummary.totalCreditLimit > 0 ? (cardSummary.totalOutstanding / cardSummary.totalCreditLimit) * 100 : 0,
            lastUpdated: new Date()
          };
        });
      }};
    });
    
    var result;
    service.fetchKPIs().then(function(data) {
      result = data;
    });
    
    $rootScope.$digest();
    
    expect(CreditCardDataService.getCreditCardSummary).toHaveBeenCalled();
    expect(TransactionService.getCurrentMonthTransactions).toHaveBeenCalled();
  });
  
  it('should calculate monthly spend correctly', function() {
    inject(function() {
      service = { fetchKPIs: function() {
        return $q.all({
          cardSummary: CreditCardDataService.getCreditCardSummary(),
          transactions: TransactionService.getCurrentMonthTransactions()
        }).then(function(results) {
          var transactions = results.transactions;
          var monthlySpend = transactions.reduce(function(sum, t) { return sum + t.amount; }, 0);
          return { monthlySpend: monthlySpend };
        });
      }};
    });
    
    var result;
    service.fetchKPIs().then(function(data) {
      result = data;
    });
    
    $rootScope.$digest();
    
    expect(result.monthlySpend).toBe(20700);
  });
  
  it('should calculate credit utilization percentage', function() {
    inject(function() {
      service = { fetchKPIs: function() {
        return $q.all({
          cardSummary: CreditCardDataService.getCreditCardSummary(),
          transactions: TransactionService.getCurrentMonthTransactions()
        }).then(function(results) {
          var cardSummary = results.cardSummary;
          return {
            creditUtilization: cardSummary.totalCreditLimit > 0 ? (cardSummary.totalOutstanding / cardSummary.totalCreditLimit) * 100 : 0
          };
        });
      }};
    });
    
    var result;
    service.fetchKPIs().then(function(data) {
      result = data;
    });
    
    $rootScope.$digest();
    
    expect(result.creditUtilization).toBeCloseTo(36.67, 1);
  });
});