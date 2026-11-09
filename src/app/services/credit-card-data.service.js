(function() {
  'use strict';
  angular.module('dashboardModule')
    .factory('CreditCardDataService', ['$http', '$q', function($http, $q) {
      return {
        getAllCards: function() {
          return $http.get('/api/cards')
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              console.error('Error fetching cards:', error);
              return $q.reject(error);
            });
        }
      };
    }]);
})();