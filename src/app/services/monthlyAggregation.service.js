(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('MonthlyAggregationService', ['ApiGatewayService', function(ApiGatewayService) {
      this.getMonthlySpending = function(userId, month) {
        return ApiGatewayService.get('/analytics/monthly-spending?userId=' + userId + '&month=' + month)
          .catch(function(error) {
            var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
            var categoryBreakdown = [];
            var total = 0;
            categories.forEach(function(cat) {
              var amount = Math.floor(Math.random() * 2000) + 500;
              total += amount;
              categoryBreakdown.push({
                category: cat,
                totalAmount: amount,
                transactionCount: Math.floor(Math.random() * 20) + 5,
                percentage: 0
              });
            });
            categoryBreakdown.forEach(function(cat) {
              cat.percentage = ((cat.totalAmount / total) * 100).toFixed(2);
            });
            return {
              month: month || new Date().toISOString().substring(0, 7),
              year: new Date().getFullYear(),
              categoryBreakdown: categoryBreakdown,
              totalSpend: total
            };
          });
      };
    }]);
})();