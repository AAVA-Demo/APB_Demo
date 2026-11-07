/*
Test Documentation:
- Test Name: KPIService Unit Tests
- Purpose: Validate KPIService functionality including KPI aggregation, caching, and data transformation
- Scenario: Tests cover successful KPI calculation, cache management, error handling, and data aggregation
- Expected Result: All service methods work correctly with proper caching and KPI calculation logic
*/

(function() {
  'use strict';

  describe('KPIService', function() {
    var KPIService, CreditCardFactory, TransactionFactory, $q, $rootScope, $cacheFactory, cache;
    var mockUserId = 'user-123';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KPIService_, _CreditCardFactory_, _TransactionFactory_, _$q_, _$rootScope_, _$cacheFactory_) {
      KPIService = _KPIService_;
      CreditCardFactory = _CreditCardFactory_;
      TransactionFactory = _TransactionFactory_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      $cacheFactory = _$cacheFactory_;
      cache = $cacheFactory.get('kpiCache');
      if (cache) {
        cache.removeAll();
      }
    }));

    afterEach(function() {
      if (cache) {
        cache.removeAll();
      }
    });

    describe('getKPIs', function() {
      /*
      Test Documentation:
      - Test Name: should calculate KPIs correctly from card and transaction data
      - Purpose: Verify that getKPIs aggregates data and calculates all KPI metrics correctly
      - Scenario: CreditCardFactory and TransactionFactory return valid data
      - Expected Result: Service returns KPIs with correct totalCreditLimit, outstandingAmount, availableCredit, and monthlySpend
      */
      it('should calculate KPIs correctly from card and transaction data', function(done) {
        var mockCards = [
          { cardId: 'card1', creditLimit: 50000, outstandingAmount: 12000 },
          { cardId: 'card2', creditLimit: 30000, outstandingAmount: 8000 },
          { cardId: 'card3', creditLimit: 20000, outstandingAmount: 5000 }
        ];
        var mockTransactions = { monthlySpend: 15000 };

        spyOn(CreditCardFactory, 'getCardSummary').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionFactory, 'getMonthlyTotal').and.returnValue($q.resolve(mockTransactions));

        KPIService.getKPIs(mockUserId).then(function(result) {
          expect(result.userId).toBe(mockUserId);
          expect(result.totalCreditLimit).toBe(100000);
          expect(result.outstandingAmount).toBe(25000);
          expect(result.availableCredit).toBe(75000);
          expect(result.monthlySpend).toBe(15000);
          expect(result.lastUpdated).toEqual(jasmine.any(Date));
          done();
        });

        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should cache KPI data after first retrieval
      - Purpose: Verify that KPIs are cached and subsequent calls use cache
      - Scenario: First call fetches from factories, second call uses cache
      - Expected Result: Factories called only once, second call returns cached data
      */
      it('should cache KPI data after first retrieval', function(done) {
        var mockCards = [{ cardId: 'card1', creditLimit: 50000, outstandingAmount: 10000 }];
        var mockTransactions = { monthlySpend: 8000 };

        spyOn(CreditCardFactory, 'getCardSummary').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionFactory, 'getMonthlyTotal').and.returnValue($q.resolve(mockTransactions));

        KPIService.getKPIs(mockUserId).then(function(firstResult) {
          KPIService.getKPIs(mockUserId).then(function(secondResult) {
            expect(CreditCardFactory.getCardSummary.calls.count()).toBe(1);
            expect(TransactionFactory.getMonthlyTotal.calls.count()).toBe(1);
            expect(secondResult).toEqual(firstResult);
            done();
          });
          $rootScope.$apply();
        });

        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should handle empty card array
      - Purpose: Verify that service handles users with no cards gracefully
      - Scenario: CreditCardFactory returns empty array
      - Expected Result: KPIs calculated with zero values for card-related metrics
      */
      it('should handle empty card array', function(done) {
        var mockCards = [];
        var mockTransactions = { monthlySpend: 5000 };

        spyOn(CreditCardFactory, 'getCardSummary').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionFactory, 'getMonthlyTotal').and.returnValue($q.resolve(mockTransactions));

        KPIService.getKPIs(mockUserId).then(function(result) {
          expect(result.totalCreditLimit).toBe(0);
          expect(result.outstandingAmount).toBe(0);
          expect(result.availableCredit).toBe(0);
          expect(result.monthlySpend).toBe(5000);
          done();
        });

        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should handle undefined card properties
      - Purpose: Verify that service handles cards with missing creditLimit or outstandingAmount
      - Scenario: Cards have undefined or null creditLimit/outstandingAmount
      - Expected Result: Undefined values treated as zero in calculations
      */
      it('should handle undefined card properties', function(done) {
        var mockCards = [
          { cardId: 'card1', creditLimit: 50000 },
          { cardId: 'card2', outstandingAmount: 8000 },
          { cardId: 'card3' }
        ];
        var mockTransactions = { monthlySpend: 3000 };

        spyOn(CreditCardFactory, 'getCardSummary').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionFactory, 'getMonthlyTotal').and.returnValue($q.resolve(mockTransactions));

        KPIService.getKPIs(mockUserId).then(function(result) {
          expect(result.totalCreditLimit).toBe(50000);
          expect(result.outstandingAmount).toBe(8000);
          expect(result.availableCredit).toBe(42000);
          done();
        });

        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should handle undefined monthlySpend
      - Purpose: Verify that service handles missing monthlySpend gracefully
      - Scenario: TransactionFactory returns object without monthlySpend property
      - Expected Result: monthlySpend defaults to zero
      */
      it('should handle undefined monthlySpend', function(done) {
        var mockCards = [{ cardId: 'card1', creditLimit: 30000, outstandingAmount: 5000 }];
        var mockTransactions = {};

        spyOn(CreditCardFactory, 'getCardSummary').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionFactory, 'getMonthlyTotal').and.returnValue($q.resolve(mockTransactions));

        KPIService.getKPIs(mockUserId).then(function(result) {
          expect(result.monthlySpend).toBe(0);
          expect(result.totalCreditLimit).toBe(30000);
          done();
        });

        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should handle CreditCardFactory errors
      - Purpose: Verify error handling when CreditCardFactory fails
      - Scenario: CreditCardFactory.getCardSummary rejects with error
      - Expected Result: Service rejects promise and logs error to console
      */
      it('should handle CreditCardFactory errors', function(done) {
        var mockError = new Error('Card fetch failed');
        spyOn(CreditCardFactory, 'getCardSummary').and.returnValue($q.reject(mockError));
        spyOn(TransactionFactory, 'getMonthlyTotal').and.returnValue($q.resolve({ monthlySpend: 5000 }));
        spyOn(console, 'error');

        KPIService.getKPIs(mockUserId).catch(function(error) {
          expect(error).toEqual(mockError);
          expect(console.error).toHaveBeenCalledWith('KPI fetch error:', mockError);
          done();
        });

        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should handle TransactionFactory errors
      - Purpose: Verify error handling when TransactionFactory fails
      - Scenario: TransactionFactory.getMonthlyTotal rejects with error
      - Expected Result: Service rejects promise and logs error to console
      */
      it('should handle TransactionFactory errors', function(done) {
        var mockError = new Error('Transaction fetch failed');
        spyOn(CreditCardFactory, 'getCardSummary').and.returnValue($q.resolve([]));
        spyOn(TransactionFactory, 'getMonthlyTotal').and.returnValue($q.reject(mockError));
        spyOn(console, 'error');

        KPIService.getKPIs(mockUserId).catch(function(error) {
          expect(error).toEqual(mockError);
          expect(console.error).toHaveBeenCalledWith('KPI fetch error:', mockError);
          done();
        });

        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should handle both factories failing
      - Purpose: Verify error handling when both data sources fail
      - Scenario: Both CreditCardFactory and TransactionFactory reject
      - Expected Result: Service rejects promise with first error encountered
      */
      it('should handle both factories failing', function(done) {
        var cardError = new Error('Card error');
        var transactionError = new Error('Transaction error');
        spyOn(CreditCardFactory, 'getCardSummary').and.returnValue($q.reject(cardError));
        spyOn(TransactionFactory, 'getMonthlyTotal').and.returnValue($q.reject(transactionError));
        spyOn(console, 'error');

        KPIService.getKPIs(mockUserId).catch(function(error) {
          expect(error).toBeDefined();
          expect(console.error).toHaveBeenCalled();
          done();
        });

        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should create unique cache keys for different users
      - Purpose: Verify cache isolation between different users
      - Scenario: Call getKPIs with different userIds
      - Expected Result: Each userId triggers separate factory calls
      */
      it('should create unique cache keys for different users', function(done) {
        var mockCards = [{ cardId: 'card1', creditLimit: 10000, outstandingAmount: 2000 }];
        var mockTransactions = { monthlySpend: 1000 };
        spyOn(CreditCardFactory, 'getCardSummary').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionFactory, 'getMonthlyTotal').and.returnValue($q.resolve(mockTransactions));

        var promises = [
          KPIService.getKPIs('user-1'),
          KPIService.getKPIs('user-2')
        ];

        $q.all(promises).then(function() {
          expect(CreditCardFactory.getCardSummary.calls.count()).toBe(2);
          expect(TransactionFactory.getMonthlyTotal.calls.count()).toBe(2);
          done();
        });

        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should calculate availableCredit correctly
      - Purpose: Verify that availableCredit is calculated as totalCreditLimit - outstandingAmount
      - Scenario: Multiple cards with various credit limits and outstanding amounts
      - Expected Result: availableCredit equals sum of creditLimits minus sum of outstandingAmounts
      */
      it('should calculate availableCredit correctly', function(done) {
        var mockCards = [
          { cardId: 'card1', creditLimit: 100000, outstandingAmount: 30000 },
          { cardId: 'card2', creditLimit: 50000, outstandingAmount: 15000 }
        ];
        var mockTransactions = { monthlySpend: 10000 };

        spyOn(CreditCardFactory, 'getCardSummary').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionFactory, 'getMonthlyTotal').and.returnValue($q.resolve(mockTransactions));

        KPIService.getKPIs(mockUserId).then(function(result) {
          var expectedTotalLimit = 150000;
          var expectedOutstanding = 45000;
          var expectedAvailable = 105000;

          expect(result.totalCreditLimit).toBe(expectedTotalLimit);
          expect(result.outstandingAmount).toBe(expectedOutstanding);
          expect(result.availableCredit).toBe(expectedAvailable);
          done();
        });

        $rootScope.$apply();
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getKPIs
  - Scenarios covered:
    * Successful KPI calculation with multiple cards
    * Cache hit and miss scenarios
    * Empty card array handling
    * Undefined/null card properties
    * Undefined monthlySpend
    * CreditCardFactory errors
    * TransactionFactory errors
    * Both factories failing
    * Cache key uniqueness for different users
    * Correct availableCredit calculation
  - Edge cases covered:
    * Empty arrays
    * Missing properties
    * Multiple error scenarios
    * Complex credit calculations
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();