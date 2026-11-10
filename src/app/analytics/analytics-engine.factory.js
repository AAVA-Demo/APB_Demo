(function() {
  'use strict';
  angular.module('analyticsModule').factory('AnalyticsEngineFactory', AnalyticsEngineFactory);
  AnalyticsEngineFactory.$inject = ['$http', 'API_ENDPOINTS', '$q'];
  function AnalyticsEngineFactory($http, API_ENDPOINTS, $q) {
    return {
      processAnalytics: processAnalytics
    };
    function processAnalytics(transactions) {
      return $http.post(API_ENDPOINTS.analytics, { transactions: transactions }).then(function(response) {
        return response.data;
      }).catch(function() {
        return processLocally(transactions);
      });
    }
    function processLocally(transactions) {
      var categorySpending = {};
      var monthlyTrends = {};
      var cardWiseSpending = {};
      transactions.forEach(function(t) {
        if (!categorySpending[t.category]) {
          categorySpending[t.category] = { category: t.category, amount: 0, transactionCount: 0 };
        }
        categorySpending[t.category].amount += t.amount;
        categorySpending[t.category].transactionCount++;
        var monthKey = new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        if (!monthlyTrends[monthKey]) {
          monthlyTrends[monthKey] = { month: monthKey, totalSpend: 0, categoryBreakdown: {} };
        }
        monthlyTrends[monthKey].totalSpend += t.amount;
        if (!monthlyTrends[monthKey].categoryBreakdown[t.category]) {
          monthlyTrends[monthKey].categoryBreakdown[t.category] = { category: t.category, amount: 0 };
        }
        monthlyTrends[monthKey].categoryBreakdown[t.category].amount += t.amount;
        if (!cardWiseSpending[t.cardId]) {
          cardWiseSpending[t.cardId] = { cardId: t.cardId, cardName: t.cardName, totalSpend: 0, categoryBreakdown: {} };
        }
        cardWiseSpending[t.cardId].totalSpend += t.amount;
        if (!cardWiseSpending[t.cardId].categoryBreakdown[t.category]) {
          cardWiseSpending[t.cardId].categoryBreakdown[t.category] = { category: t.category, amount: 0 };
        }
        cardWiseSpending[t.cardId].categoryBreakdown[t.category].amount += t.amount;
      });
      var totalAmount = Object.values(categorySpending).reduce(function(sum, c) { return sum + c.amount; }, 0);
      Object.values(categorySpending).forEach(function(c) {
        c.percentage = (c.amount / totalAmount * 100).toFixed(2);
      });
      return {
        categorySpending: Object.values(categorySpending),
        monthlyTrends: Object.values(monthlyTrends).map(function(m) {
          m.categoryBreakdown = Object.values(m.categoryBreakdown);
          return m;
        }),
        cardWiseSpending: Object.values(cardWiseSpending).map(function(c) {
          c.categoryBreakdown = Object.values(c.categoryBreakdown);
          return c;
        })
      };
    }
  }
})();