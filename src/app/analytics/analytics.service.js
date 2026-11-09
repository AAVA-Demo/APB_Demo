(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsService', ['$q', 'TransactionFactory', 'CategorizationService', function($q, TransactionFactory, CategorizationService) {
      this.getSpendingData = function(filters) {
        return TransactionFactory.fetchTransactions()
          .then(function(transactions) {
            var filtered = applyFilters(transactions, filters);
            var categorized = CategorizationService.categorize(filtered);
            return aggregateData(categorized);
          });
      };
      function applyFilters(transactions, filters) {
        return transactions.filter(function(t) {
          var matchDateFrom = !filters.dateFrom || new Date(t.date) >= new Date(filters.dateFrom);
          var matchDateTo = !filters.dateTo || new Date(t.date) <= new Date(filters.dateTo);
          var matchCard = !filters.cardId || t.cardId === filters.cardId;
          return matchDateFrom && matchDateTo && matchCard;
        });
      }
      function aggregateData(transactions) {
        var categorySpend = {};
        var monthlyTrends = {};
        var cardWiseSpend = {};
        var totalSpend = 0;
        transactions.forEach(function(t) {
          categorySpend[t.category] = (categorySpend[t.category] || 0) + t.amount;
          var month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
          monthlyTrends[month] = (monthlyTrends[month] || 0) + t.amount;
          cardWiseSpend[t.cardId] = (cardWiseSpend[t.cardId] || 0) + t.amount;
          totalSpend += t.amount;
        });
        var monthlyArray = Object.keys(monthlyTrends).map(function(month) {
          return { month: month, spend: monthlyTrends[month] };
        });
        return {
          categorySpend: categorySpend,
          monthlyTrends: monthlyArray,
          cardWiseSpend: cardWiseSpend,
          totalSpend: totalSpend
        };
      }
    }]);
})();