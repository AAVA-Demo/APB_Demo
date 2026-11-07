(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .service('TransactionDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      this.getTransactions = function(userId, dateRange) {
        const params = {
          userId: userId,
          startDate: dateRange.startDate.toISOString().split('T')[0],
          endDate: dateRange.endDate.toISOString().split('T')[0],
          limit: 1000,
          offset: 0
        };
        return $http({
          method: 'GET',
          url: API_CONFIG.baseUrl + '/transactions',
          params: params,
          timeout: API_CONFIG.timeout
        }).then(function(response) {
          return response.data.transactions || [];
        }).catch(function(error) {
          console.error('Error fetching transactions for analytics:', error);
          return $q.resolve(generateMockAnalyticsTransactions(userId, dateRange));
        });
      };
      function generateMockAnalyticsTransactions(userId, dateRange) {
        const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        const merchants = ['Amazon', 'Walmart', 'Shell Gas', 'Starbucks', 'Netflix', 'Uber', 'Target', 'Best Buy', 'Whole Foods', 'CVS Pharmacy'];
        const transactions = [];
        const daysDiff = Math.floor((dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24));
        const txnCount = Math.min(daysDiff * 2, 500);
        for (let i = 0; i < txnCount; i++) {
          const randomDays = Math.floor(Math.random() * daysDiff);
          const date = new Date(dateRange.startDate);
          date.setDate(date.getDate() + randomDays);
          const category = categories[Math.floor(Math.random() * categories.length)];
          transactions.push({
            transactionId: 'txn-analytics-' + i,
            userId: userId,
            cardId: Math.random() > 0.5 ? 'card-001' : 'card-002',
            cardName: Math.random() > 0.5 ? 'Visa Platinum' : 'Mastercard Gold',
            date: date,
            merchantName: merchants[Math.floor(Math.random() * merchants.length)],
            merchantCategory: category,
            category: category,
            amount: parseFloat((Math.random() * 300 + 10).toFixed(2)),
            currency: 'USD'
          });
        }
        return transactions;
      }
    }]);
})();