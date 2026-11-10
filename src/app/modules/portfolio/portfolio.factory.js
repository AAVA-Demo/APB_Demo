(function() {
  'use strict';
  angular.module('creditCardPortfolioModule')
    .factory('CardManagementFactory', ['$q', function($q) {
      function Card(cardId, userId, cardNumber, creditLimit, outstandingBalance, cardType, issuer) {
        this.cardId = cardId;
        this.userId = userId;
        this.cardNumber = cardNumber;
        this.creditLimit = creditLimit;
        this.outstandingBalance = outstandingBalance;
        this.availableCredit = creditLimit - outstandingBalance;
        this.cardType = cardType;
        this.issuer = issuer;
      }
      var mockCards = [
        new Card('card1234', 'user123', '**** **** **** 1234', 20000, 5000, 'Visa', 'Bank A'),
        new Card('card5678', 'user123', '**** **** **** 5678', 15000, 3500, 'MasterCard', 'Bank B'),
        new Card('card9012', 'user123', '**** **** **** 9012', 15000, 4000, 'Visa', 'Bank C')
      ];
      return {
        getCardsByUserId: function(userId) {
          var userCards = mockCards.filter(function(card) {
            return card.userId === userId;
          });
          return $q.resolve(userCards);
        }
      };
    }]);
})();