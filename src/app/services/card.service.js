(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CardService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      self.getCardPortfolio = function(userId) {
        var deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + '/cards', {
          params: { userId: userId },
          timeout: API_CONFIG.timeout
        })
        .then(function(response) {
          var cards = response.data;
          var promises = cards.map(function(card) {
            return self.getTransactionSummary(card.cardId).then(function(summary) {
              card.monthlySpend = summary.monthlySpend;
              card.spendTrends = summary.trends;
              card.utilizationRate = ((card.balance / card.creditLimit) * 100).toFixed(2);
              return card;
            });
          });
          return $q.all(promises);
        })
        .then(function(enrichedCards) {
          deferred.resolve({
            userId: userId,
            cards: enrichedCards,
            totalCards: enrichedCards.length
          });
        })
        .catch(function(error) {
          console.error('Error fetching card portfolio:', error);
          deferred.reject(error);
        });
        return deferred.promise;
      };
      self.getTransactionSummary = function(cardId) {
        return $http.get(API_CONFIG.baseUrl + '/transactions/summary', {
          params: { cardId: cardId },
          timeout: API_CONFIG.timeout
        })
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          console.error('Error fetching transaction summary:', error);
          return { monthlySpend: 0, trends: [] };
        });
      };
    }]);
})();