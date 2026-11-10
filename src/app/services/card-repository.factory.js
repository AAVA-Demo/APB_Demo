(function() {
  'use strict';
  angular.module('cardManagement')
    .factory('CardRepositoryFactory', ['$http', '$q', function($http, $q) {
      return {
        getUserCards: function(userId) {
          var mockCards = [
            {cardId: 'c1', userId: userId, cardNumber: '**** **** **** 1234', cardType: 'Visa', issuer: 'Chase', creditLimit: 10000, currentBalance: 3500, availableCredit: 6500, outstandingAmount: 3500, expiryDate: '12/2026', status: 'active'},
            {cardId: 'c2', userId: userId, cardNumber: '**** **** **** 5678', cardType: 'MasterCard', issuer: 'Citi', creditLimit: 15000, currentBalance: 5000, availableCredit: 10000, outstandingAmount: 5000, expiryDate: '08/2025', status: 'active'},
            {cardId: 'c3', userId: userId, cardNumber: '**** **** **** 9012', cardType: 'American Express', issuer: 'Amex', creditLimit: 20000, currentBalance: 7500, availableCredit: 12500, outstandingAmount: 7500, expiryDate: '03/2027', status: 'active'}
          ];
          return $q.resolve(mockCards);
        }
      };
    }]);
})();