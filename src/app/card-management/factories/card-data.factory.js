(function() {
  'use strict';
  angular.module('app.cardManagement')
    .factory('CardDataFactory', ['$http', '$q', function($http, $q) {
      const factory = {};
      factory.fetchUserCards = function(userId) {
        return $http.get('/api/cards/' + userId)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching user cards:', error);
            return $q.reject(error);
          });
      };
      factory.fetchCardById = function(cardId) {
        return $http.get('/api/cards/' + cardId + '/details')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching card details:', error);
            return $q.reject(error);
          });
      };
      return factory;
    }]);
})();