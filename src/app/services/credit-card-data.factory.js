(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardDataFactory', ['$http', '$q', '$interval', function($http, $q, $interval) {
      const mockCardData = [
        { cardId: 'CC001', cardNumber: '**** **** **** 1234', cardType: 'Visa', balance: 2500, creditLimit: 10000, currentMonthSpend: 1800 },
        { cardId: 'CC002', cardNumber: '**** **** **** 5678', cardType: 'Mastercard', balance: 1200, creditLimit: 8000, currentMonthSpend: 950 },
        { cardId: 'CC003', cardNumber: '**** **** **** 9012', cardType: 'Amex', balance: 3500, creditLimit: 15000, currentMonthSpend: 2300 }
      ];
      return {
        getCardData: function() {
          return $q.resolve(mockCardData);
        },
        fetchCards: function() {
          return $q.resolve(mockCardData.map(c => ({
            cardId: c.cardId,
            cardNumber: c.cardNumber,
            cardType: c.cardType,
            creditLimit: c.creditLimit,
            availableCredit: c.creditLimit - c.balance,
            outstandingAmount: c.balance,
            monthlySpend: c.currentMonthSpend
          })));
        },
        fetchTransactions: function(cardId) {
          const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];
          return $q.resolve(months.map(m => ({ month: m, totalSpend: Math.floor(Math.random() * 3000) + 500, transactionCount: Math.floor(Math.random() * 50) + 10 })));
        }
      };
    }]);
})();