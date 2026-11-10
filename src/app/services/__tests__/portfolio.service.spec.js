/*
Test Documentation:
- Test Name: PortfolioService - getPortfolio success
- Purpose: Validates retrieval of complete portfolio with cards and transactions
- Scenario: Valid userId with multiple cards
- Expected Result: Returns portfolio object with cards and recent transactions
*/
/*
Test Documentation:
- Test Name: PortfolioService - getCardDetails with cache
- Purpose: Validates retrieval of card details from cache
- Scenario: Card exists in cache
- Expected Result: Returns card with full transaction history from cache
*/
/*
Test Documentation:
- Test Name: PortfolioService - getCardDetails without cache
- Purpose: Validates retrieval of card details when not in cache
- Scenario: Card not in cache
- Expected Result: Fetches card from repository and returns with transactions
*/
/*
Test Documentation:
- Test Name: PortfolioService - getCardDetails card not found
- Purpose: Validates error handling when card does not exist
- Scenario: Invalid cardId
- Expected Result: Promise is rejected with error message
*/
/*
Coverage Report:
- Functions tested: getPortfolio, getCardDetails
- Scenarios covered: successful portfolio retrieval, cached card details, non-cached card details, card not found, error handling
- Uncovered scenarios: none
*/

describe('PortfolioService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var PortfolioService;
  var $q;
  var $rootScope;
  var CreditCardRepositoryFactory;
  var TransactionDatabaseFactory;
  
  beforeEach(inject(function(_PortfolioService_, _$q_, _$rootScope_, _CreditCardRepositoryFactory_, _TransactionDatabaseFactory_) {
    PortfolioService = _PortfolioService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    CreditCardRepositoryFactory = _CreditCardRepositoryFactory_;
    TransactionDatabaseFactory = _TransactionDatabaseFactory_;
  }));
  
  describe('getPortfolio', function() {
    it('should retrieve complete portfolio with cards and transactions', function() {
      var mockCards = [
        {cardId: 'card1', cardNumber: '****1234'},
        {cardId: 'card2', cardNumber: '****5678'}
      ];
      var mockTransactions = [{transactionId: 't1', amount: 100}];
      
      spyOn(CreditCardRepositoryFactory, 'getUserCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionDatabaseFactory, 'getRecentTransactions').and.returnValue($q.resolve(mockTransactions));
      
      var result;
      PortfolioService.getPortfolio('user123').then(function(portfolio) {
        result = portfolio;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.userId).toBe('user123');
      expect(result.cards.length).toBe(2);
      expect(result.totalCards).toBe(2);
      expect(result.selectedCard).toEqual(mockCards[0]);
      expect(result.cards[0].transactions).toEqual(mockTransactions);
    });
    
    it('should handle error when CreditCardRepositoryFactory fails', function() {
      var errorMessage = 'Failed to retrieve cards';
      spyOn(CreditCardRepositoryFactory, 'getUserCards').and.returnValue($q.reject(errorMessage));
      
      var error;
      PortfolioService.getPortfolio('user123').catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe(errorMessage);
    });
    
    it('should return null selectedCard when no cards exist', function() {
      spyOn(CreditCardRepositoryFactory, 'getUserCards').and.returnValue($q.resolve([]));
      
      var result;
      PortfolioService.getPortfolio('user123').then(function(portfolio) {
        result = portfolio;
      });
      
      $rootScope.$digest();
      
      expect(result.selectedCard).toBeNull();
      expect(result.totalCards).toBe(0);
    });
  });
  
  describe('getCardDetails', function() {
    it('should retrieve card details from cache', function() {
      var mockCards = [{cardId: 'card1', cardNumber: '****1234'}];
      var mockTransactions = [{transactionId: 't1', amount: 100}];
      
      spyOn(CreditCardRepositoryFactory, 'getUserCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionDatabaseFactory, 'getRecentTransactions').and.returnValue($q.resolve([]));
      spyOn(TransactionDatabaseFactory, 'getFullTransactionHistory').and.returnValue($q.resolve(mockTransactions));
      
      PortfolioService.getPortfolio('user123').then(function() {
        var result;
        PortfolioService.getCardDetails('card1').then(function(card) {
          result = card;
        });
        
        $rootScope.$digest();
        
        expect(result.cardId).toBe('card1');
        expect(result.transactions).toEqual(mockTransactions);
      });
      
      $rootScope.$digest();
    });
    
    it('should retrieve card details from repository when not in cache', function() {
      var mockCard = {cardId: 'card1', cardNumber: '****1234'};
      var mockTransactions = [{transactionId: 't1', amount: 100}];
      
      spyOn(CreditCardRepositoryFactory, 'getCardById').and.returnValue($q.resolve(mockCard));
      spyOn(TransactionDatabaseFactory, 'getFullTransactionHistory').and.returnValue($q.resolve(mockTransactions));
      
      var result;
      PortfolioService.getCardDetails('card1').then(function(card) {
        result = card;
      });
      
      $rootScope.$digest();
      
      expect(result.cardId).toBe('card1');
      expect(result.transactions).toEqual(mockTransactions);
    });
    
    it('should reject promise when card is not found', function() {
      spyOn(CreditCardRepositoryFactory, 'getCardById').and.returnValue($q.resolve(null));
      
      var error;
      PortfolioService.getCardDetails('invalidCard').catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('Card not found');
    });
  });
});