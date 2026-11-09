(function() {
  'use strict';
  angular.module('creditCardApp').service('analyticsEngineService', [function() {
    this.computeAnalytics = function(transactions) {
      const categoryBreakdown = {};
      const monthlyTrends = {};
      let totalSpend = 0;
      transactions.forEach(function(txn) {
        totalSpend += txn.amount;
        if (!categoryBreakdown[txn.category]) {
          categoryBreakdown[txn.category] = 0;
        }
        categoryBreakdown[txn.category] += txn.amount;
        const monthKey = getMonthKey(txn.transactionDate);
        if (!monthlyTrends[monthKey]) {
          monthlyTrends[monthKey] = {month: monthKey, totalSpend: 0, categorySpends: {}};
        }
        monthlyTrends[monthKey].totalSpend += txn.amount;
        if (!monthlyTrends[monthKey].categorySpends[txn.category]) {
          monthlyTrends[monthKey].categorySpends[txn.category] = 0;
        }
        monthlyTrends[monthKey].categorySpends[txn.category] += txn.amount;
      });
      const categoryArray = Object.keys(categoryBreakdown).map(function(cat) {
        return {
          category: cat,
          amount: categoryBreakdown[cat],
          percentage: totalSpend > 0 ? (categoryBreakdown[cat] / totalSpend * 100).toFixed(2) : 0
        };
      });
      const monthlyArray = Object.keys(monthlyTrends).map(function(key) {
        return monthlyTrends[key];
      }).sort(function(a, b) {
        return new Date(a.month) - new Date(b.month);
      });
      return {
        categoryBreakdown: categoryArray,
        monthlyTrends: monthlyArray,
        totalSpend: totalSpend,
        transactionCount: transactions.length
      };
    };
    this.recomputeAnalytics = function(transactions, filters) {
      let filtered = transactions;
      if (filters.startDate) {
        filtered = filtered.filter(txn => new Date(txn.transactionDate) >= new Date(filters.startDate));
      }
      if (filters.endDate) {
        filtered = filtered.filter(txn => new Date(txn.transactionDate) <= new Date(filters.endDate));
      }
      if (filters.category && filters.category !== 'All') {
        filtered = filtered.filter(txn => txn.category === filters.category);
      }
      return this.computeAnalytics(filtered);
    };
    function getMonthKey(date) {
      const d = new Date(date);
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    }
  }]);
})();