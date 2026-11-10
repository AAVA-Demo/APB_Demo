(function() {
  'use strict';
  angular.module('creditCard.trends')
    .service('CardwiseAnalyticsService', [function() {
      this.analyzeByCard = function(transactions) {
        const cardMap = {};
        transactions.forEach(function(t) {
          if (!cardMap[t.cardId]) {
            cardMap[t.cardId] = {
              cardId: t.cardId,
              cardName: t.cardName || 'Card ' + t.cardId,
              totalSpend: 0,
              transactionCount: 0,
              monthlyBreakdown: {}
            };
          }
          cardMap[t.cardId].totalSpend += t.amount;
          cardMap[t.cardId].transactionCount++;
          const date = new Date(t.transactionDate);
          const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
          if (!cardMap[t.cardId].monthlyBreakdown[monthKey]) {
            cardMap[t.cardId].monthlyBreakdown[monthKey] = { month: monthKey, totalSpend: 0, transactionCount: 0 };
          }
          cardMap[t.cardId].monthlyBreakdown[monthKey].totalSpend += t.amount;
          cardMap[t.cardId].monthlyBreakdown[monthKey].transactionCount++;
        });
        return Object.values(cardMap).map(function(c) {
          c.monthlyBreakdown = Object.values(c.monthlyBreakdown).sort(function(a, b) {
            return a.month.localeCompare(b.month);
          });
          return c;
        });
      };
    }]);
})();