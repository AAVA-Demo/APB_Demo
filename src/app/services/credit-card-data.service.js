(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CreditCardDataService', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS) {
      this.getDashboardData = function() {
        return $http.get(API_ENDPOINTS.dashboard).then(function(response) {
          return response.data;
        }, function(error) {
          return $q.reject(error);
        });
      };
      this.getCardDetails = function(cardId) {
        return $http.get(API_ENDPOINTS.cards + '/' + cardId).then(function(response) {
          return response.data;
        });
      };
    }]);
})();