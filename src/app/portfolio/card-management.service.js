(function() {
  'use strict';
  angular.module('creditCard.portfolio')
    .service('CardManagementService', ['$http', '$q', function($http, $q) {
      const API_BASE = '/api/cards';
      this.getCardList = function(userId) {
        return $http.get(`${API_BASE}?userId=${userId}`)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      };
      this.getCardDetails = function(cardId) {
        return $http.get(`${API_BASE}/${cardId}`)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      };
    }]);
})();