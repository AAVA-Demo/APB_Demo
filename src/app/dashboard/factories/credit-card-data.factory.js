(function() {
  'use strict';
  angular.module('app.dashboard')
    .factory('CreditCardDataFactory', ['$http', '$q', function($http, $q) {
      const factory = {};
      factory.getAllCards = function() {
        return $http.get('/api/cards/summary', { cache: true })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching cards:', error);
            return $q.reject(error);
          });
      };
      return factory;
    }]);
})();