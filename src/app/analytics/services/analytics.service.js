(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .service('AnalyticsService', ['$q', '$cacheFactory', 'TransactionDataService', 'CategoryMapper', function($q, $cacheFactory, TransactionDataService, CategoryMapper) {
      const cache = $cacheFactory('analyticsCache');
      const CACHE_TTL = 300000;
      this.getSpendingAnalytics = function(userId, dateRange) {
        const cacheKey = 'analytics_' + userId + '_' + (dateRange ? dateRange.startDate + '_' + dateRange.endDate : 'default');
        const cached = cache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
          return $q.resolve(cached.data);
        }
        const range = dateRange || getDefaultDateRange();
        return TransactionDataService.getTransactions(userId, range).then(function(transactions) {
          const categorizedData = CategoryMapper.categorizeTransactions(transactions);
          const analytics = aggregateAnalytics(userId, categorizedData, range);
          cache.put(cacheKey, { data: analytics, timestamp: Date.now() });
          return analytics;
        });
      };
      function getDefaultDateRange() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 12);
        return { startDate: startDate, endDate: endDate };
      }
      function aggregateAnalytics(userId, categorizedData, dateRange) {
        const categoryBreakdown = [];
        const categoryTotals = {};
        let totalSpend = 0;
        categorizedData.forEach(function(txn) {
          const cat = txn.category;
          categoryTotals[cat] = (categoryTotals[cat] || 0) + txn.amount;
          totalSpend += txn.amount;
        });
        Object.keys(categoryTotals).forEach(function(cat) {
          categoryBreakdown.push({
            category: cat,
            amount: categoryTotals[cat],
            percentage: ((categoryTotals[cat] / totalSpend) * 100).toFixed(1),
            transactionCount: categorizedData.filter(function(t) { return t.category === cat; }).length
          });
        });
        const monthlyTrends = calculateMonthlyTrends(categorizedData);
        const cardWiseAnalysis = calculateCardWiseAnalysis(categorizedData);
        return {
          userId: userId,
          dateRange: dateRange,
          categoryBreakdown: categoryBreakdown,
          monthlyTrends: monthlyTrends,
          cardWiseAnalysis: cardWiseAnalysis,
          totalSpend: totalSpend,
          averageMonthlySpend: totalSpend / 12
        };
      }
      function calculateMonthlyTrends(transactions) {
        const monthlyData = {};
        transactions.forEach(function(txn) {
          const monthKey = new Date(txn.date).toISOString().substring(0, 7);
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { totalSpend: 0, categoryData: {} };
          }
          monthlyData[monthKey].totalSpend += txn.amount;
          monthlyData[monthKey].categoryData[txn.category] = (monthlyData[monthKey].categoryData[txn.category] || 0) + txn.amount;
        });
        const trends = [];
        Object.keys(monthlyData).sort().forEach(function(month) {
          trends.push({
            month: month,
            totalSpend: monthlyData[month].totalSpend,
            categoryData: monthlyData[month].categoryData
          });
        });
        return trends;
      }
      function calculateCardWiseAnalysis(transactions) {
        const cardData = {};
        transactions.forEach(function(txn) {
          if (!cardData[txn.cardId]) {
            cardData[txn.cardId] = {
              cardId: txn.cardId,
              cardName: txn.cardName || 'Unknown Card',
              totalSpend: 0,
              categories: {}
            };
          }
          cardData[txn.cardId].totalSpend += txn.amount;
          cardData[txn.cardId].categories[txn.category] = (cardData[txn.cardId].categories[txn.category] || 0) + txn.amount;
        });
        const analysis = [];
        Object.keys(cardData).forEach(function(cardId) {
          const card = cardData[cardId];
          const topCategories = Object.keys(card.categories)
            .map(function(cat) { return { category: cat, amount: card.categories[cat] }; })
            .sort(function(a, b) { return b.amount - a.amount; })
            .slice(0, 3);
          analysis.push({
            cardId: card.cardId,
            cardName: card.cardName,
            totalSpend: card.totalSpend,
            topCategories: topCategories
          });
        });
        return analysis;
      }
    }]);
})();