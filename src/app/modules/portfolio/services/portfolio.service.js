(function() {
  'use strict';
  angular.module('app.portfolio')
    .service('PortfolioService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      var cachedCards = null;

      self.getUserCards = function(userId) {
        if (cachedCards) {
          return $q.resolve(cachedCards);
        }
        var url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.portfolioCards}?userId=${userId}`;
        return $http.get(url).then(function(response) {
          var cards = response.data.map(card => {
            card.utilizationPercentage = card.creditLimit > 0 ? 
              ((card.currentBalance / card.creditLimit) * 100).toFixed(2) : 0;
            return card;
          });
          cachedCards = cards;
          return cards;
        });
      };

      self.getCardSpendDetail = function(cardId, month) {
        var url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cardSpending.replace(':cardId', cardId)}?month=${month}`;
        return $http.get(url).then(function(response) {
          return response.data;
        });
      };

      self.clearCache = function() {
        cachedCards = null;
      };
    }]);
})();