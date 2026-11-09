(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CreditCardService', ['$http', '$q', CreditCardService]);
  function CreditCardService($http, $q) {
    var service = {
      getCards: getCards
    };
    var cache = null;
    return service;
    function getCards() {
      if (cache) {
        return $q.resolve(cache);
      }
      return $http.get('/api/cards')
        .then(function(response) {
          cache = response.data;
          return cache;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    }
  }
})();