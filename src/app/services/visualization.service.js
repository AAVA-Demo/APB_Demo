(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('VisualizationService', ['CategoryModel', '$filter', function(CategoryModel, $filter) {
      this.prepareChartData = function(categorizedTransactions) {
        var categorySpending = [];
        var totalSpend = 0;
        var topCategory = null;
        angular.forEach(categorizedTransactions, function(transactions, categoryName) {
          var categoryTotal = 0;
          var monthlyTrend = {};
          angular.forEach(transactions, function(tx) {
            categoryTotal += tx.amount;
            var monthKey = $filter('date')(tx.transactionDate, 'MMM yyyy');
            if (!monthlyTrend[monthKey]) {
              monthlyTrend[monthKey] = 0;
            }
            monthlyTrend[monthKey] += tx.amount;
          });
          totalSpend += categoryTotal;
          var trendArray = [];
          angular.forEach(monthlyTrend, function(amount, month) {
            trendArray.push({ month: month, amount: amount });
          });
          var categoryObj = {
            categoryName: categoryName,
            totalSpend: categoryTotal,
            transactionCount: transactions.length,
            percentageOfTotal: 0,
            monthlyTrend: trendArray
          };
          categorySpending.push(categoryObj);
          if (!topCategory || categoryTotal > topCategory.totalSpend) {
            topCategory = categoryObj;
          }
        });
        angular.forEach(categorySpending, function(cat) {
          cat.percentageOfTotal = totalSpend > 0 ? ((cat.totalSpend / totalSpend) * 100).toFixed(2) : 0;
        });
        return {
          categories: categorySpending,
          totalSpend: totalSpend,
          topCategory: topCategory,
          pieChartData: {
            labels: categorySpending.map(function(c) { return c.categoryName; }),
            data: categorySpending.map(function(c) { return c.totalSpend; })
          }
        };
      };
      this.prepareFilteredChartData = function(categorizedTransactions, filterCategory) {
        if (!filterCategory) {
          return this.prepareChartData(categorizedTransactions);
        }
        var filtered = {};
        filtered[filterCategory] = categorizedTransactions[filterCategory] || [];
        return this.prepareChartData(filtered);
      };
    }]);
})();