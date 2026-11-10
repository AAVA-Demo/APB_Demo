(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardService', CreditCardService);
  CreditCardService.$inject = ['$http', '$q'];
  function CreditCardService($http, $q) {
    var service = {
      getAllCards: getAllCards
    };
    return service;
    function getAllCards() {
      return $http.get('/api/cards')
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    }
  }
})();