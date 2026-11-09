(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardDataFactory', ['$http', '$q', 'API_ENDPOINTS', CreditCardDataFactory]);
  function CreditCardDataFactory($http, $q, API_ENDPOINTS) {
    return {
      getCards: function() {
        var userId = 'user123';
        return $http.get(API_ENDPOINTS.CARDS.replace(':userId', userId))
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      }
    };
  }
})();