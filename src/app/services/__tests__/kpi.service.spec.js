/*
Test Documentation:
- Test Name: KPIService - getKPIs success
- Purpose: Validates successful aggregation of KPI data from cards and transactions
- Scenario: CreditCardService and TransactionService return data, KPICalculator computes KPIs
- Expected Result: Promise resolves with calculated KPI data
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIs handles card service failure
- Purpose: Validates error handling when credit card service fails
- Scenario: CreditCardService.getAllCards rejects
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIs handles transaction service failure
- Purpose: Validates error handling when transaction service fails
- Scenario: TransactionService.getMonthlySpend rejects
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered: success with data, card service failure, transaction service failure
- Uncovered scenarios: none
*/

describe('KPIService', function() {
  'use strict';

  beforeEach(module('app.dashboard'));

  var KPIService, CreditCardService, TransactionService, KPICalculator, $q, $rootScope;

  beforeEach(inject(function(_KPIService_, _CreditCardService_, _TransactionService_, _KPICalculator_, _$q_, _$rootScope_) {
    KPIService = _KPIService_;
    CreditCardService = _CreditCardService_;
    TransactionService = _TransactionService_;
    KPICalculator = _KPICalculator_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getKPIs', function() {
    it('should calculate KPIs successfully from cards and transactions', function(done) {
      var mockCards = [
        { cardId: 'card1', creditLimit: 5000, outstandingAmount: 1000, availableCredit: 4000 },
        { cardId: 'card2', creditLimit: 10000, outstandingAmount: 3000, availableCredit: 7000 }
      ];
      var mockTransactions = [
        { amount: 100, date: '2023-01-15' },
        { amount: 200, date: '2023-01-14' }
      ];
      var mockKPIData = {
        monthlySpend: 300,
        totalCreditLimit: 15000,
        availableCredit: 11000,
        outstandingAmount: 4000,
        creditUtilization: 27,
        lastUpdated: new Date()
      };

      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve(mockTransactions));
      spyOn(KPICalculator, 'calculateKPIs').and.returnValue(mockKPIData);

      KPIService.getKPIs().then(function(result) {
        expect(result).toEqual(mockKPIData);
        expect(CreditCardService.getAllCards).toHaveBeenCalled();
        expect(TransactionService.getMonthlySpend).toHaveBeenCalled();
        expect(KPICalculator.calculateKPIs).toHaveBeenCalledWith(mockCards, mockTransactions);
        done();
      });

      $rootScope.$digest();
    });

    it('should reject when credit card service fails', function(done) {
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.reject('Card service error'));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve([]));

      KPIService.getKPIs().catch(function(error) {
        expect(error).toBe('Card service error');
        expect(CreditCardService.getAllCards).toHaveBeenCalled();
        done();
      });

      $rootScope.$digest();
    });

    it('should reject when transaction service fails', function(done) {
      var mockCards = [{ cardId: 'card1', creditLimit: 5000 }];
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.reject('Transaction service error'));

      KPIService.getKPIs().catch(function(error) {
        expect(error).toBe('Transaction service error');
        expect(TransactionService.getMonthlySpend).toHaveBeenCalled();
        done();
      });

      $rootScope.$digest();
    });

    it('should handle empty cards and transactions', function(done) {
      var mockKPIData = {
        monthlySpend: 0,
        totalCreditLimit: 0,
        availableCredit: 0,
        outstandingAmount: 0,
        creditUtilization: 0,
        lastUpdated: new Date()
      };

      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve([]));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve([]));
      spyOn(KPICalculator, 'calculateKPIs').and.returnValue(mockKPIData);

      KPIService.getKPIs().then(function(result) {
        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(0);
        expect(KPICalculator.calculateKPIs).toHaveBeenCalledWith([], []);
        done();
      });

      $rootScope.$digest();
    });
  });
});