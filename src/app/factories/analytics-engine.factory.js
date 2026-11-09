(function() {
  'use strict';
  angular.module('creditCardApp').factory('AnalyticsEngine', [function() {
    return {
      analyze: function(transactions) {
        const categoryWiseSpend = {};
        const cardWiseSpend = {};
        const monthlyTrend = {};
        let totalSpend = 0;
        transactions.forEach(t => {
          categoryWiseSpend[t.category] = (categoryWiseSpend[t.category] || 0) + t.amount;
          cardWiseSpend[t.cardId] = (cardWiseSpend[t.cardId] || 0) + t.amount;
          const month = new Date(t.timestamp).toLocaleString('default', {month: 'short', year: 'numeric'});
          monthlyTrend[month] = (monthlyTrend[month] || 0) + t.amount;
          totalSpend += t.amount;
        });
        const monthlyTrendArray = Object.keys(monthlyTrend).map(m => ({month: m, amount: monthlyTrend[m]}));
        return {
          categoryWiseSpend: categoryWiseSpend,
          monthlyTrend: monthlyTrendArray,
          cardWiseSpend: cardWiseSpend,
          totalSpend: totalSpend
        };
      }
    };
  }]);
})();