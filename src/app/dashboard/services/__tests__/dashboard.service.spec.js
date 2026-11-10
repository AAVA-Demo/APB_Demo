/*
Test Documentation:
- Test Name: DashboardService - getKPIs success
- Purpose: Validates KPI aggregation from multiple cards
- Scenario: Multiple cards with valid data
- Expected Result: Aggregated KPIs with correct totals

- Test Name: DashboardService - getKPIs with empty cards
- Purpose: Validates handling of empty card array
- Scenario: No cards returned from API
- Expected Result: KPIs with zero values

- Test Name: DashboardService - getKPIs with missing card properties
- Purpose: Validates handling of incomplete card data
- Scenario: Cards with missing or undefined properties
- Expected Result: KPIs calculated with default zero values

- Test Name: DashboardService - getKPIs error handling
- Purpose: Validates error propagation from API factory
- Scenario: API factory returns rejected promise
- Expected Result: Error is propagated to caller
*/

/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered: successful aggregation, empty data, missing properties, error handling
- Edge cases: null/undefined card properties, empty array, API failures
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('DashboardService', function() {
    var DashboardService;
    var CreditCardAPIFactory;
    var $q;
    var $rootScope;

    beforeEach(module('dashboard'));

    beforeEach(inject(function(_DashboardService_, _CreditCardAPIFactory_, _$q_, _$rootScope_) {
      DashboardService = _DashboardService_;
      CreditCardAPIFactory = _CreditCardAPIFactory_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getKPIs', function() {
      it('should aggregate KPIs from multiple cards successfully', function() {
        var mockCards = [
          { cardId: 'card-001', monthlySpend: 1250.50, creditLimit: 10000, availableCredit: 8749.50, outstandingBalance: 1250.50 },
          { cardId: 'card-002', monthlySpend: 890.25, creditLimit: 15000, availableCredit: 14109.75, outstandingBalance: 890.25 },
          { cardId: 'card-003', monthlySpend: 2100.00, creditLimit: 20000, availableCredit: 17900.00, outstandingBalance: 2100.00 }
        ];
        spyOn(CreditCardAPIFactory, 'getAllCardsSummary').and.returnValue($q.resolve(mockCards));
        
        var result;
        DashboardService.getKPIs('user-001').then(function(kpis) {
          result = kpis;
        });
        $rootScope.$apply();

        expect(result.userId).toBe('user-001');
        expect(result.monthlySpend).toBe(4240.75);
        expect(result.totalCreditLimit).toBe(45000);
        expect(result.availableCredit).toBe(40759.25);
        expect(result.outstandingAmount).toBe(4240.75);
        expect(result.lastUpdated).toBeDefined();
        expect(result.lastUpdated instanceof Date).toBe(true);
      });

      it('should handle empty cards array', function() {
        spyOn(CreditCardAPIFactory, 'getAllCardsSummary').and.returnValue($q.resolve([]));
        
        var result;
        DashboardService.getKPIs('user-002').then(function(kpis) {
          result = kpis;
        });
        $rootScope.$apply();

        expect(result.userId).toBe('user-002');
        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
      });

      it('should handle cards with missing properties', function() {
        var mockCards = [
          { cardId: 'card-001', creditLimit: 10000 },
          { cardId: 'card-002', monthlySpend: 500 },
          { cardId: 'card-003' }
        ];
        spyOn(CreditCardAPIFactory, 'getAllCardsSummary').and.returnValue($q.resolve(mockCards));
        
        var result;
        DashboardService.getKPIs('user-003').then(function(kpis) {
          result = kpis;
        });
        $rootScope.$apply();

        expect(result.monthlySpend).toBe(500);
        expect(result.totalCreditLimit).toBe(10000);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
      });

      it('should handle cards with null values', function() {
        var mockCards = [
          { cardId: 'card-001', monthlySpend: null, creditLimit: 5000, availableCredit: null, outstandingBalance: null }
        ];
        spyOn(CreditCardAPIFactory, 'getAllCardsSummary').and.returnValue($q.resolve(mockCards));
        
        var result;
        DashboardService.getKPIs('user-004').then(function(kpis) {
          result = kpis;
        });
        $rootScope.$apply();

        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(5000);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
      });

      it('should propagate errors from CreditCardAPIFactory', function() {
        var errorMessage = 'API Error';
        spyOn(CreditCardAPIFactory, 'getAllCardsSummary').and.returnValue($q.reject(errorMessage));
        
        var errorResult;
        DashboardService.getKPIs('user-005').catch(function(error) {
          errorResult = error;
        });
        $rootScope.$apply();

        expect(errorResult).toBe(errorMessage);
      });

      it('should handle single card correctly', function() {
        var mockCards = [
          { cardId: 'card-001', monthlySpend: 1500, creditLimit: 10000, availableCredit: 8500, outstandingBalance: 1500 }
        ];
        spyOn(CreditCardAPIFactory, 'getAllCardsSummary').and.returnValue($q.resolve(mockCards));
        
        var result;
        DashboardService.getKPIs('user-006').then(function(kpis) {
          result = kpis;
        });
        $rootScope.$apply();

        expect(result.monthlySpend).toBe(1500);
        expect(result.totalCreditLimit).toBe(10000);
        expect(result.availableCredit).toBe(8500);
        expect(result.outstandingAmount).toBe(1500);
      });

      it('should handle decimal values correctly', function() {
        var mockCards = [
          { cardId: 'card-001', monthlySpend: 123.45, creditLimit: 5000.50, availableCredit: 4877.05, outstandingBalance: 123.45 },
          { cardId: 'card-002', monthlySpend: 678.90, creditLimit: 7500.75, availableCredit: 6821.85, outstandingBalance: 678.90 }
        ];
        spyOn(CreditCardAPIFactory, 'getAllCardsSummary').and.returnValue($q.resolve(mockCards));
        
        var result;
        DashboardService.getKPIs('user-007').then(function(kpis) {
          result = kpis;
        });
        $rootScope.$apply();

        expect(result.monthlySpend).toBeCloseTo(802.35, 2);
        expect(result.totalCreditLimit).toBeCloseTo(12501.25, 2);
        expect(result.availableCredit).toBeCloseTo(11698.90, 2);
        expect(result.outstandingAmount).toBeCloseTo(802.35, 2);
      });
    });
  });
})();