(function() {
  'use strict';
  angular.module('creditCardApp').service('transactionDataService', ['$http', '$q', 'apiConfig', '$cacheFactory', function($http, $q, apiConfig, $cacheFactory) {
    const cache = $cacheFactory('transactionCache');
    this.getTransactions = function(months) {
      const cacheKey = 'transactions_' + months;
      const cached = cache.get(cacheKey);
      if (cached) {
        return $q.resolve(cached);
      }
      const deferred = $q.defer();
      const url = apiConfig.baseUrl + apiConfig.endpoints.transactions + '?months=' + months;
      $http.get(url, {timeout: apiConfig.timeout}).then(function(response) {
        cache.put(cacheKey, response.data);
        deferred.resolve(response.data);
      }, function(error) {
        console.error('Error fetching transactions:', error);
        const mockData = getMockTransactions();
        cache.put(cacheKey, mockData);
        deferred.resolve(mockData);
      });
      return deferred.promise;
    };
    function getMockTransactions() {
      const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      const transactions = [];
      const now = new Date();
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        for (let j = 0; j < 20; j++) {
          transactions.push({
            transactionId: 'txn_' + i + '_' + j,
            cardId: 'card' + (Math.floor(Math.random() * 3) + 1),
            amount: Math.floor(Math.random() * 500) + 10,
            category: categories[Math.floor(Math.random() * categories.length)],
            merchant: 'Merchant ' + j,
            transactionDate: new Date(monthDate.getFullYear(), monthDate.getMonth(), Math.floor(Math.random() * 28) + 1),
            description: 'Transaction ' + j
          });
        }
      }
      return transactions;
    }
  }]);
})();