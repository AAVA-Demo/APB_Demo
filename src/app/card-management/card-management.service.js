(function() {
  'use strict';
  angular.module('app.cardManagement')
    .service('CardManagementService', ['$q', 'UserProfileService', 'CreditCardDataFactory', 'TransactionFactory', function($q, UserProfileService, CreditCardDataFactory, TransactionFactory) {
      var self = this;
      self.getCardPortfolio = function() {
        var deferred = $q.defer();
        UserProfileService.authenticateUser().then(function(authData) {
          return CreditCardDataFactory.getCards(authData.userId);
        }).then(function(cards) {
          var spendingPromises = cards.map(function(card) {
            return TransactionFactory.getCardSpending(card.cardId);
          });
          return $q.all({ cards: cards, spending: $q.all(spendingPromises) });
        }).then(function(data) {
          var consolidatedBalance = 0;
          var consolidatedLimit = 0;
          data.cards.forEach(function(card) {
            consolidatedBalance += card.currentBalance;
            consolidatedLimit += card.creditLimit;
          });
          var portfolio = {
            userId: 'user-001',
            cards: data.cards,
            spending: data.spending,
            totalCards: data.cards.length,
            consolidatedBalance: Math.round(consolidatedBalance * 100) / 100,
            consolidatedLimit: Math.round(consolidatedLimit * 100) / 100
          };
          deferred.resolve(portfolio);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
      self.getCardDetails = function(cardId) {
        var deferred = $q.defer();
        $q.all({
          cards: CreditCardDataFactory.getCards('user-001'),
          spending: TransactionFactory.getCardSpending(cardId),
          transactions: TransactionFactory.getTransactions(cardId)
        }).then(function(data) {
          var card = data.cards.find(function(c) { return c.cardId === cardId; });
          if (!card) {
            deferred.reject('Card not found');
            return;
          }
          deferred.resolve({
            card: card,
            spending: data.spending,
            transactions: data.transactions
          });
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
    }]);
})();