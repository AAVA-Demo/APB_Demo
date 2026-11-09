(function() {
  'use strict';
  angular.module('analyticsModule')
    .factory('CreditCardService', ['$http', '$q', function($http, $q) {
      return {
        getAllCards: function() {
          return $http.get('/api/cards')
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              console.error('Error fetching cards for analytics:', error);
              return $q.reject(error);
            });
        }
      };
    }]);
})();