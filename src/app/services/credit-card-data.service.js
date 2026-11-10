(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardDataService', ['$http', '$q', 'API_BASE_URL', CreditCardDataService]);

  function CreditCardDataService($http, $q, API_BASE_URL) {
    var cache = null;
    var cacheTime = null;
    var CACHE_DURATION = 5 * 60 * 1000;

    return {
      fetchUserCards: fetchUserCards,
      clearCache: clearCache
    };

    function fetchUserCards(forceRefresh) {
      if (!forceRefresh && cache && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
        return $q.resolve(cache);
      }
      return $http.get(API_BASE_URL + '/creditcards/user')
        .then(function(response) {
          cache = response.data;
          cacheTime = Date.now();
          return cache;
        })
        .catch(function(error) {
          console.error('Error fetching credit cards:', error);
          if (cache) return cache;
          return $q.reject(error);
        });
    }

    function clearCache() {
      cache = null;
      cacheTime = null;
    }
  }
})();