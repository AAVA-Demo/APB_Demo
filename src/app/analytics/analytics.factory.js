(function() {
  'use strict';
  angular.module('app.analytics')
    .factory('AnalyticsEngine', function() {
      var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      
      function categorizeAndAggregate(transactions) {
        var categoryTotals = {};
        var monthlyTotals = {};
        var totalSpend = 0;
        
        categories.forEach(function(cat) {
          categoryTotals[cat] = 0;
        });
        
        transactions.forEach(function(txn) {
          var category = txn.category || 'Miscellaneous';
          var amount = parseFloat(txn.amount) || 0;
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
          totalSpend += amount;
          
          var monthKey = new Date(txn.date).toISOString().substring(0, 7);
          monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + amount;
        });
        
        var categoryBreakdown = [];
        for (var cat in categoryTotals) {
          if (categoryTotals[cat] > 0) {
            categoryBreakdown.push({
              category: cat,
              total: categoryTotals[cat],
              percentage: totalSpend > 0 ? ((categoryTotals[cat] / totalSpend) * 100).toFixed(1) : 0
            });
          }
        }
        
        var monthlyTrends = [];
        for (var month in monthlyTotals) {
          monthlyTrends.push({
            month: month,
            total: monthlyTotals[month]
          });
        }
        monthlyTrends.sort(function(a, b) {
          return a.month.localeCompare(b.month);
        });
        
        return {
          categoryBreakdown: categoryBreakdown,
          monthlyTrends: monthlyTrends,
          totalSpend: totalSpend,
          transactionCount: transactions.length
        };
      }
      
      return {
        categorizeAndAggregate: categorizeAndAggregate
      };
    });
})();