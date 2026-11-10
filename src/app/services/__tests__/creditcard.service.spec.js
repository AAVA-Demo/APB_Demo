/*
Test Documentation:
- Test Name: CreditCardService Test Suite
- Purpose: Validate CreditCardService functionality for retrieving card portfolio, calculating KPIs, and refreshing data
- Scenario: Tests cover successful data retrieval, KPI calculations with various card scenarios, error handling, and data refresh
- Expected Result: Service correctly fetches card data, computes accurate KPIs, and handles edge cases and errors
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService, $httpBackend, API_ENDPOINTS;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _API_ENDPOINTS_) {
      CreditCardService = _CreditCardService_;
      $httpBackend = _$httpBackend_;
      API_ENDPOINTS = _API_ENDPOINTS_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCardPortfolio', function() {
      it('should successfully retrieve card portfolio with calculated KPIs', function() {
        var mockCards = [
          {
            cardType: 'Visa Platinum',
            creditLimit: 10000,
            availableCredit: 7000,
            outstandingAmount: 3000,
            monthlySpend: 1500
          },
          {
            cardType: 'MasterCard Gold',
            creditLimit: 5000,
            availableCredit: 3000,
            outstandingAmount: 2000,
            monthlySpend: 800
          }
        ];

        $httpBackend.expectGET(API_ENDPOINTS.cards)
          .respond(200, mockCards);

        var result;
        CreditCardService.getCardPortfolio().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.cards).toEqual(mockCards);
        expect(result.kpis).toBeDefined();
        expect(result.kpis.totalCreditLimit).toBe(15000);
        expect(result.kpis.totalAvailableCredit).toBe(10000);
        expect(result.kpis.totalOutstanding).toBe(5000);
        expect(result.kpis.totalMonthlySpend).toBe(2300);
        expect(result.kpis.cardCount).toBe(2);
      });

      it('should handle empty card portfolio', function() {
        $httpBackend.expectGET(API_ENDPOINTS.cards)
          .respond(200, []);

        var result;
        CreditCardService.getCardPortfolio().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.cards).toEqual([]);
        expect(result.kpis.totalCreditLimit).toBe(0);
        expect(result.kpis.totalAvailableCredit).toBe(0);
        expect(result.kpis.totalOutstanding).toBe(0);
        expect(result.kpis.totalMonthlySpend).toBe(0);
        expect(result.kpis.cardCount).toBe(0);
      });

      it('should reject promise on HTTP error', function() {
        $httpBackend.expectGET(API_ENDPOINTS.cards)
          .respond(500, 'Internal Server Error');

        var error;
        CreditCardService.getCardPortfolio().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle network failure', function() {
        $httpBackend.expectGET(API_ENDPOINTS.cards)
          .respond(0, '');

        var error;
        CreditCardService.getCardPortfolio().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(0);
      });
    });

    describe('calculateKPIs', function() {
      it('should calculate KPIs correctly for multiple cards', function() {
        var cards = [
          {
            creditLimit: 10000,
            availableCredit: 8000,
            outstandingAmount: 2000,
            monthlySpend: 1200
          },
          {
            creditLimit: 5000,
            availableCredit: 4000,
            outstandingAmount: 1000,
            monthlySpend: 600
          },
          {
            creditLimit: 15000,
            availableCredit: 12000,
            outstandingAmount: 3000,
            monthlySpend: 2000
          }
        ];

        var kpis = CreditCardService.calculateKPIs(cards);

        expect(kpis.totalCreditLimit).toBe(30000);
        expect(kpis.totalAvailableCredit).toBe(24000);
        expect(kpis.totalOutstanding).toBe(6000);
        expect(kpis.totalMonthlySpend).toBe(3800);
        expect(kpis.cardCount).toBe(3);
      });

      it('should handle cards with missing or null values', function() {
        var cards = [
          {
            creditLimit: 10000,
            availableCredit: null,
            outstandingAmount: 2000,
            monthlySpend: undefined
          },
          {
            creditLimit: null,
            availableCredit: 4000,
            outstandingAmount: null,
            monthlySpend: 500
          }
        ];

        var kpis = CreditCardService.calculateKPIs(cards);

        expect(kpis.totalCreditLimit).toBe(10000);
        expect(kpis.totalAvailableCredit).toBe(4000);
        expect(kpis.totalOutstanding).toBe(2000);
        expect(kpis.totalMonthlySpend).toBe(500);
        expect(kpis.cardCount).toBe(2);
      });

      it('should handle single card', function() {
        var cards = [
          {
            creditLimit: 8000,
            availableCredit: 6000,
            outstandingAmount: 2000,
            monthlySpend: 1000
          }
        ];

        var kpis = CreditCardService.calculateKPIs(cards);

        expect(kpis.totalCreditLimit).toBe(8000);
        expect(kpis.totalAvailableCredit).toBe(6000);
        expect(kpis.totalOutstanding).toBe(2000);
        expect(kpis.totalMonthlySpend).toBe(1000);
        expect(kpis.cardCount).toBe(1);
      });

      it('should return zero KPIs for empty card array', function() {
        var cards = [];

        var kpis = CreditCardService.calculateKPIs(cards);

        expect(kpis.totalCreditLimit).toBe(0);
        expect(kpis.totalAvailableCredit).toBe(0);
        expect(kpis.totalOutstanding).toBe(0);
        expect(kpis.totalMonthlySpend).toBe(0);
        expect(kpis.cardCount).toBe(0);
      });

      it('should handle cards with zero values', function() {
        var cards = [
          {
            creditLimit: 0,
            availableCredit: 0,
            outstandingAmount: 0,
            monthlySpend: 0
          },
          {
            creditLimit: 5000,
            availableCredit: 5000,
            outstandingAmount: 0,
            monthlySpend: 0
          }
        ];

        var kpis = CreditCardService.calculateKPIs(cards);

        expect(kpis.totalCreditLimit).toBe(5000);
        expect(kpis.totalAvailableCredit).toBe(5000);
        expect(kpis.totalOutstanding).toBe(0);
        expect(kpis.totalMonthlySpend).toBe(0);
        expect(kpis.cardCount).toBe(2);
      });

      it('should handle cards with negative values (edge case)', function() {
        var cards = [
          {
            creditLimit: 10000,
            availableCredit: 8000,
            outstandingAmount: -500,
            monthlySpend: 1000
          }
        ];

        var kpis = CreditCardService.calculateKPIs(cards);

        expect(kpis.totalOutstanding).toBe(-500);
      });

      it('should handle large numbers', function() {
        var cards = [
          {
            creditLimit: 100000,
            availableCredit: 80000,
            outstandingAmount: 20000,
            monthlySpend: 15000
          },
          {
            creditLimit: 200000,
            availableCredit: 150000,
            outstandingAmount: 50000,
            monthlySpend: 30000
          }
        ];

        var kpis = CreditCardService.calculateKPIs(cards);

        expect(kpis.totalCreditLimit).toBe(300000);
        expect(kpis.totalAvailableCredit).toBe(230000);
        expect(kpis.totalOutstanding).toBe(70000);
        expect(kpis.totalMonthlySpend).toBe(45000);
      });
    });

    describe('refreshData', function() {
      it('should call getCardPortfolio and return updated data', function() {
        var mockCards = [
          {
            cardType: 'Amex Blue',
            creditLimit: 12000,
            availableCredit: 9000,
            outstandingAmount: 3000,
            monthlySpend: 1800
          }
        ];

        $httpBackend.expectGET(API_ENDPOINTS.cards)
          .respond(200, mockCards);

        var result;
        CreditCardService.refreshData().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.cards).toEqual(mockCards);
        expect(result.kpis.cardCount).toBe(1);
        expect(result.kpis.totalCreditLimit).toBe(12000);
      });

      it('should handle errors during refresh', function() {
        $httpBackend.expectGET(API_ENDPOINTS.cards)
          .respond(503, 'Service Unavailable');

        var error;
        CreditCardService.refreshData().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(503);
      });

      it('should be callable multiple times', function() {
        var mockCards1 = [{ creditLimit: 5000, availableCredit: 3000, outstandingAmount: 2000, monthlySpend: 1000 }];
        var mockCards2 = [{ creditLimit: 8000, availableCredit: 6000, outstandingAmount: 2000, monthlySpend: 1500 }];

        $httpBackend.expectGET(API_ENDPOINTS.cards)
          .respond(200, mockCards1);

        var result1;
        CreditCardService.refreshData().then(function(data) {
          result1 = data;
        });

        $httpBackend.flush();
        expect(result1.kpis.totalCreditLimit).toBe(5000);

        $httpBackend.expectGET(API_ENDPOINTS.cards)
          .respond(200, mockCards2);

        var result2;
        CreditCardService.refreshData().then(function(data) {
          result2 = data;
        });

        $httpBackend.flush();
        expect(result2.kpis.totalCreditLimit).toBe(8000);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getCardPortfolio, calculateKPIs, refreshData
- Scenarios covered:
  * Successful card portfolio retrieval with multiple cards
  * Empty card portfolio handling
  * HTTP error responses (500, 503)
  * Network failures
  * KPI calculations with valid data
  * KPI calculations with missing/null/undefined values
  * Single card scenarios
  * Zero values handling
  * Negative values (edge case)
  * Large numbers
  * Data refresh functionality
  * Multiple refresh calls
- Edge cases: Empty arrays, null values, zero values, negative values, large numbers, network errors
- Uncovered scenarios: None - all public methods, calculations, and error paths tested
*/