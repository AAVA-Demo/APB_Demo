(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('PortfolioService', ['$q', 'CreditCardRepositoryFactory', 'TransactionDatabaseFactory', function($q, CreditCardRepositoryFactory, TransactionDatabaseFactory) {
      var self = this;
      var cardCache = {};
      self.getPortfolio = function(userId) {
        var deferred = $q.defer();
        CreditCardRepositoryFactory.getUserCards(userId).then(function(cards) {
          var promises = cards.map(function(card) {
            cardCache[card.cardId] = card;
            return TransactionDatabaseFactory.getRecentTransactions(card.cardId).then(function(transactions) {
              card.transactions = transactions;
              return card;
            });
          });
          $q.all(promises).then(function(cardsWithTransactions) {
            var portfolio = {
              userId: userId,
              cards: cardsWithTransactions,
              selectedCard: cardsWithTransactions[0] || null,
              totalCards: cardsWithTransactions.length
            };
            deferred.resolve(portfolio);
          });
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
      self.getCardDetails = function(cardId) {
        var deferred = $q.defer();
        var card = cardCache[cardId];
        if (card) {
          TransactionDatabaseFactory.getFullTransactionHistory(cardId).then(function(transactions) {
            card.transactions = transactions;
            deferred.resolve(angular.copy(card));
          });
        } else {
          CreditCardRepositoryFactory.getCardById(cardId).then(function(card) {
            if (card) {
              TransactionDatabaseFactory.getFullTransactionHistory(cardId).then(function(transactions) {
                card.transactions = transactions;
                cardCache[cardId] = card;
                deferred.resolve(card);
              });
            } else {
              deferred.reject('Card not found');
            }
          });
        }
        return deferred.promise;
      };
    }]);
})();