(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AnalyticsService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      this.getSpendingAnalytics = function(dateRange) {
        var params = '?startDate=' + dateRange.startDate.toISOString() + '&endDate=' + dateRange.endDate.toISOString();
        return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + params)
          .then(function(response) {
            return {
              categories: response.data.categories || [],
              monthlyTrends: response.data.monthlyTrends || [],
              dateRange: dateRange
            };
          })
          .catch(function() {
            return {
              categories: [
                {category: 'Food & Dining', amount: 12500, percentage: 27.6, transactionCount: 45},
                {category: 'Fuel', amount: 8200, percentage: 18.1, transactionCount: 28},
                {category: 'Shopping', amount: 9800, percentage: 21.7, transactionCount: 32},
                {category: 'Travel', amount: 5600, percentage: 12.4, transactionCount: 8},
                {category: 'Entertainment', amount: 4100, percentage: 9.1, transactionCount: 15},
                {category: 'Utilities', amount: 2800, percentage: 6.2, transactionCount: 12},
                {category: 'Healthcare', amount: 1200, percentage: 2.7, transactionCount: 5},
                {category: 'Education', amount: 600, percentage: 1.3, transactionCount: 2},
                {category: 'Miscellaneous', amount: 430, percentage: 0.9, transactionCount: 7}
              ],
              monthlyTrends: [
                {month: '2024-01', totalSpend: 38200, categoryBreakdown: [{category: 'Food & Dining', amount: 10500}, {category: 'Fuel', amount: 7200}, {category: 'Shopping', amount: 8500}, {category: 'Travel', amount: 4800}, {category: 'Entertainment', amount: 3200}, {category: 'Utilities', amount: 2000}, {category: 'Healthcare', amount: 1000}, {category: 'Education', amount: 500}, {category: 'Miscellaneous', amount: 500}]},
                {month: '2024-02', totalSpend: 41500, categoryBreakdown: [{category: 'Food & Dining', amount: 11200}, {category: 'Fuel', amount: 7800}, {category: 'Shopping', amount: 9200}, {category: 'Travel', amount: 5100}, {category: 'Entertainment', amount: 3600}, {category: 'Utilities', amount: 2300}, {category: 'Healthcare', amount: 1100}, {category: 'Education', amount: 600}, {category: 'Miscellaneous', amount: 600}]},
                {month: '2024-03', totalSpend: 45230, categoryBreakdown: [{category: 'Food & Dining', amount: 12500}, {category: 'Fuel', amount: 8200}, {category: 'Shopping', amount: 9800}, {category: 'Travel', amount: 5600}, {category: 'Entertainment', amount: 4100}, {category: 'Utilities', amount: 2800}, {category: 'Healthcare', amount: 1200}, {category: 'Education', amount: 600}, {category: 'Miscellaneous', amount: 430}]}
              ],
              dateRange: dateRange
            };
          });
      };
    }]);
})();