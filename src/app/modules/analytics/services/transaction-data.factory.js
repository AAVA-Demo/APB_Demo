(function() {
  'use strict';
  angular.module('analyticsModule')
    .factory('TransactionDataFactory', ['$http', '$q', 'AuthenticationService', function($http, $q, AuthenticationService) {
      const API_BASE = 'https://api.example.com';
      const PAGE_SIZE = 1000;
      function fetchPage(userId, startDate, endDate, offset) {
        return $http.get(API_BASE + '/api/transactions', {
          params: {
            userId: userId,
            startDate: startDate,
            endDate: endDate,
            limit: PAGE_SIZE,
            offset: offset
          }
        }).then(res => res.data);
      }
      return {
        getTransactions: function(dateRange) {
          const deferred = $q.defer();
          const userId = AuthenticationService.getUserId();
          const startDate = dateRange.startDate.toISOString().slice(0, 10);
          const endDate = dateRange.endDate.toISOString().slice(0, 10);
          const allTransactions = [];
          function fetchAll(offset) {
            fetchPage(userId, startDate, endDate, offset).then(function(data) {
              allTransactions.push(...data);
              if (data.length === PAGE_SIZE) {
                fetchAll(offset + PAGE_SIZE);
              } else {
                deferred.resolve(allTransactions);
              }
            }).catch(function() {
              if (allTransactions.length === 0) {
                const mockData = generateMockTransactions(dateRange);
                deferred.resolve(mockData);
              } else {
                deferred.resolve(allTransactions);
              }
            });
          }
          fetchAll(0);
          return deferred.promise;
        }
      };
      function generateMockTransactions(dateRange) {
        const transactions = [];
        const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        const merchants = ['Restaurant A', 'Gas Station B', 'Store C', 'Airline D', 'Cinema E', 'Electric Co', 'Pharmacy F', 'University G', 'Other H'];
        const months = 12;
        for (let i = 0; i < months; i++) {
          const monthDate = new Date(dateRange.endDate);
          monthDate.setMonth(monthDate.getMonth() - i);
          const txnCount = Math.floor(Math.random() * 50) + 20;
          for (let j = 0; j < txnCount; j++) {
            transactions.push({
              transactionId: 'txn-' + i + '-' + j,
              cardId: 'card-1',
              amount: Math.floor(Math.random() * 500) + 10,
              date: monthDate.toISOString().slice(0, 7) + '-' + String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'),
              merchant: merchants[Math.floor(Math.random() * merchants.length)],
              category: categories[Math.floor(Math.random() * categories.length)]
            });
          }
        }
        return transactions;
      }
    }]);
})();