/*
Test Documentation:
- Test Name: CardManagementService - getAllCards success
- Purpose: Validates that getAllCards retrieves all cards and enriches them with spending data
- Scenario: CardRepositoryService returns cards, CardSpendingService enriches each card
- Expected Result: Returns enriched cards array with spending data
*/
/*
Test Documentation:
- Test Name: CardManagementService - getAllCards handles spending service failure
- Purpose: Validates graceful handling when spending service fails for a card
- Scenario: CardRepositoryService succeeds, CardSpendingService fails for one card
- Expected Result: Returns cards with null spending for failed card
*/
/*
Test Documentation:
- Test Name: CardManagementService - getAllCards handles repository failure
- Purpose: Validates error handling when card repository fails
- Scenario: CardRepositoryService.fetchAllCards rejects
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: CardManagementService - getCardDetails success
- Purpose: Validates retrieval of complete card details including spending and transactions
- Scenario: All three service calls succeed
- Expected Result: Returns object with card, spending, and recentTransactions
*/
/*
Test Documentation:
- Test Name: CardManagementService - getCardDetails handles failure
- Purpose: Validates error handling when any detail service fails
- Scenario: One of the three service calls fails
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardDetails
- Scenarios covered: success paths, partial failures, complete failures
- Uncovered scenarios: none
*/

describe('CardManagementService', function() {
  'use strict';

  beforeEach(module('app.cardManagement'));

  var CardManagementService, CardRepositoryService, CardSpendingService, $q, $rootScope;

  beforeEach(inject(function(_CardManagementService_, _CardRepositoryService_, _CardSpendingService_, _$q_, _$rootScope_) {
    CardManagementService = _CardManagementService_;
    CardRepositoryService = _CardRepositoryService_;
    CardSpendingService = _CardSpendingService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getAllCards', function() {
    it('should retrieve all cards and enrich with spending data', function(done) {
      var mockCards = [
        { cardId: 'card1', cardType: 'Visa' },
        { cardId: 'card2', cardType: 'MasterCard' }
      ];
      var mockSpending1 = { currentMonthSpend: 1000 };
      var mockSpending2 = { currentMonthSpend: 2000 };

      spyOn(CardRepositoryService, 'fetchAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(CardSpendingService, 'getCardSpending').and.callFake(function(cardId) {
        if (cardId === 'card1') return $q.resolve(mockSpending1);
        if (cardId === 'card2') return $q.resolve(mockSpending2);
      });

      CardManagementService.getAllCards().then(function(result) {
        expect(result.length).toBe(2);
        expect(result[0].spending).toEqual(mockSpending1);
        expect(result[1].spending).toEqual(mockSpending2);
        expect(CardRepositoryService.fetchAllCards).toHaveBeenCalled();
        expect(CardSpendingService.getCardSpending).toHaveBeenCalledWith('card1');
        expect(CardSpendingService.getCardSpending).toHaveBeenCalledWith('card2');
        done();
      });

      $rootScope.$digest();
    });

    it('should handle spending service failure gracefully', function(done) {
      var mockCards = [
        { cardId: 'card1', cardType: 'Visa' },
        { cardId: 'card2', cardType: 'MasterCard' }
      ];
      var mockSpending1 = { currentMonthSpend: 1000 };

      spyOn(CardRepositoryService, 'fetchAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(CardSpendingService, 'getCardSpending').and.callFake(function(cardId) {
        if (cardId === 'card1') return $q.resolve(mockSpending1);
        if (cardId === 'card2') return $q.reject('Spending service error');
      });

      CardManagementService.getAllCards().then(function(result) {
        expect(result.length).toBe(2);
        expect(result[0].spending).toEqual(mockSpending1);
        expect(result[1].spending).toBeNull();
        done();
      });

      $rootScope.$digest();
    });

    it('should reject when repository service fails', function(done) {
      spyOn(CardRepositoryService, 'fetchAllCards').and.returnValue($q.reject('Repository error'));

      CardManagementService.getAllCards().catch(function(error) {
        expect(error).toBe('Repository error');
        expect(CardRepositoryService.fetchAllCards).toHaveBeenCalled();
        done();
      });

      $rootScope.$digest();
    });

    it('should return empty array when no cards exist', function(done) {
      spyOn(CardRepositoryService, 'fetchAllCards').and.returnValue($q.resolve([]));

      CardManagementService.getAllCards().then(function(result) {
        expect(result).toEqual([]);
        done();
      });

      $rootScope.$digest();
    });
  });

  describe('getCardDetails', function() {
    it('should retrieve complete card details with spending and transactions', function(done) {
      var mockCard = { cardId: 'card1', cardType: 'Visa' };
      var mockSpending = { currentMonthSpend: 1000 };
      var mockTransactions = [{ amount: 100, date: '2023-01-01' }];

      spyOn(CardRepositoryService, 'getCardById').and.returnValue($q.resolve(mockCard));
      spyOn(CardSpendingService, 'getCardSpending').and.returnValue($q.resolve(mockSpending));
      spyOn(CardSpendingService, 'getRecentTransactions').and.returnValue($q.resolve(mockTransactions));

      CardManagementService.getCardDetails('card1').then(function(result) {
        expect(result.card).toEqual(mockCard);
        expect(result.spending).toEqual(mockSpending);
        expect(result.recentTransactions).toEqual(mockTransactions);
        expect(CardRepositoryService.getCardById).toHaveBeenCalledWith('card1');
        expect(CardSpendingService.getCardSpending).toHaveBeenCalledWith('card1');
        expect(CardSpendingService.getRecentTransactions).toHaveBeenCalledWith('card1');
        done();
      });

      $rootScope.$digest();
    });

    it('should reject when card repository fails', function(done) {
      spyOn(CardRepositoryService, 'getCardById').and.returnValue($q.reject('Card not found'));
      spyOn(CardSpendingService, 'getCardSpending').and.returnValue($q.resolve({}));
      spyOn(CardSpendingService, 'getRecentTransactions').and.returnValue($q.resolve([]));

      CardManagementService.getCardDetails('card1').catch(function(error) {
        expect(error).toBe('Card not found');
        done();
      });

      $rootScope.$digest();
    });

    it('should reject when spending service fails', function(done) {
      spyOn(CardRepositoryService, 'getCardById').and.returnValue($q.resolve({}));
      spyOn(CardSpendingService, 'getCardSpending').and.returnValue($q.reject('Spending error'));
      spyOn(CardSpendingService, 'getRecentTransactions').and.returnValue($q.resolve([]));

      CardManagementService.getCardDetails('card1').catch(function(error) {
        expect(error).toBe('Spending error');
        done();
      });

      $rootScope.$digest();
    });

    it('should reject when transactions service fails', function(done) {
      spyOn(CardRepositoryService, 'getCardById').and.returnValue($q.resolve({}));
      spyOn(CardSpendingService, 'getCardSpending').and.returnValue($q.resolve({}));
      spyOn(CardSpendingService, 'getRecentTransactions').and.returnValue($q.reject('Transactions error'));

      CardManagementService.getCardDetails('card1').catch(function(error) {
        expect(error).toBe('Transactions error');
        done();
      });

      $rootScope.$digest();
    });
  });
});