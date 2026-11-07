(function() {
  'use strict';
  angular.module('creditCard.transactions')
    .service('TransactionDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      this.fetchTransactions = function(userId, page, pageSize, filters) {
        const params = {
          userId: userId,
          page: page || 1,
          limit: pageSize || 100
        };
        if (filters) {
          if (filters.startDate) params.startDate = filters.startDate;
          if (filters.endDate) params.endDate = filters.endDate;
          if (filters.category) params.category = filters.category;
          if (filters.cardId) params.cardId = filters.cardId;
        }
        return $http({
          method: 'GET',
          url: API_CONFIG.baseUrl + '/transactions',
          params: params,
          timeout: 300
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          console.error('Error fetching transactions:', error);
          return $q.resolve({
            transactions: generateMockTransactions(userId, page, pageSize),
            totalCount: 250,
            pageSize: pageSize || 100,
            currentPage: page || 1,
            hasMore: (page || 1) < 3
          });
        });
      };
      this.fetchTransactionDetail = function(transactionId) {
        return $http({
          method: 'GET',
          url: API_CONFIG.baseUrl + '/transactions/' + transactionId,
          timeout: 300
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          console.error('Error fetching transaction detail:', error);
          return $q.resolve({
            transactionId: transactionId,
            userId: 'user-001',
            cardId: 'card-001',
            date: new Date(),
            merchantName: 'Sample Merchant',
            merchantCategory: 'Shopping',
            amount: 125.50,
            currency: 'USD',
            transactionType: 'Purchase',
            status: 'Completed',
            description: 'Sample transaction description',
            metadata: {}
          });
        });
      };
      function generateMockTransactions(userId, page, pageSize) {
        const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        const merchants = ['Amazon', 'Walmart', 'Shell Gas', 'Starbucks', 'Netflix', 'Uber', 'Target', 'Best Buy', 'Whole Foods', 'CVS Pharmacy'];
        const transactions = [];
        const count = Math.min(pageSize, 100);
        for (let i = 0; i < count; i++) {
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 90));
          transactions.push({
            transactionId: 'txn-' + ((page - 1) * pageSize + i + 1),
            userId: userId,
            cardId: Math.random() > 0.5 ? 'card-001' : 'card-002',
            date: date,
            merchantName: merchants[Math.floor(Math.random() * merchants.length)],
            merchantCategory: categories[Math.floor(Math.random() * categories.length)],
            amount: parseFloat((Math.random() * 500 + 10).toFixed(2)),
            currency: 'USD',
            transactionType: 'Purchase',
            status: 'Completed',
            description: 'Transaction description'
          });
        }
        return transactions;
      }
    }]);
})();