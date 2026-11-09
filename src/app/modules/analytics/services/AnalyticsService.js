(function() {
  'use strict';
  angular.module('analytics.module')
    .service('AnalyticsService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
      this.getSpendingInsights = function(filters) {
        const mockData = {
          userId: AuthService.getUserId(),
          month: filters && filters.month ? filters.month : new Date().toISOString().substring(0, 7),
          categories: [
            { name: 'Food & Dining', amount: 850.50, transactionCount: 15 },
            { name: 'Fuel', amount: 320.00, transactionCount: 8 },
            { name: 'Shopping', amount: 1200.75, transactionCount: 12 },
            { name: 'Travel', amount: 450.00, transactionCount: 3 },
            { name: 'Entertainment', amount: 180.00, transactionCount: 5 },
            { name: 'Utilities', amount: 380.00, transactionCount: 4 },
            { name: 'Healthcare', amount: 220.00, transactionCount: 2 },
            { name: 'Education', amount: 500.00, transactionCount: 1 },
            { name: 'Miscellaneous', amount: 144.42, transactionCount: 6 }
          ],
          totalSpend: 4245.67,
          currency: 'USD'
        };
        return $q.resolve(mockData);
      };
      this.getMonthlyTrends = function(filters) {
        const mockTrends = {
          months: ['2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'],
          spending: [3200.50, 3450.75, 3100.00, 3800.25, 4100.00, 4245.67]
        };
        return $q.resolve(mockTrends);
      };
    }]);
})();