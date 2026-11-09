(function() {
  'use strict';
  angular.module('app.common')
    .factory('MockDataService', MockDataService);
  MockDataService.$inject = [];
  function MockDataService() {
    var cards = [
      {
        cardId: 'card-001',
        maskedCardNumber: '**** **** **** 1234',
        cardHolderName: 'John Doe',
        creditLimit: 50000,
        outstandingBalance: 12500,
        availableCredit: 37500,
        issuer: 'HDFC Bank',
        expiryDate: '12/2026'
      },
      {
        cardId: 'card-002',
        maskedCardNumber: '**** **** **** 5678',
        cardHolderName: 'John Doe',
        creditLimit: 100000,
        outstandingBalance: 25000,
        availableCredit: 75000,
        issuer: 'ICICI Bank',
        expiryDate: '06/2027'
      },
      {
        cardId: 'card-003',
        maskedCardNumber: '**** **** **** 9012',
        cardHolderName: 'John Doe',
        creditLimit: 75000,
        outstandingBalance: 18000,
        availableCredit: 57000,
        issuer: 'SBI Card',
        expiryDate: '03/2028'
      }
    ];
    var transactions = [
      {transactionId: 't001', cardId: 'card-001', amount: 1200, category: 'Food & Dining', merchantName: 'Restaurant ABC', transactionDate: new Date('2024-11-15'), description: 'Dinner'},
      {transactionId: 't002', cardId: 'card-001', amount: 3500, category: 'Fuel', merchantName: 'Petrol Pump XYZ', transactionDate: new Date('2024-11-10'), description: 'Fuel'},
      {transactionId: 't003', cardId: 'card-002', amount: 8000, category: 'Shopping', merchantName: 'Mall Store', transactionDate: new Date('2024-11-05'), description: 'Clothing'},
      {transactionId: 't004', cardId: 'card-002', amount: 15000, category: 'Travel', merchantName: 'Airlines', transactionDate: new Date('2024-10-20'), description: 'Flight Tickets'},
      {transactionId: 't005', cardId: 'card-003', amount: 2500, category: 'Entertainment', merchantName: 'Cinema', transactionDate: new Date('2024-11-12'), description: 'Movie'},
      {transactionId: 't006', cardId: 'card-001', amount: 1800, category: 'Utilities', merchantName: 'Electric Company', transactionDate: new Date('2024-10-30'), description: 'Bill Payment'},
      {transactionId: 't007', cardId: 'card-002', amount: 4500, category: 'Healthcare', merchantName: 'Hospital', transactionDate: new Date('2024-10-15'), description: 'Medical'},
      {transactionId: 't008', cardId: 'card-003', amount: 6000, category: 'Education', merchantName: 'Online Course', transactionDate: new Date('2024-09-25'), description: 'Course Fee'},
      {transactionId: 't009', cardId: 'card-001', amount: 900, category: 'Miscellaneous', merchantName: 'Store', transactionDate: new Date('2024-11-08'), description: 'General'},
      {transactionId: 't010', cardId: 'card-002', amount: 2200, category: 'Food & Dining', merchantName: 'Cafe', transactionDate: new Date('2024-10-28'), description: 'Breakfast'},
      {transactionId: 't011', cardId: 'card-003', amount: 3200, category: 'Fuel', merchantName: 'Gas Station', transactionDate: new Date('2024-10-18'), description: 'Fuel'},
      {transactionId: 't012', cardId: 'card-001', amount: 5500, category: 'Shopping', merchantName: 'Electronics Store', transactionDate: new Date('2024-09-30'), description: 'Gadgets'},
      {transactionId: 't013', cardId: 'card-002', amount: 1200, category: 'Entertainment', merchantName: 'Concert', transactionDate: new Date('2024-09-15'), description: 'Tickets'},
      {transactionId: 't014', cardId: 'card-003', amount: 2800, category: 'Utilities', merchantName: 'Water Supply', transactionDate: new Date('2024-09-10'), description: 'Bill'},
      {transactionId: 't015', cardId: 'card-001', amount: 7500, category: 'Travel', merchantName: 'Hotel', transactionDate: new Date('2024-08-20'), description: 'Accommodation'}
    ];
    function getMonthlyTrends() {
      var trends = {};
      transactions.forEach(function(t) {
        var month = t.transactionDate.getFullYear() + '-' + String(t.transactionDate.getMonth() + 1).padStart(2, '0');
        trends[month] = (trends[month] || 0) + t.amount;
      });
      var result = [];
      Object.keys(trends).sort().slice(-12).forEach(function(m) {
        result.push({month: m, totalSpend: trends[m]});
      });
      return result;
    }
    function getCategoryBreakdown() {
      var categories = {};
      transactions.forEach(function(t) {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
      var result = [];
      Object.keys(categories).forEach(function(c) {
        result.push({category: c, amount: parseFloat(categories[c].toFixed(2))});
      });
      return result;
    }
    function getCardSpendAnalysis(cardId) {
      var cardTransactions = transactions.filter(function(t) { return t.cardId === cardId; });
      var monthlySpend = cardTransactions.reduce(function(sum, t) { return sum + t.amount; }, 0);
      var categoryBreakdown = {};
      cardTransactions.forEach(function(t) {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
      });
      var breakdown = [];
      Object.keys(categoryBreakdown).forEach(function(c) {
        breakdown.push({category: c, amount: parseFloat(categoryBreakdown[c].toFixed(2))});
      });
      return {cardId: cardId, monthlySpend: parseFloat(monthlySpend.toFixed(2)), categoryBreakdown: breakdown};
    }
    return {
      getCards: function() {
        return angular.copy(cards);
      },
      getCardById: function(cardId) {
        return angular.copy(cards.find(function(c) { return c.cardId === cardId; }));
      },
      getTransactions: function() {
        return angular.copy(transactions);
      },
      getMonthlyTrends: getMonthlyTrends,
      getCategoryBreakdown: getCategoryBreakdown,
      getCardSpendAnalysis: getCardSpendAnalysis,
      getAggregatedMetrics: function() {
        var totalCreditLimit = cards.reduce(function(sum, c) { return sum + c.creditLimit; }, 0);
        var totalOutstanding = cards.reduce(function(sum, c) { return sum + c.outstandingBalance; }, 0);
        var totalAvailable = cards.reduce(function(sum, c) { return sum + c.availableCredit; }, 0);
        var monthlySpend = transactions.filter(function(t) {
          var now = new Date();
          var tDate = new Date(t.transactionDate);
          return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        }).reduce(function(sum, t) { return sum + t.amount; }, 0);
        return {
          userId: 'user-001',
          monthlySpend: parseFloat(monthlySpend.toFixed(2)),
          totalCreditLimit: totalCreditLimit,
          availableCredit: totalAvailable,
          outstandingAmount: totalOutstanding,
          lastUpdated: new Date()
        };
      }
    };
  }
})();