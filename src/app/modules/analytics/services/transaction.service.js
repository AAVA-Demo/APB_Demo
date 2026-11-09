(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .service('TransactionService', ['$http', '$q', 'API_CONFIG', '$cacheFactory', TransactionService]);
  function TransactionService($http, $q, API_CONFIG, $cacheFactory) {
    const cache = $cacheFactory('transactionCache');
    const service = {
      fetchTransactions: fetchTransactions
    };
    return service;
    function fetchTransactions(months) {
      const cacheKey = 'transactions_' + months;
      const cached = cache.get(cacheKey);
      if (cached) {
        return $q.resolve(cached);
      }
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions, {
        params: { months: months }
      })
        .then(function(response) {
          const transactions = response.data || generateMockTransactions(months);
          cache.put(cacheKey, transactions);
          setTimeout(function() { cache.remove(cacheKey); }, API_CONFIG.cacheTimeout);
          return transactions;
        })
        .catch(function() {
          return generateMockTransactions(months);
        });
    }
    function generateMockTransactions(months) {
      const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      const transactions = [];
      const now = new Date();
      for (let m = 0; m < months; m++) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
        for (let i = 0; i < 15; i++) {
          const category = categories[Math.floor(Math.random() * categories.length)];
          transactions.push({
            id: 'txn_' + m + '_' + i,
            cardId: 'card' + (Math.floor(Math.random() * 3) + 1),
            amount: Math.floor(Math.random() * 10000) + 500,
            date: new Date(monthDate.getFullYear(), monthDate.getMonth(), Math.floor(Math.random() * 28) + 1),
            merchant: 'Merchant ' + i,
            category: category,
            description: category + ' purchase'
          });
        }
      }
      return transactions;
    }
  }
})();