(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .factory('CardDataFactory', ['$http', '$q', function($http, $q) {
      return {
        fetchCards: function() {
          return $http.get('/api/cards')
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