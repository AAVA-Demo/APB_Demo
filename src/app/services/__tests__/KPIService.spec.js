/*
Test Documentation:
- Test Name: KPIService Unit Tests
- Purpose: Validate KPI data aggregation from credit card and transaction services
- Scenario: Tests getKPIData method with various card and spending scenarios
- Expected Result: Service correctly aggregates KPI metrics including monthly spend, credit limits, available credit, and outstanding amounts
*/

describe('KPIService', function() {
  var KPIService;
  var CreditCardDataService;
  var TransactionProcessingService;
  var $q;
  var $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_KPIService_, _CreditCardDataService_, _TransactionProcessingService_, _$q_, _$rootScope_) {
    KPIService = _KPIService_;
    CreditCardDataService = _CreditCardDataService_;
    TransactionProcessingService = _TransactionProcessingService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getKPIData', function() {
    it('should successfully aggregate KPI data from multiple cards', function() {
      var userId = 'user123';
      var mockCards = [
        {cardId: 'card1', creditLimit: 5000, availableCredit: 3000, outstandingBalance: 2000},
        {cardId: 'card2', creditLimit: 10000, availableCredit: 7000, outstandingBalance: 3000}
      ];
      var mockSpending = {monthlySpend: 1500};

      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));

      var result;
      KPIService.getKPIData(userId).then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(CreditCardDataService.getCardDetails).toHaveBeenCalledWith(userId);
      expect(TransactionProcessingService.getMonthlySpend).toHaveBeenCalledWith(userId);
      expect(result).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.monthlySpend).toBe(1500);
      expect(result.totalCreditLimit).toBe(15000);
      expect(result.availableCredit).toBe(10000);
      expect(result.outstandingAmount).toBe(5000);
      expect(result.cards.length).toBe(2);
      expect(result.lastUpdated).toBeDefined();
    });

    it('should handle single card scenario', function() {
      var userId = 'user456';
      var mockCards = [
        {cardId: 'card1', creditLimit: 8000, availableCredit: 6000, outstandingBalance: 2000}
      ];
      var mockSpending = {monthlySpend: 800};

      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));

      var result;
      KPIService.getKPIData(userId).then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(result.totalCreditLimit).toBe(8000);
      expect(result.availableCredit).toBe(6000);
      expect(result.outstandingAmount).toBe(2000);
      expect(result.cards.length).toBe(1);
    });

    it('should handle empty cards array', function() {
      var userId = 'user789';
      var mockCards = [];
      var mockSpending = {monthlySpend: 0};

      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));

      var result;
      KPIService.getKPIData(userId).then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(result.totalCreditLimit).toBe(0);
      expect(result.availableCredit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
      expect(result.cards.length).toBe(0);
      expect(result.monthlySpend).toBe(0);
    });

    it('should handle null cards response', function() {
      var userId = 'user101';
      var mockSpending = {monthlySpend: 500};

      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(null));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));

      var result;
      KPIService.getKPIData(userId).then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(result.totalCreditLimit).toBe(0);
      expect(result.availableCredit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
      expect(result.cards.length).toBe(0);
    });

    it('should handle null spending response', function() {
      var userId = 'user202';
      var mockCards = [
        {cardId: 'card1', creditLimit: 5000, availableCredit: 4000, outstandingBalance: 1000}
      ];

      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(null));

      var result;
      KPIService.getKPIData(userId).then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(result.monthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(5000);
    });

    it('should handle cards with missing credit limit', function() {
      var userId = 'user303';
      var mockCards = [
        {cardId: 'card1', availableCredit: 3000, outstandingBalance: 2000},
        {cardId: 'card2', creditLimit: 10000, availableCredit: 7000, outstandingBalance: 3000}
      ];
      var mockSpending = {monthlySpend: 1200};

      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));

      var result;
      KPIService.getKPIData(userId).then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(result.totalCreditLimit).toBe(10000);
    });

    it('should handle cards with missing available credit', function() {
      var userId = 'user404';
      var mockCards = [
        {cardId: 'card1', creditLimit: 5000, outstandingBalance: 2000},
        {cardId: 'card2', creditLimit: 10000, availableCredit: 7000, outstandingBalance: 3000}
      ];
      var mockSpending = {monthlySpend: 900};

      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));

      var result;
      KPIService.getKPIData(userId).then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(result.availableCredit).toBe(7000);
    });

    it('should handle cards with missing outstanding balance', function() {
      var userId = 'user505';
      var mockCards = [
        {cardId: 'card1', creditLimit: 5000, availableCredit: 3000},
        {cardId: 'card2', creditLimit: 10000, availableCredit: 7000, outstandingBalance: 3000}
      ];
      var mockSpending = {monthlySpend: 1100};

      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));

      var result;
      KPIService.getKPIData(userId).then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(result.outstandingAmount).toBe(3000);
    });

    it('should handle error from CreditCardDataService', function() {
      var userId = 'user606';
      var errorMsg = 'Card service error';

      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.reject(errorMsg));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve({monthlySpend: 500}));

      var error;
      KPIService.getKPIData(userId).catch(function(err) {
        error = err;
      });

      $rootScope.$digest();

      expect(error).toBe(errorMsg);
    });

    it('should handle error from TransactionProcessingService', function() {
      var userId = 'user707';
      var errorMsg = 'Transaction service error';
      var mockCards = [{cardId: 'card1', creditLimit: 5000, availableCredit: 3000, outstandingBalance: 2000}];

      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.reject(errorMsg));

      var error;
      KPIService.getKPIData(userId).catch(function(err) {
        error = err;
      });

      $rootScope.$digest();

      expect(error).toBe(errorMsg);
    });

    it('should handle multiple cards with zero values', function() {
      var userId = 'user808';
      var mockCards = [
        {cardId: 'card1', creditLimit: 0, availableCredit: 0, outstandingBalance: 0},
        {cardId: 'card2', creditLimit: 0, availableCredit: 0, outstandingBalance: 0}
      ];
      var mockSpending = {monthlySpend: 0};

      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));

      var result;
      KPIService.getKPIData(userId).then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(result.totalCreditLimit).toBe(0);
      expect(result.availableCredit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
      expect(result.monthlySpend).toBe(0);
    });

    it('should aggregate large number of cards correctly', function() {
      var userId = 'user909';
      var mockCards = [];
      for (var i = 1; i <= 10; i++) {
        mockCards.push({
          cardId: 'card' + i,
          creditLimit: 5000,
          availableCredit: 3000,
          outstandingBalance: 2000
        });
      }
      var mockSpending = {monthlySpend: 5000};

      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));

      var result;
      KPIService.getKPIData(userId).then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(result.totalCreditLimit).toBe(50000);
      expect(result.availableCredit).toBe(30000);
      expect(result.outstandingAmount).toBe(20000);
      expect(result.cards.length).toBe(10);
    });

    it('should set lastUpdated timestamp', function() {
      var userId = 'user1010';
      var mockCards = [{cardId: 'card1', creditLimit: 5000, availableCredit: 3000, outstandingBalance: 2000}];
      var mockSpending = {monthlySpend: 800};

      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));

      var result;
      var beforeTime = new Date();
      KPIService.getKPIData(userId).then(function(data) {
        result = data;
      });

      $rootScope.$digest();
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
- Functions tested: getKPIData
- Scenarios covered:
  * Successful KPI aggregation with multiple cards
  * Single card scenario
  * Empty cards array
  * Null cards response
  * Null spending response
  * Cards with missing credit limit
  * Cards with missing available credit
  * Cards with missing outstanding balance
  * Error from CreditCardDataService
  * Error from TransactionProcessingService
  * Multiple cards with zero values
  * Large number of cards aggregation
  * LastUpdated timestamp validation
- Uncovered scenarios: None - comprehensive coverage achieved
- Dependencies mocked: CreditCardDataService, TransactionProcessingService
*/