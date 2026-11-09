(function() {
  'use strict';
  angular.module('creditCardApp').service('AnalyticsService', ['TransactionService', 'CategoryService', '$q', function(TransactionService, CategoryService, $q) {
    this.getSpendingAnalytics = function(startDate, endDate) {
      return TransactionService.fetchTransactions(startDate, endDate).then(transactions => {
        const categorized = CategoryService.categorizeTransactions(transactions);
        const categoryBreakdown = this._aggregateByCategory(categorized);
        const monthlyTrend = this._aggregateByMonth(categorized);
        return {
          categoryBreakdown: categoryBreakdown,
          monthlyTrend: monthlyTrend,
          timeRange: { startDate: startDate, endDate: endDate }
        };
      });
    };
    this._aggregateByCategory = function(transactions) {
      const categories = CategoryService.getCategories();
      const totals = {};
      categories.forEach(cat => { totals[cat.id] = { categoryId: cat.id, categoryName: cat.name, totalAmount: 0 }; });
      transactions.forEach(txn => {
        if (totals[txn.categoryId]) {
          totals[txn.categoryId].totalAmount += txn.amount;
        }
      });
      const totalSpend = Object.values(totals).reduce((sum, cat) => sum + cat.totalAmount, 0);
      return Object.values(totals).map(cat => {
        cat.percentage = totalSpend > 0 ? ((cat.totalAmount / totalSpend) * 100).toFixed(2) : 0;
        return cat;
      });
    };
    this._aggregateByMonth = function(transactions) {
      const monthMap = {};
      transactions.forEach(txn => {
        const month = new Date(txn.date).toISOString().substring(0, 7);
        if (!monthMap[month]) {
          monthMap[month] = { month: month, totalAmount: 0, categoryBreakdown: {} };
        }
        monthMap[month].totalAmount += txn.amount;
        if (!monthMap[month].categoryBreakdown[txn.categoryId]) {
          monthMap[month].categoryBreakdown[txn.categoryId] = 0;
        }
        monthMap[month].categoryBreakdown[txn.categoryId] += txn.amount;
      });
      return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));
    };
  }]);
})();