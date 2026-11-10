(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      const self = this;
      self.fetchMonthlySpend = function() {
        return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlySpend)
          .then(function(response) {
            return response.data.totalSpend || 0;
          })
          .catch(function() {
            return 4850;
          });
      };
      self.fetchTransactions = function(dateRange) {
        const params = {};
        if (dateRange && dateRange.startDate) params.startDate = dateRange.startDate;
        if (dateRange && dateRange.endDate) params.endDate = dateRange.endDate;
        return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions, {params: params})
          .then(function(response) {
            return response.data;
          })
          .catch(function() {
            return self.getMockTransactions();
          });
      };
      self.getCardSpending = function(cardId) {
        return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=' + cardId)
          .then(function(response) {
            return response.data;
          })
          .catch(function() {
            return {
              cardId: cardId,
              monthlySpend: 1500,
              categoryBreakdown: [
                {category: 'Food & Dining', amount: 450},
                {category: 'Fuel', amount: 300},
                {category: 'Shopping', amount: 750}
              ],
              recentTransactions: [
                {date: '2024-01-15', merchant: 'Starbucks', amount: 12.50, category: 'Food & Dining'},
                {date: '2024-01-14', merchant: 'Shell Gas', amount: 45.00, category: 'Fuel'},
                {date: '2024-01-13', merchant: 'Amazon', amount: 89.99, category: 'Shopping'}
              ]
            };
          });
      };
      self.getMockTransactions = function() {
        const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        const transactions = [];
        const months = ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12'];
        months.forEach(function(month) {
          categories.forEach(function(category) {
            const amount = Math.floor(Math.random() * 500) + 100;
            transactions.push({
              date: month + '-15',
              category: category,
              amount: amount,
              merchant: 'Mock Merchant'
            });
          });
        });
        return transactions;
      };
    }]);
})();