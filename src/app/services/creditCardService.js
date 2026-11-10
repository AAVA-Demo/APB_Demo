(function() {
  'use strict';
  angular.module('creditCardApp').factory('CreditCardService', ['$http', '$q', function($http, $q) {
    var cache = {};
    var cacheTimeout = 30000;
    function getCardBalances(userId) {
      var cacheKey = 'balances_' + userId;
      if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < cacheTimeout)) {
        return $q.resolve(cache[cacheKey].data);
      }
      return $http.get('/api/cards/balances', { params: { userId: userId } })
        .then(function(response) {
          cache[cacheKey] = { data: response.data, timestamp: Date.now() };
          return response.data;
        })
        .catch(function(error) {
          console.error('Error fetching card balances:', error);
          return $q.reject(error);
        });
    }
    function getCardDetails(cardIds) {
      if (!cardIds || cardIds.length === 0) {
        return $q.resolve([]);
      }
      var promises = cardIds.map(function(cardId) {
        var cacheKey = 'card_' + cardId;
        if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < cacheTimeout)) {
          return $q.resolve(cache[cacheKey].data);
        }
        return $http.get('/api/cards/' + cardId + '/details')
          .then(function(response) {
            cache[cacheKey] = { data: response.data, timestamp: Date.now() };
            return response.data;
          });
      });
      return $q.all(promises).catch(function(error) {
        console.error('Error fetching card details:', error);
        return $q.reject(error);
      });
    }
    function clearCache() {
      cache = {};
    }
    return {
      getCardBalances: getCardBalances,
      getCardDetails: getCardDetails,
      clearCache: clearCache
    };
  }]);
})();