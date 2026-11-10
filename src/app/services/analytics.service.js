(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AnalyticsService', ['TransactionService', 'CategoryService', '$q', function(TransactionService, CategoryService, $q) {
      const self = this;
      self.getSpendingAnalytics = function(filter) {
        return TransactionService.fetchTransactions(filter).then(function(transactions) {
          const categorized = CategoryService.categorizeTransactions(transactions);
          const categoryTotals = self.computeCategoryTotals(categorized);
          const monthlyTrends = self.computeMonthlyTrends(categorized);
          return {
            categorySpending: categoryTotals,
            monthlyTrends: monthlyTrends
          };
        });
      };
      self.computeCategoryTotals = function(transactions) {
        const totals = {};
        let grandTotal = 0;
        transactions.forEach(function(txn) {
          if (!totals[txn.category]) {
            totals[txn.category] = {category: txn.category, amount: 0, transactionCount: 0};
          }
          totals[txn.category].amount += txn.amount;
          totals[txn.category].transactionCount++;
          grandTotal += txn.amount;
        });
        const result = [];
        Object.keys(totals).forEach(function(cat) {
          totals[cat].percentage = grandTotal > 0 ? (totals[cat].amount / grandTotal * 100).toFixed(2) : 0;
          result.push(totals[cat]);
        });
        return result;
      };
      self.computeMonthlyTrends = function(transactions) {
        const monthlyData = {};
        transactions.forEach(function(txn) {
          const month = txn.date.substring(0, 7);
          if (!monthlyData[month]) {
            monthlyData[month] = {month: month, totalSpend: 0, categoryBreakdown: {}};
          }
          monthlyData[month].totalSpend += txn.amount;
          if (!monthlyData[month].categoryBreakdown[txn.category]) {
            monthlyData[month].categoryBreakdown[txn.category] = 0;
          }
          monthlyData[month].categoryBreakdown[txn.category] += txn.amount;
        });
        const result = [];
        Object.keys(monthlyData).sort().forEach(function(month) {
          const breakdown = [];
          Object.keys(monthlyData[month].categoryBreakdown).forEach(function(cat) {
            breakdown.push({category: cat, amount: monthlyData[month].categoryBreakdown[cat]});
          });
          result.push({
            month: month,
            totalSpend: monthlyData[month].totalSpend,
            categoryBreakdown: breakdown
          });
        });
        return result;
      };
    }]);
})();