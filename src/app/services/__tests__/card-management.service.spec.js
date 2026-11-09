/*
Test Documentation:
- Test Name: CardManagementService - getAllCards retrieves all user cards
- Purpose: Validates that the service correctly retrieves all credit cards for a user
- Scenario: User requests to view all their credit cards
- Expected Result: Returns array of credit card objects from CardRepositoryFactory
*/
/*
Test Documentation:
- Test Name: CardManagementService - getAllCards handles empty card list
- Purpose: Validates graceful handling when user has no cards
- Scenario: User with no registered credit cards
- Expected Result: Returns empty array without errors
*/
/*
Test Documentation:
- Test Name: CardManagementService - getAllCards handles repository failure
- Purpose: Validates error handling when CardRepositoryFactory fails
- Scenario: Database or network error when retrieving cards
- Expected Result: Promise is rejected with appropriate error
*/
/*
Test Documentation:
- Test Name: CardManagementService - getCardSpending retrieves transactions for specific card
- Purpose: Validates card-specific transaction retrieval
- Scenario: User selects a card to view spending details
- Expected Result: Returns transactions for the specified cardId
*/
/*
Test Documentation:
- Test Name: CardManagementService - getCardSpending handles invalid cardId
- Purpose: Validates error handling for non-existent card
- Scenario: Request for transactions with invalid or non-existent cardId
- Expected Result: Promise is rejected or returns empty array
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardSpending
- Scenarios covered: normal retrieval, empty data, error handling, invalid parameters
- Edge cases: null cardId, empty card list, repository failures
- Uncovered scenarios: none
*/

describe('CardManagementService', function() {
  'use strict';
  
  beforeEach(module('cc.cardManagement'));
  
  var CardManagementService;
  var CardRepositoryFactory;
  var TransactionFactory;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_CardManagementService_, _CardRepositoryFactory_, _TransactionFactory_, _$q_, _$rootScope_) {
    CardManagementService = _CardManagementService_;
    CardRepositoryFactory = _CardRepositoryFactory_;
    TransactionFactory = _TransactionFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getAllCards', function() {
    
    it('should retrieve all user credit cards successfully', function() {
      var mockCards = [
        { cardId: 'card1', cardName: 'Visa Gold', creditLimit: 5000, outstandingBalance: 1200 },
        { cardId: 'card2', cardName: 'MasterCard Platinum', creditLimit: 10000, outstandingBalance: 3500 }
      ];
      
      spyOn(CardRepositoryFactory, 'getCards').and.returnValue($q.resolve(mockCards));
      
      var result;
      CardManagementService.getAllCards().then(function(cards) {
        result = cards;
      });
      
      $rootScope.$digest();
      
      expect(CardRepositoryFactory.getCards).toHaveBeenCalled();
      expect(result).toEqual(mockCards);
      expect(result.length).toBe(2);
    });
    
    it('should handle empty card list gracefully', function() {
      spyOn(CardRepositoryFactory, 'getCards').and.returnValue($q.resolve([]));
      
      var result;
      CardManagementService.getAllCards().then(function(cards) {
        result = cards;
      });
      
      $rootScope.$digest();
      
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
    
    it('should handle repository failure gracefully', function() {
      var errorMessage = 'Database connection failed';
      spyOn(CardRepositoryFactory, 'getCards').and.returnValue($q.reject(errorMessage));
      
      var error;
      CardManagementService.getAllCards().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe(errorMessage);
    });
    
    it('should handle null response from repository', function() {
      spyOn(CardRepositoryFactory, 'getCards').and.returnValue($q.resolve(null));
      
      var result;
      CardManagementService.getAllCards().then(function(cards) {
        result = cards;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeNull();
    });
  });
  
  describe('getCardSpending', function() {
    
    it('should retrieve transactions for specific card successfully', function() {
      var cardId = 'card123';
      var mockTransactions = [
        { transactionId: 'txn1', amount: 50, merchantName: 'Store A', transactionDate: '2024-01-15' },
        { transactionId: 'txn2', amount: 100, merchantName: 'Restaurant B', transactionDate: '2024-01-20' }
      ];
      
      spyOn(TransactionFactory, 'getCardTransactions').and.returnValue($q.resolve(mockTransactions));
      
      var result;
      CardManagementService.getCardSpending(cardId).then(function(transactions) {
        result = transactions;
      });
      
      $rootScope.$digest();
      
      expect(TransactionFactory.getCardTransactions).toHaveBeenCalledWith(cardId);
      expect(result).toEqual(mockTransactions);
      expect(result.length).toBe(2);
    });
    
    it('should handle empty transaction list for a card', function() {
      var cardId = 'card456';
      spyOn(TransactionFactory, 'getCardTransactions').and.returnValue($q.resolve([]));
      
      var result;
      CardManagementService.getCardSpending(cardId).then(function(transactions) {
        result = transactions;
      });
      
      $rootScope.$digest();
      
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
    
    it('should handle invalid cardId gracefully', function() {
      var invalidCardId = null;
      var errorMessage = 'Invalid card ID';
      spyOn(TransactionFactory, 'getCardTransactions').and.returnValue($q.reject(errorMessage));
      
      var error;
      CardManagementService.getCardSpending(invalidCardId).catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe(errorMessage);
    });
    
    it('should handle transaction factory failure', function() {
      var cardId = 'card789';
      var errorMessage = 'Network timeout';
      spyOn(TransactionFactory, 'getCardTransactions').and.returnValue($q.reject(errorMessage));
      
      var error;
      CardManagementService.getCardSpending(cardId).catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe(errorMessage);
    });
    
    it('should pass correct cardId parameter to TransactionFactory', function() {
      var cardId = 'specificCard123';
      spyOn(TransactionFactory, 'getCardTransactions').and.returnValue($q.resolve([]));
      
      CardManagementService.getCardSpending(cardId);
      $rootScope.$digest();
      
      expect(TransactionFactory.getCardTransactions).toHaveBeenCalledWith(cardId);
    });
  });
});