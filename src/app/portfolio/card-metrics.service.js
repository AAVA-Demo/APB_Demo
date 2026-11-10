(function() {
  'use strict';
  angular.module('creditCard.portfolio')
    .service('CardMetricsService', ['$http', '$q', function($http, $q) {
      const API_BASE = '/api/cards';
      this.getCardMetrics = function(cardId) {
        return $http.get(`${API_BASE}/${cardId}/metrics`)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      };
    }]);
})();