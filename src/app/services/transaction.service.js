(function() {
  'use strict';
  angular.module('creditCardApp').service('TransactionService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
    var self = this;
    var mockTransactions = [
      {transactionId: 't1', cardId: 'c1', amount: 1250, date: new Date('2026-11-05'), merchant: 'Grocery Store', category: 'Food & Dining', description: 'Weekly groceries'},
      {transactionId: 't2', cardId: 'c1', amount: 3500, date: new Date('2026-11-08'), merchant: 'Gas Station', category: 'Fuel', description: 'Fuel refill'},
      {transactionId: 't3', cardId: 'c2', amount: 8900, date: new Date('2026-11-10'), merchant: 'Amazon', category: 'Shopping', description: 'Electronics'},
      {transactionId: 't4', cardId: 'c1', amount: 15000, date: new Date('2026-10-15'), merchant: 'Airlines', category: 'Travel', description: 'Flight tickets'},
      {transactionId: 't5', cardId: 'c3', amount: 2200, date: new Date('2026-11-12'), merchant: 'Cinema', category: 'Entertainment', description: 'Movie tickets'},
      {transactionId: 't6', cardId: 'c2', amount: 4500, date: new Date('2026-10-20'), merchant: 'Electric Company', category: 'Utilities', description: 'Electricity bill'},
      {transactionId: 't7', cardId: 'c1', amount: 6800, date: new Date('2026-11-14'), merchant: 'Hospital', category: 'Healthcare', description: 'Medical checkup'},
      {transactionId: 't8', cardId: 'c3', amount: 12000, date: new Date('2026-10-25'), merchant: 'University', category: 'Education', description: 'Course fees'},
      {transactionId: 't9', cardId: 'c2', amount: 1800, date: new Date('2026-11-16'), merchant: 'Coffee Shop', category: 'Food & Dining', description: 'Coffee and snacks'},
      {transactionId: 't10', cardId: 'c1', amount: 950, date: new Date('2026-09-10'), merchant: 'Bookstore', category: 'Miscellaneous', description: 'Books'},
      {transactionId: 't11', cardId: 'c2', amount: 5600, date: new Date('2026-09-18'), merchant: 'Restaurant', category: 'Food & Dining', description: 'Dinner'},
      {transactionId: 't12', cardId: 'c3', amount: 2800, date: new Date('2026-09-22'), merchant: 'Mall', category: 'Shopping', description: 'Clothing'},
      {transactionId: 't13', cardId: 'c1', amount: 7200, date: new Date('2026-10-05'), merchant: 'Hotel', category: 'Travel', description: 'Hotel stay'},
      {transactionId: 't14', cardId: 'c2', amount: 1500, date: new Date('2026-10-12'), merchant: 'Pharmacy', category: 'Healthcare', description: 'Medicines'},
      {transactionId: 't15', cardId: 'c3', amount: 3200, date: new Date('2026-11-18'), merchant: 'Gas Station', category: 'Fuel', description: 'Fuel refill'}
    ];
    self.getMonthlySpend = function() {
      var deferred = $q.defer();
      setTimeout(function() {
        var currentMonth = new Date().getMonth();
        var currentYear = new Date().getFullYear();
        var monthlyTotal = mockTransactions.filter(function(t) {
          var tDate = new Date(t.date);
          return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
        }).reduce(function(sum, t) { return sum + t.amount; }, 0);
        deferred.resolve(monthlyTotal);
      }, 300);
      return deferred.promise;
    };
    self.getCardSpending = function(cardId) {
      var deferred = $q.defer();
      setTimeout(function() {
        var cardTransactions = mockTransactions.filter(function(t) { return t.cardId === cardId; });
        var monthlySpend = cardTransactions.reduce(function(sum, t) { return sum + t.amount; }, 0);
        var categoryBreakdown = {};
        cardTransactions.forEach(function(t) {
          categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
        });
        var breakdown = Object.keys(categoryBreakdown).map(function(cat) {
          return {category: cat, amount: categoryBreakdown[cat]};
        });
        deferred.resolve({
          cardId: cardId,
          monthlySpend: monthlySpend,
          categoryBreakdown: breakdown,
          transactionCount: cardTransactions.length
        });
      }, 200);
      return deferred.promise;
    };
    self.getTransactions = function(dateRange) {
      var deferred = $q.defer();
      setTimeout(function() {
        var filtered = mockTransactions;
        if (dateRange && dateRange.start && dateRange.end) {
          filtered = mockTransactions.filter(function(t) {
            var tDate = new Date(t.date);
            return tDate >= dateRange.start && tDate <= dateRange.end;
          });
        }
        deferred.resolve(filtered);
      }, 400);
      return deferred.promise;
    };
  }]);
})();