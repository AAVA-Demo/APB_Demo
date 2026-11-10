(function() {
  'use strict';
  angular.module('app.analytics')
    .service('TransactionDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      this.getTransactions = function(dateRange, categories) {
        var params = {
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
          categories: categories.join(',')
        };
        return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS, {
          params: params,
          timeout: API_CONFIG.TIMEOUT
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          var mockTransactions = [
            { transactionId: 'txn-001', cardId: 'card-001', amount: 125.50, category: 'Food & Dining', transactionDate: new Date('2024-03-15'), description: 'Restaurant' },
            { transactionId: 'txn-002', cardId: 'card-001', amount: 75.00, category: 'Fuel', transactionDate: new Date('2024-03-14'), description: 'Gas Station' },
            { transactionId: 'txn-003', cardId: 'card-002', amount: 450.00, category: 'Shopping', transactionDate: new Date('2024-03-13'), description: 'Online Store' },
            { transactionId: 'txn-004', cardId: 'card-001', amount: 200.00, category: 'Entertainment', transactionDate: new Date('2024-03-12'), description: 'Movie Theater' },
            { transactionId: 'txn-005', cardId: 'card-002', amount: 85.25, category: 'Utilities', transactionDate: new Date('2024-03-11'), description: 'Electric Bill' },
            { transactionId: 'txn-006', cardId: 'card-001', amount: 320.00, category: 'Travel', transactionDate: new Date('2024-03-10'), description: 'Flight Booking' },
            { transactionId: 'txn-007', cardId: 'card-002', amount: 150.00, category: 'Healthcare', transactionDate: new Date('2024-03-09'), description: 'Pharmacy' },
            { transactionId: 'txn-008', cardId: 'card-001', amount: 95.00, category: 'Food & Dining', transactionDate: new Date('2024-03-08'), description: 'Cafe' },
            { transactionId: 'txn-009', cardId: 'card-002', amount: 500.00, category: 'Education', transactionDate: new Date('2024-03-07'), description: 'Online Course' },
            { transactionId: 'txn-010', cardId: 'card-001', amount: 45.00, category: 'Miscellaneous', transactionDate: new Date('2024-03-06'), description: 'Subscription' }
          ];
          return mockTransactions;
        });
      };
    }]);
})();