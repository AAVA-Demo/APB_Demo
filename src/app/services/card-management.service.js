(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CardManagementService', ['$http', '$q', 'API_BASE_URL', CardManagementService]);

  function CardManagementService($http, $q, API_BASE_URL) {
    return {
      getUserCards: getUserCards
    };

    function getUserCards() {
      return $http.get(API_BASE_URL + '/cards/user')
        .then(function(response) {
          return response.data.map(function(card) { return card.cardId; });
        })
        .catch(function(error) {
          console.error('Error fetching user cards:', error);
          return $q.reject(error);
        });
    }
  }
})();