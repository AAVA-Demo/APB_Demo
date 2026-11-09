(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .service('AnalyticsDataService', ['CategoryService', '$filter', AnalyticsDataService]);
  function AnalyticsDataService(CategoryService, $filter) {
    const service = {
      aggregateByCategory: aggregateByCategory,
      calculateMonthlyTrends: calculateMonthlyTrends
    };
    return service;
    function aggregateByCategory(transactions) {
      const categoryMap = {};
      const total = transactions.reduce(function(sum, t) { return sum + t.amount; }, 0);
      transactions.forEach(function(t) {
        if (!categoryMap[t.category]) {
          categoryMap[t.category] = { categoryName: t.category, totalAmount: 0, transactionCount: 0 };
        }
        categoryMap[t.category].totalAmount += t.amount;
        categoryMap[t.category].transactionCount++;
      });
      const summaries = Object.keys(categoryMap).map(function(key) {
        const summary = categoryMap[key];
        summary.percentage = total > 0 ? (summary.totalAmount / total) * 100 : 0;
        return summary;
      });
      return summaries.sort(function(a, b) { return b.totalAmount - a.totalAmount; });
    }
    function calculateMonthlyTrends(transactions) {
      const monthMap = {};
      transactions.forEach(function(t) {
        const monthKey = $filter('date')(t.date, 'yyyy-MM');
        if (!monthMap[monthKey]) {
          monthMap[monthKey] = { month: monthKey, totalSpend: 0, transactions: [] };
        }
        monthMap[monthKey].totalSpend += t.amount;
        monthMap[monthKey].transactions.push(t);
      });
      const trends = Object.keys(monthMap).map(function(key) {
        const trend = monthMap[key];
        trend.categoryBreakdown = aggregateByCategory(trend.transactions);
        delete trend.transactions;
        return trend;
      });
      return trends.sort(function(a, b) { return a.month.localeCompare(b.month); });
    }
  }
})();