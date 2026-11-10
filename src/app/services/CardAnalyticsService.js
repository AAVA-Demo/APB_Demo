(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CardAnalyticsService', ['$q', function($q) {
      return {
        getCardAnalytics: function(cardId) {
          var deferred = $q.defer();
          var mockAnalytics = {
            cardId: cardId,
            monthlyTrends: [
              { month: 'Jan', spend: 10000 },
              { month: 'Feb', spend: 12000 },
              { month: 'Mar', spend: 11500 },
              { month: 'Apr', spend: 13000 },
              { month: 'May', spend: 12500 },
              { month: 'Jun', spend: 14000 }
            ],
            categoryBreakdown: {
              'Food & Dining': 4000,
              'Fuel': 2000,
              'Shopping': 3500,
              'Travel': 2500,
              'Entertainment': 1500,
              'Utilities': 1000
            },
            lastTransactionDate: '2024-06-15',
            averageMonthlySpend: 12166.67
          };
          setTimeout(function() {
            deferred.resolve(mockAnalytics);
          }, 400);
          return deferred.promise;
        }
      };
    }]);
})();