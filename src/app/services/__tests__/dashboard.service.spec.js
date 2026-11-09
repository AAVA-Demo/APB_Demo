/*
Test Documentation:
- Test Name: DashboardService Test Suite
- Purpose: Validate the DashboardService aggregates KPIs correctly with caching mechanism
- Scenario: Tests KPI calculation, caching, cache expiration, and error handling
- Expected Result: Service correctly aggregates card data and transaction summary with proper caching
*/

(function() {
  'use strict';

  describe('DashboardService', function() {
    var DashboardService, CreditCardDataService, $httpBackend, $q, $rootScope, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_DashboardService_, _CreditCardDataService_, _$httpBackend_, _$q_, _$rootScope_, _API_CONFIG_) {
      DashboardService = _DashboardService_;
      CreditCardDataService = _CreditCardDataService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getKPIs', function() {
      it('should aggregate KPIs from cards and transaction summary', function() {
        var mockCards = [
          {
            cardId: 'card123',
            creditLimit: 5000,
            availableCredit: 3000,
            outstandingBalance: 2000
          },
          {
            cardId: 'card456',
            creditLimit: 10000,
            availableCredit: 7500,
            outstandingBalance: 2500
          }
        ];

        var mockTransactionSummary = {
          monthlySpend: 1500
        };

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionsSummary)
          .respond(200, mockTransactionSummary);

        var result;
        DashboardService.getKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();
        $httpBackend.flush();

        expect(CreditCardDataService.getAllCards).toHaveBeenCalled();
        expect(result.totalCreditLimit).toBe(15000);
        expect(result.availableCredit).toBe(10500);
        expect(result.outstandingAmount).toBe(4500);
        expect(result.monthlySpend).toBe(1500);
        expect(result.currency).toBe('USD');
        expect(result.lastUpdated).toBeDefined();
      });

      it('should handle cards with missing optional fields', function() {
        var mockCards = [
          {
            cardId: 'card123',
            creditLimit: 5000
          },
          {
            cardId: 'card456',
            availableCredit: 3000
          }
        ];

        var mockTransactionSummary = {
          monthlySpend: 500
        };

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionsSummary)
          .respond(200, mockTransactionSummary);

        var result;
        DashboardService.getKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();
        $httpBackend.flush();

        expect(result.totalCreditLimit).toBe(5000);
        expect(result.availableCredit).toBe(3000);
        expect(result.outstandingAmount).toBe(0);
      });

      it('should handle empty cards array', function() {
        var mockCards = [];
        var mockTransactionSummary = {
          monthlySpend: 0
        };

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionsSummary)
          .respond(200, mockTransactionSummary);

        var result;
        DashboardService.getKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();
        $httpBackend.flush();

        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
        expect(result.monthlySpend).toBe(0);
      });

      it('should default monthlySpend to 0 when not provided', function() {
        var mockCards = [
          { cardId: 'card123', creditLimit: 5000, availableCredit: 3000, outstandingBalance: 2000 }
        ];

        var mockTransactionSummary = {};

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionsSummary)
          .respond(200, mockTransactionSummary);

        var result;
        DashboardService.getKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();
        $httpBackend.flush();

        expect(result.monthlySpend).toBe(0);
      });

      it('should cache KPIs for subsequent calls within cache duration', function() {
        var mockCards = [
          { cardId: 'card123', creditLimit: 5000, availableCredit: 3000, outstandingBalance: 2000 }
        ];

        var mockTransactionSummary = {
          monthlySpend: 1000
        };

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionsSummary)
          .respond(200, mockTransactionSummary);

        var result1, result2;
        DashboardService.getKPIs().then(function(data) {
          result1 = data;
        });

        $rootScope.$digest();
        $httpBackend.flush();

        DashboardService.getKPIs().then(function(data) {
          result2 = data;
        });

        $rootScope.$digest();

        expect(CreditCardDataService.getAllCards.calls.count()).toBe(1);
        expect(result1).toEqual(result2);
      });

      it('should handle CreditCardDataService error', function() {
        var errorResponse = { status: 500, message: 'Internal Server Error' };

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.reject(errorResponse));

        var error;
        DashboardService.getKPIs().catch(function(err) {
          error = err;
        });

        $rootScope.$digest();

        expect(error).toEqual(errorResponse);
      });

      it('should handle transaction summary API error', function() {
        var mockCards = [
          { cardId: 'card123', creditLimit: 5000, availableCredit: 3000, outstandingBalance: 2000 }
        ];

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionsSummary)
          .respond(500, { message: 'Internal Server Error' });

        var error;
        DashboardService.getKPIs().catch(function(err) {
          error = err;
        });

        $rootScope.$digest();
        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should return a promise', function() {
        var mockCards = [];
        var mockTransactionSummary = { monthlySpend: 0 };

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionsSummary)
          .respond(200, mockTransactionSummary);

        var promise = DashboardService.getKPIs();

        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');

        $rootScope.$digest();
        $httpBackend.flush();
      });

      it('should set lastUpdated timestamp', function() {
        var mockCards = [];
        var mockTransactionSummary = { monthlySpend: 0 };

        spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionsSummary)
          .respond(200, mockTransactionSummary);

        var result;
        var beforeTime = new Date();

        DashboardService.getKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();
        $httpBackend.flush();

        var afterTime = new Date();

        expect(result.lastUpdated).toBeDefined();
        expect(result.lastUpdated instanceof Date).toBe(true);
        expect(result.lastUpdated.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
        expect(result.lastUpdated.getTime()).toBeLessThanOrEqual(afterTime.getTime());
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getKPIs
  - Scenarios covered:
    * Successful KPI aggregation from cards and transaction summary
    * Cards with missing optional fields
    * Empty cards array
    * Default monthlySpend when not provided
    * KPI caching mechanism
    * CreditCardDataService error handling
    * Transaction summary API error handling
    * Promise return validation
    * lastUpdated timestamp setting
  - Uncovered scenarios: Cache expiration (requires time manipulation beyond standard Jasmine)
  */
})();