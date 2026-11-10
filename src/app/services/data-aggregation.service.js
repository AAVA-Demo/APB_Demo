(function() {
  'use strict';
  angular.module('creditCardApp').service('DataAggregationService', [function() {
    
    this.categorizeAndAggregate = function(transactions) {
      if (!transactions || transactions.length === 0) {
        return { monthlyTrends: [], categoryTotals: [] };
      }
      
      const categoryTotals = {};
      const monthlyData = {};
      
      transactions.forEach(txn => {
        if (!categoryTotals[txn.category]) {
          categoryTotals[txn.category] = { categoryName: txn.category, totalAmount: 0, transactionCount: 0 };
        }
        categoryTotals[txn.category].totalAmount += txn.amount;
        categoryTotals[txn.category].transactionCount++;
        
        const monthKey = txn.date.getFullYear() + '-' + (txn.date.getMonth() + 1);
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthKey, totalSpend: 0, categoryBreakdown: {} };
        }
        monthlyData[monthKey].totalSpend += txn.amount;
        
        if (!monthlyData[monthKey].categoryBreakdown[txn.category]) {
          monthlyData[monthKey].categoryBreakdown[txn.category] = 0;
        }
        monthlyData[monthKey].categoryBreakdown[txn.category] += txn.amount;
      });
      
      const totalSpend = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.totalAmount, 0);
      Object.values(categoryTotals).forEach(cat => {
        cat.percentage = ((cat.totalAmount / totalSpend) * 100).toFixed(2);
      });
      
      const monthlyTrends = Object.values(monthlyData).sort((a, b) => {
        return new Date(a.month) - new Date(b.month);
      });
      
      return {
        monthlyTrends: monthlyTrends,
        categoryTotals: Object.values(categoryTotals)
      };
    };
    
    this.filterByDateRange = function(transactions, startDate, endDate) {
      return transactions.filter(txn => {
        const txnDate = new Date(txn.date);
        return txnDate >= startDate && txnDate <= endDate;
      });
    };
    
    this.filterByCategory = function(transactions, category) {
      return transactions.filter(txn => txn.category === category);
    };
  }]);
})();