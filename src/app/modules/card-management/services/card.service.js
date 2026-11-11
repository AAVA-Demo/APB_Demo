(function() {
  'use strict';
  angular.module('app.cardManagement')
    .service('CardService', ['$http', '$q', 'API_CONFIG', 'AuthService', function($http, $q, API_CONFIG, AuthService) {
      var self = this;
      self.getAllCards = function() {
        return $http.get(API_CONFIG.baseUrl + '/cards')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching cards:', error);
            return $q.reject(error);
          });
      };
      self.getCardById = function(cardId) {
        return $http.get(API_CONFIG.baseUrl + '/cards/' + cardId)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching card details:', error);
            return $q.reject(error);
          });
      };
      self.createCard = function(cardData) {
        return $http.post(API_CONFIG.baseUrl + '/cards', cardData)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error creating card:', error);
            return $q.reject(error);
          });
      };
    }]);
})();