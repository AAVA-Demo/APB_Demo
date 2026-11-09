(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .service('CreditCardDataService', ['$http', '$q', 'AuthFactory', 'LocalStorageService', function($http, $q, AuthFactory, LocalStorageService) {
      this.fetchKpiData = function() {
        var deferred = $q.defer();
        var userId = LocalStorageService.get('userId') || 'user123';
        var mockData = {
          userId: userId,
          cards: [
            { cardId: 'card1', cardNumber: '**** 1234', cardType: 'Visa', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, isActive: true },
            { cardId: 'card2', cardNumber: '**** 5678', cardType: 'MasterCard', creditLimit: 30000, availableCredit: 20000, outstandingAmount: 10000, isActive: true },
            { cardId: 'card3', cardNumber: '**** 9012', cardType: 'Amex', creditLimit: 70000, availableCredit: 50000, outstandingAmount: 20000, isActive: true }
          ],
          transactions: [
            { transactionId: 'txn1', cardId: 'card1', amount: 2500, category: 'Food & Dining', merchantName: 'Restaurant ABC', transactionDate: new Date().toISOString() },
            { transactionId: 'txn2', cardId: 'card1', amount: 1500, category: 'Fuel', merchantName: 'Gas Station XYZ', transactionDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() },
            { transactionId: 'txn3', cardId: 'card2', amount: 5000, category: 'Shopping', merchantName: 'Mall Store', transactionDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString() }
          ]
        };
        setTimeout(function() {
          deferred.resolve(mockData);
        }, 500);
        return deferred.promise;
      };
    }]);
})();