(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardAPI', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      const baseUrl = API_CONFIG.baseUrl;

      return {
        getCreditSummary: function(userId) {
          return $http.get(`${baseUrl}${API_CONFIG.endpoints.cardsSummary}?userId=${userId}`)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              console.error('Credit summary API error:', error);
              return $q.reject(error);
            });
        },
        fetchCards: function(userId) {
          return $http.get(`${baseUrl}${API_CONFIG.endpoints.cards}?userId=${userId}`)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              console.error('Fetch cards API error:', error);
              return $q.reject(error);
            });
        }
      };
    }]);
})();