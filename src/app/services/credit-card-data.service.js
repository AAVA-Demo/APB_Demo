(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CreditCardDataService', ['$http', '$q', CreditCardDataService]);
  function CreditCardDataService($http, $q) {
    var service = {
      getCards: getCards
    };
    var cache = null;
    var cacheTime = null;
    var CACHE_DURATION = 300000;
    return service;
    function getCards() {
      var now = new Date().getTime();
      if (cache && cacheTime && (now - cacheTime < CACHE_DURATION)) {
        return $q.resolve(cache);
      }
      return $http.get('/api/cards')
        .then(function(response) {
          cache = response.data;
          cacheTime = now;
          return cache;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    }
  }
})();