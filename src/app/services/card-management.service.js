(function() {
  'use strict';
  angular.module('cardManagement')
    .service('CardManagementService', ['CardRepositoryFactory', 'SpendingAnalyticsService', '$q', function(CardRepositoryFactory, SpendingAnalyticsService, $q) {
      this.getCardPortfolio = function(userId) {
        return CardRepositoryFactory.getUserCards(userId).then(function(cards) {
          var promises = cards.map(function(card) {
            return SpendingAnalyticsService.getCardSpending(card.cardId).then(function(spending) {
              card.monthlySpend = spending.monthlySpend;
              card.transactionCount = spending.transactionCount;
              return card;
            });
          });
          return $q.all(promises).then(function(enrichedCards) {
            return {
              userId: userId,
              cards: enrichedCards,
              totalCards: enrichedCards.length,
              activeCards: enrichedCards.filter(function(c) { return c.status === 'active'; }).length
            };
          });
        });
      };
    }]);
})();