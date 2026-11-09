(function(window) {
  'use strict';
  class CategoryEngine {
    categorizeAndAggregate(transactions) {
      var categorySpends = this.aggregateByCategory(transactions);
      var monthlyTrends = this.aggregateByMonth(transactions);
      var cardSpends = this.aggregateByCard(transactions);
      return {
        categorySpends: categorySpends,
        monthlyTrends: monthlyTrends,
        cardSpends: cardSpends
      };
    }
    aggregateByCategory(transactions) {
      var categoryMap = {};
      transactions.forEach(function(t) {
        var cat = t.category || 'Miscellaneous';
        if (!categoryMap[cat]) {
          categoryMap[cat] = {category: cat, totalAmount: 0, transactionCount: 0};
        }
        categoryMap[cat].totalAmount += t.amount;
        categoryMap[cat].transactionCount += 1;
      });
      return Object.values(categoryMap);
    }
    aggregateByMonth(transactions) {
      var monthMap = {};
      transactions.forEach(function(t) {
        var date = new Date(t.date);
        var monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
        if (!monthMap[monthKey]) {
          monthMap[monthKey] = {month: monthKey, totalAmount: 0, categoryBreakdown: []};
        }
        monthMap[monthKey].totalAmount += t.amount;
      });
      return Object.values(monthMap).sort(function(a, b) {
        return a.month.localeCompare(b.month);
      });
    }
    aggregateByCard(transactions) {
      var cardMap = {};
      transactions.forEach(function(t) {
        var cardId = t.cardId;
        if (!cardMap[cardId]) {
          cardMap[cardId] = {cardId: cardId, cardName: cardId, totalSpend: 0, categoryBreakdown: []};
        }
        cardMap[cardId].totalSpend += t.amount;
      });
      return Object.values(cardMap);
    }
  }
  window.CategoryEngine = CategoryEngine;
})(window);