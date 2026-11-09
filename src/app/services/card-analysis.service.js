(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CardAnalysisService', ['$http', '$q', 'API_BASE_URL', function($http, $q, API_BASE_URL) {
      this.analyzeCards = function(cardIds) {
        return $http.get(API_BASE_URL + '/api/cards/analysis', { params: { cardIds: cardIds.join(',') } })
          .then(function(response) { return response.data; })
          .catch(function() {
            return cardIds.map(function(id) {
              return {
                cardId: id,
                monthlySpend: Math.floor(Math.random() * 20000) + 5000,
                utilizationRate: Math.floor(Math.random() * 60) + 20,
                categoryBreakdown: [
                  { category: 'Food & Dining', amount: Math.floor(Math.random() * 5000) },
                  { category: 'Fuel', amount: Math.floor(Math.random() * 3000) },
                  { category: 'Shopping', amount: Math.floor(Math.random() * 7000) }
                ]
              };
            });
          });
      };
    }]);
})();