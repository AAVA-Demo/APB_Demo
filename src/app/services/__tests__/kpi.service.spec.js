/*
Test Documentation:
- Test Name: KPIService Unit Tests
- Purpose: Validate KPI calculation including monthly spend, credit limits, available credit, and utilization rate
- Scenario: Tests getKPIData and refreshKPIData methods with various card data scenarios
- Expected Result: Correct KPI calculations with proper aggregation across multiple cards
*/

(function() {
  'use strict';

  describe('KPIService', function() {
    var KPIService, CreditCardDataService, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KPIService_, _CreditCardDataService_, _$q_, _$rootScope_) {
      KPIService = _KPIService_;
      CreditCardDataService = _CreditCardDataService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getKPIData', function() {
      it('should calculate KPI data correctly for user with multiple cards', function(done) {
        var mockCardData = {
          cards: [
            { creditLimit: 10000, balance: 2500, currentMonthSpend: 1200 },
            { creditLimit: 15000, balance: 3000, currentMonthSpend: 1500 },
            { creditLimit: 5000, balance: 1000, currentMonthSpend: 500 }
          ]
        };

        spyOn(CreditCardDataService, 'getCardData').and.returnValue($q.resolve(mockCardData));

        KPIService.getKPIData('user123').then(function(kpiData) {
          expect(kpiData.totalCreditLimit).toBe(30000);
          expect(kpiData.outstandingAmount).toBe(6500);
          expect(kpiData.monthlySpend).toBe(3200);
          expect(kpiData.availableCredit).toBe(23500);
          expect(kpiData.utilizationRate).toBeCloseTo(21.67, 2);
          expect(kpiData.lastUpdated).toBeDefined();
          done();
        });

        $rootScope.$digest();
      });

      it('should handle user with single card', function(done) {
        var mockCardData = {
          cards: [
            { creditLimit: 10000, balance: 2500, currentMonthSpend: 1200 }
          ]
        };

        spyOn(CreditCardDataService, 'getCardData').and.returnValue($q.resolve(mockCardData));

        KPIService.getKPIData('user123').then(function(kpiData) {
          expect(kpiData.totalCreditLimit).toBe(10000);
          expect(kpiData.outstandingAmount).toBe(2500);
          expect(kpiData.monthlySpend).toBe(1200);
          expect(kpiData.availableCredit).toBe(7500);
          expect(kpiData.utilizationRate).toBe(25);
          done();
        });

        $rootScope.$digest();
      });

      it('should handle user with no cards', function(done) {
        var mockCardData = {
          cards: []
        };

        spyOn(CreditCardDataService, 'getCardData').and.returnValue($q.resolve(mockCardData));

        KPIService.getKPIData('user123').then(function(kpiData) {
          expect(kpiData.totalCreditLimit).toBe(0);
          expect(kpiData.outstandingAmount).toBe(0);
          expect(kpiData.monthlySpend).toBe(0);
          expect(kpiData.availableCredit).toBe(0);
          expect(kpiData.utilizationRate).toBe(0);
          done();
        });

        $rootScope.$digest();
      });

      it('should handle cards with missing or null values', function(done) {
        var mockCardData = {
          cards: [
            { creditLimit: 10000, balance: null, currentMonthSpend: 1200 },
            { creditLimit: null, balance: 2000, currentMonthSpend: null },
            { creditLimit: 5000, balance: 1000, currentMonthSpend: 500 }
          ]
        };

        spyOn(CreditCardDataService, 'getCardData').and.returnValue($q.resolve(mockCardData));

        KPIService.getKPIData('user123').then(function(kpiData) {
          expect(kpiData.totalCreditLimit).toBe(15000);
          expect(kpiData.outstandingAmount).toBe(3000);
          expect(kpiData.monthlySpend).toBe(1700);
          expect(kpiData.availableCredit).toBe(12000);
          done();
        });

        $rootScope.$digest();
      });

      it('should calculate utilization rate as 0 when total credit limit is 0', function(done) {
        var mockCardData = {
          cards: [
            { creditLimit: 0, balance: 0, currentMonthSpend: 0 }
          ]
        };

        spyOn(CreditCardDataService, 'getCardData').and.returnValue($q.resolve(mockCardData));

        KPIService.getKPIData('user123').then(function(kpiData) {
          expect(kpiData.utilizationRate).toBe(0);
          done();
        });

        $rootScope.$digest();
      });

      it('should handle 100% utilization rate', function(done) {
        var mockCardData = {
          cards: [
            { creditLimit: 10000, balance: 10000, currentMonthSpend: 5000 }
          ]
        };

        spyOn(CreditCardDataService, 'getCardData').and.returnValue($q.resolve(mockCardData));

        KPIService.getKPIData('user123').then(function(kpiData) {
          expect(kpiData.utilizationRate).toBe(100);
          expect(kpiData.availableCredit).toBe(0);
          done();
        });

        $rootScope.$digest();
      });

      it('should handle null cardData', function(done) {
        spyOn(CreditCardDataService, 'getCardData').and.returnValue($q.resolve(null));

        KPIService.getKPIData('user123').then(function(kpiData) {
          expect(kpiData.totalCreditLimit).toBe(0);
          expect(kpiData.outstandingAmount).toBe(0);
          expect(kpiData.monthlySpend).toBe(0);
          expect(kpiData.availableCredit).toBe(0);
          expect(kpiData.utilizationRate).toBe(0);
          done();
        });

        $rootScope.$digest();
      });

      it('should reject promise when CreditCardDataService fails', function(done) {
        spyOn(CreditCardDataService, 'getCardData').and.returnValue($q.reject({ error: 'Service error' }));

        KPIService.getKPIData('user123').then(function() {
          fail('Should not resolve on service error');
        }, function(error) {
          expect(error.error).toBe('Service error');
          done();
        });

        $rootScope.$digest();
      });

      it('should handle user with 10 cards (NFR requirement)', function(done) {
        var mockCardData = {
          cards: []
        };

        for (var i = 1; i <= 10; i++) {
          mockCardData.cards.push({
            creditLimit: 10000,
            balance: 2000,
            currentMonthSpend: 500
          });
        }

        spyOn(CreditCardDataService, 'getCardData').and.returnValue($q.resolve(mockCardData));

        KPIService.getKPIData('user123').then(function(kpiData) {
          expect(kpiData.totalCreditLimit).toBe(100000);
          expect(kpiData.outstandingAmount).toBe(20000);
          expect(kpiData.monthlySpend).toBe(5000);
          expect(kpiData.availableCredit).toBe(80000);
          expect(kpiData.utilizationRate).toBe(20);
          done();
        });

        $rootScope.$digest();
      });
    });

    describe('refreshKPIData', function() {
      it('should call getKPIData and return updated data', function(done) {
        var mockCardData = {
          cards: [
            { creditLimit: 10000, balance: 3000, currentMonthSpend: 1500 }
          ]
        };

        spyOn(CreditCardDataService, 'getCardData').and.returnValue($q.resolve(mockCardData));

        KPIService.refreshKPIData('user123').then(function(kpiData) {
          expect(kpiData.totalCreditLimit).toBe(10000);
          expect(kpiData.outstandingAmount).toBe(3000);
          expect(CreditCardDataService.getCardData).toHaveBeenCalledWith('user123');
          done();
        });

        $rootScope.$digest();
      });

      it('should handle refresh errors', function(done) {
        spyOn(CreditCardDataService, 'getCardData').and.returnValue($q.reject({ error: 'Refresh failed' }));

        KPIService.refreshKPIData('user123').then(function() {
          fail('Should not resolve on refresh error');
        }, function(error) {
          expect(error.error).toBe('Refresh failed');
          done();
        });

        $rootScope.$digest();
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getKPIData, refreshKPIData
- Scenarios covered:
  * Multiple cards KPI calculation
  * Single card KPI calculation
  * No cards scenario
  * Missing/null card values
  * Zero credit limit utilization
  * 100% utilization rate
  * Null cardData
  * Service error handling
  * 10 cards (NFR requirement)
  * Refresh KPI data
  * Refresh error handling
- Edge cases: Empty arrays, null values, zero limits, 100% utilization, 10+ cards
- Error scenarios: Service failures, null data
- Uncovered scenarios: None - comprehensive coverage achieved
*/