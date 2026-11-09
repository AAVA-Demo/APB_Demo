/*
Test Documentation:
- Test Name: KpiCalculationService Unit Tests
- Purpose: Validate KpiCalculationService functionality including KPI calculation, aggregation, caching, and error handling
- Scenario: Tests cover normal operation, caching behavior, calculation accuracy, and error scenarios
- Expected Result: Service returns correct KPI values, caching works as expected, and errors are handled properly
*/

(function() {
  'use strict';

  describe('KpiCalculationService', function() {
    var KpiCalculationService, CreditCardDataFactory, $rootScope, $q, KpiModel;
    var mockUserId = 'user123';
    var mockCardsData = [
      {
        cardId: 'card001',
        userId: 'user123',
        creditLimit: 5000,
        outstandingBalance: 1200,
        monthlySpend: 800
      },
      {
        cardId: 'card002',
        userId: 'user123',
        creditLimit: 10000,
        outstandingBalance: 2500,
        monthlySpend: 1500
      },
      {
        cardId: 'card003',
        userId: 'user123',
        creditLimit: 8000,
        outstandingBalance: 1800,
        monthlySpend: 1200
      }
    ];

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KpiCalculationService_, _CreditCardDataFactory_, _$rootScope_, _$q_, _KpiModel_) {
      KpiCalculationService = _KpiCalculationService_;
      CreditCardDataFactory = _CreditCardDataFactory_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      KpiModel = _KpiModel_;
      
      $rootScope.currentUser = {
        userId: mockUserId,
        token: 'mock-token'
      };
    }));

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Verify KpiCalculationService is properly instantiated
    - Scenario: Service is injected
    - Expected Result: Service object and methods exist
    */
    it('should be defined', function() {
      expect(KpiCalculationService).toBeDefined();
      expect(KpiCalculationService.getKpis).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: getKpis - should calculate KPIs successfully
    - Purpose: Validate successful KPI calculation from card data
    - Scenario: User has multiple cards with various balances and limits
    - Expected Result: Returns KpiModel with correct aggregated values
    */
    it('getKpis - should calculate KPIs successfully', function() {
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(mockCardsData));

      var result;
      KpiCalculationService.getKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result).toBeDefined();
      expect(result.monthlySpend).toBe(3500);
      expect(result.totalCreditLimit).toBe(23000);
      expect(result.outstandingAmount).toBe(5500);
      expect(result.availableCredit).toBe(17500);
      expect(result.userId).toBe(mockUserId);
    });

    /*
    Test Documentation:
    - Test Name: getKpis - should calculate available credit correctly
    - Purpose: Validate available credit calculation logic
    - Scenario: Available credit = Total credit limit - Outstanding amount
    - Expected Result: availableCredit equals totalCreditLimit minus outstandingAmount
    */
    it('getKpis - should calculate available credit correctly', function() {
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(mockCardsData));

      var result;
      KpiCalculationService.getKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      var expectedAvailable = result.totalCreditLimit - result.outstandingAmount;
      expect(result.availableCredit).toBe(expectedAvailable);
      expect(result.availableCredit).toBe(17500);
    });

    /*
    Test Documentation:
    - Test Name: getKpis - should handle cards with missing monthlySpend
    - Purpose: Validate handling of cards without monthlySpend data
    - Scenario: Some cards have no monthlySpend value
    - Expected Result: Missing monthlySpend treated as 0
    */
    it('getKpis - should handle cards with missing monthlySpend', function() {
      var cardsWithMissingSpend = [
        {
          cardId: 'card001',
          creditLimit: 5000,
          outstandingBalance: 1200,
          monthlySpend: 800
        },
        {
          cardId: 'card002',
          creditLimit: 10000,
          outstandingBalance: 2500
        }
      ];

      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(cardsWithMissingSpend));

      var result;
      KpiCalculationService.getKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.monthlySpend).toBe(800);
    });

    /*
    Test Documentation:
    - Test Name: getKpis - should return cached KPIs within TTL
    - Purpose: Validate caching mechanism
    - Scenario: Multiple calls to getKpis within cache TTL (30 seconds)
    - Expected Result: Second call returns cached data without calling fetchAllCards
    */
    it('getKpis - should return cached KPIs within TTL', function() {
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(mockCardsData));

      var result1, result2;
      KpiCalculationService.getKpis().then(function(kpis) {
        result1 = kpis;
      });

      $rootScope.$digest();

      KpiCalculationService.getKpis().then(function(kpis) {
        result2 = kpis;
      });

      $rootScope.$digest();

      expect(CreditCardDataFactory.fetchAllCards.calls.count()).toBe(1);
      expect(result1).toBe(result2);
    });

    /*
    Test Documentation:
    - Test Name: getKpis - should handle empty cards array
    - Purpose: Validate handling of user with no cards
    - Scenario: fetchAllCards returns empty array
    - Expected Result: Returns KpiModel with all values as 0
    */
    it('getKpis - should handle empty cards array', function() {
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve([]));

      var result;
      KpiCalculationService.getKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.monthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
      expect(result.availableCredit).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: getKpis - should handle errors from fetchAllCards
    - Purpose: Validate error handling when card data fetch fails
    - Scenario: fetchAllCards rejects with error
    - Expected Result: Promise is rejected with error
    */
    it('getKpis - should handle errors from fetchAllCards', function() {
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.reject('API Error'));

      var errorCaught = false;
      KpiCalculationService.getKpis().catch(function(error) {
        errorCaught = true;
      });

      $rootScope.$digest();

      expect(errorCaught).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: getKpis - should set lastUpdated timestamp
    - Purpose: Validate lastUpdated field is populated
    - Scenario: getKpis is called
    - Expected Result: KpiModel contains lastUpdated as Date object
    */
    it('getKpis - should set lastUpdated timestamp', function() {
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(mockCardsData));

      var result;
      KpiCalculationService.getKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.lastUpdated).toBeDefined();
      expect(result.lastUpdated instanceof Date).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: getKpis - should include userId in KPI data
    - Purpose: Validate userId is included in returned KPIs
    - Scenario: getKpis is called
    - Expected Result: KpiModel contains userId from $rootScope.currentUser
    */
    it('getKpis - should include userId in KPI data', function() {
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(mockCardsData));

      var result;
      KpiCalculationService.getKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.userId).toBe(mockUserId);
    });

    /*
    Test Documentation:
    - Test Name: getKpis - should handle single card
    - Purpose: Validate KPI calculation with single card
    - Scenario: User has only one credit card
    - Expected Result: KPIs calculated correctly for single card
    */
    it('getKpis - should handle single card', function() {
      var singleCard = [
        {
          cardId: 'card001',
          creditLimit: 5000,
          outstandingBalance: 1200,
          monthlySpend: 800
        }
      ];

      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(singleCard));

      var result;
      KpiCalculationService.getKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.monthlySpend).toBe(800);
      expect(result.totalCreditLimit).toBe(5000);
      expect(result.outstandingAmount).toBe(1200);
      expect(result.availableCredit).toBe(3800);
    });

    /*
    Test Documentation:
    - Test Name: getKpis - should handle large credit limits
    - Purpose: Validate calculation with large numeric values
    - Scenario: Cards have very high credit limits
    - Expected Result: Calculations remain accurate with large numbers
    */
    it('getKpis - should handle large credit limits', function() {
      var highLimitCards = [
        {
          cardId: 'card001',
          creditLimit: 100000,
          outstandingBalance: 25000,
          monthlySpend: 15000
        },
        {
          cardId: 'card002',
          creditLimit: 150000,
          outstandingBalance: 50000,
          monthlySpend: 30000
        }
      ];

      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(highLimitCards));

      var result;
      KpiCalculationService.getKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.monthlySpend).toBe(45000);
      expect(result.totalCreditLimit).toBe(250000);
      expect(result.outstandingAmount).toBe(75000);
      expect(result.availableCredit).toBe(175000);
    });

    /*
    Test Documentation:
    - Test Name: getKpis - should return KpiModel instance
    - Purpose: Validate returned object is KpiModel instance
    - Scenario: getKpis is called
    - Expected Result: Returned object is instance of KpiModel
    */
    it('getKpis - should return KpiModel instance', function() {
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(mockCardsData));

      var result;
      KpiCalculationService.getKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result instanceof KpiModel).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: getKpis - should handle cards with zero balances
    - Purpose: Validate calculation with zero outstanding balances
    - Scenario: All cards have zero outstanding balance
    - Expected Result: Available credit equals total credit limit
    */
    it('getKpis - should handle cards with zero balances', function() {
      var zeroBalanceCards = [
        {
          cardId: 'card001',
          creditLimit: 5000,
          outstandingBalance: 0,
          monthlySpend: 0
        },
        {
          cardId: 'card002',
          creditLimit: 10000,
          outstandingBalance: 0,
          monthlySpend: 0
        }
      ];

      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(zeroBalanceCards));

      var result;
      KpiCalculationService.getKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.outstandingAmount).toBe(0);
      expect(result.availableCredit).toBe(15000);
      expect(result.availableCredit).toBe(result.totalCreditLimit);
    });
  });

  /*
  Coverage Report:
  - Functions tested: getKpis
  - Scenarios covered:
    * Successful KPI calculation
    * Available credit calculation accuracy
    * Missing monthlySpend handling
    * Caching mechanism (within TTL)
    * Empty cards array
    * Error handling from fetchAllCards
    * lastUpdated timestamp population
    * userId inclusion
    * Single card calculation
    * Large credit limit values
    * KpiModel instance verification
    * Zero balance handling
  - Uncovered scenarios:
    * Cache expiration after TTL (requires time manipulation)
    * Negative values handling
    * Concurrent request handling
    * KpiModel validation failures
  */
})();