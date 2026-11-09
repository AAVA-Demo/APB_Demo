(function() {
  'use strict';
  angular.module('spendingAnalyticsModule')
    .factory('TransactionDataService', ['$http', '$q', function($http, $q) {
      var mockTransactions = [
        { id: 'txn-001', userId: 'user-001', cardId: 'card-001', amount: 150, merchantName: 'Starbucks', merchantCode: 'FOOD', category: 'Food & Dining', transactionDate: new Date('2026-11-01') },
        { id: 'txn-002', userId: 'user-001', cardId: 'card-001', amount: 80, merchantName: 'Shell', merchantCode: 'FUEL', category: 'Fuel', transactionDate: new Date('2026-11-02') },
        { id: 'txn-003', userId: 'user-001', cardId: 'card-002', amount: 200, merchantName: 'Amazon', merchantCode: 'SHOP', category: 'Shopping', transactionDate: new Date('2026-11-03') },
        { id: 'txn-004', userId: 'user-001', cardId: 'card-002', amount: 500, merchantName: 'Delta Airlines', merchantCode: 'TRVL', category: 'Travel', transactionDate: new Date('2026-11-04') },
        { id: 'txn-005', userId: 'user-001', cardId: 'card-003', amount: 120, merchantName: 'Netflix', merchantCode: 'ENT', category: 'Entertainment', transactionDate: new Date('2026-11-05') },
        { id: 'txn-006', userId: 'user-001', cardId: 'card-003', amount: 90, merchantName: 'Electric Company', merchantCode: 'UTIL', category: 'Utilities', transactionDate: new Date('2026-10-15') },
        { id: 'txn-007', userId: 'user-001', cardId: 'card-001', amount: 250, merchantName: 'Hospital', merchantCode: 'HLTH', category: 'Healthcare', transactionDate: new Date('2026-10-20') },
        { id: 'txn-008', userId: 'user-001', cardId: 'card-002', amount: 300, merchantName: 'University', merchantCode: 'EDU', category: 'Education', transactionDate: new Date('2026-10-25') },
        { id: 'txn-009', userId: 'user-001', cardId: 'card-003', amount: 50, merchantName: 'Misc Store', merchantCode: 'MISC', category: 'Miscellaneous', transactionDate: new Date('2026-09-10') }
      ];
      return {
        getTransactions: function(userId) {
          return $q.resolve(mockTransactions.filter(function(txn) { return txn.userId === userId; }));
        }
      };
    }]);
})();