(function() {
  'use strict';
  angular.module('app.cardManagement')
    .factory('CardDataFactory', ['$http', '$q', 'API_CONFIG', CardDataFactory]);
  function CardDataFactory($http, $q, API_CONFIG) {
    return {
      getAllCards: getAllCards,
      getCardById: getCardById
    };
    function getAllCards() {
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    }
    function getCardById(cardId) {
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + cardId)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    }
  }
})();