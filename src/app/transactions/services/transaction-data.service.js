(function() {
  'use strict';
  angular.module('transactionModule').service('TransactionDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
    this.fetchTransactions = function(filter) {
      const deferred = $q.defer();
      const mockTransactions = [
        { transactionId: 'TXN001', cardId: 'CC001', merchantName: 'Amazon', amount: 2500, transactionDate: new Date('2024-01-15'), category: 'Shopping', status: 'Completed', description: 'Online shopping' },
        { transactionId: 'TXN002', cardId: 'CC001', merchantName: 'Shell Petrol', amount: 1200, transactionDate: new Date('2024-01-14'), category: 'Fuel', status: 'Completed', description: 'Fuel refill' },
        { transactionId: 'TXN003', cardId: 'CC002', merchantName: 'Starbucks', amount: 450, transactionDate: new Date('2024-01-13'), category: 'Food & Dining', status: 'Completed', description: 'Coffee' },
        { transactionId: 'TXN004', cardId: 'CC002', merchantName: 'Uber', amount: 320, transactionDate: new Date('2024-01-12'), category: 'Travel', status: 'Completed', description: 'Cab ride' },
        { transactionId: 'TXN005', cardId: 'CC003', merchantName: 'Netflix', amount: 799, transactionDate: new Date('2024-01-11'), category: 'Entertainment', status: 'Completed', description: 'Subscription' },
        { transactionId: 'TXN006', cardId: 'CC003', merchantName: 'Apollo Pharmacy', amount: 1500, transactionDate: new Date('2024-01-10'), category: 'Healthcare', status: 'Completed', description: 'Medicines' },
        { transactionId: 'TXN007', cardId: 'CC001', merchantName: 'Electricity Board', amount: 2200, transactionDate: new Date('2024-01-09'), category: 'Utilities', status: 'Completed', description: 'Bill payment' },
        { transactionId: 'TXN008', cardId: 'CC002', merchantName: 'Coursera', amount: 3500, transactionDate: new Date('2024-01-08'), category: 'Education', status: 'Completed', description: 'Online course' },
        { transactionId: 'TXN009', cardId: 'CC003', merchantName: 'Walmart', amount: 4200, transactionDate: new Date('2024-01-07'), category: 'Shopping', status: 'Completed', description: 'Groceries' },
        { transactionId: 'TXN010', cardId: 'CC001', merchantName: 'Dominos', amount: 850, transactionDate: new Date('2024-01-06'), category: 'Food & Dining', status: 'Completed', description: 'Pizza order' }
      ];
      deferred.resolve(mockTransactions);
      return deferred.promise;
    };
  }]);
})();