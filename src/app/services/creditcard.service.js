(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CreditCardService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
      var self = this;
      self.getCards = function(userId) {
        return $http.get('/api/cards', {
          params: { userId: userId || AuthService.getUserId() }
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          console.error('Error fetching cards:', error);
          return $q.reject(error);
        });
      };
      self.getCardById = function(cardId) {
        return $http.get('/api/cards/' + cardId)
          .then(function(response) {
            return response.data;
          }).catch(function(error) {
            console.error('Error fetching card:', error);
            return $q.reject(error);
          });
      };
    }]);
})();