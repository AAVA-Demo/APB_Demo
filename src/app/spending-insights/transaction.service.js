(function() {
  'use strict';
  angular.module('spendingInsightsModule')
    .factory('TransactionService', ['$http', '$q', function($http, $q) {
      var mockTransactions = [
        { id: 'txn-001', userId: 'user-001', amount: 150, merchantName: 'Starbucks', merchantCode: 'FOOD', transactionDate: new Date('2026-11-01') },
        { id: 'txn-002', userId: 'user-001', amount: 80, merchantName: 'Shell', merchantCode: 'FUEL', transactionDate: new Date('2026-11-02') },
        { id: 'txn-003', userId: 'user-001', amount: 200, merchantName: 'Amazon', merchantCode: 'SHOP', transactionDate: new Date('2026-11-03') },
        { id: 'txn-004', userId: 'user-001', amount: 500, merchantName: 'Delta Airlines', merchantCode: 'TRVL', transactionDate: new Date('2026-11-04') },
        { id: 'txn-005', userId: 'user-001', amount: 120, merchantName: 'Netflix', merchantCode: 'ENT', transactionDate: new Date('2026-11-05') },
        { id: 'txn-006', userId: 'user-001', amount: 90, merchantName: 'Electric Company', merchantCode: 'UTIL', transactionDate: new Date('2026-10-15') },
        { id: 'txn-007', userId: 'user-001', amount: 250, merchantName: 'Hospital', merchantCode: 'HLTH', transactionDate: new Date('2026-10-20') },
        { id: 'txn-008', userId: 'user-001', amount: 300, merchantName: 'University', merchantCode: 'EDU', transactionDate: new Date('2026-10-25') },
        { id: 'txn-009', userId: 'user-001', amount: 50, merchantName: 'Misc Store', merchantCode: 'MISC', transactionDate: new Date('2026-09-10') },
        { id: 'txn-010', userId: 'user-001', amount: 175, merchantName: 'Restaurant', merchantCode: 'FOOD', transactionDate: new Date('2026-09-15') },
        { id: 'txn-011', userId: 'user-001', amount: 95, merchantName: 'Gas Station', merchantCode: 'FUEL', transactionDate: new Date('2026-08-20') },
        { id: 'txn-012', userId: 'user-001', amount: 400, merchantName: 'Best Buy', merchantCode: 'SHOP', transactionDate: new Date('2026-08-25') }
      ];
      return {
        getTransactions: function(userId, startDate, endDate) {
          return $q.resolve(mockTransactions.filter(function(txn) { return txn.userId === userId; }));
        }
      };
    }]);
})();