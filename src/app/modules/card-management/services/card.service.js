(function() {
  'use strict';
  angular.module('cardManagement')
    .factory('CardService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      return {
        getAllCards: function() {
          return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS, { timeout: API_CONFIG.TIMEOUT })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        getCardById: function(cardId) {
          var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARD_BY_ID.replace(':cardId', cardId);
          return $http.get(url, { timeout: API_CONFIG.TIMEOUT })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        createCard: function(cardData) {
          return $http.post(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS, cardData, { timeout: API_CONFIG.TIMEOUT })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        updateCard: function(cardId, cardData) {
          var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARD_BY_ID.replace(':cardId', cardId);
          return $http.put(url, cardData, { timeout: API_CONFIG.TIMEOUT })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        deleteCard: function(cardId) {
          var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARD_BY_ID.replace(':cardId', cardId);
          return $http.delete(url, { timeout: API_CONFIG.TIMEOUT })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        }
      };
    }]);
})();