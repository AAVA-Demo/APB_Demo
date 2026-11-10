/*
Test Documentation:
- Test Name: KPICalculationService - calculateKPIs success
- Purpose: Validates KPI calculation with credit card data and monthly transactions
- Scenario: Valid credit cards and transaction data provided
- Expected Result: Returns calculated KPIs including monthly spend, limits, and balances

- Test Name: KPICalculationService - calculateKPIs with empty cards
- Purpose: Validates handling of empty credit card array
- Scenario: Empty array passed to calculateKPIs
- Expected Result: Returns zero values for all KPIs

- Test Name: KPICalculationService - calculateKPIs transaction API error
- Purpose: Validates fallback when transaction API fails
- Scenario: Credit card data valid but transaction API fails
- Expected Result: Returns KPIs with monthlySpend as 0, other values calculated

- Test Name: KPICalculationService - calculateKPIs with missing card properties
- Purpose: Validates handling of cards with null/undefined properties
- Scenario: Cards have missing creditLimit, currentBalance, or availableCredit
- Expected Result: Treats missing values as 0 and calculates correctly

Coverage Report:
- Functions tested: calculateKPIs
- Scenarios covered: success, empty cards, transaction error, missing properties
- Edge cases: null values, undefined properties, empty transaction array
- Uncovered scenarios: negative balances (business logic constraint)
*/

(function() {
  'use strict';

  describe('KPICalculationService', function() {
    var KPICalculationService, $httpBackend, API_BASE_URL;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KPICalculationService_, _$httpBackend_, _API_BASE_URL_) {
      KPICalculationService = _KPICalculationService_;
      $httpBackend = _$httpBackend_;
      API_BASE_URL = _API_BASE_URL_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('calculateKPIs', function() {
      it('should calculate KPIs successfully with valid data', function() {
        var creditCards = [
          { cardId: 'card-001', creditLimit: 5000, currentBalance: 1200, availableCredit: 3800 },
          { cardId: 'card-002', creditLimit: 10000, currentBalance: 2500, availableCredit: 7500 }
        ];

        var mockTransactions = [
          { transactionId: 'txn-001', amount: 150 },
          { transactionId: 'txn-002', amount: 250 },
          { transactionId: 'txn-003', amount: 100 }
        ];

        $httpBackend.expectGET(API_BASE_URL + '/transactions/monthly')
          .respond(200, mockTransactions);

        var result;
        KPICalculationService.calculateKPIs(creditCards).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.monthlySpend).toBe(500);
        expect(result.totalCreditLimit).toBe(15000);
        expect(result.totalAvailableCredit).toBe(11300);
        expect(result.totalOutstanding).toBe(3700);
        expect(result.cardCount).toBe(2);
        expect(result.lastRefreshTime).toBeDefined();
        expect(result.lastRefreshTime instanceof Date).toBe(true);
      });

      it('should handle empty credit card array', function() {
        var creditCards = [];
        var mockTransactions = [];

        $httpBackend.expectGET(API_BASE_URL + '/transactions/monthly')
          .respond(200, mockTransactions);

        var result;
        KPICalculationService.calculateKPIs(creditCards).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(0);
        expect(result.totalAvailableCredit).toBe(0);
        expect(result.totalOutstanding).toBe(0);
        expect(result.cardCount).toBe(0);
      });

      it('should handle transaction API error gracefully', function() {
        var creditCards = [
          { cardId: 'card-001', creditLimit: 5000, currentBalance: 1200, availableCredit: 3800 }
        ];

        spyOn(console, 'error');

        $httpBackend.expectGET(API_BASE_URL + '/transactions/monthly')
          .respond(500, { message: 'Server error' });

        var result;
        KPICalculationService.calculateKPIs(creditCards).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(5000);
        expect(result.totalAvailableCredit).toBe(3800);
        expect(result.totalOutstanding).toBe(1200);
        expect(result.cardCount).toBe(1);
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle cards with missing properties', function() {
        var creditCards = [
          { cardId: 'card-001', creditLimit: 5000 },
          { cardId: 'card-002', currentBalance: 1000 },
          { cardId: 'card-003', availableCredit: 2000 }
        ];

        var mockTransactions = [{ amount: 100 }];

        $httpBackend.expectGET(API_BASE_URL + '/transactions/monthly')
          .respond(200, mockTransactions);

        var result;
        KPICalculationService.calculateKPIs(creditCards).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.totalCreditLimit).toBe(5000);
        expect(result.totalOutstanding).toBe(1000);
        expect(result.totalAvailableCredit).toBe(2000);
        expect(result.cardCount).toBe(3);
      });

      it('should handle transactions with missing amounts', function() {
        var creditCards = [
          { cardId: 'card-001', creditLimit: 5000, currentBalance: 1000, availableCredit: 4000 }
        ];

        var mockTransactions = [
          { transactionId: 'txn-001', amount: 100 },
          { transactionId: 'txn-002' },
          { transactionId: 'txn-003', amount: null },
          { transactionId: 'txn-004', amount: 50 }
        ];

        $httpBackend.expectGET(API_BASE_URL + '/transactions/monthly')
          .respond(200, mockTransactions);

        var result;
        KPICalculationService.calculateKPIs(creditCards).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.monthlySpend).toBe(150);
      });

      it('should handle empty transaction array', function() {
        var creditCards = [
          { cardId: 'card-001', creditLimit: 5000, currentBalance: 1200, availableCredit: 3800 }
        ];

        $httpBackend.expectGET(API_BASE_URL + '/transactions/monthly')
          .respond(200, []);

        var result;
        KPICalculationService.calculateKPIs(creditCards).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(5000);
      });

      it('should set lastRefreshTime to current date', function() {
        var creditCards = [{ cardId: 'card-001', creditLimit: 1000, currentBalance: 0, availableCredit: 1000 }];
        var mockTransactions = [];
        var beforeTime = new Date();

        $httpBackend.expectGET(API_BASE_URL + '/transactions/monthly')
          .respond(200, mockTransactions);

        var result;
        KPICalculationService.calculateKPIs(creditCards).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        var afterTime = new Date();

        expect(result.lastRefreshTime).toBeDefined();
        expect(result.lastRefreshTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
        expect(result.lastRefreshTime.getTime()).toBeLessThanOrEqual(afterTime.getTime());
      });
    });
  });
})();