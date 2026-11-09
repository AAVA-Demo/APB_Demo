/*
Test Documentation:
- Test Name: CardManagementService - getCardPortfolio success
- Purpose: Validates retrieval and enrichment of card portfolio with spending data
- Scenario: Service fetches all cards and enriches with spending analysis
- Expected Result: Returns portfolio object with enriched cards and aggregated totals
*/
/*
Test Documentation:
- Test Name: CardManagementService - getCardDetail success
- Purpose: Validates retrieval of individual card with spending analysis
- Scenario: Service fetches card by ID and enriches with spending data
- Expected Result: Returns card object with spendAnalysis property
*/
/*
Coverage Report:
- Functions tested: getCardPortfolio, getCardDetail
- Scenarios covered: successful portfolio retrieval, card detail retrieval, empty cards, error handling
- Uncovered scenarios: none
*/

describe('CardManagementService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CardManagementService, CardDataService, TransactionService, $q, $rootScope;
  
  beforeEach(inject(function(_CardManagementService_, _CardDataService_, _TransactionService_, _$q_, _$rootScope_) {
    CardManagementService = _CardManagementService_;
    CardDataService = _CardDataService_;
    TransactionService = _TransactionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getCardPortfolio', function() {
    it('should fetch and enrich card portfolio successfully', function() {
      var mockCards = [
        { cardId: 1, cardNumber: '****1234', creditLimit: 10000, currentBalance: 2500, availableCredit: 7500 },
        { cardId: 2, cardNumber: '****5678', creditLimit: 15000, currentBalance: 5000, availableCredit: 10000 }
      ];
      var mockSpending1 = { monthlySpend: 1200, yearlySpend: 14000 };
      var mockSpending2 = { monthlySpend: 2000, yearlySpend: 20000 };
      
      spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getCardSpending').and.returnValues(
        $q.resolve(mockSpending1),
        $q.resolve(mockSpending2)
      );
      
      var result;
      CardManagementService.getCardPortfolio().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(CardDataService.getAllCards).toHaveBeenCalled();
      expect(TransactionService.getCardSpending).toHaveBeenCalledWith(1);
      expect(TransactionService.getCardSpending).toHaveBeenCalledWith(2);
      expect(result).toBeDefined();
      expect(result.cards.length).toBe(2);
      expect(result.cards[0].spendAnalysis).toEqual(mockSpending1);
      expect(result.cards[1].spendAnalysis).toEqual(mockSpending2);
      expect(result.totalCreditLimit).toBe(25000);
      expect(result.totalAvailableCredit).toBe(17500);
      expect(result.totalOutstanding).toBe(7500);
      expect(result.cardCount).toBe(2);
    });
    
    it('should handle empty cards array', function() {
      spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve([]));
      
      var result;
      CardManagementService.getCardPortfolio().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.cards.length).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.cardCount).toBe(0);
    });
    
    it('should handle CardDataService error', function() {
      spyOn(CardDataService, 'getAllCards').and.returnValue($q.reject('API Error'));
      
      var error;
      CardManagementService.getCardPortfolio().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('API Error');
    });
    
    it('should handle TransactionService error', function() {
      var mockCards = [
        { cardId: 1, creditLimit: 10000, currentBalance: 2500, availableCredit: 7500 }
      ];
      
      spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getCardSpending').and.returnValue($q.reject('Transaction Error'));
      
      var error;
      CardManagementService.getCardPortfolio().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('Transaction Error');
    });
    
    it('should handle cards with missing financial properties', function() {
      var mockCards = [
        { cardId: 1, cardNumber: '****1234' },
        { cardId: 2, cardNumber: '****5678', creditLimit: 5000 }
      ];
      var mockSpending = { monthlySpend: 100 };
      
      spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getCardSpending').and.returnValue($q.resolve(mockSpending));
      
      var result;
      CardManagementService.getCardPortfolio().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.totalCreditLimit).toBe(5000);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
    });
  });
  
  describe('getCardDetail', function() {
    it('should fetch and enrich card detail successfully', function() {
      var mockCard = { cardId: 1, cardNumber: '****1234', creditLimit: 10000 };
      var mockSpending = { monthlySpend: 1200, yearlySpend: 14000, transactionCount: 45 };
      
      spyOn(CardDataService, 'getCardById').and.returnValue($q.resolve(mockCard));
      spyOn(TransactionService, 'getCardSpending').and.returnValue($q.resolve(mockSpending));
      
      var result;
      CardManagementService.getCardDetail(1).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(CardDataService.getCardById).toHaveBeenCalledWith(1);
      expect(TransactionService.getCardSpending).toHaveBeenCalledWith(1);
      expect(result).toBeDefined();
      expect(result.cardId).toBe(1);
      expect(result.spendAnalysis).toEqual(mockSpending);
      expect(result.spendAnalysis.monthlySpend).toBe(1200);
    });
    
    it('should handle CardDataService error', function() {
      spyOn(CardDataService, 'getCardById').and.returnValue($q.reject('Card not found'));
      
      var error;
      CardManagementService.getCardDetail(999).catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('Card not found');
    });
    
    it('should handle TransactionService error', function() {
      var mockCard = { cardId: 1, cardNumber: '****1234' };
      
      spyOn(CardDataService, 'getCardById').and.returnValue($q.resolve(mockCard));
      spyOn(TransactionService, 'getCardSpending').and.returnValue($q.reject('Transaction Error'));
      
      var error;
      CardManagementService.getCardDetail(1).catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('Transaction Error');
    });
    
    it('should handle string cardId parameter', function() {
      var mockCard = { cardId: 1, cardNumber: '****1234' };
      var mockSpending = { monthlySpend: 500 };
      
      spyOn(CardDataService, 'getCardById').and.returnValue($q.resolve(mockCard));
      spyOn(TransactionService, 'getCardSpending').and.returnValue($q.resolve(mockSpending));
      
      var result;
      CardManagementService.getCardDetail('1').then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.spendAnalysis).toBeDefined();
    });
  });
});