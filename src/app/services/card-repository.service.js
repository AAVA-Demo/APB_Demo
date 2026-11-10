(function() {
  'use strict';
  angular.module('creditCardApp').service('CardRepositoryService', ['$http', '$q', function($http, $q) {
    var service = this;
    var mockCards = [
      {cardId: 'c1', userId: 'user123', cardNumber: '****1234', cardHolderName: 'John Doe', cardType: 'Visa', issuer: 'Bank A', creditLimit: 10000, outstandingBalance: 2500, availableCredit: 7500, expiryDate: '12/25'},
      {cardId: 'c2', userId: 'user123', cardNumber: '****5678', cardHolderName: 'John Doe', cardType: 'MasterCard', issuer: 'Bank B', creditLimit: 15000, outstandingBalance: 5000, availableCredit: 10000, expiryDate: '06/26'}
    ];

    service.getUserCards = function(userId) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          var filtered = mockCards.filter(function(c) { return c.userId === userId; });
          resolve(filtered);
        }, 500);
      });
    };

    service.addCard = function(card) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          card.cardId = 'c' + (mockCards.length + 1);
          card.cardNumber = '****' + card.cardNumber.slice(-4);
          card.outstandingBalance = 0;
          card.availableCredit = card.creditLimit;
          mockCards.push(card);
          resolve(card);
        }, 500);
      });
    };
  }]);
})();