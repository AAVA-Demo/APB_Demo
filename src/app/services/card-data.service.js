(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CardDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var cache = {};
      this.fetchUserCards = function() {
        if (cache.cards && (Date.now() - cache.timestamp < 60000)) {
          return $q.resolve(cache.cards);
        }
        return $http.get(API_CONFIG.baseUrl + '/cards', { timeout: API_CONFIG.timeout })
          .then(function(response) {
            cache.cards = response.data;
            cache.timestamp = Date.now();
            return response.data;
          })
          .catch(function(error) {
            if (cache.cards) return cache.cards;
            return $q.reject(error);
          });
      };
      this.fetchCardSpendAnalysis = function(cardId) {
        return $http.get(API_CONFIG.baseUrl + '/cards/' + cardId + '/spend', { timeout: API_CONFIG.timeout })
          .then(function(response) {
            return response.data;
          });
      };
      this.getCardBalances = function() {
        return $http.get(API_CONFIG.baseUrl + '/cards/balances', { timeout: API_CONFIG.timeout })
          .then(function(response) {
            return response.data;
          })
          .catch(function() {
            return [{
              cardId: 'demo1',
              creditLimit: 50000,
              availableCredit: 35000,
              outstandingAmount: 15000
            }, {
              cardId: 'demo2',
              creditLimit: 30000,
              availableCredit: 25000,
              outstandingAmount: 5000
            }];
          });
      };
    }]);
})();