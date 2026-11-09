(function() {
  'use strict';
  angular.module('creditCard.multiCard').service('MultiCardService', ['$q', 'CardDataFactory', 'TransactionService', 'CardComparisonService', function($q, CardDataFactory, TransactionService, CardComparisonService) {
    var self = this;
    self.getAllCards = function() {
      var deferred = $q.defer();
      CardDataFactory.fetchUserCards().then(function(cards) {
        var spendingPromises = cards.map(function(card) {
          return TransactionService.getCardSpending(card.cardId);
        });
        $q.all(spendingPromises).then(function(spendingData) {
          var enrichedCards = cards.map(function(card, index) {
            var spending = spendingData[index];
            var enriched = angular.copy(card);
            enriched.monthlySpend = spending.monthlySpend;
            enriched.categoryBreakdown = spending.categoryBreakdown;
            enriched.transactionCount = spending.transactionCount;
            enriched.availableCredit = card.creditLimit - card.outstandingBalance;
            enriched.utilizationRate = CardComparisonService.calculateUtilization(card);
            enriched.lastRefreshTime = new Date();
            return enriched;
          });
          deferred.resolve({
            userId: 'user-001',
            cards: enrichedCards,
            totalCards: enrichedCards.length
          });
        });
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
  }]);
})();