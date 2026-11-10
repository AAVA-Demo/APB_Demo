(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('aggregationService', ['$q', 'transactionService', 'categorizationService', function($q, transactionService, categorizationService) {
      var CATEGORIES = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      return {
        getSpendingAnalytics: function() {
          return transactionService.getTransactions().then(function(result) {
            var transactions = categorizationService.categorizeTransactions(result.data);
            var categoryData = CATEGORIES.map(function(cat) {
              var catTxns = transactions.filter(function(t) { return t.category === cat; });
              var total = catTxns.reduce(function(sum, t) { return sum + t.amount; }, 0);
              return {category: cat, totalAmount: total, transactionCount: catTxns.length, percentage: 0};
            });
            var grandTotal = categoryData.reduce(function(sum, c) { return sum + c.totalAmount; }, 0);
            categoryData.forEach(function(c) { c.percentage = grandTotal > 0 ? (c.totalAmount / grandTotal * 100).toFixed(2) : 0; });
            var monthlyMap = {};
            transactions.forEach(function(t) {
              var monthKey = t.date.getFullYear() + '-' + String(t.date.getMonth() + 1).padStart(2, '0');
              if (!monthlyMap[monthKey]) monthlyMap[monthKey] = [];
              monthlyMap[monthKey].push(t);
            });
            var monthlyTrends = Object.keys(monthlyMap).sort().map(function(month) {
              var txns = monthlyMap[month];
              var total = txns.reduce(function(sum, t) { return sum + t.amount; }, 0);
              var breakdown = CATEGORIES.map(function(cat) {
                var catTotal = txns.filter(function(t) { return t.category === cat; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
                return {category: cat, totalAmount: catTotal};
              });
              return {month: month, totalSpend: total, categoryBreakdown: breakdown};
            });
            var cardMap = {};
            transactions.forEach(function(t) {
              if (!cardMap[t.cardId]) cardMap[t.cardId] = {cardId: t.cardId, cardName: t.cardName, transactions: []};
              cardMap[t.cardId].transactions.push(t);
            });
            var cardWiseData = Object.keys(cardMap).map(function(cardId) {
              var card = cardMap[cardId];
              var total = card.transactions.reduce(function(sum, t) { return sum + t.amount; }, 0);
              var breakdown = CATEGORIES.map(function(cat) {
                var catTotal = card.transactions.filter(function(t) { return t.category === cat; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
                return {category: cat, totalAmount: catTotal};
              });
              return {cardId: card.cardId, cardName: card.cardName, totalSpend: total, categoryBreakdown: breakdown};
            });
            return {categoryData: categoryData, monthlyTrends: monthlyTrends, cardWiseData: cardWiseData};
          });
        }
      };
    }]);