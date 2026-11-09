(function() {
  'use strict';
  angular.module('transactionModule')
    .factory('CreditCardService', ['$http', '$q', function($http, $q) {
      return {
        getCardDetails: function(cardIds) {
          return $http.get('/api/cards')
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              console.error('Error fetching card details:', error);
              return $q.reject(error);
            });
        }
      };
    }]);
})();