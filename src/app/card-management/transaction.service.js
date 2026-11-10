(function() {
  'use strict';
  angular.module('app.cardManagement')
    .service('TransactionService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      this.getCardSpendAnalysis = function(cardId) {
        return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARD_ANALYSIS + '/' + cardId + '/analysis', {
          timeout: API_CONFIG.TIMEOUT
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          var mockAnalysis = {
            cardId: cardId,
            monthlySpend: 2125.50,
            monthlyTrends: [
              { month: 'Jan', spend: 1800 },
              { month: 'Feb', spend: 2100 },
              { month: 'Mar', spend: 2125.50 }
            ],
            topCategories: [
              { category: 'Shopping', amount: 850 },
              { category: 'Food & Dining', amount: 675 },
              { category: 'Fuel', amount: 400 }
            ]
          };
          return mockAnalysis;
        });
      };
    }]);
})();