(function() {
  'use strict';
  angular.module('portfolioModule')
    .factory('TransactionHistoryFactory', ['$http', '$q', '$window', function($http, $q, $window) {
      const API_BASE = 'https://api.example.com';
      const CACHE_KEY_PREFIX = 'txn_cache_';
      const CACHE_DURATION = 300000;
      return {
        getTransactions: function(cardId) {
          const cacheKey = CACHE_KEY_PREFIX + cardId;
          const cached = $window.localStorage.getItem(cacheKey);
          if (cached) {
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < CACHE_DURATION) {
              return $q.resolve(data.transactions);
            }
          }
          const currentMonth = new Date().toISOString().slice(0, 7);
          return $http.get(API_BASE + '/api/transactions?cardId=' + cardId + '&month=' + currentMonth)
            .then(function(response) {
              const transactions = response.data;
              $window.localStorage.setItem(cacheKey, JSON.stringify({
                transactions: transactions,
                timestamp: Date.now()
              }));
              return transactions;
            }).catch(function() {
              return [];
            });
        },
        clearCache: function(cardId) {
          if (cardId) {
            $window.localStorage.removeItem(CACHE_KEY_PREFIX + cardId);
          } else {
            Object.keys($window.localStorage).forEach(key => {
              if (key.startsWith(CACHE_KEY_PREFIX)) {
                $window.localStorage.removeItem(key);
              }
            });
          }
        }
      };
    }]);
})();