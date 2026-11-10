(function() {
  'use strict';
  angular.module('creditCardApp').service('AnalyticsService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
    let cachedTransactions = null;
    
    this.getTransactions = function(months) {
      if (cachedTransactions) {
        return $q.resolve(cachedTransactions);
      }
      
      const deferred = $q.defer();
      const user = AuthService.getCurrentUser();
      
      const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      const mockTransactions = [];
      
      for (let i = 0; i < 12; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        
        for (let j = 0; j < 30; j++) {
          mockTransactions.push({
            transactionId: 'txn' + (i * 30 + j),
            userId: user.userId,
            cardId: 'card00' + ((j % 5) + 1),
            amount: Math.random() * 500 + 10,
            category: categories[Math.floor(Math.random() * categories.length)],
            date: new Date(date.getFullYear(), date.getMonth(), Math.floor(Math.random() * 28) + 1),
            description: 'Transaction ' + (i * 30 + j)
          });
        }
      }
      
      cachedTransactions = mockTransactions;
      deferred.resolve(mockTransactions);
      return deferred.promise;
    };
    
    this.clearCache = function() {
      cachedTransactions = null;
    };
  }]);
})();