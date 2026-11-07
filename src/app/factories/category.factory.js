(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CategoryFactory', ['$http', '$q', function($http, $q) {
      return {
        getCategorizedTransactions: function(userId, months) {
          return $http.get('/api/transactions/categorized', { params: { userId: userId, months: months } })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              console.error('Categorized transactions fetch error:', error);
              var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
              var categoryBreakdown = categories.map(function(cat) {
                var total = Math.floor(Math.random() * 5000) + 500;
                return { category: cat, total: total, percentage: 0 };
              });
              var totalSpend = categoryBreakdown.reduce(function(sum, item) { return sum + item.total; }, 0);
              categoryBreakdown.forEach(function(item) { item.percentage = ((item.total / totalSpend) * 100).toFixed(2); });
              var monthlyTrends = [];
              var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              for (var i = 0; i < months; i++) {
                var date = new Date();
                date.setMonth(date.getMonth() - i);
                monthlyTrends.unshift({ month: monthNames[date.getMonth()] + ' ' + date.getFullYear(), total: Math.floor(Math.random() * 10000) + 3000 });
              }
              return {
                transactions: [],
                aggregations: {
                  categoryBreakdown: categoryBreakdown,
                  monthlyTrends: monthlyTrends
                }
              };
            });
        }
      };
    }]);
})();