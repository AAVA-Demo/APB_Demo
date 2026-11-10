(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('MockDataService', ['$q', '$timeout', function($q, $timeout) {
      var mockCards = [
        {cardId: 'card1', cardNumber: '**** **** **** 1234', cardType: 'Visa', cardHolderName: 'John Doe', creditLimit: 10000, availableCredit: 7500, outstandingBalance: 2500, expiryDate: '12/25'},
        {cardId: 'card2', cardNumber: '**** **** **** 5678', cardType: 'Mastercard', cardHolderName: 'John Doe', creditLimit: 15000, availableCredit: 12000, outstandingBalance: 3000, expiryDate: '06/26'},
        {cardId: 'card3', cardNumber: '**** **** **** 9012', cardType: 'Amex', cardHolderName: 'John Doe', creditLimit: 20000, availableCredit: 18000, outstandingBalance: 2000, expiryDate: '09/27'},
        {cardId: 'card4', cardNumber: '**** **** **** 3456', cardType: 'Visa', cardHolderName: 'John Doe', creditLimit: 8000, availableCredit: 6500, outstandingBalance: 1500, expiryDate: '03/25'},
        {cardId: 'card5', cardNumber: '**** **** **** 7890', cardType: 'Mastercard', cardHolderName: 'John Doe', creditLimit: 12000, availableCredit: 10000, outstandingBalance: 2000, expiryDate: '11/26'}
      ];
      
      var mockTransactions = [
        {id: 'txn1', cardId: 'card1', amount: 45.50, category: 'Food & Dining', merchant: 'Restaurant ABC', date: new Date('2024-01-15'), description: 'Dinner'},
        {id: 'txn2', cardId: 'card1', amount: 80.00, category: 'Fuel', merchant: 'Gas Station XYZ', date: new Date('2024-01-18'), description: 'Fuel'},
        {id: 'txn3', cardId: 'card1', amount: 150.00, category: 'Shopping', merchant: 'Mall Store', date: new Date('2024-01-20'), description: 'Clothing'},
        {id: 'txn4', cardId: 'card2', amount: 500.00, category: 'Travel', merchant: 'Airline', date: new Date('2024-01-10'), description: 'Flight ticket'},
        {id: 'txn5', cardId: 'card2', amount: 60.00, category: 'Entertainment', merchant: 'Cinema', date: new Date('2024-01-22'), description: 'Movie tickets'},
        {id: 'txn6', cardId: 'card3', amount: 120.00, category: 'Utilities', merchant: 'Electric Company', date: new Date('2024-01-05'), description: 'Electricity bill'},
        {id: 'txn7', cardId: 'card3', amount: 200.00, category: 'Healthcare', merchant: 'Hospital', date: new Date('2024-01-12'), description: 'Medical checkup'},
        {id: 'txn8', cardId: 'card4', amount: 300.00, category: 'Education', merchant: 'Online Course', date: new Date('2024-01-08'), description: 'Course fee'},
        {id: 'txn9', cardId: 'card4', amount: 25.00, category: 'Miscellaneous', merchant: 'Convenience Store', date: new Date('2024-01-25'), description: 'Misc items'},
        {id: 'txn10', cardId: 'card5', amount: 90.00, category: 'Food & Dining', merchant: 'Cafe', date: new Date('2024-01-28'), description: 'Coffee & snacks'},
        {id: 'txn11', cardId: 'card1', amount: 55.00, category: 'Fuel', merchant: 'Gas Station ABC', date: new Date('2023-12-20'), description: 'Fuel'},
        {id: 'txn12', cardId: 'card2', amount: 180.00, category: 'Shopping', merchant: 'Electronics Store', date: new Date('2023-12-15'), description: 'Gadgets'},
        {id: 'txn13', cardId: 'card3', amount: 400.00, category: 'Travel', merchant: 'Hotel', date: new Date('2023-11-10'), description: 'Hotel booking'},
        {id: 'txn14', cardId: 'card1', amount: 70.00, category: 'Entertainment', merchant: 'Concert', date: new Date('2023-11-25'), description: 'Concert tickets'},
        {id: 'txn15', cardId: 'card2', amount: 110.00, category: 'Utilities', merchant: 'Water Company', date: new Date('2023-10-05'), description: 'Water bill'}
      ];
      
      this.getDashboardKPIs = function() {
        var deferred = $q.defer();
        $timeout(function() {
          var totalCreditLimit = mockCards.reduce(function(sum, card) { return sum + card.creditLimit; }, 0);
          var availableCredit = mockCards.reduce(function(sum, card) { return sum + card.availableCredit; }, 0);
          var outstandingAmount = mockCards.reduce(function(sum, card) { return sum + card.outstandingBalance; }, 0);
          var currentMonth = new Date().getMonth();
          var currentYear = new Date().getFullYear();
          var monthlySpend = mockTransactions
            .filter(function(txn) {
              var txnDate = new Date(txn.date);
              return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
            })
            .reduce(function(sum, txn) { return sum + txn.amount; }, 0);
          
          deferred.resolve({
            monthlySpend: monthlySpend,
            totalCreditLimit: totalCreditLimit,
            availableCredit: availableCredit,
            outstandingAmount: outstandingAmount,
            creditUtilization: (outstandingAmount / totalCreditLimit) * 100,
            cardCount: mockCards.length,
            lastUpdated: new Date()
          });
        }, 500);
        return deferred.promise;
      };
      
      this.getAllCards = function() {
        var deferred = $q.defer();
        $timeout(function() {
          deferred.resolve(angular.copy(mockCards));
        }, 300);
        return deferred.promise;
      };
      
      this.getCardDetails = function(cardId) {
        var deferred = $q.defer();
        $timeout(function() {
          var card = mockCards.find(function(c) { return c.cardId === cardId; });
          if (!card) {
            deferred.reject('Card not found');
            return;
          }
          var cardTransactions = mockTransactions.filter(function(txn) { return txn.cardId === cardId; });
          var categoryTotals = {};
          var totalSpend = 0;
          cardTransactions.forEach(function(txn) {
            categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + txn.amount;
            totalSpend += txn.amount;
          });
          var categoryBreakdown = [];
          for (var cat in categoryTotals) {
            categoryBreakdown.push({
              category: cat,
              total: categoryTotals[cat],
              percentage: ((categoryTotals[cat] / totalSpend) * 100).toFixed(1)
            });
          }
          deferred.resolve({
            card: angular.copy(card),
            transactions: angular.copy(cardTransactions),
            spendAnalysis: {
              categoryBreakdown: categoryBreakdown,
              totalSpend: totalSpend
            }
          });
        }, 400);
        return deferred.promise;
      };
      
      this.getTransactions = function(cardId, startDate, endDate) {
        var deferred = $q.defer();
        $timeout(function() {
          var filtered = mockTransactions.filter(function(txn) {
            var txnDate = new Date(txn.date);
            var matchesCard = cardId === 'all' || txn.cardId === cardId;
            var matchesDate = txnDate >= startDate && txnDate <= endDate;
            return matchesCard && matchesDate;
          });
          deferred.resolve(angular.copy(filtered));
        }, 600);
        return deferred.promise;
      };
    }]);
})();